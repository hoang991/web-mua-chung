
import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowDown, Package, UserCheck, Users, Truck, Calendar } from 'lucide-react';
import { Container, Section, Card, FadeIn, Button } from '../../components/Shared';
import { Link } from 'react-router-dom';
import { storageService } from '../../services/store';
import { PageData } from '../../types';

const Model = () => {
  const [pageData, setPageData] = useState<PageData | undefined>();

  useEffect(() => {
    setPageData(storageService.getPage('model'));
  }, []);

  const sections = pageData?.sections || [];
  const diagramSection = sections.find(s => s.type === 'diagram');
  const timelineSection = sections.find(s => s.type === 'timeline');
  const timelineItems = timelineSection?.items || [];

  return (
    <>
      <div className="bg-emerald-900 text-emerald-50 py-12 md:py-16">
        <Container className="text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{pageData?.title || 'Mô Hình Mua Chung'}</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Hành trình của một giải pháp tử tế từ nơi sản xuất đến tay bạn, cắt giảm tối đa chi phí trung gian.
          </p>
        </Container>
      </div>

      <Section>
        <Container>
          {/* Conceptual Diagram */}
          {diagramSection && diagramSection.isVisible && (
            <FadeIn>
              <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-2xl shadow-sm border border-stone-200 mb-16 md:mb-20">
                <h2 className="text-2xl font-bold text-center mb-8 md:mb-12">{diagramSection.title}</h2>
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
                  {/* Connector Lines */}
                  <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-stone-200 -z-10 -translate-y-1/2"></div>
                  {/* Vertical line for mobile */}
                  <div className="md:hidden absolute top-0 left-1/2 h-full w-0.5 bg-stone-200 -z-10 -translate-x-1/2 border-l-2 border-dashed border-stone-200"></div>

                  {/* Nodes */}
                  <div className="flex flex-col items-center bg-white p-2 z-10 w-full md:w-auto">
                    <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-3 md:mb-4 border-4 border-white shadow-sm">
                      <Package className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">Nhà Sản Xuất</span>
                    <span className="text-xs text-stone-500 text-center max-w-[120px]">Tập trung chất lượng</span>
                  </div>

                  <div className="flex text-stone-300">
                      <ArrowRight className="w-6 h-6 animate-pulse hidden md:block" />
                      <ArrowDown className="w-6 h-6 animate-pulse block md:hidden" />
                  </div>

                  <div className="flex flex-col items-center bg-white p-2 z-10 w-full md:w-auto">
                    <div className="w-16 h-16 bg-emerald-700 text-white rounded-full flex items-center justify-center mb-3 md:mb-4 border-4 border-white shadow-lg scale-110">
                      <div className="text-center">
                        <span className="block font-bold text-xs">ALO</span>
                        <span className="block text-[10px] opacity-80">Mua Chung</span>
                      </div>
                    </div>
                    <span className="font-bold text-lg text-center">Alo Mua Chung</span>
                    <span className="text-xs text-stone-500 text-center max-w-[120px]">Kiểm định & Tổng kho</span>
                  </div>

                  <div className="flex text-stone-300">
                      <ArrowRight className="w-6 h-6 animate-pulse hidden md:block" />
                      <ArrowDown className="w-6 h-6 animate-pulse block md:hidden" />
                  </div>

                  <div className="flex flex-col items-center bg-white p-2 z-10 w-full md:w-auto">
                    <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-3 md:mb-4 border-4 border-white shadow-sm">
                      <UserCheck className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg text-center">Trưởng Nhóm</span>
                    <span className="text-xs text-stone-500 text-center max-w-[120px]">Khu Vực (Leader)</span>
                  </div>

                  <div className="flex text-stone-300">
                      <ArrowRight className="w-6 h-6 animate-pulse hidden md:block" />
                      <ArrowDown className="w-6 h-6 animate-pulse block md:hidden" />
                  </div>

                  <div className="flex flex-col items-center bg-white p-2 z-10 w-full md:w-auto">
                    <div className="w-16 h-16 bg-stone-100 text-stone-700 rounded-full flex items-center justify-center mb-3 md:mb-4 border-4 border-white shadow-sm">
                      <Users className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">Cộng Đồng</span>
                    <span className="text-xs text-stone-500 text-center max-w-[120px]">Người dùng cuối</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Timeline */}
          {timelineSection && timelineSection.isVisible && (
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
              <div className="space-y-6 md:space-y-8">
                <div className="lg:sticky lg:top-24">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{timelineSection.title}</h2>
                  <p className="text-stone-600 mb-6 md:mb-8 text-sm md:text-base">
                    {timelineSection.subtitle || "Để đảm bảo giá tốt nhất và hàng mới nhất, chúng tôi không bán sẵn. Mọi thứ hoạt động theo lịch trình chính xác."}
                  </p>
                  <Link to="/products" className="block">
                    <Button className="w-full sm:w-auto">Xem giải pháp kỳ này</Button>
                  </Link>
                </div>
              </div>

              <div className="relative border-l-2 border-emerald-200 pl-6 md:pl-8 space-y-10 md:space-y-12 py-2">
                {timelineItems.map((step, idx) => (
                  <FadeIn key={idx} delay={idx * 100}>
                    <div className="relative">
                      <div className="absolute -left-[33px] md:-left-[41px] top-0 bg-white border-2 border-emerald-500 w-5 h-5 md:w-6 md:h-6 rounded-full"></div>
                      <span className="text-xs md:text-sm font-bold text-emerald-600 tracking-wider uppercase mb-1 block">{step.label}</span>
                      <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">{step.title}</h3>
                      <p className="text-stone-600 text-sm md:text-base">{step.description}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Misconceptions */}
      <Section className="bg-stone-100">
        <Container className="max-w-4xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-8 md:mb-12">Những điều thường bị hiểu nhầm</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-red-500 bg-white">
              <h4 className="font-bold text-base md:text-lg mb-2 flex items-center gap-2">
                <span className="text-red-500 text-xl">✕</span> Hiểu nhầm: Đa cấp
              </h4>
              <p className="text-sm text-stone-600">
                Sự thật: Chúng tôi chỉ có 1 cấp Trưởng Nhóm Khu Vực duy nhất – người phục vụ cộng đồng. Không có hoa hồng tầng lớp, không tuyển tuyến dưới.
              </p>
            </Card>
            <Card className="p-6 border-l-4 border-red-500 bg-white">
              <h4 className="font-bold text-base md:text-lg mb-2 flex items-center gap-2">
                <span className="text-red-500 text-xl">✕</span> Hiểu nhầm: Đầu tư
              </h4>
              <p className="text-sm text-stone-600">
                Sự thật: Tuyệt đối không. Bạn không cần bỏ vốn nhập hàng, không cần ký quỹ lớn. Bạn chỉ đại diện cho cộng đồng để mua hàng tốt.
              </p>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
};

export default Model;
