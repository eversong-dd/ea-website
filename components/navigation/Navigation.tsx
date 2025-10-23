'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'AI Executive Sprint', href: '/ai-executive-sprint' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className={`text-xl font-light tracking-tight transition-colors ${
              scrolled ? 'text-[#001238]' : 'text-white'
            }`}
          >
            Eversong AI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-light tracking-wide transition-colors hover:opacity-60 ${
                  scrolled ? 'text-[#001238]' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Discreet CTA */}
          <Link
            href="/contact"
            className={`hidden md:block text-sm font-light underline decoration-1 underline-offset-4 transition-colors hover:opacity-60 ${
              scrolled ? 'text-[#001238]' : 'text-white'
            }`}
          >
            Talk to us
          </Link>
        </div>
      </div>
    </nav>
  );
}
