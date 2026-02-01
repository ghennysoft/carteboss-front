import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Search } from 'lucide-react'
import { useEffect, useState } from 'react';
import { BASE_API_URL } from '../../utils/constante';
import NavBar from '../NavBar';
import CardItem from './CardItem';
import api from '../../utils/axiosConfig';

const Flash = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

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

  const filteredData = data.filter(item =>
      item.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  console.log({data})
  console.log({filteredData})

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

        <div className="relative flex-1 p-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
                placeholder="Tapez le nom de la personne pour rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background w-full p-2"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
            {
                filteredData?.map((item) => (
                    <CardItem key={item?.id} item={item} />
                ))
            }
        </div>
    </div>
  )
}

export default Flash
