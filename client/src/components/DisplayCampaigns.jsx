import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { loader } from '../assets/index';
import { Loader } from '../components/index';
import { useStateContext } from '../context';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const { address, balance } = useStateContext();
  const navigate = useNavigate();
  // console.log(campaigns)
  
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.CampaignName}`, { state: campaign });
  };

  // const tempcampaign1 = {
  //   owner: "Naturelife Foundation",
  //   title: "River Cleaning Campaign",
  //   description: "The River Cleaning Campaign by Naturelife Foundation aims to restore the natural beauty and health of polluted rivers. The campaign focuses on removing plastic waste and other pollutants that harm aquatic life and surrounding ecosystems.",
  //   target: "70",
  //   deadline: "October 30, 2024 12:00:00",
  //   amountCollected: "30",
  //   image: "https://www.river-cleanup.org/sites/default/files/styles/max/public/2024-04/pxl_20230709_075854737_2.jpg?itok=3T-BYZ1m"
  // };

  return (
    <div>
      {isLoading && <Loader />}

      <h1 className="font-epilogue font-semibold text-[20px] text-[#818183] dark:text-white text-left">
        Welcome User {address}
      </h1>
      <h1 className="font-epilogue font-semibold text-[20px] text-[#818183] dark:text-white text-left">
        Wallet Balance: {balance} ETH
      </h1>
      <h1 className="font-epilogue font-semibold text-[20px] text-[#818183] dark:text-white text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap flex-row mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[16px] leading-[30px] text-[#818183] dark:text-[#fff]">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => (
          <FundCard 
            key={uuidv4()}
            {...campaign}
            handleClick={() => handleNavigate(campaign)}
          />
        ))}

        {/* <FundCard
          key={uuidv4()}
          {...tempcampaign1}
          handleClick={() => handleNavigate(tempcampaign1)}
        /> */}
        
      </div>
    </div>
  );
};

export default DisplayCampaigns;