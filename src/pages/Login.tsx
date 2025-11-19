import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import axios from "axios"
import { BASE_API_URL } from "../utils/constante"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// Schéma de validation Zod
const loginSchema = z.object({
  phone: z.string()
    .min(1, "L'email ou le numéro de téléphone est requis"),
  password: z.string()
    .min(1, "Le mot de passe est requis"),
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();  

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    setMessage('')
    try {
      const response = await axios.post(BASE_API_URL+"/api/auth/login", {
        data: data.phone, 
        password: data.password
      })
      
      localStorage.setItem('user', response.data.profile)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('refreshToken', response.data.refreshToken)

      setLoading(false)
      setMessage('')
      navigate('/dashboard')
    } catch (err) {
      setLoading(false)
      setMessage('Echec de connexion')
    }   
  }

  return (
    <div className="w-screen px-3">
      <div className="shadow-xl bg-white my-5 mx-auto sm:w-[25rem]">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="w-full sm:mx-auto sm:w-full sm:max-w-sm">
            <img src="/logo.png" width={200} alt="logo la carte boss" className="mx-auto" />
            {/* <h3 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Connectez-vous</h3> */}
          </div>
          <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {message && <div className="flex w-full justify-center rounded-md">
                <small className='alert alert-danger p-2'>{message}</small>
              </div>}
              
              <div>
                <div className="relative mt-2 block mb-5 bg-gray-300 py-3 px-4 rounded-full focus:outline-0">
                  <input 
                    id="phone" 
                    type="text" 
                    {...register("phone")}
                    placeholder="Adresse email"
                    className="block w-full focus:outline-0 bg-transparent"
                    onChange={(e) => setValue("phone", e.target.value)}
                    autoFocus
                  />
                  {errors.phone && (
                    <small className="text-red-500 text-xs mt-1">{errors.phone.message}</small>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    {/* <Link to={"/auth/find_user"} className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Oublié ?
                    </Link> */}
                  </div>
                </div>
                <div className="relative block mb-5 bg-gray-300 py-3 px-4 rounded-full focus:outline-0">
                  <input 
                    id="password" 
                    placeholder="Mot de passe"
                    className="block w-full focus:outline-0 bg-transparent"
                    type={showPassword ? "text" : "password"} 
                    {...register("password")}
                    onChange={(e) => setValue("password", e.target.value)}
                  />
                  {showPassword
                    ? <FaRegEye onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" />
                    : <FaRegEyeSlash onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer" />
                  }
                </div>
                {errors.password && (
                  <small className="text-red-500 text-xs mt-1">{errors.password.message}</small>
                )}
              </div>

              <div>
                {
                  loading
                  ? <button disabled className="button-disabled flex w-full justify-center py-3 px-4 rounded-full focus:outline-0 cursor-pointer" style={{border: '1px solid #ddd'}}>
                      Chargement...
                    </button>
                  : <button type="submit" className="flex w-full justify-center border border-[#26265eff] bg-[#26265eff] text-white py-3 px-4 rounded-full focus:outline-0 cursor-pointer">
                      Se connecter
                    </button>
                }
              </div>
              <hr className="border-gray-400 my-5" />
              <div>
                <Link to={"/auth/register"} className="flex w-full justify-center border border-[#26265eff] bg-white text-[#26265eff] py-3 px-4 rounded-full focus:outline-0">
                  Créer un compte
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login