
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Heart, ShieldCheck, Leaf } from 'lucide-react';
import { Container, Section, Button, FadeIn, Card, cn } from '../../components/Shared';
import { SEOHead } from '../../components/SEO';
import { storageService } from '../../services/store';
import { PageData, SectionContent } from '../../types';

const Home = () => {
  const [pageData, setPageData] = useState<PageData | undefined>();
  const [config] = useState(storageService.getConfig());

  useEffect(() => {
    const data = storageService.getPage('home');
    setPageData(data);
  }, []);

  if (!pageData) return null; 

  // Dynamic theme colors
  const primaryText = `text-${config.primaryColor}-700`;
  const primaryBg = `bg-${config.primaryColor}-50`;
  const primaryBorder = `border-${config.primaryColor}-500`;

  const sections = pageData.sections;
  const heroSection = sections.find(s => s.id === 'hero');
  const pillarsSection = sections.find(s => s.id === 'pillars');
  const trustSection = sections.find(s => s.id === 'trust');

  // Helper for icons mapping based on index
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

      {/* Hero Section */}
      {heroSection && heroSection.isVisible && (
        <Section className="relative overflow-hidden bg-stone-50 py-16 md:py-20 lg:py-32">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
             {/* Optimized Blobs for Mobile */}
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
            
            {/* Display Hero Image if exists */}
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

      {/* 3 Pillars Section */}
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

      {/* Trust & Different */}
      {trustSection && trustSection.isVisible && (
        <Section className="bg-stone-50">
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
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl max-w-xs border border-stone-100 hidden md:block">
                    <p className="font-serif italic text-stone-800">"Sự tử tế là ngôn ngữ mà người điếc có thể nghe và người mù có thể thấy."</p>
                    <p className="text-right text-sm text-stone-500 mt-2">— Mark Twain</p>
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
    </>
  );
};

export default Home;
