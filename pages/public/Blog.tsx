
import React, { useState, useEffect } from 'react';
import { Container, Section, Card, FadeIn, cn, Button } from '../../components/Shared';
import { storageService } from '../../services/store';
import { BlogPost, BlogCategory } from '../../types';
import { Calendar, ArrowRight, Leaf, Heart, Gift, Coffee, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [activeTab, setActiveTab] = useState<BlogCategory | 'all'>('all');
    // Calendar state
    const currentMonth = new Date().getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    useEffect(() => {
        setPosts(storageService.getBlogPosts().filter(p => p.status === 'published'));
    }, []);

    const tabs: { id: BlogCategory | 'all', label: string, icon: any }[] = [
        { id: 'all', label: 'Tất cả', icon: Leaf },
        { id: 'solution', label: 'Tặng giải pháp', icon: Gift },
        { id: 'story', label: 'Câu chuyện chị em', icon: Heart },
        { id: 'event', label: 'Lịch sự kiện', icon: Calendar },
        { id: 'tea', label: 'Điểm trà tâm giao', icon: Coffee },
    ];

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Filtering Logic
    let filteredPosts = activeTab === 'all' 
        ? posts 
        : posts.filter(p => p.category === activeTab);
    
    // Additional filtering for Events by Month
    if (activeTab === 'event') {
        filteredPosts = filteredPosts.filter(p => {
            const date = p.eventDate ? new Date(p.eventDate) : new Date(p.createdAt);
            return (date.getMonth() + 1) === selectedMonth;
        });
        // Sort events by date ascending
        filteredPosts.sort((a, b) => {
             const dateA = a.eventDate ? new Date(a.eventDate).getTime() : new Date(a.createdAt).getTime();
             const dateB = b.eventDate ? new Date(b.eventDate).getTime() : new Date(b.createdAt).getTime();
             return dateA - dateB;
        });
    }

    return (
        <>
            <div className="bg-stone-100 py-16 md:py-24 relative overflow-hidden">
                 <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                     <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
                 </div>
                <Container className="relative z-10 text-center">
                    {/* Removed tracking-widest */}
                    <span className="text-emerald-700 font-bold text-sm uppercase mb-3 block">Alo Mua Chung</span>
                    {/* Changed font-serif to font-sans/default and tracking-normal */}
                    <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 tracking-normal">Dưỡng Vườn Tâm</h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                        Nơi chia sẻ những câu chuyện về lối sống xanh, sự tử tế và cách chúng ta cùng nhau nuôi dưỡng tâm hồn giữa cuộc sống bộn bề.
                    </p>
                </Container>
            </div>

            <Section>
                <Container>
                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 border",
                                        isActive 
                                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md transform scale-105" 
                                            : "bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-700"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-stone-400")} />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* EVENT: 12 Month Selector */}
                    {activeTab === 'event' && (
                        <div className="mb-12">
                            <div className="flex overflow-x-auto pb-4 gap-2 md:gap-4 justify-start md:justify-center custom-scrollbar">
                                {months.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => setSelectedMonth(m)}
                                        className={cn(
                                            "flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center border transition-all duration-300",
                                            selectedMonth === m
                                                ? "bg-amber-500 text-white border-amber-500 shadow-lg scale-110"
                                                : "bg-white text-stone-500 border-stone-200 hover:border-amber-300 hover:text-amber-600"
                                        )}
                                    >
                                        <span className="text-[10px] uppercase font-bold opacity-70">Tháng</span>
                                        <span className="text-lg md:text-xl font-bold">{m}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EVENT: Timeline View */}
                    {activeTab === 'event' ? (
                        <div className="max-w-3xl mx-auto">
                            <div className="relative border-l-2 border-amber-200 pl-6 md:pl-8 space-y-10 md:space-y-12 py-2">
                                {filteredPosts.map((post, idx) => {
                                    const date = post.eventDate ? new Date(post.eventDate) : new Date(post.createdAt);
                                    return (
                                        <FadeIn key={post.id} delay={idx * 100}>
                                            <div className="relative">
                                                <div className="absolute -left-[33px] md:-left-[41px] top-0 bg-white border-4 border-amber-500 w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm z-10"></div>
                                                <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative top-[-10px]">
                                                    <span className="text-xs md:text-sm font-bold text-amber-600 tracking-wider uppercase mb-2 block flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" /> 
                                                        Ngày {date.getDate()} - Tháng {date.getMonth() + 1}
                                                    </span>
                                                    <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">
                                                        <Link to={`/blog/${post.slug}`} className="hover:text-amber-600 transition-colors">
                                                            {post.title}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-stone-600 text-sm md:text-base mb-4">{post.excerpt}</p>
                                                    <Link to={`/blog/${post.slug}`} className="text-amber-600 font-bold text-sm hover:underline inline-flex items-center">
                                                        Xem chi tiết <ArrowRight className="w-4 h-4 ml-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </FadeIn>
                                    );
                                })}
                                {filteredPosts.length === 0 && (
                                     <div className="relative">
                                         <div className="absolute -left-[33px] md:-left-[41px] top-0 bg-stone-200 border-4 border-stone-300 w-5 h-5 md:w-6 md:h-6 rounded-full"></div>
                                         <div className="text-stone-500 italic pl-2">
                                             Không có sự kiện nào trong tháng {selectedMonth}.
                                         </div>
                                     </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Standard Grid View for other tabs */
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                            {filteredPosts.map((post, idx) => (
                                <FadeIn key={post.id} delay={idx * 50}>
                                    <div className="h-full">
                                        <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 group border-stone-200">
                                            <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-stone-200">
                                                <img 
                                                    src={post.coverImage || `https://picsum.photos/800/600?random=${idx}`} 
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                />
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-700 flex items-center gap-1 shadow-sm">
                                                    {post.category === 'solution' && <Gift className="w-3 h-3 text-emerald-600" />}
                                                    {post.category === 'story' && <Heart className="w-3 h-3 text-rose-500" />}
                                                    {post.category === 'event' && <Calendar className="w-3 h-3 text-amber-500" />}
                                                    {post.category === 'tea' && <Coffee className="w-3 h-3 text-stone-600" />}
                                                    {!post.category && <Leaf className="w-3 h-3 text-emerald-600" />}
                                                    
                                                    {tabs.find(t => t.id === post.category)?.label || 'Góc chia sẻ'}
                                                </div>
                                            </Link>
                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                
                                                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                                                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                                                </h3>
                                                
                                                {/* Special display for Tea Points location */}
                                                {post.category === 'tea' && post.location && (
                                                    <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-100">
                                                        <div className="text-xs text-stone-500 flex items-start gap-1.5 mb-2">
                                                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
                                                            <span>{post.location.address}</span>
                                                        </div>
                                                        {post.location.link && (
                                                            <a 
                                                                href={post.location.link} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="block w-full"
                                                            >
                                                                <Button size="sm" variant="outline" className="w-full text-xs h-8 bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                    <MapPin className="w-3 h-3 mr-1" /> Mở Google Maps
                                                                </Button>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="text-stone-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                                    {post.excerpt}
                                                </p>

                                                <div className="mt-auto pt-4 border-t border-stone-100 flex justify-between items-center text-sm font-medium text-emerald-700">
                                                    <Link to={`/blog/${post.slug}`} className="flex items-center">
                                                        Đọc tiếp <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    )}
                    
                    {filteredPosts.length === 0 && activeTab !== 'event' && (
                        <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
                            <Leaf className="w-16 h-16 mx-auto text-stone-300 mb-4" />
                            <h3 className="text-xl font-bold text-stone-600 mb-2">Chưa có bài viết nào</h3>
                            <p className="text-stone-500">Khu vườn ở mục này đang được gieo hạt. Hãy quay lại sau nhé!</p>
                        </div>
                    )}
                </Container>
            </Section>
        </>
    );
};

export default Blog;
