export interface Question {
    id: number;
    question: string;
    options: { text: string; points: number }[];
  }
  
  export const tracnghiemmun: Question[] = [
    {
      id: 1,
      question: "Vết thâm xuất hiện sau khi:",
      options: [
        { text: "Mụn viêm (mụn bọc, mụn mủ) lành lại.", points: 2 },
        { text: "Nặn mụn không đúng cách.", points: 2 },
        { text: "Mụn nhỏ hoặc không viêm (mụn đầu đen, mụn đầu trắng).", points: 1 },
        { text: "Không rõ nguyên nhân.", points: 0 },
      ],
    },
    {
      id: 2,
      question: "Bạn có sử dụng kem chống nắng hàng ngày không?",
      options: [
        { text: "Luôn luôn.", points: 0 },
        { text: "Thỉnh thoảng.", points: 1 },
        { text: "Hiếm khi hoặc không bao giờ.", points: 2 },
      ],
    },
    {
      id: 3,
      question: "Da bạn có dễ bị kích ứng hoặc đỏ sau khi nặn mụn không?",
      options: [
        { text: "Có, rất dễ bị đỏ.", points: 2 },
        { text: "Đôi khi.", points: 1 },
        { text: "Không.", points: 0 },
      ],
    },
    {
      id: 4,
      question: "Màu sắc vết thâm trên da của bạn là gì?",
      options: [
        { text: "Đỏ hoặc hồng nhạt.", points: 1 },
        { text: "Nâu hoặc đen sẫm.", points: 2 },
        { text: "Tím hoặc xanh xám.", points: 3 },
      ],
    },
    {
      id: 5,
      question: "Vết thâm của bạn đã tồn tại trong bao lâu?",
      options: [
        { text: "Dưới 1 tháng.", points: 1 },
        { text: "Từ 1-6 tháng.", points: 2 },
        { text: "Trên 6 tháng.", points: 3 },
      ],
    },
    {
      id: 6,
      question: "Vị trí vết thâm:",
      options: [
        { text: "Chỉ ở mặt.", points: 1 },
        { text: "Xuất hiện cả ở lưng, ngực hoặc tay/chân.", points: 2 },
        { text: "Khắp cơ thể.", points: 3 },
      ],
    },
    {
      id: 7,
      question: "Da bạn có kèm theo dấu hiệu nào sau đây không?",
      options: [
        { text: "Vết thâm mờ, không kèm sẹo.", points: 1 },
        { text: "Vết thâm đậm, kèm theo sẹo lõm hoặc lồi.", points: 3 },
        { text: "Không chỉ có thâm, mà còn cảm giác da không đều màu rõ rệt.", points: 2 },
      ],
    },
    {
      id: 8,
      question: "Bạn có thường xuyên sử dụng sản phẩm trị mụn hoặc làm sáng da không?",
      options: [
        { text: "Có, và vết thâm có cải thiện.", points: 0 },
        { text: "Có, nhưng không thấy hiệu quả nhiều.", points: 2 },
        { text: "Không sử dụng.", points: 1 },
      ],
    },
  ];