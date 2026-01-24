
import React, { useState, useEffect } from 'react';
import { ArrowUp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from './Shared';

export const FloatingNav = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScroll);
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3 print:hidden">
      {/* Scroll Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "p-3 rounded-full bg-stone-900 text-white shadow-lg hover:bg-stone-700 transition-all duration-300 transform",
          showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
        aria-label="Lên đầu trang"
        title="Lên đầu trang"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* Home Button */}
      <Link to="/" title="Về trang chủ">
        <button
          className="p-3 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-transform hover:scale-110"
          aria-label="Về trang chủ"
        >
          <Home className="w-5 h-5" />
        </button>
      </Link>
    </div>
  );
};
