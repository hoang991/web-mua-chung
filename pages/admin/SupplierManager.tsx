
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { aiService } from '../../services/mockAI';
import { SupplierPost } from '../../types';
import { Card, Button, Input, Textarea } from '../../components/Shared';
import { MediaPicker } from './MediaPicker';
import { Plus, Trash2, Edit, Save, ArrowLeft, Image as ImageIcon, Sparkles, Loader2, Pencil } from 'lucide-react';

const SupplierPostList = ({ onSelect }: { onSelect: (post: SupplierPost) => void }) => {
  const [posts, setPosts] = useState<SupplierPost[]>([]);

  useEffect(() => {
    setPosts(storageService.getSupplierPosts());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Stop propagation
      if(window.confirm('Xóa bài viết này? Hành động này không thể hoàn tác.')) {
          storageService.deleteSupplierPost(id);
          setPosts(storageService.getSupplierPosts());
      }
  };

  const handleEditClick = (post: SupplierPost, e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(post);
  };

  const handleCreate = () => {
      const newPost: SupplierPost = {
          id: Math.random().toString(36).substr(2, 9),
          title: '', // Empty to start
          slug: '',
          content: '',
          coverImage: '',
          status: 'draft',
          updatedAt: new Date().toISOString()
      };
      onSelect(newPost);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-stone-900">Bài viết Hợp tác NSX</h1>
         <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2"/> Viết bài mới</Button>
      </div>
      <div className="grid gap-4">
        {posts.map(p => (
          <Card key={p.id} className="p-4 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(p)}>
            <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                {p.coverImage ? <img src={p.coverImage} alt="" className="w-full h-full object-cover"/> : <ImageIcon className="w-8 h-8 m-auto text-stone-300 h-full"/>}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-bold text-lg">{p.title || '(Chưa đặt tiêu đề)'}</h3>
                 <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                 </span>
              </div>
              <p className="text-sm text-stone-500">Cập nhật: {new Date(p.updatedAt).toLocaleDateString()}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={(e) => handleEditClick(p, e)}
                    title="Chỉnh sửa"
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
        ))}
        {posts.length === 0 && (
            <div className="text-center py-16 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
                <p className="text-stone-500 mb-4">Chưa có bài viết nào.</p>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2"/> Tạo bài viết đầu tiên</Button>
            </div>
        )}
      </div>
    </div>
  );
};

const PostEditor = ({ post: initialPost, onBack }: { post: SupplierPost; onBack: () => void }) => {
  const [post, setPost] = useState<SupplierPost>(initialPost);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSave = () => {
    if (!post.title) return alert("Vui lòng nhập tiêu đề");
    setIsSaving(true);
    const finalPost = {
        ...post,
        slug: post.slug || post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }
    storageService.saveSupplierPost(finalPost);
    setTimeout(() => {
        setIsSaving(false);
        onBack();
    }, 500);
  };

  const handleAiGenerate = async () => {
      if (!post.title) return alert("Vui lòng nhập tiêu đề bài viết để AI có thể viết nội dung.");
      setIsGenerating(true);
      try {
          const content = await aiService.generateSupplierPost(post.title);
          setPost(prev => ({
              ...prev,
              content: content
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
                {post.title || 'Bài viết mới'}
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
                        label="Slug (URL)"
                        value={post.slug}
                        onChange={e => setPost({...post, slug: e.target.value})}
                        placeholder="Tu dong tao neu de trong"
                     />
                     <Textarea 
                        label="Nội dung bài viết (Hỗ trợ HTML/Markdown)"
                        value={post.content}
                        onChange={e => setPost({...post, content: e.target.value})}
                        rows={15}
                        className="font-mono text-sm"
                     />
                     <p className="text-xs text-stone-400">Mẹo: Sử dụng nút "Viết bằng AI" để tạo nội dung mẫu nhanh chóng.</p>
                 </div>
             </Card>
          </div>

          <div className="space-y-6">
              <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Trạng thái</h3>
                  <select 
                    className="w-full border rounded-md p-2 bg-white"
                    value={post.status}
                    onChange={e => setPost({...post, status: e.target.value as any})}
                  >
                      <option value="published">Công khai (Published)</option>
                      <option value="draft">Bản nháp (Draft)</option>
                  </select>
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

export const SupplierManager = () => {
    const [selected, setSelected] = useState<SupplierPost | null>(null);

    if (selected) {
        return <PostEditor post={selected} onBack={() => setSelected(null)} />;
    }
    return <SupplierPostList onSelect={setSelected} />;
};
