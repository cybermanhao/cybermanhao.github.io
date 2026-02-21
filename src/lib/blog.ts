import type { ImageMetadata } from 'astro';

/** Language flag emoji mapping */
export const LANG_FLAGS: Record<string, string> = {
  zh: '🇨🇳',
  en: '🇬🇧',
  ja: '🇯🇵',
  es: '🇪🇸',
};

/** Find related translations for a post */
export function getTranslations(
  currentSlug: string,
  currentTranslationOf: string | undefined,
  allPosts: Array<{ slug: string; data: { lang?: string; translationOf?: string } }>
): Array<{ slug: string; lang: string }> {
  const originSlug = currentTranslationOf || currentSlug;
  return allPosts
    .filter((p) => {
      const pOrigin = p.data.translationOf || p.slug;
      return pOrigin === originSlug && p.slug !== currentSlug;
    })
    .map((p) => ({ slug: p.slug, lang: p.data.lang || 'zh' }));
}

/** Extract slug from post.id (handles subdirectory structure) */
export function getPostSlug(id: string): string {
  return id.replace(/\/index\.(mdx?|md)$/, '').replace(/\.(mdx?|md)$/, '');
}

// In-memory cache for waifu URLs (survives across pages in same build/dev session)
const waifuCache: string[] = [];
let waifuBatchFetched = false;

/** Pre-fetch a batch of waifu URLs to avoid per-post sequential requests */
async function ensureWaifuBatch(count: number): Promise<void> {
  if (waifuBatchFetched && waifuCache.length >= count) return;
  try {
    // Fetch in parallel
    const results = await Promise.all(
      Array.from({ length: count }, () =>
        fetch('https://api.waifu.pics/sfw/waifu')
          .then((r) => r.json())
          .then((d) => d.url as string)
          .catch(() => undefined)
      )
    );
    for (const url of results) {
      if (url) waifuCache.push(url);
    }
    waifuBatchFetched = true;
  } catch {
    waifuBatchFetched = true;
  }
}

/** Get a cached waifu URL (round-robin from batch) */
function getWaifuFromCache(): string | undefined {
  if (waifuCache.length === 0) return undefined;
  // Rotate: take from front, push to back
  const url = waifuCache.shift()!;
  waifuCache.push(url);
  return url;
}

/** Pre-fetch waifu batch for N uncovered posts. Call once before resolvePostCover. */
export async function prefetchWaifuBatch(uncoveredCount: number): Promise<void> {
  if (uncoveredCount > 0) {
    await ensureWaifuBatch(uncoveredCount);
  }
}

/** Resolve post cover: return local ImageMetadata as-is, or use cached waifu fallback */
export async function resolvePostCover(
  cover: ImageMetadata | undefined
): Promise<ImageMetadata | string | undefined> {
  if (cover) return cover;
  return getWaifuFromCache();
}
