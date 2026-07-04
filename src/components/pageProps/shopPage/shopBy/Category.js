import React, { useState, useEffect } from "react";
// import { FaPlus } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

const Category = ({filters, getFilters}) => {
  const [showSubCatOne, setShowSubCatOne] = useState(false);
  const [categories, setNavCategories] = useState([])
  const items = [
    {
      _id: 990,
      title: "New Arrivals",
      icons: true,
    },
    {
      _id: 991,
      title: "Gudgets",
    },
    {
      _id: 992,
      title: "Accessories",
      icons: true,
    },
    {
      _id: 993,
      title: "Electronics",
    },
    {
      _id: 994,
      title: "Others",
    },
  ];

  useEffect(() => {
    getNavigationCategories()
  }, [])

  const getNavigationCategories = async () => {
    try {

      await axios.get(`${BASE_URL}/categories?pin=side-nav`)
                  .then(result => {
                    if(result.status == 200){
                      setNavCategories(result.data.data)
                    }
                  })
                  .catch(error => {
                    toast.error('Failed, failed to get categories')
                  })

    } catch (error) {

      toast.error('Failed, failed to get categories')
    }
  }

  const handleFilterCategory = (category) => {
    if(category){
      // filters.category = category
      getFilters({...filters, category_id: category})
    }
    setShowSubCatOne(!showSubCatOne)
  }
  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" icons={false} />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {categories.map(({ id, name }) => (
            <li
              key={id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between"
              onClick={() => handleFilterCategory(id)}
            >
              {name}
              {/* {icons && (
                <span
                  onClick={() => handleFilterCategory(_id)}
                  className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300"
                >
                  <ImPlus />
                </span>
              )} */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
