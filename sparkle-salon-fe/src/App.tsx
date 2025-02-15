import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Product from "./pages/Product";
import ForgotPassword from "./pages/ForgotPassword";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <MainLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/product" element={<Product />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
