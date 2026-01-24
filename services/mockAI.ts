
// This service simulates an AI response. 
// In a real application, this would call an API like OpenAI (ChatGPT) or Google Gemini.

const generateDetailedContent = (topic: string, length: number): string => {
    // Generate filler text to meet word count requirements while sounding natural
    const baseSentences = [
        `Việc lựa chọn ${topic} không chỉ mang lại giá trị sử dụng mà còn thể hiện phong cách sống của bạn.`,
        "Tại Alo Mua Chung, chúng tôi luôn đề cao sự minh bạch và nguồn gốc xuất xứ rõ ràng trong từng sản phẩm.",
        "Sự kết nối giữa người tiêu dùng và nhà sản xuất là chìa khóa để tạo nên một cộng đồng bền vững.",
        `Khi bạn hiểu rõ về ${topic}, bạn sẽ thấy trân trọng hơn công sức của những người làm ra nó.`,
        "Chất lượng sản phẩm luôn được đặt lên hàng đầu, đảm bảo an toàn tuyệt đối cho sức khỏe của gia đình bạn.",
        "Chúng ta hãy cùng nhau lan tỏa những giá trị tốt đẹp này đến với nhiều người hơn nữa.",
        `Giải pháp ${topic} thực sự là một bước tiến quan trọng trong việc nâng cao chất lượng cuộc sống.`
    ];

    let content = "";
    let currentLength = 0;
    while (currentLength < length) {
        // Create a paragraph
        let paragraph = "<p>";
        for (let i = 0; i < 4; i++) { // 3-5 sentences per paragraph
            const randomSentence = baseSentences[Math.floor(Math.random() * baseSentences.length)];
            paragraph += randomSentence + " ";
        }
        paragraph += "</p>";
        content += paragraph;
        currentLength += 60; // Approx words per paragraph
    }
    return content;
};

export const aiService = {
  // Enhanced Generic Generation
  generateText: async (prompt: string, context?: { wordCount?: number; outline?: string; type?: string }) => {
     // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const wordCount = context?.wordCount || 400;
    const outline = context?.outline ? context.outline : 'Các lợi ích chính, Hướng dẫn sử dụng, Cam kết chất lượng';
    const fillerText = generateDetailedContent(prompt, wordCount / 2); // Use half quota for filler body

    const type = context?.type || 'content';

    // --- BULK GENERATION MODES (Return Objects) ---

    // 1. Bulk Blog Post
    if (type === 'bulk_blog') {
        const title = `Góc nhìn chuyên sâu: ${prompt} và những giá trị thực`;
        return {
            title: title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            excerpt: `Khám phá toàn diện về ${prompt}. Bài viết chia sẻ những thông tin hữu ích, thiết thực giúp bạn có cái nhìn đúng đắn và áp dụng hiệu quả vào cuộc sống hàng ngày.`,
            content: `
<h3>Đặt vấn đề: Tại sao ${prompt} lại quan trọng?</h3>
<p>Trong cuộc sống hiện đại ngày nay, ${prompt} đang dần trở thành một chủ đề không thể bỏ qua. Nó không chỉ ảnh hưởng trực tiếp đến chất lượng cuộc sống mà còn tác động đến sự phát triển bền vững của cộng đồng.</p>
<p>Chúng ta thường quá bận rộn và bỏ quên những giá trị cốt lõi. Bài viết này sẽ giúp bạn nhìn nhận lại vấn đề một cách thấu đáo nhất.</p>

<h3>Phân tích chi tiết</h3>
${fillerText}

<h3>Những lợi ích không thể bỏ qua</h3>
<ul>
    <li><strong>Cải thiện chất lượng sống:</strong> Mang lại sự an tâm và thoải mái cho tinh thần.</li>
    <li><strong>Gắn kết cộng đồng:</strong> Tạo ra những mối liên kết bền vững dựa trên sự tin tưởng.</li>
    <li><strong>Tiết kiệm và hiệu quả:</strong> Tối ưu hóa nguồn lực và chi phí cho gia đình bạn.</li>
</ul>

<h3>Lời khuyên từ chuyên gia</h3>
<p>Để tận dụng tối đa lợi ích của ${prompt}, bạn nên bắt đầu từ những hành động nhỏ nhất. Hãy lắng nghe cơ thể và nhu cầu thực sự của bản thân. Đừng ngần ngại chia sẻ những trải nghiệm này với người thân và bạn bè.</p>

<h3>Kết luận</h3>
<p>Hy vọng những chia sẻ trên đã giúp bạn hiểu rõ hơn về ${prompt}. Hãy cùng Alo Mua Chung xây dựng một lối sống tử tế và văn minh ngay từ hôm nay.</p>
            `
        };
    }

    // 2. Bulk Product
    if (type === 'bulk_product') {
        const name = prompt;
        return {
            name: name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            shortDescription: `Sản phẩm ${name} thượng hạng, nguồn gốc tự nhiên, được kiểm định nghiêm ngặt bởi đội ngũ Trưởng Nhóm Khu Vực. Mang lại sức khỏe và sự an tâm cho gia đình.`,
            description: `
<h3>Giới thiệu sản phẩm ${name}</h3>
<p>Đây là giải pháp tuyệt vời được chúng tôi tuyển chọn kỹ lưỡng. Sản phẩm được sản xuất theo quy trình khép kín, đảm bảo giữ trọn vẹn giá trị dinh dưỡng và độ tươi ngon. Chúng tôi hiểu rằng, sức khỏe của gia đình bạn là điều quan trọng nhất.</p>

<h3>Ưu điểm vượt trội</h3>
<ul>
    <li><strong>Nguồn gốc minh bạch:</strong> Truy xuất nguồn gốc rõ ràng, trực tiếp từ vùng nguyên liệu sạch.</li>
    <li><strong>Quy trình chuẩn:</strong> Không sử dụng hóa chất độc hại, tuân thủ nghiêm ngặt các tiêu chuẩn an toàn vệ sinh thực phẩm.</li>
    <li><strong>Giá trị thực:</strong> Sản phẩm đến tay người dùng với mức giá tốt nhất nhờ mô hình mua chung, cắt giảm chi phí trung gian.</li>
</ul>

<h3>Thông tin chi tiết</h3>
${fillerText}

<h3>Hướng dẫn sử dụng và bảo quản</h3>
<p>Để sản phẩm luôn giữ được chất lượng tốt nhất, vui lòng bảo quản ở nơi khô ráo, thoáng mát. Sử dụng tốt nhất trong thời gian khuyến nghị trên bao bì.</p>

<h3>Cam kết từ Alo Mua Chung</h3>
<p>Chúng tôi cam kết hoàn tiền 100% nếu sản phẩm không đúng như mô tả. Sự hài lòng của bạn là niềm hạnh phúc của chúng tôi.</p>
            `
        };
    }

    // 3. Bulk Supplier Post
    if (type === 'bulk_supplier') {
        const title = `Đối tác chiến lược: Nhà sản xuất ${prompt}`;
        return {
            title: title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            content: `
<h3>Câu chuyện về Nhà sản xuất ${prompt}</h3>
<p>Chúng tôi tự hào giới thiệu đối tác chiến lược mới của Alo Mua Chung. Đây là đơn vị tiên phong trong lĩnh vực sản xuất xanh, với sứ mệnh mang lại những sản phẩm tử tế nhất cho cộng đồng.</p>

<h3>Quy trình sản xuất và Tiêu chuẩn chất lượng</h3>
<p>Mỗi sản phẩm làm ra đều chứa đựng tâm huyết của người sản xuất. Từ khâu chọn lựa nguyên liệu đầu vào cho đến quy trình đóng gói thành phẩm, mọi thứ đều được kiểm soát gắt gao.</p>
${fillerText}

<h3>Tại sao chúng tôi lựa chọn hợp tác?</h3>
<ul>
    <li><strong>Tâm huyết với nghề:</strong> Đội ngũ sản xuất luôn đặt cái tâm vào từng sản phẩm.</li>
    <li><strong>Công nghệ hiện đại:</strong> Ứng dụng khoa học kỹ thuật để nâng cao chất lượng nhưng vẫn giữ gìn giá trị truyền thống.</li>
    <li><strong>Trách nhiệm xã hội:</strong> Cam kết bảo vệ môi trường và hỗ trợ sinh kế cho người dân địa phương.</li>
</ul>

<p>Sự hợp tác này hứa hẹn sẽ mang đến cho cộng đồng Alo Mua Chung những giải pháp tiêu dùng thông minh và an toàn nhất.</p>
            `
        };
    }

    // --- SINGLE FIELD GENERATION MODES (Legacy/Specific) ---

    if (type === 'title') {
        return `Giải pháp toàn diện: ${prompt} cho cuộc sống hiện đại`;
    }

    if (type === 'policy') {
         return `
<h3>1. Quy định chung</h3>
<p>Chính sách này nhằm đảm bảo quyền lợi tối đa cho các thành viên tham gia nền tảng. Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân và tuân thủ các quy định pháp luật hiện hành về an toàn thông tin mạng.</p>
<h3>2. Nội dung chi tiết</h3>
<p>Dựa trên yêu cầu về "${prompt}", chúng tôi quy định rõ ràng về trách nhiệm và quyền hạn của các bên liên quan.</p>
${fillerText}
<p>Chúng tôi có quyền thay đổi nội dung chính sách để phù hợp với tình hình thực tế và sẽ thông báo trước cho người dùng.</p>
         `;
    }

    // Default rich text generation (HTML)
    return `
<p>Chào mừng bạn đến với nội dung về <strong>${prompt}</strong>. Đây là chủ đề mang tính thực tiễn cao và đang được cộng đồng rất quan tâm.</p>

<h3>Nội dung chính</h3>
<p>Vấn đề này mang lại nhiều giá trị thiết thực. Chúng tôi tập trung vào chất lượng, trải nghiệm người dùng và sự bền vững lâu dài.</p>
${fillerText}

<h3>Kết luận</h3>
<p>Hy vọng thông tin này hữu ích với bạn. Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ giải đáp mọi thắc mắc liên quan đến chủ đề này.</p>
    `;
  },

  generateProductContent: async (productName: string) => {
    return await aiService.generateText(productName, { wordCount: 300 });
  },

  generateSupplierPost: async (title: string) => {
    return await aiService.generateText(title, { wordCount: 500 });
  }
};
