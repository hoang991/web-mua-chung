
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Heart, ShieldCheck, Leaf, Calendar, MapPin, Gift, Coffee } from 'lucide-react';
import { Container, Section, Button, FadeIn, Card, cn } from '../../components/Shared';
import { SEOHead } from '../../components/SEO';
import { storageService } from '../../services/store';
import { PageData, SectionContent, BlogPost, Product } from '../../types';

const Home = () => {
  const [pageData, setPageData] = useState<PageData | undefined>();
  const [config, setConfig] = useState(storageService.getConfig());
  
  // State cho nội dung động
  const [upcomingEvents, setUpcomingEvents] = useState<BlogPost[]>([]);
  const [latestStories, setLatestStories] = useState<BlogPost[]>([]);
  const [activeProducts, setActiveProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = () => {
        // 0. Config
        setConfig(storageService.getConfig());

        // 1. Get Static Page Data
        const data = storageService.getPage('home');
        setPageData(data);

        // 2. Get Dynamic Blog/Event Data
        const allPosts = storageService.getBlogPosts().filter(p => p.status === 'published');

        // Filter Events
        const events = allPosts.filter(p => p.category === 'event');
        events.sort((a, b) => {
            const dateA = a.eventDate ? new Date(a.eventDate).getTime() : new Date(a.createdAt).getTime();
            const dateB = b.eventDate ? new Date(b.eventDate).getTime() : new Date(b.createdAt).getTime();
            return dateB - dateA; 
        });
        setUpcomingEvents(events.slice(0, 3));

        // Filter Stories
        const stories = allPosts.filter(p => p.category !== 'event');
        stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLatestStories(stories.slice(0, 3));

        // 3. Get Products (New)
        const prods = storageService.getProducts().filter(p => p.status === 'active');
        setActiveProducts(prods.slice(0, 6)); // Lấy 6 sản phẩm mới nhất
    };

    loadData();

    // Subscribe to store changes (Realtime updates from Admin)
    const unsubscribe = storageService.subscribe(loadData);
    return unsubscribe;
  }, []);

  if (!pageData) return null; 

  const primaryText = `text-${config.primaryColor}-700`;

  const sections = pageData.sections;
  const heroSection = sections.find(s => s.id === 'hero');
  const pillarsSection = sections.find(s => s.id === 'pillars');
  
  // Fallback: Nếu trong Database chưa có section products, tự động tạo mặc định
  const productsSection = sections.find(s => s.id === 'products') || {
      id: 'products',
      type: 'products' as const,
      title: 'Vườn giải pháp kỳ này',
      subtitle: 'Các giải pháp được tuyển chọn kỹ lưỡng từ những nhà sản xuất uy tín. Đặt trước (Pre-order) để có giá tốt nhất.',
      isVisible: true,
      order: 3,
      items: []
  };

  const trustSection = sections.find(s => s.id === 'trust');
  const blogSection = sections.find(s => s.id === 'blog');

  // Helper for Pillars
  const getPillarIcon = (index: number) => {
      const icons = [Users, ShieldCheck, Leaf];
      const Icon = icons[index % icons.length];
      const colors = ['text-emerald-700', 'text-amber-600', 'text-blue-600'];
      const bgs = ['bg-emerald-50', 'bg-amber-50', 'bg-blue-50'];
      return { Icon, color: colors[index % colors.length], bg: bgs[index % bgs.length] };
  };
  
  const getBorderColor = (index: number) => {
      const borders = [`border-${config.primaryColor}-500`, 'border-amber-500', 'border-blue-500'];
      return borders[index % borders.length];
  };

  return (
    <>
      <SEOHead 
        title={pageData.metaTitle || pageData.title} 
        description={pageData.metaDescription} 
        schema={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": config.siteName,
            "url": window.location.href,
            "logo": "https://lucide.dev/favicon.ico",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": config.contactPhone,
                "contactType": "customer service"
            }
        }}
      />

      {/* 1. HERO SECTION */}
      {heroSection && heroSection.isVisible && (
        <Section className="relative overflow-hidden bg-stone-50 py-16 md:py-20 lg:py-32">
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
                <div className={`absolute -right-20 top-0 md:top-0 md:-translate-y-1/4 md:translate-x-1/4 w-64 h-64 md:w-[800px] md:h-[800px] bg-${config.primaryColor}-300 rounded-full blur-3xl`} />
                <div className="absolute -left-20 bottom-0 md:translate-y-1/4 md:-translate-x-1/4 w-48 h-48 md:w-[600px] md:h-[600px] bg-yellow-200 rounded-full blur-3xl" />
            </div>
            <Container className="relative z-10 px-4">
                <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
                <FadeIn>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-snug md:leading-tight">
                    {heroSection.title}
                    </h1>
                </FadeIn>
                <FadeIn delay={200}>
                    <p className="text-base md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
                    {heroSection.subtitle}
                    </p>
                </FadeIn>
                <FadeIn delay={400}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-4">
                    <Link to={heroSection.ctaLink || '/model'}>
                        <Button size="lg" className="w-full sm:w-auto gap-2 py-3.5 md:py-3">
                        {heroSection.ctaText || 'Tìm hiểu ngay'} <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Link to="/leader" className="flex-1 sm:flex-none">
                        <Button variant="outline" size="lg" className="w-full py-3.5 md:py-3 text-center justify-center">Đăng ký Trưởng Nhóm</Button>
                        </Link>
                        <Link to="/supplier" className="flex-1 sm:flex-none">
                        <Button variant="ghost" size="lg" className="w-full py-3.5 md:py-3 text-center justify-center">Nhà Sản Xuất</Button>
                        </Link>
                    </div>
                    </div>
                </FadeIn>
                </div>
                {heroSection.image && (
                    <FadeIn delay={600}>
                        <div className="mt-10 md:mt-12 rounded-xl overflow-hidden shadow-xl md:shadow-2xl border border-stone-100 max-w-4xl mx-auto">
                            <img src={heroSection.image} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                    </FadeIn>
                )}
            </Container>
        </Section>
      )}

      {/* 2. PILLARS (FEATURES) SECTION */}
      {pillarsSection && pillarsSection.isVisible && (
        <Section className="bg-white">
            <Container>
                <div className="text-center mb-10 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">{pillarsSection.title}</h2>
                <p className="text-stone-600 px-4">{pillarsSection.subtitle}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                {pillarsSection.items?.map((item, idx) => {
                    const { Icon, color, bg } = getPillarIcon(idx);
                    return (
                        <FadeIn key={idx} delay={idx * 100 + 100}>
                            <Card className={`p-6 md:p-8 h-full border-t-4 ${getBorderColor(idx)} hover:shadow-md transition-shadow`}>
                            <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-6`}>
                                <Icon className={`w-6 h-6 ${color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-stone-600 mb-4 text-sm md:text-base">
                                {item.description}
                            </p>
                            </Card>
                        </FadeIn>
                    );
                })}
                </div>
            </Container>
        </Section>
      )}

      {/* 3. PRODUCTS SECTION (VƯỜN GIẢI PHÁP) */}
      {productsSection && productsSection.isVisible && (
        <Section className="bg-stone-50">
            <Container>
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4 font-serif">{productsSection.title}</h2>
                    <p className="text-stone-600 max-w-2xl mx-auto">{productsSection.subtitle}</p>
                </div>
                {activeProducts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                        {activeProducts.map((product, idx) => (
                            <FadeIn key={product.id} delay={idx * 50}>
                                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group border-stone-200">
                                    <Link to="/products" className="block aspect-square bg-stone-100 relative overflow-hidden rounded-t-xl">
                                        <img 
                                            src={product.images[0] || 'https://via.placeholder.com/400'} 
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {product.pricing.length > 1 && (
                                            <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10">
                                                Giá tốt khi mua chung
                                            </div>
                                        )}
                                    </Link>
                                    <div className="p-4 md:p-6 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                                            <Link to="/products">{product.name}</Link>
                                        </h3>
                                        <p className="text-stone-500 text-sm mb-4 flex-1 line-clamp-2">
                                            {product.shortDescription}
                                        </p>
                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-stone-100">
                                            <div>
                                                <span className="text-xs text-stone-400 block">Giá bán lẻ</span>
                                                <span className="font-bold text-emerald-700 text-lg">
                                                    {product.pricing[0]?.price.toLocaleString()}đ
                                                </span>
                                            </div>
                                            <Link to="/products" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center bg-emerald-50 px-3 py-2 rounded-lg transition-colors">
                                                Xem chi tiết <ArrowRight className="w-4 h-4 ml-1"/>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-stone-500 bg-white rounded-xl border border-dashed border-stone-200">
                        Chưa có sản phẩm nào đang hoạt động.
                    </div>
                )}
                <div className="text-center mt-8">
                    <Link to="/products">
                        <Button variant="outline" size="lg" className="px-8">Xem tất cả giải pháp</Button>
                    </Link>
                </div>
            </Container>
        </Section>
      )}

      {/* 4. EVENTS SECTION */}
      {upcomingEvents.length > 0 && (
        <Section className="bg-amber-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none"></div>
            <Container className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">Lịch Sự Kiện Cộng Đồng</h2>
                        <p className="text-stone-600">Những buổi gặp gỡ, chia sẻ và kết nối sắp diễn ra.</p>
                    </div>
                    <Link to="/blog">
                        <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-100">
                            Xem tất cả sự kiện <ArrowRight className="w-4 h-4 ml-2"/>
                        </Button>
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {upcomingEvents.map((evt, idx) => {
                        const date = evt.eventDate ? new Date(evt.eventDate) : new Date(evt.createdAt);
                        return (
                            <FadeIn key={evt.id} delay={idx * 100}>
                                <Link to={`/blog/${evt.slug}`} className="block h-full group">
                                    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-amber-100 h-full flex flex-col">
                                        <div className="h-2 bg-amber-500 w-full"></div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex gap-4 mb-4">
                                                <div className="flex flex-col items-center justify-center bg-amber-50 border border-amber-200 rounded-lg w-16 h-16 shrink-0 text-amber-700">
                                                    <span className="text-xs font-bold uppercase">{date.toLocaleString('vi-VN', { month: 'short' })}</span>
                                                    <span className="text-2xl font-bold">{date.getDate()}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-tight">
                                                        {evt.title}
                                                    </h3>
                                                    {evt.location && (
                                                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-2">
                                                            <MapPin className="w-3 h-3"/>
                                                            <span className="line-clamp-1">{evt.location.address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-stone-600 line-clamp-2 mb-4 flex-1">
                                                {evt.excerpt}
                                            </p>
                                            <div className="text-amber-600 text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform mt-auto">
                                                Đăng ký tham gia <ArrowRight className="w-4 h-4 ml-1"/>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </FadeIn>
                        );
                    })}
                </div>
            </Container>
        </Section>
      )}

      {/* 5. TRUST / IMAGE TEXT SECTION */}
      {trustSection && trustSection.isVisible && (
        <Section className="bg-white">
            <Container>
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <FadeIn>
                    <div className="relative">
                    <div className="aspect-[4/3] bg-stone-200 rounded-2xl overflow-hidden shadow-lg">
                        <img 
                            src={trustSection.image || "https://picsum.photos/800/600?grayscale"} 
                            alt="Community" 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                        />
                    </div>
                    </div>
                </FadeIn>
                <div className="space-y-6 md:space-y-8">
                    <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4 md:mb-6">{trustSection.title}</h2>
                    {trustSection.subtitle && <p className={`${primaryText} font-medium mb-4`}>{trustSection.subtitle}</p>}
                    <p className="text-stone-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                        {trustSection.content}
                    </p>
                    </div>
                    <div className="space-y-4">
                    {trustSection.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                            <Heart className={`w-4 h-4 ${primaryText}`} />
                        </div>
                        <p className="text-stone-700 text-sm">
                            <strong>{item.title}:</strong> {item.description}
                        </p>
                        </div>
                    ))}
                    </div>
                    <Link to="/model" className="block w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto justify-center">Xem chi tiết mô hình</Button>
                    </Link>
                </div>
                </div>
            </Container>
        </Section>
      )}

      {/* 6. BLOG SECTION (DƯỠNG VƯỜN TÂM) */}
      {latestStories.length > 0 && (
        <Section className="bg-stone-50">
            <Container>
                {blogSection && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-900 mb-4 font-serif">{blogSection.title}</h2>
                        <p className="text-stone-600 max-w-2xl mx-auto">
                            {blogSection.subtitle}
                        </p>
                    </div>
                )}
                <div className="grid md:grid-cols-3 gap-8">
                    {latestStories.map((post, idx) => (
                        <FadeIn key={post.id} delay={idx * 100}>
                            <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group border-stone-200">
                                <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-stone-200 rounded-t-xl">
                                    <img 
                                        src={post.coverImage || `https://picsum.photos/800/600?random=${idx}`} 
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-700 shadow-sm flex items-center gap-1">
                                        {post.category === 'solution' && <Gift className="w-3 h-3 text-emerald-600" />}
                                        {post.category === 'story' && <Heart className="w-3 h-3 text-rose-500" />}
                                        {post.category === 'tea' && <Coffee className="w-3 h-3 text-stone-600" />}
                                        {post.category === 'tea' ? 'Điểm trà' : post.category === 'solution' ? 'Giải pháp' : 'Câu chuyện'}
                                    </div>
                                </Link>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h3>
                                    <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <Link to={`/blog/${post.slug}`} className="flex items-center text-sm font-medium text-emerald-700 mt-auto hover:underline">
                                        Đọc tiếp <ArrowRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Link to="/blog">
                        <Button variant="outline" size="lg" className="px-8">Vào vườn tham quan</Button>
                    </Link>
                </div>
            </Container>
        </Section>
      )}
    </>
  );
};

export default Home;
