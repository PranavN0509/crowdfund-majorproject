import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="rounded-[20px] bg-[#ffffff] dark:bg-[#1c1c24] flex flex-col items-center w-[150px]">
      <h4 className="font-epilogue font-bold text-[30px] text-black dark:text-white p-3 bg-[#ffffff] dark:bg-[#1c1c24] rounded-t-[10px] w-full text-center truncate">{value}</h4>
      <p className="font-epilogue font-normal text-[16px] text-[#1e1e1f] dark:text-[#fff] bg-[#f0f0f0] dark:bg-[#3a3a3d] px-3 py-2 w-full rouned-b-[10px] text-center">{title}</p>
    </div>
  )
}
export default CountBox