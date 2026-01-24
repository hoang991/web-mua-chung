
// This service simulates an AI response. 
// In a real application, this would call an API like OpenAI (ChatGPT) or Google Gemini.

export const aiService = {
  // Enhanced Generic Generation
  generateText: async (prompt: string, context?: { wordCount?: number; outline?: string; type?: string }) => {
     // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const wordCount = context?.wordCount || 300;
    const outline = context?.outline ? `\nDựa trên dàn ý: ${context.outline}` : '';
    const lengthGuide = wordCount > 0 ? ` (Khoảng ${wordCount} từ)` : '';
    const type = context?.type || 'content';

    // --- BULK GENERATION MODES (Return Objects) ---

    // 1. Bulk Blog Post
    if (type === 'bulk_blog') {
        const title = `Góc nhìn sâu sắc về: ${prompt}`;
        return {
            title: title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            excerpt: `Bài viết này sẽ đi sâu vào phân tích "${prompt}", mang lại góc nhìn mới mẻ và những giá trị thiết thực cho cuộc sống hàng ngày của bạn. (AI tóm tắt tự động)`,
            content: `
<h3>Giới thiệu về ${prompt}</h3>
<p>Chào mừng bạn đến với bài chia sẻ hôm nay. ${prompt} là một chủ đề đang nhận được rất nhiều sự quan tâm. ${outline ? 'Như dàn ý bạn đã vạch ra, chúng ta sẽ đi qua từng điểm quan trọng.' : ''}</p>

<h3>Tại sao điều này quan trọng?</h3>
<p>Trong cuộc sống hối hả, việc hiểu rõ về ${prompt} giúp chúng ta cân bằng và tìm thấy niềm vui.</p>
<ul>
    <li>Lợi ích thứ nhất: Giúp tinh thần thoải mái.</li>
    <li>Lợi ích thứ hai: Kết nối cộng đồng.</li>
    <li>Lợi ích thứ ba: Lan tỏa sự tử tế.</li>
</ul>

<h3>Góc nhìn chuyên sâu</h3>
<p>Đi sâu hơn vào vấn đề, chúng ta thấy rằng... (Nội dung chi tiết được AI viết dài khoảng ${wordCount} chữ theo yêu cầu).</p>

<h3>Lời kết</h3>
<p>Hy vọng những chia sẻ về ${prompt} đã mang lại cho bạn những thông tin hữu ích. Hãy cùng Alo Mua Chung lan tỏa giá trị này nhé.</p>
            `
        };
    }

    // 2. Bulk Product
    if (type === 'bulk_product') {
        const name = prompt;
        return {
            name: name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            shortDescription: `Sản phẩm ${name} chất lượng cao, nguồn gốc tự nhiên, được kiểm định kỹ lưỡng bởi đội ngũ Trưởng Nhóm Khu Vực.`,
            description: `
<h3>Thông tin chi tiết về ${name}</h3>
<p>Đây là giải pháp tuyệt vời cho gia đình bạn. Sản phẩm được sản xuất theo quy trình nghiêm ngặt, đảm bảo an toàn và chất lượng tốt nhất.</p>

<h3>Đặc điểm nổi bật</h3>
<ul>
    <li><strong>Nguồn gốc:</strong> Rõ ràng, minh bạch từ vùng nguyên liệu.</li>
    <li><strong>Chất lượng:</strong> Không hóa chất độc hại, quy trình khép kín.</li>
    <li><strong>Giá trị:</strong> Tiết kiệm chi phí nhờ mô hình mua chung.</li>
</ul>

<h3>Hướng dẫn sử dụng</h3>
<p>Để đạt hiệu quả tốt nhất, bạn nên sử dụng sản phẩm theo hướng dẫn sau... (Nội dung chi tiết dài ${wordCount} chữ).</p>

<h3>Cam kết từ Alo Mua Chung</h3>
<p>Chúng tôi cam kết hoàn tiền nếu sản phẩm không đúng mô tả. Sự tử tế là kim chỉ nam trong mọi hoạt động.</p>
            `
        };
    }

    // 3. Bulk Supplier Post
    if (type === 'bulk_supplier') {
        const title = `Hợp tác cùng ${prompt}`;
        return {
            title: title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            content: `
<h3>Giới thiệu về Nhà sản xuất ${prompt}</h3>
<p>Chúng tôi tự hào là đơn vị tiên phong trong lĩnh vực... Với sứ mệnh mang lại sản phẩm tử tế cho cộng đồng.</p>

<h3>Quy trình sản xuất</h3>
<p>Mọi khâu từ chọn nguyên liệu đến đóng gói đều được kiểm soát nghiêm ngặt. ${outline ? 'Theo yêu cầu của bạn, chúng tôi nhấn mạnh vào: ' + context.outline : ''}</p>

<h3>Tại sao nên hợp tác với chúng tôi?</h3>
<ul>
    <li>Sản phẩm chất lượng thật.</li>
    <li>Giá thành minh bạch.</li>
    <li>Luôn lắng nghe phản hồi từ cộng đồng.</li>
</ul>

<p>(Nội dung bài viết giới thiệu chi tiết dài khoảng ${wordCount} chữ).</p>
            `
        };
    }

    // --- SINGLE FIELD GENERATION MODES (Legacy/Specific) ---

    if (type === 'title') {
        return `Tiêu đề gợi ý: ${prompt} - Giải pháp toàn diện`;
    }

    if (type === 'policy') {
         return `
<h3>1. Quy định chung</h3>
<p>Nội dung này được tạo tự động dựa trên yêu cầu: "${prompt}". Chúng tôi cam kết bảo vệ quyền lợi người dùng...</p>
<h3>2. Chi tiết điều khoản</h3>
<p>Dựa trên dàn ý của bạn, chúng tôi quy định rõ ràng về các vấn đề liên quan. (Đây là nội dung mô phỏng dài khoảng ${wordCount} từ).</p>
         `;
    }

    // Default rich text generation (HTML)
    return `
<p><em>(Nội dung được tạo bởi AI theo yêu cầu: "${prompt}"${lengthGuide})</em></p>
${outline ? `<p><strong>Triển khai dàn ý:</strong></p>` : ''}
<p>Chào mừng bạn đến với nội dung được tạo tự động. Đây là đoạn văn mở đầu thu hút người đọc, tập trung vào từ khóa chính "${prompt}".</p>

<h3>Nội dung chính</h3>
<p>Vấn đề này mang lại nhiều giá trị thiết thực. Chúng tôi tập trung vào chất lượng và trải nghiệm người dùng.</p>

<h3>Kết luận</h3>
<p>Hy vọng thông tin này hữu ích với bạn. (Đã hoàn thành mô phỏng ${wordCount} chữ).</p>
    `;
  },

  generateProductContent: async (productName: string) => {
    return await aiService.generateText(`Viết mô tả sản phẩm cho ${productName}`, { wordCount: 300 });
  },

  generateSupplierPost: async (title: string) => {
    return await aiService.generateText(`Viết bài giới thiệu nhà cung cấp: ${title}`, { wordCount: 500 });
  }
};
