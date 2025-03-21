import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
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
import { UserContext, UserProvider } from "./context/UserContext";
import { useContext } from "react";
import Profile from "./pages/Profile";
import Therapist from "./pages/Therapist";
import YourBooking from "./pages/YourBooking";
import BookingDetail from "./pages/BookingDetail";
import Booking from "./pages/Booking";
import BookingSession from "./pages/BookingSession";
import YourSession from "./pages/YourSession";
import SessionDetail from "./pages/SessionDetail";
import TherapistManagement from "./pages/TherapistManagement";
import Feedback from "./pages/Feedback";

function App() {
  const {user} = useContext(UserContext)
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        {/* <Route path="/" element={<Home />}/> */}

        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/service" element={<MainLayout><Service /></MainLayout>} />
        <Route path="/service/:id" element={<MainLayout><ServiceDetail /></MainLayout>} />
        <Route path='/bookingDetail/:id'element={<MainLayout><BookingDetail /></MainLayout>} />
        <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />
        <Route path="/bookingSession" element={<MainLayout><BookingSession/></MainLayout>} />
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
        <Route path="/schedule" element={<MainLayout><YourSession/></MainLayout>} />
        <Route path="/sessionDetail/:id" element={<MainLayout><SessionDetail/></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/therapist/:id" element={<Therapist />} />
        <Route path="/manager/therapist" element={<TherapistManagement />} />
        <Route path="/your-booking" element={<MainLayout><YourBooking /></MainLayout>} />
        <Route path="/feedback" element={<MainLayout><Feedback /></MainLayout>} />
      </Routes>
    </>
  );
}

export default App;
