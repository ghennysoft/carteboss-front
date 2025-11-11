import { X } from 'lucide-react'
import React from 'react'

const QRCodeView = ({item, open}) => {
  return (
    <div className='flex justify-center items-center fixed w-full h-full top-0 left-0 bg-gray-400 p-5'>
      <div className="flex flex-col justify-center items-center md:max-10 bg-white rounded-lg py-5 px-10">
        <p onClick={()=>open(false)} className='flex justify-center items-center mb-3 p-3 rounded-full cursor-pointer'>
            <X />
        </p>
        <h2 className="text-center" style={{fontSize: "1.5rem"}}>{item?.name}</h2>
        <div className="relative flex flex-col border border-[#26265eff] border-3 rounded-lg overflow-hidden">
            {/* <img src={"/no-img.jpg"} width={200} height={200} alt="qrcode" /> */}
            <img src={item?.qrCode?.url} className='w-full' alt="qrcode" />
            <span className='block text-center text-white bg-[#26265eff] p-3' style={{fontSize: "1.5rem"}}>SCAN ME</span>
        </div>
      </div>
    </div>
  )
}

export default QRCodeView
