
import React, { useState } from 'react';
import { Container, Section, Card, Input, Textarea, Button } from '../../components/Shared';
import { Mail, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { storageService } from '../../services/store';

const Contact = () => {
    const config = storageService.getConfig();
    const [formState, setFormState] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = {
            form_type: 'general_contact',
            name: formState.name,
            phone: formState.phone,
            email: formState.email,
            subject: formState.subject,
            message: formState.message,
            _subject: `Contact Request: ${formState.subject || 'No Subject'}`
        };

        try {
            const response = await fetch('https://formspree.io/f/mwvvovbk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                 storageService.addSubmission({
                    type: 'general_contact',
                    name: formState.name,
                    email: formState.email,
                    phone: formState.phone,
                    message: `Subject: ${formState.subject}\nMessage: ${formState.message}`
                });
                setSubmitted(true);
            } else {
                alert("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
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
            <div className="bg-stone-900 text-stone-100 py-16">
                <Container className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h1>
                    <p className="text-xl opacity-80">Chúng tôi luôn sẵn sàng lắng nghe bạn.</p>
                </Container>
            </div>

            <Section>
                <Container>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Info */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Thông tin liên lạc</h2>
                            <p className="text-stone-600 mb-8">
                                Mọi thắc mắc về đơn hàng, chính sách hoặc hợp tác, vui lòng liên hệ qua các kênh dưới đây.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Địa chỉ văn phòng</h4>
                                        <p className="text-stone-600">Tầng 3, Tòa nhà Innovation, Cầu Giấy, Hà Nội</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Hotline hỗ trợ</h4>
                                        <p className="text-stone-600">{config.contactPhone}</p>
                                        <p className="text-xs text-stone-400">8:00 - 17:30 (Thứ 2 - Thứ 7)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Email</h4>
                                        <p className="text-stone-600">{config.contactEmail}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-8 h-64 bg-stone-200 rounded-xl flex items-center justify-center text-stone-500">
                                [Google Maps Integration Placeholder]
                            </div>
                        </div>

                        {/* Form */}
                        <div>
                            <Card className="p-8 shadow-lg">
                                <h3 className="text-xl font-bold mb-6">Gửi tin nhắn</h3>
                                {!submitted ? (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input 
                                                label="Họ tên" 
                                                placeholder="Nguyễn Văn A" 
                                                required 
                                                value={formState.name}
                                                onChange={e => setFormState({...formState, name: e.target.value})}
                                                disabled={isSubmitting}
                                            />
                                            <Input 
                                                label="Số điện thoại" 
                                                placeholder="090..." 
                                                required 
                                                value={formState.phone}
                                                onChange={e => setFormState({...formState, phone: e.target.value})}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <Input 
                                            label="Email" 
                                            type="email" 
                                            placeholder="email@example.com" 
                                            required 
                                            value={formState.email}
                                            onChange={e => setFormState({...formState, email: e.target.value})}
                                            disabled={isSubmitting}
                                        />
                                        <Input 
                                            label="Chủ đề" 
                                            placeholder="Vấn đề cần hỗ trợ" 
                                            value={formState.subject}
                                            onChange={e => setFormState({...formState, subject: e.target.value})}
                                            disabled={isSubmitting}
                                        />
                                        <Textarea 
                                            label="Nội dung" 
                                            rows={5} 
                                            placeholder="Chi tiết nội dung..." 
                                            required 
                                            value={formState.message}
                                            onChange={e => setFormState({...formState, message: e.target.value})}
                                            disabled={isSubmitting}
                                        />
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto"/> : 'Gửi liên hệ'}
                                        </Button>
                                    </form>
                                ) : (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold">Đã gửi tin nhắn!</h3>
                                        <p className="text-stone-500 mt-2">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};

export default Contact;
