import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import { paginationItems } from "../../../constants";
import axios from 'axios'
import { toast } from "react-toastify";

const items = paginationItems;
const BASE_URL = process.env.REACT_APP_SERVER_MODE === "development"
  ? process.env.REACT_APP_DEV_URL
  : process.env.REACT_APP_PROD_URL;

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item.id} className="w-full">
            <Product
              _id={item.id}
              img={item.image}
              productName={item.name}
              price={item.price}
              color={item.bgColor}
              badge={item.badge}
              des={item.description}
            />
          </div>
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage, filters }) => {
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const [products, setProducts] = useState([])
  const [filters_data, setFilterQuery] = useState('')

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;

  useEffect(() => {
    if(products.length == 0){
      getProducts()
    }
    console.log('BASE_URL', BASE_URL, process.env.VITE_DEV_URL)
    if(filters){
      console.log('filters', filters)
    }
  }, [products, filters])

  const getProducts = async () => {
    try {
      if(filters){
        // filters.join('')
        const keyword = Object.keys(filters).map(filter => Object.values(filters).map(value => {
          filters_data.concat(filter + '=' + value + '&')
        }))
        console.log('filters_data', filters_data)
        // Object.values(filters)
      }
      await axios.get(`${BASE_URL}products` + '?' + filters_data)
                  .then(result => {
                    if(result.status == 200){
                      setProducts(result.data.data)
                    }
                  })
                  .catch(error => {
                    console.log(error)
                  })
    } catch (error) {
      console.log(error)
    }
  }
  //   console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset},`
    // );
    setItemStart(newOffset);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        <Items currentItems={currentItems} />
      </div>
      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />

        <p className="text-base font-normal text-lightText">
          Products from {itemStart === 0 ? 1 : itemStart} to {endOffset} of{" "}
          {items.length}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
