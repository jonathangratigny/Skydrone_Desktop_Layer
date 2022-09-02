import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import ContentLoader from 'react-content-loader'


function toBase64(arr) {
//arr = new Uint8Array(arr) if it's an ArrayBuffer
return btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
);
}
  

export default function DroneCard({drone, style}) {
    const [image, setImage] = useState('')
    const [load, setLoad] = useState(true)
    useEffect (() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + drone._id)
        .then(response => response.json())
        .then(data => {
            const firstImage = data[0]
            let url = `data:image/png;base64,${toBase64(firstImage.img.data)}`
            setImage(url)
            setLoad(false)
            })
        }
    , [])
    

    return (
        <>
        { style === 'mini' ? 
            <div className='col-sm-12 col-md-4 col-xl-2 mini'>
                <div className="card cardDrone">
                    <div className="card-image">
                        {load ? 
                        <ContentLoader
                            height={100}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#dddddd"
                        >
                            <rect x="30" y="30" rx="0" ry="0" width="100%" height="200" />
                        </ContentLoader>
                        : (
                        <img src={image} alt="dronePreview"></img> 
                        ) }
                    </div>
                    <div className="card-body p-2">
                        <h5 className="card-title fs-6">{drone.name_d}</h5>
                        <Link to={'/product/' + drone._id} className="btn btn-primary py-0 px-2">
                            Détails
                        </Link>
                    </div>
                </div>
            </div>
            : 
            <div className='col-sm-12 col-md-6 col-xl-3'>
                <div className="card cardDrone">
                    <div className="card-image">
                        {load ? 
                        <ContentLoader
                            height={150}
                            backgroundColor="#f3f3f3"
                            foregroundColor="#dddddd"
                        >
                            <rect x="30" y="30" rx="0" ry="0" width="100%" height="200" />
                        </ContentLoader>
                        : (
                        <img src={image} alt="dronePreview"></img> 
                        ) }
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">{drone.name_d}</h5>
                        <p className="card-text">{drone.description_d}</p>
                        <Link to={'/product/' + drone._id} className="btn btn-primary">
                            Détails
                        </Link>
                    </div>
                </div>
            </div>
            }
        </>
    )
}
