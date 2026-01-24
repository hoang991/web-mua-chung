
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Video, Sparkles, X, Loader2, Wand2 } from 'lucide-react';
import { aiService } from '../services/mockAI';

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

// --- AI GENERATOR MODAL ---
interface AIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (text: string) => void;
    initialPrompt?: string;
    type?: 'content' | 'title' | 'policy';
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onGenerate, initialPrompt = '', type = 'content' }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [outline, setOutline] = useState('');
    const [wordCount, setWordCount] = useState(300);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result: any = await aiService.generateText(prompt, { wordCount, outline, type });
            // Handle if result is object (from old mock) or string
            const text = typeof result === 'string' ? result : (result.description || result.content);
            onGenerate(text);
            onClose();
        } catch (e) {
            alert('Lỗi tạo nội dung AI');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-purple-50 to-white">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-purple-700">
                        <Sparkles className="w-5 h-5" /> Trợ lý AI Viết bài
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-full">
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <Input 
                        label="Chủ đề / Yêu cầu chính"
                        placeholder="VD: Lợi ích của gạo lứt..."
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />
                    
                    {type !== 'title' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-stone-700 block mb-1">Số lượng từ (ước lượng)</label>
                                    <select 
                                        className="w-full border rounded-md p-2 bg-white text-sm"
                                        value={wordCount}
                                        onChange={e => setWordCount(Number(e.target.value))}
                                    >
                                        <option value={100}>Ngắn (~100 từ)</option>
                                        <option value={300}>Trung bình (~300 từ)</option>
                                        <option value={500}>Dài (~500 từ)</option>
                                        <option value={1000}>Chi tiết (~1000 từ)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <Textarea 
                                label="Dàn ý / Ý chính (Tùy chọn)"
                                placeholder="- Giới thiệu chung&#10;- Lợi ích sức khỏe&#10;- Cách sử dụng"
                                rows={4}
                                value={outline}
                                onChange={e => setOutline(e.target.value)}
                            />
                        </>
                    )}
                </div>

                <div className="p-4 bg-stone-50 border-t flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Hủy</Button>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={isGenerating || !prompt}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Wand2 className="w-4 h-4 mr-2"/>}
                        {isGenerating ? 'AI đang viết...' : 'Tạo nội dung'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
