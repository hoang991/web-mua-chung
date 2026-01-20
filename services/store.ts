
import { SiteConfig, FormSubmission, DEFAULT_CONFIG, PageData, MediaItem, BlogPost, Product, SupplierPost } from '../types';

const STORAGE_KEYS = {
  CONFIG: 'mctt_config',
  SUBMISSIONS: 'mctt_submissions',
  AUTH: 'mctt_auth',
  ADMIN_PASS: 'mctt_admin_pass', // New key for password
  PAGES: 'mctt_pages',
  MEDIA: 'mctt_media',
  PRODUCTS: 'mctt_products',
  SUPPLIER_POSTS: 'mctt_supplier_posts',
  BLOG_POSTS: 'mctt_blog_posts' // New key for Dưỡng vườn tâm
};

// Helper for safe parsing to prevent white-screen crashes
const safeParse = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error parsing key ${key}:`, error);
    return fallback;
  }
};

// Initial Pages Data
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

// Initial Product Data
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

// Initial Blog Posts
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

export const storageService = {
  // --- Config ---
  getConfig: (): SiteConfig => {
    // Merge with default to ensure new fields like aiKeys exist if local storage is old
    const stored = safeParse(STORAGE_KEYS.CONFIG, DEFAULT_CONFIG);
    return { ...DEFAULT_CONFIG, ...stored, aiKeys: { ...DEFAULT_CONFIG.aiKeys, ...stored.aiKeys } };
  },

  saveConfig: (config: SiteConfig) => {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  },

  // --- Auth ---
  checkAuth: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  },

  login: (password: string): boolean => {
    // Check against stored password, default is 'admin123'
    const storedPass = localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'admin123';
    if (password === storedPass) {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  },

  changePassword: (newPass: string) => {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPass);
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  // --- Pages ---
  getPages: (): PageData[] => {
    return safeParse(STORAGE_KEYS.PAGES, INITIAL_PAGES);
  },

  getPage: (slug: string): PageData | undefined => {
    const pages = storageService.getPages();
    return pages.find(p => p.slug === slug);
  },

  savePage: (page: PageData) => {
     const pages = storageService.getPages();
     const idx = pages.findIndex(p => p.slug === page.slug);
     if (idx >= 0) {
       pages[idx] = { ...page, updatedAt: new Date().toISOString() };
     } else {
       pages.push({ ...page, updatedAt: new Date().toISOString() });
     }
     localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pages));
  },

  // --- Products (Solutions) ---
  getProducts: (): Product[] => {
      return safeParse(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  
  saveProduct: (product: Product) => {
      const items = storageService.getProducts();
      const idx = items.findIndex(p => p.id === product.id);
      if (idx >= 0) {
          items[idx] = { ...product, updatedAt: new Date().toISOString() };
      } else {
          items.push({ ...product, updatedAt: new Date().toISOString() });
      }
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(items));
  },

  deleteProduct: (id: string) => {
      const items = storageService.getProducts();
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(items.filter(p => p.id !== id)));
  },

  // --- Blog Posts (Dưỡng vườn tâm) ---
  getBlogPosts: (): BlogPost[] => {
      return safeParse(STORAGE_KEYS.BLOG_POSTS, INITIAL_BLOG_POSTS);
  },

  saveBlogPost: (post: BlogPost) => {
      const items = storageService.getBlogPosts();
      const idx = items.findIndex(p => p.id === post.id);
      if (idx >= 0) {
          items[idx] = { ...post, updatedAt: new Date().toISOString() };
      } else {
          items.push({ ...post, updatedAt: new Date().toISOString() });
      }
      localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(items));
  },

  deleteBlogPost: (id: string) => {
      const items = storageService.getBlogPosts();
      localStorage.setItem(STORAGE_KEYS.BLOG_POSTS, JSON.stringify(items.filter(p => p.id !== id)));
  },

  // --- Supplier Posts ---
  getSupplierPosts: (): SupplierPost[] => {
      return safeParse(STORAGE_KEYS.SUPPLIER_POSTS, []);
  },

  saveSupplierPost: (post: SupplierPost) => {
      const items = storageService.getSupplierPosts();
      const idx = items.findIndex(p => p.id === post.id);
      if (idx >= 0) {
          items[idx] = { ...post, updatedAt: new Date().toISOString() };
      } else {
          items.push({ ...post, updatedAt: new Date().toISOString() });
      }
      localStorage.setItem(STORAGE_KEYS.SUPPLIER_POSTS, JSON.stringify(items));
  },

  deleteSupplierPost: (id: string) => {
      const items = storageService.getSupplierPosts();
      localStorage.setItem(STORAGE_KEYS.SUPPLIER_POSTS, JSON.stringify(items.filter(p => p.id !== id)));
  },

  // --- Submissions ---
  getSubmissions: (): FormSubmission[] => {
    return safeParse(STORAGE_KEYS.SUBMISSIONS, []);
  },

  addSubmission: (submission: Omit<FormSubmission, 'id' | 'createdAt' | 'status'>) => {
    const current = storageService.getSubmissions();
    const newSubmission: FormSubmission = {
      ...submission,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([newSubmission, ...current]));
  },

  updateSubmissionStatus: (id: string, status: FormSubmission['status']) => {
    const current = storageService.getSubmissions();
    const updated = current.map(s => s.id === id ? { ...s, status } : s);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));
  },
  
  exportSubmissions: (): void => {
      const data = storageService.getSubmissions();
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

  // --- Media ---
  getMedia: (): MediaItem[] => {
    return safeParse(STORAGE_KEYS.MEDIA, []);
  },

  addMedia: (item: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const current = storageService.getMedia();
    const newItem: MediaItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify([newItem, ...current]));
  },

  deleteMedia: (id: string) => {
    const current = storageService.getMedia();
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(current.filter(i => i.id !== id)));
  }
};