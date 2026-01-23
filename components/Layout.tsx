import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Users, Heart, Anchor, Shield, LogOut, Settings, LayoutDashboard, FileText, MessageSquare, Image, Palette, Package, Briefcase, Facebook, MessageCircle, Home, Feather } from 'lucide-react';
import { Button, Container, cn } from './Shared';
import { storageService } from '../services/store';
import { SiteConfig } from '../types';
import { FloatingContact } from './FloatingContact';

interface LayoutProps {
  children: React.ReactNode;
}

// Map theme strings to Tailwind classes
const themeColors: Record<string, string> = {
    emerald: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100",
    blue: "text-blue-700 bg-blue-50 hover:bg-blue-100",
    rose: "text-rose-700 bg-rose-50 hover:bg-rose-100",
    amber: "text-amber-700 bg-amber-50 hover:bg-amber-100",
    slate: "text-slate-700 bg-slate-50 hover:bg-slate-100",
    violet: "text-violet-700 bg-violet-50 hover:bg-violet-100",
};

const fontFamilies: Record<string, string> = {
    inter: "font-sans",
    serif: "font-serif",
    mono: "font-mono"
};

export const PublicLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [config] = useState<SiteConfig>(storageService.getConfig());
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false); // Close menu on route change
  }, [location.pathname]);

  // Removed body scroll lock since we are using dropdown menu instead of overlay

  const activeColorClass = themeColors[config.primaryColor] || themeColors.emerald;
  const activeFontClass = fontFamilies[config.font] || fontFamilies.inter;

  const menuItems = config.mainMenu
    .filter(item => item.isVisible)
    .sort((a, b) => a.order - b.order);

  const getZaloUrl = (input?: string) => {
    if (!input) return '#';
    if (input.startsWith('http')) return input;
    return `https://zalo.me/${input}`;
  };

  return (
    <div className={cn("min-h-screen flex flex-col text-stone-800 bg-stone-50 selection:bg-emerald-100", activeFontClass)}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-stone-100 transition-all duration-200">
        <Container className="flex h-16 md:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group z-50 relative">
            <div className={cn("p-2 rounded-full transition-colors", activeColorClass)}>
              <Leaf className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-stone-900 line-clamp-1">{config.siteName}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((link) => (
              <Link 
                key={link.id} 
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:opacity-80 relative py-2",
                  location.pathname === link.path 
                    ? `text-${config.primaryColor}-700 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-${config.primaryColor}-600 after:rounded-full` 
                    : "text-stone-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/supplier">
              <Button size="sm" variant="outline" className={`border-${config.primaryColor}-600 text-${config.primaryColor}-700 hover:bg-${config.primaryColor}-50`}>Hợp tác NSX</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 -mr-2 text-stone-600 z-50 relative active:scale-95 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </Container>

        {/* Mobile Nav Dropdown (No Overlay) */}
        <div 
            className={cn(
                "md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-xl overflow-hidden transition-all duration-300 ease-in-out origin-top",
                isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
            )}
        >
            <nav className="flex flex-col p-4 space-y-2">
              {menuItems.map((link) => (
                <Link 
                  key={link.id} 
                  to={link.path}
                  className={cn(
                      "px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-stone-50 flex items-center justify-between",
                      location.pathname === link.path ? `bg-${config.primaryColor}-50 text-${config.primaryColor}-700` : "text-stone-600"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
               <Link 
                to="/supplier" 
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-base font-medium text-stone-600 hover:bg-stone-50 flex items-center justify-between"
              >
                  Hợp tác Nhà Sản Xuất
              </Link>
            </nav>
            
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-between items-center">
                 <div className="flex gap-4">
                    {config.socialLinks.facebook && (
                        <a href={config.socialLinks.facebook} className="text-stone-400 hover:text-blue-600"><Facebook className="w-6 h-6"/></a>
                    )}
                    {config.socialLinks.zalo && (
                        <a href={getZaloUrl(config.socialLinks.zalo)} className="text-stone-400 hover:text-blue-500"><MessageCircle className="w-6 h-6"/></a>
                    )}
                </div>
                 <p className="text-xs text-stone-500">
                    Hotline: <a href={`tel:${config.contactPhone}`} className="font-bold">{config.contactPhone}</a>
                </p>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 md:py-16">
        <Container className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-stone-100">
              <Leaf className={`w-5 h-5 text-${config.primaryColor}-500`} />
              <span className="font-bold text-lg">{config.siteName}</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {config.seoDescription}
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
                {config.socialLinks.facebook && (
                    <a href={config.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-white transition-colors">
                        <Facebook className="w-5 h-5" />
                    </a>
                )}
                 {config.socialLinks.zalo && (
                    <a href={getZaloUrl(config.socialLinks.zalo)} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-white transition-colors">
                        <MessageCircle className="w-5 h-5" />
                    </a>
                )}
            </div>
          </div>
          
          <div>
            <h4 className="text-stone-100 font-medium mb-4">Điều hướng</h4>
            <ul className="space-y-2 text-sm">
                {menuItems.slice(0, 3).map(link => (
                    <li key={link.id}><Link to={link.path} className="hover:text-stone-200 transition-colors block py-1">{link.name}</Link></li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="text-stone-100 font-medium mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-stone-200 transition-colors block py-1">Liên hệ</Link></li>
              <li><Link to="/privacy" className="hover:text-stone-200 transition-colors block py-1">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="hover:text-stone-200 transition-colors block py-1">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-100 font-medium mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm">
              <li className="break-all">Email: {config.contactEmail}</li>
              <li>Hotline: <a href={`tel:${config.contactPhone}`} className="hover:text-white">{config.contactPhone}</a></li>
              <li className="pt-2">
                <Link to="/admin" className="text-stone-700 hover:text-stone-500 text-xs">Admin Portal</Link>
              </li>
            </ul>
          </div>
        </Container>
      </footer>

      {/* Floating Action Button */}
      <FloatingContact />
    </div>
  );
};

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    storageService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/admin' },
    { icon: MessageSquare, label: 'Form Đăng ký', path: '/admin/submissions' },
    { icon: Package, label: 'Sản phẩm & Giá', path: '/admin/products' },
    { icon: Briefcase, label: 'Bài viết NSX', path: '/admin/suppliers' },
    { icon: Feather, label: 'Dưỡng vườn tâm', path: '/admin/blog' },
    { icon: FileText, label: 'Quản lý Trang', path: '/admin/pages' },
    { icon: Image, label: 'Thư viện ảnh', path: '/admin/media' },
    { icon: Palette, label: 'Giao diện & Menu', path: '/admin/theme' },
    { icon: Settings, label: 'Cấu hình chung', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-400 hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-2 text-stone-100">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">Admin Portal</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-emerald-900/30 text-emerald-400" 
                  : "hover:bg-stone-800 hover:text-stone-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-800 space-y-2 bg-stone-900">
          <Link 
            to="/" 
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 md:px-6 md:hidden sticky top-0 z-30">
          <span className="font-bold text-stone-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" /> Admin
          </span>
          <div className="flex gap-2">
            <Link to="/" target="_blank" className="p-2 bg-stone-100 rounded-full"><Home className="w-5 h-5 text-stone-600" /></Link>
            <button onClick={handleLogout} className="p-2 bg-stone-100 rounded-full"><LogOut className="w-5 h-5 text-stone-600" /></button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};