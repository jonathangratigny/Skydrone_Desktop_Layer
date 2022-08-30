import React, { useState, useEffect, useContext } from 'react'
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
    )
}

export default function DronePage() {
    let imgArray = []
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const [drone, setDrone] = useState([])
    const [images, setImages] = useState([])
    const [load, setLoad] = useState(true)
    const [image, setImage] = useState([])

    useEffect(() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/drones/' + id)
            .then(res => res.json())
            .then(data => {
                setDrone(data)
            })
    }, [])
    useEffect(() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + id)
            .then(response => response.json())
            .then(data => {
                setImages([])
                data.forEach(element => {
                    let url = `data:image/png;base64,${toBase64(element.img.data)}`
                    setImages(previousState => [...previousState, url])
                    setLoad(false)

                })

            })
    }
        , [])

    images.forEach(element => {
        imgArray.push(<img src={element} alt="presentation" />)
    })

    const handleSubmit = (event) => {
        console.log(`
            title: ${title}
            desc: ${desc}
            price: ${price}
        `)

        fetch('https://skydrone-api.herokuapp.com/api/v1/drones/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify({
                name_d: title,
                description_d: desc,
                pricePerDay_d: price,
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
            }
            )
        if (image.length > 0) {
            for (let index = 0; index < image.length; index++) {
                let element = image[index]
                console.log(element)
                let data = new FormData()
                data.append('image', element)
                fetch('https://skydrone-api.herokuapp.com/api/v1/images', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + user.token
                    },
                    body: data,
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log('Success', data)
                    })
                    .catch((error) => {
                        console.error('Error:', error)
                    })
            }
        }
        event.preventDefault()
    }

    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState("")

    useEffect(() => {
        setTitle(drone.name_d)
        setDesc(drone.description_d)
        setPrice(drone.pricePerDay_d)
    }, [drone])

    const handleImagePreview = (files) => {
        const allFiles = files.target.files
        console.log(allFiles)
        const image = document.getElementById('image')
        if (allFiles) {
            Array.from(allFiles).forEach(file => {
                const img = document.createElement('img')
                img.classList.add('image-preview')
                img.src = URL.createObjectURL(file)
                image.parentNode.insertBefore(img, image.nextSibling)
                setImage(previousState => [...previousState, file])
            })
        }
    }

    return (
        <>
            <h1>Drones</h1>
            <div className="row mt-3">
                <form className="col-8" onSubmit={handleSubmit} >
                    <h2>Informations</h2>
                    <div className="card p-3" >
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Titre</label>
                            <input type="text" className="form-control" id="title" placeholder="Titre du produit" value={title} onChange={e => setTitle(e.target.value)}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label">Description</label>
                            <textarea className="form-control" id="desc" rows="3" placeholder="Description du produit" value={desc} onChange={e => setDesc(e.target.value)}></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Prix</label>
                            <input type="number" className="form-control" id="price" placeholder="Prix du produit" value={price} onChange={e => setPrice(e.target.value)}></input>
                        </div>
                        <div className="mb-0">
                            <label htmlFor="image" className="form-label">Images</label>
                            <input type="file" className="form-control" id="image" multiple onChange={e => handleImagePreview(e)}></input>
                            <div className='border container-images d-flex align-items-center mt-2'>
                                {imgArray.map((img, index) => {
                                    return (
                                        <div className='card-images col-2' key={index}>
                                            {img}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='col-12 d-flex mt-3'>
                        <button type='submit' className='btn btn-primary ms-auto'>Modifier</button>
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
