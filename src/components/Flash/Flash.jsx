import { data } from '../../utils/data'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Map, Phone, User } from 'lucide-react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constante';
import NavBar from '../NavBar';

const Flash = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(()=>{
    const getPosts = async ()=>{
        const response = await axios.get(BASE_API_URL+"/api/post/all")
        setData(response.data);
        return response.data;
    }
    getPosts();
  }, [])

  return (
    <div className="container p-5 lg:max-w-3/5 mx-auto">
        <NavBar />
        
        <div className="flex justify-between items-center">
            <h2 className='font-medium mb-3 text-xl'>Mes cartes</h2>
            <button 
                className='w-10 h-10 flex justify-center items-center bg-gray-300 text-gray-700 rounded-full cursor-pointer' 
                onClick={()=>navigate('/form')} 
            >
                <b>+</b>
            </button>
        </div>

        {
            data?.map((item) => (
                <Link to={`/${item?._id}`} key={item?._id} className=''>
                    <div className="flex items-start p-3">
                        <img src={item?.profilePicture?.url ? item?.profilePicture?.url : "/no-img.jpg"} style={{ width: '100px', height: '80px', objectFit: 'cover', border: '1px solid #aaa', borderRadius: '20px'}} alt="" />
                        <div className="content ml-2">
                            <div className="infos">
                                <div className='flex items-center gap-3 mb-2'><User width={20} /><b>{item?.name}</b></div>
                                <div className='flex items-center gap-3 mb-2'><Mail width={18} />{item?.email}</div>
                                <div className='flex items-center gap-3 mb-2'><Phone width={18} />{item?.phoneNumber}</div>
                                <div className='flex items-center gap-3 mb-2'><Map width={18} />{item?.address}</div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))
        }
    </div>
  )
}

export default Flash
