import { Link} from "react-router-dom";

export default function Home() {
    return (
        <div className="pt-16 flex flex-col"> 
            <div className="min-h-screen flex flex-row items-center bg-[url('/assets/home-banner.jpg')] bg-cover bg-center bg-no-repeat">
                {/* Hero Section */}
                <div className="text-start text-white max-w-xl ml-60">
                    <h1 className="text-6xl font-bold leading-tight">Sparkle Salon</h1>
                    <p className="mt-2 text-lg text-gray-400">Salon hàng đầu về trị liệu da</p>
                    <p className="mt-2 text-lg text-gray-400">Đặt lịch và tới trực tiếp để chúng tôi có thể phục vụ bạn chu đáo hơn</p>
                    <button className="mt-6 bg-[#f8a89c] hover:bg-[#ee8874] text-black px-6 py-3 rounded-lg font-semibold text-lg">
                        <Link to="/contact">Đặt lịch ngay →</Link>
                    </button>
                </div>
            </div>
        </div>
    );
}
