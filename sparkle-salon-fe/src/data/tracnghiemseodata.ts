export interface Question {
  id: number;
  question: string;
  options: { text: string; points: number }[];
}

export const tracnghiemseodata: Question[] = [
  {
    id: 1,
    question: "Loại sẹo bạn đang gặp phải là gì?",
    options: [
      { text: "Không có sẹo", points: 0 },
      { text: "Sẹo thâm nhỏ, khó nhận ra", points: 1 },
      { text: "Sẹo rỗ hoặc lõm nhẹ", points: 2 },
      { text: "Sẹo lồi, sẹo sâu hoặc rõ ràng", points: 3 },
    ],
  },
  {
    id: 2,
    question: "Số lượng vết sẹo trên da của bạn như thế nào?",
    options: [
      { text: "Không có", points: 0 },
      { text: "Dưới 5 vết sẹo nhỏ", points: 1 },
      { text: "Từ 5-10 vết sẹo hoặc vài sẹo rõ", points: 2 },
      { text: "Trên 10 vết sẹo hoặc nhiều sẹo lớn", points: 3 },
    ],
  },
  {
    id: 3,
    question: "Mức độ sẹo ảnh hưởng đến bề mặt da?",
    options: [
      { text: "Da phẳng, không bị ảnh hưởng", points: 0 },
      { text: "Sẹo nhỏ, ít gây lồi lõm trên da", points: 1 },
      { text: "Sẹo làm da không đều, có cảm giác lồi hoặc lõm nhẹ", points: 2 },
      { text: "Da lồi lõm rõ rệt, gây mất thẩm mỹ nghiêm trọng", points: 3 },
    ],
  },
  {
    id: 4,
    question: "Tình trạng sẹo thay đổi như thế nào theo thời gian?",
    options: [
      { text: "Dần mờ đi theo thời gian", points: 0 },
      { text: "Không thay đổi", points: 1 },
      { text: "Vẫn giữ nguyên hoặc hơi rõ hơn", points: 2 },
      { text: "Ngày càng nặng hơn hoặc khó chịu hơn", points: 3 },
    ],
  },
  {
    id: 5,
    question: "Các vết sẹo có gây khó chịu như ngứa, đau, hoặc căng tức không?",
    options: [
      { text: "Không có cảm giác khó chịu", points: 0 },
      { text: "Chỉ ngứa nhẹ, không thường xuyên", points: 1 },
      { text: "Đôi khi ngứa hoặc đau, gây khó chịu", points: 2 },
      { text: "Thường xuyên ngứa, đau hoặc rất khó chịu", points: 3 },
    ],
  },
];
