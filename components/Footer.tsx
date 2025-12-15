import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t-2 border-cyan-500/20 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-black text-white">MemoryLane</p>
                <p className="text-sm text-slate-400 mt-1">
                  Preserving memories for tomorrow
                </p>
              </div>
            </div>

            <div className="md:text-center">
              <p className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
                Quick Links
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="/about"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium"
                >
                  About
                </a>
                <a
                  href="/privacy"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium"
                >
                  Terms of Service
                </a>
                <a
                  href="/contact"
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm font-medium"
                >
                  Contact
                </a>
              </div>
            </div>

            <div className="md:text-right">
              <p className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">
                Follow Us
              </p>
              <div className="flex gap-4 md:justify-end">
                <a
                  href="https://twitter.com"
                  className="w-10 h-10 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-all duration-200"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5 5M9 19s-1 0-1-1 1-4 5-4 6 3 5 4c0 1-1 1-1 1H9z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  className="w-10 h-10 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-all duration-200"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  className="w-10 h-10 bg-slate-800 border-2 border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500 transition-all duration-200"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} MemoryLane. All rights reserved.
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-slate-400">
                  Preserving memories worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};