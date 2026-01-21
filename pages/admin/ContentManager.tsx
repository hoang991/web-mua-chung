
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { PageData, SectionContent } from '../../types';
import { Card, Button, Input, Textarea } from '../../components/Shared';
import { Edit, Save, ArrowLeft, Eye, EyeOff, Layout, ArrowUp, ArrowDown, Globe, Plus, Trash2, Loader2 } from 'lucide-react';

const PageList = ({ onSelect }: { onSelect: (slug: string) => void }) => {
  const [pages, setPages] = useState<PageData[]>([]);

  useEffect(() => {
    setPages(storageService.getPages());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-stone-900">Quản lý Trang</h1>
      </div>
      <div className="grid gap-4">
        {pages.map(page => (
          <Card key={page.slug} className="p-6 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-2">
                 <h3 className="font-bold text-lg">{page.title}</h3>
                 <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {page.status}
                 </span>
              </div>
              <p className="text-sm text-stone-500">/{page.slug}</p>
              <p className="text-xs text-stone-400 mt-1">Updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
            </div>
            <Button variant="outline" onClick={() => onSelect(page.slug)}>
              <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const PageEditor = ({ slug, onBack }: { slug: string; onBack: () => void }) => {
  const [page, setPage] = useState<PageData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const data = storageService.getPage(slug);
    if (data) setPage(data);
  }, [slug]);

  const handleSave = async () => {
    if (!page) return;
    setIsSaving(true);
    try {
        await storageService.savePage(page);
    } catch(err) {
        console.error(err);
        alert('Có lỗi khi lưu!');
    } finally {
        setIsSaving(false);
    }
  };

  const updateSection = (idx: number, updates: Partial<SectionContent>) => {
    if (!page) return;
    const newSections = [...page.sections];
    newSections[idx] = { ...newSections[idx], ...updates };
    setPage({ ...page, sections: newSections });
  };

  const updateSectionItem = (sectionIdx: number, itemIdx: number, updates: any) => {
    if (!page) return;
    const newSections = [...page.sections];
    const section = newSections[sectionIdx];
    if (section.items) {
        const newItems = [...section.items];
        newItems[itemIdx] = { ...newItems[itemIdx], ...updates };
        section.items = newItems;
        setPage({ ...page, sections: newSections });
    }
  };

  const addSectionItem = (sectionIdx: number) => {
    if (!page) return;
    const newSections = [...page.sections];
    const section = newSections[sectionIdx];
    if (section.items) {
        section.items = [...section.items, { label: 'New', title: '', description: '' }];
        setPage({ ...page, sections: newSections });
    } else {
        // Initialize if empty
         section.items = [{ label: 'New', title: '', description: '' }];
         setPage({ ...page, sections: newSections });
    }
  };

  const removeSectionItem = (sectionIdx: number, itemIdx: number) => {
    if (!page) return;
    const newSections = [...page.sections];
    const section = newSections[sectionIdx];
    if (section.items) {
        section.items = section.items.filter((_, i) => i !== itemIdx);
        setPage({ ...page, sections: newSections });
    }
  };

  const moveSection = (idx: number, direction: 'up' | 'down') => {
      if (!page) return;
      const newSections = [...page.sections];
      if (direction === 'up' && idx > 0) {
          [newSections[idx], newSections[idx - 1]] = [newSections[idx - 1], newSections[idx]];
          // Update order property
          newSections[idx].order = idx + 1;
          newSections[idx - 1].order = idx;
      } else if (direction === 'down' && idx < newSections.length - 1) {
          [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
          newSections[idx].order = idx + 1;
          newSections[idx + 1].order = idx + 2;
      }
      setPage({ ...page, sections: newSections });
  };

  if (!page) return <div>Loading...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} size="sm">
                <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold text-stone-900">Sửa: {page.title}</h1>
        </div>
        <div className="flex gap-2">
            <a href={`#/${page.slug === 'home' ? '' : page.slug}`} target="_blank" rel="noreferrer">
                <Button variant="outline"><Eye className="w-4 h-4 mr-2"/> Xem thử</Button>
            </a>
            <Button onClick={handleSave} className="shadow-lg" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2" />}
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              {/* Sections Editor */}
             <div className="space-y-4">
                <h3 className="font-bold text-lg text-stone-700 flex items-center gap-2">
                    <Layout className="w-5 h-5" /> Các phần nội dung (Sections)
                </h3>
                {page.sections.map((section, idx) => (
                    <Card key={section.id} className={`p-5 border transition-colors ${section.isVisible ? 'border-stone-200' : 'border-stone-100 bg-stone-50 opacity-60'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-bold uppercase">{section.type}</span>
                                <span className="text-xs text-stone-400">#{idx + 1}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-1.5 hover:bg-stone-100 rounded disabled:opacity-30"><ArrowUp className="w-4 h-4"/></button>
                                <button onClick={() => moveSection(idx, 'down')} disabled={idx === page.sections.length - 1} className="p-1.5 hover:bg-stone-100 rounded disabled:opacity-30"><ArrowDown className="w-4 h-4"/></button>
                                <div className="w-px h-4 bg-stone-200 mx-1"></div>
                                <button 
                                onClick={() => updateSection(idx, { isVisible: !section.isVisible })}
                                className={`p-1.5 rounded-full transition-colors ${section.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-500'}`}
                                title="Toggle Visibility"
                                >
                                    {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {section.isVisible && (
                            <div className="space-y-4 animate-in fade-in">
                                <Input 
                                    label="Tiêu đề chính (Headline)"
                                    value={section.title}
                                    onChange={(e) => updateSection(idx, { title: e.target.value })}
                                />
                                {section.type !== 'diagram' && section.type !== 'timeline' && (
                                    <Textarea 
                                        label={section.type === 'hero' ? 'Mô tả ngắn (Subtitle)' : 'Nội dung chi tiết'}
                                        value={section.subtitle || section.content || ''}
                                        onChange={(e) => section.type === 'hero' ? updateSection(idx, { subtitle: e.target.value }) : updateSection(idx, { content: e.target.value })}
                                        rows={3}
                                    />
                                )}
                                {section.type === 'timeline' && (
                                     <Textarea 
                                        label="Mô tả ngắn"
                                        value={section.subtitle || ''}
                                        onChange={(e) => updateSection(idx, { subtitle: e.target.value })}
                                        rows={2}
                                    />
                                )}
                                
                                {/* Generic Item Editor for Timeline, Features, and Image-Text */}
                                {['timeline', 'features', 'image-text'].includes(section.type) && (
                                    <div className="mt-4 border-t pt-4">
                                        <label className="text-sm font-bold text-stone-700 block mb-2">
                                            {section.type === 'timeline' ? 'Các bước thực hiện' : 'Các mục chi tiết (Items)'}
                                        </label>
                                        <div className="space-y-3">
                                            {section.items?.map((item, itemIdx) => (
                                                <div key={itemIdx} className="bg-stone-50 p-3 rounded border border-stone-200 flex gap-4 items-start">
                                                     {section.type === 'timeline' && (
                                                         <div className="w-24">
                                                             <label className="text-[10px] uppercase font-bold text-stone-400">Label</label>
                                                             <input 
                                                                className="w-full text-sm border rounded px-2 py-1"
                                                                value={item.label}
                                                                onChange={(e) => updateSectionItem(idx, itemIdx, { label: e.target.value })}
                                                             />
                                                         </div>
                                                     )}
                                                     <div className="flex-1 space-y-2">
                                                         <div>
                                                            <label className="text-[10px] uppercase font-bold text-stone-400">Tiêu đề</label>
                                                            <input 
                                                                className="w-full text-sm font-bold border rounded px-2 py-1"
                                                                value={item.title}
                                                                onChange={(e) => updateSectionItem(idx, itemIdx, { title: e.target.value })}
                                                            />
                                                         </div>
                                                         <div>
                                                             <label className="text-[10px] uppercase font-bold text-stone-400">Mô tả</label>
                                                             <textarea 
                                                                className="w-full text-sm border rounded px-2 py-1"
                                                                rows={2}
                                                                value={item.description}
                                                                onChange={(e) => updateSectionItem(idx, itemIdx, { description: e.target.value })}
                                                            />
                                                         </div>
                                                     </div>
                                                     <button onClick={() => removeSectionItem(idx, itemIdx)} className="text-red-400 hover:text-red-600 p-1">
                                                         <Trash2 className="w-4 h-4" />
                                                     </button>
                                                </div>
                                            ))}
                                            <Button size="sm" variant="secondary" onClick={() => addSectionItem(idx)} className="w-full">
                                                <Plus className="w-4 h-4 mr-2" /> Thêm mục mới
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {(section.type === 'image-text' || section.type === 'hero') && (
                                     <Input 
                                        label="Link Ảnh (URL)"
                                        value={section.image || ''}
                                        placeholder="https://..."
                                        onChange={(e) => updateSection(idx, { image: e.target.value })}
                                    />
                                )}
                                {section.type === 'hero' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input 
                                            label="Nút hành động (CTA Text)"
                                            value={section.ctaText || ''}
                                            onChange={(e) => updateSection(idx, { ctaText: e.target.value })}
                                        />
                                        <Input 
                                            label="Link (CTA Link)"
                                            value={section.ctaLink || ''}
                                            onChange={(e) => updateSection(idx, { ctaLink: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>
                ))}
             </div>
          </div>

          <div className="space-y-6">
              {/* SEO Settings */}
              <Card className="p-5">
                 <h3 className="font-bold text-lg mb-4 text-stone-700 flex items-center gap-2">
                    <Globe className="w-5 h-5" /> Cấu hình SEO
                 </h3>
                 <div className="space-y-4">
                    <Input 
                        label="Meta Title"
                        value={page.metaTitle || page.title}
                        onChange={(e) => setPage({...page, metaTitle: e.target.value})}
                    />
                     <Textarea 
                        label="Meta Description"
                        rows={3}
                        value={page.metaDescription || ''}
                        onChange={(e) => setPage({...page, metaDescription: e.target.value})}
                    />
                    <div className="text-xs text-stone-500">
                        Preview: <br/>
                        <span className="text-blue-600 font-medium text-sm">{page.metaTitle || page.title}</span><br/>
                        <span className="text-green-700">{window.location.host}/{page.slug}</span><br/>
                        <span className="text-stone-600">{page.metaDescription?.substring(0, 150)}...</span>
                    </div>
                 </div>
              </Card>

              {/* Status */}
              <Card className="p-5">
                  <h3 className="font-bold text-lg mb-4 text-stone-700">Trạng thái</h3>
                  <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={page.status === 'published' ? 'primary' : 'outline'}
                        onClick={() => setPage({...page, status: 'published'})}
                        className="flex-1"
                      >
                          Published
                      </Button>
                      <Button 
                        size="sm" 
                        variant={page.status === 'draft' ? 'primary' : 'outline'}
                        onClick={() => setPage({...page, status: 'draft'})}
                         className="flex-1"
                      >
                          Draft
                      </Button>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};

export const ContentManager = () => {
    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    if (selectedPage) {
        return <PageEditor slug={selectedPage} onBack={() => setSelectedPage(null)} />;
    }
    return <PageList onSelect={setSelectedPage} />;
};
