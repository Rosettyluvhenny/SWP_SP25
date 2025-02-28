export interface Question {
    id: number;
    question: string;
    options: string[];
}

export const tracnghiemdoimoidata: Question[] = [
    {
        id: 1,
        question: "Kích thước của đồi mồi:",
        options: [
            "Dưới 1 cm",
            "Từ 1 cm đến 2 cm",
            "Trên 2 cm"
        ]
    },
    {
        id: 2,
        question: "Màu sắc của đồi mồi:",
        options: [
            "Màu sắc đồng nhất (nâu, nâu nhạt hoặc vàng)",
            "Màu sắc không đồng nhất (có vùng sáng, tối)",
            "Vùng màu sẫm, chảy máu hoặc có dấu hiệu nhiễm trùng"
        ]
    },
    {
        id: 3,
        question: "Hình dạng của đồi mồi:",
        options: [
            "Hình tròn hoặc oval đều",
            "Biên dạng không đều nhưng không lan rộng",
            "Biên dạng không đều, có sự thay đổi rõ rệt"
        ]
    },
    {
        id: 4,
        question: "Thay đổi của đồi mồi theo thời gian:",
        options: [
            "Không thay đổi (kích thước, màu sắc, hình dạng)",
            "Thay đổi dần dần, không đáng lo ngại",
            "Thay đổi nhanh chóng, trở nên lớn hơn hoặc có các dấu hiệu bất thường"
        ]
    },
    {
        id: 5,
        question: "Vị trí xuất hiện đồi mồi:",
        options: [
            "Các vùng da tiếp xúc với ánh nắng mặt trời (mặt, cổ, tay, vai)",
            "Vùng da ít tiếp xúc với ánh nắng mặt trời",
            "Vùng da có dấu hiệu bất thường hoặc ít tiếp xúc với ánh nắng"
        ]
    },
    {
        id: 6,
        question: "Có triệu chứng kèm theo không?",
        options: [
            "Không có triệu chứng, chỉ là các vết đồi mồi bình thường",
            "Ngứa, hơi đau nhưng không nghiêm trọng",
            "Đau, ngứa, chảy máu, viêm, hoặc thay đổi khác thường"
        ]
    }
];
