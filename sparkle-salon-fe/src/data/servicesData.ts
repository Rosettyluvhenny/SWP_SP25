import axios from "axios";
export interface Service {
    id: number;
    active: boolean;
    name: string;
    price: number;
    duration: string;
    session: number;
    img: string;
    description: string;
    categoryId: number;
    categoryName: string;
}


const servicesData = async (): Promise<Service[]> =>{
    const servicesResponse = await axios.get("http://localhost:8081/swp/services");
    if (servicesResponse.status === 200) {
        return servicesResponse.data.result.content;
    }
    return [];
};


// const servicesDataTest: Service[] = [
//     {
//         id: 1,
//         name: "Điều Trị Mụn Chuyên Sâu 12 bước",
//         img: "https://i.ibb.co/BHwF63Mg/skin-treatment1.jpg",
//         price: 150000,
//         duration: "90 phút",
//         session: 3,
//         description: `
//             <h1>Điều Trị Mụn Chuyên Sâu 12 Bước</h1>
//             <p>Dịch vụ <strong>Điều Trị Mụn Chuyên Sâu 12 Bước</strong> tại Sparkle Salon được thiết kế dành riêng cho làn da gặp vấn đề về mụn như mụn viêm, mụn đầu đen, mụn ẩn và da dễ kích ứng.</p>
            
//             <p>Quy trình 12 bước khoa học giúp làm sạch da tận sâu, loại bỏ tác nhân gây mụn, giảm viêm và hỗ trợ tái tạo làn da khỏe mạnh hơn.</p>
            
//             <div class="highlight-box">
//                 <p>Phù hợp với mọi loại da, đặc biệt là da dầu, da mụn và da hỗn hợp. Liệu trình điều trị được điều chỉnh tùy theo tình trạng da của từng khách hàng.</p>
//             </div>
            
//             <h2>Quy Trình 12 Bước Chăm Sóc Da</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Sử dụng sữa rửa mặt chuyên biệt cho da mụn, loại bỏ bụi bẩn và dầu thừa.</li>
//                 <li><strong>Rửa Mặt Chuyên Sâu</strong> - Làm sạch sâu với các sản phẩm đặc trị.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Loại bỏ tế bào chết, thông thoáng lỗ chân lông.</li>
//                 <li><strong>Xông Hơi Nóng & Hút Bã Nhờn</strong> - Mở lỗ chân lông và hút sạch bã nhờn.</li>
//                 <li><strong>Nặn Mụn</strong> - Loại bỏ mụn đầu đen, mụn đầu trắng bằng kỹ thuật chuyên nghiệp.</li>
//                 <li><strong>Sát Khuẩn Da</strong> - Làm sạch và diệt khuẩn, ngăn ngừa viêm nhiễm.</li>
//                 <li><strong>Cân Bằng Da Với Toner</strong> - Phục hồi độ pH tự nhiên của da.</li>
//                 <li><strong>Đắp Mặt Nạ</strong> - Mặt nạ đặc trị giúp làm dịu và phục hồi da.</li>
//                 <li><strong>Điện Di Tinh Chất Đặc Trị</strong> - Đưa dưỡng chất sâu vào da.</li>
//                 <li><strong>Massage Thư Giãn</strong> - Kích thích tuần hoàn máu và thư giãn.</li>
//                 <li><strong>Dưỡng Ẩm & Phục Hồi Da</strong> - Cung cấp độ ẩm và dưỡng chất.</li>
//                 <li><strong>Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV.</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Giảm đáng kể tình trạng mụn viêm, mụn đầu đen</li>
//                 <li>Làm sạch sâu lỗ chân lông</li>
//                 <li>Kiểm soát dầu nhờn hiệu quả</li>
//                 <li>Làm dịu da, giảm sưng đỏ</li>
//                 <li>Ngăn ngừa sẹo thâm sau mụn</li>
//                 <li>Cải thiện kết cấu và tông màu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>90 phút</td>
//                         <td>150.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>90 phút/lần</td>
//                         <td>700.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>90 phút/lần</td>
//                         <td>1.300.000</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Tránh chạm tay lên mặt</li>
//                 <li>Sử dụng kem chống nắng hàng ngày</li>
//                 <li>Uống đủ nước</li>
//                 <li>Hạn chế trang điểm trong 24h sau điều trị</li>
//                 <li>Tránh các thực phẩm cay nóng, nhiều dầu mỡ</li>
//             </ol>
            
//             <blockquote>
//                 "Liệu trình điều trị mụn chuyên sâu đã giúp tôi cải thiện đáng kể tình trạng da. Sau 5 lần điều trị, mụn giảm hẳn và da sáng mịn hơn rất nhiều." - Khách hàng Minh Anh
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 2,
//         name: "Thải Độc Da Thảo Dược",
//         img: "https://i.ibb.co/fGYS3VzC/skin-treatment2.jpg",
//         price: 200000,
//         duration: "30 phút",
//         session: 2,
//         description: `
//             <h1>Thải Độc Da Thảo Dược</h1>
            
//             <p>Dịch vụ <strong>Thải Độc Da Thảo Dược</strong> tại Sparkle Salon là phương pháp làm đẹp kết hợp giữa khoa học hiện đại và tinh hoa từ thảo dược thiên nhiên, giúp loại bỏ độc tố, giảm sưng viêm và cân bằng độ ẩm, mang lại làn da tươi sáng và khỏe mạnh.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình sử dụng 100% thảo dược tự nhiên, an toàn cho mọi loại da, kể cả da nhạy cảm.</p>
//             </div>
            
//             <h2>Quy Trình Thải Độc Da</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, trang điểm và dầu thừa với sản phẩm làm sạch từ thảo mộc.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng hỗn hợp thảo dược nghiền mịn để loại bỏ tế bào chết nhẹ nhàng.</li>
//                 <li><strong>Xông Hơi Thảo Dược</strong> - Mở lỗ chân lông với hơi nước thảo dược, giúp thải độc tố.</li>
//                 <li><strong>Massage Thải Độc</strong> - Kỹ thuật massage đặc biệt kết hợp với tinh dầu thảo mộc giúp kích thích tuần hoàn và đào thải độc tố.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Chất</strong> - Mặt nạ thảo dược đặc biệt giúp hút độc tố và cung cấp dưỡng chất.</li>
//                 <li><strong>Cân Bằng và Bảo Vệ Da</strong> - Hoàn thiện với toner thảo mộc, serum và kem dưỡng ẩm.</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Loại bỏ độc tố tích tụ trong da</li>
//                 <li>Giảm mẩn đỏ và kích ứng</li>
//                 <li>Cải thiện tuần hoàn máu</li>
//                 <li>Làm sáng và đều màu da</li>
//                 <li>Tăng cường sức đề kháng cho da</li>
//                 <li>Ngăn ngừa lão hóa sớm</li>
//                 <li>Cung cấp độ ẩm sâu</li>
//             </ul>
            
//             <h3>Các Loại Thảo Dược Sử Dụng</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các loại thảo dược quý như:</p>
            
//             <ul>
//                 <li><em>Nghệ vàng</em> - Chống viêm, làm sáng da</li>
//                 <li><em>Trà xanh</em> - Chống oxy hóa mạnh mẽ</li>
//                 <li><em>Lô hội</em> - Làm dịu và cấp ẩm</li>
//                 <li><em>Hoa cúc</em> - Giảm kích ứng và làm dịu da</li>
//                 <li><em>Hoa hồng</em> - Cân bằng độ pH và se khít lỗ chân lông</li>
//                 <li><em>Sả</em> - Kháng khuẩn tự nhiên</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Thải độc cơ bản (1 lần)</td>
//                         <td>30 phút</td>
//                         <td>200.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>30 phút/lần</td>
//                         <td>900.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (bao gồm mặt nạ đặc biệt)</td>
//                         <td>45 phút</td>
//                         <td>350.000</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <blockquote>
//                 "Sau khi thử liệu trình thải độc da thảo dược, làn da của tôi trở nên tươi sáng và khỏe mạnh hơn hẳn. Đặc biệt là cảm giác thư giãn trong quá trình điều trị thật tuyệt vời!" - Khách hàng Thanh Hà
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 3,
//         name: "Điều Trị Nám Da",
//         img: "https://i.ibb.co/p8hzvCs/skin-treatment3.jpg",
//         price: 550000,
//         duration: "45 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Nám Da</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Nám Da</strong> tại Sparkle Salon sử dụng công nghệ tiên tiến để làm mờ các đốm nám, ngăn ngừa sắc tố melanin và tái tạo làn da đều màu.</p>
            
//             <div class="highlight-box">
//                 <p>Phù hợp với mọi loại da, đặc biệt là những làn da đang gặp vấn đề về nám, tàn nhang và sạm màu do tác động của môi trường và nội tiết tố.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị Nám</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Sử dụng sản phẩm làm sạch chuyên biệt, loại bỏ bụi bẩn và tế bào chết.</li>
//                 <li><strong>Peel Da Nhẹ</strong> - Loại bỏ tế bào sừng, giúp da sáng mịn và thông thoáng.</li>
//                 <li><strong>Thoa Tinh Chất Đặc Trị Nám</strong> - Sử dụng các tinh chất chứa thành phần ức chế melanin.</li>
//                 <li><strong>Điện Di Tinh Chất</strong> - Đưa dưỡng chất sâu vào da bằng công nghệ điện di.</li>
//                 <li><strong>Đắp Mặt Nạ Phục Hồi</strong> - Làm dịu và cấp ẩm cho da sau điều trị.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV.</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm mờ đốm nám và tàn nhang</li>
//                 <li>Ngăn ngừa sự hình thành sắc tố melanin</li>
//                 <li>Làm đều màu da</li>
//                 <li>Tăng cường độ sáng cho da</li>
//                 <li>Cải thiện kết cấu da</li>
//                 <li>Bảo vệ da khỏi tác hại của môi trường</li>
//             </ul>
            
//             <h3>Công Nghệ Sử Dụng</h3>
            
//             <p>Liệu trình của chúng tôi kết hợp các công nghệ hiện đại:</p>
            
//             <ul>
//                 <li><em>Công nghệ Nano</em> - Giúp các phân tử dưỡng chất thẩm thấu sâu vào da</li>
//                 <li><em>Ánh sáng sinh học</em> - Kích thích tái tạo tế bào da</li>
//                 <li><em>Điện di ion</em> - Đưa dưỡng chất vào sâu trong da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>45 phút</td>
//                         <td>550.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>45 phút/lần</td>
//                         <td>2.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>45 phút/lần</td>
//                         <td>4.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp laser)</td>
//                         <td>90 phút</td>
//                         <td>800.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
//                 <li>Duy trì chế độ dưỡng ẩm đầy đủ</li>
//                 <li>Tránh sử dụng các sản phẩm có cồn hoặc gây kích ứng</li>
//                 <li>Uống đủ nước và bổ sung vitamin E</li>
//             </ol>
            
//             <blockquote>
//                 "Sau khi trải qua liệu trình điều trị nám tại Sparkle Salon, làn da của tôi đã cải thiện rõ rệt. Các đốm nám mờ dần và da sáng đều màu hơn. Tôi rất hài lòng với kết quả!" - Khách hàng Thanh Thảo
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 4,
//         name: "Điều Trị Tàn Nhang",
//         img: "https://i.ibb.co/cmnDYzX/skin-treatment7.jpg",
//         price: 300000,
//         duration: "45 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Tàn Nhang</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Tàn Nhang</strong> tại Sparkle Salon giúp giảm sưng viêm, tiêu diệt vi khuẩn gây mụn và phục hồi làn da. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi hỗ trợ giãn nở lỗ chân lông - Chấm tinh chất kháng khuẩn - Áp dụng công nghệ ánh sáng sinh học - Đắp mặt nạ làm dịu da - Dưỡng ẩm phục hồi`,
//         categoryName: "Điều Trị Da",
//     },

//     {
//         id: 5,
//         name: "Điều Trị Sẹo Rỗ",
//         img: "https://i.ibb.co/n83Tryf1/skin-treatment4.jpg",
//         price: 250000,
//         duration: "60 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Sẹo Rỗ</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Sẹo Rỗ</strong> tại Sparkle Salon giúp kích thích tái tạo collagen, làm đầy sẹo và cải thiện kết cấu da, mang lại làn da mịn màng và đều màu.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho những làn da có sẹo rỗ do mụn, thủy đậu hoặc chấn thương, sử dụng công nghệ tiên tiến và an toàn.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị Sẹo Rỗ</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt.</li>
//                 <li><strong>Lăn Kim hoặc Vi Kim</strong> - Tạo các vi tổn thương nhỏ trên da để kích thích quá trình tái tạo collagen tự nhiên.</li>
//                 <li><strong>Thoa Tinh Chất Tái Tạo</strong> - Sử dụng các tinh chất giàu peptide, yếu tố tăng trưởng và hyaluronic acid.</li>
//                 <li><strong>Điện Di Phục Hồi</strong> - Đưa dưỡng chất sâu vào da bằng công nghệ điện di, tăng cường hiệu quả.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Chất</strong> - Sử dụng mặt nạ chuyên biệt giúp làm dịu và phục hồi da.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV và giữ ẩm cho da.</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm phẳng sẹo rỗ và cải thiện kết cấu da</li>
//                 <li>Kích thích sản sinh collagen tự nhiên</li>
//                 <li>Làm đều màu da và giảm thâm sẹo</li>
//                 <li>Tăng cường độ đàn hồi và săn chắc</li>
//                 <li>Cải thiện tổng thể làn da</li>
//                 <li>Tăng cường sự tự tin với làn da mịn màng</li>
//             </ul>
            
//             <h3>Công Nghệ Sử Dụng</h3>
            
//             <p>Liệu trình của chúng tôi kết hợp các công nghệ hiện đại:</p>
            
//             <ul>
//                 <li><em>Lăn kim tế bào gốc</em> - Kích thích tái tạo collagen tự nhiên</li>
//                 <li><em>Vi kim điện</em> - Tạo các kênh vi mô để đưa dưỡng chất vào sâu trong da</li>
//                 <li><em>Công nghệ RF (sóng cao tần)</em> - Làm săn chắc da và cải thiện kết cấu</li>
//                 <li><em>Laser phân đoạn</em> - Tái tạo bề mặt da và làm mờ sẹo</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>60 phút</td>
//                         <td>250.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>60 phút/lần</td>
//                         <td>1.100.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>60 phút/lần</td>
//                         <td>2.200.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp laser)</td>
//                         <td>90 phút</td>
//                         <td>500.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Tránh chạm tay lên mặt trong 24 giờ sau điều trị</li>
//                 <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
//                 <li>Không sử dụng các sản phẩm có cồn hoặc gây kích ứng trong 48 giờ</li>
//                 <li>Duy trì chế độ dưỡng ẩm đầy đủ</li>
//                 <li>Tránh trang điểm trong 24 giờ sau điều trị</li>
//             </ol>
            
//             <blockquote>
//                 "Sau nhiều năm bị sẹo rỗ do mụn, tôi đã thử liệu trình điều trị tại Sparkle Salon và thực sự ngạc nhiên với kết quả. Các vết sẹo đã phẳng hơn rất nhiều và làn da của tôi mịn màng hơn hẳn." - Khách hàng Hoàng Minh
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 6,
//         name: "Điều Trị Da Nhờn",
//         img: "https://i.ibb.co/V0WCLYCK/skin-treatment5.jpg",
//         price: 600000,
//         duration: "90 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Da Nhờn</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Da Nhờn</strong> tại Sparkle Salon giúp kiểm soát bã nhờn, giảm bóng dầu và ngăn ngừa mụn hiệu quả, mang lại làn da mịn màng, sạch thoáng và khỏe mạnh.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da dầu, da hỗn hợp thiên dầu và da dễ bị mụn, sử dụng các thành phần cân bằng dầu tự nhiên và an toàn.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt cho da dầu.</li>
//                 <li><strong>Tẩy Tế Bào Chết Kiểm Soát Dầu</strong> - Sử dụng tẩy tế bào chết chứa BHA (Salicylic Acid) giúp thông thoáng lỗ chân lông.</li>
//                 <li><strong>Xông Hơi Hút Bã Nhờn</strong> - Mở lỗ chân lông và hút sạch bã nhờn tích tụ sâu bên trong.</li>
//                 <li><strong>Đắp Mặt Nạ Kiềm Dầu</strong> - Sử dụng mặt nạ đất sét hoặc than hoạt tính giúp hút dầu thừa và se khít lỗ chân lông.</li>
//                 <li><strong>Điện Di Tinh Chất Kiểm Soát Dầu</strong> - Đưa dưỡng chất cân bằng dầu sâu vào da bằng công nghệ điện di.</li>
//                 <li><strong>Dưỡng Ẩm Cân Bằng Da</strong> - Sử dụng kem dưỡng ẩm không dầu, giúp cân bằng độ ẩm mà không gây bít tắc lỗ chân lông.</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Kiểm soát dầu nhờn hiệu quả</li>
//                 <li>Giảm bóng dầu trên da</li>
//                 <li>Ngăn ngừa mụn và viêm nhiễm</li>
//                 <li>Thu nhỏ lỗ chân lông</li>
//                 <li>Cải bằng độ ẩm cho da</li>
//                 <li>Làm mịn và đều màu da</li>
//                 <li>Tạo cảm giác thoáng nhẹ cho da</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
//             <ul>
//                 <li><em>Niacinamide</em> - Kiểm soát dầu và giảm viêm</li>
//                 <li><em>Salicylic Acid</em> - Thông thoáng lỗ chân lông và ngăn ngừa mụn</li>
//                 <li><em>Zinc PCA</em> - Điều tiết bã nhờn</li>
//                 <li><em>Chiết xuất trà xanh</em> - Chống oxy hóa và kháng khuẩn</li>
//                 <li><em>Đất sét Kaolin</em> - Hút dầu thừa và làm sạch sâu</li>
//                 <li><em>Hyaluronic Acid</em> - Cấp ẩm không gây nhờn</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>90 phút</td>
//                         <td>600.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>90 phút/lần</td>
//                         <td>2.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>90 phút/lần</td>
//                         <td>5.400.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp công nghệ ánh sáng)</td>
//                         <td>120 phút</td>
//                         <td>900.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Rửa mặt với sữa rửa mặt dành cho da dầu, không quá 2 lần/ngày</li>
//                 <li>Sử dụng toner không cồn để cân bằng độ pH</li>
//                 <li>Dùng kem dưỡng ẩm không dầu (oil-free)</li>
//                 <li>Sử dụng kem chống nắng dạng gel hoặc không dầu</li>
//                 <li>Tránh các thực phẩm cay nóng, nhiều dầu mỡ và đường</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Thay vỏ gối thường xuyên</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã phải vật lộn với làn da dầu và mụn trong nhiều năm. Sau khi thử liệu trình điều trị da nhờn tại Sparkle Salon, làn da của tôi đã cải thiện đáng kể. Da không còn bóng dầu vào giữa ngày và mụn cũng giảm hẳn." - Khách hàng Thùy Linh
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 7,
//         name: "Điều Trị Lão Hóa Da",
//         img: "https://i.ibb.co/DHxYGwP1/skin-treatment6.jpg",
//         price: 100000,
//         duration: "40 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Lão Hóa Da</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Lão Hóa Da</strong> tại Sparkle Salon giúp làm mờ nếp nhăn, nâng cơ và tái tạo làn da căng mịn, săn chắc, mang lại vẻ trẻ trung và rạng rỡ.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da có dấu hiệu lão hóa như nếp nhăn, chảy xệ, kém đàn hồi và thiếu sức sống, sử dụng công nghệ tiên tiến và các thành phần chống lão hóa hiệu quả.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch dịu nhẹ.</li>
//                 <li><strong>Thoa Tinh Chất Chống Lão Hóa</strong> - Sử dụng các tinh chất giàu peptide, retinol và vitamin chống oxy hóa.</li>
//                 <li><strong>Điện Di Collagen</strong> - Đưa collagen và elastin sâu vào da bằng công nghệ điện di, kích thích tái tạo.</li>
//                 <li><strong>Đắp Mặt Nạ Nâng Cơ</strong> - Sử dụng mặt nạ chuyên biệt giúp làm săn chắc và nâng cơ mặt.</li>
//                 <li><strong>Massage Da Mặt</strong> - Kỹ thuật massage đặc biệt giúp kích thích tuần hoàn và nâng cơ tự nhiên.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV và giữ ẩm cho da.</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm mờ nếp nhăn và đường nhăn</li>
//                 <li>Nâng cơ và làm săn chắc da</li>
//                 <li>Cải thiện độ đàn hồi và độ ẩm</li>
//                 <li>Làm đều màu da và tăng độ sáng</li>
//                 <li>Kích thích sản sinh collagen tự nhiên</li>
//                 <li>Làm chậm quá trình lão hóa</li>
//                 <li>Mang lại vẻ trẻ trung và tươi tắn</li>
//             </ul>
            
//             <h3>Công Nghệ và Thành Phần</h3>
            
//             <p>Liệu trình của chúng tôi kết hợp các công nghệ và thành phần hiện đại:</p>
            
//             <ul>
//                 <li><em>RF (sóng cao tần)</em> - Kích thích sản sinh collagen và làm săn chắc da</li>
//                 <li><em>Peptide</em> - Kích thích tái tạo tế bào và làm mờ nếp nhăn</li>
//                 <li><em>Retinol</em> - Thúc đẩy tái tạo tế bào và cải thiện kết cấu da</li>
//                 <li><em>Vitamin C</em> - Chống oxy hóa và làm sáng da</li>
//                 <li><em>Hyaluronic Acid</em> - Cấp ẩm sâu và làm đầy nếp nhăn</li>
//                 <li><em>Coenzyme Q10</em> - Bảo vệ tế bào khỏi tổn thương oxy hóa</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>40 phút</td>
//                         <td>100.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>40 phút/lần</td>
//                         <td>450.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>40 phút/lần</td>
//                         <td>850.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp RF và ánh sáng)</td>
//                         <td>60 phút</td>
//                         <td>300.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
//                 <li>Duy trì chế độ dưỡng ẩm đầy đủ</li>
//                 <li>Sử dụng sản phẩm chống lão hóa hàng ngày</li>
//                 <li>Uống đủ nước và bổ sung thực phẩm giàu chất chống oxy hóa</li>
//                 <li>Tránh hút thuốc và hạn chế rượu bia</li>
//                 <li>Ngủ đủ giấc và giảm stress</li>
//             </ol>
            
//             <blockquote>
//                 "Ở tuổi 45, tôi đã lo lắng về các dấu hiệu lão hóa trên da. Sau khi trải qua liệu trình điều trị tại Sparkle Salon, làn da của tôi đã trở nên căng mịn và tươi trẻ hơn rất nhiều. Các nếp nhăn đã mờ đi đáng kể và da săn chắc hơn." - Khách hàng Hồng Vân
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 8,
//         name: "Điều Trị Da Không Đều Màu",
//         img: "https://i.ibb.co/WWVd35zw/skin-treatment8.webp",
//         price: 350000,
//         duration: "1 Giờ",
//         session: 2,
//         description: `
//             <h1>Điều Trị Da Không Đều Màu</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Da Không Đều Màu</strong> tại Sparkle Salon giúp làm sáng da, giảm thâm sạm, cải thiện tông màu da và mang lại làn da đều màu, rạng rỡ tự nhiên.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da có vấn đề về sắc tố, thâm nám, tàn nhang, đốm nâu và không đều màu, sử dụng các thành phần làm sáng da an toàn và hiệu quả.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch dịu nhẹ.</li>
//                 <li><strong>Tẩy Tế Bào Chết Làm Sáng Da</strong> - Sử dụng tẩy tế bào chết chứa AHA/BHA giúp loại bỏ tế bào chết và làm sáng da.</li>
//                 <li><strong>Điện Di Vitamin C</strong> - Đưa vitamin C và các dưỡng chất làm sáng da sâu vào da bằng công nghệ điện di.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Trắng</strong> - Sử dụng mặt nạ chuyên biệt giúp làm sáng và đều màu da.</li>
//                 <li><strong>Thoa Tinh Chất Làm Sáng</strong> - Sử dụng các tinh chất chứa Niacinamide, Arbutin hoặc Tranexamic Acid.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV và giữ ẩm cho da.</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm đều màu da và cải thiện tông màu</li>
//                 <li>Giảm thâm nám và đốm nâu</li>
//                 <li>Làm sáng da tự nhiên</li>
//                 <li>Cải thiện kết cấu da</li>
//                 <li>Tăng cường độ ẩm và độ đàn hồi</li>
//                 <li>Bảo vệ da khỏi tác hại của môi trường</li>
//                 <li>Mang lại làn da rạng rỡ, tươi sáng</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
//             <ul>
//                 <li><em>Vitamin C</em> - Chống oxy hóa và làm sáng da</li>
//                 <li><em>Niacinamide</em> - Làm đều màu da và giảm viêm</li>
//                 <li><em>Alpha Arbutin</em> - Ức chế sản sinh melanin, làm mờ đốm nâu</li>
//                 <li><em>Tranexamic Acid</em> - Giảm thâm nám và tăng sắc tố</li>
//                 <li><em>Azelaic Acid</em> - Làm sáng da và giảm viêm</li>
//                 <li><em>Chiết xuất cam thảo</em> - Làm sáng da tự nhiên</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>60 phút</td>
//                         <td>350.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>60 phút/lần</td>
//                         <td>1.600.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>60 phút/lần</td>
//                         <td>3.000.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp laser)</td>
//                         <td>90 phút</td>
//                         <td>600.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày, kể cả khi ở trong nhà</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
//                 <li>Sử dụng sản phẩm dưỡng da có chứa Vitamin C và Niacinamide</li>
//                 <li>Tránh sử dụng các sản phẩm có cồn hoặc gây kích ứng</li>
//                 <li>Duy trì chế độ ăn uống giàu chất chống oxy hóa</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Tránh các thực phẩm gây tăng sắc tố như cà phê, rượu</li>
//             </ol>
            
//             <blockquote>
//                 "Sau nhiều năm bị thâm nám và da không đều màu, tôi đã thử liệu trình điều trị tại Sparkle Salon. Chỉ sau vài lần, làn da của tôi đã sáng hơn và đều màu hơn rất nhiều. Tôi rất hài lòng với kết quả!" - Khách hàng Thanh Hà
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 9,
//         name: "Điều Trị Lỗ Chân Lông To",
//         img: "https://i.ibb.co/tpBQL1Jh/skin-treatment9.jpg",
//         price: 450000,
//         duration: "50 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Lỗ Chân Lông To</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Lỗ Chân Lông To</strong> tại Sparkle Salon giúp se khít lỗ chân lông, làm mịn da và kiểm soát dầu nhờn hiệu quả, mang lại làn da mịn màng và đều màu.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da có lỗ chân lông to, da dầu, da hỗn hợp và da bị tổn thương do mụn, sử dụng các thành phần se khít lỗ chân lông an toàn và hiệu quả.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng tẩy tế bào chết chứa BHA (Salicylic Acid) giúp thông thoáng lỗ chân lông.</li>
//                 <li><strong>Xông Hơi Hút Bã Nhờn</strong> - Mở lỗ chân lông và hút sạch bã nhờn tích tụ sâu bên trong.</li>
//                 <li><strong>Điện Di Tinh Chất Se Khít Lỗ Chân Lông</strong> - Đưa dưỡng chất se khít lỗ chân lông sâu vào da bằng công nghệ điện di.</li>
//                 <li><strong>Đắp Mặt Nạ Se Khít</strong> - Sử dụng mặt nạ đất sét hoặc than hoạt tính giúp se khít lỗ chân lông và kiểm soát dầu.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV và giữ ẩm cho da.</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Se khít lỗ chân lông hiệu quả</li>
//                 <li>Kiểm soát dầu nhờn trên da</li>
//                 <li>Làm mịn và đều màu da</li>
//                 <li>Ngăn ngừa mụn và viêm nhiễm</li>
//                 <li>Cải thiện kết cấu da</li>
//                 <li>Tăng cường độ đàn hồi</li>
//                 <li>Mang lại làn da mịn màng, tươi sáng</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
//             <ul>
//                 <li><em>Niacinamide</em> - Se khít lỗ chân lông và kiểm soát dầu</li>
//                 <li><em>Salicylic Acid</em> - Thông thoáng lỗ chân lông và ngăn ngừa mụn</li>
//                 <li><em>Zinc PCA</em> - Điều tiết bã nhờn</li>
//                 <li><em>Chiết xuất hoa hồng</em> - Se khít lỗ chân lông tự nhiên</li>
//                 <li><em>Đất sét Kaolin</em> - Hút dầu thừa và làm sạch sâu</li>
//                 <li><em>Witch Hazel</em> - Se khít lỗ chân lông và làm dịu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>50 phút</td>
//                         <td>450.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>50 phút/lần</td>
//                         <td>2.000.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>50 phút/lần</td>
//                         <td>3.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp RF)</td>
//                         <td>75 phút</td>
//                         <td>700.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Rửa mặt với sữa rửa mặt dành cho da dầu, không quá 2 lần/ngày</li>
//                 <li>Sử dụng toner không cồn để cân bằng độ pH</li>
//                 <li>Dùng kem dưỡng ẩm không dầu (oil-free)</li>
//                 <li>Sử dụng kem chống nắng dạng gel hoặc không dầu</li>
//                 <li>Tránh các thực phẩm cay nóng, nhiều dầu mỡ và đường</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Tránh chạm tay lên mặt</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã phải vật lộn với lỗ chân lông to trong nhiều năm. Sau khi thử liệu trình điều trị tại Sparkle Salon, làn da của tôi đã cải thiện đáng kể. Lỗ chân lông nhỏ hơn và da mịn màng hơn rất nhiều." - Khách hàng Minh Anh
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 10,
//         name: "Trẻ Hóa Da Công Nghệ Cao",
//         img: "https://i.ibb.co/Dgw0NW6m/skin-treatment10.webp",
//         price: 700000,
//         duration: "75 phút",
//         session: 2,
//         description: `
//             <h1>Trẻ Hóa Da Công Nghệ Cao</h1>
            
//             <p>Dịch vụ <strong>Trẻ Hóa Da Công Nghệ Cao</strong> tại Sparkle Salon giúp làm căng da, nâng cơ và xóa nhăn hiệu quả bằng công nghệ hiện đại, mang lại làn da trẻ trung, tươi sáng và đầy sức sống.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da có dấu hiệu lão hóa như nếp nhăn, chảy xệ, kém đàn hồi và thiếu sức sống, sử dụng công nghệ tiên tiến và các thành phần chống lão hóa hiệu quả.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch dịu nhẹ.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Loại bỏ tế bào chết, thông thoáng lỗ chân lông và chuẩn bị da cho các bước tiếp theo.</li>
//                 <li><strong>Điện Di Collagen hoặc Laser Trẻ Hóa</strong> - Sử dụng công nghệ hiện đại để đưa collagen sâu vào da hoặc kích thích tái tạo collagen tự nhiên.</li>
//                 <li><strong>Đắp Mặt Nạ Nâng Cơ</strong> - Sử dụng mặt nạ chuyên biệt giúp làm săn chắc và nâng cơ mặt.</li>
//                 <li><strong>Massage Thư Giãn</strong> - Kỹ thuật massage đặc biệt giúp kích thích tuần hoàn và nâng cơ tự nhiên.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV và giữ ẩm cho da.</li>
//             </ul>
            
//             <h2>Công Nghệ Sử Dụng</h2>
            
//             <p>Liệu trình của chúng tôi kết hợp các công nghệ hiện đại:</p>
            
//             <ul>
//                 <li><em>RF (sóng cao tần)</em> - Kích thích sản sinh collagen và làm săn chắc da</li>
//                 <li><em>HIFU (siêu âm hội tụ cường độ cao)</em> - Nâng cơ và làm săn chắc da không xâm lấn</li>
//                 <li><em>Laser phân đoạn</em> - Tái tạo bề mặt da và làm mờ nếp nhăn</li>
//                 <li><em>LED trị liệu</em> - Kích thích tái tạo tế bào và giảm viêm</li>
//                 <li><em>Microcurrent</em> - Kích thích cơ mặt và nâng cơ tự nhiên</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm mờ nếp nhăn và đường nhăn</li>
//                 <li>Nâng cơ và làm săn chắc da</li>
//                 <li>Cải thiện độ đàn hồi và độ ẩm</li>
//                 <li>Làm đều màu da và tăng độ sáng</li>
//                 <li>Kích thích sản sinh collagen tự nhiên</li>
//                 <li>Làm chậm quá trình lão hóa</li>
//                 <li>Mang lại vẻ trẻ trung và tươi tắn</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>75 phút</td>
//                         <td>700.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>75 phút/lần</td>
//                         <td>3.200.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>75 phút/lần</td>
//                         <td>6.000.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp HIFU)</td>
//                         <td>90 phút</td>
//                         <td>1.200.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
//                 <li>Duy trì chế độ dưỡng ẩm đầy đủ</li>
//                 <li>Sử dụng sản phẩm chống lão hóa hàng ngày</li>
//                 <li>Uống đủ nước và bổ sung thực phẩm giàu chất chống oxy hóa</li>
//                 <li>Tránh hút thuốc và hạn chế rượu bia</li>
//                 <li>Ngủ đủ giấc và giảm stress</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã thử nhiều phương pháp trẻ hóa da nhưng chỉ có liệu trình tại Sparkle Salon mới thực sự hiệu quả. Sau 5 lần điều trị, làn da của tôi đã trở nên căng mịn và tươi trẻ hơn rất nhiều. Các nếp nhăn đã mờ đi đáng kể và da săn chắc hơn." - Khách hàng Thanh Thảo
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 11,
//         name: "Cấy Tinh Chất Trắng Da",
//         img: "https://i.ibb.co/hJ0f4yt2/skin-treatment11.webp",
//         price: 800000,
//         duration: "90 phút",
//         session: 2,
//         description: `
//             <h1>Cấy Tinh Chất Trắng Da</h1>
            
//             <p>Dịch vụ <strong>Cấy Tinh Chất Trắng Da</strong> tại Sparkle Salon giúp cung cấp dưỡng chất chuyên sâu, làm sáng da, đều màu và giảm thâm nám, mang lại làn da trắng sáng, rạng rỡ tự nhiên.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da xỉn màu, không đều màu, có đốm nâu và thâm nám, sử dụng công nghệ mesotherapy tiên tiến và các thành phần làm sáng da an toàn, hiệu quả.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch dịu nhẹ.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Loại bỏ tế bào chết, thông thoáng lỗ chân lông và chuẩn bị da cho các bước tiếp theo.</li>
//                 <li><strong>Cấy Tinh Chất Dưỡng Trắng</strong> - Sử dụng công nghệ mesotherapy để đưa các dưỡng chất làm sáng da sâu vào lớp hạ bì.</li>
//                 <li><strong>Massage Thẩm Thấu</strong> - Kỹ thuật massage đặc biệt giúp tăng cường hấp thu dưỡng chất và kích thích tuần hoàn máu.</li>
//                 <li><strong>Đắp Mặt Nạ Cấp Ẩm</strong> - Sử dụng mặt nạ chuyên biệt giúp làm dịu, cấp ẩm và tăng cường hiệu quả làm sáng da.</li>
//                 <li><strong>Chống Nắng và Bảo Vệ Da</strong> - Bảo vệ da khỏi tác hại của tia UV và các tác nhân môi trường.</li>
//             </ul>
            
//             <h2>Công Nghệ Mesotherapy</h2>
            
//             <p>Công nghệ Mesotherapy là phương pháp tiên tiến giúp đưa dưỡng chất vào sâu trong da:</p>
            
//             <ul>
//                 <li>Sử dụng kim siêu nhỏ tạo các vi kênh trên da</li>
//                 <li>Đưa dưỡng chất trực tiếp vào lớp hạ bì</li>
//                 <li>Kích thích tái tạo collagen tự nhiên</li>
//                 <li>Tăng cường hiệu quả làm sáng da</li>
//                 <li>An toàn và ít xâm lấn</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm sáng da tự nhiên</li>
//                 <li>Làm đều màu da và giảm thâm nám</li>
//                 <li>Cải thiện kết cấu da</li>
//                 <li>Tăng cường độ ẩm và độ đàn hồi</li>
//                 <li>Kích thích tái tạo tế bào mới</li>
//                 <li>Làm mờ đốm nâu và tàn nhang</li>
//                 <li>Mang lại làn da tươi sáng, rạng rỡ</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
//             <ul>
//                 <li><em>Vitamin C</em> - Chống oxy hóa và làm sáng da</li>
//                 <li><em>Glutathione</em> - Chất chống oxy hóa mạnh, làm sáng da hiệu quả</li>
//                 <li><em>Alpha Arbutin</em> - Ức chế sản sinh melanin, làm mờ đốm nâu</li>
//                 <li><em>Niacinamide</em> - Làm đều màu da và giảm viêm</li>
//                 <li><em>Hyaluronic Acid</em> - Cấp ẩm không gây nhờn</li>
//                 <li><em>Peptide</em> - Kích thích tái tạo tế bào và làm sáng da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>90 phút</td>
//                         <td>800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>90 phút/lần</td>
//                         <td>3.600.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>90 phút/lần</td>
//                         <td>7.000.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp laser)</td>
//                         <td>120 phút</td>
//                         <td>1.200.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày, kể cả khi ở trong nhà</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
//                 <li>Sử dụng sản phẩm dưỡng da có chứa Vitamin C và Niacinamide</li>
//                 <li>Tránh sử dụng các sản phẩm có cồn hoặc gây kích ứng trong 48 giờ</li>
//                 <li>Duy trì chế độ ăn uống giàu chất chống oxy hóa</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Tránh trang điểm trong 24 giờ sau điều trị</li>
//             </ol>
            
//             <blockquote>
//                 "Sau khi trải qua liệu trình Cấy Tinh Chất Trắng Da tại Sparkle Salon, làn da của tôi đã trở nên sáng hơn và đều màu hơn rất nhiều. Các vết thâm nám cũng mờ đi đáng kể. Tôi rất hài lòng với kết quả!" - Khách hàng Ngọc Mai
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 12,
//         name: "Điều Trị Mụn Đầu Đen",
//         img: "https://i.ibb.co/cX1Jtv85/skin-treatment12.jpg",
//         price: 180000,
//         duration: "30 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Mụn Đầu Đen</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Mụn Đầu Đen</strong> tại Sparkle Salon giúp làm sạch sâu, loại bỏ mụn đầu đen và se khít lỗ chân lông, mang lại làn da sạch mịn và thông thoáng.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da có nhiều mụn đầu đen, lỗ chân lông to và da dầu, sử dụng công nghệ hiện đại và các thành phần kiểm soát dầu an toàn, hiệu quả.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt.</li>
//                 <li><strong>Xông Hơi</strong> - Giúp mở lỗ chân lông, làm mềm mụn đầu đen và chuẩn bị da cho bước hút mụn.</li>
//                 <li><strong>Hút Mụn Đầu Đen</strong> - Sử dụng công nghệ hiện đại để hút sạch mụn đầu đen mà không gây tổn thương da.</li>
//                 <li><strong>Thoa Tinh Chất Kiểm Soát Dầu</strong> - Sử dụng các tinh chất chứa Salicylic Acid, Niacinamide giúp kiểm soát dầu và ngăn ngừa mụn.</li>
//                 <li><strong>Đắp Mặt Nạ Thu Nhỏ Lỗ Chân Lông</strong> - Sử dụng mặt nạ đất sét hoặc than hoạt tính giúp se khít lỗ chân lông và kiểm soát dầu.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV và giữ ẩm cho da.</li>
//             </ul>
            
//             <h2>Công Nghệ Hút Mụn</h2>
            
//             <p>Chúng tôi sử dụng công nghệ hút mụn tiên tiến:</p>
            
//             <ul>
//                 <li>Máy hút mụn chân không với đầu hút chuyên biệt</li>
//                 <li>Áp suất điều chỉnh phù hợp với từng loại da</li>
//                 <li>Loại bỏ mụn đầu đen mà không gây tổn thương</li>
//                 <li>Kết hợp với tinh chất kháng khuẩn</li>
//                 <li>An toàn và hiệu quả cao</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Loại bỏ mụn đầu đen hiệu quả</li>
//                 <li>Se khít lỗ chân lông</li>
//                 <li>Kiểm soát dầu nhờn trên da</li>
//                 <li>Làm sạch sâu bên trong lỗ chân lông</li>
//                 <li>Ngăn ngừa mụn và viêm nhiễm</li>
//                 <li>Cải thiện kết cấu da</li>
//                 <li>Mang lại làn da sạch mịn, thông thoáng</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
//             <ul>
//                 <li><em>Salicylic Acid</em> - Thông thoáng lỗ chân lông và ngăn ngừa mụn</li>
//                 <li><em>Niacinamide</em> - Se khít lỗ chân lông và kiểm soát dầu</li>
//                 <li><em>Zinc PCA</em> - Điều tiết bã nhờn</li>
//                 <li><em>Đất sét Kaolin</em> - Hút dầu thừa và làm sạch sâu</li>
//                 <li><em>Than hoạt tính</em> - Hút độc tố và làm sạch sâu</li>
//                 <li><em>Chiết xuất tràm trà</em> - Kháng khuẩn và làm dịu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>30 phút</td>
//                         <td>180.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>30 phút/lần</td>
//                         <td>800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>30 phút/lần</td>
//                         <td>1.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp điện di)</td>
//                         <td>45 phút</td>
//                         <td>300.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Rửa mặt với sữa rửa mặt dành cho da dầu, không quá 2 lần/ngày</li>
//                 <li>Sử dụng toner không cồn để cân bằng độ pH</li>
//                 <li>Dùng kem dưỡng ẩm không dầu (oil-free)</li>
//                 <li>Sử dụng kem chống nắng dạng gel hoặc không dầu</li>
//                 <li>Tránh chạm tay lên mặt</li>
//                 <li>Tránh các thực phẩm cay nóng, nhiều dầu mỡ và đường</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã phải vật lộn với mụn đầu đen trong nhiều năm. Sau khi thử liệu trình điều trị tại Sparkle Salon, làn da của tôi đã cải thiện đáng kể. Mụn đầu đen giảm hẳn và lỗ chân lông nhỏ hơn rất nhiều." - Khách hàng Hồng Nhung
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 13,
//         name: "Điều Trị Mụn Viêm",
//         img: "https://i.ibb.co/rfwYrmNr/skin-treatment13.jpg",
//         price: 550000,
//         duration: "1 Giờ",
//         session: 2,
//         description: `
//             <h1>Điều Trị Mụn Viêm</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Mụn Viêm</strong> tại Sparkle Salon giúp giảm sưng viêm, tiêu diệt vi khuẩn gây mụn và phục hồi làn da, mang lại làn da khỏe mạnh và sạch mụn.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da bị mụn viêm, mụn mủ, mụn bọc và mụn nang, sử dụng công nghệ hiện đại và các thành phần kháng khuẩn, giảm viêm an toàn, hiệu quả.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt cho da mụn.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng tẩy tế bào chết nhẹ nhàng giúp loại bỏ tế bào chết và thông thoáng lỗ chân lông.</li>
//                 <li><strong>Xông Hơi</strong> - Giúp mở lỗ chân lông, làm mềm mụn và chuẩn bị da cho các bước tiếp theo.</li>
//                 <li><strong>Chấm Tinh Chất Kháng Khuẩn</strong> - Sử dụng các tinh chất chứa Tea Tree Oil, Salicylic Acid giúp kháng khuẩn và giảm viêm.</li>
//                 <li><strong>Áp Dụng Công Nghệ Ánh Sáng Sinh Học</strong> - Sử dụng ánh sáng xanh để tiêu diệt vi khuẩn P.acnes gây mụn.</li>
//                 <li><strong>Đắp Mặt Nạ Làm Dịu Da</strong> - Sử dụng mặt nạ chuyên biệt giúp làm dịu da, giảm viêm và phục hồi da.</li>
//                 <li><strong>Dưỡng Ẩm Phục Hồi</strong> - Sử dụng kem dưỡng ẩm không gây bít tắc lỗ chân lông, giúp phục hồi da.</li>
//             </ul>
            
//             <h2>Công Nghệ Ánh Sáng Sinh Học</h2>
            
//             <p>Chúng tôi sử dụng công nghệ ánh sáng sinh học tiên tiến:</p>
            
//             <ul>
//                 <li>Ánh sáng xanh (Blue Light) - Tiêu diệt vi khuẩn P.acnes gây mụn</li>
//                 <li>Ánh sáng đỏ (Red Light) - Giảm viêm và kích thích tái tạo da</li>
//                 <li>Không gây đau, không xâm lấn</li>
//                 <li>An toàn và hiệu quả cao</li>
//                 <li>Không gây kích ứng da</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Giảm sưng viêm và đỏ da</li>
//                 <li>Tiêu diệt vi khuẩn gây mụn</li>
//                 <li>Ngăn ngừa mụn mới hình thành</li>
//                 <li>Làm dịu và phục hồi da</li>
//                 <li>Giảm nguy cơ để lại sẹo</li>
//                 <li>Cải thiện kết cấu da</li>
//                 <li>Mang lại làn da khỏe mạnh, sạch mụn</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
//             <ul>
//                 <li><em>Tea Tree Oil</em> - Kháng khuẩn tự nhiên</li>
//                 <li><em>Salicylic Acid</em> - Thông thoáng lỗ chân lông và ngăn ngừa mụn</li>
//                 <li><em>Niacinamide</em> - Giảm viêm và làm dịu da</li>
//                 <li><em>Zinc PCA</em> - Điều tiết bã nhờn và giảm viêm</li>
//                 <li><em>Centella Asiatica</em> - Làm dịu và phục hồi da</li>
//                 <li><em>Aloe Vera</em> - Làm dịu và cấp ẩm cho da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>60 phút</td>
//                         <td>550.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>60 phút/lần</td>
//                         <td>2.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>60 phút/lần</td>
//                         <td>4.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp laser)</td>
//                         <td>90 phút</td>
//                         <td>800.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Rửa mặt với sữa rửa mặt dành cho da mụn, không quá 2 lần/ngày</li>
//                 <li>Sử dụng toner không cồn để cân bằng độ pH</li>
//                 <li>Dùng kem dưỡng ẩm không dầu (oil-free)</li>
//                 <li>Sử dụng kem chống nắng dạng gel hoặc không dầu</li>
//                 <li>Tránh chạm tay lên mặt</li>
//                 <li>Tránh các thực phẩm cay nóng, nhiều dầu mỡ và đường</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Không nặn mụn tại nhà</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã phải vật lộn với mụn viêm trong nhiều năm. Sau khi thử liệu trình điều trị tại Sparkle Salon, làn da của tôi đã cải thiện đáng kể. Mụn viêm giảm hẳn và da không còn đỏ, sưng như trước. Tôi rất hài lòng với kết quả!" - Khách hàng Minh Tú
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 14,
//         name: "Điều Trị Da Nhạy Cảm",
//         img: "https://i.ibb.co/rfwYrmNr/skin-treatment14.jpg",
//         price: 400000,
//         duration: "45 Phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Da Nhạy Cảm</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Da Nhạy Cảm</strong> tại Sparkle Salon được thiết kế đặc biệt để làm dịu, phục hồi và tăng cường hàng rào bảo vệ cho làn da nhạy cảm, dễ kích ứng.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình sử dụng các thành phần làm dịu, không gây kích ứng và công nghệ phục hồi tiên tiến, giúp làn da nhạy cảm trở nên khỏe mạnh và ít phản ứng hơn với các tác nhân bên ngoài.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Nhẹ Nhàng</strong> - Sử dụng sữa rửa mặt không xà phòng, không chứa SLS/SLES, giúp làm sạch mà không gây khô da.</li>
//                 <li><strong>Xịt Khoáng Làm Dịu</strong> - Sử dụng nước xịt khoáng giàu khoáng chất giúp làm dịu và cân bằng da.</li>
//                 <li><strong>Đắp Mặt Nạ Làm Dịu</strong> - Sử dụng mặt nạ chứa chiết xuất yến mạch, lô hội, và các thành phần làm dịu khác.</li>
//                 <li><strong>Massage Phục Hồi</strong> - Massage nhẹ nhàng với tinh dầu phục hồi giúp tăng cường tuần hoàn và nuôi dưỡng da.</li>
//                 <li><strong>Áp Dụng Serum Phục Hồi</strong> - Sử dụng serum chứa Ceramide, Panthenol và các thành phần phục hồi hàng rào bảo vệ da.</li>
//                 <li><strong>Dưỡng Ẩm Sâu</strong> - Sử dụng kem dưỡng ẩm không hương liệu, giúp khóa ẩm và bảo vệ da.</li>
//                 <li><strong>Chống Nắng Dịu Nhẹ</strong> - Kết thúc với kem chống nắng vật lý (physical sunscreen) không gây kích ứng.</li>
//             </ul>
            
//             <h2>Công Nghệ Phục Hồi Da</h2>
            
//             <p>Chúng tôi sử dụng các công nghệ tiên tiến để phục hồi da nhạy cảm:</p>
            
//             <ul>
//                 <li>Liệu pháp ánh sáng LED đỏ - Giảm viêm và kích thích tái tạo da</li>
//                 <li>Máy phun oxy - Cung cấp oxy và dưỡng chất sâu vào da</li>
//                 <li>Công nghệ siêu âm - Tăng cường thẩm thấu dưỡng chất</li>
//                 <li>Không sử dụng nhiệt hoặc các phương pháp xâm lấn</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm dịu da đỏ và kích ứng</li>
//                 <li>Giảm cảm giác châm chích, ngứa rát</li>
//                 <li>Tăng cường hàng rào bảo vệ da</li>
//                 <li>Cấp ẩm sâu và lâu dài</li>
//                 <li>Giảm nhạy cảm với các tác nhân bên ngoài</li>
//                 <li>Phục hồi da sau các tổn thương</li>
//                 <li>Cải thiện sức khỏe tổng thể của da</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất an toàn và hiệu quả:</p>
            
//             <ul>
//                 <li><em>Ceramide</em> - Phục hồi hàng rào bảo vệ da</li>
//                 <li><em>Panthenol (Pro-Vitamin B5)</em> - Làm dịu và phục hồi da</li>
//                 <li><em>Chiết xuất yến mạch (Oat Extract)</em> - Làm dịu và chống viêm</li>
//                 <li><em>Niacinamide</em> - Tăng cường hàng rào bảo vệ da</li>
//                 <li><em>Allantoin</em> - Làm dịu và kích thích tái tạo da</li>
//                 <li><em>Bisabolol</em> - Chống viêm và làm dịu</li>
//                 <li><em>Madecassoside</em> - Phục hồi và làm dịu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>45 phút</td>
//                         <td>400.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>45 phút/lần</td>
//                         <td>1.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>45 phút/lần</td>
//                         <td>3.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp oxy)</td>
//                         <td>60 phút</td>
//                         <td>600.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng sản phẩm làm sạch dịu nhẹ, không chứa xà phòng</li>
//                 <li>Tránh các sản phẩm chứa cồn, hương liệu và chất bảo quản mạnh</li>
//                 <li>Sử dụng kem chống nắng vật lý (physical/mineral sunscreen) hàng ngày</li>
//                 <li>Tránh tiếp xúc với nhiệt độ cao và thay đổi nhiệt độ đột ngột</li>
//                 <li>Tránh các sản phẩm tẩy tế bào chết mạnh</li>
//                 <li>Uống đủ nước và bổ sung các thực phẩm giàu omega-3</li>
//                 <li>Thông báo cho chuyên viên về bất kỳ phản ứng nào sau điều trị</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã thử rất nhiều phương pháp điều trị cho làn da nhạy cảm của mình nhưng chưa có kết quả. Sau khi điều trị tại Sparkle Salon, làn da của tôi đã bớt đỏ và ít phản ứng hơn với các sản phẩm. Tôi cảm thấy tự tin hơn rất nhiều với làn da của mình." - Khách hàng Thanh Hà
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 15,
//         name: "Thải Độc Da Bằng Than Hoạt Tính",
//         img: "https://i.ibb.co/cS8J7zN7/skin-treatment15.jpg",
//         price: 320000,
//         duration: "50 phút",
//         session: 2,
//         description: `
//             <h1>Thải Độc Da Bằng Than Hoạt Tính</h1>
            
//             <p>Dịch vụ <strong>Thải Độc Da Bằng Than Hoạt Tính</strong> tại Sparkle Salon giúp loại bỏ bụi bẩn, thanh lọc độc tố và kiểm soát dầu nhờn hiệu quả, mang lại làn da sạch sâu và rạng rỡ.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình sử dụng than hoạt tính cao cấp với khả năng hút độc tố mạnh mẽ, kết hợp với các thành phần làm sạch sâu và cân bằng da, đặc biệt phù hợp cho da dầu, da bị ô nhiễm và da thành thị.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng tẩy tế bào chết nhẹ nhàng giúp loại bỏ tế bào chết và chuẩn bị da cho các bước tiếp theo.</li>
//                 <li><strong>Xông Hơi</strong> - Giúp mở lỗ chân lông, chuẩn bị da tiếp nhận hiệu quả các bước điều trị tiếp theo.</li>
//                 <li><strong>Đắp Mặt Nạ Than Hoạt Tính</strong> - Sử dụng mặt nạ than hoạt tính cao cấp giúp hút sạch độc tố, bụi mịn và dầu thừa sâu trong lỗ chân lông.</li>
//                 <li><strong>Massage Thải Độc</strong> - Massage nhẹ nhàng với tinh dầu thải độc giúp kích thích tuần hoàn và tăng cường quá trình đào thải độc tố.</li>
//                 <li><strong>Đắp Mặt Nạ Cân Bằng</strong> - Sử dụng mặt nạ cân bằng giúp làm dịu da và phục hồi độ ẩm sau khi thải độc.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Kết thúc với kem dưỡng ẩm nhẹ và kem chống nắng bảo vệ da.</li>
//             </ul>
            
//             <h2>Công Nghệ Than Hoạt Tính</h2>
            
//             <p>Chúng tôi sử dụng than hoạt tính cao cấp với nhiều ưu điểm:</p>
            
//             <ul>
//                 <li>Than tre hoạt tính - Có khả năng hút độc tố gấp 200 lần trọng lượng của nó</li>
//                 <li>Công nghệ vi hạt - Giúp than thẩm thấu sâu vào lỗ chân lông</li>
//                 <li>Kết hợp với đất sét Bentonite - Tăng cường khả năng làm sạch</li>
//                 <li>Không chứa hóa chất độc hại, an toàn cho mọi loại da</li>
//                 <li>Được sản xuất bằng quy trình thân thiện với môi trường</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Loại bỏ độc tố và bụi mịn tích tụ trên da</li>
//                 <li>Hút sạch bã nhờn và dầu thừa</li>
//                 <li>Làm sạch sâu lỗ chân lông</li>
//                 <li>Ngăn ngừa mụn và giảm mụn đầu đen</li>
//                 <li>Làm đều màu da và tăng độ sáng</li>
//                 <li>Cân bằng độ ẩm và dầu trên da</li>
//                 <li>Mang lại cảm giác tươi mới và sạch sẽ</li>
//                 <li>Bảo vệ da khỏi tác động của ô nhiễm môi trường</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
//             <ul>
//                 <li><em>Than tre hoạt tính</em> - Hút độc tố và làm sạch sâu</li>
//                 <li><em>Đất sét Bentonite</em> - Hút dầu thừa và làm sạch lỗ chân lông</li>
//                 <li><em>Chiết xuất tràm trà</em> - Kháng khuẩn và kiểm soát dầu</li>
//                 <li><em>Zinc PCA</em> - Điều tiết bã nhờn</li>
//                 <li><em>Niacinamide</em> - Làm đều màu da và giảm viêm</li>
//                 <li><em>Chiết xuất rau má</em> - Làm dịu và phục hồi da</li>
//                 <li><em>Vitamin E</em> - Chống oxy hóa và bảo vệ da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>50 phút</td>
//                         <td>320.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>50 phút/lần</td>
//                         <td>1.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>50 phút/lần</td>
//                         <td>2.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp vitamin C)</td>
//                         <td>70 phút</td>
//                         <td>450.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Rửa mặt với sữa rửa mặt dịu nhẹ, không quá 2 lần/ngày</li>
//                 <li>Sử dụng toner không cồn để cân bằng độ pH</li>
//                 <li>Dùng kem dưỡng ẩm phù hợp với loại da</li>
//                 <li>Sử dụng kem chống nắng hàng ngày</li>
//                 <li>Tránh tiếp xúc với môi trường ô nhiễm trong 24 giờ sau điều trị</li>
//                 <li>Uống nhiều nước để hỗ trợ quá trình thải độc</li>
//                 <li>Thực hiện liệu trình 1-2 lần/tháng để duy trì hiệu quả</li>
//             </ol>
            
//             <blockquote>
//                 "Sau khi thử dịch vụ Thải Độc Da Bằng Than Hoạt Tính tại Sparkle Salon, tôi cảm thấy làn da mình như được 'thở' trở lại. Da sạch hơn, sáng hơn và các lỗ chân lông cũng thu nhỏ đáng kể. Đây sẽ là liệu trình tôi duy trì hàng tháng!" - Khách hàng Minh Anh
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 16,
//         name: "Điều Trị Da Khô",
//         img: "https://i.ibb.co/sdgRzjxh/skin-treatment16.png",
//         price: 280000,
//         duration: "40 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Da Khô</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Da Khô</strong> tại Sparkle Salon giúp cấp ẩm sâu, cải thiện độ đàn hồi và ngăn ngừa tình trạng bong tróc, khó chịu của làn da thiếu nước.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình được thiết kế đặc biệt cho làn da khô, thiếu nước, bong tróc hoặc có cảm giác căng rát, sử dụng các thành phần dưỡng ẩm chuyên sâu và công nghệ cấp nước tiên tiến.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Nhẹ Nhàng</strong> - Sử dụng sữa rửa mặt dạng kem không gây khô da, giúp loại bỏ bụi bẩn mà không làm mất đi lớp dầu tự nhiên.</li>
//                 <li><strong>Tẩy Tế Bào Chết Dịu Nhẹ</strong> - Sử dụng tẩy tế bào chết enzyme hoặc dạng hạt mịn, giúp loại bỏ tế bào chết mà không gây kích ứng.</li>
//                 <li><strong>Xông Hơi Ẩm</strong> - Xông hơi với tinh dầu dưỡng ẩm giúp làm mềm da và chuẩn bị da tiếp nhận dưỡng chất.</li>
//                 <li><strong>Massage Với Dầu Dưỡng</strong> - Massage nhẹ nhàng với dầu dưỡng giàu vitamin E và các acid béo thiết yếu, giúp phục hồi lớp lipid tự nhiên của da.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Ẩm Chuyên Sâu</strong> - Sử dụng mặt nạ giàu hyaluronic acid, ceramide và các thành phần giữ ẩm tự nhiên.</li>
//                 <li><strong>Thoa Tinh Chất Cấp Nước</strong> - Sử dụng serum cấp nước chứa nhiều lớp hyaluronic acid với các kích thước phân tử khác nhau để thẩm thấu vào các tầng da.</li>
//                 <li><strong>Dưỡng Ẩm Khóa Nước</strong> - Kết thúc với kem dưỡng ẩm giàu chất béo và chất tạo màng bảo vệ, giúp khóa ẩm và bảo vệ da.</li>
//             </ul>
            
//             <h2>Công Nghệ Cấp Ẩm</h2>
            
//             <p>Chúng tôi sử dụng các công nghệ cấp ẩm tiên tiến:</p>
            
//             <ul>
//                 <li>Công nghệ Hydra-Infusion - Đưa các phân tử nước và dưỡng chất vào sâu trong da</li>
//                 <li>Máy siêu âm - Tăng cường thẩm thấu của các thành phần dưỡng ẩm</li>
//                 <li>Liệu pháp oxy - Cung cấp oxy và dưỡng chất giúp tăng cường sản sinh collagen</li>
//                 <li>Công nghệ vi dòng điện - Kích thích tế bào da hoạt động và hấp thu dưỡng chất tốt hơn</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Cấp ẩm tức thì và kéo dài</li>
//                 <li>Giảm cảm giác căng rát, khó chịu</li>
//                 <li>Ngăn ngừa tình trạng bong tróc</li>
//                 <li>Cải thiện độ đàn hồi và mềm mại của da</li>
//                 <li>Tăng cường hàng rào bảo vệ tự nhiên của da</li>
//                 <li>Làm dịu các vùng da đỏ và kích ứng</li>
//                 <li>Giúp da sáng mịn và rạng rỡ hơn</li>
//                 <li>Tạo lớp nền hoàn hảo cho trang điểm</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất dưỡng ẩm hiệu quả:</p>
            
//             <ul>
//                 <li><em>Hyaluronic Acid</em> - Giữ nước gấp 1000 lần trọng lượng của nó</li>
//                 <li><em>Ceramide</em> - Phục hồi hàng rào bảo vệ da</li>
//                 <li><em>Glycerin</em> - Hút ẩm từ môi trường vào da</li>
//                 <li><em>Squalane</em> - Dưỡng ẩm tự nhiên, không gây bít tắc lỗ chân lông</li>
//                 <li><em>Vitamin E</em> - Chống oxy hóa và dưỡng ẩm</li>
//                 <li><em>Dầu Jojoba</em> - Cân bằng dầu tự nhiên của da</li>
//                 <li><em>Chiết xuất lô hội</em> - Làm dịu và cấp nước</li>
//                 <li><em>Panthenol</em> - Giữ ẩm và làm dịu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>40 phút</td>
//                         <td>280.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>40 phút/lần</td>
//                         <td>1.300.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>40 phút/lần</td>
//                         <td>2.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp oxy)</td>
//                         <td>60 phút</td>
//                         <td>450.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng sữa rửa mặt dạng kem hoặc dầu, không chứa sulfate</li>
//                 <li>Tránh tắm nước quá nóng</li>
//                 <li>Sử dụng serum dưỡng ẩm chứa hyaluronic acid</li>
//                 <li>Dùng kem dưỡng ẩm giàu chất béo sau khi rửa mặt</li>
//                 <li>Sử dụng máy tạo độ ẩm trong phòng ngủ</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Bổ sung omega-3 và vitamin E trong chế độ ăn</li>
//                 <li>Tránh các sản phẩm chứa cồn và hương liệu mạnh</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã phải chịu đựng làn da khô, bong tróc và thường xuyên cảm thấy căng rát. Sau khi thử liệu trình Điều Trị Da Khô tại Sparkle Salon, làn da của tôi đã thay đổi hoàn toàn. Da mềm mại, căng mọng và không còn cảm giác khó chịu nữa. Tôi rất hài lòng với kết quả!" - Khách hàng Thanh Thảo
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 17,
//         name: "Căng Bóng Da Hàn Quốc",
//         img: "https://i.ibb.co/0yHCq6Ym/skin-treatment17.jpg",
//         price: 650000,
//         duration: "80 phút",
//         session: 2,
//         description: `
//             <h1>Căng Bóng Da Hàn Quốc</h1>
            
//             <p>Dịch vụ <strong>Căng Bóng Da Hàn Quốc</strong> tại Sparkle Salon giúp da trở nên mịn màng, căng bóng và tràn đầy sức sống, mang đến vẻ đẹp rạng rỡ như các ngôi sao Hàn Quốc.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình kết hợp các phương pháp chăm sóc da truyền thống của Hàn Quốc với công nghệ hiện đại, giúp da căng mọng, sáng bóng tự nhiên và duy trì độ ẩm lâu dài.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Kép</strong> - Áp dụng phương pháp làm sạch kép của Hàn Quốc với dầu tẩy trang và sữa rửa mặt dịu nhẹ.</li>
//                 <li><strong>Xông Hơi</strong> - Xông hơi với tinh chất thảo dược giúp mở lỗ chân lông và chuẩn bị da tiếp nhận dưỡng chất.</li>
//                 <li><strong>Tẩy Tế Bào Chết Nhẹ Nhàng</strong> - Sử dụng phương pháp tẩy tế bào chết enzyme hoặc hạt mịn, giúp làm sáng da mà không gây tổn thương.</li>
//                 <li><strong>Cấy Tinh Chất HA</strong> - Sử dụng công nghệ siêu âm đưa tinh chất Hyaluronic Acid (HA) vào sâu trong da, giúp cấp nước và làm đầy các nếp nhăn.</li>
//                 <li><strong>Massage Nâng Cơ</strong> - Áp dụng kỹ thuật massage nâng cơ Hàn Quốc, kích thích tuần hoàn và tăng độ đàn hồi cho da.</li>
//                 <li><strong>Đắp Mặt Nạ Phục Hồi</strong> - Sử dụng mặt nạ giàu dưỡng chất như nhân sâm, collagen, peptide và các thành phần dưỡng ẩm cao cấp.</li>
//                 <li><strong>Thoa Kem Dưỡng Và Chống Nắng</strong> - Kết thúc với các lớp dưỡng da theo phong cách Hàn Quốc, bao gồm toner, essence, serum, kem dưỡng và kem chống nắng.</li>
//             </ul>
            
//             <h2>Công Nghệ Căng Bóng Da</h2>
            
//             <p>Chúng tôi sử dụng các công nghệ tiên tiến từ Hàn Quốc:</p>
            
//             <ul>
//                 <li>Công nghệ Aqua Peel - Làm sạch sâu và cấp nước đồng thời</li>
//                 <li>Máy siêu âm - Tăng cường thẩm thấu của các thành phần dưỡng ẩm</li>
//                 <li>Công nghệ Galvanic - Đẩy dưỡng chất vào sâu trong da</li>
//                 <li>Liệu pháp ánh sáng LED - Kích thích tái tạo collagen và làm sáng da</li>
//                 <li>Công nghệ Oxygen Infusion - Cung cấp oxy và dưỡng chất vào da</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Da căng mọng và rạng rỡ tức thì</li>
//                 <li>Cấp ẩm sâu và duy trì độ ẩm lâu dài</li>
//                 <li>Làm mờ nếp nhăn và dấu hiệu lão hóa</li>
//                 <li>Cải thiện kết cấu da, làm mịn bề mặt</li>
//                 <li>Làm sáng da và đều màu da</li>
//                 <li>Tăng độ đàn hồi và săn chắc</li>
//                 <li>Tạo hiệu ứng "Glass Skin" (làn da trong như thủy tinh)</li>
//                 <li>Hiệu quả kéo dài 2-3 tuần sau một lần điều trị</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất cao cấp từ Hàn Quốc:</p>
            
//             <ul>
//                 <li><em>Hyaluronic Acid đa phân tử</em> - Cấp ẩm ở nhiều tầng da khác nhau</li>
//                 <li><em>Chiết xuất nhân sâm</em> - Chống oxy hóa và tăng cường năng lượng cho da</li>
//                 <li><em>Peptide</em> - Kích thích sản sinh collagen</li>
//                 <li><em>Niacinamide</em> - Làm sáng da và đều màu da</li>
//                 <li><em>Adenosine</em> - Chống lão hóa và làm mờ nếp nhăn</li>
//                 <li><em>Chiết xuất tơ tằm</em> - Dưỡng ẩm và làm mềm da</li>
//                 <li><em>Ceramide</em> - Phục hồi hàng rào bảo vệ da</li>
//                 <li><em>Chiết xuất trà xanh</em> - Chống oxy hóa và làm dịu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>80 phút</td>
//                         <td>650.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>80 phút/lần</td>
//                         <td>3.000.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>80 phút/lần</td>
//                         <td>5.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp Aqua Peel)</td>
//                         <td>100 phút</td>
//                         <td>850.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để duy trì hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Áp dụng quy trình chăm sóc da nhiều bước theo phong cách Hàn Quốc</li>
//                 <li>Sử dụng kem chống nắng SPF50+ mỗi ngày</li>
//                 <li>Đắp mặt nạ giấy 2-3 lần/tuần</li>
//                 <li>Uống nhiều nước và bổ sung collagen</li>
//                 <li>Tránh tiếp xúc với ánh nắng mạnh</li>
//                 <li>Hạn chế trang điểm đậm trong 24 giờ sau điều trị</li>
//                 <li>Thực hiện liệu trình 2-3 tuần/lần để duy trì hiệu quả</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã thử rất nhiều phương pháp làm đẹp nhưng chưa có gì mang lại hiệu quả nhanh chóng như liệu trình Căng Bóng Da Hàn Quốc tại Sparkle Salon. Chỉ sau một lần điều trị, da tôi đã trở nên căng mọng, sáng bóng như được 'tiêm' nước vào da. Bạn bè ai cũng khen ngợi và hỏi bí quyết!" - Khách hàng Minh Tâm
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 18,
//         name: "Liệu Trình Collagen Trẻ Hóa",
//         img: "https://i.ibb.co/VYcF627p/skin-treatment18.jpg",
//         price: 750000,
//         duration: "85 phút",
//         session: 2,
//         description: `
//             <h1>Liệu Trình Collagen Trẻ Hóa</h1>
            
//             <p>Dịch vụ <strong>Liệu Trình Collagen Trẻ Hóa</strong> tại Sparkle Salon giúp cải thiện độ đàn hồi, giảm nếp nhăn và làm săn chắc da, mang lại vẻ trẻ trung và rạng rỡ cho làn da lão hóa.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình sử dụng collagen cao cấp kết hợp với công nghệ trẻ hóa tiên tiến, giúp kích thích sản sinh collagen tự nhiên, phục hồi cấu trúc da và làm chậm quá trình lão hóa.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt cho da lão hóa.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng tẩy tế bào chết enzyme giúp loại bỏ tế bào chết và kích thích tái tạo da mới.</li>
//                 <li><strong>Đắp Mặt Nạ Collagen</strong> - Sử dụng mặt nạ collagen tinh khiết giúp bổ sung collagen trực tiếp cho da.</li>
//                 <li><strong>Massage Thẩm Thấu</strong> - Massage chuyên sâu với kỹ thuật nâng cơ, giúp thẩm thấu dưỡng chất và cải thiện tuần hoàn máu.</li>
//                 <li><strong>Áp Dụng Công Nghệ Trẻ Hóa</strong> - Sử dụng công nghệ RF (sóng cao tần) hoặc siêu âm để kích thích sản sinh collagen tự nhiên.</li>
//                 <li><strong>Thoa Serum Collagen</strong> - Sử dụng serum giàu peptide và collagen thủy phân giúp tăng cường hiệu quả trẻ hóa.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Kết thúc với kem dưỡng ẩm chống lão hóa và kem chống nắng bảo vệ da.</li>
//             </ul>
            
//             <h2>Công Nghệ Trẻ Hóa</h2>
            
//             <p>Chúng tôi sử dụng các công nghệ trẻ hóa tiên tiến:</p>
            
//             <ul>
//                 <li>Công nghệ RF (Radio Frequency) - Kích thích sản sinh collagen tự nhiên</li>
//                 <li>Siêu âm - Tăng cường thẩm thấu dưỡng chất và tái cấu trúc da</li>
//                 <li>Ánh sáng LED đỏ - Kích thích tái tạo tế bào và tăng sinh collagen</li>
//                 <li>Microcurrent - Nâng cơ và săn chắc da</li>
//                 <li>Công nghệ Oxy - Tăng cường oxy hóa và trẻ hóa tế bào</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Cải thiện độ đàn hồi và săn chắc da</li>
//                 <li>Giảm nếp nhăn và đường nhăn</li>
//                 <li>Nâng cơ và chống chảy xệ</li>
//                 <li>Cải thiện kết cấu da, làm mịn bề mặt</li>
//                 <li>Tăng cường sản sinh collagen tự nhiên</li>
//                 <li>Làm sáng da và đều màu da</li>
//                 <li>Tăng cường tuần hoàn máu và trao đổi chất</li>
//                 <li>Hiệu quả kéo dài với liệu trình điều trị đều đặn</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất chống lão hóa hiệu quả:</p>
            
//             <ul>
//                 <li><em>Collagen thủy phân</em> - Bổ sung collagen và cải thiện độ đàn hồi</li>
//                 <li><em>Peptide</em> - Kích thích sản sinh collagen tự nhiên</li>
//                 <li><em>Retinol</em> - Tăng cường tái tạo tế bào và giảm nếp nhăn</li>
//                 <li><em>Vitamin C</em> - Chống oxy hóa và làm sáng da</li>
//                 <li><em>Acid Hyaluronic</em> - Cấp ẩm sâu và làm đầy nếp nhăn</li>
//                 <li><em>Coenzyme Q10</em> - Bảo vệ tế bào khỏi tổn thương oxy hóa</li>
//                 <li><em>Niacinamide</em> - Cải thiện hàng rào bảo vệ da và làm đều màu</li>
//                 <li><em>Chiết xuất tế bào gốc thực vật</em> - Kích thích tái tạo và phục hồi da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>85 phút</td>
//                         <td>750.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>85 phút/lần</td>
//                         <td>3.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>85 phút/lần</td>
//                         <td>6.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp RF)</td>
//                         <td>120 phút</td>
//                         <td>1.200.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF50+ mỗi ngày, kể cả khi ở trong nhà</li>
//                 <li>Duy trì chế độ dưỡng da chống lão hóa hàng ngày</li>
//                 <li>Bổ sung collagen qua chế độ ăn uống hoặc thực phẩm bổ sung</li>
//                 <li>Uống đủ nước và hạn chế rượu bia, thuốc lá</li>
//                 <li>Tránh tiếp xúc với ánh nắng mạnh</li>
//                 <li>Ngủ đủ giấc và giảm stress</li>
//                 <li>Thực hiện liệu trình đều đặn theo khuyến nghị của chuyên viên</li>
//                 <li>Tránh các sản phẩm chứa cồn và hương liệu mạnh</li>
//             </ol>
            
//             <blockquote>
//                 "Ở tuổi 45, tôi đã thấy rõ các dấu hiệu lão hóa trên da. Sau khi thực hiện Liệu Trình Collagen Trẻ Hóa tại Sparkle Salon, làn da của tôi đã cải thiện đáng kể. Các nếp nhăn mờ đi, da săn chắc hơn và tôi cảm thấy trẻ ra ít nhất 5 tuổi. Đây là liệu trình tuyệt vời mà tôi sẽ tiếp tục duy trì!" - Khách hàng Ngọc Anh
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 19,
//         name: "Tái Tạo Da Bằng Tế Bào Gốc",
//         img: "https://i.ibb.co/rG0SLBfS/skin-treatment19.jpg",
//         price: 900000,
//         duration: "95 phút",
//         session: 20,
//         description: `
//             <h1>Tái Tạo Da Bằng Tế Bào Gốc</h1>
            
//             <p>Dịch vụ <strong>Tái Tạo Da Bằng Tế Bào Gốc</strong> tại Sparkle Salon giúp phục hồi da, kích thích sản sinh collagen và làm sáng da, mang lại làn da trẻ trung, khỏe mạnh từ sâu bên trong.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình sử dụng công nghệ tế bào gốc tiên tiến, giúp tái tạo và phục hồi da từ cấp độ tế bào, đặc biệt hiệu quả cho da lão hóa, da tổn thương và da mất sức sống.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt.</li>
//                 <li><strong>Xông Hơi</strong> - Giúp giãn nở lỗ chân lông, chuẩn bị da tiếp nhận dưỡng chất tế bào gốc.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng tẩy tế bào chết enzyme giúp loại bỏ tế bào chết và kích thích tái tạo da mới.</li>
//                 <li><strong>Cấy Tinh Chất Tế Bào Gốc</strong> - Sử dụng công nghệ vi kim hoặc siêu âm để đưa tinh chất tế bào gốc vào sâu trong da.</li>
//                 <li><strong>Massage Thư Giãn</strong> - Massage chuyên sâu giúp thẩm thấu dưỡng chất và kích thích tuần hoàn máu.</li>
//                 <li><strong>Đắp Mặt Nạ Phục Hồi</strong> - Sử dụng mặt nạ giàu dưỡng chất tế bào gốc giúp tăng cường hiệu quả điều trị.</li>
//                 <li><strong>Dưỡng Ẩm và Bảo Vệ Da</strong> - Kết thúc với kem dưỡng ẩm và kem chống nắng bảo vệ da.</li>
//             </ul>
            
//             <h2>Công Nghệ Tế Bào Gốc</h2>
            
//             <p>Chúng tôi sử dụng các công nghệ tế bào gốc tiên tiến:</p>
            
//             <ul>
//                 <li>Công nghệ vi kim - Tạo các vi kênh giúp đưa tinh chất tế bào gốc vào sâu trong da</li>
//                 <li>Siêu âm - Tăng cường thẩm thấu dưỡng chất tế bào gốc</li>
//                 <li>Công nghệ Electroporation - Mở rộng kênh dẫn tế bào giúp tăng khả năng hấp thu</li>
//                 <li>Liệu pháp ánh sáng LED - Kích hoạt tế bào gốc và tăng cường hiệu quả</li>
//                 <li>Công nghệ Cryo - Làm lạnh da giúp se khít lỗ chân lông và cố định dưỡng chất</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Tái tạo và phục hồi da từ cấp độ tế bào</li>
//                 <li>Kích thích sản sinh collagen và elastin tự nhiên</li>
//                 <li>Làm mờ nếp nhăn và dấu hiệu lão hóa</li>
//                 <li>Cải thiện kết cấu da, làm mịn bề mặt</li>
//                 <li>Làm sáng da và đều màu da</li>
//                 <li>Tăng cường sức đề kháng của da</li>
//                 <li>Giảm sẹo và vết thâm</li>
//                 <li>Hiệu quả kéo dài và tích lũy qua mỗi lần điều trị</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất tế bào gốc cao cấp:</p>
            
//             <ul>
//                 <li><em>Chiết xuất tế bào gốc thực vật</em> - Kích thích tái tạo và phục hồi da</li>
//                 <li><em>Yếu tố tăng trưởng (Growth Factors)</em> - Thúc đẩy tái tạo tế bào</li>
//                 <li><em>Peptide tín hiệu</em> - Kích thích sản sinh collagen</li>
//                 <li><em>Cytokines</em> - Điều hòa quá trình tái tạo da</li>
//                 <li><em>Acid Hyaluronic</em> - Cấp ẩm sâu và làm đầy nếp nhăn</li>
//                 <li><em>Vitamin C ổn định</em> - Chống oxy hóa và làm sáng da</li>
//                 <li><em>Niacinamide</em> - Cải thiện hàng rào bảo vệ da và làm đều màu</li>
//                 <li><em>Ceramide</em> - Phục hồi hàng rào bảo vệ da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>95 phút</td>
//                         <td>900.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>95 phút/lần</td>
//                         <td>4.200.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>95 phút/lần</td>
//                         <td>8.000.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp vi kim)</td>
//                         <td>120 phút</td>
//                         <td>1.500.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF50+ mỗi ngày, kể cả khi ở trong nhà</li>
//                 <li>Tránh tiếp xúc với ánh nắng mạnh trong 48 giờ sau điều trị</li>
//                 <li>Không sử dụng các sản phẩm chứa acid (AHA, BHA) trong 24-48 giờ sau điều trị</li>
//                 <li>Duy trì chế độ dưỡng da phục hồi theo hướng dẫn của chuyên viên</li>
//                 <li>Uống đủ nước và bổ sung dinh dưỡng cần thiết</li>
//                 <li>Tránh trang điểm đậm trong 24 giờ sau điều trị</li>
//                 <li>Thực hiện liệu trình đều đặn theo khuyến nghị của chuyên viên</li>
//                 <li>Thông báo cho chuyên viên nếu có bất kỳ phản ứng bất thường nào</li>
//             </ol>
            
//             <blockquote>
//                 "Sau khi trải qua liệu trình Tái Tạo Da Bằng Tế Bào Gốc tại Sparkle Salon, tôi thực sự kinh ngạc với kết quả. Làn da của tôi không chỉ trở nên sáng hơn, mịn màng hơn mà còn có sức sống và độ đàn hồi như khi còn trẻ. Các vết thâm và nếp nhăn cũng mờ đi đáng kể. Đây là liệu trình đáng đầu tư nhất mà tôi từng thử!" - Khách hàng Hương Giang
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 20,
//         name: "Điều Trị Mụn Bằng Công Nghệ IPL",
//         img: "https://i.ibb.co/fYx4fDx9/skin-treatment25.jpg",
//         price: 950000,
//         duration: "110 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Mụn Bằng Công Nghệ IPL</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Mụn Bằng Công Nghệ IPL</strong> tại Sparkle Salon giúp tiêu diệt vi khuẩn gây mụn, giảm viêm và hạn chế tái phát, mang lại làn da sạch mụn, khỏe mạnh.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình sử dụng công nghệ IPL (Intense Pulsed Light) tiên tiến, kết hợp với các thành phần kháng khuẩn, giảm viêm, đặc biệt hiệu quả cho da mụn viêm, mụn bọc và mụn trứng cá.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch chuyên biệt cho da mụn.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng tẩy tế bào chết chứa BHA (Salicylic Acid) giúp thông thoáng lỗ chân lông.</li>
//                 <li><strong>Xông Hơi</strong> - Giúp lỗ chân lông thông thoáng, chuẩn bị da cho bước điều trị IPL.</li>
//                 <li><strong>Áp Dụng Công Nghệ IPL</strong> - Sử dụng ánh sáng xung cường độ cao để tiêu diệt vi khuẩn P.acnes gây mụn và giảm viêm.</li>
//                 <li><strong>Thoa Tinh Chất Kháng Khuẩn</strong> - Sử dụng serum chứa các thành phần kháng khuẩn và giảm viêm.</li>
//                 <li><strong>Đắp Mặt Nạ Làm Dịu và Phục Hồi</strong> - Sử dụng mặt nạ chuyên biệt giúp làm dịu da, giảm đỏ và phục hồi da sau điều trị.</li>
//                 <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Kết thúc với kem dưỡng ẩm không gây bít tắc lỗ chân lông và kem chống nắng bảo vệ da.</li>
//             </ul>
            
//             <h2>Công Nghệ IPL</h2>
            
//             <p>Công nghệ IPL (Intense Pulsed Light) mang lại nhiều ưu điểm trong điều trị mụn:</p>
            
//             <ul>
//                 <li>Tiêu diệt vi khuẩn P.acnes gây mụn mà không cần kháng sinh</li>
//                 <li>Giảm viêm và đỏ da hiệu quả</li>
//                 <li>Giảm sản xuất bã nhờn</li>
//                 <li>Kích thích tái tạo da và làm mờ vết thâm sau mụn</li>
//                 <li>Không xâm lấn, ít gây kích ứng</li>
//                 <li>Hiệu quả nhanh chóng và lâu dài</li>
//                 <li>An toàn cho hầu hết các loại da</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Giảm mụn viêm và mụn bọc hiệu quả</li>
//                 <li>Ngăn ngừa mụn mới hình thành</li>
//                 <li>Giảm đỏ và viêm da</li>
//                 <li>Làm mờ vết thâm sau mụn</li>
//                 <li>Cải thiện kết cấu da, làm mịn bề mặt</li>
//                 <li>Giảm sẹo rỗ và sẹo lõm</li>
//                 <li>Kiểm soát dầu nhờn</li>
//                 <li>Hiệu quả lâu dài và ít tác dụng phụ</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi kết hợp công nghệ IPL với các hoạt chất điều trị mụn hiệu quả:</p>
            
//             <ul>
//                 <li><em>Salicylic Acid</em> - Thông thoáng lỗ chân lông và ngăn ngừa mụn</li>
//                 <li><em>Niacinamide</em> - Giảm viêm và làm dịu da</li>
//                 <li><em>Tea Tree Oil</em> - Kháng khuẩn tự nhiên</li>
//                 <li><em>Zinc PCA</em> - Điều tiết bã nhờn và giảm viêm</li>
//                 <li><em>Centella Asiatica</em> - Làm dịu và phục hồi da</li>
//                 <li><em>Azelaic Acid</em> - Kháng khuẩn và làm mờ vết thâm</li>
//                 <li><em>Peptide chống viêm</em> - Giảm viêm và kích ứng</li>
//                 <li><em>Probiotics</em> - Cân bằng hệ vi sinh trên da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị cơ bản (1 lần)</td>
//                         <td>110 phút</td>
//                         <td>950.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>110 phút/lần</td>
//                         <td>4.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>110 phút/lần</td>
//                         <td>8.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp laser)</td>
//                         <td>140 phút</td>
//                         <td>1.500.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Tránh tiếp xúc với ánh nắng mạnh trong 48 giờ sau điều trị</li>
//                 <li>Sử dụng kem chống nắng SPF50+ mỗi ngày</li>
//                 <li>Không chạm tay lên mặt hoặc nặn mụn</li>
//                 <li>Sử dụng sản phẩm làm sạch dịu nhẹ</li>
//                 <li>Tránh các sản phẩm chứa retinol, AHA, BHA trong 24 giờ sau điều trị</li>
//                 <li>Tránh trang điểm đậm trong 24 giờ sau điều trị</li>
//                 <li>Uống đủ nước và tránh thực phẩm cay nóng, nhiều dầu mỡ</li>
//                 <li>Thực hiện liệu trình đều đặn theo khuyến nghị của chuyên viên</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã phải vật lộn với mụn viêm nhiều năm và đã thử nhiều phương pháp điều trị khác nhau. Sau khi thử liệu trình Điều Trị Mụn Bằng Công Nghệ IPL tại Sparkle Salon, làn da của tôi đã cải thiện đáng kể chỉ sau 3 lần điều trị. Mụn viêm giảm hẳn, da không còn đỏ và các vết thâm cũng mờ dần. Tôi rất hài lòng với kết quả và sẽ tiếp tục liệu trình này!" - Khách hàng Minh Tuấn
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 21,
//         name: "Chăm Sóc Da Mặt Cơ Bản",
//         img: "https://i.ibb.co/Lbxv4wS/skin-treatment26.jpg",
//         price: 180000,
//         duration: "30 phút",
//         session: 2,
//         description: `
//             <h1>Chăm Sóc Da Mặt Cơ Bản</h1>
            
//             <p>Dịch vụ <strong>Chăm Sóc Da Mặt Cơ Bản</strong> tại Sparkle Salon giúp làm sạch sâu, cấp ẩm nhẹ nhàng và giữ da luôn khỏe mạnh, phù hợp cho mọi loại da và mọi lứa tuổi.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình chăm sóc da cơ bản nhưng hiệu quả, giúp làm sạch sâu, loại bỏ tế bào chết và cung cấp dưỡng chất cần thiết, mang lại làn da tươi mới, rạng rỡ.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Sử dụng sữa rửa mặt phù hợp với từng loại da, loại bỏ bụi bẩn, dầu thừa và trang điểm.</li>
//                 <li><strong>Tẩy Tế Bào Chết Nhẹ Nhàng</strong> - Sử dụng tẩy tế bào chết dịu nhẹ giúp loại bỏ tế bào chết và làm sáng da.</li>
//                 <li><strong>Hút Mụn Cám (Nếu Cần)</strong> - Loại bỏ mụn cám và mụn đầu đen nhẹ nhàng, không gây tổn thương da.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Ẩm</strong> - Sử dụng mặt nạ phù hợp với từng loại da, cung cấp dưỡng chất và độ ẩm cần thiết.</li>
//                 <li><strong>Massage Thư Giãn</strong> - Massage nhẹ nhàng giúp thư giãn, kích thích tuần hoàn máu và tăng cường hấp thu dưỡng chất.</li>
//                 <li><strong>Dưỡng Ẩm</strong> - Sử dụng kem dưỡng ẩm phù hợp với từng loại da, giúp khóa ẩm và bảo vệ da.</li>
//                 <li><strong>Bảo Vệ Da</strong> - Kết thúc với kem chống nắng bảo vệ da khỏi tác nhân môi trường.</li>
//             </ul>
            
//             <h2>Phù Hợp Cho</h2>
            
//             <ul>
//                 <li>Mọi loại da (da thường, da khô, da dầu, da hỗn hợp)</li>
//                 <li>Người mới bắt đầu chăm sóc da</li>
//                 <li>Người cần làm sạch da định kỳ</li>
//                 <li>Người có lịch trình bận rộn (liệu trình ngắn)</li>
//                 <li>Người muốn duy trì làn da khỏe mạnh</li>
//                 <li>Người chuẩn bị cho các sự kiện đặc biệt</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm sạch sâu lỗ chân lông</li>
//                 <li>Loại bỏ tế bào chết và làm sáng da</li>
//                 <li>Cấp ẩm và nuôi dưỡng da</li>
//                 <li>Cải thiện kết cấu da, làm mịn bề mặt</li>
//                 <li>Tăng cường tuần hoàn máu</li>
//                 <li>Giảm stress và thư giãn</li>
//                 <li>Chuẩn bị da tốt hơn cho trang điểm</li>
//                 <li>Duy trì làn da khỏe mạnh</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất an toàn và hiệu quả:</p>
            
//             <ul>
//                 <li><em>Chiết xuất thảo dược</em> - Làm dịu và nuôi dưỡng da</li>
//                 <li><em>Vitamin E</em> - Chống oxy hóa và bảo vệ da</li>
//                 <li><em>Acid Hyaluronic</em> - Cấp ẩm sâu</li>
//                 <li><em>Aloe Vera</em> - Làm dịu và cấp nước</li>
//                 <li><em>Glycerin</em> - Giữ ẩm tự nhiên</li>
//                 <li><em>Panthenol</em> - Làm dịu và phục hồi da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Chăm sóc cơ bản (1 lần)</td>
//                         <td>30 phút</td>
//                         <td>180.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói 5 lần</td>
//                         <td>30 phút/lần</td>
//                         <td>800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói 10 lần</td>
//                         <td>30 phút/lần</td>
//                         <td>1.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói gia đình (3 người)</td>
//                         <td>30 phút/người</td>
//                         <td>450.000</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để duy trì hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng hàng ngày</li>
//                 <li>Rửa mặt sạch sẽ trước khi đi ngủ</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Tránh chạm tay lên mặt</li>
//                 <li>Thực hiện chăm sóc da cơ bản 2-4 tuần/lần</li>
//                 <li>Sử dụng sản phẩm dưỡng da phù hợp với loại da</li>
//             </ol>
            
//             <blockquote>
//                 "Dịch vụ Chăm Sóc Da Mặt Cơ Bản tại Sparkle Salon là lựa chọn hoàn hảo cho lịch trình bận rộn của tôi. Chỉ với 30 phút, làn da của tôi được làm sạch sâu, cấp ẩm và trở nên tươi tắn hơn. Các chuyên viên rất tận tâm và hiểu rõ nhu cầu của da tôi. Tôi thường xuyên sử dụng dịch vụ này mỗi tháng để duy trì làn da khỏe mạnh." - Khách hàng Thanh Mai
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 22,
//         name: "Chăm Sóc Da Chuyên Sâu",
//         img: "https://i.ibb.co/Rkyqd87G/skin-treatment27.jpg",
//         price: 350000,
//         duration: "70 phút",
//         session: 2,
//         description: `
//             <h1>Chăm Sóc Da Chuyên Sâu</h1>
            
//             <p>Dịch vụ <strong>Chăm Sóc Da Chuyên Sâu</strong> tại Sparkle Salon là liệu trình toàn diện giúp cải thiện kết cấu da, cấp ẩm sâu và tái tạo làn da khỏe mạnh từ bên trong.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình chăm sóc chuyên sâu kết hợp các kỹ thuật làm sạch, dưỡng chất cao cấp và công nghệ hiện đại, mang lại hiệu quả vượt trội so với chăm sóc cơ bản.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Kép</strong> - Sử dụng phương pháp làm sạch kép với dầu tẩy trang và sữa rửa mặt chuyên sâu.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Loại bỏ tế bào chết với công thức chuyên biệt phù hợp với từng loại da.</li>
//                 <li><strong>Xông Hơi</strong> - Mở rộng lỗ chân lông, chuẩn bị cho quá trình làm sạch sâu.</li>
//                 <li><strong>Hút Dầu Thừa & Làm Sạch Sâu</strong> - Loại bỏ bã nhờn, mụn cám và tạp chất sâu trong lỗ chân lông.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Chất Chuyên Sâu</strong> - Sử dụng mặt nạ cao cấp với dưỡng chất đặc trị phù hợp với tình trạng da.</li>
//                 <li><strong>Massage Nâng Cơ</strong> - Kỹ thuật massage chuyên nghiệp giúp thư giãn, kích thích tuần hoàn và nâng cơ mặt.</li>
//                 <li><strong>Thoa Tinh Chất Đặc Trị</strong> - Sử dụng serum cao cấp với nồng độ hoạt chất cao, đáp ứng nhu cầu đặc biệt của da.</li>
//                 <li><strong>Dưỡng Ẩm Chuyên Sâu</strong> - Sử dụng kem dưỡng ẩm cao cấp, khóa ẩm và tăng cường hàng rào bảo vệ da.</li>
//                 <li><strong>Bảo Vệ Da</strong> - Kết thúc với kem chống nắng phổ rộng, bảo vệ da khỏi tác hại của tia UV.</li>
//             </ul>
            
//             <h2>Phù Hợp Cho</h2>
            
//             <ul>
//                 <li>Da cần được chăm sóc chuyên sâu</li>
//                 <li>Da thiếu sức sống, xỉn màu</li>
//                 <li>Da có dấu hiệu lão hóa sớm</li>
//                 <li>Da stress, mệt mỏi</li>
//                 <li>Da không đều màu, có vết thâm nhẹ</li>
//                 <li>Người chuẩn bị cho sự kiện quan trọng</li>
//                 <li>Người muốn tái tạo làn da toàn diện</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm sạch sâu và loại bỏ tạp chất</li>
//                 <li>Cấp ẩm chuyên sâu, phục hồi độ đàn hồi</li>
//                 <li>Cải thiện kết cấu da, làm mịn bề mặt</li>
//                 <li>Làm sáng da, cải thiện tông màu</li>
//                 <li>Giảm dấu hiệu lão hóa sớm</li>
//                 <li>Kích thích tái tạo tế bào da</li>
//                 <li>Tăng cường hàng rào bảo vệ tự nhiên</li>
//                 <li>Giảm stress và căng thẳng</li>
//                 <li>Cải thiện đường nét khuôn mặt</li>
//             </ul>
            
//             <h3>Công Nghệ & Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các công nghệ và hoạt chất cao cấp:</p>
            
//             <ul>
//                 <li><em>Công nghệ Hydradermabrasion</em> - Làm sạch sâu và cấp ẩm đồng thời</li>
//                 <li><em>Peptide phức hợp</em> - Kích thích tái tạo collagen</li>
//                 <li><em>Acid Hyaluronic phân tử thấp</em> - Cấp ẩm sâu đến các lớp biểu bì</li>
//                 <li><em>Vitamin C ổn định</em> - Làm sáng và chống oxy hóa</li>
//                 <li><em>Chiết xuất tế bào gốc thực vật</em> - Tái tạo và phục hồi</li>
//                 <li><em>Ceramide</em> - Tăng cường hàng rào bảo vệ da</li>
//                 <li><em>Niacinamide</em> - Cân bằng dầu và làm đều màu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Chăm sóc chuyên sâu (1 lần)</td>
//                         <td>70 phút</td>
//                         <td>350.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói 5 lần</td>
//                         <td>70 phút/lần</td>
//                         <td>1.600.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói 10 lần</td>
//                         <td>70 phút/lần</td>
//                         <td>3.000.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói VIP (kết hợp mặt nạ vàng 24K)</td>
//                         <td>90 phút</td>
//                         <td>500.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để duy trì hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 30+ hàng ngày</li>
//                 <li>Duy trì quy trình chăm sóc da hàng ngày (làm sạch, toner, serum, dưỡng ẩm)</li>
//                 <li>Uống đủ nước (2-3 lít/ngày)</li>
//                 <li>Tránh tiếp xúc với ánh nắng mạnh trong 24 giờ sau điều trị</li>
//                 <li>Không sử dụng các sản phẩm chứa acid trong 48 giờ sau điều trị</li>
//                 <li>Thực hiện chăm sóc da chuyên sâu 4-6 tuần/lần</li>
//                 <li>Bổ sung thực phẩm giàu chất chống oxy hóa</li>
//             </ol>
            
//             <blockquote>
//                 "Liệu trình Chăm Sóc Da Chuyên Sâu tại Sparkle Salon đã thực sự làm thay đổi làn da của tôi. Sau 5 lần điều trị, làn da của tôi trở nên căng mịn, sáng đều màu và khỏe mạnh hơn rất nhiều. Các kỹ thuật viên rất chuyên nghiệp và tận tâm, họ hiểu rõ tình trạng da của tôi và đưa ra những giải pháp phù hợp. Tôi đặc biệt thích phần massage nâng cơ, vừa thư giãn vừa hiệu quả. Đây là khoản đầu tư xứng đáng cho làn da của tôi!" - Khách hàng Minh Tâm
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 23,
//         name: "Điều Trị Thâm Mụn",
//         img: "https://i.ibb.co/rRdLJj1S/skin-treatment23.jpg",
//         price: 400000,
//         duration: "45 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Thâm Mụn</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Thâm Mụn</strong> tại Sparkle Salon giúp làm mờ vết thâm, đều màu da và kích thích tái tạo tế bào mới, mang lại làn da tươi sáng và đồng đều.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình sử dụng các hoạt chất làm sáng da an toàn, kết hợp công nghệ hiện đại giúp đẩy nhanh quá trình tái tạo da và làm mờ vết thâm hiệu quả.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Sử dụng sữa rửa mặt chuyên biệt, loại bỏ bụi bẩn và tế bào chết trên bề mặt da.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng tẩy tế bào chết chuyên biệt giúp loại bỏ lớp tế bào sừng, làm mịn da và chuẩn bị cho quá trình hấp thụ dưỡng chất.</li>
//                 <li><strong>Xông Hơi</strong> - Giúp mở rộng lỗ chân lông, tăng cường khả năng hấp thụ dưỡng chất của da.</li>
//                 <li><strong>Sử Dụng Tinh Chất Trị Thâm</strong> - Thoa đều tinh chất chứa các hoạt chất làm sáng da như Vitamin C, Arbutin, Niacinamide lên vùng da bị thâm.</li>
//                 <li><strong>Massage Thẩm Thấu</strong> - Kỹ thuật massage chuyên biệt giúp tinh chất thẩm thấu sâu vào da, tăng cường hiệu quả điều trị.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Sáng Da</strong> - Sử dụng mặt nạ chuyên biệt giúp làm sáng da, mờ thâm và cấp ẩm.</li>
//                 <li><strong>Dưỡng Ẩm</strong> - Sử dụng kem dưỡng ẩm phù hợp, giúp khóa ẩm và dưỡng chất.</li>
//                 <li><strong>Bảo Vệ Da</strong> - Kết thúc với kem chống nắng, bảo vệ da khỏi tác động của tia UV và môi trường.</li>
//             </ul>
            
//             <h2>Phù Hợp Cho</h2>
            
//             <ul>
//                 <li>Da có vết thâm sau mụn</li>
//                 <li>Da không đều màu</li>
//                 <li>Da xỉn màu, thiếu sức sống</li>
//                 <li>Da có đốm nâu, tàn nhang nhẹ</li>
//                 <li>Da cần làm sáng và đều màu</li>
//                 <li>Người muốn cải thiện tông màu da</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm mờ vết thâm sau mụn</li>
//                 <li>Cải thiện tông màu da</li>
//                 <li>Làm đều màu da</li>
//                 <li>Kích thích tái tạo tế bào mới</li>
//                 <li>Làm sáng da tự nhiên</li>
//                 <li>Cấp ẩm và nuôi dưỡng da</li>
//                 <li>Tăng cường hàng rào bảo vệ da</li>
//                 <li>Ngăn ngừa sự hình thành vết thâm mới</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
//             <ul>
//                 <li><em>Vitamin C</em> - Chống oxy hóa và làm sáng da</li>
//                 <li><em>Niacinamide</em> - Làm đều màu da và giảm viêm</li>
//                 <li><em>Arbutin</em> - Ức chế sản sinh melanin</li>
//                 <li><em>Alpha Arbutin</em> - Làm mờ vết thâm hiệu quả</li>
//                 <li><em>Tranexamic Acid</em> - Giảm sắc tố và làm sáng da</li>
//                 <li><em>Licorice Extract</em> - Làm dịu và làm sáng da</li>
//                 <li><em>Azelaic Acid</em> - Giảm viêm và làm đều màu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị thâm mụn cơ bản (1 lần)</td>
//                         <td>45 phút</td>
//                         <td>400.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>45 phút/lần</td>
//                         <td>1.800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 10 lần</td>
//                         <td>45 phút/lần</td>
//                         <td>3.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp công nghệ ánh sáng)</td>
//                         <td>60 phút</td>
//                         <td>600.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
//                 <li>Không sử dụng các sản phẩm có chứa cồn hoặc gây kích ứng</li>
//                 <li>Duy trì chế độ dưỡng ẩm đầy đủ</li>
//                 <li>Tránh nặn mụn để ngăn ngừa vết thâm mới</li>
//                 <li>Thực hiện liệu trình đều đặn theo khuyến nghị của chuyên viên</li>
//                 <li>Bổ sung vitamin C và E trong chế độ ăn uống</li>
//             </ol>
            
//             <blockquote>
//                 "Sau khi trải qua liệu trình Điều Trị Thâm Mụn tại Sparkle Salon, làn da của tôi đã cải thiện rõ rệt. Những vết thâm sau mụn đã mờ đi đáng kể, da sáng và đều màu hơn. Tôi đặc biệt ấn tượng với sự chuyên nghiệp của các kỹ thuật viên và hiệu quả của các sản phẩm được sử dụng. Giờ đây tôi tự tin hơn rất nhiều với làn da của mình." - Khách hàng Minh Anh
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 24,
//         name: "Điều Trị Nám Tàn Nhang Bằng Laser",
//         img: "https://i.ibb.co/0y1TmyWZ/skin-treatment24.webp",
//         price: 1200000,
//         duration: "120 phút",
//         session: 20,
//         description: `
//             <h1>Điều Trị Nám Tàn Nhang Bằng Laser</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Nám Tàn Nhang Bằng Laser</strong> tại Sparkle Salon sử dụng công nghệ laser tiên tiến giúp phá vỡ sắc tố sạm nám, làm sáng da và ngăn ngừa tái phát hiệu quả.</p>
            
//             <div class="highlight-box">
//                 <p>Công nghệ laser hiện đại nhắm trúng đích sắc tố melanin, phá vỡ các đốm nám và tàn nhang mà không gây tổn thương cho các mô xung quanh, mang lại hiệu quả vượt trội so với các phương pháp điều trị truyền thống.</p>
//             </div>
            
//             <h2>Công Nghệ Laser Tiên Tiến</h2>
            
//             <p>Chúng tôi sử dụng công nghệ laser Q-switched và Pico laser thế hệ mới nhất, được chứng minh lâm sàng về hiệu quả trong việc điều trị nám, tàn nhang và các vấn đề về sắc tố da:</p>
            
//             <ul>
//                 <li>Tạo xung laser cực ngắn (picosecond hoặc nanosecond)</li>
//                 <li>Nhắm mục tiêu chính xác vào sắc tố melanin</li>
//                 <li>Phá vỡ các hạt sắc tố thành các phần nhỏ hơn</li>
//                 <li>Kích thích quá trình tái tạo collagen</li>
//                 <li>Giảm thiểu tổn thương nhiệt cho da</li>
//                 <li>An toàn cho mọi loại da</li>
//             </ul>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Tư Vấn & Đánh Giá Da</strong> - Chuyên viên đánh giá tình trạng da và xác định loại nám, tàn nhang để lên phương pháp điều trị phù hợp.</li>
//                 <li><strong>Làm Sạch Da</strong> - Sử dụng sản phẩm làm sạch chuyên biệt, loại bỏ bụi bẩn và dầu thừa.</li>
//                 <li><strong>Ủ Tê (Nếu Cần)</strong> - Sử dụng kem gây tê tại chỗ để giảm thiểu cảm giác khó chịu trong quá trình điều trị.</li>
//                 <li><strong>Bảo Vệ Mắt</strong> - Đeo kính bảo vệ chuyên dụng để bảo vệ mắt khỏi tia laser.</li>
//                 <li><strong>Điều Trị Bằng Laser</strong> - Sử dụng công nghệ laser hiện đại để nhắm mục tiêu vào các vùng da bị nám và tàn nhang.</li>
//                 <li><strong>Làm Dịu Da</strong> - Sử dụng tinh chất làm dịu và phục hồi da sau điều trị.</li>
//                 <li><strong>Đắp Mặt Nạ Phục Hồi</strong> - Sử dụng mặt nạ chuyên biệt giúp làm dịu, phục hồi và cấp ẩm cho da.</li>
//                 <li><strong>Dưỡng Ẩm</strong> - Sử dụng kem dưỡng ẩm phục hồi chuyên sâu.</li>
//                 <li><strong>Chống Nắng</strong> - Thoa kem chống nắng phổ rộng để bảo vệ da sau điều trị.</li>
//             </ul>
            
//             <h2>Phù Hợp Cho</h2>
            
//             <ul>
//                 <li>Da bị nám sâu, nám hỗn hợp</li>
//                 <li>Da có nhiều tàn nhang</li>
//                 <li>Da có đốm nâu do tổn thương ánh nắng</li>
//                 <li>Da không đều màu, sạm màu</li>
//                 <li>Người đã thử nhiều phương pháp điều trị nám không hiệu quả</li>
//                 <li>Người muốn kết quả nhanh chóng và lâu dài</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm mờ và loại bỏ nám, tàn nhang hiệu quả</li>
//                 <li>Cải thiện tông màu da tổng thể</li>
//                 <li>Làm đều màu da</li>
//                 <li>Kích thích tái tạo collagen</li>
//                 <li>Làm sáng da tự nhiên</li>
//                 <li>Cải thiện kết cấu da</li>
//                 <li>Hiệu quả lâu dài</li>
//                 <li>Giảm thiểu nguy cơ tái phát</li>
//                 <li>Phục hồi làn da khỏe mạnh</li>
//             </ul>
            
//             <h3>Kết Hợp Hoạt Chất Sau Điều Trị</h3>
            
//             <p>Sau điều trị laser, chúng tôi sử dụng các hoạt chất đặc trị để tăng cường hiệu quả:</p>
            
//             <ul>
//                 <li><em>Tranexamic Acid</em> - Ức chế quá trình tạo melanin</li>
//                 <li><em>Vitamin C ổn định</em> - Chống oxy hóa và làm sáng da</li>
//                 <li><em>Glutathione</em> - Làm sáng da và chống oxy hóa mạnh</li>
//                 <li><em>Alpha Arbutin</em> - Ức chế enzyme tyrosinase, giảm sản xuất melanin</li>
//                 <li><em>Niacinamide</em> - Làm đều màu da và tăng cường hàng rào bảo vệ</li>
//                 <li><em>Peptide phức hợp</em> - Kích thích tái tạo tế bào và phục hồi da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị nám tàn nhang bằng laser (1 lần)</td>
//                         <td>120 phút</td>
//                         <td>1.200.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 3 lần</td>
//                         <td>120 phút/lần</td>
//                         <td>3.400.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>120 phút/lần</td>
//                         <td>5.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp tiêm trắng da)</td>
//                         <td>150 phút</td>
//                         <td>1.800.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu và tránh biến chứng, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 50+ PA++++ mỗi ngày, bất kể thời tiết</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời trong ít nhất 2 tuần sau điều trị</li>
//                 <li>Không sử dụng các sản phẩm chứa retinol, AHA, BHA trong 1 tuần sau điều trị</li>
//                 <li>Duy trì chế độ dưỡng ẩm đầy đủ</li>
//                 <li>Tránh trang điểm trong 24-48 giờ sau điều trị</li>
//                 <li>Không tắm nước nóng, xông hơi hoặc bơi lội trong 48 giờ sau điều trị</li>
//                 <li>Thực hiện liệu trình đều đặn theo khuyến nghị của chuyên viên</li>
//                 <li>Bổ sung thực phẩm giàu chất chống oxy hóa</li>
//                 <li>Tránh các thực phẩm cay nóng, rượu bia trong thời gian điều trị</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã phải vật lộn với nám da nhiều năm và đã thử nhiều phương pháp khác nhau nhưng không hiệu quả. Sau khi điều trị nám bằng laser tại Sparkle Salon, làn da của tôi đã thay đổi hoàn toàn. Các đốm nám đã mờ đi đáng kể chỉ sau 3 lần điều trị, và tông màu da của tôi trở nên đều màu và tươi sáng hơn. Các chuyên viên rất tận tâm và chuyên nghiệp, luôn giải thích rõ ràng về quy trình và cách chăm sóc da sau điều trị. Tôi rất hài lòng với kết quả và sẽ tiếp tục sử dụng dịch vụ tại đây." - Khách hàng Thanh Hương
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 25,
//         name: "Điều Trị Mụn Bằng Công Nghệ IPL",
//         img: "https://i.ibb.co/fYx4fDx9/skin-treatment25.jpg",
//         price: 950000,
//         duration: "110 phút",
//         session: 2,
//         description: `
//             <h1>Điều Trị Mụn Bằng Công Nghệ IPL</h1>
            
//             <p>Dịch vụ <strong>Điều Trị Mụn Bằng Công Nghệ IPL</strong> tại Sparkle Salon kết hợp ánh sáng xung cường độ cao (IPL) với các thành phần kháng khuẩn, giúp tiêu diệt vi khuẩn gây mụn, giảm viêm và hạn chế tái phát, mang lại làn da sạch mụn, khỏe mạnh.</p>
            
//             <div class="highlight-box">
//                 <p>Công nghệ IPL tiên tiến kết hợp với các thành phần kháng khuẩn mạnh mẽ, không chỉ điều trị mụn hiện tại mà còn ngăn ngừa mụn mới hình thành, mang lại làn da sạch mụn, khỏe mạnh lâu dài.</p>
//             </div>
            
//             <h2>Công Nghệ IPL Trong Điều Trị Mụn</h2>
            
//             <p>IPL (Intense Pulsed Light - Ánh sáng xung cường độ cao) là công nghệ không xâm lấn, sử dụng ánh sáng có bước sóng đặc biệt để:</p>
            
//             <ul>
//                 <li>Tiêu diệt vi khuẩn P.acnes - nguyên nhân chính gây mụn</li>
//                 <li>Giảm viêm và đỏ tại vùng da bị mụn</li>
//                 <li>Thu nhỏ tuyến bã nhờn, giảm tiết dầu</li>
//                 <li>Kích thích tái tạo collagen, cải thiện sẹo mụn</li>
//                 <li>Làm đều màu da, giảm thâm sau mụn</li>
//                 <li>An toàn, không gây kích ứng hoặc bong tróc da</li>
//             </ul>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Tư Vấn & Đánh Giá Da</strong> - Chuyên viên đánh giá tình trạng da, loại mụn và mức độ nghiêm trọng để lên phương pháp điều trị phù hợp.</li>
//                 <li><strong>Làm Sạch Da</strong> - Sử dụng sản phẩm làm sạch chuyên biệt cho da mụn, loại bỏ bụi bẩn và dầu thừa.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Loại bỏ tế bào chết, làm thông thoáng lỗ chân lông.</li>
//                 <li><strong>Xông Hơi</strong> - Giúp lỗ chân lông mở rộng, chuẩn bị cho quá trình điều trị.</li>
//                 <li><strong>Điều Trị Bằng IPL</strong> - Sử dụng công nghệ IPL để tiêu diệt vi khuẩn gây mụn và giảm viêm.</li>
//                 <li><strong>Đắp Gel Kháng Khuẩn</strong> - Sử dụng gel chứa các thành phần kháng khuẩn để tăng cường hiệu quả điều trị.</li>
//                 <li><strong>Đắp Mặt Nạ Làm Dịu</strong> - Sử dụng mặt nạ chuyên biệt giúp làm dịu, giảm đỏ và phục hồi da sau điều trị.</li>
//                 <li><strong>Dưỡng Ẩm</strong> - Sử dụng kem dưỡng ẩm không gây bít tắc lỗ chân lông.</li>
//                 <li><strong>Chống Nắng</strong> - Thoa kem chống nắng dạng gel không gây bít tắc lỗ chân lông.</li>
//             </ul>
            
//             <h2>Phù Hợp Cho</h2>
            
//             <ul>
//                 <li>Da bị mụn viêm, mụn bọc</li>
//                 <li>Da bị mụn tái phát thường xuyên</li>
//                 <li>Da bị mụn kháng trị với các phương pháp thông thường</li>
//                 <li>Da dầu, lỗ chân lông to</li>
//                 <li>Da có thâm sau mụn</li>
//                 <li>Người muốn điều trị mụn không xâm lấn</li>
//                 <li>Người muốn kết quả nhanh chóng và lâu dài</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Tiêu diệt vi khuẩn gây mụn hiệu quả</li>
//                 <li>Giảm viêm và đỏ tại vùng da bị mụn</li>
//                 <li>Giảm tiết dầu, thu nhỏ lỗ chân lông</li>
//                 <li>Ngăn ngừa mụn mới hình thành</li>
//                 <li>Làm mờ vết thâm sau mụn</li>
//                 <li>Cải thiện kết cấu da</li>
//                 <li>Không gây đau đớn hoặc thời gian nghỉ dưỡng</li>
//                 <li>Hiệu quả lâu dài</li>
//                 <li>An toàn cho mọi loại da</li>
//             </ul>
            
//             <h3>Thành Phần Kháng Khuẩn Kết Hợp</h3>
            
//             <p>Kết hợp với công nghệ IPL, chúng tôi sử dụng các thành phần kháng khuẩn mạnh mẽ:</p>
            
//             <ul>
//                 <li><em>Tea Tree Oil</em> - Kháng khuẩn tự nhiên, giảm viêm</li>
//                 <li><em>Salicylic Acid</em> - Loại bỏ tế bào chết, thông thoáng lỗ chân lông</li>
//                 <li><em>Niacinamide</em> - Giảm viêm, cân bằng dầu và làm đều màu da</li>
//                 <li><em>Zinc PCA</em> - Điều tiết bã nhờn, kháng khuẩn</li>
//                 <li><em>Centella Asiatica</em> - Làm dịu và phục hồi da</li>
//                 <li><em>Azelaic Acid</em> - Kháng khuẩn, giảm viêm và làm sáng da</li>
//                 <li><em>Probiotics</em> - Cân bằng hệ vi sinh trên da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Điều trị mụn bằng IPL (1 lần)</td>
//                         <td>110 phút</td>
//                         <td>950.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 3 lần</td>
//                         <td>110 phút/lần</td>
//                         <td>2.700.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình 5 lần</td>
//                         <td>110 phút/lần</td>
//                         <td>4.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Liệu trình cao cấp (kết hợp mặt nạ LED)</td>
//                         <td>130 phút</td>
//                         <td>1.200.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng dạng gel không dầu mỗi ngày</li>
//                 <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời trong 48 giờ sau điều trị</li>
//                 <li>Không sử dụng các sản phẩm có chứa retinol, AHA, BHA trong 24 giờ sau điều trị</li>
//                 <li>Duy trì chế độ dưỡng ẩm phù hợp với da dầu mụn</li>
//                 <li>Tránh trang điểm trong 24 giờ sau điều trị</li>
//                 <li>Không nặn mụn tại nhà</li>
//                 <li>Thực hiện liệu trình đều đặn theo khuyến nghị của chuyên viên</li>
//                 <li>Hạn chế thực phẩm cay nóng, nhiều đường và dầu mỡ</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Thay vỏ gối thường xuyên</li>
//             </ol>
            
//             <blockquote>
//                 "Tôi đã phải vật lộn với mụn viêm nhiều năm và đã thử nhiều phương pháp điều trị khác nhau. Sau khi điều trị mụn bằng công nghệ IPL tại Sparkle Salon, làn da của tôi đã cải thiện đáng kể. Mụn giảm hẳn chỉ sau 3 lần điều trị, da không còn đỏ và viêm như trước. Đặc biệt, mụn không tái phát nhiều như trước đây. Các chuyên viên rất tận tâm và chuyên nghiệp, luôn theo dõi tình trạng da của tôi sau mỗi lần điều trị. Tôi rất hài lòng với kết quả và sẽ tiếp tục sử dụng dịch vụ này." - Khách hàng Minh Tuấn
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     // ... existing code ...
//     {
//         id: 26,
//         name: "Chăm Sóc Da Mặt Cơ Bản",
//         img: "https://i.ibb.co/Lbxv4wS/skin-treatment26.jpg",
//         price: 180000,
//         duration: "30 phút",
//         session: 2,
//         description: `
//             <h1>Chăm Sóc Da Mặt Cơ Bản</h1>
            
//             <p>Dịch vụ <strong>Chăm Sóc Da Mặt Cơ Bản</strong> tại Sparkle Salon giúp làm sạch sâu, cấp ẩm nhẹ nhàng và giữ da luôn khỏe mạnh, phù hợp cho mọi loại da và mọi lứa tuổi.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình chăm sóc da cơ bản nhưng hiệu quả, giúp làm sạch sâu, loại bỏ tế bào chết và cung cấp dưỡng chất cần thiết, mang lại làn da tươi mới, rạng rỡ.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Da</strong> - Sử dụng sữa rửa mặt phù hợp với từng loại da, loại bỏ bụi bẩn, dầu thừa và trang điểm.</li>
//                 <li><strong>Tẩy Tế Bào Chết Nhẹ Nhàng</strong> - Sử dụng tẩy tế bào chết dịu nhẹ giúp loại bỏ tế bào chết và làm sáng da.</li>
//                 <li><strong>Hút Mụn Cám (Nếu Cần)</strong> - Loại bỏ mụn cám và mụn đầu đen nhẹ nhàng, không gây tổn thương da.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Ẩm</strong> - Sử dụng mặt nạ phù hợp với từng loại da, cung cấp dưỡng chất và độ ẩm cần thiết.</li>
//                 <li><strong>Massage Thư Giãn</strong> - Massage nhẹ nhàng giúp thư giãn, kích thích tuần hoàn máu và tăng cường hấp thu dưỡng chất.</li>
//                 <li><strong>Dưỡng Ẩm</strong> - Sử dụng kem dưỡng ẩm phù hợp với từng loại da, giúp khóa ẩm và bảo vệ da.</li>
//                 <li><strong>Bảo Vệ Da</strong> - Kết thúc với kem chống nắng bảo vệ da khỏi tác nhân môi trường.</li>
//             </ul>
            
//             <h2>Phù Hợp Cho</h2>
            
//             <ul>
//                 <li>Mọi loại da (da thường, da khô, da dầu, da hỗn hợp)</li>
//                 <li>Người mới bắt đầu chăm sóc da</li>
//                 <li>Người cần làm sạch da định kỳ</li>
//                 <li>Người có lịch trình bận rộn (liệu trình ngắn)</li>
//                 <li>Người muốn duy trì làn da khỏe mạnh</li>
//                 <li>Người chuẩn bị cho các sự kiện đặc biệt</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm sạch sâu lỗ chân lông</li>
//                 <li>Loại bỏ tế bào chết và làm sáng da</li>
//                 <li>Cấp ẩm và nuôi dưỡng da</li>
//                 <li>Cải thiện kết cấu da, làm mịn bề mặt</li>
//                 <li>Tăng cường tuần hoàn máu</li>
//                 <li>Giảm stress và thư giãn</li>
//                 <li>Chuẩn bị da tốt hơn cho trang điểm</li>
//                 <li>Duy trì làn da khỏe mạnh</li>
//             </ul>
            
//             <h3>Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các hoạt chất an toàn và hiệu quả:</p>
            
//             <ul>
//                 <li><em>Chiết xuất thảo dược</em> - Làm dịu và nuôi dưỡng da</li>
//                 <li><em>Vitamin E</em> - Chống oxy hóa và bảo vệ da</li>
//                 <li><em>Acid Hyaluronic</em> - Cấp ẩm sâu</li>
//                 <li><em>Aloe Vera</em> - Làm dịu và cấp nước</li>
//                 <li><em>Glycerin</em> - Giữ ẩm tự nhiên</li>
//                 <li><em>Panthenol</em> - Làm dịu và phục hồi da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Chăm sóc cơ bản (1 lần)</td>
//                         <td>30 phút</td>
//                         <td>180.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói 5 lần</td>
//                         <td>30 phút/lần</td>
//                         <td>800.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói 10 lần</td>
//                         <td>30 phút/lần</td>
//                         <td>1.500.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói gia đình (3 người)</td>
//                         <td>30 phút/người</td>
//                         <td>450.000</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để duy trì hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng hàng ngày</li>
//                 <li>Rửa mặt sạch sẽ trước khi đi ngủ</li>
//                 <li>Uống đủ nước mỗi ngày</li>
//                 <li>Tránh chạm tay lên mặt</li>
//                 <li>Thực hiện chăm sóc da cơ bản 2-4 tuần/lần</li>
//                 <li>Sử dụng sản phẩm dưỡng da phù hợp với loại da</li>
//             </ol>
            
//             <blockquote>
//                 "Dịch vụ Chăm Sóc Da Mặt Cơ Bản tại Sparkle Salon là lựa chọn hoàn hảo cho lịch trình bận rộn của tôi. Chỉ với 30 phút, làn da của tôi được làm sạch sâu, cấp ẩm và trở nên tươi tắn hơn. Các chuyên viên rất tận tâm và hiểu rõ nhu cầu của da tôi. Tôi thường xuyên sử dụng dịch vụ này mỗi tháng để duy trì làn da khỏe mạnh." - Khách hàng Thanh Mai
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     },
//     {
//         id: 27,
//         name: "Chăm Sóc Da Chuyên Sâu",
//         img: "https://i.ibb.co/Rkyqd87G/skin-treatment27.jpg",
//         price: 350000,
//         duration: "70 phút",
//         session: 2,
//         description: `
//             <h1>Chăm Sóc Da Chuyên Sâu</h1>
            
//             <p>Dịch vụ <strong>Chăm Sóc Da Chuyên Sâu</strong> tại Sparkle Salon là liệu trình toàn diện giúp cải thiện kết cấu da, cấp ẩm sâu và tái tạo làn da khỏe mạnh từ bên trong.</p>
            
//             <div class="highlight-box">
//                 <p>Liệu trình chăm sóc chuyên sâu kết hợp các kỹ thuật làm sạch, dưỡng chất cao cấp và công nghệ hiện đại, mang lại hiệu quả vượt trội so với chăm sóc cơ bản.</p>
//             </div>
            
//             <h2>Quy Trình Điều Trị</h2>
            
//             <ul class="service-steps">
//                 <li><strong>Làm Sạch Kép</strong> - Sử dụng phương pháp làm sạch kép với dầu tẩy trang và sữa rửa mặt chuyên sâu.</li>
//                 <li><strong>Tẩy Tế Bào Chết</strong> - Loại bỏ tế bào chết với công thức chuyên biệt phù hợp với từng loại da.</li>
//                 <li><strong>Xông Hơi</strong> - Mở rộng lỗ chân lông, chuẩn bị cho quá trình làm sạch sâu.</li>
//                 <li><strong>Hút Dầu Thừa & Làm Sạch Sâu</strong> - Loại bỏ bã nhờn, mụn cám và tạp chất sâu trong lỗ chân lông.</li>
//                 <li><strong>Đắp Mặt Nạ Dưỡng Chất Chuyên Sâu</strong> - Sử dụng mặt nạ cao cấp với dưỡng chất đặc trị phù hợp với tình trạng da.</li>
//                 <li><strong>Massage Nâng Cơ</strong> - Kỹ thuật massage chuyên nghiệp giúp thư giãn, kích thích tuần hoàn và nâng cơ mặt.</li>
//                 <li><strong>Thoa Tinh Chất Đặc Trị</strong> - Sử dụng serum cao cấp với nồng độ hoạt chất cao, đáp ứng nhu cầu đặc biệt của da.</li>
//                 <li><strong>Dưỡng Ẩm Chuyên Sâu</strong> - Sử dụng kem dưỡng ẩm cao cấp, khóa ẩm và tăng cường hàng rào bảo vệ da.</li>
//                 <li><strong>Bảo Vệ Da</strong> - Kết thúc với kem chống nắng phổ rộng, bảo vệ da khỏi tác hại của tia UV.</li>
//             </ul>
            
//             <h2>Phù Hợp Cho</h2>
            
//             <ul>
//                 <li>Da cần được chăm sóc chuyên sâu</li>
//                 <li>Da thiếu sức sống, xỉn màu</li>
//                 <li>Da có dấu hiệu lão hóa sớm</li>
//                 <li>Da stress, mệt mỏi</li>
//                 <li>Da không đều màu, có vết thâm nhẹ</li>
//                 <li>Người chuẩn bị cho sự kiện quan trọng</li>
//                 <li>Người muốn tái tạo làn da toàn diện</li>
//             </ul>
            
//             <h2>Lợi Ích Của Liệu Trình</h2>
            
//             <ul>
//                 <li>Làm sạch sâu và loại bỏ tạp chất</li>
//                 <li>Cấp ẩm chuyên sâu, phục hồi độ đàn hồi</li>
//                 <li>Cải thiện kết cấu da, làm mịn bề mặt</li>
//                 <li>Làm sáng da, cải thiện tông màu</li>
//                 <li>Giảm dấu hiệu lão hóa sớm</li>
//                 <li>Kích thích tái tạo tế bào da</li>
//                 <li>Tăng cường hàng rào bảo vệ tự nhiên</li>
//                 <li>Giảm stress và căng thẳng</li>
//                 <li>Cải thiện đường nét khuôn mặt</li>
//             </ul>
            
//             <h3>Công Nghệ & Thành Phần Hoạt Chất</h3>
            
//             <p>Liệu trình của chúng tôi sử dụng các công nghệ và hoạt chất cao cấp:</p>
            
//             <ul>
//                 <li><em>Công nghệ Hydradermabrasion</em> - Làm sạch sâu và cấp ẩm đồng thời</li>
//                 <li><em>Peptide phức hợp</em> - Kích thích tái tạo collagen</li>
//                 <li><em>Acid Hyaluronic phân tử thấp</em> - Cấp ẩm sâu đến các lớp biểu bì</li>
//                 <li><em>Vitamin C ổn định</em> - Làm sáng và chống oxy hóa</li>
//                 <li><em>Chiết xuất tế bào gốc thực vật</em> - Tái tạo và phục hồi</li>
//                 <li><em>Ceramide</em> - Tăng cường hàng rào bảo vệ da</li>
//                 <li><em>Niacinamide</em> - Cân bằng dầu và làm đều màu da</li>
//             </ul>
            
//             <h2>Bảng Giá Dịch Vụ</h2>
            
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Gói Dịch Vụ</th>
//                         <th>Thời Gian</th>
//                         <th>Giá (VNĐ)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     <tr>
//                         <td>Chăm sóc chuyên sâu (1 lần)</td>
//                         <td>70 phút</td>
//                         <td>350.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói 5 lần</td>
//                         <td>70 phút/lần</td>
//                         <td>1.600.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói 10 lần</td>
//                         <td>70 phút/lần</td>
//                         <td>3.000.000</td>
//                     </tr>
//                     <tr>
//                         <td>Gói VIP (kết hợp mặt nạ vàng 24K)</td>
//                         <td>90 phút</td>
//                         <td>500.000/lần</td>
//                     </tr>
//                 </tbody>
//             </table>
            
//             <h3>Lưu Ý Sau Khi Điều Trị</h3>
//             <p>Để duy trì hiệu quả tối ưu, khách hàng nên:</p>
//             <ol>
//                 <li>Sử dụng kem chống nắng SPF 30+ hàng ngày</li>
//                 <li>Duy trì quy trình chăm sóc da hàng ngày (làm sạch, toner, serum, dưỡng ẩm)</li>
//                 <li>Uống đủ nước (2-3 lít/ngày)</li>
//                 <li>Tránh tiếp xúc với ánh nắng mạnh trong 24 giờ sau điều trị</li>
//                 <li>Không sử dụng các sản phẩm có chứa acid trong 48 giờ sau điều trị</li>
//                 <li>Thực hiện chăm sóc da chuyên sâu 4-6 tuần/lần</li>
//                 <li>Bổ sung thực phẩm giàu chất chống oxy hóa</li>
//             </ol>
            
//             <blockquote>
//                 "Liệu trình Chăm Sóc Da Chuyên Sâu tại Sparkle Salon đã thực sự làm thay đổi làn da của tôi. Sau 5 lần điều trị, làn da của tôi trở nên căng mịn, sáng đều màu và khỏe mạnh hơn rất nhiều. Các kỹ thuật viên rất chuyên nghiệp và tận tâm, họ hiểu rõ tình trạng da của tôi và đưa ra những giải pháp phù hợp. Tôi đặc biệt thích phần massage nâng cơ, vừa thư giãn vừa hiệu quả. Đây là khoản đầu tư xứng đáng cho làn da của tôi!" - Khách hàng Minh Tâm
//             </blockquote>
//         `,
//         categoryName: "Điều Trị Da",
//     }
// ];

const serviceDataById = async (id:string) => {
    const serviceResponse = await axios.get(`http://localhost:8081/swp/services/${id}`)
    if (serviceResponse.status === 200) {
        const serviceData = serviceResponse.data.result
        return serviceData
    }
    return null
}

const deleteServiceById = async (id:string) => {
    const deleteServiceResponse = await axios.delete(`http://localhost:8081/swp/services/${id}`)
    if (deleteServiceResponse.status === 200) {
        return true
    }
    return false
}

export { servicesData , serviceDataById, deleteServiceById};