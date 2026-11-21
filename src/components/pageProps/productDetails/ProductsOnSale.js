import React, { useState, useEffect } from "react";
import { SplOfferData } from "../../../constants";
import axios from "axios";
import { toast } from "react-toastify";
import { formatCurrency } from "../../../utils/formatCurrency";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

const ProductsOnSale = ({product}) => {

  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() =>{

    getRelatedProducts({product_id: product})

  }, [product])


  const getRelatedProducts = async ({product_id}) => {

    try {

      await axios.get(`${BASE_URL}/products/related/${product_id}`)
                  .then(result => {
                    if(result.status == 200){
                      setRelatedProducts(result.data.data)
                    }
                  })
                  .catch(error =>
                  {
                    toast.error('Failed to load related products: ' + error)
                  }
                  )

    } catch (error) {
      toast.error('Failed to load related products: ' + error)
    }

  }

  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Items you might buy
      </h3>
      <div className="flex flex-col gap-2">
        {relatedProducts.lenght > 0 ? relatedProducts.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2"
          >
            <div>
              <img className="w-24" src={item.thumbnail} alt={item.thumbnail} />
            </div>
            <div className="flex flex-col gap-2 font-titleFont">
              <p className="text-base font-medium">{item.name}</p>
              <p className="text-sm font-semibold">{formatCurrency(item.price, 'IDR')}</p>
            </div>
          </div>
        )) :

        <div>No Items</div>

        }
      </div>
    </div>
  );
};

export default ProductsOnSale;
