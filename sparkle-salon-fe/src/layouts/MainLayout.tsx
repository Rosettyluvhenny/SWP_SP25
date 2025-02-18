import Footer from "../components/Footer";
import Header from "../components/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
