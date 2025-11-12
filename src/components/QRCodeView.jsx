import { X } from 'lucide-react'
import React, { useRef } from 'react'
import html2canvas from 'html2canvas';

const QRCodeView = ({item, open}) => {
  const componentRef = useRef();
  const [imageLoaded, setImageLoaded] = useState(false);

  // S'assurer que l'image est chargée avant la capture
  useEffect(() => {
    if (item?.qrCode?.url) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => console.error("Erreur de chargement de l'image QR");
      img.src = item.qrCode.url;
    }
  }, [item?.qrCode?.url]);

  const handleDownloadImage = async () => {
    if (componentRef.current && imageLoaded) {
      try {
        const canvas = await html2canvas(componentRef.current, {
          useCORS: true, // Important pour les images externes
          allowTaint: true,
          scale: 2, // Meilleure qualité
          logging: true, // Pour debug
          onclone: (clonedDoc) => {
            // S'assurer que l'image est visible dans le clone
            const img = clonedDoc.querySelector('img');
            if (img) {
              img.style.display = 'block';
            }
          }
        });
        const image = canvas.toDataURL('image/png'); // Get image data as a PNG

        // Create a temporary link element to trigger download
        const link = document.createElement('a');
        link.href = image;
        link.download = `${item.name}_qrcode.png`; // Set desired filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        alert('Erreur lors du téléchargement de l\'image');        
      }
    } else {
      // alert("Veuillez attendre que l'image soit chargée");
    }
  };
  return (
    <div className='flex justify-center items-center fixed w-full h-full top-0 left-0 bg-gray-400 p-5'>
      <div className="flex flex-col justify-center items-center md:max-10 bg-white rounded-lg py-5 px-10">
        <p onClick={()=>open(false)} className='flex justify-center items-center mb-3 p-3 rounded-full cursor-pointer'>
            <X />
        </p>
        <h2 className="text-center" style={{fontSize: "1.5rem"}}>{item?.name}</h2>
        <button 
          onClick={handleDownloadImage} 
          className='cursor-pointer border p-1 m-1 rounded-lg bg-blue-500 text-white px-4 py-2'
          disabled={!imageLoaded}
        >{imageLoaded ? 'Télécharger' : 'Chargement...'}</button>
        <div ref={componentRef} className="relative flex flex-col border border-[#26265eff] border-3 rounded-lg overflow-hidden">
            {/* <img src={"/no-img.jpg"} width={200} height={200} alt="qrcode" /> */}
            {item?.qrCode?.url && (
              <img 
                src={item.qrCode.url} 
                className='w-full' 
                alt="qrcode" 
                crossOrigin="anonymous" // Important pour CORS
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.error("Erreur de chargement du QR code");
                  setImageLoaded(false);
                }}
              />
            )}
            <span className='block text-center text-white bg-[#26265eff] p-3' style={{fontSize: "1.5rem"}}>SCAN ME</span>
        </div>
        {!imageLoaded && (
          <div className="mt-2 text-red-500">
            Chargement du QR Code...
          </div>
        )}
      </div>
    </div>
  )
}

export default QRCodeView
