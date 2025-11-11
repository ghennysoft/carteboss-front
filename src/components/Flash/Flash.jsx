import { data } from '../../utils/data'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Edit2, QrCode, Share } from 'lucide-react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constante';
import NavBar from '../NavBar';
import QRCodeView from '../QRCodeView';
import CardItem from './CardItem';

const Flash = () => {
  const navigate = useNavigate();
  const [viewQRCode, setViewQRCode] = useState(false);
  const [data, setData] = useState([]);
  useEffect(()=>{
    const getPosts = async ()=>{
        try {
            const response = await axios.get(BASE_API_URL+"/api/post/all")
            setData(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    getPosts();
  }, [])

  return (
    <div className="container p-5 lg:max-w-3/5 mx-auto">
        <NavBar />
        
        <div className="flex justify-between items-center">
            <div className="flex items-center mb-3">
                <ChevronLeft
                    className="h-7 w-7 p-1 cursor-pointer" 
                    onClick={()=>navigate(-1)}
                />
                <h2 className='font-medium text-xl'>Mes cartes</h2>
            </div>
            <button 
                className='w-10 h-10 flex justify-center items-center bg-gray-300 text-gray-700 rounded-full cursor-pointer' 
                onClick={()=>navigate('/form')} 
            >
                <b>+</b>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
            {
                data?.map((item) => (
                    <CardItem key={item?._id} item={item} />
                ))
            }
        </div>
    </div>
  )
}

export default Flash
