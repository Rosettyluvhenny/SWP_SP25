import { ReactNode } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface LayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Header /> 
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;
