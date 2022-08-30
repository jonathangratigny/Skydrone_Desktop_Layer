import React, {useState, useEffect, useContext} from 'react'
import { useParams } from "react-router-dom"
import ContentLoader from 'react-content-loader'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import './DronePage.scss'
import { UserContext } from '../user/UserContext'



function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    }

export default function DronePage() {
    let imgArray = []
    const { user } = useContext(UserContext)
    const { id } = useParams()
   /*  const [drone, setDrone] = useState([]) */
    /* const [images, setImages] = useState([]) */
    const [load, setLoad] = useState(true)
    const [image, setImage] = useState([])
    const [data, setData] = useState({
        drone: {},
        images: []
    })
    useEffect (() => {
        let drone, 
            images
        async function fetchData() {
            if (id) {
                await fetch('https://skydrone-api.herokuapp.com/api/v1/drones/' + id)
                    .then(res => res.json())
                    .then(data => {
                        drone = data
                    })

                await fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + id)
                    .then(response => response.json())
                    .then(data => {
                        images = []
                        data.forEach(element => {
                            let url = `data:image/png;base64,${toBase64(element.img.data)}`
                            images.push(url) 
                            setLoad(false)
                        });
                    
                    })
            }
        }

        async function setFetchData() {
            await fetchData()
            setData({
                drone: drone,
                images: images
            })
            data.images.forEach(element => {
                imgArray.push(<img src={element} alt="presentation" />)
            })
            console.log(data.images);
        }

        setFetchData()

    }, [])


    

    const handleSubmitNew = (event) => {
        console.log('new drone');
    }

    const handleSubmit = (event) => {
    /*     console.log(`
            title: ${title}
            desc: ${desc}
            price: ${price}
        `); */

        fetch('https://skydrone-api.herokuapp.com/api/v1/drones/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token},
            body: JSON.stringify(data.drone)
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
            }
        )
        if (image.length > 0) {
            console.log(image);
            for (let index = 0; index < image.length; index++) {
                let element = image[index];
                console.log(element);
                let data = new FormData()
                data.append('image', element)
                fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + id, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + user.token},
                    body: data,
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Success', data)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }
    }
        event.preventDefault();
    } 

    const handleChange = (event, type) => {
        const { name, value } = event.target
        switch (type) {
            case 'drone':
                setData(prev => ({
                    ...prev,
                    drone: {
                        ...prev.drone,
                        [name]: value
                    }
                }))
                break;
            default:
                break;
        }
    }

    const handleImagePreview = (files) => {
            const allFiles = files.target.files
            console.log(allFiles);
            const image = document.getElementById('image')
            if (allFiles) {
                Array.from(allFiles).forEach(file => {
                    const img = document.createElement('img')
                    img.classList.add('image-preview')
                    let imgSrc = URL.createObjectURL(file)
                    img.src = imgSrc
                    image.parentNode.insertBefore(img, image.nextSibling)
                    setImage(previousState => [...previousState, file])
                })
            }
        }
    
  return (
    <>
    <h1>Produit</h1>
    <div className="row mt-3">
        <form className="col-8" onSubmit={id ? handleSubmit : handleSubmitNew} >
            <h2>Informations</h2>
            <div className="card p-4" >
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Titre</label>
                    <input type="text" name='name_d' className="form-control" id="title" placeholder="Titre du produit" value={data.drone.name_d || ''} onChange={ e => handleChange(e, 'drone')}></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <textarea className="form-control" name='description_d' id="desc" rows="6" placeholder="Description du produit"  value={data.drone.description_d || ''} onChange={ e => handleChange(e, 'drone')}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Prix</label>
                    <input type="number" name='pricePerDay_d' className="form-control" id="price" placeholder="Prix du produit"  value={data.drone.pricePerDay_d || ''} onChange={ e => handleChange(e, 'drone')}></input>
                </div>
                <div className="mb-0">
                    <label htmlFor="image" className="form-label">Images</label>
                    <input type="file" className="form-control" id="image" multiple onChange={e => handleImagePreview(e)}></input>
                    <div className='border container-images d-flex align-items-center mt-2'>
                        {data.images.map((img, index) => {
                                return (
                        <div className='card-images col-2' key={index}>
                                <img src={img}></img>
                        </div>
                            )})}  
                    </div>
                </div>
            </div>
            <div className='col-12 d-flex mt-3'>
                <button type='submit' className='btn btn-primary ms-auto'>Enregistrer</button>
            </div>
        </form>
        <div className="col-4">
            <h2>Aperçu</h2>
            <div className="card">
                <div className="productCarousel" >
                <AliceCarousel
                    className="carousel"
                    disableDotsControls={true}
                    animationDuration={1000}
                    items={imgArray} />
                </div>
            </div>
        </div>
    </div>
    
    </>
  )
}
