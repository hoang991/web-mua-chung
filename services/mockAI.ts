// This service simulates an AI response. 
// In a real application, this would call an API like OpenAI (ChatGPT) or Google Gemini.

export const aiService = {
  generateProductContent: async (productName: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      shortDescription: `Sản phẩm ${productName} chất lượng cao, nguồn gốc tự nhiên, an toàn cho sức khỏe gia đình bạn.`,
      description: `
<h3>Giới thiệu về ${productName}</h3>
<p>${productName} là kết tinh của quy trình sản xuất tử tế, tôn trọng tự nhiên và sức khỏe người tiêu dùng. Được tuyển chọn kỹ lưỡng từ những vùng nguyên liệu sạch, sản phẩm không chỉ mang lại hương vị thơm ngon mà còn chứa đựng tâm huyết của người nông dân.</p>

<h3>Đặc điểm nổi bật</h3>
<ul>
  <li><strong>Nguồn gốc minh bạch:</strong> Truy xuất được nguồn gốc rõ ràng, quy trình canh tác không hóa chất độc hại.</li>
  <li><strong>Hương vị tự nhiên:</strong> Giữ trọn vẹn dưỡng chất và hương vị nguyên bản nhờ quy trình thu hoạch và bảo quản tối ưu.</li>
  <li><strong>Thân thiện môi trường:</strong> Bao bì và quy trình sản xuất giảm thiểu rác thải nhựa.</li>
</ul>

<h3>Hướng dẫn sử dụng & Bảo quản</h3>
<p>Sản phẩm ngon nhất khi được sử dụng trong ngày. Bảo quản nơi khô ráo, thoáng mát hoặc trong ngăn mát tủ lạnh để giữ độ tươi ngon lâu hơn.</p>

<h3>Cam kết từ Mua Chung Tử Tế</h3>
<p>Chúng tôi cam kết hoàn tiền 100% nếu sản phẩm không đúng như mô tả hoặc gặp vấn đề về chất lượng.</p>
      `
    };
  },

  generateSupplierPost: async (title: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return `
<h2>${title}</h2>
<p>Trong hành trình mang những sản phẩm tử tế đến tay người tiêu dùng, chúng tôi luôn trăn trở về việc làm sao để giữ trọn vẹn giá trị dinh dưỡng và hương vị tự nhiên nhất. Câu chuyện hôm nay là về sự nỗ lực không ngừng nghỉ của đội ngũ sản xuất.</p>

<h3>Quy trình canh tác bền vững</h3>
<p>Chúng tôi tin rằng đất mẹ cần được "thở". Thay vì sử dụng phân bón hóa học để kích thích tăng trưởng nhanh, chúng tôi chọn phương pháp ủ phân hữu cơ truyền thống. Điều này tuy mất nhiều thời gian và công sức hơn, nhưng đổi lại, cây trồng có sức đề kháng tự nhiên tốt hơn và cho ra những sản phẩm đậm đà hương vị.</p>

<img src="https://picsum.photos/800/400?random=${Math.random()}" alt="Quy trình sản xuất" />

<h3>Kết nối cùng cộng đồng</h3>
<p>Hợp tác với "Mua Chung Tử Tế" không chỉ giúp chúng tôi giải quyết bài toán đầu ra, mà còn là cơ hội để lắng nghe phản hồi trực tiếp từ người dùng. Mỗi lời khen, hay thậm chí là những góp ý chân thành, đều là động lực để chúng tôi hoàn thiện hơn mỗi ngày.</p>

<h3>Lời kết</h3>
<p>Cảm ơn các bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi. Hy vọng rằng, sự tử tế này sẽ được lan tỏa rộng rãi hơn nữa.</p>
    `;
  }
};
