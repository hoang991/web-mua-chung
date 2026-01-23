
import React from 'react';
import { Link } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Video } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, variant = 'primary', size = 'md', ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-emerald-500",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200 focus:ring-stone-500",
    outline: "border border-emerald-600 text-emerald-700 hover:bg-emerald-50 focus:ring-emerald-500",
    ghost: "hover:bg-stone-100 text-stone-600 hover:text-stone-900"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props} 
    />
  );
};

// --- Container ---
export const Container: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
    {children}
  </div>
);

// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={cn("bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden", className)} {...props}>
    {children}
  </div>
);

// --- Inputs ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-stone-700">{label}</label>}
    <input 
      className={cn(
        "flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )} 
      {...props} 
    />
  </div>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className, ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-stone-700">{label}</label>}
    <textarea 
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )} 
      {...props} 
    />
  </div>
);

// --- Section ---
export const Section: React.FC<{ className?: string; children: React.ReactNode; id?: string }> = ({ className, children, id }) => (
  <section id={id} className={cn("py-12 md:py-20 lg:py-24", className)}>
    {children}
  </section>
);

// --- Animation Wrapper (Fade In) ---
export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={cn(
        "transition-all duration-700 transform", 
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- UNIVERSAL VIDEO PLAYER ---
export const VideoPlayer: React.FC<{ url: string, className?: string }> = ({ url, className }) => {
    if (!url) return null;
    const cleanUrl = url.trim();

    // 1. Raw Embed Code (iframe/div)
    if (cleanUrl.startsWith('<')) {
        return (
            <div 
                className={cn("aspect-video w-full rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-black [&>iframe]:w-full [&>iframe]:h-full", className)}
                dangerouslySetInnerHTML={{__html: cleanUrl}} 
            />
        );
    }

    // 2. YouTube (Robust Regex)
    const ytRegExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = cleanUrl.match(ytRegExp);
    const youtubeId = ytMatch ? ytMatch[1] : null;

    if (youtubeId) {
        // Fix for Error 153: ensure origin is set, use modestbranding, and enablejsapi
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return (
            <div className={cn("aspect-video w-full rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-black", className)}>
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${origin}`}
                    title="Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>
        );
    }

    // 3. Direct Video File
    if (/\.(mp4|webm|ogg|mov)($|\?)/i.test(cleanUrl)) {
        return (
            <div className={cn("w-full rounded-lg overflow-hidden border border-stone-200 shadow-sm bg-black", className)}>
                <video controls playsInline className="w-full h-auto max-h-[600px]">
                    <source src={cleanUrl} />
                    Trình duyệt của bạn không hỗ trợ thẻ video.
                </video>
            </div>
        );
    }

    // 4. Fallback Link
    return (
        <a 
            href={cleanUrl} 
            target="_blank" 
            rel="noreferrer" 
            className={cn("flex items-center gap-2 p-4 bg-stone-50 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors border border-stone-200", className)}
        >
            <div className="p-2 bg-emerald-100 rounded-full">
                <Video className="w-5 h-5" />
            </div>
            <span className="font-medium">Xem video tại liên kết này</span>
        </a>
    );
};
