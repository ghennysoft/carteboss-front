import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
 import { BASE_API_URL } from '../../utils/constante';
import { Buffer } from 'buffer'
import axios from 'axios';
import NoDetail from '../NoDetail';

const Detail = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState();
    useEffect(()=>{
        const getPost = async ()=>{
            const response = await axios.get(BASE_API_URL+"/api/cards/"+id)
            setItem(response.data);
            return response.data;
        }
        getPost();
    }, [id])



    const escapeVCardText = (value = "") =>
    String(value)
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");

    const formatVCardTimestamp = (date = new Date()) =>
    date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");


    const generateVCard = async () => {
        setLoading(true);
        try {
            let photoBase64 = null;
            // Convertir l'image en base64
            if (item?.profile_picture) {
                try {
                    // Utiliser axios pour récupérer l'image
                    const response = await axios.get(item.profile_picture, {
                        responseType: 'arraybuffer' 
                    });
                    
                    // Convertir en base64
                    const buffer = Buffer.from(response.data, 'binary');
                    const base64Photo = buffer.toString('base64');

                    if (base64Photo.length <= 102400 && /^[A-Za-z0-9+/]+=*$/.test(base64Photo)) {
                        photoBase64 = base64Photo;
                    } else {
                        console.warn('Photo invalide (taille ou format)');
                    }
                } catch (error) {
                    console.warn('Impossible de charger la photo:', error);
                }
            }

            // Construire le vCard ligne par ligne comme votre exemple
            const vCardLines = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `REV:${formatVCardTimestamp()}`,
            ].filter(Boolean);

            // Nom - IMPORTANT: format "Nom;Prénom;;;" pour iOS
            const nameParts = item?.full_name?.split(' ');
            const last_name = nameParts[nameParts?.length - 1] || '';
            const first_name = nameParts?.slice(0, -1).join(' ') || item?.full_name;
            
            vCardLines.push(`N;CHARSET=utf-8:${escapeVCardText(last_name)};${escapeVCardText(first_name)};;;`);
            vCardLines.push(`FN;CHARSET=utf-8:${escapeVCardText(item?.full_name)}`);

            // Titre et organisation
            if (item?.profession) {
                vCardLines.push(`TITLE;CHARSET=utf-8:${escapeVCardText(item?.profession)}`);
            }
            if (item?.company) {
                vCardLines.push(`ORG;CHARSET=utf-8:${escapeVCardText(item?.company)}`);
            }

            // Email
            if (item?.email) {
                vCardLines.push(`EMAIL;INTERNET;TYPE=Email:${escapeVCardText(item?.email)}`);
            }

            // Téléphones (formats différents)
            if (item?.phone_number) {
                vCardLines.push(`TEL;TYPE=CELL:${escapeVCardText(item?.phone_number)}`);
                if (item?.phone_number2) {
                    vCardLines.push(`TEL;TYPE=CELL:${escapeVCardText(item?.phone_number2)}`);
                }
            }

            // Adresse
            if (item?.address) {
                vCardLines.push(`ADR;TYPE=HOME;CHARSET=utf-8:;;${item?.address};;;;`);
            }

            // Note/Bio (échapper les retours à la ligne)
            if (item?.bio) {
                vCardLines.push(`NOTE;CHARSET=utf-8:${escapeVCardText(item?.bio)}`);
            }

            // URLs - format spécifique comme votre exemple
            if (item?.website_link) {
                vCardLines.push(`URL:${escapeVCardText(item?.website_link)}`);
            }
            if (item?.facebook_link) {
                vCardLines.push(`URL:${escapeVCardText(item?.facebook_title)}:${escapeVCardText(item?.facebook_link)}`);
            }
            if (item?.linkedin_link) {
                vCardLines.push(`URL:${escapeVCardText(item?.full_name)}:${escapeVCardText(item?.linkedin_link)}`);
            }
            if (item?.instagram_link) {
                vCardLines.push(`URL:${escapeVCardText(item?.instagram_title)}:${escapeVCardText(item?.instagram_link)}`);
            }
            // if (item?.whatsapp_link) {
            //     vCardLines.push(`URL:${escapeVCardText(item?.whatsapp_title)}:${escapeVCardText(item?.whatsapp_link)}`);
            // }
            // if (item?.x_link) {
            //     vCardLines.push(`URL:${escapeVCardText(item?.x_title)}:${escapeVCardText(item?.x_link)}`);
            // }
            // if (item?.tiktok_link) {
            //     vCardLines.push(`URL:${escapeVCardText(item?.tiktok_title)}:${escapeVCardText(item?.tiktok_link)}`);
            // }
            // if (item?.youtube_link) {
            //     vCardLines.push(`URL:${escapeVCardText(item?.youtube_title)}:${escapeVCardText(item?.youtube_link)}`);
            // }
            // if (item?.telegram_link) {
            //     vCardLines.push(`URL:${escapeVCardText(item?.telegram_title)}:${escapeVCardText(item?.telegram_link)}`);
            // }

            // Champ personnalisé pour la date
            // vCardLines.push(`X-ABDATE;TYPE=Date connected via Boss:${new Date().toISOString().split('T')[0]}`);

            // PHOTO en base64 (sans sauts de ligne!)
            if (photoBase64) {
                vCardLines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`);
            }

            vCardLines.push('END:VCARD');

            // Joindre avec des retours à la ligne Windows (\r\n) pour compatibilité
            const vCardString = vCardLines.join('\r\n') + "\r\n";
            console.log(vCardString);
            
            // Créer et télécharger le fichier
            const blob = new Blob(["\uFEFF" + vCardString], { 
                type: 'text/vcard;charset=utf-8'
            });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `${item?.full_name.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`;
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
        } finally {
            setLoading(false);
        }
    };

    if (!item) {
        return <div className='text-center p-3'>Chargement...</div>;
    }

    if(item?.deactivated || item?.sales?.length === 0) {
        return <NoDetail />
    }

    return (
        <div className="container p-5 lg:max-w-3/5 mx-auto">
            <div>
                <img src={item?.cover_picture ? item?.cover_picture : "/no-banner.png"} style={{objectFit: 'cover', width: '100%', height: '230px'}} alt="" />
                <img src={item?.profile_picture ? item?.profile_picture : "/no-img.jpg"} style={{ width: '150px', height: '150px', objectFit: 'cover', border: '2px solid #ddd', borderRadius: '50%', margin: '-80px 30px 0px'}} alt="" />
                {item?.company_logo && <img src={item?.company_logo ? item?.company_logo : "/no-img.jpg"} className='border' style={{ width: '56px', height: '56px', objectFit: 'cover', border: '3px solid #ddd', borderRadius: '50%', margin: '-65px 0px 0px 140px'}} alt="" />}
                <div className="content">
                    <div className="infos ml-4 mt-3">
                        <div className='flex items-center gap-3 mb-2' style={{fontSize: "2rem"}}><b>{item?.full_name}</b></div>
                        <div className='flex items-center gap-3 mb-2' style={{fontSize: "1.3rem"}}><b>{item?.profession}</b></div>
                        <div className='flex items-center gap-3 mb-2' style={{fontSize: "1.3rem"}}><b>{item?.company}</b></div>
                        <div className='flex items-center gap-3 mb-2' style={{fontSize: "1.1rem"}}>{item?.bio}</div>
                    </div>
                    {
                        loading
                        ? <button 
                            className='bg-gray-400 text-white my-5 mx-3 py-4 px-18 cursor-pointer'
                            style={{display: 'inline-block', borderRadius: '30px'}}
                        >Enregistrement en cours...</button>
                        : <button 
                            onClick={generateVCard} 
                            className='bg-gray-900 text-white my-5 mx-3 py-4 px-18 cursor-pointer'
                            style={{display: 'inline-block', borderRadius: '30px'}}
                        >Enregistrer le contact</button>
                    }
                    <div className="social ml-4">
                        {item?.phone_number && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/phone.jpg" width={40} />
                            <div className="flex flex-col">
                                <a href={`tel:${item?.phone_number}`} style={{fontSize: "1.1rem"}}>{item?.phone_number}</a>
                                {item?.phone_number2 && <a href={`tel:${item?.phone_number2}`} style={{fontSize: "1.1rem"}}>{item?.phone_number2}</a>}
                            </div>
                        </div>}
                        {item?.email && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/gmail.png" width={40} />
                            <div className="flex flex-col">
                                <a href={`mailto:${item?.email}`} style={{fontSize: "1.1rem"}}>{item?.email}</a>
                                {item?.email2 && <a href={`mailto:${item?.email2}`} style={{fontSize: "1.1rem"}}>{item?.email2}</a>}
                            </div>
                        </div>}
                        {item?.address && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/placeholder.png" width={40} />
                            <Link to={item?.address} style={{fontSize: "1.1rem"}}>{item?.address}</Link>
                        </div>}
                        {item?.facebook_link && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/facebook.png" width={40} />
                            <div className="flex flex-col"> 
                                <Link target={"_blank"} to={item?.facebook_link} style={{fontSize: "1.1rem"}}>{item?.facebook_title ? item?.facebook_title : "Facebook"}</Link>
                                {item?.facebook_link2 && <Link target={"_blank"} to={item?.facebook_link2} style={{fontSize: "1.1rem"}}>{item?.facebook_title2 ? item?.facebook_title2 : "Facebook"}</Link>}
                            </div>
                        </div>}
                        {item?.whatsapp_link && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/whatsapp.png" width={40} /> 
                            <div className="flex flex-col"> 
                                <Link target={"_blank"} to={item?.whatsapp_link} style={{fontSize: "1.1rem"}}>{item?.whatsapp_title ? item?.whatsapp_title : "Whatsapp"}</Link>
                                {item?.whatsapp_link2 && <Link target={"_blank"} to={item?.whatsapp_link2} style={{fontSize: "1.1rem"}}>{item?.whatsapp_title2 ? item?.whatsapp_title2 : "Whatsapp"}</Link>}
                            </div>
                        </div>}
                        {item?.instagram_link && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/instagram.png" width={40} /> 
                            <div className="flex flex-col"> 
                                <Link target={"_blank"} to={item?.instagram_link} style={{fontSize: "1.1rem"}}>{item?.instagram_title ? item?.instagram_title : "Instagram"}</Link>
                                {item?.instagram_link2 && <Link target={"_blank"} to={item?.instagram_link2} style={{fontSize: "1.1rem"}}>{item?.instagram_title2 ? item?.instagram_title2 : "Instagram"}</Link>}
                            </div>
                            <Link target={"_blank"} to={item?.instagram_link} style={{fontSize: "1.1rem"}}>{item?.instagram_title ? item?.instagram_title : "Instagram"}</Link>
                        </div>}
                        {item?.linkedin_link && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/linkedin.jpg" width={40} /> 
                            <div className="flex flex-col"> 
                                <Link target={"_blank"} to={item?.linkedin_link} style={{fontSize: "1.1rem"}}>{item?.linkedin_title ? item?.linkedin_title : "Linkedin"}</Link>
                                {item?.linkedin_link2 && <Link target={"_blank"} to={item?.linkedin_link2} style={{fontSize: "1.1rem"}}>{item?.linkedin_title2 ? item?.linkedin_title2 : "Linkedin"}</Link>}
                            </div>
                        </div>}
                        {item?.x_link && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/x.jpg" width={40} /> 
                            <div className="flex flex-col"> 
                                <Link target={"_blank"} to={item?.x_link} style={{fontSize: "1.1rem"}}>{item?.x_title ? item?.x_title : "X"}</Link>
                                {item?.x_link2 && <Link target={"_blank"} to={item?.x_link2} style={{fontSize: "1.1rem"}}>{item?.x_title2 ? item?.x_title2 : "X"}</Link>}
                            </div>
                        </div>}
                        {item?.tiktok_link && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/tiktok.jpg" width={40} /> 
                            <div className="flex flex-col"> 
                                <Link target={"_blank"} to={item?.tiktok_link} style={{fontSize: "1.1rem"}}>{item?.tiktok_title ? item?.tiktok_title : "Tik tok"}</Link>
                                {item?.tiktok_link2 && <Link target={"_blank"} to={item?.tiktok_link2} style={{fontSize: "1.1rem"}}>{item?.tiktok_title2 ? item?.tiktok_title2 : "Tik tok"}</Link>}
                            </div>
                        </div>}
                        {item?.youtube_link && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/youtube.jpg" width={40} />
                            <div className="flex flex-col"> 
                                <Link target={"_blank"} to={item?.youtube_link} style={{fontSize: "1.1rem"}}>{item?.youtube_title ? item?.youtube_title : "Youtube"}</Link>
                                {item?.youtube_link2 && <Link target={"_blank"} to={item?.youtube_link2} style={{fontSize: "1.1rem"}}>{item?.youtube_title2 ? item?.youtube_title2 : "Youtube"}</Link>}
                            </div>
                        </div>}
                        {item?.telegram_link && <div className='flex items-center gap-3 mb-5'>
                            <img src="/social/telegram.jpg" width={40} /> 
                            <div className="flex flex-col"> 
                                <Link target={"_blank"} to={item?.telegram_link} style={{fontSize: "1.1rem"}}>{item?.telegram_title ? item?.telegram_title : "Telegram"}</Link>
                                {item?.telegram_link2 && <Link target={"_blank"} to={item?.telegram_link2} style={{fontSize: "1.1rem"}}>{item?.telegram_title2 ? item?.telegram_title2 : "Telegram"}</Link>}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detail
