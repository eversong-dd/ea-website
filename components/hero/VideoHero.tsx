'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface VideoHeroProps {
  videoSrc?: string;
  title: string;
  subtitle?: string;
  overlay?: boolean;
}

export default function VideoHero({
  videoSrc = '/videos/hero-bg.mp4',
  title,
  subtitle,
  overlay = true,
}: VideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic entrance animation
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
      });

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
      });

      if (subtitleRef.current) {
        tl.from(
          subtitleRef.current,
          {
            y: 50,
            opacity: 0,
            duration: 1,
          },
          '-=0.6'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <h1
          ref={titleRef}
          className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {title}
        </h1>
        {subtitle && (
          <p
            ref={subtitleRef}
            className="max-w-2xl text-xl font-light text-white/90 sm:text-2xl"
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
