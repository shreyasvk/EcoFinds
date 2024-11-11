import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import CartPage from "./Pages/CartPage";
import DashboardPage from "./Pages/DashboardPage";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import RegistrationPage from "./Pages/RegistrationPage";
import SellerRegistration from "./Pages/SellerRegistration";
import ProfilePage from "./Pages/ProfilePage";
import PostProduct from "./Pages/PostProduct";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        {/* This is to avoid the content overlapping with the fixed header */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/seller" element={<SellerRegistration />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/post-products" element={<PostProduct />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
