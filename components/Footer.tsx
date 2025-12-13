
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-8 p-4 text-center text-sm text-gray-600">
      © {new Date().getFullYear()} MemoryLane. Preserving the future.
    </footer>
  );
};