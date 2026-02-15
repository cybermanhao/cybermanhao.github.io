import LetterGlitch from './LetterGlitch';
import GlitchText from './GlitchText';
import DecryptedText from './DecryptedText';
import GradientText from './GradientText';
import Magnet from './Magnet';

export default function HeroSection() {
  return (
    <section className="relative -mx-6 -mt-24 pt-24 overflow-hidden">
      {/* LetterGlitch background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <LetterGlitch
          glitchColors={['#00d4ff', '#ff00ff', '#00ff88']}
          glitchSpeed={40}
          centerVignette={true}
          outerVignette={true}
          smooth={true}
        />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/60 via-background/80 to-background" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="mb-6">
          <GlitchText
            speed={0.5}
            enableShadows={true}
            className="text-5xl md:text-7xl font-bold font-tech"
          >
            限制解除！
          </GlitchText>
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

        <div className="flex flex-wrap items-center justify-center gap-4">
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

        <div className="mt-12">
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
