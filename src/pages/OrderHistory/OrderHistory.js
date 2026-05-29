import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import DatePicker, {DateObject} from "react-multi-date-picker"
import { emptyCart } from "../../assets/images/index";
import { toast } from "react-toastify";
import axios from "axios";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_DEV_URL : process.env.VITE_PROD_URL

const OrderHistory = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [orders, setOrders] = useState([{invoice_number: 'ino26-homedress1-432', image: 'https://res.cloudinary.com/dodrj3l9p/image/upload/v1775810924/curtains1_cbyycx.jpg', name: 'Curtain', price: '40000', total_amount: 2}])
  const [date_range, setDateRange] = useState([
    new DateObject().setDay(1) ,
    new DateObject().add(1, "month").setDay(10)
  ])

  useEffect(() => {
    // setPrevLocation(location.pathname);
    // setPrevLocation(location.state.data);
    console.log('location.state', location.state)
    getOrderHitories()

    if(date_range){
      getOrderHitories(date_range)
    }
  }, [location, date_range]);

  const getOrderHitories = async (date_range = null) => {
    try {

      if(date_range){
        console.log('date_range', date_range[0].day)

        const queryParams = new URLSearchParams()

        // const [from, to] = date_range;

        const from = date_range[0].year + '-' + date_range[0].month + '-' + date_range[0].day
        const to = date_range[1].year + '-' + date_range[1].month + '-' + date_range[1].day

        if (from && to) {
          queryParams.append('from', from);
          queryParams.append('to', to);
        }
        // const queryString = queryParams.toString()

        await axios.get(`${BASE_URL}histories${queryParams? '?' + queryParams: "" }`, {withCredentials: true})
                    .then(result => {
                      console.log('result', result)
                      if(result.status == 200){
                        setOrders(result.data.data)
                      }
                    })

      // const queryParams

      }else{
        await axios.get(`${BASE_URL}histories`, {withCredentials: true})
                    .then(result => {
                      console.log('result', result)
                      if(result.status == 200){
                        setOrders(result.data.data)
                      }
                    })
      }


    } catch (error) {
      toast.error('Error get order histories: ' + error)
    }
  }

  const handleDateFilter = async (date_range) => {

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
      <Breadcrumbs title="Order History" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="w-full text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">SweetHome</span>{" "}
          {/* is one of the world's leading ecommerce brands and is internationally
          recognized for celebrating the essence of classNameic Worldwide muslimah fashion
          looking style. */}
        </h1>

        <div className="flex">
          <div className="flex w-full divide-y divide-gray-200 overflow-hidden dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">Order History</div>
          <div className="flex w-full justify-between items-end">
            <DatePicker value={date_range} onChange={setDateRange} range rangeHover
              plugins={[
                <DatePanel />
              ]}
            />
          </div>
        </div>



        {orders.length > 0 ? (
          <>
            <div className="w-[500px] h-auto py-6 flex flex-col gap-6">

              <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
                <div className="w-full divide-y divide-gray-200 gap-3 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">
                  {orders.map(product => (
                    <div className="space-y-4 p-6">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-white sm:text-2xl">
                        <Link to={`/order-history/${encodeURI(product.invoice_number?.toLowerCase())}`}>
                          {`Invoice Number #${product.invoice_number}` }
                        </Link>
                      </h2>
                      <div className="flex items-center gap-6">
                        <a href="#" className="h-14 w-14 shrink-0">
                          <img className="h-full w-full dark:hidden" src={product.image} alt={product.name} />
                          {/* <img className="hidden h-full w-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="imac image" /> */}
                        </a>

                        {/* <a href="#" className="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white">  </a> */}
                        {product.description}
                        {/* PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3, 24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, macOS Sonoma, Blue, Keyboard layout INT */}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        {/* <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Product ID:</span> BJ8364850</p> */}

                        <div className="flex items-center justify-end gap-4">
                          <p className="text-base font-normal text-gray-900 dark:text-white">{`${product.total_amount} item`} </p>

                          <p className="text-xl font-bold leading-tight text-gray-900 dark:text-white">{formatCurrency(parseInt(product.total_price))}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>

              </div>
            </div></>
        ):
        (
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
              Your History orders empty.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              {/* Your History orders lives to serve. Give it purpose - fill it with
              books, electronics, videos, etc. and make it happy. */}
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Shopping
              </button>
            </Link>
          </div>
        </motion.div>
        )
        }
        {/* <Link to="/shop">
          <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
            Continue Shopping
          </button>
        </Link> */}
        {/* <div className="mt-6 grow sm:mt-8 lg:mt-0">
              <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order history</h3>

                <ol className="relative ms-3 border-s border-gray-200 dark:border-gray-700">
                  <li className="mb-10 ms-6">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-700 dark:ring-gray-800">
                      <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"/>
                      </svg>
                    </span>
                    <h4 className="mb-0.5 text-base font-semibold text-gray-900 dark:text-white">Estimated delivery in 24 Nov 2023</h4>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Products delivered</p>
                  </li>

                  <li className="mb-10 ms-6">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 ring-8 ring-white dark:bg-gray-700 dark:ring-gray-800">
                      <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm-10 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
                      </svg>
                    </span>
                    <h4 className="mb-0.5 text-base font-semibold text-gray-900 dark:text-white">Today</h4>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Products being delivered</p>
                  </li>

                  <li className="mb-10 ms-6 text-primary-700 dark:text-primary-500">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-800">
                      <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                      </svg>
                    </span>
                    <h4 className="mb-0.5 font-semibold">23 Nov 2023, 15:15</h4>
                    <p className="text-sm">Products in the courier's warehouse</p>
                  </li>

                  <li className="mb-10 ms-6 text-primary-700 dark:text-primary-500">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-800">
                      <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                      </svg>
                    </span>
                    <h4 className="mb-0.5 text-base font-semibold">22 Nov 2023, 12:27</h4>
                    <p className="text-sm">Products delivered to the courier - DHL Express</p>
                  </li>

                  <li className="mb-10 ms-6 text-primary-700 dark:text-primary-500">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-800">
                      <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                      </svg>
                    </span>
                    <h4 className="mb-0.5 font-semibold">19 Nov 2023, 10:47</h4>
                    <p className="text-sm">Payment accepted - VISA Credit Card</p>
                  </li>

                  <li className="ms-6 text-primary-700 dark:text-primary-500">
                    <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 ring-8 ring-white dark:bg-primary-900 dark:ring-gray-800">
                      <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="mb-0.5 font-semibold">19 Nov 2023, 10:45</h4>
                      <a href="#" className="text-sm font-medium hover:underline">Order placed - Receipt #647563</a>
                    </div>
                  </li>
                </ol>

                <div className="gap-4 sm:flex sm:items-center">
                  <button type="button" className="w-full rounded-lg  border border-gray-200 bg-white px-5  py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Cancel the order</button>

                  <a href="#" className="mt-4 flex w-full items-center justify-center rounded-lg bg-primary-700  px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:mt-0">Order details</a>
                </div>
              </div>
            </div> */}
      </div>
    </div>
  );
};

export default OrderHistory;
