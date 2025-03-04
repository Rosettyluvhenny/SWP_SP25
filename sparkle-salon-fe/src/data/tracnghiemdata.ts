export interface Question {
  id: number;
  question: string;
  options: { text: string; points: number }[];
}

export const tracnghiemdata: Question[] = [
  {
    id: 1,
    question: "Da của bạn thường trông ra sao vào buổi chiều?",
    options: [
      { text: "Trán, mũi và cằm bị bóng dầu nhưng phần còn lại trên mặt lại bình thường hoặc khô", points: 1 },
      { text: "Da của tôi không bị bóng, khá khô và có cảm giác căng ở một số khu vực.", points: 5 },
      { text: "Toàn bộ khuôn mặt tôi bị bóng, có cảm giác nhờn dầu và dễ bị mụn đầu đen và mụn trứng cá", points: 2 },
      { text: "Da của tôi mềm mại và thấy dễ chịu khi chạm vào", points: 3 },
      { text: "Da của tôi bị khô và tôi có thể nhận thấy một số nếp nhăn", points: 4 },
    ],
  },
  {
    id: 2,
    question: "Vùng trán của bạn trông như thế nào?",
    options: [
      { text: "Da khá phẳng mịn, với một vài nếp nhăn nhẹ.", points: 4 },
      { text: "Tôi nhận thấy một vài vết bong tróc dọc theo đường chân tóc, lông mày và giữa hai bên lông mày.", points: 2 },
      { text: "Da bóng nhờn và không được mịn. Có những nốt mụn nhỏ và một số mụn đầu đen.", points: 1 },
      { text: "Da mịn và láng mượt. Không có dấu hiệu bong tróc.", points: 3 },
      { text: "Điều đầu tiên tôi nhận thấy là các nếp nhăn", points: 5 },
    ],
  },
  {
    id: 3,
    question: "Hãy mô tả phần má và vùng dưới mắt của bạn.",
    options: [
      { text: "Hầu như không có vết nhăn dễ thấy nào. Chỉ có một số vùng da khô có thể nhìn ra.", points: 2 },
      { text: "Da bị kích ứng và khô. Có cảm giác da bị căng.", points: 5 },
      { text: "Lỗ chân lông nở rộng và có khuyết điểm dưới dạng mụn đầu đen hay đốm mụn trắng.", points: 1 },
      { text: "Da nhẵn mịn với lỗ chân lông se khít", points: 3 },
      { text: "Có các nếp nhăn rõ rệt. Da khá khô.", points: 4 },
    ],
  },
  {
    id: 4,
    question: "Da của bạn có dễ gặp phải các vấn đề về thâm, hay đỏ rát không?",
    options: [
      { text: "Có, nhưng chỉ ở vùng chữ T (trán, mũi và cằm)", points: 2 },
      { text: "Da tôi hơi đỏ, có chút tấy, và có chỗ không đồng đều về độ ẩm.", points: 5 },
      { text: "Có. Tôi thường gặp phải các vấn đề trên.", points: 1 },
      { text: "Đôi khi.", points: 4 },
      { text: "Hầu như không bao giờ.", points: 3 },
    ],
  },
  {
    id: 5,
    question: "Hiện giờ điều gì là quan trọng nhất với bạn khi lựa chọn một sản phẩm chăm sóc da?",
    options: [
      { text: "Sản phẩm giúp tôi đối phó với sự bóng dầu nhưng vẫn có tác dụng dưỡng ẩm.", points: 2 },
      { text: "Sản phẩm giúp làm dịu và nuôi dưỡng làn da của tôi sâu từ bên trong.", points: 5 },
      { text: "Sản phẩm có khả năng thẩm thấu nhanh và cải thiện làn da của tôi một cách nhanh chóng.", points: 1 },
      { text: "Sản phẩm giữ cho da tôi mịn màng và mềm mại như hiện tại.", points: 3 },
      { text: "Sản phẩm giúp nuôi dưỡng sâu làn da của tôi và giúp ngăn ngừa các dấu hiệu lão hóa sớm.", points: 4 },
    ],
  },
  {
    id: 6,
    question: "Da của bạn có dễ hình thành các vết hằn và nếp nhăn?",
    options: [
      { text: "Tôi bị một vài vết hằn do da khô.", points: 4 },
      { text: "Có. Tôi bị các nếp nhăn quanh vùng mắt và/hoặc ở khóe miệng.", points: 2 },
      { text: "Không, tôi hầu như không có nếp nhăn.", points: 1 },
      { text: "Không hẳn, da của tôi lão hóa tương đối chậm", points: 3 },
    ],
  },
  {
    id: 7,
    question: "Da mặt bạn đã thay đổi ra sao trong 5 năm trở lại đây?",
    options: [
      { text: "Da tôi bị bóng dầu nhiều hơn ở vùng chữ T (trán, mũi và cằm).", points: 2 },
      { text: "Da tôi dễ bong tróc hơn và thường cảm thấy căng.", points: 5 },
      { text: "Da có nhiều khuyết điểm hơn so với trước đây.", points: 1 },
      { text: "Da tôi vẫn ở tình trạng tốt và dễ dàng chăm sóc.", points: 3 },
      { text: "Da tôi có vẻ mỏng đi và kém đàn hồi hơn, và thêm các nếp nhăn và vết hằn.", points: 4 },
    ],
  },
  {
    id: 8,
    question: "Giới tính của bạn là",
    options: [
      { text: "Nam", points: 3 },
      { text: "Nữ", points: 3 },
    ],
  },
  {
    id: 9,
    question: "Độ tuổi của bạn là",
    options: [
      { text: "Dưới 25", points: 1 },
      { text: "Từ 25 tới 40", points: 3 },
      { text: "Từ 40 tới 50", points: 4 },
      { text: "Trên 50", points: 5 },
    ],
  },
];