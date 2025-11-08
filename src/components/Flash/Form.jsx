import { useRef, useState } from 'react'
import { BsCamera } from 'react-icons/bs'
import { BASE_API_URL } from '../../utils/constante';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';

const Form = () => {
    const coverRef = useRef();
    const profileRef = useRef();
    const [profile, setProfile] = useState(null);
    const [cover, setCover] = useState(null);
    const [name, setName] = useState("");
    const [profession, setProfession] = useState("");
    const [company, setCompany] = useState("");
    const [bio, setBio] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [website, setWebsite] = useState("");
    const [facebook, setFacebook] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [instagram, setInstagram] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [x, setX] = useState("");
    const [tiktok, setTiktok] = useState("");
    const [youtube, setYoutube] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        setLoading(true)

        const formData = new FormData();
        formData.append("name", name);
        formData.append("profession", profession);
        formData.append("company", company);
        formData.append("bio", bio);
        formData.append("phoneNumber", phoneNumber);
        formData.append("email", email);
        formData.append("address", address);
        formData.append("website", website);
        formData.append("facebook", facebook);
        formData.append("whatsapp", whatsapp);
        formData.append("instagram", instagram);
        formData.append("linkedin", linkedIn);
        formData.append("x", x);
        formData.append("tiktok", tiktok);
        formData.append("youtube", youtube);

        try {
            const response = await axios.post(BASE_API_URL+"/api/post/create", formData)
            console.log(response?.data);
            
            if(profile){
                const profileData = new FormData();
                profileData.append('profilePicture', profile)
                await axios.put(BASE_API_URL+"/api/post/picture/"+response?.data?._id, profileData)
                .then(res => console.log(res))
                .catch(err => console.log(err))
            }
            
            if(cover){
                const coverData = new FormData();
                coverData.append('coverPicture', cover)
                await axios.put(BASE_API_URL+"/api/post/cover/"+response?.data?._id, coverData)
                .then(res => console.log(res))
                .catch(err => console.log(err))
            }

            setLoading(false)
            navigate('/dashboard')
        } catch (err) {
            console.log(err);
            setLoading(false)
        }   
    }

    return (
        <div className="container p-5 lg:max-w-3/5 mx-auto">
            <NavBar />

            <h2 className='font-medium mb-3 text-xl'>Nouvelle carte</h2>
            {/* <form > */}
                <div className="relative">
                    <img src={cover?URL.createObjectURL(cover):''} className='border' style={{objectFit: 'cover', width: '100%', height: '100px'}} alt="" />
                    <div className="flex justify-center items-center p-1 border rounded-full bg-white absolute right-5 top-3 cursor-pointer" onClick={() => {coverRef.current.click()}}>
                        <BsCamera />
                    </div>
                    <div className='hidden'>
                        <input type="file" name="cover" id='cover' ref={coverRef} accept="image/*" onChange={(e)=>setCover(e.target.files[0])} />
                    </div>
                </div>
                <div className="relative"  style={{ width: '120px', height: '120px', margin: '-40px 10px 0px'}}>
                    <img src={profile?URL.createObjectURL(profile):''} className='border' style={{ width: '120px', height: '120px', objectFit: 'cover', border: '2px solid #fff', borderRadius: '50%', margin: '-40px 10px 0px'}} alt="" />
                    <div className="flex justify-center items-center p-1 border rounded-full bg-white absolute right-0 bottom-0 cursor-pointer" onClick={() => {profileRef.current.click()}}>
                        <BsCamera />
                    </div>
                    <div className='hidden'>
                        <input type="file" name="profile" id='profile' ref={profileRef} accept="image/*" onChange={(e)=>setProfile(e.target.files[0])} />
                    </div>
                </div>

                <p className='text-lg mt-5 p-2'><b>Identité</b></p>
                <input type="text" name="name" id="name"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setName(e.target.value)}
                    placeholder='Nom' 
                />
                <input type="text" name="profession" id="profession"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setProfession(e.target.value)}
                    placeholder='Profession' 
                />
                <input type="text" name="company" id="company"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setCompany(e.target.value)}
                    placeholder='company' 
                />
                <textarea name="bio" id="bio" rows={5}
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-xl w-72'
                    onChange={(e)=>setBio(e.target.value)}
                    placeholder='Biographie' 
                >
                </textarea>

                <p className='text-lg mt-5 p-2'><b>Contacts</b></p>
                <input type="text" name="phoneNumber" id="phoneNumber"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setPhoneNumber(e.target.value)}
                    placeholder='Numéro de téléphone' 
                />
                <input type="email" name="email" id="email"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder='Adresse email' 
                />
                <input type="text" name="address" id="address"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setAddress(e.target.value)}
                    placeholder='Adresse physique' 
                />

                <p className='text-lg mt-5 p-2'><b>Liens</b></p>
                <input type="text" name="website" id="website"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setWebsite(e.target.value)}
                    placeholder='Site web' 
                />
                <input type="text" name="facebook" id="facebook"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setFacebook(e.target.value)}
                    placeholder='Facebook' 
                />
                <input type="text" name="whatsapp" id="whatsapp"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setWhatsapp(e.target.value)}
                    placeholder='Whatsapp' 
                />
                <input type="text" name="instagram" id="instagram"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setInstagram(e.target.value)}
                    placeholder='Instagram' 
                />
                <input type="text" name="linkedin" id="linkedin"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setLinkedIn(e.target.value)}
                    placeholder='LinkedIn' 
                />
                <input type="text" name="x" id="x"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setX(e.target.value)}
                    placeholder='X' 
                />
                <input type="text" name="tiktok" id="tiktok"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setTiktok(e.target.value)}
                    placeholder='Tiktok' 
                />
                <input type="text" name="youtube" id="youtube"
                    className='block mb-5 bg-gray-300 py-2 px-4 rounded-full w-72 focus:outline-0'
                    onChange={(e)=>setYoutube(e.target.value)}
                    placeholder='Youtube' 
                />
                <button 
                    type='submit'
                    onClick={handleSubmit}
                    className='block mb-5 bg-gray-700 hover:bg-gray-900 text-white py-2 px-4 rounded-full w-72 cursor-pointer'
                >
                    {!loading ? "Enregistrer" : "Chargement..."}
                </button>
            {/* </form> */}
        </div>
    )
}

export default Form
