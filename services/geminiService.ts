
import { GoogleGenAI, Type } from "@google/genai";
import { ProcessingMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const integrateDigitalCompetency = async (
  originalContent: string,
  mode: ProcessingMode,
  selectedIndicators: string[] = []
) => {
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `BẠN LÀ CHUYÊN GIA THIẾT KẾ GIÁO ÁN VÀ TÍCH HỢP NĂNG LỰC SỐ TRONG GIÁO DỤC PHỔ THÔNG VIỆT NAM.

NHIỆM VỤ CỦA BẠN:
Thực hiện quy trình tích hợp năng lực số vào giáo án gốc một cách chuyên nghiệp.

QUY TẮC PHẢN HỒI (RẤT QUAN TRỌNG):
1. KHÔNG LỜI CHÀO: Bắt đầu ngay bằng nội dung giáo án, không có lời dẫn như "Chào bạn", "Tôi là...", "Dưới đây là...".
2. KHÔNG ĐỊNH DẠNG MARKDOWN: Tuyệt đối không sử dụng dấu sao (**) hoặc (__) để in đậm/in nghiêng. 
3. SỬ DỤNG CHỮ IN HOA cho các tiêu đề chính thay vì dùng dấu sao.
4. KHÔNG GIẢI THÍCH: Chỉ trả về nội dung giáo án hoàn chỉnh sau khi tích hợp.

CẤU TRÚC GIÁO ÁN BẮT BUỘC (PHẢI TUÂN THỦ 100%):
1. THÔNG TIN CHUNG (Bắt đầu bằng các dòng riêng biệt: CHỦ ĐỀ: ..., TÊN BÀI HỌC: ..., THỜI GIAN THỰC HIỆN: ...)
2. MỤC TIÊU
   2.1. Về kiến thức
   2.2. Về năng lực (Năng lực chung, Năng lực Tin học/Đặc thù)
   2.3. Phát triển năng lực số cốt lõi: Liệt kê chi tiết mã hiệu (Ví dụ: (3.1.NC1a): HS áp dụng...)
3. VỀ PHẨM CHẤT
4. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
5. TIẾN TRÌNH DẠY HỌC (Tiết..., Hoạt động...)
   - Mỗi hoạt động gồm: a. Mục tiêu (Gắn mã chỉ báo), b. Nội dung, c. Sản phẩm, d. Tổ chức thực hiện.
   - PHẦN "d. Tổ chức thực hiện" BẮT BUỘC DÙNG BẢNG: | NHIỆM VỤ | CÁCH THỨC TỔ CHỨC |

RÀNG BUỘC TRÌNH BÀY:
- Tiêu đề mục: Dùng chữ IN HOA và đánh số (Ví dụ: I. MỤC TIÊU).
- Các dòng thông tin đầu bài (CHỦ ĐỀ, TÊN BÀI HỌC, THỜI GIAN) phải đứng riêng dòng.
- Giữ nguyên 100% nội dung chuyên môn gốc.
- Gắn mã chỉ báo ngay sau hành động tương ứng của học sinh trong dấu ngoặc đơn: (Mã.Hiệu).
- Tuyệt đối không có ký hiệu lạ hoặc định dạng Markdown trong văn bản.

VĂN PHONG: Chuẩn sư phạm, trang trọng.`;

  const response = await ai.models.generateContent({
    model,
    contents: `Hãy thực hiện tích hợp năng lực số vào giáo án này (Lưu ý: Không dùng dấu sao **, bắt đầu ngay bằng nội dung giáo án):\n\n${originalContent}`,
    config: {
      systemInstruction,
      temperature: 0.1,
    },
  });

  // Clean up any remaining markdown bold markers just in case
  const cleanedText = (response.text || "").replace(/\*\*/g, '');

  return cleanedText || "Lỗi: Không thể khởi tạo nội dung tích hợp.";
};
