import Footer from "../components/Footer";
import Header from "../components/Header";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
