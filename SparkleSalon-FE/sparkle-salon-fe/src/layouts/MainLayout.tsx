import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className=" flex flex-row justify-between items-center p-4 bg-gray-800 text-white text-xl font-semibold ">
                Sparkle Salon
                <nav className="px-96 py-3 rounded-lg">
                    <ul className="flex space-x-6 text-white text-lg">
                        <li>
                            <Link to="/" className="hover:text-gray-300">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="hover:text-gray-300">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/service" className="hover:text-gray-300">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="/product" className="hover:text-gray-300">
                                Product
                            </Link>
                        </li>
                        <li>
                            <Link to="/blog" className="hover:text-gray-300">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-gray-300">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="p-4 bg-gray-800 text-white text-center">
                © {new Date().getFullYear()} Sparkle Salon. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;
