export interface Question {
  id: number;
  question: string;
  options: string[];
}

export const tracnghiemveseodata: Question[] = [
  {
    id: 1,
    question: "Loại sẹo bạn đang gặp phải là gì?",
    options: [
      "Không có sẹo",
      "Sẹo thâm nhỏ, khó nhận ra",
      "Sẹo rỗ hoặc lõm nhẹ",
      "Sẹo lồi, sẹo sâu hoặc rõ ràng",
    ],
  },
  {
    id: 2,
    question: "Số lượng vết sẹo trên da của bạn như thế nào?",
    options: [
      "Không có",
      "Dưới 5 vết sẹo nhỏ",
      "Từ 5-10 vết sẹo hoặc vài sẹo rõ",
      "Trên 10 vết sẹo hoặc nhiều sẹo lớn",
    ],
  },
  {
    id: 3,
    question: "Mức độ sẹo ảnh hưởng đến bề mặt da?",
    options: [
      "Da phẳng, không bị ảnh hưởng",
      "Sẹo nhỏ, ít gây lồi lõm trên da",
      "Sẹo làm da không đều, có cảm giác lồi hoặc lõm nhẹ",
      "Da lồi lõm rõ rệt, gây mất thẩm mỹ nghiêm trọng",
    ],
  },
  {
    id: 4,
    question: "Tình trạng sẹo thay đổi như thế nào theo thời gian?",
    options: [
      "Dần mờ đi theo thời gian",
      "Không thay đổi",
      "Vẫn giữ nguyên hoặc hơi rõ hơn",
      "Ngày càng nặng hơn hoặc khó chịu hơn",
    ],
  },
  {
    id: 5,
    question: "Các vết sẹo có gây khó chịu như ngứa, đau, hoặc căng tức không?",
    options: [
      "Không có cảm giác khó chịu",
      "Chỉ ngứa nhẹ, không thường xuyên",
      "Đôi khi ngứa hoặc đau, gây khó chịu",
      "Thường xuyên ngứa, đau hoặc rất khó chịu",
    ],
  },
];
