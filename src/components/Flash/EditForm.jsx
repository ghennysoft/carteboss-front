import { useEffect, useRef, useState } from 'react'
import { BsCamera } from 'react-icons/bs'
import { BASE_API_URL } from '../../utils/constante';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../NavBar';
import { ChevronLeft, Trash2 } from 'lucide-react';
import api from '../../utils/axiosConfig';

const EditForm = () => {
    const {id} = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Références pour les fichiers
    const coverRef = useRef();
    const profileRef = useRef();
    const logoRef = useRef();

    // États pour les données du formulaire
    const [profile, setProfile] = useState(null);
    const [cover, setCover] = useState(null);
    const [logo, setLogo] = useState(null);
    const [name, setName] = useState("");
    const [profession, setProfession] = useState("");
    const [company, setCompany] = useState("");
    const [bio, setBio] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [websiteTitle, setWebsiteTitle] = useState("");
    const [websiteLink, setWebsiteLink] = useState("");
    const [facebookTitle, setFacebookTitle] = useState("");
    const [facebookLink, setFacebookLink] = useState("");
    const [whatsappTitle, setWhatsappTitle] = useState("");
    const [whatsappLink, setWhatsappLink] = useState("");
    const [instagramTitle, setInstagramTitle] = useState("");
    const [instagramLink, setInstagramLink] = useState("");
    const [linkedInTitle, setLinkedInTitle] = useState("");
    const [linkedInLink, setLinkedInLink] = useState("");
    const [xTitle, setXTitle] = useState("");
    const [xLink, setXLink] = useState("");
    const [tiktokTitle, setTiktokTitle] = useState("");
    const [tiktokLink, setTiktokLink] = useState("");
    const [youtubeTitle, setYoutubeTitle] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");

    useEffect(() => {
        const getPost = async () => {
            const response = await axios.get(BASE_API_URL + "/api/cards/" + id);
            setData(response.data);
            return response.data;
        }
        getPost();
    }, [id]);

    // Mettre à jour les états quand les données sont chargées
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setName(data.full_name || '');
            setProfession(data.profession || '');
            setCompany(data.company || '');
            setBio(data.bio || '');
            setPhoneNumber(data.phone_number || '');
            setEmail(data.email || '');
            setAddress(data.address || '');
            setWebsiteTitle(data.website_title || '');
            setWebsiteLink(data.website_link || '');
            setFacebookTitle(data.facebook_title || '');
            setFacebookLink(data.facebook_link || '');
            setWhatsappTitle(data.whatsapp_title || '');
            setWhatsappLink(data.whatsapp_link || '');
            setInstagramTitle(data.instagram_title || '');
            setInstagramLink(data.instagram_link || '');
            setLinkedInTitle(data.linkedin_title || '');
            setLinkedInLink(data.linkedin_link || '');
            setXTitle(data.x_title || '');
            setXLink(data.x_link || '');
            setTiktokTitle(data.tiktok_title || '');
            setTiktokLink(data.tiktok_link || '');
            setYoutubeTitle(data.youtube_title || '');
            setYoutubeLink(data.youtube_link || '');
        }
    }, [data]); // Ce useEffect s'exécute quand data change

    // Fonctions pour les images
    const getImageUrl = (file, dataUrl) => {
        if (file) return URL.createObjectURL(file);
        if (dataUrl) return dataUrl;
        return "/no-img.jpg";
    };

    const handleSubmit = async () => {
        setLoading(true)

        const formData = new FormData();
        formData.append('card_id', data?.card_id);
        formData.append('full_name', name);
        formData.append('profession', profession);
        formData.append('company', company);
        formData.append('bio', bio);
        formData.append('phone_number', phoneNumber);
        formData.append('email', email);
        formData.append('address', address);
        formData.append('website_title', websiteTitle);
        formData.append('website_link', websiteLink);
        formData.append('facebook_title', facebookTitle);
        formData.append('facebook_link', facebookLink);
        formData.append('whatsapp_title', whatsappTitle);
        formData.append('whatsapp_link', whatsappLink);
        formData.append('instagram_title', instagramTitle);
        formData.append('instagram_link', instagramLink);
        formData.append('linkedin_title', linkedInTitle);
        formData.append('linkedin_link', linkedInLink);
        formData.append('x_title', xTitle);
        formData.append('x_link', xLink);
        formData.append('tiktok_title', tiktokTitle);
        formData.append('tiktok_link', tiktokLink);
        formData.append('youtube_title', youtubeTitle);
        formData.append('youtube_link', youtubeLink);

        if(profile){
            // const compressedProfile = await compressImage(profile);
            formData.append('profile_picture', profile);
        }
        if(cover){
            // const compressedCover = await compressImage(cover);
            formData.append('cover_picture', cover);
        }
        if(logo){
            // const compressedLogo = await compressImage(logo);
            formData.append('company_logo', logo);
        }

        try {
            await api.put(BASE_API_URL+"/api/cards/edit/"+id+"/", formData)
            
            setLoading(false)
            navigate('/dashboard')
        } catch (err) {
            console.log(err);
            setLoading(false)
        }   
    }

    // const handleDelete = async () => {
    //     try {
    //         const response = await axios.put(BASE_API_URL+"/api/post/delete/"+id)
    //         console.log(response?.data);
    //         navigate('/dashboard')
    //     } catch (err) {
    //         console.log(err);
    //         setLoading(false)
    //     }   
    // }

    return (
        <>
            {
                !data || Object.keys(data).length === 0
                ? <p>Chargement...</p>
                : (<div className="container p-5 lg:max-w-3/5 mx-auto">
                    <NavBar />
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center mb-3">
                            <ChevronLeft
                                className="h-7 w-7 p-1 cursor-pointer" 
                                onClick={()=>navigate(-1)}
                            />
                            <h2 className='font-medium text-xl'>Modifier la carte</h2>
                        </div>
                        {/* <button onClick={handleDelete} className='flex items-center bg-red-800 text-white rounded-lg p-3 cursor-pointer'> <Trash2 size={15} /> <small>Supprimer la carte</small></button> */}
                    </div>
                    {/* <form  > */}
                        {/* Images */}
                        <div className="relative">
                            <img src={getImageUrl(cover, data.cover_picture)} className='border' style={{objectFit: 'cover', width: '100%', height: '200px'}} alt="" />
                            <div className="flex justify-center items-center p-1 border border-gray-300 rounded-full bg-white absolute right-5 top-3 cursor-pointer" onClick={() => {coverRef.current.click()}}>
                                <BsCamera />
                            </div>
                            <div className='hidden'>
                                <input type="file" name="cover" id='cover' ref={coverRef} accept="image/*" onChange={(e)=>setCover(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="relative"  style={{ width: '140px', height: '140px', margin: '-50px 10px 0px'}}>
                            <img src={getImageUrl(profile, data.profile_picture)} className='border' style={{ width: '140px', height: '140px', objectFit: 'cover', border: '5px solid #ddd', borderRadius: '50%', margin: '-40px 10px 0px'}} alt="" />
                            <div className="flex justify-center items-center p-1 border rounded-full bg-white absolute right-0 bottom-0 cursor-pointer" onClick={() => {profileRef.current.click()}}>
                                <BsCamera />
                            </div>
                            <div className='hidden'>
                                <input type="file" name="profile" id='profile' ref={profileRef} accept="image/*" onChange={(e)=>setProfile(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="relative"  style={{ width: '65px', height: '65px', margin: '-90px 0px 0px 120px'}}>
                            <img src={getImageUrl(logo, data.company_logo)} className='border' style={{ width: '65px', height: '65px', objectFit: 'cover', border: '3px solid #ddd', borderRadius: '50%', margin: '-40px 10px 0px'}} alt="" />
                            <div className="flex justify-center items-center p-1 border border-gray-400 rounded-full bg-white absolute -right-2 bottom-0 cursor-pointer" onClick={() => {logoRef.current.click()}}>
                                <BsCamera size={10} />
                            </div>
                            <div className='hidden'>
                                <input type="file" name="logo" id='logo' ref={logoRef} accept="image/*" onChange={(e)=>setLogo(e.target.files[0])} />
                            </div>
                        </div>

                        <p className='text-lg mt-5 p-2'><b>Identité</b></p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input type="text" name="name" id="name"
                                className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
                                onChange={(e)=>setName(e.target.value)} 
                                value={name}
                                placeholder='Nom' 
                                required
                            />
                            <input type="text" name="profession" id="profession"
                                className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
                                onChange={(e)=>setProfession(e.target.value)}
                                value={profession}
                                placeholder='Titre du travail'  
                                required
                            />
                            <input type="text" name="company" id="company"
                                className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
                                onChange={(e)=>setCompany(e.target.value)}
                                value={company}
                                placeholder='company' 
                            />
                        </div>
                        <textarea name="bio" id="bio" rows={5}
                            className='block w-full mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-xl'
                            onChange={(e)=>setBio(e.target.value)}
                                value={bio}
                            placeholder='Biographie'  
                        >
                        </textarea>

                        <p className='text-lg mt-5 p-2'><b>Contacts</b></p>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <input type="text" name="phoneNumber" id="phoneNumber"
                                className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
                                onChange={(e)=>setPhoneNumber(e.target.value)}
                                value={phoneNumber}
                                placeholder='Numéro de téléphone' 
                            />
                            <input type="email" name="email" id="email"
                                className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
                                onChange={(e)=>setEmail(e.target.value)}
                                value={email}
                                placeholder='Adresse email' 
                            />
                            <input type="text" name="address" id="address"
                                className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full focus:outline-0'
                                onChange={(e)=>setAddress(e.target.value)}
                                value={address}
                                placeholder='Adresse physique' 
                            />
                        </div>

                        {/* Liens */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="website">
                                <p className='text-lg mt-5 p-2'><b>Site web</b></p>                
                                <input type="text" name="websiteTitle" id="websiteTitle"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setWebsiteTitle(e.target.value)}
                                    value={websiteTitle}
                                    placeholder='Titre' 
                                />
                                <input type="text" name="websiteLink" id="websiteLink"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setWebsiteLink(e.target.value)}
                                    value={websiteLink}
                                    placeholder='Lien' 
                                />
                            </div>
                            <div className="facebook">
                                <p className='text-lg mt-5 p-2'><b>Facebook</b></p>                
                                <input type="text" name="facebookTitle" id="facebookTitle"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setFacebookTitle(e.target.value)}
                                    value={facebookTitle}
                                    placeholder='Titre' 
                                />
                                <input type="text" name="facebookLink" id="facebookLink"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setFacebookLink(e.target.value)}
                                    value={facebookLink}
                                    placeholder='Lien' 
                                />
                            </div>
                            <div className="whatsapp">
                                <p className='text-lg mt-5 p-2'><b>Whatsapp</b></p>                
                                <input type="text" name="whatsappTitle" id="whatsappTitle"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setWhatsappTitle(e.target.value)}
                                    value={whatsappTitle}
                                    placeholder='Titre' 
                                />
                                <input type="text" name="whatsappLink" id="whatsappLink"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setWhatsappLink(e.target.value)}
                                    value={whatsappLink}
                                    placeholder='Lien' 
                                />
                            </div>
                            <div className="instagram">
                                <p className='text-lg mt-5 p-2'><b>Instagram</b></p>                
                                <input type="text" name="instagramTitle" id="instagramTitle"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setInstagramTitle(e.target.value)}
                                    value={instagramTitle}
                                    placeholder='Titre' 
                                />
                                <input type="text" name="instagramLink" id="instagramLink"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setInstagramLink(e.target.value)}
                                    value={instagramLink}
                                    placeholder='Lien' 
                                />
                            </div>
                            <div className="linkedin">
                                <p className='text-lg mt-5 p-2'><b>Linkedin</b></p>                
                                <input type="text" name="linkedinTitle" id="linkedinTitle"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setLinkedInTitle(e.target.value)}
                                    value={linkedInTitle}
                                    placeholder='Titre' 
                                />
                                <input type="text" name="linkedinLink" id="linkedinLink"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setLinkedInLink(e.target.value)}
                                    value={linkedInLink}
                                    placeholder='Lien' 
                                />
                            </div>
                            <div className="x">
                                <p className='text-lg mt-5 p-2'><b>X</b></p>                
                                <input type="text" name="xTitle" id="xTitle"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setXTitle(e.target.value)}
                                    value={xTitle}
                                    placeholder='Titre' 
                                />
                                <input type="text" name="xLink" id="xLink"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setXLink(e.target.value)}
                                    value={xLink}
                                    placeholder='Lien' 
                                />
                            </div>
                            <div className="tiktok">
                                <p className='text-lg mt-5 p-2'><b>Tiktok</b></p>                
                                <input type="text" name="tiktokTitle" id="tiktokTitle"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setTiktokTitle(e.target.value)}
                                    value={tiktokTitle}
                                    placeholder='Titre' 
                                />
                                <input type="text" name="tiktokLink" id="tiktokLink"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setTiktokLink(e.target.value)}
                                    value={tiktokLink}
                                    placeholder='Lien' 
                                />
                            </div>
                            <div className="youtube">
                                <p className='text-lg mt-5 p-2'><b>Youtube</b></p>                
                                <input type="text" name="youtubeTitle" id="youtubeTitle"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setYoutubeTitle(e.target.value)}
                                    value={youtubeTitle}
                                    placeholder='Titre' 
                                />
                                <input type="text" name="youtubeLink" id="youtubeLink"
                                    className='block mb-5 bg-gray-300 py-2 lg:py-3 px-4 rounded-full w-full focus:outline-0'
                                    onChange={(e)=>setYoutubeLink(e.target.value)}
                                    value={youtubeLink}
                                    placeholder='Lien' 
                                />
                            </div>
                        </div>
                        {
                            !loading 
                            ? <button 
                                type='submit'
                                onClick={handleSubmit}
                                className='block lg:mt-4 mb-5 bg-gray-700 hover:bg-gray-900 text-white lg:py-3 py-2 px-4 rounded-full w-72 cursor-pointer'
                            >
                                Modifier 
                            </button>
                            : <button 
                                type='button'
                                className='block lg:mt-4 mb-5 bg-gray-400 text-gray-600 lg:py-3 py-2 px-4 rounded-full w-72 cursor-pointer'
                            >
                                Chargement...
                            </button>
                        }
                    {/* </form> */}
                </div>)
            }
        </>
    )
}

export default EditForm