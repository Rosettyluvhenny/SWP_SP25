export interface Question {
  id: number;
  question: string;
  options: string[];
}

export const tracnghiemdata: Question[] = [
  {
    id: 1,
    question: "Da của bạn thường trông ra sao vào buổi chiều?",
    options: [
      "Trán, mũi và cằm bị bóng dầu nhưng phần còn lại trên mặt lại bình thường hoặc khô",
      "Da của tôi không bị bóng, khá khô và có cảm giác căng ở một số khu vực",
      "Toàn bộ khuôn mặt tôi bị bóng, có cảm giác nhờn dầu và dễ bị mụn đầu đen và mụn trứng cá",
      "Da của tôi mềm mại và thấy dễ chịu khi chạm vào",
      "Da của tôi bị khô và tôi có thể nhận thấy một số nếp nhăn",
    ],
  },
  {
    id: 2,
    question: "Vùng trán của bạn trông như thế nào?",
    options: [
      "Da khá phẳng mịn, với một vài nếp nhăn nhẹ",
      "Tôi nhận thấy một vài vết bong tróc dọc theo đường chân tóc, lông mày và giữa hai bên lông mày",
      "Da bóng nhờn và không được mịn. Có những nốt mụn nhỏ và một số mụn đầu đen",
      "Da mịn và láng mượt. Không có dấu hiệu bong tróc",
      "Điều đầu tiên tôi nhận thấy là các nếp nhăn",
    ],
  },
  {
    id: 3,
    question: "Hãy mô tả phần má và vùng dưới mắt của bạn.",
    options: [
      "Hầu như không có vết nhăn dễ thấy nào. Chỉ có một số vùng da khô có thể nhìn ra",
      "Da bị kích ứng và khô. Có cảm giác da bị căng",
      "Lỗ chân lông nở rộng và có khuyết điểm dưới dạng mụn đầu đen hay đốm mụn trắng",
      "Da nhẵn mịn với lỗ chân lông se khít",
      "Có các nếp nhăn rõ rệt. Da khá khô",
    ],
  },
  {
    id: 4,
    question: "Da của bạn có dễ gặp phải các vấn đề về thâm, hay đỏ rát không?",
    options: [
      "Có, nhưng chỉ ở vùng chữ T (trán, mũi và cằm)",
      "Da tôi hơi đỏ, có chút tấy, và có chỗ không đồng đều về độ ẩm",
      "Có. Tôi thường gặp phải các vấn đề trên",
      "Đôi khi",
      "Hầu như không bao giờ",
    ],
  },
  {
    id: 5,
    question: "Hiện giờ điều gì là quan trọng nhất với bạn khi lựa chọn một sản phẩm chăm sóc da?",
    options: [
      "Sản phẩm giúp tôi đối phó với sự bóng dầu nhưng vẫn có tác dụng dưỡng ẩm",
      "Sản phẩm giúp làm dịu và nuôi dưỡng làn da của tôi sâu từ bên trong",
      "Sản phẩm có khả năng thẩm thấu nhanh và cải thiện làn da của tôi một cách nhanh chóng",
      "Sản phẩm giữ cho da tôi mịn màng và mềm mại như hiện tại",
      "Sản phẩm giúp nuôi dưỡng sâu làn da của tôi và giúp ngăn ngừa các dấu hiệu lão hóa sớm",
    ],
  },
  {
    id: 6,
    question: "Da của bạn có dễ hình thành các vết hằn và nếp nhăn?",
    options: [
      "Tôi bị một vài vết hằn do da khô",
      "Có. Tôi bị các nếp nhăn quanh vùng mắt và/hoặc ở khóe miệng",
      "Không, tôi hầu như không có nếp nhăn",
      "Không hẳn, da của tôi lão hóa tương đối chậm",
    ],
  },
  {
    id: 7,
    question: "Da mặt bạn đã thay đổi ra sao trong 5 năm trở lại đây?",
    options: [
      "Da tôi bị bóng dầu nhiều hơn ở vùng chữ T (trán, mũi và cằm)",
      "Da tôi dễ bong tróc hơn và thường cảm thấy căng",
      "Da có nhiều khuyết điểm hơn so với trước đây",
      "Da tôi vẫn ở tình trạng tốt và dễ dàng chăm sóc",
      "Da tôi có vẻ mỏng đi và kém đàn hồi hơn, và thêm các nếp nhăn và vết hằn",
    ],
  },
  {
    id: 8,
    question: "Giới tính của bạn là",
    options: ["Nam", "Nữ"],
  },
  {
    id: 9,
    question: "Độ tuổi của bạn là",
    options: ["Dưới 25", "Từ 25 tới 40", "Từ 40 tới 50", "Trên 50"],
  },
];

