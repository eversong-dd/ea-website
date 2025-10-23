'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const navigationItems = {
  desktop: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'AI Executive Sprint', href: '/ai-executive-sprint' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact', href: '/contact' },
  ],
  mobile: {
    line1: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
    line2: [
      { label: 'Services', href: '/services' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'Insights', href: '/insights' },
    ],
  },
};

export default function Navigation() {
  const [visible, setVisible] = useState(true);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        // At top of page - always show
        setVisible(true);
        setIsScrollingUp(false);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide nav
        setVisible(false);
        setIsScrollingUp(false);
      } else {
        // Scrolling up - show nav
        setVisible(true);
        setIsScrollingUp(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-transparent ${
        visible 
          ? 'translate-y-0 duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]' 
          : '-translate-y-full duration-200 ease-in'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-light tracking-tight text-white transition-opacity hover:opacity-60"
          >
            Eversong AI
          </Link>

          {/* Desktop Navigation Items */}
          <div className="flex items-center gap-8">
            {navigationItems.desktop.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-light tracking-wide text-white transition-opacity hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Discreet CTA */}
          <Link
            href="/contact"
            className="text-sm font-light underline decoration-1 underline-offset-4 text-white transition-opacity hover:opacity-60"
          >
            Talk to us
          </Link>
        </div>

        {/* Mobile Navigation - same behavior as desktop */}
        <div className="lg:hidden py-4">
          {/* Two-line menu */}
          <div>
            {/* Line 1 */}
            <div className="flex items-center justify-center gap-6 h-10 border-b border-white/20">
              {navigationItems.mobile.line1.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-light tracking-wide text-white transition-opacity active:opacity-60"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Line 2 */}
            <div className="flex items-center justify-center gap-6 h-10">
              {navigationItems.mobile.line2.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-light tracking-wide text-white transition-opacity active:opacity-60"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
