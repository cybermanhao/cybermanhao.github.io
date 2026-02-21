import { useState, useEffect, useRef } from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  media?: string;
}

const VIDEO_EXTS = ['.mp4', '.webm', '.ogg'];

function isVideo(src: string) {
  return VIDEO_EXTS.some((ext) => src.toLowerCase().endsWith(ext));
}

export default function ProjectCard({ title, description, tags, github, demo, media }: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [locale, setLocale] = useState<string>('zh');
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      setLocale(localStorage.getItem('locale') || 'zh');
    }
    const handler = (e: Event) => setLocale((e as CustomEvent).detail);
    window.addEventListener('locale-changed', handler);
    return () => window.removeEventListener('locale-changed', handler);
  }, []);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
    if (videoRef.current && videoRef.current.readyState >= 1) {
      setLoaded(true);
    }
  }, []);

  const demoLabel = locale === 'en' ? 'Demo' : locale === 'ja' ? 'デモ' : locale === 'es' ? 'Demo' : '演示';
  const isVideoMedia = media && isVideo(media);

  const handleCardClick = () => {
    if (github) window.open(github, '_blank', 'noopener,noreferrer');
  };

  const handleMouseEnter = () => {
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    videoRef.current?.pause();
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col hover:border-primary/40 transition-colors cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {media ? (
          isVideoMedia ? (
            <>
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
                  <span className="relative text-sm font-tech text-muted-foreground animate-pulse">Loading...</span>
                </div>
              )}
              <video
                ref={videoRef}
                src={media}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={() => setLoaded(true)}
                className={`w-full h-full object-cover object-top transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          ) : (
            <>
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
                  <span className="relative text-sm font-tech text-muted-foreground animate-pulse">Loading...</span>
                </div>
              )}
              <img
                ref={imgRef}
                src={media}
                alt={title}
                onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover object-top transition-all duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          )
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-semibold font-tech mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground flex-1 mb-4 line-clamp-3">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-tech font-medium text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-tech text-muted-foreground hover:text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target={demo.startsWith('http') ? '_blank' : undefined}
              rel={demo.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-1.5 text-xs font-tech text-muted-foreground hover:text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {demoLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
