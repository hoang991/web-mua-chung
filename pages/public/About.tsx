
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import { Container, Section, Button, FadeIn, Card, cn } from '../../components/Shared';
import { SEOHead } from '../../components/SEO';
import { storageService } from '../../services/store';
import { PageData, SectionContent } from '../../types';

const About = () => {
  const [pageData, setPageData] = useState<PageData | undefined>();
  const [config] = useState(storageService.getConfig());

  useEffect(() => {
    const data = storageService.getPage('about');
    setPageData(data);
  }, []);

  if (!pageData) return <div className="py-20 text-center">Đang tải...</div>;

  const primaryText = `text-${config.primaryColor}-700`;

  // Helper for Pillars
  const getPillarIcon = (index: number) => {
      const icons = [ShieldCheck, Heart, Users, Leaf];
      const Icon = icons[index % icons.length];
      const colors = ['text-emerald-700', 'text-amber-600', 'text-blue-600', 'text-rose-600'];
      const bgs = ['bg-emerald-50', 'bg-amber-50', 'bg-blue-50', 'bg-rose-50'];
      return { Icon, color: colors[index % colors.length], bg: bgs[index % bgs.length] };
  };
  
  const getBorderColor = (index: number) => {
      const borders = [`border-${config.primaryColor}-500`, 'border-amber-500', 'border-blue-500', 'border-rose-500'];
      return borders[index % borders.length];
  };

  const renderSection = (section: SectionContent) => {
      if (!section.isVisible) return null;

      switch(section.type) {
          case 'hero':
              return (
                <div key={section.id} className="relative bg-emerald-900 py-20 md:py-32 overflow-hidden">
                    {/* Background Image with Overlay */}
                    {section.image && (
                        <div className="absolute inset-0 z-0">
                            <img src={section.image} alt={section.title} className="w-full h-full object-cover opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 to-transparent"></div>
                        </div>
                    )}
                    <Container className="relative z-10 text-center text-white px-4">
                        <FadeIn>
                            {/* Changed font-serif to font-sans and ensured tracking-normal */}
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-normal">
                                {section.title}
                            </h1>
                        </FadeIn>
                        <FadeIn delay={200}>
                            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                                {section.subtitle}
                            </p>
                        </FadeIn>
                    </Container>
                </div>
              );

          case 'text':
              return (
                <Section key={section.id} className="bg-white">
                    <Container className="max-w-4xl">
                        <FadeIn>
                            <div className="text-center mb-10">
                                {/* Removed font-serif */}
                                <h2 className="text-3xl font-bold text-stone-900 mb-4 tracking-normal">{section.title}</h2>
                                {section.subtitle && <p className="text-stone-500 italic">{section.subtitle}</p>}
                            </div>
                            <div 
                                className="prose prose-lg prose-stone max-w-none prose-headings:text-emerald-800 prose-p:leading-relaxed text-left"
                                dangerouslySetInnerHTML={{ __html: section.content || '' }}
                            />
                        </FadeIn>
                    </Container>
                </Section>
              );

          case 'features':
              return (
                <Section key={section.id} className="bg-stone-50">
                    <Container>
                        <div className="text-center mb-12">
                            {/* Removed font-serif */}
                            <h2 className="text-3xl font-bold text-stone-900 mb-4 tracking-normal">{section.title}</h2>
                            <p className="text-stone-600 max-w-2xl mx-auto">{section.subtitle}</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {section.items?.map((item, idx) => {
                                const { Icon, color, bg } = getPillarIcon(idx);
                                return (
                                    <FadeIn key={idx} delay={idx * 100}>
                                        <Card className={`p-8 h-full border-t-4 ${getBorderColor(idx)} hover:shadow-lg transition-all`}>
                                            <div className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center mb-6`}>
                                                <Icon className={`w-7 h-7 ${color}`} />
                                            </div>
                                            {/* Removed font-serif */}
                                            <h3 className="text-xl font-bold mb-4 tracking-normal">{item.title}</h3>
                                            <p className="text-stone-600 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </Card>
                                    </FadeIn>
                                );
                            })}
                        </div>
                    </Container>
                </Section>
              );
          
          case 'image-text':
              return (
                <Section key={section.id} className="bg-white">
                    <Container>
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <FadeIn>
                                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                                    <img src={section.image || 'https://via.placeholder.com/800x600'} alt={section.title} className="w-full h-full object-cover" />
                                </div>
                            </FadeIn>
                            <div className="space-y-6">
                                {/* Removed font-serif */}
                                <h2 className="text-3xl font-bold text-stone-900 tracking-normal">{section.title}</h2>
                                <div className="prose prose-stone text-left" dangerouslySetInnerHTML={{ __html: section.content || '' }}></div>
                            </div>
                        </div>
                    </Container>
                </Section>
              );

          default:
              return null;
      }
  };

  return (
    <>
      <SEOHead 
        title={pageData.metaTitle || pageData.title} 
        description={pageData.metaDescription} 
      />
      {pageData.sections.sort((a, b) => a.order - b.order).map(section => renderSection(section))}
      
      {/* Call to Action Footer */}
      <Section className="bg-stone-900 text-stone-300 py-16">
          <Container className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Bạn đã sẵn sàng tham gia cùng chúng tôi?</h2>
              <p className="mb-8 max-w-2xl mx-auto">
                  Dù bạn là người mua, Trưởng nhóm khu vực hay Nhà sản xuất, chúng tôi luôn chào đón bạn gia nhập cộng đồng tử tế này.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/leader">
                      <Button className="w-full sm:w-auto px-8 bg-emerald-600 hover:bg-emerald-700 border-none text-white">Đăng ký Trưởng Nhóm</Button>
                  </Link>
                  <Link to="/model">
                      <Button variant="outline" className="w-full sm:w-auto px-8 border-stone-600 text-stone-300 hover:text-white hover:bg-stone-800">Tìm hiểu Mô hình</Button>
                  </Link>
              </div>
          </Container>
      </Section>
    </>
  );
};

export default About;
