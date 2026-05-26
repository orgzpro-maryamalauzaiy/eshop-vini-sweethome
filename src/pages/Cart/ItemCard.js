import React from "react";
import { useEffect } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteItem,
  decreaseQuantity,
  increaseQuantity,
} from "../../redux/ecommSlice";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_DEV_URL : process.env.REACT_APP_PROD_URL

const ItemCard = ({ item, setIncrease, setDecrease, setRemove }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {

    console.log('item', item)
  }, [item])

  const handleRemoveItem = async (product_id) => {
    try {
      await axios.post(`${BASE_URL}cart/remove`, {product_id}, {withCredentials: true})
                  .then(result => {
                    console.log(result)
                    if(result.status === 200){
                      setRemove({product_id})
                      // setDecrease(product_id)
                      // navigate('/cart')
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    toast.error('Failed, Failed remove product from cart: ' + error)
                  })

    } catch (error) {
      toast.error('Failed, Failed remove product from cart: ' + error)
    }
  }

  const handleIncreaseQuantity = async (product_id) => {
    try {
      await axios.post(`${BASE_URL}cart/increase`, {product_id}, {withCredentials: true})
                  .then(result => {
                    console.log(result)
                    if(result.status === 200){
                      setIncrease({product_id})
                      // navigate('/cart')
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    toast.error('Failed, Failed add product to cart: ' + error)
                  })

    } catch (error) {
      toast.error('Failed, Failed add product to cart: ' + error)
    }
  }
  const handleDecreaseQuantity = async (product_id) => {
    try {
      await axios.post(`${BASE_URL}cart/decrease`, {product_id}, {withCredentials: true})
                  .then(result => {
                    console.log(result)
                    if(result.status === 200){
                      setDecrease({product_id})
                      // navigate('/cart')
                    }
                  })
                  .catch(error => {
                    console.log(error)
                    toast.error('Failed, Failed add product to cart: ' + error)
                  })

    } catch (error) {
      toast.error('Failed, Failed add product to cart: ' + error)
    }
  }

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    };

  // const handleDecreaseQuantity = async (id) => {
  //   try {
  //     await axios.post(`${BASE_URL}cart/add`, {product_id: item._id, price: item.price}, {withCredentials: true})
  //                 .then(result => {
  //                   console.log(result)
  //                   if(result.status === 200){
  //                     navigate('/cart')
  //                   }
  //                 })
  //                 .catch(error => {
  //                   console.log(error)
  //                   toast.error('Failed, Failed add product to cart: ' + error)
  //                 })

  //   } catch (error) {

  //   }
  // }

  return (
    <div className="w-full grid grid-cols-5 mb-4 border py-2">
      <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={() => handleRemoveItem(item._id)}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        <img className="w-32 h-32" src={item.image} alt="productImage" />
        <h1 className="font-titleFont font-semibold">{item.name}</h1>
      </div>
      <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
        <div className="flex w-1/3 items-center text-lg font-semibold">
          {formatCurrency(item.price)}
        </div>
        <div className="w-1/3 flex items-center gap-6 text-lg">
          <span
            onClick={() => handleDecreaseQuantity(item._id)}
            // onClick={() => dispatch(drecreaseQuantity({ _id: item._id }))}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
          >
            -
          </span>
          <p>{item.quantity}</p>
          <span
            onClick={() => handleIncreaseQuantity(item._id)}
            className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
          >
            +
          </span>
        </div>
        <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
          <p>{formatCurrency(item.quantity * item.price)}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
