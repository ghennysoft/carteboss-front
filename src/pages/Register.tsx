import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import api from "../utils/axiosConfig"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { BASE_API_URL } from "../utils/constante";

// Schéma de validation Zod
const registerSchema = z.object({
  firstname: z.string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastname: z.string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string()
    .min(1, "L'adresse email est requise"),
  password: z.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
    }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

const Register = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        if (data.password !== data.confirmPassword) {
            setLoading(false);
            setMessage('Le mot de passe de confirmation est différent');
            return;
        }
        setMessage('');
        const submitData = {
            username: data.firstname.toLowerCase()+data.lastname.toLowerCase(),
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
        };

        try {
            const response = await api.post(BASE_API_URL+"/api/auth/register", submitData)
            localStorage.setItem('user', response.data.profile);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            setLoading(false);
            setMessage('');
            navigate('/dashboard');
        } catch (err) {
            setLoading(false);
            setMessage('Erreur de création de compte!');
        }
    }

    const passwordValue = watch("password");

    return (
        <div className="w-screen px-3">
            <div className="shadow-xl bg-white my-5 mx-auto sm:w-[25rem]">
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="w-full sm:mx-auto sm:w-full sm:max-w-sm">
            <img src="/logo.png" width={200} alt="logo la carte boss" className="mx-auto" />
                        {/* <h3 className="mt-3 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Inscrivez-vous</h3> */}
                    </div>
                    <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                            {message && <div className="flex w-full justify-center rounded-md">
                                <small className='alert alert-danger p-2'>{message}</small>
                            </div>}
                            
                            <div>
                                <div className="relative mt-2 block mb-5 bg-gray-300 py-3 px-4 rounded-full focus:outline-0">
                                    <input 
                                        id="firstname" 
                                        type="text" 
                                        {...register("firstname")}
                                        placeholder="Prénom"
                                        className="block w-full focus:outline-0 bg-transparent" 
                                        autoFocus
                                    />
                                    {errors.firstname && (
                                        <small className="text-red-500 text-xs mt-1">{errors.firstname.message}</small>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="relative mt-2 block mb-5 bg-gray-300 py-3 px-4 rounded-full focus:outline-0">
                                    <input 
                                        id="lastname" 
                                        type="text" 
                                        placeholder="Nom"
                                        {...register("lastname")}
                                        className="block w-full focus:outline-0 bg-transparent" 
                                    />
                                    {errors.lastname && (
                                        <small className="text-red-500 text-xs mt-1">{errors.lastname.message}</small>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="relative mt-2 block mb-5 bg-gray-300 py-3 px-4 rounded-full focus:outline-0">
                                    <input 
                                        id="email" 
                                        type="email" 
                                        placeholder="Adresse email"
                                        {...register("email")}
                                        className="block w-full focus:outline-0 bg-transparent" 
                                    />
                                    {errors.email && (
                                        <small className="text-red-500 text-xs mt-1">{errors.email.message}</small>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="relative mt-2 block mb-5 bg-gray-300 py-3 px-4 rounded-full focus:outline-0">
                                    <input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Mot de passe"
                                        {...register("password")}
                                        className="block w-full focus:outline-0 bg-transparent" 
                                    />
                                    {showPassword
                                        ? <FaRegEye onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer"  />
                                        : <FaRegEyeSlash onClick={()=>setShowPassword(!showPassword)} className="absolute top-4 right-3 cursor-pointer"  />
                                    }
                                </div>
                                {errors.password && (
                                    <small className="text-red-500 text-xs mt-1">{errors.password.message}</small>
                                )}
                            </div>

                            <div>
                                <div className="relative mt-2 block mb-5 bg-gray-300 py-3 px-4 rounded-full focus:outline-0">
                                    <input 
                                        id="confirmPassword" 
                                        placeholder="Confirmation mot de passe"
                                        type={showConfirmPassword ? "text" : "password"} 
                                        {...register("confirmPassword")}
                                        className="block w-full focus:outline-0 bg-transparent" 
                                    />
                                    {showConfirmPassword
                                        ? <FaRegEye onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute top-4 right-3 cursor-pointer"  />
                                        : <FaRegEyeSlash onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute top-4 right-3 cursor-pointer"  />
                                    }
                                </div>
                                {errors.confirmPassword && (
                                    <small className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</small>
                                )}
                            </div>

                            <div>
                                {
                                    loading
                                    ? <button disabled className="button-disabled flex w-full justify-center py-3 px-4 rounded-full focus:outline-0 cursor-pointer" style={{border: '1px solid #ddd'}}>
                                        Chargement...
                                        </button>
                                    : <button type="submit" className="flex w-full justify-center border border-[#26265eff] bg-[#26265eff] text-white py-3 px-4 rounded-full focus:outline-0 cursor-pointer">
                                        Créer un compte
                                        </button>
                                }
                            </div>
                            <hr className="border-gray-400 my-5" />
                            <div>
                                <Link to={"/"} className="flex w-full justify-center border border-[#26265eff] bg-white text-[#26265eff] py-3 px-4 rounded-full focus:outline-0">
                                    Connexion
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register