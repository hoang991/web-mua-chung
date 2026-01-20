
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Section, Button, Card } from '../../components/Shared';
import { storageService } from '../../services/store';
import { BlogPost as BlogPostType } from '../../types';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';
import { SEOHead } from '../../components/SEO';

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            const posts = storageService.getBlogPosts();
            const found = posts.find(p => p.slug === slug);
            setPost(found || null);
        }
        setLoading(false);
    }, [slug]);

    if (loading) return <div className="py-20 text-center">Đang tải...</div>;
    
    if (!post) return (
        <Section>
            <Container className="text-center py-20">
                <h1 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h1>
                <Link to="/blog"><Button>Quay lại Dưỡng Vườn Tâm</Button></Link>
            </Container>
        </Section>
    );

    return (
        <>
            <SEOHead 
                title={post.title} 
                description={post.excerpt} 
                image={post.coverImage}
                type="article"
            />

            <article className="pb-20">
                {/* Header Image */}
                <div className="w-full h-[40vh] md:h-[50vh] relative bg-stone-200">
                    <img 
                        src={post.coverImage || 'https://picsum.photos/1200/600'} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                        <Container className="max-w-4xl">
                            <Link to="/blog" className="inline-flex items-center text-stone-200 hover:text-white mb-4 text-sm font-medium transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Dưỡng Vườn Tâm
                            </Link>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 font-serif">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-6 text-sm text-stone-200">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Admin
                                </span>
                            </div>
                        </Container>
                    </div>
                </div>

                {/* Content */}
                <Container className="max-w-3xl -mt-10 relative z-10">
                    <Card className="p-8 md:p-12 shadow-xl">
                         <div 
                            className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:text-emerald-900 prose-a:text-emerald-600"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                        
                        <div className="mt-12 pt-8 border-t border-stone-200 flex justify-between items-center">
                            <span className="font-bold text-stone-900">Chia sẻ bài viết:</span>
                            <div className="flex gap-2">
                                <Button 
                                    size="sm" 
                                    variant="secondary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert('Đã sao chép liên kết!');
                                    }}
                                >
                                    <Share2 className="w-4 h-4 mr-2" /> Sao chép Link
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Container>
            </article>
        </>
    );
};

export default BlogPost;
