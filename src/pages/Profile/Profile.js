import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

const Profile = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  const [me, setMe] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    province: "",
    city_id: "",
    country: "",
    zip: ""
  });
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ========== Error States Start here ============
  const [errFull_name, setErrfull_name] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errAddresss, setErrAddresss] = useState("");
  const [errPhoneNumber, setErrPhoneNumber] = useState("");
  const [errProvince, setErrProvince] = useState("");
  const [errCity, setErrCity] = useState("");
  const [errCountry, setErrCountry] = useState("");
  const [errZip, setErrZip] = useState("");
  // ========== Error States End here ==============
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    getProfile();
    getCities();
  }, []);

  const getProfile = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/accounts/profile`, { withCredentials: true });
      console.log('profile result', result);
      if (result.status === 200) {
        setMe(result.data.data);
      }
    } catch (error) {
      toast.error("Failed when get profile: " + (error.response?.data?.message || error.message));
    }
  };

  const getCities = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/cities`);
      console.log('cities result', result);
      setCities(result.data.data);
    } catch (error) {
      toast.error('Failed get cities: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFormData = (name, value) => {
    setMe(prevMe => ({
      ...prevMe,
      [name]: value
    }));

    // Clear errors when user starts typing
    switch(name) {
      case 'full_name':
        setErrfull_name("");
        break;
      case 'email':
        setErrEmail("");
        break;
      case 'phone_number':
        setErrPhoneNumber("");
        break;
      case 'address':
        setErrAddresss("");
        break;
      case 'province':
        setErrProvince("");
        break;
      case 'city_id':
        setErrCity("");
        break;
      case 'country':
        setErrCountry("");
        break;
      case 'zip':
        setErrZip("");
        break;
      default:
        break;
    }
  };

  // ================= Email Validation start here =============
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };
  // ================= Email Validation End here ===============

  const updateProfile = async (e) => {
    e.preventDefault();

    let isValid = true;

    // Validation checks
    if (!me.full_name) {
      setErrfull_name("Nama wajib diisi");
      isValid = false;
    }
    if (!me.email) {
      setErrEmail("Email wajib diisi");
      isValid = false;
    } else {
      if (!EmailValidation(me.email)) {
        setErrEmail("Email tidak valid");
        isValid = false;
      }
    }
    if (!me.phone_number) {
      setErrPhoneNumber("No. Hp wajib diisi");
      isValid = false;
    }
    if (!me.address) {
      setErrAddresss("Alamat wajib diisi");
      isValid = false;
    }
    if (!me.zip) {
      setErrZip("Kode Pos wajib diisi");
      isValid = false;
    }

    if (isValid) {
      setIsLoading(true);
      try {
        const response = await axios.patch(`${BASE_URL}/accounts/profile`, {
          full_name: me.full_name,
          email: me.email,
          phone_number: me.phone_number,
          address: me.address,
          province: me.province,
          city_id: me.city_id,
          country: me.country,
          zip: me.zip
        }, { withCredentials: true });

        if (response.status === 200) {
          setSuccessMsg('Alhamdulillah, update profile berhasil');
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMsg(''), 3000);
          // Refresh profile data
          getProfile();
        }
      } catch (error) {
        toast.error('Failed to update profile: ' + (error.response?.data?.message || error.message));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Profile" prevLocation={prevLocation} />
      {successMsg && (
        <p className="pb-20 w-full font-medium text-green-500">{successMsg}</p>
      )}

      <form className="pb-20" onSubmit={updateProfile}>
        <div className="w-full md:w-[500px] h-auto py-6 flex flex-col gap-6">
          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Name
            </p>
            <input
              onChange={(e) => handleFormData('full_name', e.target.value)}
              value={me?.full_name || ''}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              type="text"
              placeholder="Daniyah Malik"
            />
            {errFull_name && (
              <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                <span className="text-sm italic font-bold">!</span>
                {errFull_name}
              </p>
            )}
          </div>

          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Email
            </p>
            <input
              onChange={(e) => handleFormData('email', e.target.value)}
              value={me?.email || ''}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              type="email"
              placeholder="your@email.com"
            />
            {errEmail && (
              <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                <span className="text-sm italic font-bold">!</span>
                {errEmail}
              </p>
            )}
          </div>

          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              No. Hp
            </p>
            <input
              onChange={(e) => handleFormData('phone_number', e.target.value)}
              value={me?.phone_number || ''}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              type="tel"
              placeholder="081232434343"
            />
            {errPhoneNumber && (
              <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                <span className="text-sm italic font-bold">!</span>
                {errPhoneNumber}
              </p>
            )}
          </div>

          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Alamat
            </p>
            <textarea
              onChange={(e) => handleFormData('address', e.target.value)}
              value={me?.address || ''}
              cols="30"
              rows="3"
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor resize-none"
              placeholder="Enter your address"
            ></textarea>
            {errAddresss && (
              <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                <span className="text-sm italic font-bold">!</span>
                {errAddresss}
              </p>
            )}
          </div>

          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Province
            </p>
            <input
              onChange={(e) => handleFormData('province', e.target.value)}
              value={me?.province || ''}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              type="text"
              placeholder="Enter province"
            />
            {errProvince && (
              <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                <span className="text-sm italic font-bold">!</span>
                {errProvince}
              </p>
            )}
          </div>

          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              City
            </p>
            <select
              onChange={(e) => handleFormData('city_id', e.target.value)}
              value={me?.city_id || ''}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
            >
              <option value="">Select a city</option>
              {cities && cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
            {errCity && (
              <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                <span className="text-sm italic font-bold">!</span>
                {errCity}
              </p>
            )}
          </div>

          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Country
            </p>
            <input
              onChange={(e) => handleFormData('country', e.target.value)}
              value={me?.country || ''}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              placeholder="Enter country"
            />
            {errCountry && (
              <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                <span className="text-sm italic font-bold">!</span>
                {errCountry}
              </p>
            )}
          </div>

          <div>
            <p className="text-base font-titleFont font-semibold px-2">
              Kode Pos
            </p>
            <input
              onChange={(e) => handleFormData('zip', e.target.value)}
              value={me?.zip || ''}
              className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
              placeholder="Enter postal code"
            />
            {errZip && (
              <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
                <span className="text-sm italic font-bold">!</span>
                {errZip}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            onClick={updateProfile}
            className="w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
// import axios from "axios";
// import { toast } from "react-toastify";

// const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_DEV_URL : process.env.VITE_PROD_URL

// const Profile = () => {
//   const location = useLocation();
//   const [prevLocation, setPrevLocation] = useState("");
//   const [me, setMe] = useState("")

//   useEffect(() => {
//     // setPrevLocation(location.state.data);
//   }, [location]);

//   const [full_name, setfull_name] = useState("");
//   const [email, setEmail] = useState("");
//   const [address, setAddress] = useState("");
//   const [phone_number, setPhoneNumber] = useState("");
//   const [province, setProvinceId] = useState("")
//   const [city_id, setCityId] = useState("");
//   const [country, setCountry] = useState("");
//   const [cities, setCities] = useState([]);
//   const [zip, setZip] = useState([]);

//   // ========== Error States Start here ============
//   const [errFull_name, setErrfull_name] = useState("");
//   const [errEmail, setErrEmail] = useState("");
//   const [errAddresss, setErrAddresss] = useState("");
//   const [errPhoneNumber, setErrPhoneNumber] = useState("");
//   const [errProvince, setErrProvince] = useState("");
//   const [errCity, setErrCity] = useState("");
//   const [errCountry, setErrCountry] = useState("");
//   const [errZip, setErrZip] = useState("");
//   // ========== Error States End here ==============
//   const [successMsg, setSuccessMsg] = useState("");

//   useEffect(() => {
//     getProfile()
//     getCities()
//   }, [])

//   const getProfile = async () => {
//     try {
//       await axios.get(`${BASE_URL}profile`, {withCredentials: true})
//                 .then(result => {
//                   console.log('result', result)
//                   if(result.status === 200){
//                     setMe(result.data.data)
//                   }
//                 })
//                 .catch(error => toast.error('Failed, Failed when get profile'))

//     } catch (error) {
//       toast.error("Failed, Failed when get data profile ")
//     }
//   }

//   const getCities = async (req, res) => {
//     try {
//     await axios.get(`${BASE_URL}cities`)
//                   .then(result => {
//                     console.log('result', result)
//                     setCities(result.data.data)
//                   })
//                   .catch(error => {
//                     toast.error('Failed get cities: ' + error)
//                   })

//     } catch (error) {
//       toast.error('Failed when get cities: ' + error)
//     }
//   }

//   const handleFormData = (name, value) => {
//     console.log('name', value)
//     if(name && value){
//       setMe({...me, [name]: value})
//     }
//   }

//   const handleName = (e) => {
//     me.full_name = e.target.value;
//     console.log('full_name', me.full_name)
//     setErrfull_name("");
//   };

//   const handleEmail = (e) => {
//     me.email = e.target.value;
//     setErrEmail("");
//   };

//   const handlePhoneNumber = (e) => {
//     me.phone_number = e.target.value;
//     setErrPhoneNumber("");
//   };

//   const handleAddress = (e) => {
//     me.address = e.target.value;
//     setErrAddresss("");
//   };

//   const handleProvince = (e) => {
//     me.city_id = e.target.value;
//     console.log('e', e)
//     setErrProvince("");
//   };

//   const handleCity = (e) => {
//     me.city_id = e.target.value;
//     console.log('e', e)
//     setErrCity("");
//   };

//   const handleCountry = (e) => {
//     me.country = e.target.value;
//     setErrCountry("");
//   };

//   const handleZip = (e) => {
//     me.zip = e.target.value;
//     setErrZip("");
//   };

//   // ================= Email Validation start here =============
//   const EmailValidation = (email) => {
//     return String(email)
//       .toLowerCase()
//       .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
//   };
//   // ================= Email Validation End here ===============

//   const updateProfile = async (e) => {
//     e.preventDefault();

//     console.log('me', me)
//     if (!me.full_name) {
//       setErrfull_name("Nama wajib diisi");
//     }
//     if (!me.email) {
//       setErrEmail("Email wajib diisi");
//     } else {
//       if (!EmailValidation(email)) {
//         setErrEmail("Email tidak valid");
//       }
//     }
//     if (!me.phone_number) {
//       setErrPhoneNumber("No. Hp wajib diisi");
//     }
//     if (!me.address) {
//       setErrAddresss("Alamat wajib diisi");
//     }
//     if (!me.zip) {
//       setErrZip("Kode Pos wajib diisi");
//     }
//     if (me.full_name && me.email && EmailValidation(me.email) && me.address) {
//       // Here you would typically make an API call to update the profile
//       await axios.patch(`${BASE_URL}profile`, {full_name: me.full_name, email: me.email, phone_number: me.phone_number, address: me.address, province: me.province, city_id: me.city_id, country: me.country, zip: me.zip}, {withCredentials: true})
//                   .then(result => {
//                     if(result.status == 200){
//                       //  toast.success('Alhamdulillah, update profile berhasil')
//                       setSuccessMsg(
//                         'Alhamdulillah, update profile berhasil'
//                         // `Thank you dear ${full_name}, Your profile has been updated successfully. Further details will be sent to you by email at ${email}.`
//                       );
//                     }
//                   })
//     }
//   };

//   return (
//     <div className="max-w-container mx-auto px-4">
//       <Breadcrumbs title="Profile" prevLocation={prevLocation} />
//       {successMsg && (
//         <p className="pb-20 w-96 font-medium text-green-500">{successMsg}</p>
//       )}

//       <form className="pb-20">
//           {/* <h1 className="font-titleFont font-semibold text-3xl mb-2">
//             {me?.full_name}
//           </h1> */}
//           <div className="w-[500px] h-auto py-6 flex flex-col gap-6">
//             <div>
//               <p className="text-base font-titleFont font-semibold px-2">
//                 Name
//               </p>
//               <input
//                 onChange={(e) => handleFormData('full_name',e.target.value)}
//                 value={me?.full_name}
//                 className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
//                 type="text"
//                 placeholder="Daniyah Malik"
//               />
//               {errFull_name && (
//                 <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
//                   <span className="text-sm italic font-bold">!</span>
//                   {errFull_name}
//                 </p>
//               )}
//             </div>
//             <div>
//               <p className="text-base font-titleFont font-semibold px-2">
//                 Email
//               </p>
//               <input
//                 onChange={handleEmail}
//                 value={me?.email}
//                 className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
//                 type="email"
//                 placeholder="Enter your name here"
//               />
//               {errEmail && (
//                 <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
//                   <span className="text-sm italic font-bold">!</span>
//                   {errEmail}
//                 </p>
//               )}
//             </div>
//             <div>
//               <p className="text-base font-titleFont font-semibold px-2">
//                 No. Hp
//               </p>
//               <input
//                 onChange={handlePhoneNumber}
//                 value={me?.phone_number}
//                 className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
//                 type="tel"
//                 placeholder="081232434343"
//               />
//               {errPhoneNumber && (
//                 <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
//                   <span className="text-sm italic font-bold">!</span>
//                   {errPhoneNumber}
//                 </p>
//               )}
//             </div>
//             <div>
//               <p className="text-base font-titleFont font-semibold px-2">
//                 Alamat
//               </p>
//               <textarea
//                 onChange={handleAddress}
//                 value={me?.address}
//                 cols="30"
//                 rows="3"
//                 className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor resize-none"
//                 placeholder="Enter your address"
//               ></textarea>
//               {errAddresss && (
//                 <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
//                   <span className="text-sm italic font-bold">!</span>
//                   {errAddresss}
//                 </p>
//               )}
//             </div>
//             <div>
//               <p className="text-base font-titleFont font-semibold px-2">
//                 City
//               </p>
//               <select
//                 onChange={handleCity}
//                 value={me?.city_id}
//                 className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
//                 // defaultValue={cities[0].id}
//               >
//                 {cities && cities.map(city => (
//                   <option key={city.id} value={city.id}>{city.name}</option>
//                 ))}
//               </select>
//               {errCity && (
//                 <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
//                   <span className="text-sm italic font-bold">!</span>
//                   {errCity}
//                 </p>
//               )}
//             </div>
//             <div>
//               <p className="text-base font-titleFont font-semibold px-2">
//                 Country
//               </p>
//               <input
//                 onChange={handleCountry}
//                 value={me?.country}
//                 className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
//                 placeholder="Enter country"
//               />
//               {errCountry && (
//                 <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
//                   <span className="text-sm italic font-bold">!</span>
//                   {errCountry}
//                 </p>
//               )}
//             </div>
//             <div>
//               <p className="text-base font-titleFont font-semibold px-2">
//                 Kode Pos
//               </p>
//               <input
//                 onChange={handleZip}
//                 value={me?.zip}
//                 className="w-full py-1 border-b-2 px-2 text-base font-medium placeholder:font-normal placeholder:text-sm outline-none focus-within:border-primeColor"
//                 placeholder="Enter country"
//               />
//               {errZip && (
//                 <p className="text-red-500 text-sm font-titleFont font-semibold mt-1 px-2 flex items-center gap-1">
//                   <span className="text-sm italic font-bold">!</span>
//                   {errZip}
//                 </p>
//               )}
//             </div>
//             <button
//               onClick={updateProfile}
//               className="w-44 bg-primeColor text-gray-200 h-10 font-titleFont text-base tracking-wide font-semibold hover:bg-black hover:text-white duration-200"
//             >
//               Update
//             </button>
//           </div>
//         </form>
//     </div>
//   );
// };

// export default Profile;