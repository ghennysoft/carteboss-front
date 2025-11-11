import { X } from 'lucide-react'
import React, { useRef } from 'react'
import html2canvas from 'html2canvas';

const QRCodeView = ({item, open}) => {
  const componentRef = useRef();

  const handleDownloadImage = async () => {
    if (componentRef.current) {
      const canvas = await html2canvas(componentRef.current);
      const image = canvas.toDataURL('image/png'); // Get image data as a PNG

      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = image;
      link.download = 'my-component.png'; // Set desired filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div className='flex justify-center items-center fixed w-full h-full top-0 left-0 bg-gray-400 p-5'>
      <div className="flex flex-col justify-center items-center md:max-10 bg-white rounded-lg py-5 px-10">
        <p onClick={()=>open(false)} className='flex justify-center items-center mb-3 p-3 rounded-full cursor-pointer'>
            <X />
        </p>
        <h2 className="text-center" style={{fontSize: "1.5rem"}}>{item?.name}</h2>
        {/* <button onClick={handleDownloadImage} className='cursor-pointer border p-1 m-1 rounded-lg'>Download</button> */}
        <div ref={componentRef} className="relative flex flex-col border border-[#26265eff] border-3 rounded-lg overflow-hidden">
            {/* <img src={"/no-img.jpg"} width={200} height={200} alt="qrcode" /> */}
            <img src={item?.qrCode?.url} className='w-full' alt="qrcode" />
            <span className='block text-center text-white bg-[#26265eff] p-3' style={{fontSize: "1.5rem"}}>SCAN ME</span>
        </div>
      </div>
    </div>
  )
}

export default QRCodeView
