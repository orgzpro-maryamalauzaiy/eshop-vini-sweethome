import React, { useState } from "react";
import { motion } from "framer-motion";
import NavTitle from "./NavTitle";

const Brand = ({getFilters}) => {
  const [showBrands, setShowBrands] = useState(true);
  const brands = [
    {
      _id: 9006,
      title: "Apple",
      code_model: "homedress1"
    },
    {
      _id: 9007,
      title: "Ultron",
      code_model: "homedress2"
    },
    {
      _id: 9008,
      title: "Unknown",
      code_model: "homedress3"
    },
    {
      _id: 9009,
      title: "Shoppers Home",
      code_model: "homedress3"
    },
    {
      _id: 9010,
      title: "Hoichoi",
      code_model: "homedress4"
    },
  ];

  const handleFilterType = (type) => {
    if(type){
      // filters.type = type
      getFilters({type: type})
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
                onClick={() => handleFilterType(item._id)}
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
