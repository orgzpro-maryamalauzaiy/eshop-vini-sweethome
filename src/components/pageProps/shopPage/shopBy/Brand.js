import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";
import { toast } from "react-toastify";

const Brand = ({filters, getFilters}) => {
  const [showBrands, setShowBrands] = useState(true);
  const brands = [
    {
      _id: 9006,
      title: "Homedress",
      code_model: "homedress"
    },
    {
      _id: 9007,
      title: "Homegown",
      code_model: "homedress2"
    },
    {
      _id: 9008,
      title: "Hair Ribbon",
      code_model: "hair-ribbon"
    },
    // {
    //   _id: 9009,
    //   title: "Shoppers Home",
    //   code_model: "homedress3"
    // },
    // {
    //   _id: 9010,
    //   title: "Hoichoi",
    //   code_model: "homedress4"
    // },
  ];

  // const getItemTypes = async () => {
  //   try {

  //     await axios.get(`${BASE_URL}/product`)

  //   } catch (error) {
  //     toast.error("Failed, failed to get item types")
  //   }
  // }

  const handleFilterType = (type) => {
    if(type){
      // filters.type = type
      getFilters({...filters, type: type})
    }
    // setShowSubCatOne(!showSubCatOne)
  }

  return (
    <div>
      <div
        onClick={() => setShowBrands(!showBrands)}
        className="cursor-pointer"
      >
        <NavTitle title="Shop by Brand" icons={true} />
      </div>
      {showBrands && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
            {brands.map((item) => (
              <li
                key={item._id}
                className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
                onClick={() => handleFilterType(item.code_model)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Brand;
