import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import Pagination from "../../components/pageProps/shopPage/Pagination";
import ProductBanner from "../../components/pageProps/shopPage/ProductBanner";
import ShopSideNav from "../../components/pageProps/shopPage/ShopSideNav";
import { useParams, useSearchParams } from "react-router-dom";

const Shop = () => {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get('type')
  const itemsPerPageFromBanner = (itemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };
  const [filters, setFilters] = useState()
  // {
  //   color: "",
  //   brand: "",
  //   range_price: ""
  // }

  useEffect(() => {
    console.log('params', type, filters)
    if(type){
      getFilters({type})
    }

  }, [filters, type])

  const getFilters = async (filters) => {
    if(filters){
      console.log('filters from shop', filters)
      setFilters(filters)
    }
  }

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Products" />
      {/* ================= Products Start here =================== */}
      <div className="w-full h-full flex pb-20 gap-10">
        <div className="w-[20%] lgl:w-[25%] hidden mdl:inline-flex h-full">
          <ShopSideNav filters={filters} getFilters={getFilters}/>
        </div>
        <div className="w-full mdl:w-[80%] lgl:w-[75%] h-full flex flex-col gap-10">
          <ProductBanner itemsPerPageFromBanner={itemsPerPageFromBanner} />
          <Pagination itemsPerPage={itemsPerPage} filters={filters} />
        </div>
    </div>
      {/* ================= Products End here ===================== */}
    </div>
  );
};

export default Shop;
