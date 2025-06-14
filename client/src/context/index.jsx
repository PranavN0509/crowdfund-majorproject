import React, { useContext, createContext, useState } from 'react';
// import dotenv from "dotenv";
// import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { PinataSDK } from "pinata-web3"
// import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';
import { Crowdfundingfactoryaddress, contractAbiCrowdfundingFactory, contractAbiCampaign } from '../constants';

// dotenv.config()

const StateContext = createContext();  //here i created the context 

// the below StateContextProvider provides it to the  main.jsx where I will wrap it in StateContextProvider tags

export const StateContextProvider = ({ children }) => {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // const networks = {
  //   polygon: {
  //     chainId: `0x${Number(80002).toString(16)}`,
  //     chainName: "Polygon Testnet",
  //     nativeCurrency: {
  //       name: "POL",
  //       symbol: "POL",
  //       decimals: 18
  //     },
  //     rpcUrls: ["https://rpc-amoy.polygon.technology"],
  //     blockExplorerUrls: ["https://amoy.polygonscan.com"]
  //   }
  // }

  // const networks = {
  //   sepolia: {
  //     chainId: `0x${Number(11155111).toString(16)}`,
  //     chainName: "Sepolia test network",
  //     nativeCurrency: {
  //       name: "SepoliaETH",
  //       symbol: "SepoliaETH",
  //       decimals: 18
  //     },
  //     rpcUrls: ["https://sepolia.infura.io/v3/"],
  //     blockExplorerUrls: ["https://sepolia.etherscan.io"]
  //   }
  // }


  const networks = {
    ganache: {
      chainId: `0x${Number(11155111).toString(16)}`,
      chainName: "CROWDFUNDINGAPP",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18
      },
      rpcUrls: ["HTTP://127.0.0.1:7545"],
      // blockExplorerUrls: ["https://sepolia.etherscan.io"]
    }
  }



  // Pinata
  const pinata = new PinataSDK({
    pinataJwt: `${import.meta.env.VITE_PINATA_JWT}`,
    pinataGateway: "yellow-adjacent-marmot-457.mypinata.cloud"
  })


  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
          alert("MetaMask is not installed. Please install it to connect.");
          return;
      }
      const accountsonMetamask = await window.ethereum.request({ method: "eth_requestAccounts" })
      console.log("Accounts on Metamask: ", accountsonMetamask);

      if (!accountsonMetamask || accountsonMetamask.length === 0) {
          console.warn("No accounts found. Connection was not completed.");
          return;
      }


      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      // console.log(network.name)
      // if (network.name !== "GanacheCrowdfund") {

      //   // console.log("Hello");
      //   await window.ethereum.request({
      //     "method": "wallet_addEthereumChain",
      //     "params": [
      //       {
      //         ...networks["ganache"]
      //       }
      //     ]
      //   })

      // }
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      const Balance = ethers.formatEther(await provider.getBalance(_walletAddress));
      const contract = new ethers.Contract(Crowdfundingfactoryaddress, contractAbiCrowdfundingFactory, signer);
      setAddress(_walletAddress);
      setSigner(signer);
      setContract(contract);
      setBalance(Balance);

      console.log(address, balance, contract);
    }
    catch (error) {
        console.error("Error connecting wallet:", error);    
    }
  };



  const disconnectWallet = async () => {
    try {
      // Request to revoke all previously granted permissions
      const response = await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
      // Updating the state or trigger any cleanup needed after disconnecting wallet
      setAddress("");
      setBalance(0);
      setSigner(null);
      setContract(null);
      console.log('Permissions revoked:', response);
    } catch (error) {
      console.error('Error revoking permissions:', error);
    }
  };




  const publishCampaign = async (form) => {
    try {
      const data = await contract.createCampaign(
        form.organization_name,
        form.title,
        form.description,
        form.minimumamount,
        form.target,
        form.deadline,
        form.image
      );
      console.log("Campaign created successfully: ", data)
    } catch (error) {
      console.log("Failed to create Campiagn:  ", error)
    }
  }



  const getCampaigns = async () => {
    const AllCampaigns = [];
    const campaignAddressArr = await contract.getDeployedCampaigns();
    for (let campaignAddress of campaignAddressArr) {
      const campaign = new ethers.Contract(campaignAddress, contractAbiCampaign, signer);
      const campaignSummary = await campaign.getSummary();
      const newCampaign = {
        campaignContract: campaignAddress,
        manager: campaignSummary[0],
        OrganizationName: campaignSummary[1],
        CampaignName: campaignSummary[2],
        CampaignDescription: campaignSummary[3],
        balance: campaignSummary[4],
        minimumContribution: campaignSummary[5],
        targetToAchieve: campaignSummary[6],
        End_Date: campaignSummary[7],
        imageUrl: campaignSummary[8],
        requests_length: campaignSummary[9],
        approversCount: campaignSummary[10],
        contributorsArrLen: campaignSummary[11].length
      }
      AllCampaigns.push(newCampaign);
    }
    return AllCampaigns;
  }


  const getUserCampaigns = async () => {
    const AllCampaigns = [];
    const campaignAddressArr = await contract.getDeployedCampaigns();
    for (let campaignAddress of campaignAddressArr) {
      const campaign = new ethers.Contract(campaignAddress, contractAbiCampaign, signer);
      const campaignSummary = await campaign.getSummary();
      const newCampaign = {
        campaignContract: campaignAddress,
        manager: campaignSummary[0],
        OrganizationName: campaignSummary[1],
        CampaignName: campaignSummary[2],
        CampaignDescription: campaignSummary[3],
        balance: campaignSummary[4],
        minimumContribution: campaignSummary[5],
        targetToAchieve: campaignSummary[6],
        End_Date: campaignSummary[7],
        imageUrl: campaignSummary[8],
        requests_length: campaignSummary[9],
        approversCount: campaignSummary[10],
        contributorsArrLen: campaignSummary[11].length
      }
      if(newCampaign.manager===address){
        AllCampaigns.push(newCampaign);
      }
    }
    return AllCampaigns;
  }


  const conributeToCampaign = async (campaignAddr, contributionAmount) => {
    try {
      const campaign = new ethers.Contract(campaignAddr, contractAbiCampaign, signer);
      console.log("Hello from contribute to campaign")
      const tx = await campaign.contribute({
        value: ethers.parseEther(contributionAmount)
      })
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log("Successfully contributed to the campaign")
      }
      else {
        console.log("Transaction Failed")
      }
    }
    catch (error) {
      console.error("Error in contribute function: ", error);
    }
  }



  const createWithdrawRequest = async (campaignAddr, description, requestamount, beforeImg, afterImg) => {
    try {
      console.log(beforeImg, "      ", afterImg)
      const campaign = new ethers.Contract(campaignAddr, contractAbiCampaign, signer);
      console.log("Hello1")
      const etherAmount = ethers.parseEther(requestamount);
      const tx = await campaign.createRequest(description, etherAmount, beforeImg, afterImg);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log("Successfully Created Request")
      }
      else {
        console.log("Request Creation Failed")
      }
    }
    catch (error) {
      console.error("Error in createWithdrawRequest function: ", error);
    }
  }


  const approveWithdrawRequest = async (campaignAddr, index) => {
    try {
      const campaign = new ethers.Contract(campaignAddr, contractAbiCampaign, signer);
      console.log(campaign);    
      console.log("Hello1")
      const tx = await campaign.approveRequest(BigInt(index));
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        console.log("Successfully Created Request")
      }
      else {
        console.log("Request Creation Failed")
      }
    }
    catch (error) {
      console.error("Error in approveWithdrawRequest function: ", error);
    }
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{
        pinata,
        connectWallet,
        disconnectWallet,
        address,
        balance,
        signer,
        contract,
        publishCampaign,
        getCampaigns,
        getUserCampaigns,
        conributeToCampaign,
        createWithdrawRequest,
        approveWithdrawRequest
        // address,
        // contract,
        // connect,
        // createCampaign: publishCampaign,
        // getUserCampaigns,
        // donate,
        // getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);