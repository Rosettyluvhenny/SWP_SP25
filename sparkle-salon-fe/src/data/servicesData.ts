export interface Service {
    id: number;
    name: string;
    img: string;
    price: number;
    duration: string;
    popularity: number;
    description: string;
}

const servicesData: Service[] = [
    {
        id: 1,
        name: "Điều Trị Mụn Chuyên Sâu 12 bước",
        img: "/assets/skin-treatment1.jpg",
        price: 150000,
        duration: "90 phút",
        popularity: 765826,
        description: "",
    },
    {
        id: 2,
        name: "Thải Độc Da Thảo Dược",
        img: "/assets/skin-treatment2.jpg",
        price: 200000,
        duration: "30 phút",
        popularity: 13373,
        description: ""
    },
    {
        id: 3,
        name: "Điều Trị Nám Da",
        img: "/assets/skin-treatment3.jpg",
        price: 550000,
        duration: "45 phút",
        popularity: 97050,
        description: ""
    },
    {
        id: 4,
        name: "Điều Trị Tàn Nhang",
        img: "/assets/skin-treatment7.jpg",
        price: 300000,
        duration: "45 phút",
        popularity: 50000,
        description: ""
    },
    {
        id: 5,
        name: "Điều Trị Sẹo Rỗ",
        img: "/assets/skin-treatment4.jpg",
        price: 250000,
        duration: "60 phút",
        popularity: 89000,
        description: ""
    },
    {
        id: 6,
        name: "Điều Trị Da Nhờn",
        img: "/assets/skin-treatment5.jpg",
        price: 600000,
        duration: "90 phút",
        popularity: 65000,
        description: ""
    },
    {
        id: 7,
        name: "Điều Trị Lão Hóa Da",
        img: "/assets/skin-treatment6.jpg",
        price: 100000,
        duration: "40 phút",
        popularity: 43000,
        description: ""
    },
    {
        id: 8,
        name: "Điều Trị Da Không Đều Màu",
        img: "/assets/skin-treatment8.jpg",
        price: 350000,
        duration: "1 Giờ",
        popularity: 52000,
        description: ""
    },
    {
        id: 9,
        name: "Điều Trị Lỗ Chân Lông To",
        img: "/assets/skin-treatment9.jpg",
        price: 450000,
        duration: "50 phút",
        popularity: 61000,
        description: ""
    },
    {
        id: 10,
        name: "Trẻ Hóa Da Công Nghệ Cao",
        img: "/assets/skin-treatment10.jpg",
        price: 700000,
        duration: "75 phút",
        popularity: 72000,
        description: ""
    },
    {
        id: 11,
        name: "Cấy Tinh Chất Trắng Da",
        img: "/assets/skin-treatment11.jpg",
        price: 800000,
        duration: "90 phút",
        popularity: 91000,
        description: ""
    },
    {
        id: 12,
        name: "Điều Trị Mụn Đầu Đen",
        img: "/assets/skin-treatment12.jpg",
        price: 180000,
        duration: "30 phút",
        popularity: 56000,
        description: ""
    },
    {
        id: 13,
        name: "Điều Trị Mụn Viêm",
        img: "/assets/skin-treatment13.jpg",
        price: 550000,
        duration: "1 Giờ",
        popularity: 74000,
        description: ""
    },
    {
        id: 14,
        name: "Điều Trị Da Nhạy Cảm",
        img: "/assets/skin-treatment14.jpg",
        price: 400000,
        duration: "45 phút",
        popularity: 49000,
        description: ""
    },
    {
        id: 15,
        name: "Thải Độc Da Bằng Than Hoạt Tính",
        img: "/assets/skin-treatment15.jpg",
        price: 320000,
        duration: "50 phút",
        popularity: 67000,
        description: ""
    },
    {
        id: 16,
        name: "Điều Trị Da Khô",
        img: "/assets/skin-treatment16.jpg",
        price: 280000,
        duration: "40 phút",
        popularity: 57000,
        description: ""
    },
    {
        id: 17,
        name: "Căng Bóng Da Hàn Quốc",
        img: "/assets/skin-treatment17.jpg",
        price: 650000,
        duration: "80 phút",
        popularity: 88000,
        description: ""
    },
    {
        id: 18,
        name: "Liệu Trình Collagen Trẻ Hóa",
        img: "/assets/skin-treatment18.jpg",
        price: 750000,
        duration: "85 phút",
        popularity: 94000,
        description: ""
    },
    {
        id: 19,
        name: "Tái Tạo Da Bằng Tế Bào Gốc",
        img: "/assets/skin-treatment19.jpg",
        price: 900000,
        duration: "95 phút",
        popularity: 102000,
        description: "",
    },
    {
        id: 20,
        name: "Liệu Trình Chăm Sóc Da Dầu",
        img: "/assets/skin-treatment20.jpg",
        price: 500000,
        duration: "60 phút",
        popularity: 81000,
        description: ""
    },
    {
        id: 21,
        name: "Điều Trị Da Bị Dị Ứng",
        img: "/assets/skin-treatment21.jpg",
        price: 350000,
        duration: "55 phút",
        popularity: 53000,
        description: ""
    },
    {
        id: 22,
        name: "Điều Trị Da Tổn Thương Sau Lăn Kim",
        img: "/assets/skin-treatment22.jpg",
        price: 650000,
        duration: "80 phút",
        popularity: 79000,
        description: ""
    },
    {
        id: 23,
        name: "Điều Trị Thâm Mụn",
        img: "/assets/skin-treatment23.jpg",
        price: 400000,
        duration: "45 phút",
        popularity: 69000,
        description: ""
    },
    {
        id: 24,
        name: "Điều Trị Nám Tàn Nhang Bằng Laser",
        img: "/assets/skin-treatment24.jpg",
        price: 1200000,
        duration: "120 phút",
        popularity: 112000,
        description: "",
    },
    {
        id: 25,
        name: "Điều Trị Mụn Bằng Công Nghệ IPL",
        img: "/assets/skin-treatment25.jpg",
        price: 950000,
        duration: "110 phút",
        popularity: 97000,
        description: ""
    },
    {
        id: 26,
        name: "Chăm Sóc Da Mặt Cơ Bản",
        img: "/assets/skin-treatment26.jpg",
        price: 180000,
        duration: "30 phút",
        popularity: 65000,
        description: ""
    },
    {
        id: 27,
        name: "Chăm Sóc Da Chuyên Sâu",
        img: "/assets/skin-treatment27.jpg",
        price: 350000,
        duration: "70 phút",
        popularity: 72000,
        description: ""
    },
];

export default servicesData; 