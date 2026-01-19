
import React, { useState } from 'react';
import { CheckCircle, Heart, DollarSign, Users, Loader2 } from 'lucide-react';
import { Container, Section, Card, Button, Input, Textarea, FadeIn } from '../../components/Shared';
import { storageService } from '../../services/store';

const Leader = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    location: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
        form_type: 'leader_registration',
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        location: formState.location,
        reason: formState.reason,
        _subject: `New Leader Registration: ${formState.name}`
    };

    try {
        const response = await fetch('https://formspree.io/f/mwvvovbk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Backup to local storage for Admin Panel
            storageService.addSubmission({
                type: 'leader_registration',
                name: formState.name,
                email: formState.email,
                phone: formState.phone,
                message: `Location: ${formState.location}\nReason: ${formState.reason}`
            });
            setSubmitted(true);
        } else {
            alert("Có lỗi xảy ra khi gửi biểu mẫu. Vui lòng thử lại.");
        }
    } catch (error) {
        console.error("Form error:", error);
        alert("Lỗi kết nối. Vui lòng kiểm tra đường truyền mạng.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
      <Section className="bg-amber-50">
        <Container className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-amber-600 font-bold tracking-wider text-sm uppercase">Tuyển Leader Cộng Đồng</span>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mt-2 mb-6">
              Trở thành trái tim <br/>của cộng đồng nơi bạn sống
            </h1>
            <p className="text-lg text-stone-600 mb-8">
              Leader không phải là "người bán hàng". Leader là người đại diện cho xóm giềng, đồng nghiệp để tìm kiếm và kiểm định những sản phẩm tử tế.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Không cần bỏ vốn ôm hàng",
                "Thu nhập xứng đáng từ công sức chăm sóc",
                "Được đào tạo kiến thức sản phẩm chuyên sâu"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-amber-100">
             {!submitted ? (
               <form onSubmit={handleSubmit} className="space-y-4">
                 <h3 className="text-xl font-bold mb-4">Đăng ký tìm hiểu vai trò Leader</h3>
                 <Input 
                    label="Họ và tên" 
                    required 
                    value={formState.name}
                    onChange={e => setFormState({...formState, name: e.target.value})}
                    disabled={isSubmitting}
                 />
                 <div className="grid grid-cols-2 gap-4">
                   <Input 
                      label="Số điện thoại" 
                      required 
                      type="tel"
                      value={formState.phone}
                      onChange={e => setFormState({...formState, phone: e.target.value})}
                      disabled={isSubmitting}
                   />
                   <Input 
                      label="Email" 
                      type="email" 
                      required
                      value={formState.email}
                      onChange={e => setFormState({...formState, email: e.target.value})}
                      disabled={isSubmitting}
                   />
                 </div>
                 <Input 
                    label="Khu vực bạn đang sống (Quận/Huyện)" 
                    required
                    value={formState.location}
                    onChange={e => setFormState({...formState, location: e.target.value})}
                    disabled={isSubmitting}
                 />
                 <Textarea 
                    label="Vì sao bạn quan tâm đến việc mua chung?" 
                    rows={3}
                    value={formState.reason}
                    onChange={e => setFormState({...formState, reason: e.target.value})}
                    disabled={isSubmitting}
                 />
                 <Button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white" disabled={isSubmitting}>
                   {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'Gửi đăng ký'}
                 </Button>
                 <p className="text-xs text-stone-500 text-center mt-2">
                   Chúng tôi sẽ liên hệ lại trong vòng 24h để trao đổi chi tiết.
                 </p>
               </form>
             ) : (
               <div className="text-center py-12">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle className="w-8 h-8 text-green-600" />
                 </div>
                 <h3 className="text-xl font-bold text-stone-900">Đã gửi thành công!</h3>
                 <p className="text-stone-600 mt-2">Cảm ơn bạn đã quan tâm. Chúng tôi đã nhận được thông tin và sẽ liên hệ sớm.</p>
               </div>
             )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Leader làm gì?</h2>
            <p className="text-stone-600">Công việc đơn giản nhưng cần sự tỉ mỉ và chân thành.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { icon: Users, title: "Kết nối", desc: "Tạo nhóm Zalo/Facebook cho cư dân/đồng nghiệp. Lắng nghe nhu cầu của họ." },
               { icon: Heart, title: "Chăm sóc", desc: "Hướng dẫn mọi người cách dùng sản phẩm. Nhận phản hồi và hỗ trợ đổi trả nếu cần." },
               { icon: DollarSign, title: "Thu nhập", desc: "Nhận chiết khấu hoa hồng dựa trên tổng giá trị đơn hàng gom được." }
             ].map((item, idx) => (
               <FadeIn key={idx} delay={idx * 100}>
                 <Card className="p-8 text-center h-full">
                   <div className="w-12 h-12 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-4">
                     <item.icon className="w-6 h-6 text-stone-700" />
                   </div>
                   <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                   <p className="text-sm text-stone-600">{item.desc}</p>
                 </Card>
               </FadeIn>
             ))}
          </div>
        </Container>
      </Section>
    </>
  );
};

export default Leader;
