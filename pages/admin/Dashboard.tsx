import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { FormSubmission, SiteConfig } from '../../types';
import { Card, Button, Input } from '../../components/Shared';
import { Trash2, CheckCircle, Mail, Settings as SettingsIcon, Download, FileText, Layout, Image, Share2, MessageCircle, Sparkles, Lock, Loader2, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardHome = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [publicPages, setPublicPages] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);

  useEffect(() => {
    setSubmissions(storageService.getSubmissions());
    setPublicPages(storageService.getPages().filter(p => p.status === 'published').length);
    setMediaCount(storageService.getMedia().length);
  }, []);

  const newSubmissions = submissions.filter(s => s.status === 'new');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 mb-2">Xin chào, Admin</h1>
        <p className="text-stone-500">Đây là tổng quan hoạt động của nền tảng.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-blue-500 bg-gradient-to-br from-white to-blue-50">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-sm font-medium text-blue-800 uppercase tracking-wider">Đăng ký mới</h3>
                <p className="text-4xl font-bold text-stone-900 mt-2">{newSubmissions.length}</p>
             </div>
             <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Mail className="w-6 h-6"/></div>
          </div>
          <Link to="/admin/submissions" className="text-sm text-blue-600 font-medium mt-4 block hover:underline">Xem tất cả &rarr;</Link>
        </Card>
        
        <Card className="p-6 border-l-4 border-emerald-500 bg-gradient-to-br from-white to-emerald-50">
           <div className="flex justify-between items-start">
             <div>
                <h3 className="text-sm font-medium text-emerald-800 uppercase tracking-wider">Trang Public</h3>
                <p className="text-4xl font-bold text-stone-900 mt-2">{publicPages}</p>
             </div>
             <div className="p-3 bg-emerald-100 rounded-full text-emerald-600"><Layout className="w-6 h-6"/></div>
          </div>
          <Link to="/admin/pages" className="text-sm text-emerald-600 font-medium mt-4 block hover:underline">Quản lý nội dung &rarr;</Link>
        </Card>

        <Card className="p-6 border-l-4 border-amber-500 bg-gradient-to-br from-white to-amber-50">
           <div className="flex justify-between items-start">
             <div>
                <h3 className="text-sm font-medium text-amber-800 uppercase tracking-wider">Thư viện ảnh</h3>
                <p className="text-4xl font-bold text-stone-900 mt-2">{mediaCount}</p>
             </div>
             <div className="p-3 bg-amber-100 rounded-full text-amber-600"><Image className="w-6 h-6"/></div>
          </div>
          <Link to="/admin/media" className="text-sm text-amber-600 font-medium mt-4 block hover:underline">Quản lý Media &rarr;</Link>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Đăng ký gần đây</h2>
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 font-medium">Tên</th>
                <th className="px-6 py-4 font-medium">Loại</th>
                <th className="px-6 py-4 font-medium">Ngày</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {submissions.slice(0, 5).map(sub => (
                <tr key={sub.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium">{sub.name}</td>
                  <td className="px-6 py-4 text-stone-500">
                    {sub.type === 'leader_registration' ? 'ĐK Leader' : 'Liên hệ'}
                  </td>
                  <td className="px-6 py-4 text-stone-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === 'new' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {sub.status === 'new' ? 'Mới' : 'Đã xem'}
                    </span>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-stone-400">Chưa có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  useEffect(() => {
    setSubmissions(storageService.getSubmissions());
  }, []);

  const handleMarkRead = async (id: string) => {
    await storageService.updateSubmissionStatus(id, 'read');
    setSubmissions(storageService.getSubmissions());
  };
  
  const handleExport = () => {
      storageService.exportSubmissions();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-stone-900">Quản lý Form</h1>
          <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" /> Xuất dữ liệu (CSV)
          </Button>
      </div>
      
      <div className="space-y-4">
        {submissions.map(sub => (
          <Card key={sub.id} className="p-6 transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{sub.name}</h3>
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-600 uppercase border border-stone-200">{sub.type.replace('_', ' ')}</span>
                  {sub.status === 'new' && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded animate-pulse">New</span>}
                </div>
                <div className="text-sm text-stone-500 space-y-1">
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {sub.email} <span className="text-stone-300">|</span> {sub.phone}</p>
                  <p className="text-stone-400 text-xs">{new Date(sub.createdAt).toLocaleString()}</p>
                </div>
                {sub.message && (
                  <div className="mt-4 bg-stone-50 p-4 rounded-lg border border-stone-100 text-sm text-stone-700 whitespace-pre-wrap font-mono">
                    {sub.message}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                 {sub.status === 'new' && (
                   <Button size="sm" variant="outline" onClick={() => handleMarkRead(sub.id)}>
                     <CheckCircle className="w-4 h-4 mr-1" /> Đã xem
                   </Button>
                 )}
              </div>
            </div>
          </Card>
        ))}
        {submissions.length === 0 && <p className="text-stone-500 text-center py-12">Chưa có dữ liệu nào.</p>}
      </div>
    </div>
  );
};

export const SettingsPage = () => {
  const [config, setConfig] = useState<SiteConfig>(storageService.getConfig());
  const [isSaving, setIsSaving] = useState(false);
  
  // Password Change State
  const [passForm, setPassForm] = useState({ newPass: '', confirmPass: '' });
  const [passMsg, setPassMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        await storageService.saveConfig(config);
    } catch (err) {
        console.error(err);
    } finally {
        setIsSaving(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
      e.preventDefault();
      if (passForm.newPass !== passForm.confirmPass) {
          setPassMsg('Mật khẩu xác nhận không khớp.');
          return;
      }
      if (passForm.newPass.length < 6) {
          setPassMsg('Mật khẩu phải có ít nhất 6 ký tự.');
          return;
      }
      storageService.changePassword(passForm.newPass);
      setPassMsg('Đổi mật khẩu thành công!');
      setPassForm({ newPass: '', confirmPass: '' });
      setTimeout(() => setPassMsg(''), 3000);
  };

  return (
    <div className="max-w-2xl pb-20">
       <h1 className="text-2xl font-bold text-stone-900 mb-6">Cài đặt Website</h1>
       <div className="space-y-8">
           <Card className="p-8">
             <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" /> Thông tin chung
                  </h3>
                  <div className="space-y-4">
                    <Input 
                      label="Tên Website" 
                      value={config.siteName} 
                      onChange={e => setConfig({...config, siteName: e.target.value})} 
                    />
                    <Input 
                      label="Email liên hệ" 
                      value={config.contactEmail} 
                      onChange={e => setConfig({...config, contactEmail: e.target.value})} 
                    />
                    <Input 
                      label="Hotline" 
                      value={config.contactPhone} 
                      onChange={e => setConfig({...config, contactPhone: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100">
                   <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5" /> Mạng xã hội & Chat (Nút nổi)
                  </h3>
                   <div className="space-y-4">
                    <Input 
                      label="Facebook URL" 
                      placeholder="https://facebook.com/..."
                      value={config.socialLinks.facebook || ''} 
                      onChange={e => setConfig({
                          ...config, 
                          socialLinks: { ...config.socialLinks, facebook: e.target.value }
                      })} 
                    />
                     <Input 
                      label="Link Zalo / Số điện thoại" 
                      placeholder="Ví dụ: 0909999999 hoặc https://zalo.me/g/..."
                      value={config.socialLinks.zalo || ''} 
                      onChange={e => setConfig({
                          ...config, 
                          socialLinks: { ...config.socialLinks, zalo: e.target.value }
                      })} 
                    />
                    <p className="text-xs text-stone-500 italic">Hệ thống sẽ tự động tạo link chat Zalo hoặc Link tham gia nhóm.</p>
                    
                     <Input 
                      label="Telegram Username" 
                      placeholder="Ví dụ: @username hoặc username"
                      value={config.socialLinks.telegram || ''} 
                      onChange={e => setConfig({
                          ...config, 
                          socialLinks: { ...config.socialLinks, telegram: e.target.value }
                      })} 
                    />
                    <p className="text-xs text-stone-500 italic">Nhập username (không cần https://t.me/).</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                     <Sparkles className="w-5 h-5 text-purple-600" /> Cấu hình AI (Trợ lý viết bài)
                  </h3>
                  <div className="space-y-4">
                     <Input 
                      label="Gemini API Key" 
                      type="password"
                      placeholder="AIza..."
                      value={config.aiKeys?.gemini || ''} 
                      onChange={e => setConfig({
                          ...config, 
                          aiKeys: { ...config.aiKeys, gemini: e.target.value }
                      })} 
                    />
                     <Input 
                      label="OpenAI API Key (ChatGPT)" 
                      type="password"
                      placeholder="sk-..."
                      value={config.aiKeys?.openai || ''} 
                      onChange={e => setConfig({
                          ...config, 
                          aiKeys: { ...config.aiKeys, openai: e.target.value }
                      })} 
                    />
                     <Input 
                      label="Anthropic API Key (Claude)" 
                      type="password"
                      placeholder="sk-ant-..."
                      value={config.aiKeys?.claude || ''} 
                      onChange={e => setConfig({
                          ...config, 
                          aiKeys: { ...config.aiKeys, claude: e.target.value }
                      })} 
                    />
                     <Input 
                      label="xAI API Key (Grok)" 
                      type="password"
                      value={config.aiKeys?.grok || ''} 
                      onChange={e => setConfig({
                          ...config, 
                          aiKeys: { ...config.aiKeys, grok: e.target.value }
                      })} 
                    />
                    <p className="text-xs text-stone-500 italic">
                      Các khóa API này được lưu trên trình duyệt của bạn để dùng cho tính năng tự động viết bài.
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100">
                  <h3 className="font-bold text-lg mb-4">Cấu hình SEO mặc định</h3>
                  <div className="space-y-4">
                     <Input 
                      label="Tiêu đề Trang chủ" 
                      value={config.seoTitle} 
                      onChange={e => setConfig({...config, seoTitle: e.target.value})} 
                    />
                    <Input 
                      label="Mô tả mặc định" 
                      value={config.seoDescription} 
                      onChange={e => setConfig({...config, seoDescription: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2"/>}
                    {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
                  </Button>
                </div>
             </form>
           </Card>

           <Card className="p-8 border-l-4 border-red-500">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-stone-900">
                    <Lock className="w-5 h-5" /> Bảo mật & Đăng nhập
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <Input 
                        label="Mật khẩu Admin mới" 
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={passForm.newPass}
                        onChange={e => setPassForm({...passForm, newPass: e.target.value})}
                    />
                    <Input 
                        label="Xác nhận mật khẩu" 
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={passForm.confirmPass}
                        onChange={e => setPassForm({...passForm, confirmPass: e.target.value})}
                    />
                    {passMsg && (
                        <p className={`text-sm font-medium ${passMsg.includes('thành công') ? 'text-green-600' : 'text-red-500'}`}>
                            {passMsg}
                        </p>
                    )}
                    <Button type="submit" variant="secondary" className="border-red-200 text-red-700 bg-red-50 hover:bg-red-100">
                        Đổi mật khẩu
                    </Button>
                </form>
           </Card>
       </div>
    </div>
  );
};