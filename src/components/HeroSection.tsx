import { lazy, Suspense, useState, useCallback } from 'react';
import Shuffle from './Shuffle';
import DecryptedText from './DecryptedText';
import GradientText from './GradientText';
import Magnet from './Magnet';
import TextType from './TextType';

const Boids = lazy(() => import('./Boids'));

export default function HeroSection() {
  const [showTerminal, setShowTerminal] = useState(false);

  const handleShuffleComplete = useCallback(() => {
    // Start terminal after Shuffle completes + extra delay for DecryptedText
    setTimeout(() => setShowTerminal(true), 3200);
  }, []);

  return (
    <section className="relative -mx-6 -mt-24 pt-24 overflow-hidden">
      {/* Boids flocking background — z-10 so it receives mouse/click events */}
      <div className="absolute inset-0 z-10">
        <Suspense fallback={null}>
          <Boids count={60} color="oklch(0.82 0.15 192 / 0.6)" trailLength={0.08} speed={2} />
        </Suspense>
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-background/40 to-background pointer-events-none" />

      {/* Content — pointer-events-none on container, auto on interactive children */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center pointer-events-none">
        <div className="mb-6">
          <Shuffle
            text="限制解除！"
            className="text-5xl md:text-7xl font-bold font-tech"
            tag="h1"
            textAlign="center"
            duration={0.4}
            stagger={0.05}
            shuffleTimes={3}
            scrambleCharset="░▒▓█▄▀■□◆◇●○★☆♦♠♣♥"
            shuffleDirection="down"
            triggerOnHover={false}
            onShuffleComplete={handleShuffleComplete}
          />
        </div>

        <div className="mb-8 max-w-lg">
          <DecryptedText
            text="Fullstack engineer focus on frontend"
            speed={80}
            sequential={true}
            revealDirection="start"
            animateOn="view"
            className="text-lg md:text-xl text-foreground/80"
            encryptedClassName="text-primary/50"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
          <Magnet padding={60} magnetStrength={3}>
            <a
              href="/blog"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-tech text-sm font-medium border-glow hover:scale-105 transition-transform"
            >
              阅读博客
            </a>
          </Magnet>
          <Magnet padding={60} magnetStrength={3}>
            <a
              href="/about"
              className="inline-flex items-center px-6 py-3 rounded-lg border border-border text-foreground font-tech text-sm font-medium hover:border-primary/50 hover:bg-muted transition-colors"
            >
              关于我
            </a>
          </Magnet>
        </div>

        {/* Terminal typing box — always present for layout stability, typing starts after animations */}
        <div className="mt-8 w-full max-w-md pointer-events-auto">
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 font-tech text-left">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <span className={`inline-block w-2 h-2 rounded-full ${showTerminal ? 'bg-neon-green animate-pulse' : 'bg-muted-foreground/30'}`} />
              standmaster@leo ~ $
            </div>
            <div className="text-sm leading-relaxed text-foreground/90 min-h-[1.5em]">
              {showTerminal && (
                <TextType
                  text={[
                    "你好！欢迎来到限制解除。",
                    "这里记录了 Leo 的技术探索与思考。",
                    "试试点击背景中的鸟群 ↑",
                    "或者去看看博客里有什么有趣的文章。",
                  ]}
                  typingSpeed={40}
                  deletingSpeed={25}
                  pauseDuration={2500}
                  loop={true}
                  showCursor={true}
                  cursorCharacter="█"
                  cursorClassName="text-primary animate-pulse"
                  className="min-h-[1.5em]"
                />
              )}
              {!showTerminal && (
                <span className="text-primary animate-pulse">█</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <GradientText
            colors={['#00d4ff', '#ff00ff', '#00ff88', '#00d4ff']}
            animationSpeed={6}
            className="text-sm font-tech tracking-widest uppercase"
          >
            Leo Ji &middot; Santiago, Chile
          </GradientText>
        </div>
      </div>
    </section>
  );
}
