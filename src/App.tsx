import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import ForgotPassword from "./pages/ForgotPassword";
import Manager from "./pages/Manager";
import ScrollToTop from "./components/ScrollToTop";
import UserManagement from "./pages/UserManagement";
import ServiceManagement from "./pages/ServiceManagement";
import OrderManagement from "./pages/OrderManagement";
import Report from "./pages/Report";
import ServiceDetail from "./pages/ServiceDetail";
import Payment from "./pages/Payment";
import RoomManagement from "./pages/RoomManagement";
import PaymentManagement from "./pages/PaymentManagement";
import CustomerProfile from "./pages/CustomerProfile";
import ManagerStaff from "./pages/ManagerStaff";
import SkinTest from "./pages/SkinTest";
import CreaterQuiz from "./pages/CreaterQuiz";
import QuizManagement from "./pages/QuizManagement";
import BlogManagement from "./pages/BlogManagement";
import BlogDetail from "./pages/BlogDetail";
import Profile from "./pages/Profile";
import Therapist from "./pages/Therapist";
function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/service" element={<MainLayout><Service /></MainLayout>} />
        <Route path="/service/:id" element={<MainLayout><ServiceDetail /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/manager/user" element={<UserManagement />} />
        <Route path="/manager/service" element={<ServiceManagement />} />
        <Route path="/manager/order" element={<OrderManagement />} />
        <Route path="/manager/report" element={<Report />} />
        <Route path="/manager/room" element={<RoomManagement />} />
        <Route path="/manager/payment" element={<PaymentManagement />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<MainLayout><CustomerProfile /></MainLayout>} />
        <Route path="/managerstaff" element={<ManagerStaff />} />
        <Route path="/skintest" element={<MainLayout><SkinTest /></MainLayout>} />
        <Route path="/manager/createrquiz" element={<CreaterQuiz />} />
        <Route path="/manager/quiz" element={<QuizManagement />} />
        <Route path="/manager/blog" element={<BlogManagement />} />
        <Route path="/blog/:blogId" element={<MainLayout><BlogDetail /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/therapist" element={<MainLayout><Therapist /></MainLayout>} />

      </Routes>
    </>
  );
}

export default App;
