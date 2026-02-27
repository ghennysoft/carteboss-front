import React from 'react';

const NoDetail = () => {
    return (
        <div className="container p-5 lg:max-w-3/5 mx-auto">
            <div>
                <img src={"/logo.png"} style={{objectFit: 'cover', width: '100%', height: '230px', border: '1px solid #ccc', padding: "20px", borderRadius: '20px'}} alt="" />
                <div className="flex justify-center content">
                    <button 
                        className='bg-gray-900 text-white my-5 mx-3 py-4 px-18 cursor-pointer'
                        style={{display: 'inline-block', borderRadius: '30px'}}
                    >Cette carte est désactivée</button>
                </div>
            </div>
        </div>
    )
}

export default NoDetail
