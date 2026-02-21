export const LOCALES = ['zh', 'en', 'ja', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'zh';

export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'EN',
  ja: '日本語',
  es: 'ES',
};

export const t: Record<string, Record<Locale, string>> = {
  // Nav
  'nav.home': { zh: '首页', en: 'Home', ja: 'ホーム', es: 'Inicio' },
  'nav.blog': { zh: '博客', en: 'Blog', ja: 'ブログ', es: 'Blog' },
  'nav.projects': { zh: '项目', en: 'Projects', ja: 'プロジェクト', es: 'Proyectos' },
  'nav.about': { zh: '关于', en: 'About', ja: '概要', es: 'Acerca' },
  'nav.search': { zh: '搜索', en: 'Search', ja: '検索', es: 'Buscar' },
  'nav.light': { zh: '亮色', en: 'Light', ja: 'ライト', es: 'Claro' },
  'nav.dark': { zh: '暗色', en: 'Dark', ja: 'ダーク', es: 'Oscuro' },

  // Home
  'home.recentPosts': { zh: '最新文章', en: 'Recent Posts', ja: '最新記事', es: 'Últimos artículos' },
  'home.noPosts': { zh: '暂无文章，敬请期待！', en: 'No posts yet, stay tuned!', ja: 'まだ記事がありません、お楽しみに！', es: '¡Aún no hay artículos, estén atentos!' },
  'home.viewAll': { zh: '查看全部文章', en: 'View all posts', ja: 'すべての記事を見る', es: 'Ver todos los artículos' },

  // Blog
  'blog.title': { zh: '博客文章', en: 'Blog Posts', ja: 'ブログ記事', es: 'Artículos' },
  'blog.all': { zh: '全部', en: 'All', ja: 'すべて', es: 'Todos' },
  'blog.expand': { zh: '展开', en: 'Expand', ja: '展開', es: 'Expandir' },
  'blog.collapse': { zh: '收起', en: 'Collapse', ja: '折りたたむ', es: 'Colapsar' },
  'blog.noResults': { zh: '没有找到相关文章', en: 'No matching posts found', ja: '関連記事が見つかりません', es: 'No se encontraron artículos' },
  'blog.otherLangs': { zh: '其他语言版本：', en: 'Other languages:', ja: '他の言語：', es: 'Otros idiomas:' },

  // Projects
  'projects.title': { zh: '项目展示', en: 'Projects', ja: 'プロジェクト', es: 'Proyectos' },
  'projects.subtitle': { zh: '一些值得分享的项目和作品。', en: 'Some projects and works worth sharing.', ja: '共有する価値のあるプロジェクト。', es: 'Algunos proyectos que vale la pena compartir.' },

  // Coming soon
  'comingSoon.title': { zh: '施工中', en: 'Under Construction', ja: '工事中', es: 'En construcción' },
  'comingSoon.text': { zh: '这个项目正在紧锣密鼓地开发中，敬请期待！', en: 'This project is under active development, stay tuned!', ja: 'このプロジェクトは鋭意開発中です、お楽しみに！', es: '¡Este proyecto está en desarrollo activo, estén atentos!' },
  'comingSoon.back': { zh: '返回项目', en: 'Back to Projects', ja: 'プロジェクトに戻る', es: 'Volver a proyectos' },

  // About
  'about.contact': { zh: '联系方式', en: 'Contact', ja: '連絡先', es: 'Contacto' },
  'about.resume': { zh: '简历下载', en: 'Resume', ja: '履歴書', es: 'Currículum' },
  'about.techStack': { zh: '技术栈', en: 'Tech Stack', ja: '技術スタック', es: 'Stack técnico' },

  // 404
  '404.text': { zh: '你试图访问的页面不存在，或已被移至其他位置。', en: 'The page you are looking for does not exist or has been moved.', ja: 'アクセスしようとしたページは存在しないか、移動されました。', es: 'La página que buscas no existe o ha sido movida.' },
  '404.back': { zh: '返回首页', en: 'Back to Home', ja: 'ホームに戻る', es: 'Volver al inicio' },

  // Search
  'search.placeholder': { zh: '搜索文章...', en: 'Search posts...', ja: '記事を検索...', es: 'Buscar artículos...' },
  'search.label': { zh: '搜索', en: 'Search', ja: '検索', es: 'Buscar' },
  'search.noResults': { zh: '未找到匹配的文章', en: 'No matching posts found', ja: '一致する記事が見つかりません', es: 'No se encontraron artículos' },
  'search.needBuild': { zh: '搜索功能需要先构建站点 (pnpm build)', en: 'Search requires a site build first (pnpm build)', ja: '検索機能にはビルドが必要です (pnpm build)', es: 'La búsqueda requiere compilar el sitio (pnpm build)' },

  // Blog content notice (non-zh)
  'blog.langNotice': {
    zh: '',
    en: 'The blogger mainly writes in Chinese ✧(≖ ◡ ≖✿)',
    ja: 'ブロガーは主に中国語で書いています ✧(≖ ◡ ≖✿)',
    es: 'El blogger escribe principalmente en chino ✧(≖ ◡ ≖✿)',
  },
};

export function getLocale(): Locale {
  if (typeof localStorage === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem('locale');
  if (stored && (LOCALES as readonly string[]).includes(stored)) return stored as Locale;
  return DEFAULT_LOCALE;
}

export function setLocale(locale: Locale) {
  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
  applyTranslations(locale);
}

export function applyTranslations(locale: Locale) {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n!;
    const entry = t[key];
    if (entry?.[locale]) el.textContent = entry[locale];
  });
  // Show/hide blog language notice
  document.querySelectorAll<HTMLElement>('[data-lang-notice]').forEach((el) => {
    el.style.display = locale === 'zh' ? 'none' : '';
    const notice = t['blog.langNotice']?.[locale];
    if (notice) el.textContent = notice;
  });
  // Dispatch event for React components
  window.dispatchEvent(new CustomEvent('locale-changed', { detail: locale }));
}
