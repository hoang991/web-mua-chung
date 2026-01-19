import React from 'react';
import { Container, Section, Card, Input, Textarea, Button } from '../../components/Shared';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { storageService } from '../../services/store';

const Contact = () => {
    const config = storageService.getConfig();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!");
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
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Họ tên" placeholder="Nguyễn Văn A" required />
                                        <Input label="Số điện thoại" placeholder="090..." required />
                                    </div>
                                    <Input label="Email" type="email" placeholder="email@example.com" required />
                                    <Input label="Chủ đề" placeholder="Vấn đề cần hỗ trợ" />
                                    <Textarea label="Nội dung" rows={5} placeholder="Chi tiết nội dung..." required />
                                    <Button type="submit" className="w-full">Gửi liên hệ</Button>
                                </form>
                            </Card>
                        </div>
                    </div>
                </Container>
            </Section>
        </>
    );
};

export default Contact;
