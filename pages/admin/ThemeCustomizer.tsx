
import React, { useState } from 'react';
import { storageService } from '../../services/store';
import { SiteConfig, ThemeColor, ThemeFont } from '../../types';
import { Card, Button, Input } from '../../components/Shared';
import { Palette, Type, Save, Menu as MenuIcon, Eye, EyeOff, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

export const ThemeCustomizer = () => {
  const [config, setConfig] = useState<SiteConfig>(storageService.getConfig());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
      setIsSaving(true);
      try {
          await storageService.saveConfig(config);
          // Reload to apply theme globally
          window.location.reload(); 
      } catch (err) {
          console.error(err);
          setIsSaving(false);
          alert('Có lỗi khi lưu giao diện');
      }
  };

  const colors: {id: ThemeColor, hex: string}[] = [
      { id: 'emerald', hex: '#059669' },
      { id: 'blue', hex: '#2563eb' },
      { id: 'rose', hex: '#e11d48' },
      { id: 'amber', hex: '#d97706' },
      { id: 'slate', hex: '#475569' },
      { id: 'violet', hex: '#7c3aed' },
  ];

  const fonts: {id: ThemeFont, name: string}[] = [
      { id: 'inter', name: 'Inter (Hiện đại - Mặc định)' },
      { id: 'serif', name: 'Serif (Trang trọng)' },
      { id: 'merriweather', name: 'Merriweather (Báo chí/Blog)' },
      { id: 'playfair', name: 'Playfair (Sang trọng)' },
      { id: 'roboto', name: 'Roboto (Google Standard)' },
      { id: 'patrick', name: 'Patrick Hand (Viết tay - Cute)' },
      { id: 'dancing', name: 'Dancing Script (Nghệ thuật)' },
      { id: 'mono', name: 'Mono (Kỹ thuật)' },
  ];

  const updateMenu = (idx: number, updates: any) => {
      const newMenu = [...config.mainMenu];
      newMenu[idx] = { ...newMenu[idx], ...updates };
      setConfig({ ...config, mainMenu: newMenu });
  };

  const moveMenu = (idx: number, direction: 'up' | 'down') => {
      const newMenu = [...config.mainMenu];
       if (direction === 'up' && idx > 0) {
          [newMenu[idx], newMenu[idx - 1]] = [newMenu[idx - 1], newMenu[idx]];
          newMenu[idx].order = idx + 1;
          newMenu[idx - 1].order = idx;
      } else if (direction === 'down' && idx < newMenu.length - 1) {
          [newMenu[idx], newMenu[idx + 1]] = [newMenu[idx + 1], newMenu[idx]];
          newMenu[idx].order = idx + 1;
          newMenu[idx + 1].order = idx + 2;
      }
      setConfig({ ...config, mainMenu: newMenu });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-stone-900">Giao diện & Menu</h1>
          <Button onClick={handleSave} className="shadow-lg" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2" />}
                {isSaving ? 'Đang lưu...' : 'Lưu & Áp dụng'}
          </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
              <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Palette className="w-5 h-5"/> Màu chủ đạo</h3>
                  <div className="flex gap-4 flex-wrap">
                      {colors.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setConfig({...config, primaryColor: c.id})}
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${config.primaryColor === c.id ? 'border-stone-800 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c.hex }}
                          >
                              {config.primaryColor === c.id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </button>
                      ))}
                  </div>
              </Card>

              <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Type className="w-5 h-5"/> Phông chữ</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                      {fonts.map(f => (
                          <div 
                            key={f.id}
                            onClick={() => setConfig({...config, font: f.id})}
                            className={`p-3 rounded border cursor-pointer flex justify-between items-center ${config.font === f.id ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 hover:bg-stone-50'}`}
                          >
                              <span style={{ 
                                fontFamily: f.id === 'merriweather' ? "'Merriweather', serif" :
                                            f.id === 'playfair' ? "'Playfair Display', serif" :
                                            f.id === 'patrick' ? "'Patrick Hand', cursive" :
                                            f.id === 'dancing' ? "'Dancing Script', cursive" :
                                            f.id === 'roboto' ? "'Roboto', sans-serif" :
                                            'inherit'
                              }}>{f.name}</span>
                              {config.font === f.id && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
                          </div>
                      ))}
                  </div>
              </Card>
          </div>

          <div>
              <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MenuIcon className="w-5 h-5"/> Menu điều hướng</h3>
                  <div className="space-y-3">
                      {config.mainMenu.map((item, idx) => (
                          <div key={item.id} className="flex items-center gap-2 p-3 bg-stone-50 rounded border border-stone-200">
                              <div className="flex flex-col gap-1">
                                  <button onClick={() => moveMenu(idx, 'up')} disabled={idx === 0} className="hover:text-emerald-600 disabled:opacity-20"><ArrowUp className="w-4 h-4"/></button>
                                  <button onClick={() => moveMenu(idx, 'down')} disabled={idx === config.mainMenu.length - 1} className="hover:text-emerald-600 disabled:opacity-20"><ArrowDown className="w-4 h-4"/></button>
                              </div>
                              <div className="flex-1 space-y-2">
                                  <Input 
                                    className="h-8 text-sm" 
                                    value={item.name} 
                                    onChange={(e) => updateMenu(idx, { name: e.target.value })}
                                    placeholder="Tên menu"
                                  />
                                  <Input 
                                    className="h-8 text-sm text-stone-500 font-mono" 
                                    value={item.path}
                                    onChange={(e) => updateMenu(idx, { path: e.target.value })}
                                    placeholder="/duong-dan"
                                  />
                              </div>
                              <button 
                                onClick={() => updateMenu(idx, { isVisible: !item.isVisible })}
                                className={`p-2 rounded hover:bg-stone-200 ${item.isVisible ? 'text-emerald-600' : 'text-stone-400'}`}
                              >
                                  {item.isVisible ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
                              </button>
                          </div>
                      ))}
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};
