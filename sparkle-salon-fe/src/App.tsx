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
import Report from "./pages/Report";
import ServiceDetail from "./pages/ServiceDetail";
import Payment from "./pages/Payment";
import RoomManagement from "./pages/RoomManagement";
import PaymentManagement from "./pages/PaymentManagement";
import { UserContext } from "./context/UserContext";
import { useContext } from "react";
import Profile from "./pages/Profile";
import TherapistPanel from "./pages/TherapistPanel";
import YourBooking from "./pages/YourBooking";
import BookingDetail from "./pages/BookingDetail";
import Booking from "./pages/Booking";
import BookingSession from "./pages/BookingSession";
import YourSession from "./pages/YourSession";
import SessionDetail from "./pages/SessionDetail";
import TherapistManagement from "./pages/TherapistManagement";
import Feedback from "./pages/Feedback";
import { ProtectedRoute } from "./routes/ProtectedRoutes";

import ManagerStaff from "./pages/ManagerStaff";
import SkinTest from "./pages/SkinTest";
import QuizManagement from "./pages/QuizManagement";
import BlogManagement from "./pages/BlogManagement";
import BlogDetail from "./pages/BlogDetail";
import Staff from "./pages/Staff";
import BookingByStaff from "./components/BookingByStaff";
import Sidebar from "./components/SideBarDashboard";
import StaffLayout from "./layouts/StaffLayout";
import Session from "./components/Session";
import ManagerLayout from "./layouts/ManagerLayout";

function App() {
    const { user } = useContext(UserContext);
    return (
        <>
            <Routes>
                <Route
                    path="/about"
                    element={
                        <MainLayout>
                            <About />
                        </MainLayout>
                    }
                />
                <Route
                    path="/service"
                    element={
                        <MainLayout>
                            <Service />
                        </MainLayout>
                    }
                />
                <Route
                    path="/service/:id"
                    element={
                        <MainLayout>
                            <ServiceDetail />
                        </MainLayout>
                    }
                />
                <Route
                    path="/blog"
                    element={
                        <MainLayout>
                            <Blog />
                        </MainLayout>
                    }
                />
                <Route
                    path="/home"
                    element={
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    }
                />
                <Route
                    path="/blog/:blogId"
                    element={
                        <MainLayout>
                            <BlogDetail />
                        </MainLayout>
                    }
                />
                <Route
                    path="/skintest"
                    element={
                        <MainLayout>
                            <SkinTest />
                        </MainLayout>
                    }
                />
                <Route path="/therapist" element={<TherapistPanel />} />

                <Route
                    path="/feedback"
                    element={
                        <MainLayout>
                            <Feedback />
                        </MainLayout>
                    }
                />


                {/* User protected routes */}
                <Route element={<ProtectedRoute requiredRoles={["USER"]} />}>
                    <Route
                        path="/bookingDetail/:id"
                        element={
                            <MainLayout>
                                <BookingDetail isStaff={false} />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/booking"
                        element={
                            <MainLayout>
                                <Booking />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/bookingSession"
                        element={
                            <MainLayout>
                                <BookingSession />
                            </MainLayout>
                        }
                    />
                    <Route path="/payment" element={<Payment />} />
                    <Route
                        path="/schedule"
                        element={
                            <MainLayout>
                                <YourSession />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/sessionDetail/:id"
                        element={
                            <MainLayout>
                                <SessionDetail isStaff={false} />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <MainLayout>
                                <Profile />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/your-booking"
                        element={
                            <MainLayout>
                                <YourBooking />
                            </MainLayout>
                        }
                    />
                </Route>

                {/* Admin protected routes */}
                {/* <Route element={<ProtectedRoute requiredRoles={["ADMIN"]} />}>
                    <Route
                        path="/your-booking"
                        element={
                            <MainLayout>
                                <YourBooking />
                            </MainLayout>
                        }
                    />
                    <Route
                        path="/feedback"
                        element={
                            <MainLayout>
                                <Feedback />
                            </MainLayout>
                        }
                    />
                    <Route path="/manager" element={<Manager />} />
                </Route> */}

                {/* Therapist protected routes */}
                <Route element={<ProtectedRoute requiredRoles={['THERAPIST']} />}>
                    <Route path="/therapist" element={<TherapistPanel />} />
                    <Route path="/therapist/:id" element={<TherapistPanel />} />
                    <Route path="/therapist/blog" element={<BlogManagement />} />
                </Route>

                {/* Admin protected routes */}
                <Route
                    element={
                        <ProtectedRoute
                            requiredRoles={["ADMIN"]}
                        />
                    }
                >
                    <Route path="/manager" element={<Manager />} />
                    <Route path="/manager/user" element={<UserManagement />} />
                    <Route
                        path="/manager/service"
                        element={<ServiceManagement />}
                    />
                    <Route path="/manager/report" element={<Report />} />
                    <Route path="/manager/room" element={<RoomManagement />} />
                    <Route
                        path="/manager/payment"
                        element={<PaymentManagement />}
                    />
                    <Route
                        path="/manager/therapist"
                        element={<TherapistManagement />}
                    />
                    <Route path="/managerstaff" element={<ManagerStaff />} />
                    <Route path="/manager/quiz" element={<QuizManagement />} />
                    <Route path="/manager/blog" element={<BlogManagement />} />
                    <Route path="/manager/booking" element={<ManagerLayout> <BookingByStaff /></ManagerLayout>} />
                    <Route path="/manager/session" element={<ManagerLayout><Session /></ManagerLayout>} />
                    <Route path="/manager/feedback" element={<ManagerLayout> <Feedback /></ManagerLayout>} />
                    <Route path="/manager/bookingDetail/:id" element={<ManagerLayout> <BookingDetail isStaff={true} /></ManagerLayout>} />
                    <Route path="/manager/sessionDetail/:id" element={<ManagerLayout> <SessionDetail isStaff={true} /></ManagerLayout>} />

                </Route>

                <Route
                    element={
                        <ProtectedRoute
                            requiredRoles={["STAFF","ADMIN"]}
                        />
                    }
                >
                    <Route
                        path="/staff/booking"
                        element={
                            <StaffLayout>
                                <BookingByStaff />
                            </StaffLayout>
                        }
                    />
                    <Route
                        path="/staff/bookingDetail/:id"
                        element={
                            <StaffLayout>
                                <BookingDetail isStaff={true} />
                            </StaffLayout>
                        }
                    />
                    <Route
                        path="/staff/session"
                        element={
                            <StaffLayout>
                                <Session />
                            </StaffLayout>
                        }
                    />
                    <Route
                        path="/staff/sessionDetail/:id"
                        element={
                            <StaffLayout>
                                <SessionDetail isStaff={true} />
                            </StaffLayout>
                        }
                    />
                    <Route
                        path="/staff/Profile"
                        element={
                            <StaffLayout>
                                <Profile />
                            </StaffLayout>
                        }
                    />

                </Route>
                {/* Fallback route */}
                <Route
                    path="*"
                    element={
                        <MainLayout>
                            <Home />
                        </MainLayout>
                    }
                />

            </Routes>
        </>
    );
}

export default App;
