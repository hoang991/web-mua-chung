import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { MediaItem } from '../../types';
import { Button, Input } from '../../components/Shared';
import { Image, X, Check, Link as LinkIcon } from 'lucide-react';

interface MediaPickerProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose }) => {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [customUrl, setCustomUrl] = useState('');

    useEffect(() => {
        setMedia(storageService.getMedia());
    }, []);

    const handleCustomUrl = (e: React.FormEvent) => {
        e.preventDefault();
        if (customUrl) {
            onSelect(customUrl);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Image className="w-5 h-5 text-emerald-600" /> Chọn hình ảnh
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded-full">
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>

                <div className="p-4 bg-stone-50 border-b">
                    <form onSubmit={handleCustomUrl} className="flex gap-2">
                        <div className="flex-1">
                            <Input 
                                placeholder="Dán đường dẫn ảnh (URL) từ bên ngoài..." 
                                value={customUrl}
                                onChange={e => setCustomUrl(e.target.value)}
                                className="bg-white"
                            />
                        </div>
                        <Button type="submit" variant="secondary"><LinkIcon className="w-4 h-4 mr-2"/> Sử dụng URL</Button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {media.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => { onSelect(item.url); onClose(); }}
                                className="group cursor-pointer relative aspect-square rounded-lg border border-stone-200 overflow-hidden hover:ring-2 ring-emerald-500 transition-all"
                            >
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Check className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        ))}
                        {media.length === 0 && (
                            <div className="col-span-full py-12 text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-lg">
                                <p>Thư viện trống. Hãy vào mục "Thư viện ảnh" để tải lên hoặc dán link trực tiếp ở trên.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
