import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
  useNavigate
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import Profile from "./pages/Profile/Profile";
import OrderHistory from './pages/OrderHistory/OrderHistory'
import OrderHistoryDetail from './pages/OrderHistory/OrderHistoryDetail'
import ForgotPassword from "./pages/Account/ForgotPassword";
import { BASE_URL } from "./server/api";

import axios from "axios";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie'

const userSession = ""

const Layout = ({session }) => {
  return (
    <div>
      <Header session={session} />
      <HeaderBottom session={session} />
      <SpecialCase session={session} />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
      <ToastContainer />
    </div>
  );
};

const router = createBrowserRouter(

  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout session={userSession} />}>
        {/* ==================== Header Navlink Start here =================== */}
        <Route index element={<Home />}></Route>
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/journal" element={<Journal />}></Route>
        {/* ==================== Header Navlink End here ===================== */}
        <Route path="/offer" element={<Offer/>}></Route>
        <Route path="/product/:_id" element={<ProductDetails />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/order-history" element={<OrderHistory session={userSession} />}></Route>
        <Route path="/order-history/:id" element={<OrderHistoryDetail session={userSession} />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword session={userSession}  />}></Route>
        <Route path="/paymentgateway" element={<Payment session={userSession} />}></Route>
      </Route>
      <Route path="/register" element={<SignUp session={userSession} />}></Route>
      <Route path="/login" element={<SignIn session={userSession} />}></Route>
    </Route>
  )
);

function App() {

  const token = Cookies.get('token')

  useEffect(() => {

    getUserSession(token)

    // if(!userSession){
    //   window.location.href = './login'
    // }

  }, [userSession])

  const getUserSession = async () => {
    try {
      await axios.get(`${BASE_URL}auth/session`, {withCredentials: true})
                  .then(result => {
                    if(result.status == 200){
                      userSession = result.data.session
                    }else{
                      toast.error('Failed, Failed when get session')
                      window.location.href = './login'
                    }
                  })
                  .catch(result => {
                    // toast.error('Session expired')
                    // window.location.href = './login'
                  })

    } catch (error) {

    }
  }

  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
