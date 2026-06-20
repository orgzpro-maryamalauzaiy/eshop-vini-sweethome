import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { logoLight } from "../../assets/images";
import { toast } from "react-toastify";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_API_DEV_URL : process.env.REACT_APP_API_PROD_URL

const SignUp = () => {
  // ============= Initial State Start here =============
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city_id, setCity] = useState("12345678");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [checked, setChecked] = useState(false);

  const [cities, setCities] = useState([]);
  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [errClientName, setErrClientName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPhone_number, setErrPhone_number] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errAddress, setErrAddress] = useState("");
  const [errCity, setErrCity] = useState("");
  const [errCountry, setErrCountry] = useState("");
  const [errZip, setErrZip] = useState("");
  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrMsg] = useState("");
  // ============= Event Handler Start here =============
  const navigate = useNavigate()

  useEffect(() => {

    getCities()

  }, [])

  const getCities = async () => {
    try {
      const result = await axios.get(`${BASE_URL}/cities`);
      console.log('cities result', result);
      setCities(result.data.data);
    } catch (error) {
      toast.error('Failed get cities: ' + (error.response?.data?.message || error.message));
    }
  }

  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
  };
  const handlePhone_number = (value) => {
    console.log('phone_number', value)
    setPhone_number(value);
    setErrPhone_number("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
    setErrAddress("");
  };
  const handleCity = (e) => {
    setCity(e.target.value);
    setErrCity("");
  };
  const handleCountry = (e) => {
    setCountry(e.target.value);
    setErrCountry("");
  };
  const handleZip = (e) => {
    setZip(e.target.value);
    setErrZip("");
  };
  // ============= Event Handler End here ===============
  // ================= Email Validation start here =============
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };
  // ================= Email Validation End here ===============

  const handleRegister = async (e) => {
    e.preventDefault();
    if (checked) {
      if (!clientName) {
        setErrClientName("Nama wajib diisi");
      }
      if (!email) {
        setErrEmail("Email wajib diisi");
      } else {
        if (!EmailValidation(email)) {
          setErrEmail("Email tidak valid");
        }
      }
      if (!phone_number) {
        setErrPhone_number("No. Hp wajib diisi");
      }
      if (!password) {
        setErrPassword("Password wajib diisi");
      } else {
        if (password.length < 6) {
          setErrPassword("Password minimal 6 karakter");
        }
      }
      if (!address) {
        setErrAddress("Alamat wajib diisi");
      }
      if (!city_id) {
        setErrCity("Kota wajib diisi");
      }
      if (!country) {
        setErrCountry("Negara wajib diisi");
      }
      if (!zip) {
        setErrZip("Kode pos wajib diisi");
      }
      // ============== Getting the value ==============
      if (
        clientName &&
        email &&
        EmailValidation(email) &&
        phone_number &&
        password &&
        password.length >= 6 &&
        address &&
        city_id &&
        country &&
        zip
      ) {

        await axios.post(`${BASE_URL}/auth/register`, {full_name: clientName, email, password, phone_number, address, city_id, country, zip})
                    .then(result => {
                      console.log('result', result)
                      if(result.status === 200){
                        setSuccessMsg(
                          `Alhamdulillah, register berhasil, silakan memilih produk Sweethome yang tersedia ^^.`
                        );
                        // Hello dear ${clientName}, Welcome you to OREBI Admin panel. We received your Sign up request. We are processing to validate your access. Till then stay connected and additional assistance will be sent to you by your mail at ${email}
                        setClientName("");
                        setEmail("");
                        setPhone_number("");
                        setPassword("");
                        setAddress("");
                        setCity("");
                        setCountry("");
                        setZip("");

                        setTimeout(() => {
                          navigate('/')

                        }, 1000);

                      }
                    })
                    .catch(error => {
                      // console.log(error)
                      setErrMsg(
                          `Afwan, register gagal, mohon periksa kembali inputan anda ^^.`
                        );

                    })
      }
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-28" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Daftar Akun sahabat sweethome
            </h1>
            <p className="text-base">Create your account to access more</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get started fast with OREBI
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Access all OREBI services
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Trusted by online Shoppers
              </span>
              <br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab omnis
              nisi dolor recusandae consectetur!
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              © Sweethome
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {errorMsg && (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {errorMsg}
            </p>
            <Link to="/register">
              <button
                className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold
            tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Daftar
              </button>
            </Link>
          </div>
        )}
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-400 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/login">
              <button
                className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold
            tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Sign in
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
                Daftar Akun Sahabat Sweethome
              </h1>
              <div className="flex flex-col gap-3">
                {/* client name */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Nama
                  </p>
                  <input
                    onChange={handleName}
                    value={clientName}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Daniyah Malik"
                  />
                  {errClientName && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errClientName}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Email
                  </p>
                  <input
                    onChange={handleEmail}
                    value={email}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="email"
                    placeholder="daniyah@mail.com"
                  />
                  {errEmail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errEmail}
                    </p>
                  )}
                </div>
                {/* phone_number Number */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    No. Hp
                  </p>
                  <input
                    onChange={(e) => handlePhone_number(e.target.value)}
                    value={phone_number}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="08123456789"
                  />
                  {errPhone_number && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPhone_number}
                    </p>
                  )}
                </div>
                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="password minimal 6 karakter"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>
                {/* Address */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Alamat
                  </p>
                  <input
                    onChange={handleAddress}
                    value={address}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="road-001, house-115, example area"
                  />
                  {errAddress && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errAddress}
                    </p>
                  )}
                </div>
                {/* City */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Kota
                  </p>
                  <select
                    onChange={handleCity}
                    value={city_id}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    placeholder="Your city"
                  >
                    {/* <option value="424916d9-7626-4591-bc2f-16db6bb91b93" >Bandung</option> */}
                    {cities && cities.map(city =>
                      <option value={city.id} >{city.name} </option>
                     )}
                  </select>
                  {errCity && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errCity}
                    </p>
                  )}
                </div>
                {/* Country */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Negara
                  </p>
                  <input
                    onChange={handleCountry}
                    value={country}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    // placeholder=""
                  />
                  {errCountry && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errCountry}
                    </p>
                  )}
                </div>
                {/* Zip code */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Kode Pos
                  </p>
                  <input
                    onChange={handleZip}
                    value={zip}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    // placeholder="Your country"
                  />
                  {errZip && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errZip}
                    </p>
                  )}
                </div>
                {/* Checkbox */}
                <div className="flex items-start mdl:items-center gap-2">
                  <input
                    onChange={() => setChecked(!checked)}
                    className="w-4 h-4 mt-1 mdl:mt-0 cursor-pointer"
                    type="checkbox"
                  />
                  <p className="text-sm text-primeColor">
                    Setuju dengan Sweethome{" "}
                    <span className="text-blue-500">Terms of Service </span>and{" "}
                    <span className="text-blue-500">Privacy Policy</span>.
                  </p>
                </div>
                <button
                  onClick={handleRegister}
                  className={`${
                    checked
                      ? "bg-primeColor hover:bg-black hover:text-white cursor-pointer"
                      : "bg-gray-500 hover:bg-gray-500 hover:text-gray-200 cursor-none"
                  } w-full text-gray-200 text-base font-medium h-10 rounded-md hover:text-white duration-300`}
                >
                  Daftar
                </button>
                <p className="text-sm text-center font-titleFont font-medium">
                  Sudah punya akun?{" "}
                  <Link to="/login">
                    <span className="hover:text-blue-600 duration-300">
                      Login
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
