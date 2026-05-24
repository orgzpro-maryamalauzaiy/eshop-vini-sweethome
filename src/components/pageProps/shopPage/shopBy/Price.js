import React from "react";
import NavTitle from "./NavTitle";
import { formatCurrency } from "../../../../utils/formatCurrency";

const Price = ({filters, getFilters}) => {
  const priceList = [
    {
      _id: 950,
      priceOne: 20000,
      priceTwo: 49999,
    },
    {
      _id: 951,
      priceOne: 50000,
      priceTwo: 99999,
    },
    {
      _id: 952,
      priceOne: 100000,
      priceTwo: 199999,
    },
    {
      _id: 953,
      priceOne: 200000,
      priceTwo: 399999,
    },
    {
      _id: 954,
      priceOne: 400000,
      priceTwo: 599999,
    },
    {
      _id: 955,
      priceOne: 600000,
      priceTwo: 1000000,
    },
  ];
  // const priceList = [
  //   {
  //     _id: 950,
  //     priceOne: 0.0,
  //     priceTwo: 49.99,
  //   },
  //   {
  //     _id: 951,
  //     priceOne: 50.0,
  //     priceTwo: 99.99,
  //   },
  //   {
  //     _id: 952,
  //     priceOne: 100.0,
  //     priceTwo: 199.99,
  //   },
  //   {
  //     _id: 953,
  //     priceOne: 200.0,
  //     priceTwo: 399.99,
  //   },
  //   {
  //     _id: 954,
  //     priceOne: 400.0,
  //     priceTwo: 599.99,
  //   },
  //   {
  //     _id: 955,
  //     priceOne: 600.0,
  //     priceTwo: 1000.0,
  //   },
  // ];

  const handleFilterPrice = (range_price) => {

    if(range_price){
      getFilters({...filters, range_price})
    }

  }
  return (
    <div className="cursor-pointer">
      <NavTitle title="Shop by Price" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {priceList.map((item) => (
            <li
              key={item._id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
              onClick={() => handleFilterPrice(`${item.priceOne} - ${item.priceTwo}`)}
            >
              {formatCurrency(item.priceOne)} - {formatCurrency(item.priceTwo)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;
