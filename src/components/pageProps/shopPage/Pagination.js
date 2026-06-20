import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import { paginationItems } from "../../../constants";
import axios from 'axios'
import { toast } from "react-toastify";

const items = paginationItems;
const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div key={item._id || item.id} className="w-full">
            <Product
              _id={item._id || item.id}
              img={item.image || item.img}
              productName={item.name}
              price={item.price}
              color={item.bgColor}
              badge={item.badge}
              des={item.description}
              variations={item.variations}
            />
          </div>
        ))}
    </>
  );
}

const Pagination = ({ itemsPerPage, filters }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products when filters change
  useEffect(() => {
    getProducts();

    console.log('products', products)
  }, [filters]); // Only depend on filters, not products

  const getProducts = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const queryParams = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          // Only add filters that have values
          if (value && value !== '' && value !== 'all') {
            // Handle range price
            if (key === 'range_price' && typeof value === 'string' && value.includes(' - ')) {
              const [min, max] = value.split(' - ');
              if (min && max) {
                queryParams.append('min_price', min);
                queryParams.append('max_price', max);
              }
            }
            // Handle array values (like multiple colors or categories)
            else if (Array.isArray(value) && value.length > 0) {
              value.forEach(v => {
                if (v && v !== 'all') {
                  queryParams.append(key, v);
                }
              });
            }
            // Handle regular string/number values
            else {
              queryParams.append(key, value);
            }
          }
        });
      }

      const queryString = queryParams.toString();
      const url = `${BASE_URL}/products${queryString ? '?' + queryString : ''}`;

      console.log('Fetching products from:', url);

      const result = await axios.get(url);

      if (result.status === 200) {
        // Assuming API returns { data: products[], total?: number }
        const productsData = result.data.data || result.data.products || result.data;

        console.log('product', productsData)
        setProducts(productsData);
        setTotalProducts(productsData.length || result.data.total || 0);

        // Reset pagination to first page when filters change
        setItemOffset(0);
        setItemStart(1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products. Please try again.');
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current items based on pagination
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  // Handle page click
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
    setItemStart(newOffset);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        {currentItems && currentItems.length > 0 ? (
          <Items currentItems={currentItems} />
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
          <ReactPaginate
            nextLabel="Next ›"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="‹ Previous"
            pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
            pageClassName="mr-6"
            containerClassName="flex text-base font-semibold font-titleFont py-10"
            activeClassName="bg-black text-white"
            disabledClassName="opacity-50 cursor-not-allowed"
          />

          <p className="text-base font-normal text-lightText">
            Showing {itemOffset + 1} to {Math.min(endOffset, products.length)} of {products.length} products
          </p>
        </div>
      )}
    </div>
  );
};

export default Pagination;
// import React, { useState, useEffect } from "react";
// import ReactPaginate from "react-paginate";
// import Product from "../../home/Products/Product";
// import { paginationItems } from "../../../constants";
// import axios from 'axios'
// import { toast } from "react-toastify";

// const items = paginationItems;
// const BASE_URL = process.env.REACT_APP_SERVER_MODE === "development"
//   ? process.env.REACT_APP_DEV_URL
//   : process.env.REACT_APP_PROD_URL;

// function Items({ currentItems }) {
//   return (
//     <>
//       {currentItems &&
//         currentItems.map((item) => (
//           <div key={item.id} className="w-full">
//             <Product
//               _id={item.id}
//               img={item.image}
//               productName={item.name}
//               price={item.price}
//               color={item.bgColor}
//               badge={item.badge}
//               des={item.description}
//             />
//           </div>
//         ))}
//     </>
//   );
// }

// const Pagination = ({ itemsPerPage, filters }) => {
//   // Here we use item offsets; we could also use page offsets
//   // following the API or data you're working with.
//   const [itemOffset, setItemOffset] = useState(0);
//   const [itemStart, setItemStart] = useState(1);
//   const [products, setProducts] = useState([])
//   const [filters_data, setFilterQuery] = useState({type: '', color: ''})

//   // Simulate fetching items from another resources.
//   // (This could be items from props; or items loaded in a local state
//   // from an API endpoint with useEffect and useState)
//   const endOffset = itemOffset + itemsPerPage;

//   // console.log('BASE_URL', BASE_URL, process.env.VITE_DEV_URL)

//   useEffect(() => {
//     // if(products.length == 0){
//     //   getProducts()
//     // }
//     // if(filters){
//     //   console.log('filters from pagination', filters)
//     //   getProducts()
//     // }
//     getProducts()
//   }, [products, filters])

//   const getProducts = async () => {
//     try {
//       if(filters){
//         // filters.join('')
//         // const keyword = Object.keys(filters).map(filter => Object.values(filters).map(value => {
//         //   setFilterQuery(filters_data.concat(filter + '=' + value + '&'))
//         // }))
//         console.log('filters data', filters)

//         // const params = {};

//         Object.entries(filters).forEach(([key, value]) => {
//           // Only add filters that have values
//           if (value && value !== '' && value !== 'all') {
//             // Handle special cases
//             console.log(key, value)
//             if (key === 'range_price' && value.includes(' - ')) {
//               const [min, max] = value.split(' - ');
//               filters_data.min_price = min;
//               filters_data.max_price = max;
//             }
//             else {
//               console.log(key, value)
//               filters_data[key] = value;
//               console.log('filters_data', filters_data)
//             }
//           }
//         });

//         console.log('Filter params:', filters_data); // Debug log
//         // Object.values(filters)
//         await axios.get(`${BASE_URL}products${filters_data?  + '?' + filters_data : ''}`)
//                     .then(result => {
//                       if(result.status == 200){
//                         setProducts(result.data.data)
//                       }
//                     })
//                     .catch(error => {
//                       console.log(error)
//                     })
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   //   console.log(`Loading items from ${itemOffset} to ${endOffset}`);
//   const currentItems = products.slice(itemOffset, endOffset);
//   const pageCount = Math.ceil(items.length / itemsPerPage);

//   // Invoke when user click to request another page.
//   const handlePageClick = (event) => {
//     const newOffset = (event.selected * itemsPerPage) % items.length;
//     setItemOffset(newOffset);
//     // console.log(
//     //   `User requested page number ${event.selected}, which is offset ${newOffset},`
//     // );
//     setItemStart(newOffset);
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
//         <Items currentItems={currentItems} />
//       </div>
//       <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
//         <ReactPaginate
//           nextLabel=""
//           onPageChange={handlePageClick}
//           pageRangeDisplayed={3}
//           marginPagesDisplayed={2}
//           pageCount={pageCount}
//           previousLabel=""
//           pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
//           pageClassName="mr-6"
//           containerClassName="flex text-base font-semibold font-titleFont py-10"
//           activeClassName="bg-black text-white"
//         />

//         <p className="text-base font-normal text-lightText">
//           Products from {itemStart === 0 ? 1 : itemStart} to {endOffset} of{" "}
//           {items.length}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Pagination;
