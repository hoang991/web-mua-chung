
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { aiService } from '../../services/mockAI';
import { Product, PricingTier } from '../../types';
import { Card, Button, Input, Textarea } from '../../components/Shared';
import { MediaPicker } from './MediaPicker';
import { Plus, Trash2, Edit, Save, ArrowLeft, Image as ImageIcon, Sparkles, Loader2, Pencil } from 'lucide-react';

const ProductList = ({ onSelect }: { onSelect: (product: Product) => void }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Initial fetch
    setProducts(storageService.getProducts());
    
    // Subscribe to changes (Realtime from Supabase)
    const unsubscribe = storageService.subscribe(() => {
        setProducts(storageService.getProducts());
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if(window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')) {
          await storageService.deleteProduct(id);
      }
  };

  const handleEditClick = (product: Product, e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(product);
  }

  const handleCreate = () => {
      const newProduct: Product = {
          id: Math.random().toString(36).substr(2, 9),
          name: '', 
          slug: '',
          shortDescription: '',
          description: '',
          images: [],
          pricing: [{ minQuantity: 1, price: 0, label: 'Giá lẻ' }],
          category: 'Chung',
          status: 'inactive',
          updatedAt: new Date().toISOString()
      };
      onSelect(newProduct);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-stone-900">Quản lý Sản phẩm</h1>
         <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2"/> Thêm Sản phẩm</Button>
      </div>
      <div className="grid gap-4">
        {products.map(p => (
          <Card key={p.id} className="p-4 flex gap-4 items-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(p)}>
            <div className="w-20 h-20 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200">
                {p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover"/> : <ImageIcon className="w-8 h-8 m-auto text-stone-300 h-full"/>}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-bold text-lg">{p.name || '(Chưa đặt tên)'}</h3>
                 <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {p.status}
                 </span>
              </div>
              <p className="text-sm text-stone-500 line-clamp-1 mb-1">{p.shortDescription || 'Chưa có mô tả'}</p>
              <p className="text-sm font-bold text-emerald-600">
                  {p.pricing[0]?.price.toLocaleString()}đ <span className="text-xs font-normal text-stone-400">/ đơn vị</span>
              </p>
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
                    title="Xóa sản phẩm"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
          </Card>
        ))}
        {products.length === 0 && (
            <div className="text-center py-16 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
                <p className="text-stone-500 mb-4">Chưa có sản phẩm nào.</p>
                <Button onClick={handleCreate}><Plus className="w-4 h-4 mr-2"/> Tạo sản phẩm đầu tiên</Button>
            </div>
        )}
      </div>
    </div>
  );
};

const ProductEditor = ({ product: initialProduct, onBack }: { product: Product; onBack: () => void }) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSave = async () => {
    if (!product.name) return alert("Vui lòng nhập tên sản phẩm");
    setIsSaving(true);
    // If slug is empty, auto-generate from name
    const finalProduct = {
        ...product,
        slug: product.slug || product.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    };
    try {
        await storageService.saveProduct(finalProduct);
        onBack();
    } catch (err) {
        console.error(err);
        alert('Có lỗi khi lưu sản phẩm');
    } finally {
        setIsSaving(false);
    }
  };

  const handleAiGenerate = async () => {
      if (!product.name) return alert("Vui lòng nhập tên sản phẩm trước để AI viết nội dung.");
      setIsGenerating(true);
      try {
          const content = await aiService.generateProductContent(product.name);
          setProduct(prev => ({
              ...prev,
              shortDescription: content.shortDescription,
              description: content.description
          }));
      } catch (error) {
          alert("Lỗi khi tạo nội dung");
      } finally {
          setIsGenerating(false);
      }
  };

  const updatePricing = (idx: number, field: keyof PricingTier, value: any) => {
      const newPricing = [...product.pricing];
      newPricing[idx] = { ...newPricing[idx], [field]: value };
      setProduct({ ...product, pricing: newPricing });
  };

  const addPricingTier = () => {
      setProduct({
          ...product,
          pricing: [...product.pricing, { minQuantity: 10, price: 0, label: '' }]
      });
  };

  const removePricingTier = (idx: number) => {
      setProduct({
          ...product,
          pricing: product.pricing.filter((_, i) => i !== idx)
      });
  };

  const handleImageSelect = (url: string) => {
       setProduct({ ...product, images: [...product.images, url] });
  };

  const removeImage = (idx: number) => {
       setProduct({
          ...product,
          images: product.images.filter((_, i) => i !== idx)
      });
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
                {product.name || 'Sản phẩm mới'}
            </h1>
        </div>
        <div className="flex gap-2">
            <Button onClick={handleAiGenerate} variant="secondary" disabled={isGenerating} className="bg-purple-100 text-purple-700 hover:bg-purple-200">
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2" />}
                Viết bằng AI
            </Button>
            <Button onClick={handleSave} className="shadow-lg" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin"/> : <Save className="w-5 h-5 mr-2" />}
                {isSaving ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <Card className="p-6">
                 <h3 className="font-bold text-lg mb-4">Thông tin cơ bản</h3>
                 <div className="space-y-4">
                     <Input 
                        label="Tên sản phẩm"
                        value={product.name}
                        onChange={e => setProduct({...product, name: e.target.value})}
                        placeholder="VD: Gạo lứt huyết rồng"
                     />
                     <div className="grid grid-cols-2 gap-4">
                        <Input 
                            label="Mã định danh (Slug)"
                            value={product.slug}
                            onChange={e => setProduct({...product, slug: e.target.value})}
                            placeholder="Tu dong tao neu de trong"
                        />
                         <Input 
                            label="Danh mục"
                            value={product.category}
                            onChange={e => setProduct({...product, category: e.target.value})}
                        />
                     </div>
                     <Textarea 
                        label="Mô tả ngắn (Hiển thị ở danh sách)"
                        value={product.shortDescription}
                        onChange={e => setProduct({...product, shortDescription: e.target.value})}
                        rows={3}
                     />
                     <div className="relative">
                        <Textarea 
                            label="Nội dung chi tiết (HTML/Text)"
                            value={product.description}
                            onChange={e => setProduct({...product, description: e.target.value})}
                            rows={15}
                            className="font-mono text-sm"
                        />
                         <p className="text-xs text-stone-400 mt-1">Gợi ý: Dùng nút "Viết bằng AI" ở trên để tự động tạo nội dung hấp dẫn.</p>
                     </div>
                 </div>
             </Card>

             <Card className="p-6">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Báo giá theo số lượng</h3>
                    <Button size="sm" variant="outline" onClick={addPricingTier}><Plus className="w-4 h-4 mr-1"/> Thêm mức giá</Button>
                 </div>
                 <div className="space-y-3">
                     {product.pricing.map((tier, idx) => (
                         <div key={idx} className="flex gap-4 items-end bg-stone-50 p-3 rounded border border-stone-200">
                             <div className="w-24">
                                 <label className="text-xs font-bold text-stone-500">SL &ge;</label>
                                 <input 
                                    type="number" 
                                    className="w-full border rounded px-2 py-1"
                                    value={tier.minQuantity}
                                    onChange={e => updatePricing(idx, 'minQuantity', parseInt(e.target.value))}
                                 />
                             </div>
                             <div className="flex-1">
                                 <label className="text-xs font-bold text-stone-500">Giá (VNĐ)</label>
                                 <input 
                                    type="number" 
                                    className="w-full border rounded px-2 py-1 font-mono text-emerald-700 font-bold"
                                    value={tier.price}
                                    onChange={e => updatePricing(idx, 'price', parseInt(e.target.value))}
                                 />
                             </div>
                             <div className="flex-1">
                                 <label className="text-xs font-bold text-stone-500">Nhãn</label>
                                 <input 
                                    type="text" 
                                    className="w-full border rounded px-2 py-1"
                                    value={tier.label || ''}
                                    onChange={e => updatePricing(idx, 'label', e.target.value)}
                                    placeholder="Lẻ / Sỉ"
                                 />
                             </div>
                             <button onClick={() => removePricingTier(idx)} className="p-2 text-red-500 hover:bg-red-100 rounded">
                                 <Trash2 className="w-4 h-4" />
                             </button>
                         </div>
                     ))}
                 </div>
             </Card>
          </div>

          <div className="space-y-6">
              <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">Trạng thái</h3>
                  <select 
                    className="w-full border rounded-md p-2 bg-white"
                    value={product.status}
                    onChange={e => setProduct({...product, status: e.target.value as any})}
                  >
                      <option value="active">Đang bán (Active)</option>
                      <option value="inactive">Ngừng bán (Inactive)</option>
                  </select>
              </Card>

              <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Hình ảnh</h3>
                    <Button size="sm" variant="outline" onClick={() => setShowMediaPicker(true)}>
                        <ImageIcon className="w-4 h-4 mr-2"/> Chọn ảnh
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                      {product.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square bg-stone-100 rounded overflow-hidden group">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button 
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                              >
                                  <Trash2 className="w-3 h-3" />
                              </button>
                          </div>
                      ))}
                      {product.images.length === 0 && (
                          <div className="col-span-2 py-8 text-center text-stone-400 border border-dashed rounded bg-stone-50">
                              Chưa có ảnh
                          </div>
                      )}
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
};

export const ProductManager = () => {
    const [selected, setSelected] = useState<Product | null>(null);

    if (selected) {
        return <ProductEditor product={selected} onBack={() => setSelected(null)} />;
    }
    return <ProductList onSelect={setSelected} />;
};
