import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context/index';
import { CountBox, CustomButton, Loader } from '../components/index';
import { calculateBarPercentage, daysLeft } from '../utils/index';
import { thirdweb } from '../assets/index';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { conributeToCampaign, address } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  console.log(state);
  
  const backers = state.contributorsArrLen;
  const remainingDays = daysLeft(state.End_Date);


  let imgLink = `https://yellow-adjacent-marmot-457.mypinata.cloud/ipfs/${state.imageUrl}`

  const checkIfOwner = () => {
      if (address === state.manager) {
        return true;
      }
      else {
        return false;
      }
  }

  // useEffect(() => {
  //   if (contract) fetchDonators();
  // }, [contract, address])

  const handleDonate = async () => {
    setIsLoading(true);
    if (amount !== 0) {
      await conributeToCampaign(state.campaignContract, amount);
    }
    console.log("navigate");
    navigate(`/campaign-details/${state.CampaignName}`, { state: state })
    console.log("navigated success");
    setIsLoading(false);
  }


  const handleCampaignProgress = () => {
    navigate(`/campaign-details/campaign-progress/${state.CampaignName}`, { state: state });
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={imgLink} alt="campaign" className="w-full h-[410px] object-cover rounded-xl" />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(Number(state.targetToAchieve), Number(state.balance))}%`, maxWidth: '100%' }}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Raised of ${ethers.formatEther(state.targetToAchieve)}`} value={ethers.formatEther(state.balance)} />
          <CountBox title="Total Backers" value={backers} />
        </div>
      </div>
      <div className="mt-[60px] flex lg:flex-row flex-col gap-2">
        <h4 className="font-semibold text-[22px] text-black dark:text-white uppercase">{state.CampaignName}</h4>
      </div>

      <div className="mt-[40px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black dark:text-white uppercase">Creator: {state.manager}</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-black dark:text-white break-all">{state.OrganizationName}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black dark:text-white uppercase">Story</h4>

            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.CampaignDescription}</p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>

            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? donators.map((item, index) => (
                <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                  <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                </div>
              )) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
              )}
            </div>
          </div>

          <div className='w-[700px]'>
            <CustomButton
              btnType="button"
              title="Campaign Progress"
              styles="w-full bg-[#8c6dfd]"
              handleClick={handleCampaignProgress}
            />
          </div>
        </div>


        {checkIfOwner() ? <></>
          :
          <div className="rounded-[14px] flex-1  bg-[#f8fff5] dark:bg-[#090909]">
            <h4 className="my-4 mx-4 font-epilogue font-semibold text-[18px] text-black dark:text-white uppercase">Fund</h4>

            <div className="mt-[20px] flex flex-col p-4 bg-[#f9fff7] dark:bg-[#090909] rounded-[10px]">
              <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#3f3f3f] dark:text-white">
                Fund the campaign
              </p>
              <p className="font-epilogue font-medium text-[15px] leading-[30px] text-center text-[#3f3f3f] dark:text-white">
                (Minimum funding amount is {ethers.formatEther(state.minimumContribution)} ETH)
              </p>
              <div className="mt-[30px]">
                <input
                  type="number"
                  placeholder="ETH 0.1"
                  step="0.01"
                  className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-black dark:text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] dark:placeholder:text-[#e2e2e2] rounded-[10px]"
                  value={amount}
                  onChange={(e) => {
                    setAmount((e.target.value).toString());
                  }
                  }
                />

                <div className="my-[20px] p-4 bg-[#fff] dark:bg-[#13131a] rounded-[10px]">
                  <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-black dark:text-white">Back it because you believe in it.</h4>
                  <p className="mt-[8px] font-epilogue font-normal leading-[22px] text-[#808191] dark:text-[#f0ffef]">Support the project for no reward, just because it speaks to you.</p>
                </div>

                <CustomButton
                  btnType="button"
                  title="Fund Campaign"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleDonate}
                />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default CampaignDetails