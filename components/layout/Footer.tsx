'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-[#F1F1F1] py-16">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-light text-[#001238] mb-4">
              Eversong AI
            </h3>
            <p className="text-sm font-light text-[#001238]/70 leading-relaxed">
              Making AI valuable, secure and practical for SMEs on Microsoft.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-light text-[#001238] mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm font-light text-[#001238]/70 hover:text-[#001238] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm font-light text-[#001238]/70 hover:text-[#001238] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/case-studies"
                  className="text-sm font-light text-[#001238]/70 hover:text-[#001238] transition-colors"
                >
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-light text-[#001238] mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/ai-executive-sprint"
                  className="text-sm font-light text-[#001238]/70 hover:text-[#001238] transition-colors"
                >
                  AI Executive Sprint
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  className="text-sm font-light text-[#001238]/70 hover:text-[#001238] transition-colors"
                >
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-light text-[#001238] mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm font-light text-[#001238]/70 hover:text-[#001238] transition-colors"
                >
                  Talk to us
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contact@eversong.ai"
                  className="text-sm font-light text-[#001238]/70 hover:text-[#001238] transition-colors"
                >
                  contact@eversong.ai
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F1F1F1]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-light text-[#001238]/60">
              © {currentYear} Eversong AI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm font-light text-[#001238]/60 hover:text-[#001238] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm font-light text-[#001238]/60 hover:text-[#001238] transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
