import { Link, useParams } from 'react-router-dom'
import { Mail, Map, Phone, Smartphone, User } from 'lucide-react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constante';

const Detail = () => {
    const {id} = useParams();
    const [item, setItem] = useState();
    useEffect(()=>{
        const getPost = async ()=>{
            const response = await axios.get(BASE_API_URL+"/api/post/"+id)
            setItem(response.data);
            return response.data;
        }
        getPost();
    }, [id])
    console.log(item);

    const detectPlatform = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Windows Phone
        if (/windows phone/i.test(userAgent)) return "Windows Phone";
        // Android
        if (/android/i.test(userAgent)) return "Android";
        // iOS
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return "iOS";
        
        return "Desktop";
    };

    console.log(detectPlatform());

    const launchContactApp = () => {
        const platform = detectPlatform();
        
        switch (platform) {
            case 'Android':
                // Intent Android pour l'application Contacts
                const androidIntent = `intent://insert/contact?name=${encodeURIComponent(item.name)}&phone=${encodeURIComponent(item.phone)}&email=${encodeURIComponent(item.email)}#Intent;scheme=com.android.contacts;action=com.android.contacts.action.INSERT;end`;
                window.location.href = androidIntent;
                break;
                
            case 'iOS':
                // iOS n'a pas de schéma direct pour pré-remplir les contacts
                // On ouvre l'app Contacts et on suggère à l'utilisateur de créer manuellement
                const iosUrl = `contacts://`;
                window.location.href = iosUrl;
                
                // Montrer un message avec les informations
                setTimeout(() => {
                alert(`Créez un nouveau contact avec:\nNom: ${item.name}\nTéléphone: ${item.phone}\nEmail: ${item.email}`);
                }, 1000);
                break;
                
            case 'Windows Phone':
                // Windows Phone
                window.location.href = `tel:${item.phone}`;
                break;
                
            default:
                // Desktop - ouvrir les applications par défaut
                const confirmed = window.confirm(
                `Voulez-vous:\n- Appeler: ${item.phone}\n- Envoyer un email: ${item.email}\n\nCliquez sur OK pour l'email ou Annuler pour appeler`
                );
                
                if (confirmed) {
                window.location.href = `mailto:${item.email}?subject=Contact ${item.name}&body=Bonjour ${item.name},`;
                } else {
                window.location.href = `tel:${item.phone}`;
                }
        }
    };

  return (
    <div className="container p-5 lg:max-w-3/5 mx-auto">
        <div>
            <img src={item?.coverPicture?.url ? item?.coverPicture?.url : "/no-banner.png"} style={{objectFit: 'cover', width: '100%', height: '230px'}} alt="" />
            <img src={item?.profilePicture?.url ? item?.profilePicture?.url : "/no-img.jpg"} style={{ width: '150px', height: '150px', objectFit: 'cover', border: '10px solid #fff', borderRadius: '50%', margin: '-80px 30px 0px'}} alt="" />
            <div className="content">
                <div className="infos ml-4 mt-3">
                    <div className='flex items-center gap-3 mb-2'><User width={20} /><b>{item?.name}</b></div>
                    <div className='flex items-center gap-3 mb-2'><Mail width={18} />{item?.email}</div>
                    <div className='flex items-center gap-3 mb-2'><Phone width={18} />{item?.phoneNumber}</div>
                    <div className='flex items-center gap-3 mb-2'><Map width={18} />{item?.address}</div>
                </div>
                <button onClick={launchContactApp} style={{display: 'inline-block',backgroundColor: '#000', color: '#fff', padding: '15px 25px', margin: '10px', borderRadius: '30px', cursor: 'pointer'}}>Enregistrer le contact</button>
                <div className="social ml-4">
                    <div className='flex items-center gap-3 mb-2'>
                        <Smartphone width={20} />
                        <Link to={item?.facebook}>Facebook</Link>
                    </div>
                    <div className='flex items-center gap-3 mb-2'>
                        <Smartphone width={20} />
                        <Link to={item?.instagram}>Instagram</Link>
                    </div>
                    <div className='flex items-center gap-3 mb-2'>
                        <Smartphone width={20} />
                        <Link to={item?.whatsapp}>Whatsapp</Link>
                    </div>
                    <div className='flex items-center gap-3 mb-2'>
                        <Smartphone width={20} />
                        <Link to={item?.linkedin}>LinkedIn</Link>
                    </div>
                    <div className='flex items-center gap-3 mb-2'>
                        <small className='text-gray-300'>{detectPlatform()}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Detail
