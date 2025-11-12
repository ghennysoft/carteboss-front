import { Link, useParams } from 'react-router-dom'
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
    // console.log(item);

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
    // console.log(detectPlatform());

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

    // Fonction pour convertir une image URL en base64
    const imageUrlToBase64 = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Erreur conversion image:', error);
            return null;
        }
    };

    const generateVCard = async () => {
        try {
            let photoBase64 = null;
            
            // Convertir l'image de profil en base64 si elle existe
            if (item?.profilePicture?.url) {
                photoBase64 = await imageUrlToBase64(item.profilePicture.url);
            }
                
            // Construction du vCard avec tous les champs
            const vCardLines = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${item.name || ''}`,
            ];

            // Téléphones
            if (item.phoneNumber) vCardLines.push(`TEL;TYPE=WORK,VOICE:${item.phoneNumber}`);

            // Emails
            if (item.email) vCardLines.push(`EMAIL;TYPE=WORK:${item.email}`);

            // Entreprise et poste
            if (item.company) vCardLines.push(`ORG:${item.company}`);
            if (item.profession) vCardLines.push(`TITLE:${item.profession}`);

            // Adresse
            if (item.address) {
                vCardLines.push(`ADR;TYPE=WORK:;;${item.address};;;;`);
            }

            // Site web
            if (item.website?.url) vCardLines.push(`URL:${item.website?.url}`);

            // Réseaux sociaux
            if (item.linkedin?.url) vCardLines.push(`X-SOCIALPROFILE;TYPE=linkedin:${item.linkedin?.url}`);
            if (item.x?.url) vCardLines.push(`X-SOCIALPROFILE;TYPE=twitter:${item.x?.url}`);
            if (item.facebook?.url) vCardLines.push(`X-SOCIALPROFILE;TYPE=facebook:${item.facebook?.url}`);
            if (item.instagram?.url) vCardLines.push(`X-SOCIALPROFILE;TYPE=instagram:${item.instagram?.url}`);

            // Bio/notes
            if (item.bio) vCardLines.push(`NOTE:${item.bio.replace(/\n/g, '\\n')}`);

            // Photo en base64
            if (photoBase64) {
                // Extraire seulement la partie base64 (sans le préfixe data:image/...)
                const base64Data = photoBase64.split(',')[1];
                vCardLines.push(`PHOTO;ENCODING=B;TYPE=JPEG:${base64Data}`);
            }

            vCardLines.push('END:VCARD');

            const vCard = vCardLines.join('\n');
            console.log('vCard généré:', vCard); // Pour debug

            const blob = new Blob([vCard], { 
                type: 'text/vcard;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${item.name.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 1000);
        } catch (error) {
            console.error('Erreur vCard:', error);
            alert('Erreur lors du téléchargement du contact');
        }
    };

    if (!item) {
        return <div>Contact non disponible</div>;
    }

  return (
    <div className="container p-5 lg:max-w-3/5 mx-auto">
        <div>
            <img src={item?.coverPicture?.url ? item?.coverPicture?.url : "/no-banner.png"} style={{objectFit: 'cover', width: '100%', height: '230px'}} alt="" />
            <img src={item?.profilePicture?.url ? item?.profilePicture?.url : "/no-img.jpg"} style={{ width: '150px', height: '150px', objectFit: 'cover', border: '2px solid #ddd', borderRadius: '50%', margin: '-80px 30px 0px'}} alt="" />
            {item?.companyLogo?.url && <img src={item?.companyLogo?.url ? item?.companyLogo?.url : "/no-img.jpg"} className='border' style={{ width: '56px', height: '56px', objectFit: 'cover', border: '3px solid #ddd', borderRadius: '50%', margin: '-65px 0px 0px 140px'}} alt="" />}
            <div className="content">
                <div className="infos ml-4 mt-3">
                    <div className='flex items-center gap-3 mb-2' style={{fontSize: "2rem"}}><b>{item?.name}</b></div>
                    <div className='flex items-center gap-3 mb-2' style={{fontSize: "1.3rem"}}><b>{item?.profession}</b></div>
                    <div className='flex items-center gap-3 mb-2' style={{fontSize: "1.3rem"}}><b>{item?.company}</b></div>
                    <div className='flex items-center gap-3 mb-2' style={{fontSize: "1.1rem"}}>{item?.bio}</div>
                </div>
                <button 
                    onClick={generateVCard} 
                    className='bg-gray-900 text-white my-5 mx-3 py-4 px-18 cursor-pointer'
                    style={{display: 'inline-block', borderRadius: '30px'}}
                >Enregistrer le contact</button>
                <div className="social ml-4">
                    {item?.phoneNumber && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/phone.jpg" width={40} />
                        <a href={`tel:${item?.phoneNumber}`} style={{fontSize: "1.1rem"}}>{item?.phoneNumber}</a>
                    </div>}
                    {item?.email && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/gmail.png" width={40} />
                        <a href={`mailto:${item?.email}`} style={{fontSize: "1.1rem"}}>{item?.email}</a>
                    </div>}
                    {item?.address && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/placeholder.png" width={40} />
                        <Link to={item?.address} style={{fontSize: "1.1rem"}}>{item?.address}</Link>
                    </div>}
                    {item?.facebook?.url && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/facebook.png" width={40} />
                        <Link target={"_blank"} to={item?.facebook?.url} style={{fontSize: "1.1rem"}}>{item?.facebook?.title ? item?.facebook?.title : "Facebook"}</Link>
                    </div>}
                    {item?.whatsapp?.url && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/whatsapp.png" width={40} />
                        <Link target={"_blank"} to={item?.whatsapp?.url} style={{fontSize: "1.1rem"}}>{item?.whatsapp?.title ? item?.whatsapp?.title : "Whatsapp"}</Link>
                    </div>}
                    {item?.instagram?.url && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/instagram.png" width={40} />
                        <Link target={"_blank"} to={item?.instagram?.url} style={{fontSize: "1.1rem"}}>{item?.instagram?.title ? item?.instagram?.title : "Instagram"}</Link>
                    </div>}
                    {item?.linkedin?.url && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/linkedin.jpg" width={40} />
                        <Link target={"_blank"} to={item?.linkedin?.url} style={{fontSize: "1.1rem"}}>{item?.linkedin?.title ? item?.linkedin?.title : "Linkedin"}</Link>
                    </div>}
                    {item?.x?.url && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/x.jpg" width={40} />
                        <Link target={"_blank"} to={item?.x?.url} style={{fontSize: "1.1rem"}}>{item?.x?.title ? item?.x?.title : "X"}</Link>
                    </div>}
                    {item?.tiktok?.url && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/tiktok.jpg" width={40} />
                        <Link target={"_blank"} to={item?.tiktok?.url} style={{fontSize: "1.1rem"}}>{item?.tiktok?.title ? item?.tiktok?.title : "Tiktok"}</Link>
                    </div>}
                    {item?.youtube?.url && <div className='flex items-center gap-3 mb-5'>
                        <img src="/social/youtube.jpg" width={40} />
                        <Link target={"_blank"} to={item?.youtube?.url} style={{fontSize: "1.1rem"}}>{item?.youtube?.title ? item?.youtube?.title : "Youtube"}</Link>
                    </div>}
                    {/* <div className='flex items-center gap-3 mb-2'>
                        <small className='text-gray-300'>{detectPlatform()}</small>
                    </div> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Detail
