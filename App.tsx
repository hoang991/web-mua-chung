import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PublicLayout, AdminLayout } from './components/Layout';
import { SEOHead } from './components/SEO';
import Home from './pages/public/Home';
import Model from './pages/public/Model';
import Leader from './pages/public/Leader';
import Products from './pages/public/Products';
import Supplier from './pages/public/Supplier';
import Contact from './pages/public/Contact';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import { DashboardHome, SubmissionsPage, SettingsPage } from './pages/admin/Dashboard';
import { ContentManager } from './pages/admin/ContentManager';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { ThemeCustomizer } from './pages/admin/ThemeCustomizer';
import { ProductManager } from './pages/admin/ProductManager';
import { SupplierManager } from './pages/admin/SupplierManager';
import { storageService } from './services/store';
import { Button, Input, Card } from './components/Shared';

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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/model" element={<PublicLayout><Model /></PublicLayout>} />
        <Route path="/leader" element={<PublicLayout><Leader /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/supplier" element={<PublicLayout><Supplier /></PublicLayout>} />
        <Route path="/philosophy" element={<PublicLayout><PlaceholderPage title="Triết lý & Văn hóa" /></PublicLayout>} />
        
        {/* New Pages */}
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><DashboardHome /></ProtectedRoute>} />
        <Route path="/admin/submissions" element={<ProtectedRoute><SubmissionsPage /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
        <Route path="/admin/suppliers" element={<ProtectedRoute><SupplierManager /></ProtectedRoute>} />
        <Route path="/admin/pages" element={<ProtectedRoute><ContentManager /></ProtectedRoute>} />
        <Route path="/admin/media" element={<ProtectedRoute><MediaLibrary /></ProtectedRoute>} />
        <Route path="/admin/theme" element={<ProtectedRoute><ThemeCustomizer /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
