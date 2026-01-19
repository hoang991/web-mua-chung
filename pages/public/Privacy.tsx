import React, { useEffect, useState } from 'react';
import { Container, Section } from '../../components/Shared';
import { storageService } from '../../services/store';
import { PageData } from '../../types';

const Privacy = () => {
    const [pageData, setPageData] = useState<PageData | undefined>();
    const config = storageService.getConfig();

    useEffect(() => {
        setPageData(storageService.getPage('privacy'));
    }, []);

    const content = pageData?.sections[0]?.content || "Đang cập nhật...";

    return (
        <Section className="py-16">
            <Container className="max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-stone-900">{pageData?.title || 'Chính Sách Bảo Mật'}</h1>
                
                <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed">
                    <p className="italic text-stone-500">Cập nhật lần cuối: {pageData ? new Date(pageData.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                    
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                    
                    <hr className="my-8 border-stone-200"/>
                    
                    <h3 className="text-xl font-bold text-stone-900">Liên hệ</h3>
                    <p>
                        Nếu bạn có bất kỳ câu hỏi nào về Chính sách quyền riêng tư này, vui lòng liên hệ với chúng tôi qua email: <strong>{config.contactEmail}</strong>.
                    </p>
                </div>
            </Container>
        </Section>
    );
};

export default Privacy;
