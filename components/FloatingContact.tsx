
import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';
import { storageService } from '../services/store';

export const FloatingContact = () => {
    const [isOpen, setIsOpen] = useState(false);
    const config = storageService.getConfig();
    const zaloInput = config.socialLinks.zalo;
    const telegramInput = config.socialLinks.telegram;

    // Helper to generate QR URL using a public API
    const getQrUrl = (data: string) => `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;

    // Helper to format Zalo Link
    const getZaloUrl = (input?: string) => {
        if (!input) return null;
        if (input.startsWith('http')) return input;
        return `https://zalo.me/${input}`;
    };

    // Helper to format Telegram Link
    const getTelegramUrl = (input?: string) => {
        if (!input) return null;
        if (input.startsWith('http')) return input;
        const cleanUsername = input.replace('@', '');
        return `https://t.me/${cleanUsername}`;
    };

    const zaloUrl = getZaloUrl(zaloInput);
    const telegramUrl = getTelegramUrl(telegramInput);

    return (
        <>
            {/* Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>

            {/* Popup */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-40 bg-white rounded-xl shadow-2xl border border-stone-200 p-4 w-72 animate-in slide-in-from-bottom-5 fade-in">
                    <h3 className="font-bold text-center mb-4 text-stone-800">Chat với chúng tôi</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Zalo */}
                        <a 
                            href={zaloUrl || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`text-center group block ${!zaloUrl ? 'pointer-events-none opacity-50' : ''}`}
                        >
                            <div className="bg-stone-100 rounded-lg p-2 mb-2 aspect-square flex items-center justify-center overflow-hidden relative border border-transparent group-hover:border-blue-500 transition-colors">
                                {zaloUrl ? (
                                    <>
                                        <img src={getQrUrl(zaloUrl)} alt="Zalo QR" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <ExternalLink className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-xs text-stone-400">Chưa có<br/>Zalo</span>
                                )}
                            </div>
                            <span className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1">
                                Zalo
                            </span>
                        </a>

                        {/* Telegram */}
                        <a 
                            href={telegramUrl || '#'} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`text-center group block ${!telegramUrl ? 'pointer-events-none opacity-50' : ''}`}
                        >
                             <div className="bg-stone-100 rounded-lg p-2 mb-2 aspect-square flex items-center justify-center overflow-hidden relative border border-transparent group-hover:border-sky-500 transition-colors">
                                {telegramUrl ? (
                                    <>
                                        <img src={getQrUrl(telegramUrl)} alt="Telegram QR" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <ExternalLink className="w-6 h-6 text-sky-500" />
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-xs text-stone-400">Chưa có<br/>Tele</span>
                                )}
                            </div>
                            <span className="text-xs font-bold text-sky-500 flex items-center justify-center gap-1">
                                Telegram
                            </span>
                        </a>
                    </div>
                    <div className="mt-4 pt-3 border-t text-center">
                        <p className="text-xs text-stone-500">Quét mã hoặc bấm vào ảnh để chat</p>
                    </div>
                </div>
            )}
        </>
    );
};
