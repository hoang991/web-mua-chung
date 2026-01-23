
import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/store';
import { SupplierPost } from '../../types';
import { Container, Section, Card, Button, FadeIn, Input, Textarea, VideoPlayer } from '../../components/Shared';
import { Handshake, TrendingUp, Users, CheckCircle, Loader2, Video } from 'lucide-react';

const Supplier = () => {
  const [posts, setPosts] = useState<SupplierPost[]>([]);
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPosts(storageService.getSupplierPosts().filter(p => p.status === 'published'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
        form_type: 'supplier_contact',
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        message: formState.message,
        _subject: `New Supplier Contact: ${formState.name}`
    };

    try {
        const response = await fetch('https://formspree.io/f/mwvvovbk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            storageService.addSubmission({
                type: 'supplier_contact',
                name: formState.name,
                email: formState.email,
                phone: formState.phone,
                message: `Supplier Contact:\n${formState.message}`
            });
            setSubmitted(true);
        } else {
            alert("Có lỗi xảy ra khi gửi. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi kết nối.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <div className="bg-stone-900 text-stone-100 py-20">
          <Container>
              <div className="max-w-3xl">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">Hợp tác cùng Alo Mua Chung</h1>
                  <p className="text-xl text-stone-400 mb-8">
                      Chúng tôi giúp Nhà Sản Xuất tập trung vào chất lượng sản phẩm bằng cách giải quyết bài toán đầu ra và marketing thông qua mô hình đặt trước (Pre-order).
                  </p>
                  <Button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth'})} className="bg-white text-stone-900 hover:bg-stone-100">
                      Đăng ký hợp tác ngay
                  </Button>
              </div>
          </Container>
      </div>

      {/* Benefits */}
      <Section>
          <Container>
              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { icon: TrendingUp, title: "Đầu ra ổn định", desc: "Sản xuất theo số lượng đặt trước. Không lo tồn kho, không lo hư hỏng nông sản." },
                      { icon: Users, title: "Tiếp cận cộng đồng", desc: "Đưa sản phẩm trực tiếp đến tay hàng ngàn hộ gia đình thông qua mạng lưới Trưởng Nhóm Khu Vực tin cậy." },
                      { icon: Handshake, title: "Hợp tác minh bạch", desc: "Thanh toán rõ ràng, sòng phẳng. Tôn trọng giá trị thương hiệu của Nhà sản xuất." }
                  ].map((item, i) => (
                      <FadeIn key={i} delay={i * 100}>
                          <Card className="p-8 h-full border-t-4 border-stone-800">
                              <item.icon className="w-10 h-10 mb-4 text-emerald-600" />
                              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-stone-600">{item.desc}</p>
                          </Card>
                      </FadeIn>
                  ))}
              </div>
          </Container>
      </Section>

      {/* Articles / Opportunities */}
      {posts.length > 0 && (
          <Section className="bg-stone-50">
              <Container>
                  <h2 className="text-3xl font-bold mb-12 text-center">Cơ hội hợp tác & Tiêu chuẩn</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                      {posts.map(post => (
                          <FadeIn key={post.id}>
                              <Card className="overflow-hidden flex flex-col h-full">
                                  {/* Prioritize Video if available, else Image */}
                                  {post.videoUrl ? (
                                      <div className="w-full">
                                          <VideoPlayer url={post.videoUrl} />
                                      </div>
                                  ) : post.coverImage && (
                                      <div className="w-full h-48 md:h-64">
                                          <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                      </div>
                                  )}
                                  
                                  <div className="p-6 flex-1 flex flex-col">
                                      <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                                      <div className="prose prose-sm text-stone-600 line-clamp-3 mb-4 flex-1" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }} />
                                      
                                      <div className="flex justify-between items-center mt-auto pt-4 border-t border-stone-100">
                                          <span className="text-xs text-stone-400">{new Date(post.updatedAt).toLocaleDateString()}</span>
                                          {post.videoUrl && (
                                              <span className="text-xs font-bold text-red-600 flex items-center gap-1 uppercase">
                                                  <Video className="w-3 h-3"/> Video
                                              </span>
                                          )}
                                      </div>
                                  </div>
                              </Card>
                          </FadeIn>
                      ))}
                  </div>
              </Container>
          </Section>
      )}

      {/* Contact Form */}
      <Section id="contact-form">
          <Container className="max-w-2xl">
              <Card className="p-8 md:p-12 shadow-xl border-stone-200">
                  <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold">Liên hệ Nhà Sản Xuất</h2>
                      <p className="text-stone-500">Hãy để lại thông tin, bộ phận thu mua sẽ liên hệ lại trong 24h.</p>
                  </div>

                  {!submitted ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                          <Input 
                            label="Tên đơn vị / Nhà sản xuất" 
                            required 
                            value={formState.name}
                            onChange={e => setFormState({...formState, name: e.target.value})}
                            disabled={isSubmitting}
                          />
                          <div className="grid md:grid-cols-2 gap-4">
                              <Input 
                                label="Email" 
                                type="email" 
                                required 
                                value={formState.email}
                                onChange={e => setFormState({...formState, email: e.target.value})}
                                disabled={isSubmitting}
                              />
                              <Input 
                                label="Số điện thoại" 
                                type="tel" 
                                required 
                                value={formState.phone}
                                onChange={e => setFormState({...formState, phone: e.target.value})}
                                disabled={isSubmitting}
                              />
                          </div>
                          <Textarea 
                            label="Giới thiệu ngắn về sản phẩm của bạn" 
                            rows={4} 
                            value={formState.message}
                            onChange={e => setFormState({...formState, message: e.target.value})}
                            disabled={isSubmitting}
                          />
                          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'Gửi thông tin'}
                          </Button>
                      </form>
                  ) : (
                      <div className="text-center py-12">
                         <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                         <h3 className="text-xl font-bold">Đã gửi thành công!</h3>
                         <p className="text-stone-500 mt-2">Chúng tôi rất mong chờ được hợp tác với sự tử tế của bạn.</p>
                      </div>
                  )}
              </Card>
          </Container>
      </Section>
    </>
  );
};

export default Supplier;
