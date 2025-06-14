import React from 'react';
import { ethers } from 'ethers';
import { tagType, thirdweb } from '../assets/index';
import { daysLeft } from '../utils/index';


const FundCard = ({ 
            campaignAddress, 
            manager,
            OrganizationName,
            CampaignName,
            CampaignDescription,
            balance,
            minimumContribution,
            targetToAchieve,
            End_Date,
            imageUrl,
            requests_length,
            approversCount,
            contributorsArr,
            handleClick 
          }
        ) => {
  const remainingDays = daysLeft(End_Date);
  let imgLink = `https://yellow-adjacent-marmot-457.mypinata.cloud/ipfs/${imageUrl}`;
  
  return (
    <div className="border-[1px] border-[#c3ffb4] sm:w-[288px] w-full rounded-[10px] bg-[#fff] dark:bg-[#1c1c24] cursor-pointer" onClick={handleClick}>
      <img src={imgLink} alt="campaign image" className="w-full h-[158px] object-cover rounded-[10px]" />

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center mb-[18px]">
          <img src={tagType} alt="tag" className="w-[17px] h-[17px] object-contain" />
          {/* <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#808191]">Education</p> */}
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-black dark:text-white  text-left leading-[26px] truncate">{CampaignName}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{CampaignDescription}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{ethers.formatEther(balance)}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Raised of {ethers.formatEther(targetToAchieve)}</p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{remainingDays}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Days Left</p>
          </div>
        </div>

        {/* <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain"/>
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">by <span className="text-[#b2b3bd]">{owner}</span></p>
        </div> */}
      </div>
    </div>
  )
}

export default FundCard;