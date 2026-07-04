// Checkout.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { resetCheckout } from "../../redux/ecommSlice";
import Cookies from 'js-cookie'

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development'
  ? process.env.REACT_APP_API_DEV_URL
  : process.env.REACT_APP_API_PROD_URL;

const Checkout = () => {
  const location = useLocation();
  const {products} = useSelector(state => state.ecommReducer)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [prevLocation, setPrevLocation] = useState("");
  const [snap, setSnap] = useState(window.snap || "")
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("")
  const [countdown, setCountDown] = useState(localStorage.getItem('countdown') || 0)

  const token = Cookies.get('token')
  const [uni, setUni] = useState(localStorage.getItem('uni') || "")

  // ========== User Profile Data ==========
  const [customer, setCustomer] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    province: "",
    city_id: "",
    country: "",
    zip: ""
  });

  // ========== Cart & Order Data ==========
  const [cartItems, setCartItems] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  // ========== Shipping & Payment ==========
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [orderNotes, setOrderNotes] = useState("");

  // ========== Error States ==========
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    city_id: "",
    zip: "",
    shipping: "",
    payment: ""
  });

  // ========== Total Calculations ==========
  const [totalAmount, setTotalAmount] = useState(0)
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  // ========== Shipping Costs by City ==========
  const shippingRates = {
    standard: 15000,
    express: 35000,
    same_day: 50000
  };

  useEffect(() => {
    if(token){
      getCustomer();
    }
    getCities();
    getCartItems();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, shippingMethod, selectedCity]);

  // useEffect(() => {
  //   const updateTime = (): void => {
  //     const now = Date.now();
  //     const timeTillStop = endTime * 1000 - now;
  //     if (timeTillStop <= 0) {
  //       setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
  //       onNoCountdownTimeLeft?.();
  //       return;
  //     }
  //     const totalSeconds = Math.floor(timeTillStop / 1000);
  //     if (totalSeconds !== lastSecondsRef.current) {
  //       lastSecondsRef.current = totalSeconds;
  //       const hours = Math.floor(totalSeconds / 3600);
  //       const minutes = Math.floor((totalSeconds % 3600) / 60);
  //       const seconds = totalSeconds % 60;
  //       setTimeLeft({ hours, minutes, seconds });
  //     }
  //     animationRef.current = requestAnimationFrame(updateTime);
  //   };

  //   return () => {
  //     if (animationRef.current) {
  //       cancelAnimationFrame(animationRef.current);
  //     }
  //   };

  // }, [])

  useEffect(() => {

    var timerStep,startT;
    // var countdown = document.getElementById('SecondsLeft');
    var countdown = localStorage.getItem('countdown')

    turnTimerOn(600);

    function turnTimerOn(step) { //called by server code as a startup script
      timerStep = step;
      startT = 0;
      requestAnimationFrame(anim);
    }

    function anim(currenttime) {
      startT = startT || currenttime;
      let delta = currenttime - startT;
      localStorage.setItem('countdown', timerStep - (delta / 1000 | 0))
      setCountDown(timerStep - (delta / 1000 | 0))
      // countdown.innerHTML = timerStep - (delta / 1000 | 0);

      if (delta >= timerStep * 1000) {
        // localStorage.setItem('countdown', "")
        localStorage.removeItem('countdown')
        setCountDown(0)
        dispatch(resetCheckout())

        // toast.info("times checkout 0, redirecting")

        navigate('/order-history')
        // countdown.innerHTML = "";
        // TomatoHubProxy.invoke('NextPlayer', '<%=Session("username")%>', '<%=Session("GameID")%>');
      } else {
        requestAnimationFrame(anim);
      }
    }


    console.log('countdown', countdown)

    // if(countdown == 0){


    // }

  }, [countdown])


  const getCustomer = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/accounts/profile`, {
        withCredentials: true
      });
      if (result.status === 200) {
        setCustomer(result.data.data);
      }
    } catch (error) {
      toast.error("Failed to load profile: " + (error.response?.data?.message || error.message));
    }
  };

  const getCities = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/cities`);
      setCities(result.data.data);
    } catch (error) {
      toast.error('Failed to load cities: ' + (error.response?.data?.message || error.message));
    }
  };

  const getCartItems = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/cart`, {
        withCredentials: true
      });
      if (result.status === 200) {
        setCartItems(result.data.data.items || []);
      }
    } catch (error) {
      toast.error("Failed to load cart: " + (error.response?.data?.message || error.message));
    }
  };

  const calculateTotals = () => {
    // Calculate subtotal from cart items
    const newSubtotal = products.reduce((sum, item) => {
      return sum + (item.price * (item.quantity || 1));
    }, 0);
    setSubtotal(newSubtotal);

    // Calculate total amount
    const newTotalAmount = products.reduce((amt, item) => {
      return amt + item.quantity
    }, 0)

    setTotalAmount(newTotalAmount)

    // Calculate shipping cost
    const newShippingCost = 0;
    // const newShippingCost = shippingRates[shippingMethod] || 0;
    setShippingCost(newShippingCost);

    // Calculate tax (10% for example)
    const newTax = newSubtotal * 0.0;
    setTax(newTax);

    // Calculate total
    const newTotal = newSubtotal + newShippingCost + newTax;
    setTotal(newTotal);
  };

  const handleInputChange = (field, value) => {
    setCustomer(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [field]: ""
    }));
  };

  const handleCityChange = (cityId) => {
    const city = cities.find(c => c.id === cityId);
    setSelectedCity(city);
    setCustomer(prev => ({
      ...prev,
      city_id: cityId
    }));
    setErrors(prev => ({
      ...prev,
      city_id: ""
    }));

    console.log('cities', city)
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!customer.full_name.trim()) {
      newErrors.full_name = "Nama wajib diisi";
      isValid = false;
    }
    if (!customer.email.trim()) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(customer.email)) {
      newErrors.email = "Email tidak valid";
      isValid = false;
    }
    if (!customer.phone_number.trim()) {
      newErrors.phone_number = "Nomor telepon wajib diisi";
      isValid = false;
    }
    if (!customer.address.trim()) {
      newErrors.address = "Alamat wajib diisi";
      isValid = false;
    }
    if (!customer.city_id) {
      newErrors.city_id = "Kota wajib diisi";
      isValid = false;
    }
    if (!customer.zip) {
      newErrors.zip = "Kode pos wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (products.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const orderData = {
        user: {
          full_name: customer.full_name,
          email: customer.email,
          phone_number: customer.phone_number,
          address: customer.address,
          province: customer.province,
          city_id: customer.city_id,
          country: customer.country,
          zip: customer.zip
        },
        items: products.map(item => ({
          product_id: item.id,
          quantity: item.quantity || 1,
          price: item.price
        })),
        shipping: {
          method: shippingMethod,
          cost: shippingCost
        },
        payment: {
          method: paymentMethod
        },
        notes: orderNotes,
        subtotal: subtotal,
        tax: tax,
        total: total
      };

      console.log('products', products)
      await axios.post(`${BASE_URL}/payments/request-invoices`, {customer_details: {...customer, uni: uni}, products, total_price: total, total_amount: totalAmount, total_discount: 0, admin_fee: 0, promo_code: ''}, {withCredentials: true})
      // await axios.post(`${BASE_URL}payments/request-invoices`, {product_id: products[0]._id, amount: products[0].quantity, price: products[0].price, admin_fee: products[0].admin_fee, discount: products[0].discount, promo_code: products[0].promo_code}, {withCredentials: true})
                  .then(result => {
                    console.log('result', result)
                    if(result.status === 200){
                      // window.location.href=result.data.data.redirect_url

                      snap.pay(result.data.data.token, {
                        onSuccess: function(result){
                          console.log('success');
                          console.log(result);
                          if(!uni){
                            navigate('/order-history')
                          }
                          navigate('/')
                        },
                        onPending: function(result){
                          console.log('pending');console.log(result);
                          toast.info('Navigating to order history')
                          navigate('/order-history')
                        },
                        onError: function(result){
                          console.log('error');console.log(result);
                          toast.error('Error, Error request invoice')
                        },
                        onClose: function(){
                          console.log('customer closed the popup without finishing the payment');
                          navigate('/order-history')
                        }
                      })
                    }
                  })
                  .catch(error => {
                    toast.error('Failed, Failed request invoice: ' + error)
                  })




      // const response = await axios.post(`${BASE_URL}/orders`, orderData, {
      //   withCredentials: true
      // });

      // if (response.status === 201) {
      //   toast.success("Order placed successfully!");
      //   // Navigate to order confirmation page
      //   navigate('/order-confirmation', {
      //     state: { orderId: response.data.data.order_id }
      //   });
      // }
    } catch (error) {
      toast.error("Failed to place order: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Checkout" prevLocation={prevLocation} />

      <div className="py-8">
        <form>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ========== Billing Information ========== */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-titleFont font-semibold mb-6">
                  {/* Billing Information */}
                </h2>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama *
                    </label>
                    <input
                      type="text"
                      value={customer.full_name || ""}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none"
                      placeholder="Enter your full name"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={customer.email || ""}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor telepon *
                    </label>
                    <input
                      type="tel"
                      value={customer.phone_number || ""}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none"
                      placeholder="08123456789"
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat *
                    </label>
                    <textarea
                      value={customer.address || ""}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none resize-none"
                      placeholder="Enter your complete address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* City and Postal Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kota *
                      </label>
                      <select
                        value={customer.city_id || ""}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none"
                      >
                        <option value="">Select a city</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id}>
                            {city.city}
                          </option>
                        ))}
                      </select>
                      {errors.city_id && (
                        <p className="text-red-500 text-sm mt-1">{errors.city_id}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kode Pos *
                      </label>
                      <input
                        type="text"
                        value={customer.zip || ""}
                        onChange={(e) => handleInputChange('zip', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none"
                        placeholder="Postal code"
                      />
                      {errors.zip && (
                        <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                      )}
                    </div>
                  </div>

                  {/* Province and Country */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provinsi
                      </label>
                      <input
                        type="text"
                        value={customer.province || ""}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none"
                        placeholder="Province"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Negara
                      </label>
                      <input
                        type="text"
                        value={customer.country || ""}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========== Shipping & Payment ========== */}
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                {/* <h2 className="text-2xl font-titleFont font-semibold mb-6">
                  Shipping & Payment
                </h2> */}

                {/* Shipping Method */}
                {/* <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Shipping Method *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === "standard"}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Standard Shipping</div>
                        <div className="text-sm text-gray-500">Delivery in 3-5 business days</div>
                      </div>
                      <div className="font-semibold">{formatCurrency(15000)}</div>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === "express"}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Express Shipping</div>
                        <div className="text-sm text-gray-500">Delivery in 1-2 business days</div>
                      </div>
                      <div className="font-semibold">{formatCurrency(35000)}</div>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shipping"
                        value="same_day"
                        checked={shippingMethod === "same_day"}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium">Same Day Delivery</div>
                        <div className="text-sm text-gray-500">Delivery within hours</div>
                      </div>
                      <div className="font-semibold">{formatCurrency(50000)}</div>
                    </label>
                  </div>
                </div> */}

                {/* Payment Method */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>Bank Transfer</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="credit_card"
                        checked={paymentMethod === "credit_card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>Credit / Debit Card</span>
                    </label>

                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payment"
                        value="e_wallet"
                        checked={paymentMethod === "e_wallet"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span>E-Wallet</span>
                    </label>
                  </div>
                </div> */}

                {/* Order Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primeColor focus:border-transparent outline-none resize-none"
                    placeholder="Special delivery instructions, etc."
                  />
                </div>
              </div>
            </div>

            {/* ========== Order Summary ========== */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                <h2 className="text-2xl font-titleFont font-semibold mb-6">
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="max-h-60 overflow-y-auto mb-4">
                  {products?.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                  ) : (
                    products.map((item, index) => (
                      <div key={item.id || index} className="flex items-center py-3 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name || item.title}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                        </div>
                        <div className="font-semibold text-sm">
                          {formatCurrency((item.price || 0) * (item.quantity || 1))}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primeColor">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  // type="submit"
                  disabled={isLoading || products.length === 0}
                  className="w-full mt-6 bg-primeColor text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePlaceOrder}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing this order, you agree to our Terms and Conditions
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;