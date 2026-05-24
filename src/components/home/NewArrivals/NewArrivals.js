import React from "react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import {
  newArrOne,
  newArrTwo,
  newArrThree,
  newArrFour,
} from "../../../assets/images/index";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_SERVER_MODE == 'development'? process.env.REACT_APP_DEV_URL : process.env.REACT_APP_PROD_URL

const NewArrivals = () => {

  const [new_arrivals, setNewArrivals] = useState([])
  // const [error_message, setErrorMessage] = useState("")

  useEffect(() => {
    getProductsNewArrivals()
    console.log(new_arrivals)
  }, [])

  const getProductsNewArrivals = async () => {
    try {
      await axios.get(`${BASE_URL}products/new-arrivals`)
                      .then((results) => {
                        console.log('results', results)
                        if(results.status == 200){
                          setNewArrivals(results.data.data)
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
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="w-full pb-16">
      <Heading heading="New Arrivals" />
      {/* <Slider {...settings}> */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
          {/* flex justify-center items-center gap-2 px-2 */}
        {new_arrivals.map(product => (
            <Product
              _id={product.id}
              img={product.image}
              productName={product.name}
              slug={product.slug}
              price={product.price}
              color={product.colors[0]}
              badge={true}
              des={product.description}
            />

          ))}
        </div>
        {/* <div className="px-2">
          <Product
            _id="100002"
            img={newArrTwo}
            productName="Smart Watch"
            slug="smart-watch-321"
            price="250.00"
            color="Black"
            badge={true}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div>
        <div className="px-2">
          <Product
            _id="100003"
            img={newArrThree}
            productName="cloth Basket"
            slug="cloth-basket-321"
            price="80.00"
            color="Mixed"
            badge={true}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div>
        <div className="px-2">
          <Product
            _id="100004"
            img={newArrFour}
            productName="Funny toys for babies"
            slug="funny-toys-for-babies-321"
            price="60.00"
            color="Mixed"
            badge={false}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div>
        <div className="px-2">
          <Product
            _id="100005"
            img={newArrTwo}
            productName="Funny toys for babies"
            slug="funny-toys-for-babies-322"
            price="60.00"
            color="Mixed"
            badge={false}
            des="Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic excepturi quibusdam odio deleniti reprehenderit facilis."
          />
        </div> */}
      {/* </Slider> */}
    </div>
  );
};

export default NewArrivals;
