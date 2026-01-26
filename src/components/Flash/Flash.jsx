import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react';
import { BASE_API_URL } from '../../utils/constante';
import NavBar from '../NavBar';
import CardItem from './CardItem';
import api from '../../utils/axiosConfig';

const Flash = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  useEffect(()=>{
    const getPosts = async ()=>{
        try {
            const response = await api.get(BASE_API_URL+"/api/cards/")
            setData(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
    getPosts();
  }, [])
  console.log(data)

  if(!data){
    return;
  }

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
                    <CardItem key={item?.id} item={item} />
                ))
            }
        </div>
    </div>
  )
}

export default Flash
