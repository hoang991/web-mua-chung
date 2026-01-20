

export type ThemeColor = 'emerald' | 'blue' | 'rose' | 'amber' | 'slate' | 'violet';
export type ThemeFont = 'inter' | 'serif' | 'mono';

export interface MenuLink {
  id: string;
  name: string;
  path: string;
  isVisible: boolean;
  order: number;
}

export interface SiteConfig {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  primaryColor: ThemeColor;
  font: ThemeFont;
  seoTitle: string;
  seoDescription: string;
  socialLinks: {
    facebook?: string;
    zalo?: string;
    telegram?: string;
  };
  aiKeys?: {
    gemini?: string;
    openai?: string;
    claude?: string;
    grok?: string;
  };
  mainMenu: MenuLink[];
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'document';
  createdAt: string;
}

export interface SectionItem {
  title: string;
  description: string;
  label?: string; // e.g., "Ngày 1-10"
  image?: string;
}

export interface SectionContent {
  id: string;
  type: 'hero' | 'text' | 'features' | 'cta' | 'diagram' | 'image-text' | 'timeline';
  title: string;
  subtitle?: string;
  content?: string;
  image?: string; // URL to image
  ctaText?: string;
  ctaLink?: string;
  isVisible: boolean;
  order: number;
  items?: SectionItem[]; // For lists like timeline
}

export interface PageData {
  slug: string;
  title: string;
  sections: SectionContent[];
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published';
  updatedAt: string;
}

export type BlogCategory = 'solution' | 'story' | 'event' | 'tea';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown
  coverImage?: string;
  category: BlogCategory;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  // New Location Data for 'tea' category
  location?: {
      address: string;
      link?: string; // Google Maps Link
      // Legacy support (optional)
      lat?: number;
      lng?: number;
  };
  // New Event Date for 'event' category
  eventDate?: string; // ISO Date String
}

// New Types for Product & Supplier
export interface PricingTier {
  minQuantity: number;
  price: number;
  label?: string; // e.g., "Mua lẻ", "Mua chung 10+", "Đại lý"
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string; // Detailed content
  shortDescription: string;
  images: string[];
  pricing: PricingTier[];
  category: string;
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface SupplierPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  status: 'published' | 'draft';
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  type: 'leader_registration' | 'supplier_contact' | 'general_contact';
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: 'new' | 'read' | 'contacted';
  createdAt: string;
  metadata?: Record<string, any>;
}

export const DEFAULT_CONFIG: SiteConfig = {
  siteName: "Alo Mua Chung",
  contactEmail: "lienhe@alomuachung.vn",
  contactPhone: "0909.888.999",
  primaryColor: "emerald",
  font: "inter",
  seoTitle: "Alo Mua Chung - Cộng Đồng Tiêu Dùng Thông Minh",
  seoDescription: "Nền tảng kết nối người dùng, Trưởng Nhóm Khu Vực và Nhà sản xuất tử tế. Không bán lẻ, không đa cấp.",
  socialLinks: {},
  aiKeys: {},
  mainMenu: [
    { id: '1', name: 'Về chúng tôi', path: '/', isVisible: true, order: 1 },
    { id: '2', name: 'Mô hình', path: '/model', isVisible: true, order: 2 },
    { id: '3', name: 'Trưởng Nhóm KV', path: '/leader', isVisible: true, order: 3 },
    { id: '4', name: 'Vườn giải pháp', path: '/products', isVisible: true, order: 4 },
    { id: '5', name: 'Dưỡng vườn tâm', path: '/blog', isVisible: true, order: 5 },
  ]
};
