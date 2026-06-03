import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../components/Banner/Banner";
import BannerBottom from "../../components/Banner/BannerBottom";
import BestSellers from "../../components/home/BestSellers/BestSellers";
import NewArrivals from "../../components/home/NewArrivals/NewArrivals";
import Sale from "../../components/home/Sale/Sale";
import SpecialOffers from "../../components/home/SpecialOffers/SpecialOffers";
import YearProduct from "../../components/home/YearProduct/YearProduct";
import { useSelector } from "react-redux";

const Home = ({user}) => {

  const {userEmail} = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {

    if(user){
      console.log('user from home: ', user)
    }

    if(!userEmail){
      navigate('/login')
    }

  }, [user, userEmail])

  return (
    <div className="w-full mx-auto">
      <Banner />
      <BannerBottom />
      <div className="max-w-container mx-auto px-4">
        <Sale />
        <NewArrivals />
        <BestSellers />
        <YearProduct />
        <SpecialOffers />
      </div>
    </div>
  );
};

export default Home;
