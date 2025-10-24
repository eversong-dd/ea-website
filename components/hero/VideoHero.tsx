'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

interface VideoHeroProps {
  videoSrc?: string;
  headline: string;
  subline?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function VideoHero({
  videoSrc = '/videos/leaves.mp4',
  headline,
  subline,
  ctaText,
  ctaHref = '/contact',
}: VideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      tl.from(headlineRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.4,
        delay: 0.5,
      });

      if (sublineRef.current) {
        tl.from(
          sublineRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 1.2,
          },
          '-=0.8'
        );
      }

      if (ctaRef.current) {
        tl.from(
          ctaRef.current,
          {
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
    <div ref={containerRef} className="relative h-[40vh] md:h-[45vh] w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Grey Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content - Swiss minimalist centered layout */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          ref={headlineRef}
          className="mt-12 mb-6 max-w-4xl text-4xl font-light tracking-tight text-[#F1F1F1] sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ letterSpacing: '-0.02em' }}
        >
          {headline}
        </h1>
        {subline && (
          <p
            ref={sublineRef}
            className="mb-8 max-w-2xl text-lg font-light text-[#F1F1F1]/90 sm:text-xl md:text-2xl"
          >
            {subline}
          </p>
        )}
        {ctaText && (
          <Link
            ref={ctaRef}
            href={ctaHref}
            className="text-base font-light text-[#F1F1F1] underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}
