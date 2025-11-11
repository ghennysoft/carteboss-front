import { data } from '../../utils/data'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Edit2, QrCode, Share } from 'lucide-react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constante';
import NavBar from '../NavBar';
import QRCodeView from '../QRCodeView';

const CardItem = ({item}) => {
  const navigate = useNavigate();
  const [viewQRCode, setViewQRCode] = useState(false);
  return (
        <div className="p-3">
            <img src={item?.coverPicture?.url ? item?.coverPicture?.url : "/no-banner.png"} style={{ width: '100%', height: '150px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '20px'}} alt="" />
            <img src={item?.profilePicture?.url ? item?.profilePicture?.url : "/no-img.jpg"} className='rounded-full border border-gray-300 -mt-14 ml-7' style={{ width: '100px', height: '100px', objectFit: 'cover'}} alt="" />
            <img src={item?.companyLogo?.url ? item?.companyLogo?.url : "/no-img.jpg"} className='border' style={{ width: '40px', height: '40px', objectFit: 'cover', border: '3px solid #ddd', borderRadius: '50%', margin: '-40px 0px 0px 100px'}} alt="" />
            <div className="content ml-5 mt-3">
                <div className="infos">
                    <div className='flex items-center gap-3 mb-2' style={{fontSize: "1.3rem"}}><b>{item?.name}</b></div>
                    <div className='flex items-center gap-3 mb-2' style={{fontSize: "1rem"}}><b>{item?.profession} - {item?.company}</b></div>
                </div>
            </div>
            <div className='grid grid-cols-1 gap-3 my-5 ml-3' style={{fontSize: "1rem"}}>
                <div className="grid grid-cols-2 gap-3">
                    <Link to={`/form/edit/${item?._id}`} className="flex justify-center items-center gap-2 bg-gray-400 text-white border rounded-lg py-2 px-4"><Edit2 size={15} /> Modifier</Link>
                    <button onClick={()=>setViewQRCode(true)} className="flex justify-center items-center gap-2 bg-[#26265e44] text-white border rounded-lg py-2 px-4 cursor-pointer"><QrCode size={15} /> QR Code</button>
                    {viewQRCode && <QRCodeView item={item} open={setViewQRCode}  />}
                </div>
                <Link to={`/carte/${item?._id}`} target="_blank" className="flex justify-center items-center gap-2 bg-[#26265eff] text-white border rounded-lg py-2 px-4"><Share size={15} /> Partager</Link>
            </div>
        </div>
  )
}

export default CardItem
