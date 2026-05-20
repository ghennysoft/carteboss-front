import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
 import { BASE_API_URL } from '../../utils/constante';
import axios from 'axios';
import NoDetail from '../NoDetail';
import vCardsJS from 'vcards-js';

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



    const generateVCard = async () => {
        setLoading(true);
        try {
            // 1. Fonction pour redimensionner l'image (identique à votre version actuelle)
            // const resizeImageToBase64 = (imageUrl, maxWidth = 200, maxHeight = 200, quality = 0.7) => {
            //     return new Promise((resolve, reject) => {
            //         const img = new Image();
            //         img.crossOrigin = 'Anonymous';
                    
            //         img.onload = () => {
            //             let width = img.width;
            //             let height = img.height;
                        
            //             if (width > height) {
            //                 if (width > maxWidth) {
            //                     height = (height * maxWidth) / width;
            //                     width = maxWidth;
            //                 }
            //             } else {
            //                 if (height > maxHeight) {
            //                     width = (width * maxHeight) / height;
            //                     height = maxHeight;
            //                 }
            //             }
                        
            //             const canvas = document.createElement('canvas');
            //             canvas.width = width;
            //             canvas.height = height;
            //             const ctx = canvas.getContext('2d');
            //             ctx.drawImage(img, 0, 0, width, height);
                        
            //             const base64 = canvas.toDataURL('image/jpeg', quality);
            //             const base64Clean = base64.split(',')[1];
                        
            //             console.log(`Image redimensionnée: ${width}x${height}, base64 taille: ${base64Clean.length} chars`);
            //             resolve(base64Clean);
            //         };
                    
            //         img.onerror = () => reject(new Error('Impossible de charger l\'image'));
            //         img.src = imageUrl;
            //     });
            // };

            // 2. Création d'une nouvelle instance VCard
            const vCard = vCardsJS();

            // 3. Gestion du nom
            const nameParts = item.full_name.trim().split(' ');
            const lastName = nameParts.pop() || '';
            const firstName = nameParts.join(' ') || '';
            vCard.firstName = firstName;
            vCard.lastName = lastName;

            // 4. Ajout des informations professionnelles
            if (item.profession) {
                vCard.title = item.profession;
            }
            if (item.company) {
                vCard.organization = item.company;
            }
            
            // 5. Ajout de la biographie (note)
            if (item.bio) {
                vCard.note = item.bio;
            }

            // 6. Ajout des coordonnées
            if (item.email) {
                vCard.email = item.email;
            }
            if (item.phoneNumber) {
                const cleanPhone = item.phoneNumber.replace(/[^\d+]/g, '');
                vCard.cellPhone = cleanPhone;
            }
            if (item.address) {
                vCard.workAddress.street = item.address;
            }

            // 7. Ajout des URLs
            if (item.linkedin?.url) {
                vCard.url = item.linkedin.url;
            }
            if (item.website?.url) {
                vCard.url = item.website.url;
            }
            if (item.facebook?.url) {
                vCard.url = item.facebook.url;
            }
            if (item.instagram?.url) {
                vCard.url = item.instagram.url;
            }

            // 8. Ajout de la photo (élément clé)
            // if (item?.profile_picture) {
            //     try {
            //         const resizedBase64 = await resizeImageToBase64(
            //             item.profile_picture,
            //             200,   // largeur max
            //             200,   // hauteur max
            //             0.7    // qualité JPEG (70%)
            //         );
                    
            //         if (resizedBase64 && resizedBase64.length < 150000) {
            //             vCard.photo.embedFromSring(resizedBase64, 'image/jpeg');
            //             console.log('Photo intégrée avec succès, taille finale:', resizedBase64.length, 'chars');
            //         } else {
            //             console.warn('Photo trop volumineuse après redimensionnement');
            //         }
            //     } catch (error) {
            //         console.warn('Impossible de traiter la photo:', error);
            //     }
            // }

            // 9. Génération du contenu vCard
            const vCardString = vCard.getFormattedString();

            // 10. Téléchargement du fichier
            const blob = new Blob([vCardString], {
                type: 'text/vcard;charset=utf-8'
            });
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const safeFileName = item.full_name.replace(/[^a-zA-Z0-9\u00C0-\u00FF]/g, '_');
            link.download = `${safeFileName}.vcf`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 1000);
            
        } catch (error) {
            console.error('Erreur vCard:', error);
            alert('Erreur lors du téléchargement du contact. Veuillez réessayer.');
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


