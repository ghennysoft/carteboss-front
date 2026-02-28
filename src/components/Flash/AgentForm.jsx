import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../NavBar';
import { ChevronLeft } from 'lucide-react';
import api from '../../utils/axiosConfig';

const AgentForm = () => {
  const {id} = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null)

  const date = new Date();
  const reference = 'VTE-' 
      + date.getFullYear()
      + String(date.getMonth() + 1).padStart(2, '0') 
      + String(date.getDate()).padStart(2, '0')  + '-' 
      + Math.random().toString().slice(2,7) 

  const [formData, setFormData] = useState({
    payment_reference: reference,
    amount_paid: 0,
    paid_date: "",
    method: "",
    card: id,
    status: "paid",
    agent_code: "",
    created_by: user?.id,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Ici, vous ajouterez l'appel API pour sauvegarder
    try {
      await api.post("/api/sales/", formData)  
      // console.log(response);      
      navigate("/sales");
    } catch (error) {
      setFormError(error?.response?.data)
      // console.log(error);      
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container p-5 lg:max-w-3/5 mx-auto">
      <NavBar />
      <div className="flex items-center mb-3">
        <ChevronLeft
          className="h-7 w-7 p-1 cursor-pointer" 
          onClick={()=>navigate(-1)}
        />
        <h2 className='font-medium text-xl'>Enregistrement de la vente</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <label htmlFor="">
            <h6 className='p-2'>Code agent*</h6>
            <input type="text" name="agent_code" id="agent_code"
              className='block w-full mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
              onChange={(e)=>{
                setFormData({...formData, agent_code: e.target.value});
                setFormError(null);
              }} 
              placeholder='' 
              required
          />
          {formError?.agent_code && <small className="pl-2 text-red-800"><b>{formError?.agent_code ? formError?.agent_code : ''}</b></small>}
          </label>
          <label htmlFor="">
            <h6 className='p-2'>Montant*</h6>
            <input type="number" name="amount_paid" id="amount_paid"
              className='block w-full mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
              onChange={(e)=>setFormData({...formData, amount_paid: e.target.value})} 
              placeholder='' 
              required
          />
          </label>
          <label htmlFor="">
            <h6 className='p-2'>Date de paiement*</h6>
            <input type="date" name="paid_date" id="paid_date"
              className='block w-full mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
              onChange={(e)=>setFormData({...formData, paid_date: e.target.value})} 
              placeholder='' 
              required
          />
          </label>
          {/* <label htmlFor="status">
            <h6 className='p-2'>Statut*</h6>
            <select 
              name="status" 
              id="status" 
              onChange={(e)=>setFormData({...formData, status: e.target.value})} 
              required
              className='block w-full mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
            >
              <option value="">--- Sélectionner un statut ---</option>
              <option value="pending">En attente</option>
              <option value="paid">Payé</option>
            </select>
          </label> */}

          <label htmlFor="method">
            <h6 className='p-2'>Methode*</h6>
            <select 
              name="method" 
              id="method" 
              onChange={(e)=>setFormData({...formData, method: e.target.value})} 
              required
              className='block w-full mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
            >
              <option value="">--- Sélectionner une methode ---</option>
              <option value="cash">Espèce</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Virement bancaire</option>
            </select>
          </label>
      </div>
      {
        !loading 
        ? <button 
            type='submit'
            onClick={handleSubmit}
            className='block lg:mt-4 mb-5 bg-gray-700 hover:bg-gray-900 text-white lg:py-3 py-2 px-4 rounded-full w-72 cursor-pointer'
        >
            Enregistrer 
        </button>
        : <button 
            type='button'
            className='block lg:mt-4 mb-5 bg-gray-400 text-gray-600 lg:py-3 py-2 px-4 rounded-full w-72 cursor-pointer'
        >
            Chargement...
        </button>
      }
    </div>
  )
}

export default AgentForm;
