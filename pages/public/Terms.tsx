import React, { useEffect, useState } from 'react';
import { Container, Section } from '../../components/Shared';
import { storageService } from '../../services/store';
import { PageData } from '../../types';

const Terms = () => {
    const [pageData, setPageData] = useState<PageData | undefined>();

    useEffect(() => {
        setPageData(storageService.getPage('terms'));
    }, []);

    const content = pageData?.sections[0]?.content || "Đang cập nhật...";

    return (
        <Section className="py-16">
            <Container className="max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-stone-900">{pageData?.title || 'Điều Khoản Sử Dụng'}</h1>

                <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed">
                     <p className="italic text-stone-500">Cập nhật lần cuối: {pageData ? new Date(pageData.updatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                    
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </Container>
        </Section>
    );
};

export default Terms;
