import React from "react";
import { useState, useEffect } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  bestSellerOne,
  bestSellerTwo,
  bestSellerThree,
  bestSellerFour,
} from "../../../assets/images/index";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_SERVER_MODE == 'development'? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

const BestSellers = () => {

  const [bestsellers, setBestSellers] = useState([])
  // const [error_message, setErrorMessage] = useState("")

  useEffect(() => {
    getProductsBestSellers()
    console.log(bestsellers)
  }, [])

  const getProductsBestSellers = async () => {
    try {
      await axios.get(`${BASE_URL}/products/best-sellers`)
                      .then((results) => {
                        console.log('results', results)
                        if(results.status == 200){
                          setBestSellers(results.data.data)
                        }
                      })
                      .catch((error) => {
                        console.log(error)
                        // setErrorMessage(error)
                      })

    } catch (error) {
      toast.error('Server error when get product new arrivals')
    }
  }

  return (
    <div className="w-full pb-20">
      <Heading heading="Our Bestsellers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {bestsellers && bestsellers.map(product => (
          <Product
            _id={product.id}
            img={product.image}
            productName={product.name}
            slug={product.slug}
            price={product.price}
            color={product.color}
            badge={true}
            des={product.description}
            variations={product.variations}
          />

        )
        )}
        {/* <Product
          _id="1012"
          img={bestSellerTwo}
          productName="New Backpack"
          price="180.00"
          color="Gray"
          badge={false}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        />
        <Product
          _id="1013"
          img={bestSellerThree}
          productName="Household materials"
          price="25.00"
          color="Mixed"
          badge={true}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        />
        <Product
          _id="1014"
          img={bestSellerFour}
          productName="Travel Bag"
          price="220.00"
          color="Black"
          badge={false}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        /> */}
      </div>
    </div>
  );
};

export default BestSellers;
