import React from "react";
import { useDispatch } from "react-redux";
import { formatCurrency } from "../../../utils/formatCurrency";
import { addToCart } from "../../../redux/ecommSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleAddToCart = async () => {
    try {
      await axios.post(`${BASE_URL}/cart/add`, {product_id: productInfo._id, price: productInfo.price}, {withCredentials: true})
                  .then(result => {
                    console.log(result)
                    if(result.status === 200){
                      navigate('/cart')
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

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-xl font-semibold">{formatCurrency(productInfo.price)}</p>
      <p className="text-base text-gray-600">{productInfo.des}</p>
      <p className="text-sm">Be the first to leave a review.</p>
      <p className="font-medium text-lg">
        <span className="font-normal">Colors:</span> {productInfo.color}
      </p>
      <button
        onClick={handleAddToCart
          // dispatch(
          //   addToCart({
          //     _id: productInfo.id,
          //     name: productInfo.productName,
          //     quantity: 1,
          //     image: productInfo.img,
          //     badge: productInfo.badge,
          //     price: productInfo.price,
          //     colors: productInfo.color,
          //   })
          // )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont"
      >
        Add to Cart
      </button>
      <p className="font-normal text-sm">
        <span className="text-base font-medium"> Categories:</span> {productInfo.category_name} Tags: {productInfo.pin_product?.toUpperCase()} SKU: -
      </p>
    </div>
  );
};

export default ProductInfo;
