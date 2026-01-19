
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { MediaItem } from '../../types';
import { Card, Button, Input } from '../../components/Shared';
import { Image, Trash2, Link as LinkIcon, Plus, Check } from 'lucide-react';

export const MediaLibrary = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMedia(storageService.getMedia());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    storageService.addMedia({
        url: newUrl,
        name: `Image ${new Date().toLocaleTimeString()}`,
        type: 'image'
    });
    setNewUrl('');
    setMedia(storageService.getMedia());
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      // Confirm before delete
      if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này khỏi thư viện không?")) {
          storageService.deleteMedia(id);
          // Update state immediately to reflect changes
          setMedia(storageService.getMedia());
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
      
      <Card className="p-6 bg-stone-50 border-dashed border-2 border-stone-300">
         <form onSubmit={handleAdd} className="flex gap-4 items-end">
             <div className="flex-1">
                 <Input 
                    label="Thêm ảnh từ URL" 
                    placeholder="https://example.com/image.jpg" 
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                />
             </div>
             <Button type="submit"><Plus className="w-4 h-4 mr-2" /> Thêm vào thư viện</Button>
         </form>
         <p className="text-xs text-stone-500 mt-2">
             *Lưu ý: Dán đường dẫn ảnh (Link) từ Internet vào đây.
         </p>
      </Card>

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
