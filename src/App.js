import { useState, useEffect } from "react";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Outlet,
//   createRoutesFromElements,
//   ScrollRestoration,
// } from "react-router-dom";
// import {useNavigate} from "react-router"
import {  BrowserRouter as Router, Routes, Route, useNavigate, Outlet} from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { resetInfo } from "./redux/authSlice";

let useruser = ""

const getUseruser = async () => {
    try {
      await axios.get(`${BASE_URL}auth/user`, {withCredentials: true})
                  .then(result => {
                    if(result.status == 200){
                      useruser = result.data.user
                    }else{
                      toast.error('Failed, Failed when get user')
                      window.location.href = './login'
                    }
                  })
                  .catch(result => {
                    // toast.error('user expired')
                    // window.location.href = './login'
                  })

    } catch (error) {

    }
  }

const Layout = ({user}) => {

  return (
    <div>
      <Header user={user} />
      <HeaderBottom user={user} />
      <SpecialCase user={user} />
      {/* <ScrollRestoration /> */}
      <Outlet user={user} />
      <Footer user={user} />
      <FooterBottom  user={user} />
      <ToastContainer style={{zIndex: 1000}} hideProgressBar={true}/>
    </div>
  );
};

// const router = createBrowserRouter(

//   createRoutesFromElements(

//   )
// );

function App() {

  const {loading, userEmail} = useSelector(state => state.auth)
  const [userInfo, setUserInfo] = useState("")
  const [session, setSession] = useState("")
  const dispatch = useDispatch()
  const token = Cookies.get('token')
  // const navigate = useNavigate()

  useEffect(() => {
    if(!loading && userEmail){
      console.log('userEmail', userEmail, loading)
      setUserInfo(userEmail)
      // navigate('/')
    }

    if(!token){
      dispatch(resetInfo())

    }else{
      getSession()
    }



    // if(!userEmail){
    //   navigate('/login')
    // }



  },[userEmail, token])

  const getSession = async () => {
    try {

      await axios.get(`${BASE_URL}/auth/session`, {withCredentials: true})
          .then(result => {
            console.log('result in session', result.data)

            if(result.status === 200){
              console.log('in fulfilled')
              // initialState.userEmail = result.data.session.email
              // initialState.userInfo = {
              //   username: result.data.session.email
              // }

            }else{
              console.log('in error')
              dispatch(resetInfo())
              toast.error('Gagal, Session kadaluarsa.')

            }

            return result.data.session

          })
          .catch(error => {
            console.log('in error', error)
            dispatch(resetInfo())

            toast.error('Gagal, Session kadaluarsa.')

          })

    } catch (error) {

      console.log('in error', error)
      dispatch(resetInfo())

      toast.error('Gagal, Session kadaluarsa.')

    }
  }

  return (
    <div className="font-bodyFont">
      {/* <RouterProvider router={router}/> */}
        <Router>
          <Routes>
            <Route>
              <Route path="/" element={<Layout user={userInfo} />}>
                {/* ==================== Header Navlink Start here =================== */}
                <Route index element={<Home user={userInfo} />}></Route>
                <Route path="/shop" element={<Shop user={userInfo} />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
                <Route path="/journal" element={<Journal />}></Route>
                {/* ==================== Header Navlink End here ===================== */}
                <Route path="/offer" element={<Offer/>}></Route>
                <Route path="/product/:_id" element={<ProductDetails />}></Route>
                <Route path="/cart" element={<Cart />}></Route>
                <Route path="/profile" element={<Profile />}></Route>
                <Route path="/order-history" element={<OrderHistory user={useruser} />}></Route>
                <Route path="/order-history/:id" element={<OrderHistoryDetail user={useruser} />}></Route>
                <Route path="/forgot-password" element={<ForgotPassword user={useruser}  />}></Route>
                <Route path="/paymentgateway" element={<Payment user={useruser} />}></Route>
              </Route>
              <Route path="/register" element={<SignUp user={useruser} />}></Route>
              <Route path="/login" element={<SignIn user={useruser} />}></Route>
            </Route>
          </Routes>
        </Router>
    </div>
  );
}

export default App;
