import React, { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context/index';
import { CountBox, CustomButton, Loader } from '../components/index';
import { calculateBarPercentage, daysLeft } from '../utils/index';
import { Crowdfundingfactoryaddress, contractAbiCrowdfundingFactory, contractAbiCampaign } from '../constants';

const CampaignProgress = () => {
    const imgLink = "https://yellow-adjacent-marmot-457.mypinata.cloud/ipfs/"
    const navigate = useNavigate();
    const { pinata } = useStateContext();
    const { address, balance, signer } = useStateContext();
    const { createWithdrawRequest, approveWithdrawRequest } = useStateContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [RequestsArr, setRequestsArr] = useState([]);
    const { state } = useLocation();
    const campaign = new ethers.Contract(state.campaignContract, contractAbiCampaign, signer);
    

    useEffect(() => {
        const init = async () => {
            // let status = await isWithdrawAllowed()    
            if (campaign) {
                console.log(campaign);
                const Request_count = Number(await campaign.getRequestsCount());
                const requests = []
                console.log(Request_count)
                for (let index = 0; index < Request_count; index++) {
                    const item = await campaign.requests(index);
                    console.log(`Item ${index}`, item);

                    requests.push(item);
                }
                setRequestsArr(requests);

            }

        };
        init();
    }, [address]);

    console.log(RequestsArr);



    const checkIfOwner = () => {
        if (address === state.manager) {
            return true;
        }
        else {
            return false;
        }
    }

    const checkIfWithdrawAllowed = async (index) => {
        return await campaign.isRequestApproved(index);
    }

    const withdrawRequestMoney = async (index) => {
        try {
            await campaign.finalizeRequest(index);
            console.log("Successful withdrawl");
            
        } catch (error) {
            console.log("Error in withdrawRequestMoney: ",error);
        }
    }

    // console.log(checkIfWithdrawAllowed(0));

    const handleApproveWithdrawRequest = async (index) => {
        setIsLoading(true);
        try {
            console.log("Index:::  ", BigInt(index));
            await approveWithdrawRequest(state.campaignContract, index);
            console.log("Withdraw request approved successfully");
            // You might want to add a navigation here if needed
        } catch (error) {
            console.error("Error approving withdraw request: ", error);
        } finally {
            setIsLoading(false);
            // window.location.reload();
        }
    }




    const CreateWithdrawlRequestModal = () => {
        const [requestDescription, setRequestDescription] = useState("");
        const [requestAmount, setRequestAmount] = useState("");
        // const [campaignImages, setCampaignImages] = useState([]);
        const [beforeImg, setbeforeImg] = useState(undefined);
        const [beforeipfshash, setbeforeipfshash] = useState("");
        const [afterImg, setAfterImg] = useState(undefined);
        const [afteripfshash, setafteripfshash] = useState("");
        const [isUploading, setisUploading] = useState(false);



        const handleImageUpload = async (e) => {
            e.preventDefault();
            try {
                if (beforeImg === "" || afterImg === "") {
                    setisUploading(false);
                    throw new Error("Image path not set");
                }
                else {
                    setisUploading(true);
                    const res = await pinata.testAuthentication();
                    console.log(res.message);
                    console.log("Hello inside IPFS1");
                    const response1 = await pinata.upload.file(beforeImg);
                    const response2 = await pinata.upload.file(afterImg);
                    console.log(response1,"     ", response2);
                    console.log("Hello inside IPFS2");
                    setbeforeipfshash(response1.IpfsHash);
                    setafteripfshash(response2.IpfsHash);
                    console.log("Hello inside IPFS3");
                    setisUploading(false);
                }
            } catch (error) {
                console.log(error)
                setisUploading(false);
            }
            finally {
                setisUploading(false);              
            }
        }
        


        const handleAddWithdrawRequest = async (e) => {
            e.preventDefault();
            try {
                if (requestDescription !== "" || requestAmount !== "") {
                    setisUploading(true);
                    await createWithdrawRequest(state.campaignContract, requestDescription, requestAmount, beforeipfshash, afteripfshash);
                    setIsLoading(false);
                    // navigate(`/campaign-details/campaign-progress/${state.CampaignName}`, { state: state });
                } else {
                    alert('Fill all the empty fields');
                    setisUploading(false);
                }
            } catch (error) {
                setisUploading(false);
                console.error("Error in handleAddWithdrawRequest:  ", error);
            }
            finally {
                setisUploading(false);
                setRequestDescription("");
                setRequestAmount("");
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                {isUploading && <Loader />}
                <div className="w-1/2 bg-slate-100 p-6 rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-semibold">Create a Withdrawl Request</p>
                        <button
                            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
                            onClick={()=>{
                                setIsModalOpen(false)
                            }}
                        >
                            Close
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="Description">Description:</label>
                        <textarea
                            value={requestDescription}
                            onChange={(e) => setRequestDescription(e.target.value)}
                            placeholder="Description"
                            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
                        ></textarea>

                        <label htmlFor="requestAmount">Request Amount:</label>
                        <input
                            id="requestAmount"
                            type="text"
                            value={requestAmount}
                            onChange={(e) => setRequestAmount(e.target.value)}
                            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
                        />

                        <label htmlFor="milestoneImages">Before Image:</label>
                        <input
                            id="milestoneImages"
                            type="file"
                            onChange={(e) => setbeforeImg(e.target.files[0])}
                            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
                        />
                        <label htmlFor="milestoneImages">After Image:</label>
                        <input
                            id="milestoneImages"
                            type="file"
                            onChange={(e) => setAfterImg(e.target.files[0])}
                            className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
                        />

                        <CustomButton
                            btnType="submit"
                            title="Upload to IPFS"
                            styles="bg-[#1dc071]"
                            handleClick={handleImageUpload}
                        />
                        <br />
                        <CustomButton
                            btnType="submit"
                            title="Create Withdraw Request"
                            styles="bg-[#1dc071]"
                            handleClick={handleAddWithdrawRequest}
                        />
                    </div>
                </div>
            </div>
        );
    };



    return (
        <>
            {isModalOpen && <CreateWithdrawlRequestModal />}
            {isLoading && <Loader />}

            {/* Contributions received */}

            <div className="bg-gray-100 dark:bg-[#13131a] w-full">

                <div className="w-full flex items-center justify-between pb-6">
                    <div>
                        <h1 className="text-2xl text-[#3e3e42] dark:text-white font-semibold">Withdrawl Request for <b>{state.CampaignName}</b> </h1>
                        <span className="mt-2 text-base text-[#818183] dark:text-white">Milestones achieved</span>
                    </div>

                    <div className="flex items-center justify-between">
                        {checkIfOwner() ?
                            (<div className="lg:ml-40 ml-10 space-x-8">
                                <button className="bg-blue-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer" onClick={() => { setIsModalOpen(true) }}>Add Withdrawl Request</button>
                                {/* <button className="bg-blue-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Create</button> */}
                            </div>) : (<></>)
                        }
                    </div>
                </div>

                <div className="w-full">
                    <div className="mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table className="min-w-full leading-normal border-black">
                                <thead className="border-gray-200 text-[#3e3e42] dark:text-white bg-gray-100 dark:bg-[#13131a]">
                                    <tr>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                            Proof Images
                                        </th>
                                        <th
                                            className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                            Approval Count
                                        </th>
                                        {checkIfOwner ?
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                Finalize Request
                                            </th>
                                            :
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider">
                                                Approve
                                            </th>

                                        }
                                    </tr>
                                </thead>
                                <tbody className="text-[#3e3e42] dark:text-white bg-[#fff] dark:bg-[#13131a]">
                                    {RequestsArr.length > 0 && RequestsArr.map((Request, index) => (
                                        <tr key={index}>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <div className="flex items-center">
                                                    <div className="ml-3">
                                                        <p className="whitespace-no-wrap">
                                                            {index + 1}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <div className="flex items-start">
                                                    {/* <div className="flex-shrink-0 w-10 h-10">
                                                            <img className="w-full h-full rounded-full"
                                                                src="https://images.pexels.com/photos/7656743/pexels-photo-7656743.jpeg"
                                                                alt="" />
                                                        </div> */}
                                                    <div className="">
                                                        <p className=" whitespace-no-wrap">
                                                            {Request[0]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <p className="whitespace-no-wrap">{ethers.formatEther(Request[1])} ETH</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <p>
                                                    <a className="whitespace-no-wrap"
                                                    target='_blank'
                                                    href={`${imgLink}${Request[2]}`}
                                                    >
                                                        Before
                                                    </a>
                                                </p>
                                                <p>
                                                    <a className="whitespace-no-wrap"
                                                    target='_blank'
                                                    href={`${imgLink}${Request[3]}`}
                                                    >
                                                        After
                                                    </a>
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                <p className="whitespace-no-wrap">{Number(Request[6])}
                                                </p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 text-sm">
                                                {checkIfOwner() ?
                                                (
                                                    Request[5]  ?
                                                    <>Amount Withdrawn</> 
                                                    :
                                                    <button className="bg-green-500 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                                                    onClick={ async() => {
                                                        if(await checkIfWithdrawAllowed(index)){
                                                            await withdrawRequestMoney(index)
                                                        }
                                                        else{
                                                            console.log("Withdraw not allowed");
                                                        }
                                                    }}
                                                    >
                                                    Withdraw Amount
                                                    </button>
                                                       
                                                )
                                                    :
                                                    <button className="bg-green-500 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                                                        onClick={() => {
                                                            handleApproveWithdrawRequest(index)
                                                        }
                                                        }
                                                    >
                                                        Approve
                                                    </button>}
                                            </td>
                                        </tr>
                                    )
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>


            {/* {isModalOpen && (
                <CreateCampaignModal
                    setIsModalOpen={setIsModalOpen}
                />
            )} */}
        </>
    )
}

export default CampaignProgress;
