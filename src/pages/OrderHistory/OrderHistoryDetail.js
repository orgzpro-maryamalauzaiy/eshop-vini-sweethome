import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { emptyCart } from "../../assets/images/index";
import { formatIndonesiaDate } from "../../utils/formatIndonesiaDate";
import ItemCard from "../Cart/ItemCard";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

const OrderHistoryDetail = () => {
  const location = useLocation();
  const [user, setUser] = useState("")
  const [prevLocation, setPrevLocation] = useState("");
  const [order, setOrder] = useState([{invoice_number: 'ino26-homedress1-432', image: 'https://res.cloudinary.com/dodrj3l9p/image/upload/v1775810924/curtains1_cbyycx.jpg', name: 'Curtain', price: '40000', total_amount: 2}])
  const [orderItems, setOrderItems] = useState([])
  const [payment, setPayment] = useState("")
  const { id } = useParams()

  useEffect(() => {
    // setPrevLocation(location.pathname);
    // setPrevLocation(location.state.data);
    console.log('payment', payment, order)
    console.log('location.state', location.state)
    console.log('id', id)
    getOrderHitory()
  }, [location, id]);

  const getOrderHitory = async (req, res) => {
    try {

      await axios.get(`${BASE_URL}/histories/${id}`, {withCredentials: true})
                  .then(result => {
                    console.log('result', result)
                    if(result.status == 200){
                      setOrder(order => ({
                        ...order,
                        invoice_number: result.data.data.invoice_number,
                        total_price: result.data.data.total_price,
                        total_amount: result.data.data.total_amount,
                        total_discount: result.data.data.total_discount,
                        promo_code: result.data.data.promo_code,
                        admin_fee: result.data.data.admin_fee,
                        order_status: result.data.data.order_status
                      }))
                      setOrderItems(result.data.data.items.map(item => ({
                        _id: item.product_id,
                        img: item.image,
                        name: item.name,
                        slug: item.slug,
                        price: item.price,
                        quantity: item.amount,
                        discount: item.discount,
                        promo_code: item.promo_code,
                        admin_fee: item.admin_fee
                      })))
                      setPayment({
                        ...payment, ...result.data.data.payments.map(payment => ({
                          payment_code: payment.payment_code,
                          payment_status: payment.payment_status,
                          bank_code: payment.bank_code,
                          settlement_date: payment.settlement_date
                        }))
                      })
                    // result.data.data

                    }
                  })

    } catch (error) {
      toast.error('Error get order histories: ' + error)
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
      <Breadcrumbs title="Order History" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">SweetHome</span>{" "}
          {/* is one of the world's leading ecommerce brands and is internationally
          recognized for celebrating the essence of classNameic Worldwide muslimah fashion
          looking style. */}
        </h1>
        <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">Order History</div>
        {/* lg:max-w-xl xl:max-w-2xl */}
        {order && (
            <div className="w-full h-auto py-6 flex flex-col gap-6">

              <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
                <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                    <div className="space-y-4 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-2xl">{`Invoice Number #${order.invoice_number}` } </h2>
                      <div className="flex items-center gap-6">
                        <a href="#" className="h-14 w-14 shrink-0">
                          <img className="h-full w-full dark:hidden" src={order.image} alt="" />
                          {/* <img className="hidden h-full w-full dark:block" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front-dark.svg" alt="imac image" /> */}
                        </a>

                        {/* <a href="#" className="min-w-0 flex-1 font-medium text-gray-900 hover:underline dark:text-white"> {product.description} </a> */}
                        {/* PC system All in One APPLE iMac (2023) mqrq3ro/a, Apple M3, 24" Retina 4.5K, 8GB, SSD 256GB, 10-core GPU, macOS Sonoma, Blue, Keyboard layout INT */}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Tanggal Transaksi:</span> {formatIndonesiaDate(order.created_at)}</p>
                        {/* <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Pemesan:</span> {user.full_name}</p> */}
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Produk:</span></p>

                        <div className="flex items-center justify-end gap-4">
                          <p className="text-base font-normal text-gray-900 dark:text-white">{`${order.total_amount} item`} </p>

                          <p className="text-xl font-bold leading-tight text-gray-900 dark:text-white">{formatCurrency(order.total_price)}</p>
                        </div>
                      </div>
                      <div className="pb-20">
                        <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
                          <h2 className="col-span-2">Product</h2>
                          <h2>Price</h2>
                          <h2>Quantity</h2>
                          <h2>Sub Total</h2>
                        </div>
                        <div className="mt-5">
                          {orderItems.map((item) => (
                            <div key={item._id}>
                              <ItemCard item={item} />
                            </div>
                          ))}
                        </div>
                        <div className="w-full gap-4 flex justify-end mt-4">
                          {/* max-w-7xl */}
                          <div className="w-96 flex flex-col gap-4">
                            <h1 className="text-2xl font-semibold text-right">Cart totals</h1>
                            <div>
                              <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                                Subtotal
                                <span className="font-semibold tracking-wide font-titleFont">
                                  {formatCurrency(order.total_amount)}
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
                                  {formatCurrency(order.admin_fee)}
                                </span>
                              </p>
                              <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                                Total
                                <span className="font-bold tracking-wide text-lg font-titleFont">
                                  {formatCurrency(order.total_amount + order.admin_fee)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Tanggal Transaksi:</span> {order.created_at}</p>
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Pemesan:</span> {user.full_name}</p>
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Produk:</span></p>

                        <div className="flex items-center justify-end gap-4">
                          <p className="text-base font-normal text-gray-900 dark:text-white">{`${product.total_amount} item`} </p>

                          <p className="text-xl font-bold leading-tight text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                        </div>
                      </div> */}

                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Tanggal Transaksi:</span> {order.created_at}</p>

                        <div className="flex items-center justify-end gap-4">
                          <p className="text-base font-normal text-gray-900 dark:text-white">{`${order.total_amount} item`} </p>

                          <p className="text-xl font-bold leading-tight text-gray-900 dark:text-white">{formatCurrency(order.total_price)}</p>
                        </div>
                      </div>
                    </div>

                </div>

              </div>
            </div>
            )
            }
        <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">Informasi Pembayaran</div>
            <div className="w-full h-auto py-6 flex flex-col gap-6">

              <div className="mt-6 sm:mt-8 lg:flex lg:gap-8">
                <div className="w-full divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700 lg:max-w-xl xl:max-w-2xl">
                  {/* {order.map(product => ( */}
                    <div className="space-y-4 p-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-2xl">{`Status Pembayaran` } <span className={`${payment.status == 'successed'? 'bg-green-400 border-sm rounded-sm border-green-600 text-gray-500' : payment.status == 'pending'?'bg-gray-400 border-sm rounded-sm border-gray-600 text-gray-500' : payment.status == 'waiting'? 'bg-yellow-400 border-sm rounded-sm border-yellow-600 text-gray-500' : payment.payment_status == 'failed'? 'bg-red-400 border-sm rounded-sm border-red-600 text-gray-500' : ''}`}> {`${payment.payment_status === 'successed' ? "Complete" : payment.payment_status === 'pending' ? '-' : payment.payment_status === 'waiting' ? 'Menunggu Pembayaran' : payment.payment_status === 'failed'? 'Gagal': ''}`} </span> </h2>

                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Metode Pembayaran:</span></p>

                        <div className="flex items-center justify-end gap-4">
                          <p className="text-base font-normal text-gray-900 dark:text-white">{payment.payment_code} </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Bank:</span></p>

                        <div className="flex items-center justify-end gap-4">
                          <p className="text-base font-normal text-gray-900 dark:text-white">{payment.bank_code} </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-normal text-gray-500 dark:text-gray-400"><span className="font-medium text-gray-900 dark:text-white">Tanggal Pembayaran:</span></p>

                        <div className="flex items-center justify-end gap-4">
                          <p className="text-base font-normal text-gray-900 dark:text-white">{formatIndonesiaDate(payment.settlement_date)} </p>
                        </div>
                      </div>
                    </div>
                  {/* ))} */}

                </div>

              </div>
            </div>
            </div>
    </div>
  );
};

export default OrderHistoryDetail;
