
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/store';
import { Product } from '../../types';
import { Container, Section, Card, Button, FadeIn, cn } from '../../components/Shared';
import { ShoppingCart, Tag, Check, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setProducts(storageService.getProducts().filter(p => p.status === 'active'));
  }, []);

  // Reset image index and handle body scroll lock when modal opens
  useEffect(() => {
    setCurrentImageIndex(0);
    if (activeProduct) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeProduct]);

  const handleNextImage = (e: React.MouseEvent, total: number) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % total);
  };

  const handlePrevImage = (e: React.MouseEvent, total: number) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + total) % total);
  };

  const activeItem = products.find(p => p.id === activeProduct);

  return (
    <>
      <Section className="bg-stone-50 py-12">
        <Container>
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Vườn giải pháp kỳ này</h1>
            <p className="text-stone-600 max-w-2xl mx-auto text-sm md:text-base">
              Các giải pháp được tuyển chọn kỹ lưỡng từ những nhà sản xuất uy tín. 
              Đặt trước (Pre-order) để có giá tốt nhất và nhận được những giải pháp mới nhất.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, idx) => (
              <FadeIn key={product.id} delay={idx * 100}>
                <Card 
                    className="h-full flex flex-col hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    onClick={() => setActiveProduct(product.id)}
                >
                  {/* Image Preview */}
                  <div className="aspect-square bg-stone-100 relative overflow-hidden">
                    <img 
                      src={product.images[0] || 'https://via.placeholder.com/400'} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.pricing.length > 1 && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 rounded-full shadow-lg z-10">
                        Giá tốt khi mua chung
                      </div>
                    )}
                  </div>

                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                       <span className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-md">
                           {product.category}
                       </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">{product.name}</h3>
                    <p className="text-stone-500 text-sm mb-4 flex-1 line-clamp-2 md:line-clamp-3">
                      {product.shortDescription}
                    </p>

                    {/* Pricing Tiers Preview */}
                    <div className="bg-stone-50 rounded-lg p-3 mb-6 border border-stone-100">
                        <div className="text-[10px] text-stone-400 font-bold uppercase mb-2">Bảng giá tham khảo</div>
                        {product.pricing.slice(0, 3).map((tier, i) => (
                            <div key={i} className="flex justify-between items-center text-sm mb-1 last:mb-0">
                                <span className="text-stone-600">{tier.label || `Số lượng ${tier.minQuantity}+`}</span>
                                <span className={cn("font-bold", i === product.pricing.length -1 ? "text-emerald-700 text-base" : "text-stone-800")}>
                                    {tier.price.toLocaleString()}đ
                                </span>
                            </div>
                        ))}
                    </div>

                    <Button 
                        className="w-full mt-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveProduct(product.id);
                        }}
                    >
                        Xem chi tiết & Đặt hàng
                    </Button>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>
      
      {/* Product Details Modal */}
      {activeProduct && activeItem && (
          <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center md:p-4">
              <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                  onClick={() => setActiveProduct(null)}
              ></div>
              
              <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-5xl h-[90vh] md:max-h-[90vh] overflow-hidden z-10 relative flex flex-col md:flex-row shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200">
                  {/* Close Button - Larger touch target */}
                  <button 
                      onClick={() => setActiveProduct(null)} 
                      className="absolute top-4 right-4 p-3 bg-white/80 rounded-full shadow-lg hover:bg-stone-100 z-50 text-stone-600 transition-transform hover:rotate-90"
                  >
                      <X className="w-6 h-6" />
                  </button>
                  
                  {/* Left Column: Images */}
                  <div className="w-full md:w-1/2 bg-stone-100 flex flex-col shrink-0 border-r border-stone-200 h-1/3 md:h-auto">
                        <div className="relative flex-1 w-full h-full flex items-center justify-center group overflow-hidden bg-white">
                             <img 
                                src={activeItem.images[currentImageIndex] || 'https://via.placeholder.com/400'} 
                                className="w-full h-full object-cover md:object-contain" 
                                alt={activeItem.name} 
                            />
                            {activeItem.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => handlePrevImage(e, activeItem.images.length)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white text-stone-800 transition-all opacity-70 hover:opacity-100"
                                    >
                                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                    </button>
                                    <button 
                                        onClick={(e) => handleNextImage(e, activeItem.images.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-white/90 rounded-full shadow-lg hover:bg-white text-stone-800 transition-all opacity-70 hover:opacity-100"
                                    >
                                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Thumbnails - Hide on small mobile if screen height is small, otherwise show */}
                        {activeItem.images.length > 1 && (
                            <div className="hidden md:flex p-4 gap-3 overflow-x-auto bg-stone-50 border-t border-stone-200 shrink-0">
                                {activeItem.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                        className={`w-14 h-14 md:w-16 md:h-16 flex-shrink-0 border-2 rounded-lg overflow-hidden transition-all ${currentImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100 bg-white'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                  </div>

                  {/* Right Column: Content */}
                  <div className="w-full md:w-1/2 flex flex-col flex-1 bg-white overflow-hidden relative">
                      <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 custom-scrollbar pb-24 md:pb-8">
                          <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-stone-900">{activeItem.name}</h2>
                                <div 
                                    className="prose prose-sm md:prose-base prose-stone text-stone-600 max-w-none leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: activeItem.description }}
                                ></div>
                          </div>
                          
                          <div className="space-y-3 bg-stone-50 p-4 md:p-6 rounded-xl border border-stone-100">
                                <h4 className="font-bold border-b border-stone-200 pb-2 text-stone-800 text-sm md:text-base">Chính sách giá ưu đãi</h4>
                                {activeItem.pricing.map((tier, i) => (
                                    <div key={i} className="flex justify-between items-center py-1">
                                        <div>
                                            <div className="font-medium text-stone-900 text-sm">{tier.label}</div>
                                            <div className="text-xs text-stone-500">Số lượng tối thiểu: {tier.minQuantity}</div>
                                        </div>
                                        <div className="text-base md:text-lg font-bold text-emerald-700">{tier.price.toLocaleString()}đ</div>
                                    </div>
                                ))}
                          </div>

                          <div className="bg-blue-50 p-4 md:p-5 rounded-xl text-sm text-blue-900 border border-blue-100 mb-8 md:mb-0">
                                <p className="font-bold mb-2 flex items-center gap-2"><ShoppingCart className="w-4 h-4"/> Cách thức đặt hàng:</p>
                                <p>Vui lòng liên hệ Trưởng Nhóm Khu Vực của bạn hoặc để lại thông tin để chúng tôi kết nối Trưởng Nhóm gần nhất.</p>
                          </div>
                      </div>
                      
                      {/* Sticky Footer Button for Mobile */}
                      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 border-t border-stone-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:relative md:shadow-none">
                        <Link to="/contact" className="block">
                            <Button size="lg" className="w-full py-4 text-lg shadow-lg shadow-emerald-100 active:scale-[0.98]">Liên hệ đặt hàng ngay</Button>
                        </Link>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};

export default Products;
