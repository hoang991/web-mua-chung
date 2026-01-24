
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { MediaItem } from '../../types';
import { Button, Input } from '../../components/Shared';
import { Image, X, Check, Link as LinkIcon, Plus } from 'lucide-react';

interface MediaPickerProps {
    onSelect: (result: any) => void; // Can be string or string[]
    onClose: () => void;
    allowMultiple?: boolean;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ onSelect, onClose, allowMultiple = false }) => {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [customUrl, setCustomUrl] = useState('');
    const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

    useEffect(() => {
        setMedia(storageService.getMedia());
    }, []);

    const handleCustomUrl = (e: React.FormEvent) => {
        e.preventDefault();
        if (customUrl) {
            // For custom URL, we treat it as single selection or append to list if multiple
            if (allowMultiple) {
                setSelectedUrls(prev => [...prev, customUrl]);
                setCustomUrl('');
            } else {
                onSelect(customUrl);
                onClose();
            }
        }
    };

    const handleItemClick = (url: string) => {
        if (allowMultiple) {
            if (selectedUrls.includes(url)) {
                setSelectedUrls(prev => prev.filter(u => u !== url));
            } else {
                setSelectedUrls(prev => [...prev, url]);
            }
        } else {
            onSelect(url);
            onClose();
        }
    };

    const handleConfirmMultiple = () => {
        onSelect(selectedUrls);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Image className="w-5 h-5 text-emerald-600" /> 
                        {allowMultiple ? 'Chọn nhiều hình ảnh' : 'Chọn hình ảnh'}
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
                        <Button type="submit" variant="secondary">
                            <LinkIcon className="w-4 h-4 mr-2"/> 
                            {allowMultiple ? 'Thêm URL' : 'Sử dụng URL'}
                        </Button>
                    </form>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-stone-50/50">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {media.map(item => {
                            const isSelected = selectedUrls.includes(item.url);
                            return (
                                <div 
                                    key={item.id} 
                                    onClick={() => handleItemClick(item.url)}
                                    className={`group cursor-pointer relative aspect-square rounded-lg border overflow-hidden transition-all ${isSelected ? 'ring-4 ring-emerald-500 border-emerald-500' : 'border-stone-200 hover:ring-2 ring-emerald-300'}`}
                                >
                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                    
                                    {/* Selection Overlay */}
                                    {(isSelected || !allowMultiple) && (
                                         <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isSelected ? 'bg-emerald-500/20 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
                                            {allowMultiple ? (
                                                isSelected && <div className="bg-emerald-500 text-white rounded-full p-1"><Check className="w-4 h-4" /></div>
                                            ) : (
                                                <Check className="w-8 h-8 text-white" />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {media.length === 0 && (
                            <div className="col-span-full py-12 text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-lg bg-white">
                                <p>Thư viện trống. Hãy vào mục "Thư viện ảnh" để tải lên hoặc dán link trực tiếp ở trên.</p>
                            </div>
                        )}
                    </div>
                </div>

                {allowMultiple && (
                    <div className="p-4 border-t bg-white flex justify-between items-center rounded-b-xl">
                        <span className="text-sm text-stone-600">Đã chọn: <strong>{selectedUrls.length}</strong> ảnh</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" onClick={onClose}>Hủy</Button>
                            <Button onClick={handleConfirmMultiple} disabled={selectedUrls.length === 0}>
                                <Plus className="w-4 h-4 mr-2" /> Thêm {selectedUrls.length} ảnh
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
