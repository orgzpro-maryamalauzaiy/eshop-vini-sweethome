import React from "react";
import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Price from "./shopBy/Price";

const ShopSideNav = ({filters, getFilters}) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <Category icons={false} filters={filters} getFilters={getFilters} />
      <Color filters={filters} getFilter={getFilters} />
      <Brand filters={filters} getFilters={getFilters} />
      <Price filters={filters} getFilters={getFilters} />
    </div>
  );
};

export default ShopSideNav;
