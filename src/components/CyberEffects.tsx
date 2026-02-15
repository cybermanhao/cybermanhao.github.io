import { useEffect, useState } from 'react';
import Ribbons from './Ribbons';

export default function CyberEffects() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on desktop and if user doesn't prefer reduced motion
    const isDesktop = window.innerWidth >= 1024;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShow(isDesktop && !prefersReducedMotion);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
      <Ribbons
        colors={['#00d4ff', '#ff00ff', '#00ff88']}
        baseSpring={0.02}
        baseFriction={0.92}
        baseThickness={20}
        speedMultiplier={0.4}
        maxAge={400}
        enableFade={true}
        enableShaderEffect={true}
        effectAmplitude={0.3}
      />
    </div>
  );
}
