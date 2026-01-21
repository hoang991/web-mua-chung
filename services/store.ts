
import { SiteConfig, FormSubmission, DEFAULT_CONFIG, PageData, MediaItem, BlogPost, Product, SupplierPost } from '../types';
import { supabase } from './supabase';

// Keys for LocalStorage (Fallback)
const STORAGE_KEYS = {
  AUTH_CACHE: 'mctt_auth_session', // Cache session status
};

// Initial Data Constants (Giữ nguyên như cũ để seed dữ liệu)
const INITIAL_PAGES: PageData[] = [
  {
    slug: 'home',
    title: 'Trang Chủ',
    status: 'published',
    updatedAt: new Date().toISOString(),
    metaTitle: 'Trang Chủ - Alo Mua Chung',
    metaDescription: 'Nền tảng mua chung tử tế, kết nối trực tiếp NSX và người dùng.',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'Chúng tôi không bán hàng – chúng tôi tổ chức mua chung tử tế.',
        subtitle: 'Kết nối trực tiếp từ Nhà sản xuất tận tâm đến Cộng đồng thông qua những Trưởng Nhóm Khu Vực địa phương.',
        ctaText: 'Tìm hiểu cách hoạt động',
        ctaLink: '/model',
        isVisible: true,
        order: 1
      },
      {
        id: 'pillars',
        type: 'features',
        title: 'Lợi ích cho tất cả',
        subtitle: 'Mô hình win-win-win bền vững dựa trên sự thật.',
        isVisible: true,
        order: 2,
        items: [
            {
                title: "Người Dùng",
                description: "Sở hữu giải pháp/sản phẩm tốt với giá \"gốc\" nhờ sức mạnh tập thể. An tâm tuyệt đối về nguồn gốc vì Trưởng Nhóm đã kiểm chứng."
            },
            {
                title: "Trưởng Nhóm Khu Vực",
                description: "Có thêm thu nhập xứng đáng từ việc chăm sóc cộng đồng. Xây dựng uy tín cá nhân và mang lại giá trị thực."
            },
            {
                title: "Nhà Sản Xuất",
                description: "Có kế hoạch sản xuất ổn định nhờ đơn đặt trước (pre-order). Tập trung làm tốt chất lượng thay vì lo marketing."
            }
        ]
      },
      {
        id: 'trust',
        type: 'image-text',
        title: 'Khác biệt để bền vững',
        content: 'Chúng tôi gom đơn định kỳ để tối ưu vận chuyển. Chỉ có 1 tầng Trưởng Nhóm duy nhất. Chia sẻ giá trị giải pháp thực.',
        image: 'https://picsum.photos/800/600?grayscale',
        isVisible: true,
        order: 3,
        items: [
            { title: "Không bán lẻ", description: "Gom đơn để tối ưu chi phí" },
            { title: "Không đa cấp", description: "Chỉ 1 tầng Trưởng Nhóm duy nhất" },
            { title: "Minh bạch 100%", description: "Về nguồn gốc và giá thành" }
        ]
      }
    ]
  },
  {
    slug: 'model',
    title: 'Mô hình hoạt động',
    status: 'published',
    updatedAt: new Date().toISOString(),
    sections: [
      { id: 'diagram', type: 'diagram', title: 'Sơ đồ luân chuyển', isVisible: true, order: 1 },
      { 
        id: 'timeline', 
        type: 'timeline', 
        title: 'Quy trình 30 ngày', 
        subtitle: 'Để đảm bảo giá tốt nhất và giải pháp mới nhất, chúng tôi không bán sẵn. Mọi thứ hoạt động theo lịch trình chính xác.',
        isVisible: true, 
        order: 2,
        items: [
          { label: "Ngày 1-10", title: "Mở cổng đăng ký (Pre-order)", description: "Cộng đồng đặt giải pháp thông qua Trưởng Nhóm. Trưởng Nhóm tổng hợp số lượng." },
          { label: "Ngày 11-15", title: "Chốt đơn & Sản xuất", description: "NSX nhận số liệu chính xác và bắt đầu đóng gói/sản xuất để đảm bảo chất lượng tốt nhất." },
          { label: "Ngày 16-25", title: "Vận chuyển tập trung", description: "Hàng được chuyển về kho tổng và phân phối đến địa điểm của từng Trưởng Nhóm." },
          { label: "Ngày 26-30", title: "Trả hàng & Chăm sóc", description: "Khách hàng nhận giải pháp tại điểm Trưởng Nhóm hoặc được ship. Trưởng Nhóm hướng dẫn sử dụng." }
        ]
      }
    ]
  },
  {
    slug: 'leader',
    title: 'Dành cho Trưởng Nhóm',
    status: 'published',
    updatedAt: new Date().toISOString(),
    sections: [
      { id: 'hero', type: 'hero', title: 'Trở thành trái tim cộng đồng', isVisible: true, order: 1 },
      { id: 'form', type: 'cta', title: 'Form đăng ký', isVisible: true, order: 2 }
    ]
  },
  {
    slug: 'privacy',
    title: 'Chính sách bảo mật',
    status: 'published',
    updatedAt: new Date().toISOString(),
    sections: [
      { 
        id: 'content', 
        type: 'text', 
        title: 'Chính sách bảo mật thông tin', 
        content: `
<h3>1. Mục đích và phạm vi thu thập</h3>
<p>Để truy cập và sử dụng một số dịch vụ tại Alo Mua Chung, bạn có thể sẽ được yêu cầu đăng ký với chúng tôi thông tin cá nhân (Email, Họ tên, Số ĐT liên lạc...). Mọi thông tin khai báo phải đảm bảo tính chính xác và hợp pháp.</p>

<h3>2. Phạm vi sử dụng thông tin</h3>
<p>Alo Mua Chung thu thập và sử dụng thông tin cá nhân quý khách với mục đích phù hợp và hoàn toàn tuân thủ nội dung của "Chính sách bảo mật" này.</p>
        `,
        isVisible: true, 
        order: 1 
      }
    ]
  },
  {
    slug: 'terms',
    title: 'Điều khoản sử dụng',
    status: 'published',
    updatedAt: new Date().toISOString(),
    sections: [
       { 
        id: 'content', 
        type: 'text', 
        title: 'Điều khoản sử dụng', 
        content: `
<h3>1. Hướng dẫn sử dụng website</h3>
<ul>
<li>Người dùng phải đủ 18 tuổi hoặc truy cập dưới sự giám sát của cha mẹ hay người giám hộ hợp pháp.</li>
</ul>

<h3>2. Chính sách Pre-order</h3>
<p>Mô hình của chúng tôi hoạt động dựa trên nguyên tắc gom đơn (mua chung). Do đó, thời gian nhận hàng có thể lâu hơn so với thương mại điện tử thông thường.</p>
        `,
        isVisible: true, 
        order: 1 
      }
    ]
  }
];

const INITIAL_PRODUCTS: Product[] = [
    {
        id: 'p1',
        name: 'Combo Rau Củ Hữu Cơ Đà Lạt',
        slug: 'combo-rau-cu-huu-co',
        shortDescription: 'Combo 5kg các loại rau củ theo mùa, thu hoạch trong ngày.',
        description: 'Bao gồm: Cà rốt, Khoai tây, Súp lơ, Cải thảo, Hành tây. Cam kết không thuốc BVTV.',
        images: ['https://picsum.photos/id/292/600/600', 'https://picsum.photos/id/1080/600/600'],
        pricing: [
            { minQuantity: 1, price: 150000, label: 'Mua lẻ' },
            { minQuantity: 10, price: 135000, label: 'Gom chung (10+)' },
            { minQuantity: 50, price: 120000, label: 'Giá gốc (50+)' }
        ],
        category: 'Nông sản',
        status: 'active',
        updatedAt: new Date().toISOString()
    }
];

const INITIAL_BLOG_POSTS: BlogPost[] = [
    {
        id: 'b1',
        slug: 'song-cham-de-yeu-thuong',
        title: 'Sống chậm để yêu thương nhiều hơn',
        excerpt: 'Trong guồng quay hối hả của cuộc sống hiện đại, đôi khi chúng ta cần một khoảng lặng để nhìn lại...',
        content: `
<p>Chúng ta đang sống trong một thế giới mà mọi thứ đều diễn ra quá nhanh. Ăn nhanh, uống nhanh, và thậm chí là yêu thương cũng vội vàng. Nhưng liệu sự nhanh chóng đó có thực sự mang lại hạnh phúc?</p>
<p>Dưỡng vườn tâm là nơi chúng ta cùng nhau chia sẻ những câu chuyện về sự tử tế, về lối sống xanh và cách để tìm lại sự cân bằng trong tâm hồn.</p>
        `,
        coverImage: 'https://picsum.photos/800/400?grayscale',
        status: 'published',
        category: 'tea',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'b2',
        slug: 'su-tu-te-trong-tieu-dung',
        title: 'Sự tử tế trong tiêu dùng: Bắt đầu từ đâu?',
        excerpt: 'Tiêu dùng không chỉ là mua sắm, đó là lá phiếu bạn bầu chọn cho thế giới bạn muốn sống.',
        content: `
<p>Mỗi lần bạn bỏ tiền ra mua một món hàng, bạn đang ủng hộ cho quy trình sản xuất ra nó. Tại Alo Mua Chung, chúng tôi tin rằng sự tử tế bắt đầu từ việc minh bạch nguồn gốc và chia sẻ lợi ích công bằng với người nông dân.</p>
        `,
        coverImage: 'https://picsum.photos/800/401?grayscale',
        status: 'published',
        category: 'solution',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'b3',
        slug: 'buoi-gap-go-chi-em',
        title: 'Họp mặt chị em cuối tuần: Chia sẻ chuyện bếp núc',
        excerpt: 'Thân mời các chị em tham gia buổi trà chiều chia sẻ về các công thức nấu ăn ngon và lành mạnh.',
        content: `
<p>Thời gian: 15:00 Thứ 7 tuần này.</p>
<p>Địa điểm: Nhà cộng đồng.</p>
<p>Nội dung: Hướng dẫn làm sữa hạt tại nhà.</p>
        `,
        coverImage: 'https://picsum.photos/800/402?grayscale',
        status: 'published',
        category: 'event',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Observer Pattern Type
type StoreListener = () => void;

// In-Memory Cache with Realtime Capabilities
class StoreCache {
    config: SiteConfig = DEFAULT_CONFIG;
    pages: PageData[] = [];
    products: Product[] = [];
    blogPosts: BlogPost[] = [];
    supplierPosts: SupplierPost[] = [];
    submissions: FormSubmission[] = [];
    media: MediaItem[] = [];
    
    isInitialized: boolean = false;
    isAuthenticated: boolean = false;
    
    listeners: Set<StoreListener> = new Set();
}

const cache = new StoreCache();

// Helper to notify all UI components to re-render
const notify = () => {
    cache.listeners.forEach(l => l());
};

export const storageService = {
  // --- Observer / Subscription ---
  subscribe: (listener: StoreListener) => {
      cache.listeners.add(listener);
      return () => {
          cache.listeners.delete(listener);
      };
  },

  // --- Initialization ---
  init: async (): Promise<void> => {
    if (cache.isInitialized) return;

    try {
        console.log("Initializing storage from Supabase...");
        
        // 0. Check Session
        const { data: { session } } = await supabase.auth.getSession();
        cache.isAuthenticated = !!session;

        // 1. Config
        const { data: configData } = await supabase.from('config').select('*').eq('key', 'main').single();
        if (configData) {
            cache.config = { ...DEFAULT_CONFIG, ...configData.value };
        } else {
            await supabase.from('config').insert({ key: 'main', value: DEFAULT_CONFIG });
            cache.config = DEFAULT_CONFIG;
        }

        // 2. Pages
        const { data: pagesData } = await supabase.from('pages').select('*');
        if (pagesData && pagesData.length > 0) {
            cache.pages = pagesData.map(p => ({ ...p.data, slug: p.slug }));
        } else {
            cache.pages = INITIAL_PAGES;
            for (const p of INITIAL_PAGES) {
                await supabase.from('pages').insert({ slug: p.slug, data: p });
            }
        }

        // 3. Products
        const { data: prodData } = await supabase.from('products').select('*');
        if (prodData && prodData.length > 0) {
            cache.products = prodData.map(p => p.data);
        } else {
            cache.products = INITIAL_PRODUCTS;
             for (const p of INITIAL_PRODUCTS) {
                await supabase.from('products').insert({ id: p.id, data: p });
            }
        }

        // 4. Posts (Blog & Supplier)
        const { data: postData } = await supabase.from('posts').select('*');
        cache.blogPosts = [];
        cache.supplierPosts = [];
        
        if (postData && postData.length > 0) {
            postData.forEach(p => {
                if (p.type === 'blog') cache.blogPosts.push(p.data);
                if (p.type === 'supplier') cache.supplierPosts.push(p.data);
            });
        } else {
             cache.blogPosts = INITIAL_BLOG_POSTS;
             for (const p of INITIAL_BLOG_POSTS) {
                await supabase.from('posts').insert({ id: p.id, type: 'blog', data: p });
            }
        }

        // 5. Submissions
        const { data: subData } = await supabase.from('submissions').select('*');
        if (subData) {
            cache.submissions = subData.map(s => s.data);
        }

        // 6. Media
        const { data: mediaData } = await supabase.from('media').select('*');
        if (mediaData) {
            cache.media = mediaData.map(m => m.data);
        }

        // 7. Setup Realtime Listeners
        storageService.setupRealtime();

        cache.isInitialized = true;
        notify(); // Initial notify

    } catch (error) {
        console.error("Initialization failed, falling back to local defaults:", error);
        cache.pages = INITIAL_PAGES;
        cache.products = INITIAL_PRODUCTS;
        cache.blogPosts = INITIAL_BLOG_POSTS;
        cache.isInitialized = true;
    }
  },

  // --- Realtime Setup ---
  setupRealtime: () => {
      supabase.channel('public-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
            console.log('Realtime update received:', payload);
            const { table, eventType, new: newRecord, old: oldRecord } = payload as any;

            // Helper to update array by ID
            const updateArray = (arr: any[], idField: string, newData: any) => {
                const idx = arr.findIndex(item => item[idField] === newData[idField]);
                if (idx !== -1) arr[idx] = newData;
                else arr.push(newData);
            };
            
            const deleteFromArray = (arr: any[], idField: string, id: string) => {
                const idx = arr.findIndex(item => item[idField] === id);
                if (idx !== -1) arr.splice(idx, 1);
            };

            // Map DB changes to Cache
            if (table === 'config' && newRecord) {
                if (newRecord.key === 'main') cache.config = newRecord.value;
            }
            else if (table === 'pages') {
                if (eventType === 'DELETE') deleteFromArray(cache.pages, 'slug', oldRecord.slug);
                else if (newRecord) updateArray(cache.pages, 'slug', { ...newRecord.data, slug: newRecord.slug });
            }
            else if (table === 'products') {
                if (eventType === 'DELETE') deleteFromArray(cache.products, 'id', oldRecord.id);
                else if (newRecord) updateArray(cache.products, 'id', newRecord.data);
            }
            else if (table === 'posts') {
                if (eventType === 'DELETE') {
                    deleteFromArray(cache.blogPosts, 'id', oldRecord.id);
                    deleteFromArray(cache.supplierPosts, 'id', oldRecord.id);
                } else if (newRecord) {
                    if (newRecord.type === 'blog') updateArray(cache.blogPosts, 'id', newRecord.data);
                    if (newRecord.type === 'supplier') updateArray(cache.supplierPosts, 'id', newRecord.data);
                }
            }
            else if (table === 'submissions') {
                if (eventType === 'DELETE') deleteFromArray(cache.submissions, 'id', oldRecord.id);
                else if (newRecord) updateArray(cache.submissions, 'id', newRecord.data);
            }
            else if (table === 'media') {
                 if (eventType === 'DELETE') deleteFromArray(cache.media, 'id', oldRecord.id);
                 else if (newRecord) updateArray(cache.media, 'id', newRecord.data);
            }
            notify(); // Trigger UI updates
        })
        .subscribe();
  },

  // --- Config ---
  getConfig: (): SiteConfig => {
    return cache.config;
  },

  saveConfig: async (config: SiteConfig) => {
    cache.config = config;
    await supabase.from('config').upsert({ key: 'main', value: config });
    notify();
  },

  // --- Auth (Supabase) ---
  checkAuth: (): boolean => {
    return cache.isAuthenticated;
  },

  login: async (email: string, password: string): Promise<{ success: boolean, error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { success: false, error: error.message };
    }
    if (data.session) {
        cache.isAuthenticated = true;
        notify();
        return { success: true };
    }
    return { success: false, error: 'Unknown error' };
  },

  logout: async () => {
    await supabase.auth.signOut();
    cache.isAuthenticated = false;
    notify();
  },

  changePassword: (newPass: string) => {
      console.log("Password change handled by Supabase Auth UI now");
  },

  // --- Pages ---
  getPages: (): PageData[] => {
    return cache.pages;
  },

  getPage: (slug: string): PageData | undefined => {
    return cache.pages.find(p => p.slug === slug);
  },

  savePage: async (page: PageData) => {
     const idx = cache.pages.findIndex(p => p.slug === page.slug);
     if (idx >= 0) cache.pages[idx] = { ...page, updatedAt: new Date().toISOString() };
     else cache.pages.push({ ...page, updatedAt: new Date().toISOString() });
     
     await supabase.from('pages').upsert({ 
         slug: page.slug, 
         data: page, 
         updated_at: new Date().toISOString() 
     });
     notify();
  },

  // --- Products ---
  getProducts: (): Product[] => {
      return cache.products;
  },
  
  saveProduct: async (product: Product) => {
      const idx = cache.products.findIndex(p => p.id === product.id);
      if (idx >= 0) cache.products[idx] = { ...product, updatedAt: new Date().toISOString() };
      else cache.products.push({ ...product, updatedAt: new Date().toISOString() });

      await supabase.from('products').upsert({
          id: product.id,
          data: product,
          updated_at: new Date().toISOString()
      });
      notify();
  },

  deleteProduct: async (id: string) => {
      cache.products = cache.products.filter(p => p.id !== id);
      await supabase.from('products').delete().eq('id', id);
      notify();
  },

  // --- Blog Posts ---
  getBlogPosts: (): BlogPost[] => {
      return cache.blogPosts;
  },

  saveBlogPost: async (post: BlogPost) => {
      const idx = cache.blogPosts.findIndex(p => p.id === post.id);
      if (idx >= 0) cache.blogPosts[idx] = { ...post, updatedAt: new Date().toISOString() };
      else cache.blogPosts.push({ ...post, updatedAt: new Date().toISOString() });

      await supabase.from('posts').upsert({
          id: post.id,
          type: 'blog',
          data: post,
          updated_at: new Date().toISOString()
      });
      notify();
  },

  deleteBlogPost: async (id: string) => {
      cache.blogPosts = cache.blogPosts.filter(p => p.id !== id);
      await supabase.from('posts').delete().eq('id', id);
      notify();
  },

  // --- Supplier Posts ---
  getSupplierPosts: (): SupplierPost[] => {
      return cache.supplierPosts;
  },

  saveSupplierPost: async (post: SupplierPost) => {
      const idx = cache.supplierPosts.findIndex(p => p.id === post.id);
      if (idx >= 0) cache.supplierPosts[idx] = { ...post, updatedAt: new Date().toISOString() };
      else cache.supplierPosts.push({ ...post, updatedAt: new Date().toISOString() });

      await supabase.from('posts').upsert({
          id: post.id,
          type: 'supplier',
          data: post,
          updated_at: new Date().toISOString()
      });
      notify();
  },

  deleteSupplierPost: async (id: string) => {
      cache.supplierPosts = cache.supplierPosts.filter(p => p.id !== id);
      await supabase.from('posts').delete().eq('id', id);
      notify();
  },

  // --- Submissions ---
  getSubmissions: (): FormSubmission[] => {
    return cache.submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addSubmission: async (submission: Omit<FormSubmission, 'id' | 'createdAt' | 'status'>) => {
    const newSubmission: FormSubmission = {
      ...submission,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    cache.submissions.unshift(newSubmission);
    
    await supabase.from('submissions').insert({
        id: newSubmission.id,
        type: newSubmission.type,
        data: newSubmission
    });
    notify();
  },

  updateSubmissionStatus: async (id: string, status: FormSubmission['status']) => {
    const idx = cache.submissions.findIndex(s => s.id === id);
    if (idx >= 0) {
        cache.submissions[idx].status = status;
        await supabase.from('submissions').update({
            data: cache.submissions[idx]
        }).eq('id', id);
        notify();
    }
  },
  
  exportSubmissions: (): void => {
      const data = cache.submissions;
      const csvContent = "data:text/csv;charset=utf-8," 
          + "Date,Type,Name,Email,Phone,Status\n"
          + data.map(e => `${e.createdAt},${e.type},${e.name},${e.email},${e.phone},${e.status}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "submissions_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  },

  // --- Media & Storage ---
  getMedia: (): MediaItem[] => {
    return cache.media;
  },

  addMedia: async (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const newItem: MediaItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    cache.media.unshift(newItem);

    await supabase.from('media').insert({
        id: newItem.id,
        data: newItem
    });
    notify();
  },

  // NEW: Upload file to Supabase Storage
  uploadImage: async (file: File): Promise<string | null> => {
      try {
          // 1. Upload to bucket
          const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const { data, error } = await supabase.storage.from('images').upload(fileName, file);
          
          if (error) {
              console.error('Storage upload error:', error);
              return null;
          }

          // 2. Get Public URL
          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);

          // 3. Add to Media Library Database automatically
          await storageService.addMedia({
              name: file.name,
              url: publicUrl,
              type: 'image'
          });

          return publicUrl;
      } catch (e) {
          console.error("Exception uploading:", e);
          return null;
      }
  },

  deleteMedia: async (id: string) => {
    cache.media = cache.media.filter(i => i.id !== id);
    await supabase.from('media').delete().eq('id', id);
    notify();
  }
};
