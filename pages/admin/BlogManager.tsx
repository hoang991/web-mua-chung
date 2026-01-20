
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { aiService } from '../../services/mockAI';
import { BlogPost, BlogCategory } from '../../types';
import { Card, Button, Input, Textarea } from '../../components/Shared';
import { MediaPicker } from './MediaPicker';
import { Plus, Trash2, Edit, Save, ArrowLeft, Image as ImageIcon, Sparkles, Loader2, Pencil, Calendar, Heart, Gift, Coffee, MapPin, ExternalLink } from 'lucide-react';

const BlogList = ({ onSelect }: { onSelect: (post: BlogPost) => void }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setPosts(storageService.getBlogPosts());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if(window.confirm('Xóa bài viết này? Hành động này không thể hoàn tác.')) {
          storageService.deleteBlogPost(id);
          setPosts(storageService.getBlogPosts());
      }
  };

  const handleEditClick = (post: BlogPost, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(post);
  };

  const handleCreate = () => {
      const newPost: BlogPost = {
          id: Math.random().toString(36).substr(2, 9),
          title: '', 
          slug: '',
          excerpt: '',
          content: '',
          coverImage: '',
          status: 'draft',
          category: 'story', // default category
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
      };
      onSelect(newPost);
  };

  const getCategoryLabel = (cat: string) => {
      switch(cat) {
          case 'solution': return { label: 'Tặng giải pháp', color: 'bg-emerald-100 text-emerald-800' };
          case 'story': return { label: 'Chuyện chị em', color: 'bg-rose-100 text-rose-800' };
          case 'event': return { label: 'Lịch sự kiện', color: 'bg-amber-100 text-amber-800' };
          case 'tea': return { label: 'Điểm trà', color: 'bg-stone-100 text-stone-800' };
          default: return { label: 'Khác', color: 'bg-gray-100 text-gray-800' };
      }
  };

  // Helper to safely format date preventing crashes
  const formatDate = (dateString?: string) => {
      if (!dateString) return '';
      try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return 'Ngày lỗi';
          return date.toLocaleDateString('vi-VN');
      } catch (e) {
          return 'Ngày lỗi';
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-stone-900">Quản lý Dưỡng Vườn Tâm</h1>
         <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2"/> Viết chia sẻ mới</Button>
      </div>
      <div className="grid gap-4">
        {posts.map(p => {
          const catInfo = getCategoryLabel(p.category);
          return (
            <Card key={p.id} className="p-4 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(p)}>
                <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                    {p.coverImage ? <img src={p.coverImage} alt="" className="w-full h-full object-cover"/> : <ImageIcon className="w-8 h-8 m-auto text-stone-300 h-full"/>}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-lg">{p.title || '(Chưa đặt tiêu đề)'}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {p.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${catInfo.color}`}>
                            {catInfo.label}
                        </span>
                    </div>
                    <p className="text-sm text-stone-500 line-clamp-1">{p.excerpt || 'Chưa có mô tả ngắn'}</p>
                    <p className="text-xs text-stone-400 mt-1">
                        Cập nhật: {formatDate(p.updatedAt)}
                        {p.eventDate && ` • Sự kiện: ${formatDate(p.eventDate)}`}
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={(e) => handleEditClick(p, e)}
                        title="Chỉnh sửa bài viết"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>

                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => handleDelete(p.id, e)} 
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100"
                        title="Xóa bài viết"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </Card>
          );
        })}
        {posts.length === 0 && (
            <div className="text-center py-16 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
                <p className="text-stone-500 mb-4">Khu vườn đang trống.</p>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2"/> Gieo hạt giống đầu tiên</Button>
            </div>
        )}
      </div>
    </div>
  );
};

const BlogEditor = ({ post: initialPost, onBack }: { post: BlogPost; onBack: () => void }) => {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Initialize location if it doesn't exist but category is tea
  useEffect(() => {
      if (post.category === 'tea' && !post.location) {
          setPost(p => ({
              ...p,
              location: { address: '', link: '' } 
          }));
      }
  }, [post.category]);

  const handleSave = () => {
    if (!post.title) return alert("Vui lòng nhập tiêu đề");
    setIsSaving(true);
    const finalPost = {
        ...post,
        slug: post.slug || post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        updatedAt: new Date().toISOString()
    }
    storageService.saveBlogPost(finalPost);
    setTimeout(() => {
        setIsSaving(false);
        onBack();
    }, 500);
  };

  const handleAiGenerate = async () => {
      if (!post.title) return alert("Vui lòng nhập tiêu đề bài viết để AI có thể viết nội dung.");
      setIsGenerating(true);
      try {
          const content = await aiService.generateSupplierPost(post.title); // Reusing supplier generation for now as structure is similar
          setPost(prev => ({
              ...prev,
              content: content,
              excerpt: "Bài viết được tạo tự động bởi AI..."
          }));
      } catch (error) {
          alert("Lỗi khi tạo nội dung");
      } finally {
          setIsGenerating(false);
      }
  };

  const handleImageSelect = (url: string) => {
    setPost({ ...post, coverImage: url });
  };

  return (
    <div className="space-y-6 pb-20">
      {showMediaPicker && (
          <MediaPicker 
            onSelect={handleImageSelect} 
            onClose={() => setShowMediaPicker(false)} 
          />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} size="sm">
                <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-stone-900">
                {post.title || 'Bài chia sẻ mới'}
            </h1>
        </div>
        <div className="flex gap-2">
             <Button onClick={handleAiGenerate} variant="secondary" disabled={isGenerating} className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2" />}
                Viết bằng AI
            </Button>
            <Button onClick={handleSave} className="shadow-lg">
                <Save className="w-5 h-5 mr-2" />
                {isSaving ? 'Đang lưu...' : 'Lưu bài viết'}
            </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <Card className="p-6">
                 <div className="space-y-4">
                     <Input 
                        label="Tiêu đề bài viết"
                        value={post.title}
                        onChange={e => setPost({...post, title: e.target.value})}
                     />
                     <Input 
                        label="Đường dẫn (Slug)"
                        value={post.slug}
                        onChange={e => setPost({...post, slug: e.target.value})}
                        placeholder="tu-dong-tao-tu-tieu-de"
                     />
                     
                     {/* Location Fields for Tea Points */}
                     {post.category === 'tea' && (
                         <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-3 animate-in fade-in">
                             <h4 className="font-bold flex items-center gap-2 text-stone-700">
                                 <MapPin className="w-4 h-4" /> Vị trí (Google Maps)
                             </h4>
                             <p className="text-xs text-stone-500">
                                Nhập địa chỉ hiển thị và dán link từ Google Maps để người dùng dễ dàng tìm kiếm.
                             </p>
                             
                             <Input 
                                label="Địa chỉ hiển thị"
                                placeholder="VD: Tầng 3, Tòa nhà X, Đường Y..."
                                value={post.location?.address || ''}
                                onChange={e => setPost({
                                    ...post, 
                                    location: { ...(post.location || { address: '', link: '' }), address: e.target.value }
                                })}
                             />
                             <Input 
                                label="Link Google Maps (URL)"
                                placeholder="https://maps.google.com/..."
                                value={post.location?.link || ''}
                                onChange={e => setPost({
                                    ...post, 
                                    location: { ...(post.location || { address: '', link: '' }), link: e.target.value }
                                })}
                             />
                             <div className="text-right">
                                <a 
                                    href="https://www.google.com/maps" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-xs text-blue-600 hover:underline flex items-center justify-end gap-1"
                                >
                                    Mở Google Maps để lấy link <ExternalLink className="w-3 h-3"/>
                                </a>
                             </div>
                         </div>
                     )}

                    {/* Date Field for Events */}
                    {post.category === 'event' && (
                         <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3 animate-in fade-in">
                             <h4 className="font-bold flex items-center gap-2 text-amber-700">
                                 <Calendar className="w-4 h-4" /> Thời gian sự kiện
                             </h4>
                             <Input 
                                type="date"
                                label="Ngày diễn ra"
                                value={post.eventDate ? post.eventDate.split('T')[0] : ''}
                                onChange={e => {
                                    const val = e.target.value;
                                    setPost({...post, eventDate: val ? new Date(val).toISOString() : undefined})
                                }}
                             />
                         </div>
                    )}

                     <Textarea 
                        label="Mô tả ngắn (Excerpt)"
                        value={post.excerpt}
                        onChange={e => setPost({...post, excerpt: e.target.value})}
                        rows={3}
                     />
                     <Textarea 
                        label="Nội dung chi tiết (HTML/Markdown)"
                        value={post.content}
                        onChange={e => setPost({...post, content: e.target.value})}
                        rows={15}
                        className="font-mono text-sm"
                     />
                 </div>
             </Card>
          </div>

          <div className="space-y-6">
              <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Phân loại & Trạng thái</h3>
                  <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-stone-700 mb-1 block">Chuyên mục</label>
                        <select 
                            className="w-full border rounded-md p-2 bg-white"
                            value={post.category || 'story'}
                            onChange={e => setPost({...post, category: e.target.value as BlogCategory})}
                        >
                            <option value="solution">Tặng giải pháp</option>
                            <option value="story">Câu chuyện chị em</option>
                            <option value="event">Lịch sự kiện</option>
                            <option value="tea">Điểm trà tâm giao</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-stone-700 mb-1 block">Trạng thái</label>
                        <select 
                            className="w-full border rounded-md p-2 bg-white"
                            value={post.status}
                            onChange={e => setPost({...post, status: e.target.value as any})}
                        >
                            <option value="published">Công khai (Published)</option>
                            <option value="draft">Bản nháp (Draft)</option>
                        </select>
                      </div>
                  </div>
              </Card>

              <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Ảnh bìa</h3>
                    <Button size="sm" variant="outline" onClick={() => setShowMediaPicker(true)}>
                        <ImageIcon className="w-4 h-4 mr-2"/> Chọn ảnh
                    </Button>
                  </div>
                  
                  {post.coverImage ? (
                      <div className="mt-2 rounded-lg overflow-hidden border border-stone-200 relative group">
                          <img src={post.coverImage} alt="Cover" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setPost({...post, coverImage: ''})}
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                  ) : (
                      <div className="py-8 text-center text-stone-400 border border-dashed rounded bg-stone-50">
                          Chưa có ảnh bìa
                      </div>
                  )}
                  <Input 
                    className="mt-4"
                    label="Hoặc dán URL trực tiếp"
                    value={post.coverImage}
                    onChange={e => setPost({...post, coverImage: e.target.value})}
                    placeholder="https://..."
                  />
              </Card>
          </div>
      </div>
    </div>
  );
};

export const BlogManager = () => {
    const [selected, setSelected] = useState<BlogPost | null>(null);

    if (selected) {
        return <BlogEditor post={selected} onBack={() => setSelected(null)} />;
    }
    return <BlogList onSelect={setSelected} />;
};
