
import React, { useEffect, useState, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout, AdminLayout } from './components/Layout';
import { SEOHead } from './components/SEO';
import { storageService } from './services/store';
import { Button, Input, Card } from './components/Shared';
import { Loader2 } from 'lucide-react';

// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/public/Home'));
const Model = React.lazy(() => import('./pages/public/Model'));
const Leader = React.lazy(() => import('./pages/public/Leader'));
const Products = React.lazy(() => import('./pages/public/Products'));
const Blog = React.lazy(() => import('./pages/public/Blog')); // Dưỡng vườn tâm
const BlogPost = React.lazy(() => import('./pages/public/BlogPost')); // Chi tiết bài viết
const Supplier = React.lazy(() => import('./pages/public/Supplier'));
const Contact = React.lazy(() => import('./pages/public/Contact'));
const Privacy = React.lazy(() => import('./pages/public/Privacy'));
const Terms = React.lazy(() => import('./pages/public/Terms'));

// Admin Pages Lazy Load
const DashboardHome = React.lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.DashboardHome })));
const SubmissionsPage = React.lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.SubmissionsPage })));
const SettingsPage = React.lazy(() => import('./pages/admin/Dashboard').then(module => ({ default: module.SettingsPage })));
const ContentManager = React.lazy(() => import('./pages/admin/ContentManager').then(module => ({ default: module.ContentManager })));
const MediaLibrary = React.lazy(() => import('./pages/admin/MediaLibrary').then(module => ({ default: module.MediaLibrary })));
const ThemeCustomizer = React.lazy(() => import('./pages/admin/ThemeCustomizer').then(module => ({ default: module.ThemeCustomizer })));
const ProductManager = React.lazy(() => import('./pages/admin/ProductManager').then(module => ({ default: module.ProductManager })));
const SupplierManager = React.lazy(() => import('./pages/admin/SupplierManager').then(module => ({ default: module.SupplierManager })));
const BlogManager = React.lazy(() => import('./pages/admin/BlogManager').then(module => ({ default: module.BlogManager })));

// Loading Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
  </div>
);

// Simple Login Page for Admin
const LoginPage = () => {
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (storageService.login(pass)) {
      window.location.href = '#/admin';
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            type="password" 
            placeholder="Mật khẩu (admin123)" 
            value={pass}
            onChange={e => setPass(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">Sai mật khẩu</p>}
          <Button type="submit" className="w-full">Đăng nhập</Button>
        </form>
      </Card>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuth = storageService.checkAuth();
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
};

// Global SEO Wrapper to inject config defaults
const GlobalSEO = () => {
    const config = storageService.getConfig();
    return <SEOHead title={config.seoTitle} description={config.seoDescription} />;
}

// Placeholder
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="py-20 text-center">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-stone-500">Nội dung đang được cập nhật...</p>
  </div>
);

const App = () => {
  return (
    <Router>
      <GlobalSEO />
      <Suspense fallback={<PublicLayout><PageLoader /></PublicLayout>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/model" element={<PublicLayout><Model /></PublicLayout>} />
          <Route path="/leader" element={<PublicLayout><Leader /></PublicLayout>} />
          <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
          
          <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
          <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />

          <Route path="/supplier" element={<PublicLayout><Supplier /></PublicLayout>} />
          <Route path="/philosophy" element={<PublicLayout><PlaceholderPage title="Triết lý & Văn hóa" /></PublicLayout>} />
          
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
          <Route path="/admin/submissions" element={<ProtectedRoute><SubmissionsPage /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
          <Route path="/admin/suppliers" element={<ProtectedRoute><SupplierManager /></ProtectedRoute>} />
          <Route path="/admin/blog" element={<ProtectedRoute><BlogManager /></ProtectedRoute>} />
          <Route path="/admin/pages" element={<ProtectedRoute><ContentManager /></ProtectedRoute>} />
          <Route path="/admin/media" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />
          <Route path="/admin/theme" element={<ProtectedRoute><ThemeCustomizer /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
