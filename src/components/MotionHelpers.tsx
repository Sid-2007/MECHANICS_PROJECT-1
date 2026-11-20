import React, { useEffect, useRef, useState } from 'react';

// Lightweight IntersectionObserver hook for performant scroll-triggered animations
export function useInView(options: IntersectionObserverInit = { threshold: 0.15 }) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(element); // Trigger once
      }
    }, options);

    observer.observe(element);
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options.threshold]);

  return { ref, isInView };
}

// Fade In and Slide Up container with staggered delay support
interface FadeInProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delayMs = 0,
  className = '',
  direction = 'up',
}) => {
  const { ref, isInView } = useInView();

  const getTransform = () => {
    if (isInView) return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return 'translate3d(0, 24px, 0)';
      case 'down':
        return 'translate3d(0, -24px, 0)';
      case 'left':
        return 'translate3d(24px, 0, 0)';
      case 'right':
        return 'translate3d(-24px, 0, 0)';
      default:
        return 'none';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transform: getTransform(),
        opacity: isInView ? 1 : 0,
        transition: `opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: 'transform, opacity',
      }}
      className={className}
    >
      {children}
    </div>
  );
};

// Animated Number Counter for reference values
interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 1,
  prefix = '',
  suffix = '',
  durationMs = 1200,
  className = '',
}) => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (value - start) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};
