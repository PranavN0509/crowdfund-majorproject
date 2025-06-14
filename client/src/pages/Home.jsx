import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context/index';
import { DisplayCampaigns } from '../components/index';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getCampaigns } = useStateContext();

  useEffect(() => {
    const init = async () => {
      if(contract){
        const AllCampaigns = await getCampaigns();     
        setCampaigns(AllCampaigns);
      }

    };
    init();

  }, [address, contract])

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />

  )
}

export default Home