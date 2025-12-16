import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constante';
import { Buffer } from 'buffer'

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

    const generateVCard = async () => {
        try {
            let photoBase64 = null;
            // Convertir l'image en base64
            if (item?.profilePicture?.url) {
                try {
                    // Utiliser axios pour récupérer l'image
                    const response = await axios.get(item.profilePicture.url, {
                        responseType: 'arraybuffer' 
                    });
                    
                    // Convertir en base64
                    const buffer = Buffer.from(response.data, 'binary');
                    photoBase64 = buffer.toString('base64');
                } catch (error) {
                    // console.warn('Impossible de charger la photo:', error);
                }
            }

            // Construire le vCard ligne par ligne comme votre exemple
            const vCardLines = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `REV:${new Date().toISOString()}`,
            ];

            // Nom - IMPORTANT: format "Nom;Prénom;;;" pour iOS
            const nameParts = item?.name?.split(' ');
            const lastName = nameParts[nameParts?.length - 1] || '';
            const firstName = nameParts?.slice(0, -1).join(' ') || item?.name;
            
            vCardLines.push(`N;CHARSET=utf-8:${lastName};${firstName};;;`);
            vCardLines.push(`FN;CHARSET=utf-8:${item?.name}`);

            // Titre et organisation
            if (item?.profession) {
                vCardLines.push(`TITLE;CHARSET=utf-8:${item?.profession}`);
            }
            if (item?.company) {
                vCardLines.push(`ORG;CHARSET=utf-8:${item?.company}`);
            }

            // Note/Bio (échapper les retours à la ligne)
            if (item?.bio) {
                const formattedBio = item?.bio.replace(/\n/g, '\\n');
                vCardLines.push(`NOTE;CHARSET=utf-8:${formattedBio}`);
            }

            // URLs - format spécifique comme votre exemple
            if (item?.linkedin?.url) {
                vCardLines.push(`URL;TYPE=${item?.name}:${item?.linkedin.url}`);
            }
            if (item?.website?.url) {
                vCardLines.push(`URL;TYPE=Website:${item?.website.url}`);
            }
            if (item?.facebook?.url) {
                vCardLines.push(`URL;TYPE=${item?.name}:${item?.facebook.url}`);
            }
            if (item?.instagram?.url) {
                vCardLines.push(`URL;TYPE=${item?.name}:${item?.instagram.url}`);
            }
            if (item?.x?.url) {
                vCardLines.push(`URL;TYPE=${item?.name}:${item?.x.url}`);
            }
            if (item?.whatsapp?.url) {
                vCardLines.push(`URL;TYPE=${item?.name}:${item?.whatsapp.url}`);
            }
            if (item?.tiktok?.url) {
                vCardLines.push(`URL;TYPE=${item?.name}:${item?.tiktok.url}`);
            }
            if (item?.youtube?.url) {
                vCardLines.push(`URL;TYPE=${item?.name}:${item?.youtube.url}`);
            }

            // Email
            if (item?.email) {
                vCardLines.push(`EMAIL;INTERNET;TYPE=Email:${item?.email}`);
            }

            // Téléphones (formats différents)
            if (item?.phoneNumber) {
                vCardLines.push(`TEL;TYPE=Number:${item?.phoneNumber}`);
                vCardLines.push(`TEL;TYPE=Téléphone:+${item?.phoneNumber}`);
            }

            // Adresse
            if (item?.address) {
                vCardLines.push(`ADR;TYPE=Address;CHARSET=utf-8:;;${item?.address};;;;`);
            }

            // Champ personnalisé pour la date
            vCardLines.push(`X-ABDATE;TYPE=Date connected via Boss:${new Date().toISOString().split('T')[0]}`);

            // PHOTO en base64 (sans sauts de ligne!)
            if (photoBase64) {
                vCardLines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`);
            }

            vCardLines.push('END:VCARD');

            // Joindre avec des retours à la ligne Windows (\r\n) pour compatibilité
            const vCardString = vCardLines.join('\r\n');
            
            // Créer et télécharger le fichier
            const blob = new Blob([vCardString], { 
                type: 'text/vcard;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${item?.name.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`;
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
        return <div className='text-center p-3'>Chargement...</div>;
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
                </div>
            </div>
        </div>
    </div>
  )
}

export default Detail
