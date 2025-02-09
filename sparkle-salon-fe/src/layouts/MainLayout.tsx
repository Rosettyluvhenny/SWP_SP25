import { ReactNode } from "react";
import Header from "../components/Header";

interface LayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Header /> 
            <main>{children}</main>
            <footer className="p-4 bg-gray-800 text-white text-center">
                © {new Date().getFullYear()} Sparkle Salon. Luôn sẵn sàng phục vụ quý khách.
            </footer>
        </div>
    );
};

export default MainLayout;
