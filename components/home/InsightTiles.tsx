'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface InsightTile {
  title: string;
  href: string;
  imageSrc?: string;
}

interface InsightTilesProps {
  tiles: InsightTile[];
}

export default function InsightTiles({ tiles }: InsightTilesProps) {
  return (
    <section className="relative -mt-32 z-20 pb-24">
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
              className="flex-shrink-0 w-[85vw]"
            >
              <Link
                href={tile.href}
                className="group block h-80 relative overflow-hidden bg-white shadow-lg active:shadow-2xl transition-shadow duration-500"
              >
                {/* Image with desaturated treatment */}
                {tile.imageSrc && (
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={tile.imageSrc}
                      alt={tile.title}
                      fill
                      className="object-cover grayscale group-active:grayscale-0 transition-all duration-700"
                    />
                    {/* High-contrast overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001238]/90 via-[#001238]/50 to-transparent group-active:from-[#001238]/70 transition-all duration-500" />
                  </div>
                )}

                {/* Fallback gradient for tiles without images */}
                {!tile.imageSrc && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#001238] to-[#001238]/80" />
                )}

                {/* Text overlay */}
                <div className="absolute inset-0 p-8 flex items-end">
                  <h3 className="text-2xl font-light text-white tracking-tight leading-tight">
                    {tile.title}
                  </h3>
                </div>
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
                  className="group block h-80 relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-shadow duration-500"
                >
                  {/* Image with desaturated treatment */}
                  {tile.imageSrc && (
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={tile.imageSrc}
                        alt={tile.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                      {/* High-contrast overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001238]/90 via-[#001238]/50 to-transparent group-hover:from-[#001238]/70 transition-all duration-500" />
                    </div>
                  )}

                  {/* Fallback gradient for tiles without images */}
                  {!tile.imageSrc && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#001238] to-[#001238]/80" />
                  )}

                  {/* Text overlay */}
                  <div className="absolute inset-0 p-8 flex items-end">
                    <h3 className="text-2xl font-light text-white tracking-tight leading-tight group-hover:translate-y-[-4px] transition-transform duration-500">
                      {tile.title}
                    </h3>
                  </div>

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
