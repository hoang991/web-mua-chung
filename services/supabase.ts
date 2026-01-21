
import { createClient } from '@supabase/supabase-js';

// Thông tin project từ user
const SUPABASE_URL = 'https://gpwzkrlubuigqmwhbyxv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Uetya3WrQ4WtB6DnqMV4Rg_cfTqAywe';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper để kiểm tra kết nối
export const checkConnection = async () => {
    try {
        const { data, error } = await supabase.from('config').select('count', { count: 'exact', head: true });
        if (error && error.code !== '42P01') { // 42P01 là lỗi chưa có bảng, nghĩa là kết nối OK
            console.error("Supabase connection error:", error);
            return false;
        }
        return true;
    } catch (e) {
        console.error("Supabase connection exception:", e);
        return false;
    }
};
