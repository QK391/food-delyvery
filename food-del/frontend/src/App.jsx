import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import MyOrders from "./pages/MyOrders/MyOrders";
import VnpayMock from "./pages/VnpayMock/VnpayMock";
import UserProfile from "./pages/UserProfile/UserProfile";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

const App = () => {
  const [showLogin, setShowLogin] = React.useState(false);
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />: <></>}
    <div className="app">
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/order" element={<PlaceOrder/>} />
        <Route path="/myorders" element={<MyOrders/>} />
        <Route path="/vnpay-mock" element={<VnpayMock/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
    </div>
    <Footer />
    </>
  )
}
export default App;