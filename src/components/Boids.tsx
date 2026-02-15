import { useRef, useEffect, useCallback } from 'react';

interface BoidsProps {
  count?: number;
  color?: string;
  trailLength?: number;
  speed?: number;
  maxBoids?: number;
}

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  spawned: boolean;
}

// Pre-parsed RGB for color interpolation
const MAGENTA_RGB = [200, 50, 180]; // oklch(0.65 0.28 328) approx
const CYAN_RGB = [0, 200, 240];     // oklch(0.82 0.15 192) approx

function lerpRgba(from: number[], to: number[], t: number, alpha: number): string {
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function Boids({
  count = 80,
  color = 'oklch(0.82 0.15 192)',
  trailLength = 0.12,
  speed = 2.5,
  maxBoids = 200,
}: BoidsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boidsRef = useRef<Boid[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const idleRef = useRef<{ idle: boolean; timer: number }>({ idle: false, timer: 0 });

  const initBoids = useCallback((w: number, h: number) => {
    boidsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      age: 9999,
      spawned: false,
    }));
  }, [count, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width || window.innerWidth;
      h = rect?.height || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (boidsRef.current.length === 0) initBoids(w, h);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse move → update position + reset idle
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      // Reset idle timer
      idleRef.current.idle = false;
      clearTimeout(idleRef.current.timer);
      idleRef.current.timer = window.setTimeout(() => {
        idleRef.current.idle = true;
      }, 2000);
    };
    const onLeave = () => {
      mouseRef.current = null;
      idleRef.current.idle = false;
      clearTimeout(idleRef.current.timer);
    };

    // Click → spawn new boids + shockwave
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const boids = boidsRef.current;
      const spawnCount = 5 + Math.floor(Math.random() * 4); // 5~8

      // Spawn new boids radiating outward
      for (let i = 0; i < spawnCount; i++) {
        const angle = (Math.PI * 2 * i) / spawnCount + (Math.random() - 0.5) * 0.5;
        boids.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed * 3,
          vy: Math.sin(angle) * speed * 3,
          age: 0,
          spawned: true,
        });
      }

      // Shockwave: push existing boids away from click
      const shockRadius = 180;
      const shockForce = speed * 4;
      for (const b of boids) {
        const dx = b.x - cx;
        const dy = b.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < shockRadius && dist > 0) {
          const force = (1 - dist / shockRadius) * shockForce;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
        }
      }

      // Cap total boids
      if (boids.length > maxBoids) {
        boids.splice(0, boids.length - maxBoids);
      }
    };

    canvas.addEventListener('mousemove', onMouse);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);

    // Boids parameters
    const visualRange = 75;
    const separationDist = 25;
    const cohesionFactor = 0.005;
    const alignmentFactor = 0.05;
    const separationFactor = 0.05;
    const maxSpeed = speed * 1.8;
    const minSpeed = speed * 0.5;
    const edgeMargin = 80;
    const turnFactor = 0.3;
    const mouseRadius = 150;

    const animate = () => {
      const boids = boidsRef.current;

      // Fade trail
      const bg = getComputedStyle(canvas).getPropertyValue('color');
      ctx.fillStyle = bg || 'rgba(0,0,0,1)';
      ctx.globalAlpha = 1 - trailLength;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      const m = mouseRef.current;
      const idle = idleRef.current.idle;

      for (let i = 0; i < boids.length; i++) {
        const b = boids[i];
        b.age++;

        let cx = 0, cy = 0, cCount = 0;
        let ax = 0, ay = 0, aCount = 0;
        let sx = 0, sy = 0;

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const o = boids[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < visualRange) {
            cx += o.x; cy += o.y; cCount++;
            ax += o.vx; ay += o.vy; aCount++;
            if (dist < separationDist) { sx -= dx; sy -= dy; }
          }
        }

        if (cCount > 0) {
          b.vx += ((cx / cCount - b.x)) * cohesionFactor;
          b.vy += ((cy / cCount - b.y)) * cohesionFactor;
        }
        if (aCount > 0) {
          b.vx += (ax / aCount - b.vx) * alignmentFactor;
          b.vy += (ay / aCount - b.vy) * alignmentFactor;
        }
        b.vx += sx * separationFactor;
        b.vy += sy * separationFactor;

        // Mouse interaction
        if (m) {
          const mdx = m.x - b.x;
          const mdy = m.y - b.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mDist < mouseRadius && mDist > 0) {
            if (!idle) {
              // Mode 1: Repel — boids flee from cursor
              const repelForce = 0.15 * (1 - mDist / mouseRadius);
              b.vx -= (mdx / mDist) * repelForce;
              b.vy -= (mdy / mDist) * repelForce;
            } else {
              // Mode 2: Orbit — weak attract + tangential velocity
              const attractForce = 0.02;
              b.vx += (mdx / mDist) * attractForce;
              b.vy += (mdy / mDist) * attractForce;
              // Add tangential component (perpendicular to radial)
              const tangentForce = 0.04;
              b.vx += (-mdy / mDist) * tangentForce;
              b.vy += (mdx / mDist) * tangentForce;
            }
          }
        }

        // Edge avoidance
        if (b.x < edgeMargin) b.vx += turnFactor;
        if (b.x > w - edgeMargin) b.vx -= turnFactor;
        if (b.y < edgeMargin) b.vy += turnFactor;
        if (b.y > h - edgeMargin) b.vy -= turnFactor;

        // Speed limit
        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        if (spd > maxSpeed) {
          b.vx = (b.vx / spd) * maxSpeed;
          b.vy = (b.vy / spd) * maxSpeed;
        } else if (spd < minSpeed && spd > 0) {
          b.vx = (b.vx / spd) * minSpeed;
          b.vy = (b.vy / spd) * minSpeed;
        }

        b.x += b.vx;
        b.y += b.vy;

        // Determine color: spawned boids fade magenta → default over 60 frames
        let fillColor = color;
        let alpha = 0.7;
        if (b.spawned && b.age < 60) {
          const t = b.age / 60;
          fillColor = lerpRgba(MAGENTA_RGB, CYAN_RGB, t, 1);
          alpha = 0.5 + 0.3 * t; // slightly brighter at start
        }

        // Draw boid triangle
        const angle = Math.atan2(b.vy, b.vx);
        const size = 4;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(size * 2, 0);
        ctx.lineTo(-size, size * 0.8);
        ctx.lineTo(-size, -size * 0.8);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.restore();

        // Connection lines
        for (let j = i + 1; j < boids.length; j++) {
          const o = boids[j];
          const dx = o.x - b.x;
          const dy = o.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < visualRange * 0.7) {
            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.08 * (1 - dist / (visualRange * 0.7));
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(idleRef.current.timer);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouse);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [color, trailLength, speed, maxBoids, initBoids]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ color: 'var(--background)' }}
    />
  );
}
