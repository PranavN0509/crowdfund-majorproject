import React, { useState, useEffect } from 'react'
import { DisplayCampaigns } from '../components/index';
import { useStateContext } from '../context/index'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getUserCampaigns } = useStateContext();

  
  useEffect(() => {
    const init = async () => {
      if(contract){
        const AllCampaigns = await getUserCampaigns();     
        setCampaigns(AllCampaigns);
      }
    };
    init();

  }, [address, contract])

  return (
    <DisplayCampaigns 
      title="Your Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile