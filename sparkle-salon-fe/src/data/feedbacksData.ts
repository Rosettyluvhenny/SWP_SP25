export interface Feedback {
    name: string;
    rating: number;
    comment: string;
    date: string;
}

export const feedbacksData: Feedback[] = [
    {
        name: "Nguyễn Thị Hương",
        rating: 5,
        comment: "Dịch vụ tuyệt vời! Nhân viên rất chuyên nghiệp và thân thiện. Tôi rất hài lòng với kết quả và sẽ quay lại.",
        date: "15/05/2023"
    },
    {
        name: "Trần Văn Minh",
        rating: 4,
        comment: "Chất lượng dịch vụ tốt, giá cả hợp lý. Tôi đã thấy sự cải thiện rõ rệt sau khi sử dụng dịch vụ.",
        date: "03/04/2023"
    },
    {
        name: "Lê Thị Hà",
        rating: 5,
        comment: "Không gian salon rất thoải mái và sạch sẽ. Nhân viên tư vấn rất tận tình. Tôi đã được hướng dẫn cách chăm sóc da sau điều trị rất chi tiết.",
        date: "22/03/2023"
    },
    {
        name: "Phạm Thanh Tùng",
        rating: 3,
        comment: "Dịch vụ ổn, nhưng tôi phải đợi hơi lâu. Kết quả khá tốt nhưng có thể cải thiện thêm về thời gian chờ đợi.",
        date: "10/02/2023"
    },
    {
        name: "Hoàng Minh Anh",
        rating: 5,
        comment: "Tôi đã thử nhiều nơi nhưng đây là salon tốt nhất mà tôi từng đến. Kết quả vượt quá mong đợi của tôi. Chắc chắn sẽ giới thiệu cho bạn bè!",
        date: "05/01/2023"
    }
];

