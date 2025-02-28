import axios from "axios";
export interface Service {
    id: number;
    name: string;
    img: string;
    price: number;
    duration: string;
    popularity: number;
    description: string;
}

// const servicesData: Service[] = [
//     {
//         id: "1",
//         name: "Điều Trị Mụn Chuyên Sâu 12 bước",
//         img: "https://i.ibb.co/BHwF63Mg/skin-treatment1.jpg",
//         price: 150000,
//         duration: "90 phút",
//         popularity: 765826,
//         description: "Dịch vụ Điều Trị Mụn Chuyên Sâu 12 Bước tại Sparkle Salon được thiết kế dành riêng cho làn da gặp vấn đề về mụn như mụn viêm, mụn đầu đen, mụn ẩn và da dễ kích ứng.Quy trình 12 bước khoa học giúp làm sạch da tận sâu, loại bỏ tác nhân gây mụn, giảm viêm và hỗ trợ tái tạo làn da khỏe mạnh hơn.**Quy Trình 12 Bước Chăm Sóc Da:**- Làm Sạch Da- Rửa Mặt Chuyên Sâu- Tẩy Tế Bào Chết- Xông Hơi Nóng & Hút Bã Nhờn- Nặn Mụn- Sát Khuẩn Da- Cân Bằng Da Với Toner- Đắp Mặt Nạ- Điện Di Tinh Chất Đặc Trị- Massage Thư Giãn- Dưỡng Ẩm & Phục Hồi Da- Chống Nắng",
//     },
//     {
//         id: "2",
//         name: "Thải Độc Da Thảo Dược",
//         img: "https://i.ibb.co/fGYS3VzC/skin-treatment2.jpg",
//         price: 200000,
//         duration: "30 phút",
//         popularity: 13373,
//         description: "Dịch vụ Thải Độc Da Thảo Dược giúp loại bỏ độc tố, giảm sưng viêm và cân bằng độ ẩm, mang lại làn da tươi sáng và khỏe mạnh. \n\n**Quy trình thải độc da:**\n- Làm sạch da\n- Tẩy tế bào chết\n- Xông hơi thảo dược\n- Massage thải độc\n- Đắp mặt nạ dưỡng chất\n- Cân bằng và bảo vệ da"
//     },
//     {
//         id: "3",
//         name: "Điều Trị Nám Da",
//         img: "https://i.ibb.co/p8hzvCs/skin-treatment3.jpg",
//         price: 550000,
//         duration: "45 phút",
//         popularity: 97050,
//         description: "Dịch vụ Điều Trị Nám Da sử dụng công nghệ tiên tiến để làm mờ các đốm nám, ngăn ngừa sắc tố melanin và tái tạo làn da đều màu. \n\n**Quy trình điều trị nám:**\n- Làm sạch da\n- Peel da nhẹ loại bỏ tế bào sừng\n- Thoa tinh chất đặc trị nám\n- Điện di tinh chất\n- Đắp mặt nạ phục hồi\n- Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "4",
//         name: "Điều Trị Tàn Nhang",
//         img: "https://i.ibb.co/cmnDYzX/skin-treatment7.jpg",
//         price: 300000,
//         duration: "45 phút",
//         popularity: 50000,
//         description: "Dịch vụ Điều Trị Tàn Nhang giúp giảm sắc tố, làm sáng vùng da sạm màu và ngăn ngừa tàn nhang lan rộng.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Thoa tinh chất ức chế melanin\n- Điện di tinh chất\n- Đắp mặt nạ làm sáng da\n- Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "5",
//         name: "Điều Trị Sẹo Rỗ",
//         img: "https://i.ibb.co/n83Tryf1/skin-treatment4.jpg",
//         price: 250000,
//         duration: "60 phút",
//         popularity: 89000,
//         description: "Dịch vụ Điều Trị Sẹo Rỗ giúp kích thích tái tạo collagen, làm đầy sẹo và cải thiện kết cấu da.\n\n**Quy trình điều trị sẹo rỗ:**\n- Làm sạch da\n- Lăn kim hoặc vi kim\n- Thoa tinh chất tái tạo\n- Điện di phục hồi\n- Đắp mặt nạ dưỡng chất\n- Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "6",
//         name: "Điều Trị Da Nhờn",
//         img: "https://i.ibb.co/V0WCLYCK/skin-treatment5.jpg",
//         price: 600000,
//         duration: "90 phút",
//         popularity: 65000,
//         description: "Dịch vụ Điều Trị Da Nhờn giúp kiểm soát bã nhờn, giảm bóng dầu và ngăn ngừa mụn hiệu quả.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Tẩy tế bào chết kiểm soát dầu\n- Xông hơi hút bã nhờn\n- Đắp mặt nạ kiềm dầu\n- Điện di tinh chất kiểm soát dầu\n- Dưỡng ẩm cân bằng da"
//     },
//     {
//         id: "7",
//         name: "Điều Trị Lão Hóa Da",
//         img: "https://i.ibb.co/DHxYGwP1/skin-treatment6.jpg",
//         price: 100000,
//         duration: "40 phút",
//         popularity: 43000,
//         description: "Dịch vụ Điều Trị Lão Hóa giúp làm mờ nếp nhăn, nâng cơ và tái tạo làn da căng mịn, săn chắc.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Thoa tinh chất chống lão hóa\n- Điện di collagen\n- Đắp mặt nạ nâng cơ\n- Massage da mặt\n- Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "8",
//         name: "Điều Trị Da Không Đều Màu",
//         img: "https://i.ibb.co/WWVd35zw/skin-treatment8.webp",
//         price: 350000,
//         duration: "1 Giờ",
//         popularity: 52000,
//         description: "Dịch vụ Điều Trị Da Không Đều Màu giúp làm sáng da, giảm thâm sạm và mang lại làn da đều màu tự nhiên.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Tẩy tế bào chết làm sáng da\n- Điện di vitamin C\n- Đắp mặt nạ dưỡng trắng\n- Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "9",
//         name: "Điều Trị Lỗ Chân Lông To",
//         img: "https://i.ibb.co/tpBQL1Jh/skin-treatment9.jpg",
//         price: 450000,
//         duration: "50 phút",
//         popularity: 61000,
//         description: "Dịch vụ Điều Trị Lỗ Chân Lông To giúp se khít lỗ chân lông, làm mịn da và kiểm soát dầu nhờn.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Tẩy tế bào chết\n- Xông hơi hút bã nhờn\n- Điện di tinh chất se khít lỗ chân lông\n- Đắp mặt nạ se khít\n- Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "10",
//         name: "https://i.ibb.co/Dgw0NW6m/skin-treatment10.webp",
//         img: "/assets/skin-treatment10.jpg",
//         price: 700000,
//         duration: "75 phút",
//         popularity: 72000,
//         description: "Dịch vụ Trẻ Hóa Da Công Nghệ Cao giúp làm căng da, nâng cơ và xóa nhăn hiệu quả bằng công nghệ hiện đại.\n\n**Quy trình trẻ hóa da:**\n- Làm sạch da\n- Tẩy tế bào chết\n- Điện di collagen hoặc laser trẻ hóa\n- Đắp mặt nạ nâng cơ\n- Massage thư giãn\n- Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "11",
//         name: "Cấy Tinh Chất Trắng Da",
//         img: "https://i.ibb.co/hJ0f4yt2/skin-treatment11.webp",
//         price: 800000,
//         duration: "90 phút",
//         popularity: 91000,
//         description: "Liệu trình Cấy Tinh Chất Trắng Da giúp cung cấp dưỡng chất chuyên sâu, làm sáng da, đều màu và giảm thâm nám. **Quy trình bao gồm:** - Làm sạch và tẩy tế bào chết - Cấy tinh chất dưỡng trắng bằng công nghệ mesotherapy - Massage giúp thẩm thấu dưỡng chất - Đắp mặt nạ cấp ẩm - Chống nắng và bảo vệ da"
//     },
//     {
//         id: "12",
//         name: "Điều Trị Mụn Đầu Đen",
//         img: "https://i.ibb.co/cX1Jtv85/skin-treatment12.jpg",
//         price: 180000,
//         duration: "30 phút",
//         popularity: 56000,
//         description: "Dịch vụ Điều Trị Mụn Đầu Đen giúp làm sạch sâu, loại bỏ mụn đầu đen và se khít lỗ chân lông. **Quy trình bao gồm:** - Làm sạch da và xông hơi - Hút mụn đầu đen bằng công nghệ hiện đại - Thoa tinh chất kiểm soát dầu - Đắp mặt nạ thu nhỏ lỗ chân lông - Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "13",
//         name: "Điều Trị Mụn Viêm",
//         img: "https://i.ibb.co/rfwYrmNr/skin-treatment13.jpg",
//         price: 550000,
//         duration: "1 Giờ",
//         popularity: 74000,
//         description: "Liệu trình Điều Trị Mụn Viêm giúp giảm sưng viêm, tiêu diệt vi khuẩn gây mụn và phục hồi làn da. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi hỗ trợ giãn nở lỗ chân lông - Chấm tinh chất kháng khuẩn - Áp dụng công nghệ ánh sáng sinh học - Đắp mặt nạ làm dịu da - Dưỡng ẩm phục hồi"
//     },
//     {
//         id: "14",
//         name: "Điều Trị Da Nhạy Cảm",
//         img: "https://i.ibb.co/ycZS9Px8/skin-treatment14.png",
//         price: 400000,
//         duration: "45 phút",
//         popularity: 49000,
//         description: "Dịch vụ Điều Trị Da Nhạy Cảm giúp làm dịu kích ứng, phục hồi hàng rào bảo vệ da và giảm mẩn đỏ. **Quy trình bao gồm:** - Làm sạch nhẹ nhàng với sữa rửa mặt dành cho da nhạy cảm - Massage thư giãn kích thích tuần hoàn - Thoa tinh chất làm dịu và phục hồi - Đắp mặt nạ cấp ẩm chuyên sâu - Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "15",
//         name: "Thải Độc Da Bằng Than Hoạt Tính",
//         img: "https://i.ibb.co/cS8J7zN7/skin-treatment15.jpg",
//         price: 320000,
//         duration: "50 phút",
//         popularity: 67000,
//         description: "Liệu trình Thải Độc Da Bằng Than Hoạt Tính giúp loại bỏ bụi bẩn, thanh lọc độc tố và kiểm soát dầu nhờn hiệu quả. **Quy trình bao gồm:** - Làm sạch da - Tẩy tế bào chết - Đắp mặt nạ than hoạt tính giúp hút sạch độc tố - Massage kích thích tuần hoàn - Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "16",
//         name: "Điều Trị Da Khô",
//         img: "https://i.ibb.co/sdgRzjxh/skin-treatment16.png",
//         price: 280000,
//         duration: "40 phút",
//         popularity: 57000,
//         description: "Liệu trình Điều Trị Da Khô giúp cấp ẩm sâu, cải thiện độ đàn hồi và ngăn ngừa bong tróc. **Quy trình bao gồm:** - Làm sạch nhẹ nhàng - Tẩy tế bào chết - Đắp mặt nạ dưỡng ẩm chuyên sâu - Massage kích thích tuần hoàn - Thoa tinh chất cấp nước và phục hồi da - Chống nắng bảo vệ da"
//     },
//     {
//         id: "17",
//         name: "Căng Bóng Da Hàn Quốc",
//         img: "https://i.ibb.co/0yHCq6Ym/skin-treatment17.jpg",
//         price: 650000,
//         duration: "80 phút",
//         popularity: 88000,
//         description: "Dịch vụ Căng Bóng Da Hàn Quốc giúp da trở nên mịn màng, căng bóng và tràn đầy sức sống. **Quy trình bao gồm:** - Làm sạch da và xông hơi - Tẩy tế bào chết nhẹ nhàng - Cấy tinh chất HA giúp cấp nước - Massage nâng cơ - Đắp mặt nạ phục hồi - Thoa kem dưỡng và chống nắng"
//     },
//     {
//         id: "18",
//         name: "Liệu Trình Collagen Trẻ Hóa",
//         img: "https://i.ibb.co/VYcF627p/skin-treatment18.jpg",
//         price: 750000,
//         duration: "85 phút",
//         popularity: 94000,
//         description: "Liệu trình Collagen Trẻ Hóa giúp cải thiện độ đàn hồi, giảm nếp nhăn và làm săn chắc da. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Đắp mặt nạ collagen - Massage giúp thẩm thấu dưỡng chất - Áp dụng công nghệ trẻ hóa da - Dưỡng ẩm và chống nắng"
//     },
//     {
//         id: "19",
//         name: "Tái Tạo Da Bằng Tế Bào Gốc",
//         img: "https://i.ibb.co/rG0SLBfS/skin-treatment19.jpg",
//         price: 900000,
//         duration: "95 phút",
//         popularity: 102000,
//         description: "Dịch vụ Tái Tạo Da Bằng Tế Bào Gốc giúp phục hồi da, kích thích sản sinh collagen và làm sáng da. **Quy trình bao gồm:** - Làm sạch da - Xông hơi giúp giãn nở lỗ chân lông - Cấy tinh chất tế bào gốc - Massage thư giãn - Đắp mặt nạ phục hồi - Dưỡng ẩm và bảo vệ da"
//     },
//     {
//         id: "20",
//         name: "Liệu Trình Chăm Sóc Da Dầu",
//         img: "https://i.ibb.co/JWm7rRMC/skin-treatment20.jpg",
//         price: 500000,
//         duration: "60 phút",
//         popularity: 81000,
//         description: "Liệu trình Chăm Sóc Da Dầu giúp kiểm soát bã nhờn, ngăn ngừa mụn và giữ da thông thoáng. **Quy trình bao gồm:** - Làm sạch da với sữa rửa mặt kiểm soát dầu - Tẩy tế bào chết nhẹ nhàng - Đắp mặt nạ đất sét giúp hút dầu thừa - Massage thư giãn - Thoa tinh chất cân bằng dầu - Chống nắng bảo vệ da"
//     },
//     {
//         id: "21",
//         name: "Điều Trị Da Bị Dị Ứng",
//         img: "https://i.ibb.co/Fbjb5WWD/skin-treatment21.jpg",
//         price: 350000,
//         duration: "55 phút",
//         popularity: 53000,
//         description: "Dịch vụ Điều Trị Da Bị Dị Ứng giúp làm dịu kích ứng, giảm mẩn đỏ và phục hồi hàng rào bảo vệ da. **Quy trình bao gồm:** - Làm sạch nhẹ nhàng với sữa rửa mặt không gây kích ứng - Xông hơi thảo dược giúp làm dịu da - Đắp mặt nạ làm dịu và phục hồi - Massage nhẹ nhàng để tăng tuần hoàn - Thoa tinh chất phục hồi da - Dưỡng ẩm và chống nắng bảo vệ da"
//     },
//     {
//         id: "22",
//         name: "Điều Trị Da Tổn Thương Sau Lăn Kim",
//         img: "https://i.ibb.co/bR1yCptX/skin-treatment22.png",
//         price: 650000,
//         duration: "80 phút",
//         popularity: 79000,
//         description: "Liệu trình Điều Trị Da Tổn Thương Sau Lăn Kim giúp phục hồi da, giảm đỏ và kích thích tái tạo da nhanh chóng. **Quy trình bao gồm:** - Làm sạch da nhẹ nhàng - Đắp mặt nạ phục hồi chuyên sâu - Sử dụng tinh chất tế bào gốc giúp tái tạo da - Massage thư giãn - Dưỡng ẩm và bảo vệ da khỏi tác nhân gây hại"
//     },
//     {
//         id: "23",
//         name: "Điều Trị Thâm Mụn",
//         img: "https://i.ibb.co/rRdLJj1S/skin-treatment23.jpg",
//         price: 400000,
//         duration: "45 phút",
//         popularity: 69000,
//         description: "Dịch vụ Điều Trị Thâm Mụn giúp làm mờ vết thâm, đều màu da và kích thích tái tạo tế bào mới. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi giúp da hấp thụ dưỡng chất - Sử dụng tinh chất trị thâm - Đắp mặt nạ dưỡng sáng da - Dưỡng ẩm và bảo vệ da khỏi tác động môi trường"
//     },
//     {
//         id: "24",
//         name: "Điều Trị Nám Tàn Nhang Bằng Laser",
//         img: "https://i.ibb.co/0y1TmyWZ/skin-treatment24.webp",
//         price: 1200000,
//         duration: "120 phút",
//         popularity: 112000,
//         description: "Dịch vụ Điều Trị Nám Tàn Nhang Bằng Laser giúp phá vỡ sắc tố sạm nám, làm sáng da và ngăn ngừa tái phát. **Quy trình bao gồm:** - Làm sạch da và ủ tê - Sử dụng công nghệ laser hiện đại - Làm dịu da với tinh chất đặc trị - Đắp mặt nạ phục hồi - Dưỡng ẩm và chống nắng bảo vệ da"
//     },
//     {
//         id: "25",
//         name: "Điều Trị Mụn Bằng Công Nghệ IPL",
//         img: "https://i.ibb.co/fYx4fDx9/skin-treatment25.jpg",
//         price: 950000,
//         duration: "110 phút",
//         popularity: 97000,
//         description: "Liệu trình Điều Trị Mụn Bằng Công Nghệ IPL giúp tiêu diệt vi khuẩn gây mụn, giảm viêm và hạn chế tái phát. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi giúp lỗ chân lông thông thoáng - Áp dụng công nghệ IPL để diệt khuẩn - Đắp mặt nạ làm dịu và phục hồi - Dưỡng ẩm và chống nắng bảo vệ da"
//     },
//     {
//         id: "26",
//         name: "Chăm Sóc Da Mặt Cơ Bản",
//         img: "https://i.ibb.co/Lbxv4wS/skin-treatment26.jpg",
//         price: 180000,
//         duration: "30 phút",
//         popularity: 65000,
//         description: "Dịch vụ Chăm Sóc Da Mặt Cơ Bản giúp làm sạch sâu, cấp ẩm nhẹ nhàng và giữ da luôn khỏe mạnh. **Quy trình bao gồm:** - Làm sạch da với sữa rửa mặt phù hợp - Tẩy tế bào chết nhẹ nhàng - Đắp mặt nạ dưỡng ẩm - Massage thư giãn - Dưỡng ẩm và bảo vệ da khỏi tác nhân môi trường"
//     },
//     {
//         id: "27",
//         name: "Chăm Sóc Da Chuyên Sâu",
//         img: "https://i.ibb.co/Rkyqd87G/skin-treatment27.jpg",
//         price: 350000,
//         duration: "70 phút",
//         popularity: 72000,
//         description: "Liệu trình Chăm Sóc Da Chuyên Sâu giúp cải thiện kết cấu da, cấp ẩm sâu và tái tạo làn da khỏe mạnh. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi và hút dầu thừa - Đắp mặt nạ dưỡng chất chuyên sâu - Massage nâng cơ giúp da săn chắc - Thoa tinh chất đặc trị - Dưỡng ẩm và chống nắng"
//     },
// ];

const servicesResponse = await axios.get("https://6663414662966e20ef0c1254.mockapi.io/history/service")

const servicesData: Service[] = servicesResponse.data;

export default servicesData; 



