import { useState, useEffect, useCallback } from 'react';
import { List, X } from 'lucide-react';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3);

  // Observe headings for active highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    filtered.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filtered]);

  const scrollTo = useCallback((slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileOpen(false);
    }
  }, []);

  if (filtered.length === 0) return null;

  const tocList = (
    <nav aria-label="目录">
      <ul className="space-y-1">
        {filtered.map((h) => (
          <li key={h.slug}>
            <button
              onClick={() => scrollTo(h.slug)}
              className={`
                block w-full text-left text-sm py-1 transition-colors truncate
                ${h.depth === 3 ? 'pl-4' : 'pl-0'}
                ${activeId === h.slug
                  ? 'text-primary font-medium glow-cyan'
                  : 'text-muted-foreground hover:text-foreground'}
              `}
              title={h.text}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Desktop: floating right side */}
      <div className="hidden xl:block fixed right-[max(1rem,calc((100vw-48rem)/2-16rem))] top-28 w-56">
        <div className="border-l-2 border-primary/30 pl-4">
          <h3 className="font-tech text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            目录
          </h3>
          {tocList}
        </div>
      </div>

      {/* Mobile: floating button + drawer */}
      <div className="xl:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg border-glow hover:scale-105 transition-transform"
          aria-label="目录"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
        </button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed bottom-20 right-6 z-40 w-64 max-h-[60vh] overflow-y-auto bg-card border border-border rounded-xl shadow-2xl p-4">
              <h3 className="font-tech text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                目录
              </h3>
              {tocList}
            </div>
          </>
        )}
      </div>
    </>
  );
}
