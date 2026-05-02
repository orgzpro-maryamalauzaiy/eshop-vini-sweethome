import React from "react";
import { useState, useEffect } from "react";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  spfOne,
  spfTwo,
  spfThree,
  spfFour,
} from "../../../assets/images/index";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_SERVER_MODE == 'development'? process.env.REACT_APP_DEV_URL : process.env.REACT_APP_PROD_URL

const SpecialOffers = () => {
  const [specialoffers, setSpecialOffers] = useState([])
    // const [error_message, setErrorMessage] = useState("")

  useEffect(() => {
    getProductsSpecialOffers()
    console.log('specialoffers', specialoffers)
  }, [])

  const getProductsSpecialOffers = async () => {
    try {
      await axios.get(`${BASE_URL}products/special-offers`)
                      .then((results) => {
                        console.log('results from special offer: ', results)
                        if(results.status == 200){
                          setSpecialOffers(results.data.data)
                        }
                        console.log('specialoffers', specialoffers)
                      })
                      .catch((error) => {
                        console.log(error)
                        // setErrorMessage(error)
                      })

    } catch (error) {
      toast.error('Server error when get product new arrivals. ' + error)
    }
  }

  return (
    <div className="w-full pb-20">
      <Heading heading="Special Offers" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {specialoffers && specialoffers.map(product => (
          <Product
            _id={product.id}
            img={product.image}
            productName={product.name}
            price={product.price}
            color={product.color}
            badge={true}
            des={product.description}
          />

        )
        )}
        {/* {specialoffers & specialoffers.map(product => (
            <Product
            _id={product.id}
            img={product.image}
            productName={product.name}
            price={product.price}
            color={product.colors}
            badge={true}
            des={product.description}
          />
          )
        )} */}
        {/* <Product
          _id="1102"
          img={spfTwo}
          productName="Tea Table"
          price="180.00"
          color="Gray"
          badge={true}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        />
        <Product
          _id="1103"
          img={spfThree}
          productName="Headphones"
          price="25.00"
          color="Mixed"
          badge={true}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        />
        <Product
          _id="1104"
          img={spfFour}
          productName="Sun glasses"
          price="220.00"
          color="Black"
          badge={true}
          des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
        /> */}
      </div>
    </div>
  );
};

export default SpecialOffers;
