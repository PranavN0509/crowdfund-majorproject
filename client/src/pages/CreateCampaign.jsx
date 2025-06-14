import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { useStateContext } from '../context/index';
import { money } from '../assets/index';
import { CustomButton, FormField, Loader } from '../components/index';
import { checkIfImage } from '../utils/index';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { publishCampaign } = useStateContext();
  const { pinata } = useStateContext();
  const [image, setImage] = useState(undefined);
  const [fileName, setFileName] = useState("");
  const [ipfshash, setIpfsHash] = useState("");
  // const [uploadLoading, setUploadLoading] = useState(false);
  // const [uploaded, setUploaded] = useState(false);
  
  // console.log(image);
 

  const [form, setForm] = useState({
    organization_name: '',
    title: '',
    description: '',
    minimumamount: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  }

  const handleImageUpload = async (e) => {
      e.preventDefault()
      try {
        if(image===""){
          setIsLoading(false);
          throw new Error("Image path not set");  
        }
        else{
          setIsLoading(true);
          const res = await pinata.testAuthentication();
          console.log(res.message);
          console.log("Hello inside IPFS1");
          const response = await pinata.upload.file(image);
          console.log("Hello inside IPFS2");
          const ipfshash = response.IpfsHash;
          form.image = ipfshash;
          console.log("Hello inside IPFS3");
          setIpfsHash(ipfshash)
          setIsLoading(false);

        }
      } catch (error) {
        console.log(error)
        setIsLoading(false);
      }
      finally{
        setIsLoading(false);
      }
  }


  // const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     form.deadline = new Date(form.deadline).getTime();
  //     console.log(form.deadline);
  //     checkIfImage(form.image, async (exists) => {
  //         if (exists) {
  //           setIsLoading(true)
  //           await publishCampaign({ ...form, target: ethers.parseUnits(form.target, 18) })
  //           setIsLoading(false);
  //           navigate('/');
  //         } else {
  //           alert('Provide valid image URL')
  //           setForm({ ...form, image: '' });
  //           setIsLoading(false);
  //         }
  //     });
  // }
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if(typeof(form.deadline)!=="bigint"){
          form.deadline =  BigInt(new Date(form.deadline).getTime());
        }
        console.log(form.deadline);
        console.log(typeof(form.deadline));
        if (form.image !== "") {
          setIsLoading(true)
          // await publishCampaign({ ...form, target: ethers.parseUnits(form.target, 18) });
          await publishCampaign({ ...form, minimumamount: ethers.parseEther(form.minimumamount), target: ethers.parseEther(form.target) });
          setIsLoading(false);
          navigate('/');
        } else {
          alert('Provide valid image URL')
          setForm({ ...form, image: '' });
          setIsLoading(false);
        }    
      } catch (error) {
        setForm({
          organization_name: '',
          title: '',
          description: '',
          minimumamount: '',
          target: '',
          deadline: '',
          image: ''
        });
        console.error("Error in handleSubmit:  ",error)
      }
      finally{
        setForm({
          organization_name: '',
          title: '',
          description: '',
          minimumamount: '',
          target: '',
          deadline: '',
          image: ''
        });
      }
  }

  return (
    <div className="bg-[#ffffff] dark:bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>
      <form 
      // onSubmit={handleSubmit} 
      className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
            <FormField
              labelName="Organization Name"
              placeholder="My Organization"
              inputType="text"
              value={form.organization_name}
              handleChange={(e) => handleFormFieldChange('organization_name', e)}
            />
            <FormField
              labelName="Campaign Title"
              placeholder="Write a title"
              inputType="text"
              value={form.title}
              handleChange={(e) => handleFormFieldChange('title', e)}
            />
        </div>
       <FormField
          labelName="Story"
          placeholder="Write your story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange('description', e)}
        />
       <FormField
          labelName="Minumum Amount"
          placeholder="Amount in ETH"
          inputType="text"
          value={form.minimumamount}
          handleChange={(e) => handleFormFieldChange('minimumamount', e)}
        />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          < FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField
            labelName="End Date"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => {
              handleFormFieldChange('deadline', e);
            }}
          />
        </div>

        <div className="flex items-end flex-wrap gap-[40px]">
          <FormField
            labelName="Campaign Image *"
            placeholder="Place image URL of your campaign"
            inputType="file"
            value={fileName}
            // handleChange={(e) => handleFormFieldChange('image', e)}
            handleChange={(e) => {
                setFileName(e.target.value)
                setImage(e.target.files[0])      
            }}
          />
          <CustomButton
            btnType="submit"
            title="Upload to IPFS"
            styles="bg-[#1dc071]"
            handleClick={handleImageUpload}
          />
        </div>

        <div>
          IpfsHash: {ipfshash}
        </div>

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
            handleClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  )
}

export default CreateCampaign