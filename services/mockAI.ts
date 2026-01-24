
// This service simulates an AI response. 
// In a real application, this would call an API like OpenAI (ChatGPT) or Google Gemini.

export const aiService = {
  // Enhanced Generic Generation
  generateText: async (prompt: string, context?: { wordCount?: number; outline?: string; type?: string }) => {
     // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const wordCount = context?.wordCount || 200;
    const outline = context?.outline ? `\nDựa trên dàn ý: ${context.outline}` : '';
    const lengthGuide = wordCount > 0 ? ` (Khoảng ${wordCount} từ)` : '';

    // Simulate different responses based on type/prompt
    if (context?.type === 'title') {
        return `Tiêu đề gợi ý: ${prompt} - Giải pháp toàn diện cho gia đình bạn`;
    }

    if (context?.type === 'policy') {
         return `
<h3>1. Quy định chung</h3>
<p>Nội dung này được tạo tự động dựa trên yêu cầu: "${prompt}". Chúng tôi cam kết bảo vệ quyền lợi người dùng...</p>
<h3>2. Chi tiết điều khoản</h3>
<p>Dựa trên dàn ý của bạn, chúng tôi quy định rõ ràng về các vấn đề liên quan. (Đây là nội dung mô phỏng dài khoảng ${wordCount} từ).</p>
         `;
    }

    // Default rich text generation
    return `
<p><em>(Nội dung được tạo bởi AI theo yêu cầu: "${prompt}"${lengthGuide})</em></p>
${outline ? `<p><strong>Triển khai dàn ý:</strong></p>` : ''}
<p>Chào mừng bạn đến với nội dung được tạo tự động. Đây là đoạn văn mở đầu thu hút người đọc, tập trung vào từ khóa chính "${prompt}".</p>

<h3>Lợi ích và Giá trị</h3>
<p>Sản phẩm/Dịch vụ này mang lại nhiều giá trị thiết thực. Chúng tôi tập trung vào chất lượng và trải nghiệm người dùng. ${context?.outline ? 'Như bạn đã đề cập trong dàn ý, phần này rất quan trọng.' : ''}</p>

<ul>
    <li>Điểm nổi bật số 1: Chất lượng vượt trội.</li>
    <li>Điểm nổi bật số 2: Nguồn gốc rõ ràng.</li>
    <li>Điểm nổi bật số 3: Giá thành hợp lý.</li>
</ul>

<h3>Kết luận</h3>
<p>Hy vọng thông tin này hữu ích với bạn. Hãy liên hệ với chúng tôi để biết thêm chi tiết. (Đã hoàn thành mô phỏng ${wordCount} chữ).</p>
    `;
  },

  generateProductContent: async (productName: string) => {
    // Legacy method support
    return await aiService.generateText(`Viết mô tả sản phẩm cho ${productName}`, { wordCount: 300 });
  },

  generateSupplierPost: async (title: string) => {
    // Legacy method support
    return await aiService.generateText(`Viết bài giới thiệu nhà cung cấp: ${title}`, { wordCount: 500 });
  }
};
