import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/ecommSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_DEV_URL : process.env.REACT_APP_PROD_URL

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  // const {products} = useSelector((state) => state.ecommReducer);
  const [products, setProducts] = useState([])
  const [totalAmt, setTotalAmt] = useState("");
  const [shippingCharge, setShippingCharge] = useState(0);

  useEffect(() => {
    let price = 0;
    products.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price);
    if(products.length === 0){
      getCart()
    }
    console.log('products', products)
  }, [products]);


  const getCart = async () => {
    try {
      await axios.get(`${BASE_URL}cart`, {withCredentials: true})
                .then(result => {
                  console.log('result', result)
                  if(result.status === 200){
                    setProducts(result.data.data)
                  }
                })

    } catch (error) {
      toast.error('Error, Error get cart items')
    }
  }

  // useEffect(() => {
  //   if (totalAmt <= 200) {
  //     setShippingCharge(0);
  //     // 30
  //   } else if (totalAmt <= 400) {
  //     setShippingCharge(0);
  //     // 25
  //   } else if (totalAmt > 401) {
  //     setShippingCharge(0);
  //     // 20
  //   }
  // }, [totalAmt]);

  const createInvoice = async () => {
    console.log('products', products)
    try {
      await axios.post(`${BASE_URL}payments/request-invoices`, {product_id: products[0].id, amount: products[0].amount, price: products[0].price, admin_fee: products[0].admin_fee, discount: products[0].discount, promo_code: products[0].promo_code}, {withCredentials: true})
                  .then(result => {
                    console.log('result', result)
                    if(result.status === 200){
                      navigate(result.data.data.redirect_url)
                    }
                  })
                  .catch(error => {
                    toast.error('Failed, Failed request invoice')
                  })

    } catch (error) {
      toast.error('Failed, Failed request invoice: ' + error)
    }
  }

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Cart" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Sub Total</h2>
          </div>
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(resetCart())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset cart
          </button>

          <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
            <div className="flex items-center gap-4">
              <input
                className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
                type="text"
                placeholder="Coupon Number"
              />
              <p className="text-sm mdl:text-base font-semibold">
                Apply Coupon
              </p>
            </div>
            <p className="text-lg font-semibold">Update Cart</p>
          </div>
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatCurrency(totalAmt)}
                  </span>
                </p>
                {/* <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Shipping Charge
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatCurrency(shippingCharge)}
                  </span>
                </p> */}
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Admin Fee
                  <span className="font-semibold tracking-wide font-titleFont">
                    {formatCurrency(shippingCharge)}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Total
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    {formatCurrency(totalAmt + shippingCharge)}
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                {/* <Link to="/paymentgateway"> */}
                  <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300"
                  onClick={createInvoice}
                  >
                    Proceed to Checkout
                  </button>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              books, electronics, videos, etc. and make it happy.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
