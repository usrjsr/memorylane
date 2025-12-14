import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-amber-50 border-t-2 border-amber-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-amber-900">MemoryLane</p>
              <p className="text-xs text-amber-700">
                Preserving memories for tomorrow
              </p>
            </div>
          </div>

          <div className="flex gap-6 text-sm text-amber-800">
            <a
              href="/about"
              className="hover:text-amber-600 transition-colors duration-200"
            >
              About
            </a>
            <a
              href="/privacy"
              className="hover:text-amber-600 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-amber-600 transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="/contact"
              className="hover:text-amber-600 transition-colors duration-200"
            >
              Contact
            </a>
          </div>

          <div className="text-xs text-amber-700 text-center sm:text-right">
            <p>© {new Date().getFullYear()} MemoryLane</p>
            <p className="text-amber-600">All memories preserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
