
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { MediaItem } from '../../types';
import { Card, Button, Input } from '../../components/Shared';
import { Image, Trash2, Link as LinkIcon, Plus, Check, Loader2, UploadCloud } from 'lucide-react';

export const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setMedia(storageService.getMedia());
    // Subscribe to realtime updates
    const unsubscribe = storageService.subscribe(() => {
        setMedia(storageService.getMedia());
    });
    return unsubscribe;
  }, []);

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setIsAdding(true);
    try {
        await storageService.addMedia({
            url: newUrl,
            name: `Image ${new Date().toLocaleTimeString()}`,
            type: 'image'
        });
        setNewUrl('');
    } finally {
        setIsAdding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
          const url = await storageService.uploadImage(file);
          if (!url) {
              alert("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
          }
      } finally {
          setIsUploading(false);
          // Reset input
          e.target.value = ''; 
      }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này khỏi thư viện không?")) {
          await storageService.deleteMedia(id);
      }
  };

  const handleCopy = (id: string, url: string) => {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Thư viện Media</h1>
      
      <div className="grid md:grid-cols-2 gap-4">
          {/* Upload File */}
          <Card className="p-6 bg-white border-dashed border-2 border-stone-300 flex flex-col items-center justify-center text-center">
             <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
             />
             <label 
                htmlFor="file-upload" 
                className={`cursor-pointer flex flex-col items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}
             >
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                     {isUploading ? <Loader2 className="w-6 h-6 animate-spin"/> : <UploadCloud className="w-6 h-6"/>}
                 </div>
                 <span className="font-bold text-stone-700">
                     {isUploading ? 'Đang tải lên...' : 'Tải ảnh lên từ máy tính'}
                 </span>
                 <span className="text-xs text-stone-400">JPG, PNG, GIF (Max 5MB)</span>
             </label>
          </Card>

          {/* Add URL */}
          <Card className="p-6 bg-stone-50 flex flex-col justify-center">
             <form onSubmit={handleAddUrl} className="flex gap-2 items-end">
                 <div className="flex-1">
                     <Input 
                        label="Hoặc thêm từ URL" 
                        placeholder="https://example.com/image.jpg" 
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                    />
                 </div>
                 <Button type="submit" disabled={isAdding} variant="secondary">
                     {isAdding ? <Loader2 className="w-4 h-4 animate-spin"/> : <Plus className="w-4 h-4" />}
                 </Button>
             </form>
          </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
         {media.map(item => (
             <div key={item.id} className="group relative bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col">
                 <div className="aspect-square w-full bg-stone-100 relative">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                 </div>
                 
                 <div className="p-2 flex items-center justify-between bg-white border-t border-stone-100">
                     <button 
                        onClick={() => handleCopy(item.id, item.url)}
                        className={`flex-1 flex items-center justify-center gap-1 text-xs py-1.5 px-2 rounded transition-colors ${copiedId === item.id ? 'bg-green-100 text-green-700' : 'hover:bg-stone-100 text-stone-600'}`}
                        title="Sao chép Link"
                     >
                         {copiedId === item.id ? <Check className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                         {copiedId === item.id ? 'Đã copy' : 'Copy Link'}
                     </button>
                     <div className="w-px h-4 bg-stone-200 mx-1"></div>
                     <button 
                        onClick={(e) => handleDelete(e, item.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                        title="Xóa ảnh"
                     >
                         <Trash2 className="w-4 h-4" />
                     </button>
                 </div>
             </div>
         ))}
         {media.length === 0 && (
             <div className="col-span-full py-12 text-center text-stone-400">
                 <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                 <p>Chưa có ảnh nào trong thư viện</p>
             </div>
         )}
      </div>
    </div>
  );
};
