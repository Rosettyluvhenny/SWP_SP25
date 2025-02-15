import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Product from "./pages/Product";
import ForgotPassword from "./pages/ForgotPassword";
import Manager from "./pages/Manager";
import ScrollToTop from "./components/ScrollToTop";
import UserManagement from "./pages/UserManagement";
import ServiceManagement from "./pages/ServiceManagement";
import OrderManagement from "./pages/OrderManagement";
import Report from "./pages/Report";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/service" element={<MainLayout><Service /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
        <Route path="/product" element={<MainLayout><Product /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/manager-user" element={<UserManagement />} />
        <Route path="/manager-service" element={<ServiceManagement />} />
        <Route path="/manager-order" element={<OrderManagement />} />
        <Route path="/manager-report" element={<Report />} />
      </Routes>
    </>
  );
}

export default App;
