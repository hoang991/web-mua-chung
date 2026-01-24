
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { SupplierPost } from '../../types';
import { Card, Button, Input, Textarea, AIModal } from '../../components/Shared';
import { MediaPicker } from './MediaPicker';
import { Plus, Trash2, Edit, Save, ArrowLeft, Image as ImageIcon, Sparkles, Loader2, Pencil, Video } from 'lucide-react';

const SupplierPostList = ({ onSelect }: { onSelect: (post: SupplierPost) => void }) => {
  const [posts, setPosts] = useState<SupplierPost[]>([]);

  useEffect(() => {
    setPosts(storageService.getSupplierPosts());
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation(); // Stop propagation
      if(window.confirm('Xóa bài viết này? Hành động này không thể hoàn tác.')) {
          await storageService.deleteSupplierPost(id);
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
          videoUrl: '', // Init videoUrl
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
                 {p.videoUrl && <Video className="w-4 h-4 text-red-500" />}
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
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  
  // AI Modal
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetField, setAiTargetField] = useState<'bulk' | 'content' | 'title'>('content');

  const handleSave = async () => {
    if (!post.title) return alert("Vui lòng nhập tiêu đề");
    setIsSaving(true);
    const finalPost = {
        ...post,
        slug: post.slug || post.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }
    try {
        await storageService.saveSupplierPost(finalPost);
        onBack();
    } catch(err) {
        console.error(err);
        alert("Lỗi khi lưu bài viết");
    } finally {
        setIsSaving(false);
    }
  };

  const openAiModal = (field: 'bulk' | 'content' | 'title') => {
      setAiTargetField(field);
      setAiModalOpen(true);
  };

  const handleAiGenerated = (data: any) => {
      if (aiTargetField === 'bulk') {
          setPost(prev => ({
              ...prev,
              title: data.title,
              slug: data.slug,
              content: data.content
          }));
      } else {
          setPost(prev => ({ ...prev, [aiTargetField]: data }));
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

      <AIModal 
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onGenerate={handleAiGenerated}
        initialPrompt={aiTargetField === 'bulk' ? '' : (post.title || '')}
        type={aiTargetField === 'bulk' ? 'bulk_supplier' : (aiTargetField === 'title' ? 'title' : 'content')}
      />

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
            <Button onClick={() => openAiModal('bulk')} className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200">
                <Sparkles className="w-4 h-4 mr-2" /> AI Viết toàn bộ
            </Button>
            <Button onClick={handleSave} className="shadow-lg" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2" />}
                {isSaving ? 'Đang lưu...' : 'Lưu bài viết'}
            </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <Card className="p-6">
                 <div className="space-y-4">
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-stone-700">Tiêu đề bài viết</label>
                             <button onClick={() => openAiModal('title')} className="text-xs text-purple-600 flex items-center gap-1 hover:underline"><Sparkles className="w-3 h-3"/> AI Gợi ý</button>
                        </div>
                        <Input 
                            value={post.title}
                            onChange={e => setPost({...post, title: e.target.value})}
                        />
                     </div>
                     <Input 
                        label="Slug (URL)"
                        value={post.slug}
                        onChange={e => setPost({...post, slug: e.target.value})}
                        placeholder="Tu dong tao neu de trong"
                     />
                     
                     <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 space-y-2">
                         <Input 
                            label="Link Video (Youtube/Vimeo)"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={post.videoUrl || ''}
                            onChange={e => setPost({...post, videoUrl: e.target.value})}
                        />
                     </div>

                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-stone-700">Nội dung bài viết (HTML/Markdown)</label>
                            <button onClick={() => openAiModal('content')} className="text-xs text-purple-600 flex items-center gap-1 hover:underline"><Sparkles className="w-3 h-3"/> AI Viết</button>
                        </div>
                        <Textarea 
                            value={post.content}
                            onChange={e => setPost({...post, content: e.target.value})}
                            rows={15}
                            className="font-mono text-sm"
                        />
                     </div>
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
