import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

// Helper function to check if a color is valid hex
const isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Predefined color map for better display
const colorMap = {
  "#FFFFF": { label: "Putih", hex: "#FFFFFF" },
  "#FFFF6": { label: "Kuning Muda", hex: "#FFFF66" },
  "#FF0000": { label: "Merah", hex: "#FF0000" },
  "#00FF00": { label: "Hijau", hex: "#00FF00" },
  "#0000FF": { label: "Biru", hex: "#0000FF" },
  "#000000": { label: "Hitam", hex: "#000000" },
  "#FFFFFF": { label: "Putih", hex: "#FFFFFF" },
};

// Predefined size labels
const sizeLabels = {
  "xs": "XS",
  "s": "S",
  "m": "M",
  "l": "L",
  "xl": "XL",
  "xxl": "XXL",
  "xxxl": "XXXL",
  "x": "X",
  "all_size": "All Size",
  // "32": "32",
  // "34": "34",
  // "36": "36",
  // "38": "38",
  // "40": "40"
};

const ProductDetails = () => {
  const location = useLocation();
  const {userEmail, loading} = useSelector(state => state.auth)
  const [prevLocation, setPrevLocation] = useState("");
  const [productInfo, setProductInfo] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const {id} = useParams()
  const navigate = useNavigate()

  // Color and size options with their variations
  const [colorOptions, setColorOptions] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [variations, setVariations] = useState([]);

  useEffect(() => {
    if (location.state?.item) {
      const product = location.state.item;
      setProductInfo(product);
    }else{
      getProduct()
    }

    setPrevLocation(location.pathname);
    setActiveImage(productInfo.img);

    // Initialize variations from product data
    if (productInfo.variations && productInfo.variations.length > 0) {
      setVariations(productInfo.variations);

      // Extract unique colors with their hex values
      const uniqueColorsMap = new Map();
      productInfo.variations.forEach(v => {
        const colorValue = v.color;
        if (!uniqueColorsMap.has(colorValue)) {
          // Get color info from map or use default
          const colorInfo = colorMap[colorValue] || {
            label: isValidHexColor(colorValue) ? "Custom" : colorValue,
            hex: isValidHexColor(colorValue) ? colorValue : "#CCCCCC"
          };
          uniqueColorsMap.set(colorValue, {
            value: colorValue,
            label: colorInfo.label,
            hex: colorInfo.hex,
            originalValue: colorValue
          });
        }
      });
      const uniqueColors = Array.from(uniqueColorsMap.values());
      setColorOptions(uniqueColors);

      // Extract unique sizes with their labels
      const uniqueSizesMap = new Map();
      productInfo.variations.forEach(v => {
        const sizeValue = v.size;
        if (!uniqueSizesMap.has(sizeValue)) {
          uniqueSizesMap.set(sizeValue, {
            value: sizeValue,
            label: sizeLabels[sizeValue] || sizeValue.toUpperCase(),
            originalValue: sizeValue
          });
        }
      });
      const uniqueSizes = Array.from(uniqueSizesMap.values());
      setSizeOptions(uniqueSizes);

      // Set default selection to first available variation
      if (uniqueColors.length > 0 && uniqueSizes.length > 0) {
        // Find first available variation with stock
        const firstAvailableVariation = productInfo.variations.find(v => parseInt(v.stock) > 0);

        if (firstAvailableVariation) {
          setSelectedColor(firstAvailableVariation.color);
          setSelectedSize(firstAvailableVariation.size);
        } else {
          // If no stock, still select first variation but show as out of stock
          setSelectedColor(uniqueColors[0].value);
          setSelectedSize(uniqueSizes[0].value);
        }
      }
    } else {
      // Fallback for products without variations
      const colors = productInfo.colors?.map(c => {
        const colorInfo = colorMap[c] || { label: c, hex: "#CCCCCC" };
        return { value: c, label: colorInfo.label, hex: colorInfo.hex };
      }) || [];

      const sizes = productInfo.sizes?.map(s => ({
        value: s,
        label: sizeLabels[s] || s.toUpperCase()
      })) || [];

      setColorOptions(colors);
      setSizeOptions(sizes);

      if (colors.length > 0) setSelectedColor(colors[0].value);
      if (sizes.length > 0) setSelectedSize(sizes[0].value);
    }


    console.log('variations', variations, productInfo)
  }, [location]);

  const getProduct = async () => {
    try {

      await axios.get(`${BASE_URL}/products/${id}`)
                  .then(result => {
                    if(result.status == 200){
                      setProductInfo(result.data.data)
                    }
                  })
                  .catch(error => {
                    toast.error("Failed, Failed when get product detail")
                  })

    } catch (error) {
      toast.error("Error, Error when get product: "+ error)
    }
  }

  // Update selected variation when color or size changes
  useEffect(() => {
    if (selectedColor && selectedSize && variations.length > 0) {
      const variation = variations.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariation(variation || null);
      // Reset quantity when variation changes
      setQuantity(1);
    }
  }, [selectedColor, selectedSize, variations]);

  const handleColorSelect = (color) => {
    setSelectedColor(color.value);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size.value);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    const maxStock = selectedVariation?.stock ? parseInt(selectedVariation.stock) : (productInfo?.stock || 0);
    if (value > 0 && value <= maxStock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    const maxStock = selectedVariation?.stock ? parseInt(selectedVariation.stock) : (productInfo?.stock || 0);
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (variations.length > 0 && !selectedVariation) {
      alert("Please select color and size");
      return;
    }

    const currentStock = selectedVariation?.stock ? parseInt(selectedVariation.stock) : (productInfo?.stock || 0);

    if (currentStock <= 0) {
      alert("Product is out of stock");
      return;
    }

    const cartItem = {
      id: productInfo._id,
      name: productInfo.name,
      price: selectedVariation?.price ? parseFloat(selectedVariation.price) : productInfo.price,
      originalPrice: productInfo.originalPrice,
      image: productInfo.img,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      variationId: selectedVariation?.id,
      sku: selectedVariation?.sku || productInfo.sku,
      stock: currentStock
    };

    // Add to cart logic here
    console.log("Added to cart:", cartItem);
    // alert(`Added ${quantity} item(s) to cart!`);

    console.log('userEmail', userEmail)

    if(userEmail == null ){
      console.log('masuk')
      toast.error("Gagal, Anda belum login.")
      navigate('/login')

      return
    }else{

      console.log('userEmail', userEmail)

      console.log('variations', selectedVariation)

      // setSelectedVariation(selectedVariation.map(var => {color: var.color, size: var.size}))

      try {
        await axios.post(`${BASE_URL}/cart/add`, {product_id: cartItem.id, variations: {color: selectedVariation.color, size: selectedVariation.size}, quantity: cartItem.quantity, price: cartItem.price}, {withCredentials: true})
                    .then(result => {
                      console.log(result)
                      if(result.status === 200){

                        toast.success("Berhasil, Berhasil manambahkan produk ke keranjang.")
                        navigate('/cart')
                      }
                    })
                    .catch(error => {
                      console.log(error)
                      toast.error('Failed, Failed add product to cart: ' + error)
                    })

      } catch (error) {
        toast.error('Failed, Failed add product to cart: ' + error)
      }
    }


  };

  const getCurrentPrice = () => {
    const price = selectedVariation?.price ? parseFloat(selectedVariation.price) : productInfo?.price;
    return price || 0;
  };

  const getCurrentStock = () => {
    const stock = selectedVariation?.stock ? parseInt(selectedVariation.stock) : productInfo?.stock;
    return stock || 0;
  };

  const getCurrentSku = () => {
    return selectedVariation?.sku || productInfo?.sku;
  };

  if (!productInfo) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 h-full pb-10 bg-gray-100 p-4 rounded-lg">
          {/* Product Images Section */}
          <div className="h-full">
            <div className="sticky top-20">
              <img
                className="w-full h-auto object-cover rounded-lg shadow-lg"
                src={activeImage}
                alt={productInfo.name}
              />
              {/* Thumbnail images if available */}
              {productInfo.gallery && productInfo.gallery.length > 0 && (
                <div className="flex gap-2 mt-4">
                  <img
                    src={productInfo.img}
                    alt="thumbnail"
                    className="w-20 h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
                    onClick={() => setActiveImage(productInfo.img)}
                  />
                  {productInfo.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`thumbnail-${idx}`}
                      className="w-20 h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
                      onClick={() => setActiveImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="h-full w-full flex flex-col gap-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{productInfo.name}</h1>
              {getCurrentSku() && (
                <p className="text-sm text-gray-500 mt-1">SKU: {getCurrentSku()}</p>
              )}
            </div>

            {/* Rating */}
            {productInfo.rating && (
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {"★".repeat(Math.floor(productInfo.rating))}
                  {"☆".repeat(5 - Math.floor(productInfo.rating))}
                </div>
                <span className="text-sm text-gray-600">({productInfo.reviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-red-600">
                Rp {getCurrentPrice().toLocaleString()}
              </span>
              {productInfo.originalPrice > getCurrentPrice() && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    Rp {productInfo.originalPrice?.toLocaleString()}
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    {Math.round(((productInfo.originalPrice - getCurrentPrice()) / productInfo.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {productInfo.shortDescription && (
              <p className="text-gray-600">{productInfo.shortDescription}</p>
            )}

            {/* Color Selection */}
            {colorOptions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Color: <span className="font-normal text-gray-600">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => {
                    const isAvailable = variations.some(v => v.color === color.value && parseInt(v.stock) > 0);
                    return (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color)}
                        className={`group relative flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${
                          selectedColor === color.value
                            ? "ring-2 ring-blue-500 bg-blue-50"
                            : "hover:bg-gray-100"
                        } ${!isAvailable && variations.length > 0 ? "opacity-50" : ""}`}
                        disabled={!isAvailable && variations.length > 0}
                      >
                        <div
                          className="w-12 h-12 rounded-full border-2 shadow-md transition-transform group-hover:scale-105"
                          style={{
                            backgroundColor: color.hex,
                            borderColor: selectedColor === color.value ? "#3b82f6" : "#e5e7eb"
                          }}
                        />
                        <span className="text-xs text-gray-600">{color.label}</span>
                        {!isAvailable && variations.length > 0 && (
                          <span className="text-xs text-red-500 absolute -top-1 -right-1">out</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizeOptions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Size: <span className="font-normal text-gray-600">{selectedSize?.toUpperCase()}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sizeOptions.map((size) => {
                    const isAvailable = variations.some(v => v.size === size.value && v.color === selectedColor && parseInt(v.stock) > 0);
                    const hasStock = variations.some(v => v.size === size.value && v.color === selectedColor);
                    const inStock = hasStock ? parseInt(variations.find(v => v.size === size.value && v.color === selectedColor)?.stock) > 0 : false;

                    return (
                      <button
                        key={size.value}
                        onClick={() => inStock && handleSizeSelect(size)}
                        disabled={!inStock}
                        className={`min-w-[60px] px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                          selectedSize === size.value
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : inStock
                            ? "border-gray-300 hover:border-gray-400 text-gray-700"
                            : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                        }`}
                      >
                        {size.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getCurrentStock() > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-sm font-medium">
                {getCurrentStock() > 0 ? `In Stock (${getCurrentStock()} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            {getCurrentStock() > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3">Quantity:</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 flex items-center justify-center text-xl font-semibold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max={getCurrentStock()}
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 flex items-center justify-center text-xl font-semibold"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    Max {getCurrentStock()} available
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={getCurrentStock() === 0}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  getCurrentStock() > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Add to Cart
              </button>
              <button className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Product Details Accordion */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h3 className="font-semibold text-gray-800">Product Details</h3>
                  <span className="transition group-open:rotate-180">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-3 text-gray-600 space-y-2">
                  <p>{productInfo.des}</p>
                  {productInfo.material && (
                    <p><span className="font-semibold">Material:</span> {productInfo.material}</p>
                  )}
                  {productInfo.careInstructions && (
                    <p><span className="font-semibold">Care Instructions:</span> {productInfo.careInstructions}</p>
                  )}
                </div>
              </details>
            </div>

            {/* Size Guide Link */}
            {sizeOptions.length > 0 && (
              <button className="text-left text-sm text-blue-600 hover:text-blue-700">
                Size Guide →
              </button>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-8">
          <ProductsOnSale />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
// import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
// import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";

// const ProductDetails = () => {
//   const location = useLocation();
//   const [prevLocation, setPrevLocation] = useState("");
//   const [productInfo, setProductInfo] = useState([]);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedVariation, setSelectedVariation] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [activeImage, setActiveImage] = useState("");

//   // Color and size options with their variations
//   const [colorOptions, setColorOptions] = useState([]);
//   const [sizeOptions, setSizeOptions] = useState([]);
//   const [variations, setVariations] = useState([]);

//   useEffect(() => {
//     if (location.state?.item) {
//       const product = location.state.item;

//       setProductInfo(product);
//       setPrevLocation(location.pathname);
//       setActiveImage(product.img);

//       // Initialize variations from product data
//       if (product.variations && product.variations.length > 0) {
//         setVariations(product.variations);

//         // Extract unique colors and sizes from variations
//         const uniqueColors = [...new Map(product.variations.map(v => [v.color])).values()];
//         const uniqueSizes = [...new Map(product.variations.map(v => [v.size])).values()];

//         setColorOptions(uniqueColors);
//         setSizeOptions(uniqueSizes);

//         // Set default selection
//         // if (product.colors.length > 0) {
//         //   setSelectedColor(product.colors[0].value);
//         // }
//         // if (product.sizes.length > 0) {
//         //   setSelectedSize(product.sizes[0].value);
//         // }

//         console.log('product', product, product.variations, productInfo, selectedVariation, colorOptions, sizeOptions)
//       } else {
//         // Fallback for products without variations
//         setColorOptions(product.colors?.map(c => ({ value: c, label: c })) || []);
//         setSizeOptions(product.sizes?.map(s => ({ value: s, label: s })) || []);
//       }


//     }

//   }, [location]);

//   // Update selected variation when color or size changes
//   useEffect(() => {
//     if (selectedColor && selectedSize && variations.length > 0) {
//       const variation = variations.find(
//         v => v.color === selectedColor && v.size === selectedSize
//       );
//       setSelectedVariation(variation || null);

//       // Reset quantity when variation changes
//       setQuantity(1);
//     }

//     console.log('productInfo', productInfo, variations)
//   }, [selectedColor, selectedSize, variations]);

//   const handleColorSelect = (color) => {
//     setSelectedColor(color.value);
//   };

//   const handleSizeSelect = (size) => {
//     setSelectedSize(size.value);
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value);
//     if (value > 0 && value <= (selectedVariation?.stock || productInfo.stock || 0)) {
//       setQuantity(value);
//     }
//   };

//   const incrementQuantity = () => {
//     if (quantity < (selectedVariation?.stock || productInfo.stock || 0)) {
//       setQuantity(quantity + 1);
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(quantity - 1);
//     }
//   };

//   const handleAddToCart = () => {
//     if (variations.length > 0 && !selectedVariation) {
//       alert("Please select color and size");
//       return;
//     }

//     if ((selectedVariation?.stock || productInfo.stock) <= 0) {
//       alert("Product is out of stock");
//       return;
//     }

//     const cartItem = {
//       id: productInfo.id,
//       name: productInfo.name,
//       price: selectedVariation?.price || productInfo.price,
//       originalPrice: productInfo.originalPrice,
//       image: productInfo.img,
//       color: selectedColor,
//       size: selectedSize,
//       quantity: quantity,
//       variationId: selectedVariation?.id,
//       sku: selectedVariation?.sku || productInfo.sku,
//       stock: selectedVariation?.stock || productInfo.stock
//     };

//     // Add to cart logic here
//     console.log("Added to cart:", cartItem);
//     alert(`Added ${quantity} item(s) to cart!`);
//   };

//   const getCurrentPrice = () => {
//     return selectedVariation?.price || productInfo.price;
//   };

//   const getCurrentStock = () => {
//     return selectedVariation?.stock || productInfo.stock;
//   };

//   const getCurrentSku = () => {
//     return selectedVariation?.sku || productInfo.sku;
//   };

//   return (
//     <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
//       <div className="max-w-container mx-auto px-4">
//         <div className="xl:-mt-10 -mt-7">
//           <Breadcrumbs title="" prevLocation={prevLocation} />
//         </div>
//         <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 h-full pb-10 bg-gray-100 p-4 rounded-lg">
//           {/* Product Images Section */}
//           <div className="h-full">
//             <div className="sticky top-20">
//               <img
//                 className="w-full h-auto object-cover rounded-lg shadow-lg"
//                 src={activeImage}
//                 alt={productInfo.name}
//               />
//               {/* Thumbnail images if available */}
//               {productInfo.gallery && productInfo.gallery.length > 0 && (
//                 <div className="flex gap-2 mt-4">
//                   <img
//                     src={productInfo.img}
//                     alt="thumbnail"
//                     className="w-20 h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
//                     onClick={() => setActiveImage(productInfo.img)}
//                   />
//                   {productInfo.gallery.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`thumbnail-${idx}`}
//                       className="w-20 h-20 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
//                       onClick={() => setActiveImage(img)}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Product Info Section */}
//           <div className="h-full w-full flex flex-col gap-6">
//             {/* Product Title */}
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">{productInfo.name}</h1>
//               {getCurrentSku() && (
//                 <p className="text-sm text-gray-500 mt-1">SKU: {getCurrentSku()}</p>
//               )}
//             </div>

//             {/* Rating */}
//             {productInfo.rating && (
//               <div className="flex items-center gap-2">
//                 <div className="flex text-yellow-400">
//                   {"★".repeat(Math.floor(productInfo.rating))}
//                   {"☆".repeat(5 - Math.floor(productInfo.rating))}
//                 </div>
//                 <span className="text-sm text-gray-600">({productInfo.reviews} reviews)</span>
//               </div>
//             )}

//             {/* Price */}
//             <div className="flex items-center gap-3">
//               <span className="text-3xl font-bold text-red-600">
//                 Rp {getCurrentPrice()?.toLocaleString()}
//               </span>
//               {productInfo.originalPrice > getCurrentPrice() && (
//                 <>
//                   <span className="text-lg text-gray-400 line-through">
//                     Rp {productInfo.originalPrice?.toLocaleString()}
//                   </span>
//                   <span className="text-sm text-green-600 font-semibold">
//                     {Math.round(((productInfo.originalPrice - getCurrentPrice()) / productInfo.originalPrice) * 100)}% OFF
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Short Description */}
//             {productInfo.shortDescription && (
//               <p className="text-gray-600">{productInfo.shortDescription}</p>
//             )}

//             {/* Color Selection */}
//             {colorOptions.length > 0 && (
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800 mb-3">
//                   Color: <span className="font-normal text-gray-600">{selectedColor}</span>
//                 </h3>
//                 <div className="flex flex-wrap gap-3">
//                   {colorOptions.map((color) => (
//                     <button
//                       key={color.value}
//                       onClick={() => handleColorSelect(color)}
//                       className={`group relative flex flex-col items-center gap-2 p-2 rounded-lg transition-all ${
//                         selectedColor === color.value
//                           ? "ring-2 ring-blue-500 bg-blue-50"
//                           : "hover:bg-gray-100"
//                       }`}
//                     >
//                       <div
//                         className="w-12 h-12 rounded-full border-2 shadow-md transition-transform group-hover:scale-105"
//                         style={{
//                           backgroundColor: color.hex || color.value,
//                           borderColor: selectedColor === color.value ? "#3b82f6" : "#e5e7eb"
//                         }}
//                       />
//                       <span className="text-xs text-gray-600">{color.label}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Size Selection */}
//             {sizeOptions.length > 0 && (
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800 mb-3">
//                   Size: <span className="font-normal text-gray-600">{selectedSize?.toUpperCase()}</span>
//                 </h3>
//                 <div className="flex flex-wrap gap-3">
//                   {sizeOptions.map((size) => {
//                     const isAvailable = variations.some(v => v.size === size.value && v.stock > 0);
//                     return (
//                       <button
//                         key={size.value}
//                         onClick={() => isAvailable && handleSizeSelect(size)}
//                         disabled={!isAvailable}
//                         className={`min-w-[60px] px-4 py-2 rounded-lg border-2 font-medium transition-all ${
//                           selectedSize === size.value
//                             ? "border-blue-500 bg-blue-50 text-blue-700"
//                             : isAvailable
//                             ? "border-gray-300 hover:border-gray-400 text-gray-700"
//                             : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
//                         }`}
//                       >
//                         {size.label}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* Stock Status */}
//             <div className="flex items-center gap-2">
//               <div className={`w-2 h-2 rounded-full ${getCurrentStock() > 0 ? "bg-green-500" : "bg-red-500"}`} />
//               <span className="text-sm font-medium">
//                 {getCurrentStock() > 0 ? `In Stock (${getCurrentStock()} available)` : "Out of Stock"}
//               </span>
//             </div>

//             {/* Quantity Selector */}
//             {getCurrentStock() > 0 && (
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800 mb-3">Quantity:</h3>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={decrementQuantity}
//                     className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 flex items-center justify-center text-xl font-semibold"
//                   >
//                     -
//                   </button>
//                   <input
//                     type="number"
//                     value={quantity}
//                     onChange={handleQuantityChange}
//                     className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min="1"
//                     max={getCurrentStock()}
//                   />
//                   <button
//                     onClick={incrementQuantity}
//                     className="w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 flex items-center justify-center text-xl font-semibold"
//                   >
//                     +
//                   </button>
//                   <span className="text-sm text-gray-500 ml-2">
//                     Max {getCurrentStock()} available
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex gap-4 pt-4">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={getCurrentStock() === 0}
//                 className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
//                   getCurrentStock() > 0
//                     ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 Add to Cart
//               </button>
//               <button className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all active:scale-95">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//               </button>
//             </div>

//             {/* Product Details Accordion */}
//             <div className="border-t border-gray-200 pt-4 mt-4">
//               <details className="group">
//                 <summary className="flex justify-between items-center cursor-pointer list-none">
//                   <h3 className="font-semibold text-gray-800">Product Details</h3>
//                   <span className="transition group-open:rotate-180">
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                     </svg>
//                   </span>
//                 </summary>
//                 <div className="mt-3 text-gray-600 space-y-2">
//                   <p>{productInfo.des}</p>
//                   {productInfo.material && (
//                     <p><span className="font-semibold">Material:</span> {productInfo.material}</p>
//                   )}
//                   {productInfo.careInstructions && (
//                     <p><span className="font-semibold">Care Instructions:</span> {productInfo.careInstructions}</p>
//                   )}
//                 </div>
//               </details>
//             </div>

//             {/* Size Guide Link */}
//             {sizeOptions.length > 0 && (
//               <button className="text-left text-sm text-blue-600 hover:text-blue-700">
//                 Size Guide →
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Related Products Section */}
//         <div className="mt-8">
//           <ProductsOnSale />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

// // import React, { useEffect, useState } from "react";
// // import { useLocation } from "react-router-dom";
// // import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
// // import ProductInfo from "../../components/pageProps/productDetails/ProductInfo";
// // import ProductsOnSale from "../../components/pageProps/productDetails/ProductsOnSale";

// // const ProductDetails = () => {
// //   const location = useLocation();
// //   const [prevLocation, setPrevLocation] = useState("");
// //   const [productInfo, setProductInfo] = useState([]);

// //   useEffect(() => {
// //     setProductInfo(location.state.item);
// //     setPrevLocation(location.pathname);
// //   }, [location, productInfo]);

// //   return (
// //     <div className="w-full mx-auto border-b-[1px] border-b-gray-300">
// //       <div className="max-w-container mx-auto px-4">
// //         <div className="xl:-mt-10 -mt-7">
// //           <Breadcrumbs title="" prevLocation={prevLocation} />
// //         </div>
// //         <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
// //           {/* <div className="h-full">
// //             <ProductsOnSale />
// //           </div> */}
// //           <div className="col-span-3 h-full">
// //             {/* xl:col-span-2 */}
// //             <img
// //               className="w-full h-full object-cover"
// //               src={productInfo.img}
// //               alt={productInfo.img}
// //             />
// //           </div>
// //           <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-14 flex flex-col gap-6 justify-center">
// //             <ProductInfo productInfo={productInfo} />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetails;
