
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, Users, Heart, Anchor, Shield, LogOut, Settings, LayoutDashboard, FileText, MessageSquare, Image, Palette, Package, Briefcase, Facebook, MessageCircle, Home } from 'lucide-react';
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
  }, [location.pathname]);

  const activeColorClass = themeColors[config.primaryColor] || themeColors.emerald;
  const activeFontClass = fontFamilies[config.font] || fontFamilies.inter;

  // Filter visible menu items and sort
  const menuItems = config.mainMenu
    .filter(item => item.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className={cn("min-h-screen flex flex-col text-stone-800 bg-stone-50 selection:bg-emerald-100", activeFontClass)}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-stone-100">
        <Container className="flex h-16 md:h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className={cn("p-2 rounded-full transition-colors", activeColorClass)}>
              <Leaf className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-stone-900">{config.siteName}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((link) => (
              <Link 
                key={link.id} 
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:opacity-80",
                  location.pathname === link.path ? `text-${config.primaryColor}-700 font-semibold` : "text-stone-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/supplier">
              <Button size="sm" variant="outline" className={`border-${config.primaryColor}-600 text-${config.primaryColor}-700`}>Hợp tác NSX</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-stone-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </Container>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-lg animate-in slide-in-from-top-5">
            <nav className="flex flex-col p-4 gap-4">
              {menuItems.map((link) => (
                <Link 
                  key={link.id} 
                  to={link.path}
                  className="text-base font-medium text-stone-700 py-2 border-b border-stone-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/supplier" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-start" variant="ghost">Dành cho Nhà Sản Xuất</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
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
                    <a href={config.socialLinks.zalo} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-white transition-colors">
                        <MessageCircle className="w-5 h-5" />
                    </a>
                )}
            </div>
          </div>
          
          <div>
            <h4 className="text-stone-100 font-medium mb-4">Điều hướng</h4>
            <ul className="space-y-2 text-sm">
                {menuItems.slice(0, 3).map(link => (
                    <li key={link.id}><Link to={link.path} className="hover:text-stone-200 transition-colors">{link.name}</Link></li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="text-stone-100 font-medium mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-stone-200 transition-colors">Liên hệ</Link></li>
              <li><Link to="/privacy" className="hover:text-stone-200 transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/terms" className="hover:text-stone-200 transition-colors">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-stone-100 font-medium mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: {config.contactEmail}</li>
              <li>Hotline: {config.contactPhone}</li>
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
    { icon: FileText, label: 'Quản lý Trang', path: '/admin/pages' },
    { icon: Image, label: 'Thư viện ảnh', path: '/admin/media' },
    { icon: Palette, label: 'Giao diện & Menu', path: '/admin/theme' },
    { icon: Settings, label: 'Cấu hình chung', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-400 hidden md:flex flex-col">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-2 text-stone-100">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">Admin Portal</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
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
        <div className="p-4 border-t border-stone-800 space-y-2">
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
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold text-stone-900">Admin Portal</span>
          <div className="flex gap-2">
            <Link to="/" target="_blank" className="p-2"><Home className="w-5 h-5 text-stone-500" /></Link>
            <button onClick={handleLogout} className="p-2"><LogOut className="w-5 h-5 text-stone-500" /></button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
