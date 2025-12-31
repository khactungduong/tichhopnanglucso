
import { DigitalCompetency } from './types';

// Cập nhật interface để hỗ trợ cấu trúc 3 cấp
export interface Criterion {
  id: string;
  name: string;
  indicators: {
    code: string;
    description: string;
  }[];
}

export interface DigitalCompetencyExt extends Omit<DigitalCompetency, 'indicators'> {
  criteria: Criterion[];
}

export const DIGITAL_COMPETENCY_FRAMEWORK: DigitalCompetencyExt[] = [
  {
    id: 'NL1',
    name: '1. Khai thác dữ liệu và thông tin',
    criteria: [
      {
        id: '1.1',
        name: '1.1 Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số',
        indicators: [
          { code: '1.1.a', description: 'Đáp ứng được nhu cầu thông tin' },
          { code: '1.1.b', description: 'Áp dụng được kỹ thuật tìm kiếm để lấy được dữ liệu, thông tin và nội dung trong môi trường số' },
          { code: '1.1.c', description: 'Chỉ cho người khác cách truy cập những dữ liệu, thông tin và nội dung trong môi trường số' },
          { code: '1.1.d', description: 'Tự đề xuất được chiến lược tìm kiếm' }
        ]
      },
      {
        id: '1.2',
        name: '1.2 Đánh giá dữ liệu, thông tin và nội dung số',
        indicators: [
          { code: '1.2.a', description: 'Thực hiện đánh giá được độ tin cậy và độ tin cậy của các nguồn dữ liệu, thông tin và nội dung số' },
          { code: '1.2.b', description: 'Tiến hành đánh giá được các dữ liệu, thông tin và nội dung số khác nhau' }
        ]
      },
      {
        id: '1.3',
        name: '1.3. Quản lý dữ liệu , thông tin và nội dung số',
        indicators: [
          { code: '1.3.a', description: 'Thao tác được thông tin , dữ liệu và nội dung để tổ chức, lưu trữ và truy xuất dễ dàng hơn' },
          { code: '1.3.b', description: 'Triển khai được việc tổ chức và sắp xếp dữ liệu, thông tin và nội dung trong mỗi trường có cấu trúc' }
        ]
      }
    ]
  },
  {
    id: 'NL2',
    name: '2. Giao tiếp và hợp tác',
    criteria: [
      {
        id: '2.1',
        name: '2.1 Tương tác thông qua công nghệ số',
        indicators: [
          { code: '2.1.a', description: 'sử dụng được nhiều công nghệ số để tương tác' },
          { code: '2.1.b', description: 'Chỉ cho người khác thấy phương tiện giao tiếp số nào thích hợp nhất cho 1 bối cảnh cụ thể' }
        ]
      },
      {
        id: '2.2',
        name: '2.2 Chia sẻ thông tin và nội dung thông qua công nghệ số',
        indicators: [
          { code: '2.2.a', description: 'Chia sẻ dữ liệu, thông tin và nội dung số thông qua nhiều công cụ số phù hợp' },
          { code: '2.2.b', description: 'Hướng dẫn người khác cách đóng vai trò trung gian để chia sể thông tin và nội dung thông qua công nghệ số' },
          { code: '2.2.c', description: 'Áp dụng được nhiều phương pháp tham chiếu và ghi nguồn khác nhau' }
        ]
      },
      {
        id: '2.3',
        name: '2.3 Sử dụng công nghệ để thực hiện trách nhiệm công dân',
        indicators: [
          { code: '2.3.a', description: 'đề xuất được các dịch vụ số khác nhau để tham gia vào xã hội' },
          { code: '2.3.b', description: 'Sử dụng được các công nghệ số tích hợp để tự mình trang bị và tham gia vào xã hội như một công dân.' }
        ]
      },
      {
        id: '2.4',
        name: '2.4 Hợp tác thông qua công nghệ số',
        indicators: [
          { code: '2.4.a', description: 'Đề xuất được các công cụ và công nghệ số khác nhau cho các quá trình hợp tác' }
        ]
      },
      {
        id: '2.5',
        name: '2.5 Quy tắc ứng xử trên mạng',
        indicators: [
          { code: '2.5.a', description: 'Áp dụng được các chuẩn mực hành vi và bí quyết/ cách khác nhau khi sử dụng công nghệ số và tương tác trong môi trường số.' },
          { code: '2.5.b', description: 'áp dụng được các chiến lược giao tiếp khác nhau trong môi trường số một cách phù hợp' },
          { code: '2.5.c', description: 'áp dụng được các khía cạnh đa dạng về văn hóa và thế hệ khác nhau để xem xét trong môi trường số.' }
        ]
      },
      {
        id: '2.6',
        name: '2.6 Quản lý danh tính số',
        indicators: [
          { code: '2.6.a', description: 'Sử dụng được nhiều danh tính số khác nhau' },
          { code: '2.6.b', description: 'Áp dụng được các cách khác nhau để bảo vệ danh tính trực tuyến của bản thân' },
          { code: '2.6.c', description: 'Sử dụng được dữ liệu tạo ra thông qua công cụ, môi trường và một số dịch vụ số' }
        ]
      }
    ]
  },
  {
    id: 'NL3',
    name: '3. Sáng tạo nội dung số',
    criteria: [
      {
        id: '3.1',
        name: '3.1 Phát triển nội dung số',
        indicators: [
          { code: '3.1.a', description: 'áp dụng được cách tạo và chỉnh sửa nội dung ở các định dạng khác nhau' },
          { code: '3.1.b', description: 'Chỉ ra được những cách để thể hiện bản thân thông qua việc tạo ra các phương tiện số.' }
        ]
      },
      {
        id: '3.2',
        name: '3.2 Tích hợp và tạo lập lại được nội dung số',
        indicators: [
          { code: '3.2.a', description: 'Làm việc với các mục nội dung và thông tin mới khác nhau, sửa đổi, tinh chỉnh, cải thiện và tích hợp chúng để tạo ra những mục mới và độc đáo' }
        ]
      },
      {
        id: '3.3',
        name: '3.3 Thực thi bản quyền và giấy phép',
        indicators: [
          { code: '3.3.a', description: 'Áp dụng được các quy định khác nhau về bản quyền và giấy phép cho dữ liệu , thông tin và nội dung số.' }
        ]
      },
      {
        id: '3.4',
        name: '3.4 Lập trình',
        indicators: [
          { code: '3.4.a', description: 'Tự thao tác được bằng các hướng dẫn dành cho hệ thống máy tính để giải quyết một vấn đề khác nhau hoặc thực hiện các nhiệm vụ khác nhau.' }
        ]
      }
    ]
  },
  {
    id: 'NL4',
    name: '4. An toàn',
    criteria: [
      {
        id: '4.1',
        name: '4.1 Bảo vệ thiết bị',
        indicators: [
          { code: '4.1.a', description: 'Áp dụng được các cách khác nhau để bảo vệ thiết bị và nội dung số' },
          { code: '4.1.b', description: 'Nhận thức được sự đang dạnh của các rủi ro và đe dọa trong môi trường số' },
          { code: '4.1.c', description: 'Áp dụng được các biện pháp an toàn và bảo mật' },
          { code: '4.1.d', description: 'Sử dụng được các cách khác nhau để quan tâm đến mức độ tin cậy và quyền riêng tư.' }
        ]
      },
      {
        id: '4.2',
        name: '4.2 Bảo vệ dữ liệu cá nhân và quyền riêng tư.',
        indicators: [
          { code: '4.2.a', description: 'Áp dụng được các cách thức khác nhau để bảo vệ dữ liệu cá nhân và quyền riêng tư trong môi trường số' },
          { code: '4.2.b', description: 'áp dụng được các cách thức đặc thù để chia sẻ dữ liệu cá nhân một cách an toàn' },
          { code: '4.2.c', description: 'giải thích được các tuyên bố trong chính sách quyền riêng tư và cách sử dụng dữ liệu cá nhân trong các dịch vụ số.' }
        ]
      },
      {
        id: '4.3',
        name: '4.3 Bảo vệ sức khỏe và an sinh số',
        indicators: [
          { code: '4.3.a', description: 'trinh bày được các cách thức khác nhau để tránh rủi ro và đe dọa đến sức khỏe thể chất và tinh thần khi sử dụng công nghệ số.' },
          { code: '4.3.b', description: 'áp dụng được các cách thức khác nhau để bảo vệ bản thân và người khác khỏi nguy cơ trong môi trường số.' },
          { code: '4.3.c', description: 'Trình bày được các công nghệ số khác nhau cho tăng cường thịnh vượng xã hội và sự hòa hợp trong xã hội.' }
        ]
      },
      {
        id: '4.4',
        name: '4.4 Bảo vệ môi trường',
        indicators: [
          { code: '4.4.a', description: 'Trình bày được các cách thức khác nhau để bảo vệ môi trường khỏi tác động của công nghệ số và việc sử dụng công nghệ số' }
        ]
      }
    ]
  },
  {
    id: 'NL5',
    name: '5. Giải quyết vấn đề',
    criteria: [
      {
        id: '5.1',
        name: '5.1 giải quyết vấn đề kỹ thuật',
        indicators: [
          { code: '5.1.a', description: 'Đánh giá được các vấn đề kỹ thuật khi sử dụng môi trường số và vận hành các thiết bị số' },
          { code: '5.1.b', description: 'áp dụng được các giải pháp khác nhau cho chúng' }
        ]
      },
      {
        id: '5.2',
        name: '5.2 Xác dịnh nhu cầu và giải pháp công nghệ',
        indicators: [
          { code: '5.2.a', description: 'Đánh giá được nhu cầu cá nhân' },
          { code: '5.2.b', description: 'áp dụng được các công cụ số khác nhau và giải pháp công nghệ có thể có để giải quyết những nhu cầu đó' },
          { code: '5.2.c', description: 'Sử dụng được các cách khác nhau để điều chỉnh và tùy chỉnh môi trường số theo nhu cầu cá nhân' }
        ]
      },
      {
        id: '5.3',
        name: '5.3 Sử dụng sáng tạo công nghệ số',
        indicators: [
          { code: '5.3.a', description: 'áp dụng được các công cụ và công nghệ số khác nhau để tạo ta kiến thức cũng như các quy trình và sản phẩm đổi mới' },
          { code: '5.3.b', description: 'áp dụng xử lý nhận thức cả cá nhân và tập thể để giải quyết các vấn đề khái niệm và tính huống có vấn đề khác nhau trong môi trường số.' }
        ]
      },
      {
        id: '5.4',
        name: '5.4 Xác định các vấn đề cần cải thiện về năng lực số',
        indicators: [
          { code: '5.4.a', description: 'Chứng minh được năng lực số của tôi cần được cải thiện hoặc cập nhật ở đâu' },
          { code: '5.4.b', description: 'Minh họa được những cách khác nhau để hỡ trợ người khác phát triển năng lực số của họ' },
          { code: '5.4.c', description: 'Đề xuất được các cơ hội khác nhau để phát triển bản thân và cập nhật sự phát triển số' }
        ]
      }
    ]
  },
  {
    id: 'NL6',
    name: '6. Ứng dụng trí tuệ nhân tạo',
    criteria: [
      {
        id: '6.1',
        name: '6.1 Hiểu biết về trí tuệ nhân tạo',
        indicators: [
          { code: '6.1.a', description: 'Đánh giá được hiệu quả của các hệ thống AI trong việc giải quyết các vấn đề cụ thể' },
          { code: '6.1.b', description: 'Kiểm tra được các giới hạn và tiềm năng của AI trong các lĩnh vực khác nhau' }
        ]
      },
      {
        id: '6.2',
        name: '6.2 Sử dụng trí tuệ nhân tạo',
        indicators: [
          { code: '6.2.a', description: 'Phát triển được các ứng dụng AI tùy chỉnh để giải quyết các vấn đề cụ thể' },
          { code: '6.2.b', description: 'Điều chỉnh được các hệ thống AI để phù hợp với nhu cầu cụ thể' },
          { code: '6.2.c', description: 'Đánh giá và giảm thiểu được các rủi ro đạo đức và pháp lý liên quan đến việc sử dụng AI.' }
        ]
      },
      {
        id: '6.3',
        name: '6.3 Đánh giá trí tuệ nhân tạo.',
        indicators: [
          { code: '6.3.a', description: 'Phê phán được các khía cạnh kỹ thuật và đạo đức của hệ thống AI' },
          { code: '6.3.b', description: 'Kiểm tra và xác minh được tính chính xác của các quyết định do hệ thống AI đưa ra' }
        ]
      }
    ]
  }
];
