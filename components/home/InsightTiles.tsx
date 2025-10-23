'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRef } from 'react';

interface InsightTile {
  title: string;
  href: string;
  imageSrc?: string;
  videoSrc?: string;
  category?: string; // New: category label (INSIGHTS, CASE STUDY, etc.)
}

interface InsightTilesProps {
  tiles: InsightTile[];
}

function TileContent({ tile }: { tile: InsightTile }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset to start
    }
  };

  return (
    <>
      {/* Video background (hover to play) */}
      {tile.videoSrc && (
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <source src={tile.videoSrc} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Image (fallback if no video) */}
      {!tile.videoSrc && tile.imageSrc && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={tile.imageSrc}
            alt={tile.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Fallback gradient for tiles without images or videos */}
      {!tile.imageSrc && !tile.videoSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C0C0C] to-[#0C0C0C]/80" />
      )}

      {/* Text overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Category label in top-left */}
        <div className="text-2xl font-light text-white/70 tracking-widest uppercase group-hover:text-3xl transition-all duration-300 px-2">
          {tile.category || 'INSIGHTS'}
        </div>
        
        {/* Title in bottom-left with semi-transparent backdrop */}
        <div className="w-full bg-black/20 backdrop-blur-sm px-6 py-4">
          <h3 className="text-4xl font-serif font-normal text-white tracking-tight leading-tight group-hover:translate-y-[-4px] transition-transform duration-500">
            {tile.title}
          </h3>
        </div>
      </div>
    </>
  );
}

export default function InsightTiles({ tiles }: InsightTilesProps) {
  return (
    <section className="relative py-24 bg-[#0C0C0C]">
      {/* Mobile: Horizontal scroll carousel */}
      <div className="md:hidden overflow-x-auto scrollbar-hide px-6">
        <div className="flex gap-4 pb-4">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.href}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="flex-shrink-0 w-[68vw]"
            >
              <Link
                href={tile.href}
                className="group block aspect-[1.1/1.634] relative overflow-hidden bg-white shadow-lg active:shadow-2xl transition-shadow duration-500"
              >
                <TileContent tile={tile} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout (unchanged) */}
      <div className="hidden md:block px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {tiles.map((tile, index) => (
              <motion.div
                key={tile.href}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                <Link
                  href={tile.href}
                  className="group block aspect-[1.1/1.634] relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-500"
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) video.play();
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) {
                      video.pause();
                      video.currentTime = 0;
                    }
                  }}
                >
                  <TileContent tile={tile} />

                  {/* Subtle elevation on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 shadow-[0_20px_60px_-15px_rgba(0,18,56,0.4)]" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
