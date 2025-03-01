// import axios from "axios";
export interface Service {
    id: number;
    name: string;
    img: string;
    price: number;
    duration: string;
    popularity: number;
    description: string;
    category?: string;
}

const servicesData: Service[] = [
    {
        id: 1,
        name: "Điều Trị Mụn Chuyên Sâu 12 bước",
        img: "https://i.ibb.co/BHwF63Mg/skin-treatment1.jpg",
        price: 150000,
        duration: "90 phút",
        popularity: 765826,
        description: `
            <h1>Điều Trị Mụn Chuyên Sâu 12 Bước</h1>
            <p>Dịch vụ <strong>Điều Trị Mụn Chuyên Sâu 12 Bước</strong> tại Sparkle Salon được thiết kế dành riêng cho làn da gặp vấn đề về mụn như mụn viêm, mụn đầu đen, mụn ẩn và da dễ kích ứng.</p>
            
            <p>Quy trình 12 bước khoa học giúp làm sạch da tận sâu, loại bỏ tác nhân gây mụn, giảm viêm và hỗ trợ tái tạo làn da khỏe mạnh hơn.</p>
            
            <div class="highlight-box">
                <p>Phù hợp với mọi loại da, đặc biệt là da dầu, da mụn và da hỗn hợp. Liệu trình điều trị được điều chỉnh tùy theo tình trạng da của từng khách hàng.</p>
            </div>
            
            <h2>Quy Trình 12 Bước Chăm Sóc Da</h2>
            
            <ul class="service-steps">
                <li><strong>Làm Sạch Da</strong> - Sử dụng sữa rửa mặt chuyên biệt cho da mụn, loại bỏ bụi bẩn và dầu thừa.</li>
                <li><strong>Rửa Mặt Chuyên Sâu</strong> - Làm sạch sâu với các sản phẩm đặc trị.</li>
                <li><strong>Tẩy Tế Bào Chết</strong> - Loại bỏ tế bào chết, thông thoáng lỗ chân lông.</li>
                <li><strong>Xông Hơi Nóng & Hút Bã Nhờn</strong> - Mở lỗ chân lông và hút sạch bã nhờn.</li>
                <li><strong>Nặn Mụn</strong> - Loại bỏ mụn đầu đen, mụn đầu trắng bằng kỹ thuật chuyên nghiệp.</li>
                <li><strong>Sát Khuẩn Da</strong> - Làm sạch và diệt khuẩn, ngăn ngừa viêm nhiễm.</li>
                <li><strong>Cân Bằng Da Với Toner</strong> - Phục hồi độ pH tự nhiên của da.</li>
                <li><strong>Đắp Mặt Nạ</strong> - Mặt nạ đặc trị giúp làm dịu và phục hồi da.</li>
                <li><strong>Điện Di Tinh Chất Đặc Trị</strong> - Đưa dưỡng chất sâu vào da.</li>
                <li><strong>Massage Thư Giãn</strong> - Kích thích tuần hoàn máu và thư giãn.</li>
                <li><strong>Dưỡng Ẩm & Phục Hồi Da</strong> - Cung cấp độ ẩm và dưỡng chất.</li>
                <li><strong>Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV.</li>
            </ul>
            
            <h2>Lợi Ích Của Liệu Trình</h2>
            
            <ul>
                <li>Giảm đáng kể tình trạng mụn viêm, mụn đầu đen</li>
                <li>Làm sạch sâu lỗ chân lông</li>
                <li>Kiểm soát dầu nhờn hiệu quả</li>
                <li>Làm dịu da, giảm sưng đỏ</li>
                <li>Ngăn ngừa sẹo thâm sau mụn</li>
                <li>Cải thiện kết cấu và tông màu da</li>
            </ul>
            
            <h2>Bảng Giá Dịch Vụ</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Gói Dịch Vụ</th>
                        <th>Thời Gian</th>
                        <th>Giá (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Điều trị cơ bản (1 lần)</td>
                        <td>90 phút</td>
                        <td>150.000</td>
                    </tr>
                    <tr>
                        <td>Liệu trình 5 lần</td>
                        <td>90 phút/lần</td>
                        <td>700.000</td>
                    </tr>
                    <tr>
                        <td>Liệu trình 10 lần</td>
                        <td>90 phút/lần</td>
                        <td>1.300.000</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Lưu Ý Sau Khi Điều Trị</h3>
            <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
            <ol>
                <li>Tránh chạm tay lên mặt</li>
                <li>Sử dụng kem chống nắng hàng ngày</li>
                <li>Uống đủ nước</li>
                <li>Hạn chế trang điểm trong 24h sau điều trị</li>
                <li>Tránh các thực phẩm cay nóng, nhiều dầu mỡ</li>
            </ol>
            
            <blockquote>
                "Liệu trình điều trị mụn chuyên sâu đã giúp tôi cải thiện đáng kể tình trạng da. Sau 5 lần điều trị, mụn giảm hẳn và da sáng mịn hơn rất nhiều." - Khách hàng Minh Anh
            </blockquote>
        `,
        category: "Điều Trị Da",
    },
    {
        id: 2,
        name: "Thải Độc Da Thảo Dược",
        img: "https://i.ibb.co/fGYS3VzC/skin-treatment2.jpg",
        price: 200000,
        duration: "30 phút",
        popularity: 13373,
        description: `
            <h1>Thải Độc Da Thảo Dược</h1>
            
            <p>Dịch vụ <strong>Thải Độc Da Thảo Dược</strong> tại Sparkle Salon là phương pháp làm đẹp kết hợp giữa khoa học hiện đại và tinh hoa từ thảo dược thiên nhiên, giúp loại bỏ độc tố, giảm sưng viêm và cân bằng độ ẩm, mang lại làn da tươi sáng và khỏe mạnh.</p>
            
            <div class="highlight-box">
                <p>Liệu trình sử dụng 100% thảo dược tự nhiên, an toàn cho mọi loại da, kể cả da nhạy cảm.</p>
            </div>
            
            <h2>Quy Trình Thải Độc Da</h2>
            
            <ul class="service-steps">
                <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, trang điểm và dầu thừa với sản phẩm làm sạch từ thảo mộc.</li>
                <li><strong>Tẩy Tế Bào Chết</strong> - Sử dụng hỗn hợp thảo dược nghiền mịn để loại bỏ tế bào chết nhẹ nhàng.</li>
                <li><strong>Xông Hơi Thảo Dược</strong> - Mở lỗ chân lông với hơi nước thảo dược, giúp thải độc tố.</li>
                <li><strong>Massage Thải Độc</strong> - Kỹ thuật massage đặc biệt kết hợp với tinh dầu thảo mộc giúp kích thích tuần hoàn và đào thải độc tố.</li>
                <li><strong>Đắp Mặt Nạ Dưỡng Chất</strong> - Mặt nạ thảo dược đặc biệt giúp hút độc tố và cung cấp dưỡng chất.</li>
                <li><strong>Cân Bằng và Bảo Vệ Da</strong> - Hoàn thiện với toner thảo mộc, serum và kem dưỡng ẩm.</li>
            </ul>
            
            <h2>Lợi Ích Của Liệu Trình</h2>
            
            <ul>
                <li>Loại bỏ độc tố tích tụ trong da</li>
                <li>Giảm mẩn đỏ và kích ứng</li>
                <li>Cải thiện tuần hoàn máu</li>
                <li>Làm sáng và đều màu da</li>
                <li>Tăng cường sức đề kháng cho da</li>
                <li>Ngăn ngừa lão hóa sớm</li>
                <li>Cung cấp độ ẩm sâu</li>
            </ul>
            
            <h3>Các Loại Thảo Dược Sử Dụng</h3>
            
            <p>Liệu trình của chúng tôi sử dụng các loại thảo dược quý như:</p>
            
            <ul>
                <li><em>Nghệ vàng</em> - Chống viêm, làm sáng da</li>
                <li><em>Trà xanh</em> - Chống oxy hóa mạnh mẽ</li>
                <li><em>Lô hội</em> - Làm dịu và cấp ẩm</li>
                <li><em>Hoa cúc</em> - Giảm kích ứng và làm dịu da</li>
                <li><em>Hoa hồng</em> - Cân bằng độ pH và se khít lỗ chân lông</li>
                <li><em>Sả</em> - Kháng khuẩn tự nhiên</li>
            </ul>
            
            <h2>Bảng Giá Dịch Vụ</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Gói Dịch Vụ</th>
                        <th>Thời Gian</th>
                        <th>Giá (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Thải độc cơ bản (1 lần)</td>
                        <td>30 phút</td>
                        <td>200.000</td>
                    </tr>
                    <tr>
                        <td>Liệu trình 5 lần</td>
                        <td>30 phút/lần</td>
                        <td>900.000</td>
                    </tr>
                    <tr>
                        <td>Liệu trình cao cấp (bao gồm mặt nạ đặc biệt)</td>
                        <td>45 phút</td>
                        <td>350.000</td>
                    </tr>
                </tbody>
            </table>
            
            <blockquote>
                "Sau khi thử liệu trình thải độc da thảo dược, làn da của tôi trở nên tươi sáng và khỏe mạnh hơn hẳn. Đặc biệt là cảm giác thư giãn trong quá trình điều trị thật tuyệt vời!" - Khách hàng Thanh Hà
            </blockquote>
        `,
        category: "Điều Trị Da",
    },
    {
        id: 3,
        name: "Điều Trị Nám Da",
        img: "https://i.ibb.co/p8hzvCs/skin-treatment3.jpg",
        price: 550000,
        duration: "45 phút",
        popularity: 97050,
        description: `
            <h1>Điều Trị Nám Da</h1>
            
            <p>Dịch vụ <strong>Điều Trị Nám Da</strong> tại Sparkle Salon sử dụng công nghệ tiên tiến để làm mờ các đốm nám, ngăn ngừa sắc tố melanin và tái tạo làn da đều màu.</p>
            
            <div class="highlight-box">
                <p>Phù hợp với mọi loại da, đặc biệt là những làn da đang gặp vấn đề về nám, tàn nhang và sạm màu do tác động của môi trường và nội tiết tố.</p>
            </div>
            
            <h2>Quy Trình Điều Trị Nám</h2>
            
            <ul class="service-steps">
                <li><strong>Làm Sạch Da</strong> - Sử dụng sản phẩm làm sạch chuyên biệt, loại bỏ bụi bẩn và tế bào chết.</li>
                <li><strong>Peel Da Nhẹ</strong> - Loại bỏ tế bào sừng, giúp da sáng mịn và thông thoáng.</li>
                <li><strong>Thoa Tinh Chất Đặc Trị Nám</strong> - Sử dụng các tinh chất chứa thành phần ức chế melanin.</li>
                <li><strong>Điện Di Tinh Chất</strong> - Đưa dưỡng chất sâu vào da bằng công nghệ điện di.</li>
                <li><strong>Đắp Mặt Nạ Phục Hồi</strong> - Làm dịu và cấp ẩm cho da sau điều trị.</li>
                <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV.</li>
            </ul>
            
            <h2>Lợi Ích Của Liệu Trình</h2>
            
            <ul>
                <li>Làm mờ đốm nám và tàn nhang</li>
                <li>Ngăn ngừa sự hình thành sắc tố melanin</li>
                <li>Làm đều màu da</li>
                <li>Tăng cường độ sáng cho da</li>
                <li>Cải thiện kết cấu da</li>
                <li>Bảo vệ da khỏi tác hại của môi trường</li>
            </ul>
            
            <h3>Công Nghệ Sử Dụng</h3>
            
            <p>Liệu trình của chúng tôi kết hợp các công nghệ hiện đại:</p>
            
            <ul>
                <li><em>Công nghệ Nano</em> - Giúp các phân tử dưỡng chất thẩm thấu sâu vào da</li>
                <li><em>Ánh sáng sinh học</em> - Kích thích tái tạo tế bào da</li>
                <li><em>Điện di ion</em> - Đưa dưỡng chất vào sâu trong da</li>
            </ul>
            
            <h2>Bảng Giá Dịch Vụ</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Gói Dịch Vụ</th>
                        <th>Thời Gian</th>
                        <th>Giá (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Điều trị cơ bản (1 lần)</td>
                        <td>45 phút</td>
                        <td>550.000</td>
                    </tr>
                    <tr>
                        <td>Liệu trình 5 lần</td>
                        <td>45 phút/lần</td>
                        <td>2.500.000</td>
                    </tr>
                    <tr>
                        <td>Liệu trình 10 lần</td>
                        <td>45 phút/lần</td>
                        <td>4.800.000</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Lưu Ý Sau Khi Điều Trị</h3>
            <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
            <ol>
                <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày</li>
                <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
                <li>Duy trì chế độ dưỡng ẩm đầy đủ</li>
                <li>Tránh sử dụng các sản phẩm có cồn hoặc gây kích ứng</li>
                <li>Uống đủ nước và bổ sung vitamin E</li>
            </ol>
            
            <blockquote>
                "Sau khi trải qua liệu trình điều trị nám tại Sparkle Salon, làn da của tôi đã cải thiện rõ rệt. Các đốm nám mờ dần và da sáng đều màu hơn. Tôi rất hài lòng với kết quả!" - Khách hàng Thanh Thảo
            </blockquote>
        `,
        category: "Điều Trị Da",
    },
    {
        id: 4,
        name: "Điều Trị Tàn Nhang",
        img: "https://i.ibb.co/cmnDYzX/skin-treatment7.jpg",
        price: 300000,
        duration: "45 phút",
        popularity: 50000,
        description: `
            <h1>Điều Trị Tàn Nhang</h1>
            
            <p>Dịch vụ <strong>Điều Trị Tàn Nhang</strong> tại Sparkle Salon giúp giảm sắc tố, làm sáng vùng da sạm màu và ngăn ngừa tàn nhang lan rộng, mang lại làn da đều màu và rạng rỡ.</p>
            
            <div class="highlight-box">
                <p>Liệu trình được thiết kế đặc biệt cho những làn da có tàn nhang, đốm nâu và không đều màu, sử dụng các thành phần an toàn và hiệu quả.</p>
            </div>
            
            <h2>Quy Trình Điều Trị</h2>
            
            <ul class="service-steps">
                <li><strong>Làm Sạch Da</strong> - Loại bỏ bụi bẩn, dầu thừa và trang điểm với sản phẩm làm sạch dịu nhẹ.</li>
                <li><strong>Thoa Tinh Chất Ức Chế Melanin</strong> - Sử dụng các tinh chất chứa Vitamin C, Arbutin hoặc Kojic Acid để ức chế sản sinh melanin.</li>
                <li><strong>Điện Di Tinh Chất</strong> - Đưa dưỡng chất sâu vào da bằng công nghệ điện di, tăng cường hiệu quả.</li>
                <li><strong>Đắp Mặt Nạ Làm Sáng Da</strong> - Sử dụng mặt nạ chuyên biệt giúp làm sáng và đều màu da.</li>
                <li><strong>Dưỡng Ẩm và Chống Nắng</strong> - Bảo vệ da khỏi tác hại của tia UV và giữ ẩm cho da.</li>
            </ul>
            
            <h2>Lợi Ích Của Liệu Trình</h2>
            
            <ul>
                <li>Làm mờ tàn nhang và đốm nâu</li>
                <li>Làm sáng và đều màu da</li>
                <li>Ngăn ngừa sự hình thành tàn nhang mới</li>
                <li>Cải thiện kết cấu da</li>
                <li>Tăng cường độ ẩm và độ đàn hồi</li>
                <li>Bảo vệ da khỏi tác hại của môi trường</li>
            </ul>
            
            <h3>Thành Phần Hoạt Chất</h3>
            
            <p>Liệu trình của chúng tôi sử dụng các hoạt chất hiệu quả:</p>
            
            <ul>
                <li><em>Vitamin C</em> - Chống oxy hóa và làm sáng da</li>
                <li><em>Arbutin</em> - Ức chế enzyme tyrosinase, giảm sản sinh melanin</li>
                <li><em>Niacinamide</em> - Làm đều màu da và giảm viêm</li>
                <li><em>Chiết xuất cam thảo</em> - Làm sáng da tự nhiên</li>
                <li><em>Alpha Arbutin</em> - Làm mờ đốm nâu hiệu quả</li>
            </ul>
            
            <h2>Bảng Giá Dịch Vụ</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>Gói Dịch Vụ</th>
                        <th>Thời Gian</th>
                        <th>Giá (VNĐ)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Điều trị cơ bản (1 lần)</td>
                        <td>45 phút</td>
                        <td>300.000</td>
                    </tr>
                    <tr>
                        <td>Liệu trình 5 lần</td>
                        <td>45 phút/lần</td>
                        <td>1.400.000</td>
                    </tr>
                    <tr>
                        <td>Liệu trình 10 lần</td>
                        <td>45 phút/lần</td>
                        <td>2.700.000</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Lưu Ý Sau Khi Điều Trị</h3>
            <p>Để đạt hiệu quả tối ưu, khách hàng nên:</p>
            <ol>
                <li>Sử dụng kem chống nắng SPF 50+ mỗi ngày, kể cả khi ở trong nhà</li>
                <li>Tránh tiếp xúc trực tiếp với ánh nắng mặt trời</li>
                <li>Sử dụng sản phẩm dưỡng da có chứa Vitamin C</li>
                <li>Tránh sử dụng các sản phẩm có cồn hoặc gây kích ứng</li>
                <li>Duy trì chế độ ăn uống giàu chất chống oxy hóa</li>
            </ol>
            
            <blockquote>
                "Tôi đã thử nhiều phương pháp điều trị tàn nhang nhưng chỉ có liệu trình tại Sparkle Salon mới thực sự hiệu quả. Sau 5 lần điều trị, tàn nhang của tôi mờ đi rõ rệt và da sáng hơn hẳn." - Khách hàng Minh Tâm
            </blockquote>
        `,
        category: "Điều Trị Da",
    },
    {
        id: 5,
        name: "Điều Trị Sẹo Rỗ",
        img: "https://i.ibb.co/n83Tryf1/skin-treatment4.jpg",
        price: 250000,
        duration: "60 phút",
        popularity: 89000,
        description: "Dịch vụ Điều Trị Sẹo Rỗ giúp kích thích tái tạo collagen, làm đầy sẹo và cải thiện kết cấu da.\n\n**Quy trình điều trị sẹo rỗ:**\n- Làm sạch da\n- Lăn kim hoặc vi kim\n- Thoa tinh chất tái tạo\n- Điện di phục hồi\n- Đắp mặt nạ dưỡng chất\n- Dưỡng ẩm và chống nắng"
    },
    {
        id: 6,
        name: "Điều Trị Da Nhờn",
        img: "https://i.ibb.co/V0WCLYCK/skin-treatment5.jpg",
        price: 600000,
        duration: "90 phút",
        popularity: 65000,
        description: "Dịch vụ Điều Trị Da Nhờn giúp kiểm soát bã nhờn, giảm bóng dầu và ngăn ngừa mụn hiệu quả.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Tẩy tế bào chết kiểm soát dầu\n- Xông hơi hút bã nhờn\n- Đắp mặt nạ kiềm dầu\n- Điện di tinh chất kiểm soát dầu\n- Dưỡng ẩm cân bằng da"
    },
    {
        id: 7,
        name: "Điều Trị Lão Hóa Da",
        img: "https://i.ibb.co/DHxYGwP1/skin-treatment6.jpg",
        price: 100000,
        duration: "40 phút",
        popularity: 43000,
        description: "Dịch vụ Điều Trị Lão Hóa giúp làm mờ nếp nhăn, nâng cơ và tái tạo làn da căng mịn, săn chắc.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Thoa tinh chất chống lão hóa\n- Điện di collagen\n- Đắp mặt nạ nâng cơ\n- Massage da mặt\n- Dưỡng ẩm và chống nắng"
    },
    {
        id: 8,
        name: "Điều Trị Da Không Đều Màu",
        img: "https://i.ibb.co/WWVd35zw/skin-treatment8.webp",
        price: 350000,
        duration: "1 Giờ",
        popularity: 52000,
        description: "Dịch vụ Điều Trị Da Không Đều Màu giúp làm sáng da, giảm thâm sạm và mang lại làn da đều màu tự nhiên.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Tẩy tế bào chết làm sáng da\n- Điện di vitamin C\n- Đắp mặt nạ dưỡng trắng\n- Dưỡng ẩm và chống nắng"
    },
    {
        id: 9,
        name: "Điều Trị Lỗ Chân Lông To",
        img: "https://i.ibb.co/tpBQL1Jh/skin-treatment9.jpg",
        price: 450000,
        duration: "50 phút",
        popularity: 61000,
        description: "Dịch vụ Điều Trị Lỗ Chân Lông To giúp se khít lỗ chân lông, làm mịn da và kiểm soát dầu nhờn.\n\n**Quy trình điều trị:**\n- Làm sạch da\n- Tẩy tế bào chết\n- Xông hơi hút bã nhờn\n- Điện di tinh chất se khít lỗ chân lông\n- Đắp mặt nạ se khít\n- Dưỡng ẩm và chống nắng"
    },
    {
        id: 10,
        name: "https://i.ibb.co/Dgw0NW6m/skin-treatment10.webp",
        img: "/assets/skin-treatment10.jpg",
        price: 700000,
        duration: "75 phút",
        popularity: 72000,
        description: "Dịch vụ Trẻ Hóa Da Công Nghệ Cao giúp làm căng da, nâng cơ và xóa nhăn hiệu quả bằng công nghệ hiện đại.\n\n**Quy trình trẻ hóa da:**\n- Làm sạch da\n- Tẩy tế bào chết\n- Điện di collagen hoặc laser trẻ hóa\n- Đắp mặt nạ nâng cơ\n- Massage thư giãn\n- Dưỡng ẩm và chống nắng"
    },
    {
        id: 11,
        name: "Cấy Tinh Chất Trắng Da",
        img: "https://i.ibb.co/hJ0f4yt2/skin-treatment11.webp",
        price: 800000,
        duration: "90 phút",
        popularity: 91000,
        description: "Liệu trình Cấy Tinh Chất Trắng Da giúp cung cấp dưỡng chất chuyên sâu, làm sáng da, đều màu và giảm thâm nám. **Quy trình bao gồm:** - Làm sạch và tẩy tế bào chết - Cấy tinh chất dưỡng trắng bằng công nghệ mesotherapy - Massage giúp thẩm thấu dưỡng chất - Đắp mặt nạ cấp ẩm - Chống nắng và bảo vệ da"
    },
    {
        id: 12,
        name: "Điều Trị Mụn Đầu Đen",
        img: "https://i.ibb.co/cX1Jtv85/skin-treatment12.jpg",
        price: 180000,
        duration: "30 phút",
        popularity: 56000,
        description: "Dịch vụ Điều Trị Mụn Đầu Đen giúp làm sạch sâu, loại bỏ mụn đầu đen và se khít lỗ chân lông. **Quy trình bao gồm:** - Làm sạch da và xông hơi - Hút mụn đầu đen bằng công nghệ hiện đại - Thoa tinh chất kiểm soát dầu - Đắp mặt nạ thu nhỏ lỗ chân lông - Dưỡng ẩm và chống nắng"
    },
    {
        id: 13,
        name: "Điều Trị Mụn Viêm",
        img: "https://i.ibb.co/rfwYrmNr/skin-treatment13.jpg",
        price: 550000,
        duration: "1 Giờ",
        popularity: 74000,
        description: "Liệu trình Điều Trị Mụn Viêm giúp giảm sưng viêm, tiêu diệt vi khuẩn gây mụn và phục hồi làn da. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi hỗ trợ giãn nở lỗ chân lông - Chấm tinh chất kháng khuẩn - Áp dụng công nghệ ánh sáng sinh học - Đắp mặt nạ làm dịu da - Dưỡng ẩm phục hồi"
    },
    {
        id: 14,
        name: "Điều Trị Da Nhạy Cảm",
        img: "https://i.ibb.co/ycZS9Px8/skin-treatment14.png",
        price: 400000,
        duration: "45 phút",
        popularity: 49000,
        description: "Dịch vụ Điều Trị Da Nhạy Cảm giúp làm dịu kích ứng, phục hồi hàng rào bảo vệ da và giảm mẩn đỏ. **Quy trình bao gồm:** - Làm sạch nhẹ nhàng với sữa rửa mặt dành cho da nhạy cảm - Massage thư giãn kích thích tuần hoàn - Thoa tinh chất làm dịu và phục hồi - Đắp mặt nạ cấp ẩm chuyên sâu - Dưỡng ẩm và chống nắng"
    },
    {
        id: 15,
        name: "Thải Độc Da Bằng Than Hoạt Tính",
        img: "https://i.ibb.co/cS8J7zN7/skin-treatment15.jpg",
        price: 320000,
        duration: "50 phút",
        popularity: 67000,
        description: "Liệu trình Thải Độc Da Bằng Than Hoạt Tính giúp loại bỏ bụi bẩn, thanh lọc độc tố và kiểm soát dầu nhờn hiệu quả. **Quy trình bao gồm:** - Làm sạch da - Tẩy tế bào chết - Đắp mặt nạ than hoạt tính giúp hút sạch độc tố - Massage kích thích tuần hoàn - Dưỡng ẩm và chống nắng"
    },
    {
        id: 16,
        name: "Điều Trị Da Khô",
        img: "https://i.ibb.co/sdgRzjxh/skin-treatment16.png",
        price: 280000,
        duration: "40 phút",
        popularity: 57000,
        description: "Liệu trình Điều Trị Da Khô giúp cấp ẩm sâu, cải thiện độ đàn hồi và ngăn ngừa bong tróc. **Quy trình bao gồm:** - Làm sạch nhẹ nhàng - Tẩy tế bào chết - Đắp mặt nạ dưỡng ẩm chuyên sâu - Massage kích thích tuần hoàn - Thoa tinh chất cấp nước và phục hồi da - Chống nắng bảo vệ da"
    },
    {
        id: 17,
        name: "Căng Bóng Da Hàn Quốc",
        img: "https://i.ibb.co/0yHCq6Ym/skin-treatment17.jpg",
        price: 650000,
        duration: "80 phút",
        popularity: 88000,
        description: "Dịch vụ Căng Bóng Da Hàn Quốc giúp da trở nên mịn màng, căng bóng và tràn đầy sức sống. **Quy trình bao gồm:** - Làm sạch da và xông hơi - Tẩy tế bào chết nhẹ nhàng - Cấy tinh chất HA giúp cấp nước - Massage nâng cơ - Đắp mặt nạ phục hồi - Thoa kem dưỡng và chống nắng"
    },
    {
        id: 18,
        name: "Liệu Trình Collagen Trẻ Hóa",
        img: "https://i.ibb.co/VYcF627p/skin-treatment18.jpg",
        price: 750000,
        duration: "85 phút",
        popularity: 94000,
        description: "Liệu trình Collagen Trẻ Hóa giúp cải thiện độ đàn hồi, giảm nếp nhăn và làm săn chắc da. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Đắp mặt nạ collagen - Massage giúp thẩm thấu dưỡng chất - Áp dụng công nghệ trẻ hóa da - Dưỡng ẩm và chống nắng"
    },
    {
        id: 19,
        name: "Tái Tạo Da Bằng Tế Bào Gốc",
        img: "https://i.ibb.co/rG0SLBfS/skin-treatment19.jpg",
        price: 900000,
        duration: "95 phút",
        popularity: 102000,
        description: "Dịch vụ Tái Tạo Da Bằng Tế Bào Gốc giúp phục hồi da, kích thích sản sinh collagen và làm sáng da. **Quy trình bao gồm:** - Làm sạch da - Xông hơi giúp giãn nở lỗ chân lông - Cấy tinh chất tế bào gốc - Massage thư giãn - Đắp mặt nạ phục hồi - Dưỡng ẩm và bảo vệ da"
    },
    {
        id: 20,
        name: "Liệu Trình Chăm Sóc Da Dầu",
        img: "https://i.ibb.co/JWm7rRMC/skin-treatment20.jpg",
        price: 500000,
        duration: "60 phút",
        popularity: 81000,
        description: "Liệu trình Chăm Sóc Da Dầu giúp kiểm soát bã nhờn, ngăn ngừa mụn và giữ da thông thoáng. **Quy trình bao gồm:** - Làm sạch da với sữa rửa mặt kiểm soát dầu - Tẩy tế bào chết nhẹ nhàng - Đắp mặt nạ đất sét giúp hút dầu thừa - Massage thư giãn - Thoa tinh chất cân bằng dầu - Chống nắng bảo vệ da"
    },
    {
        id: 21,
        name: "Điều Trị Da Bị Dị Ứng",
        img: "https://i.ibb.co/Fbjb5WWD/skin-treatment21.jpg",
        price: 350000,
        duration: "55 phút",
        popularity: 53000,
        description: "Dịch vụ Điều Trị Da Bị Dị Ứng giúp làm dịu kích ứng, giảm mẩn đỏ và phục hồi hàng rào bảo vệ da. **Quy trình bao gồm:** - Làm sạch nhẹ nhàng với sữa rửa mặt không gây kích ứng - Xông hơi thảo dược giúp làm dịu da - Đắp mặt nạ làm dịu và phục hồi - Massage nhẹ nhàng để tăng tuần hoàn - Thoa tinh chất phục hồi da - Dưỡng ẩm và chống nắng bảo vệ da"
    },
    {
        id: 22,
        name: "Điều Trị Da Tổn Thương Sau Lăn Kim",
        img: "https://i.ibb.co/bR1yCptX/skin-treatment22.png",
        price: 650000,
        duration: "80 phút",
        popularity: 79000,
        description: "Liệu trình Điều Trị Da Tổn Thương Sau Lăn Kim giúp phục hồi da, giảm đỏ và kích thích tái tạo da nhanh chóng. **Quy trình bao gồm:** - Làm sạch da nhẹ nhàng - Đắp mặt nạ phục hồi chuyên sâu - Sử dụng tinh chất tế bào gốc giúp tái tạo da - Massage thư giãn - Dưỡng ẩm và bảo vệ da khỏi tác nhân gây hại"
    },
    {
        id: 23,
        name: "Điều Trị Thâm Mụn",
        img: "https://i.ibb.co/rRdLJj1S/skin-treatment23.jpg",
        price: 400000,
        duration: "45 phút",
        popularity: 69000,
        description: "Dịch vụ Điều Trị Thâm Mụn giúp làm mờ vết thâm, đều màu da và kích thích tái tạo tế bào mới. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi giúp da hấp thụ dưỡng chất - Sử dụng tinh chất trị thâm - Đắp mặt nạ dưỡng sáng da - Dưỡng ẩm và bảo vệ da khỏi tác động môi trường"
    },
    {
        id: 24,
        name: "Điều Trị Nám Tàn Nhang Bằng Laser",
        img: "https://i.ibb.co/0y1TmyWZ/skin-treatment24.webp",
        price: 1200000,
        duration: "120 phút",
        popularity: 112000,
        description: "Dịch vụ Điều Trị Nám Tàn Nhang Bằng Laser giúp phá vỡ sắc tố sạm nám, làm sáng da và ngăn ngừa tái phát. **Quy trình bao gồm:** - Làm sạch da và ủ tê - Sử dụng công nghệ laser hiện đại - Làm dịu da với tinh chất đặc trị - Đắp mặt nạ phục hồi - Dưỡng ẩm và chống nắng bảo vệ da"
    },
    {
        id: 25,
        name: "Điều Trị Mụn Bằng Công Nghệ IPL",
        img: "https://i.ibb.co/fYx4fDx9/skin-treatment25.jpg",
        price: 950000,
        duration: "110 phút",
        popularity: 97000,
        description: "Liệu trình Điều Trị Mụn Bằng Công Nghệ IPL giúp tiêu diệt vi khuẩn gây mụn, giảm viêm và hạn chế tái phát. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi giúp lỗ chân lông thông thoáng - Áp dụng công nghệ IPL để diệt khuẩn - Đắp mặt nạ làm dịu và phục hồi - Dưỡng ẩm và chống nắng bảo vệ da"
    },
    {
        id: 26,
        name: "Chăm Sóc Da Mặt Cơ Bản",
        img: "https://i.ibb.co/Lbxv4wS/skin-treatment26.jpg",
        price: 180000,
        duration: "30 phút",
        popularity: 65000,
        description: "Dịch vụ Chăm Sóc Da Mặt Cơ Bản giúp làm sạch sâu, cấp ẩm nhẹ nhàng và giữ da luôn khỏe mạnh. **Quy trình bao gồm:** - Làm sạch da với sữa rửa mặt phù hợp - Tẩy tế bào chết nhẹ nhàng - Đắp mặt nạ dưỡng ẩm - Massage thư giãn - Dưỡng ẩm và bảo vệ da khỏi tác nhân môi trường"
    },
    {
        id: 27,
        name: "Chăm Sóc Da Chuyên Sâu",
        img: "https://i.ibb.co/Rkyqd87G/skin-treatment27.jpg",
        price: 350000,
        duration: "70 phút",
        popularity: 72000,
        description: "Liệu trình Chăm Sóc Da Chuyên Sâu giúp cải thiện kết cấu da, cấp ẩm sâu và tái tạo làn da khỏe mạnh. **Quy trình bao gồm:** - Làm sạch da và tẩy tế bào chết - Xông hơi và hút dầu thừa - Đắp mặt nạ dưỡng chất chuyên sâu - Massage nâng cơ giúp da săn chắc - Thoa tinh chất đặc trị - Dưỡng ẩm và chống nắng"
    },
];

// const servicesResponse = await axios.get("https://6663414662966e20ef0c1254.mockapi.io/history/service")

// const servicesData: Service[] = servicesResponse.data;

export default servicesData; 


