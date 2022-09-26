import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from "react-router-dom"
import ContentLoader from 'react-content-loader'
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import './DronePage.scss'
import { UserContext } from '../user/UserContext'
import PriamryButton from '../button/primaryButton'
import DeleteButton from '../button/deleteButton'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import OrderCard from '../order/OrderCard'

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
    const [load, setLoad] = useState(true)
    const [data, setData] = useState({
        drone: {},
        images: [],
        orders: [],
        qrcode: []
    })
    const [image, setImage] = useState()

    useEffect(() => {

        let drone,
            images,
            orders,
            qrcode

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
                            let imageId = element.id_image
                            let imageData = {
                                url: url,
                                id: imageId
                            }
                            images.push(imageData)
                            setLoad(false)
                        })
                    })

                await fetch('https://skydrone-api.herokuapp.com/api/v1/orders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user.token
                    },
                })
                    .then(res => res.json())
                    .then(data => {
                        orders = filterOrder(data)
                    })

                await fetch('https://skydrone-api.herokuapp.com/api/v1/qrcodes/drone/' + id, {

                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + user.token
                    },
                })
                    .then(res => res.json())
                    .then(data => {
                        qrcode = []
                        qrcode.push(data.drone_QR.qr_code)
                    })
            }
        }

        async function setFetchData() {
            await fetchData()
            setData({
                drone: drone,
                images: images,
                orders: orders,
                qrcode: qrcode
            })
            data.images.forEach(element => {
                imgArray.push(<img src={element} alt="presentation" />)
            })
        }

        setFetchData()

    }, [image])

    const filterOrder = (orders) => {
        let ordersFiltered = orders.filter(el => el.drone_id === id)
        return ordersFiltered
    }

    const handleSubmitNew = (event) => {
        const testToast = toast.loading("Enregistrement...")

        fetch('https://skydrone-api.herokuapp.com/api/v1/drones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify(data.drone)
        })
            .then(res => res.json())
            .then(data => {
                setTimeout(() => {
                    toast.update(testToast, { render: "Ajouté avec succès", type: "success", isLoading: false, autoClose: 2000 })
                    setTimeout(() => {
                        window.location.href = '../products'
                    }, 2000)
                }, 1000)
            })
            .catch((error) => {
                console.error('Error:', error)
                toast.update(testToast, { render: "Errer", type: "error", isLoading: false, autoClose: 2000, })
            })



        event.preventDefault()
    }

    const handleSubmit = (event) => {

        const testToast = toast.loading("Enregistrement...")

        fetch('https://skydrone-api.herokuapp.com/api/v1/drones/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify(data.drone)
        })
            .then(res => res.json())
            .then(data => {
                setTimeout(() => {
                    toast.update(testToast, { render: "Enregisté avec succès", type: "success", isLoading: false, autoClose: 2000 })
                    setTimeout(() => {
                        window.location.href = '../products'
                    }, 2000)
                }, 1000)
            })
            .catch((error) => {
                console.error('Error:', error)
                toast.update(testToast, { render: "Errer", type: "error", isLoading: false, autoClose: 2000, })
            })



        event.preventDefault()
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
                break
            default:
                break
        }
    }
    const handleUpload = (file) => {
        console.log(file);
        const testToast = toast.loading("Upload de l'image...")
        let data = new FormData()
        data.append('image', file)

        fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + id, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + user.token
            },
            body: data,
        })
            .then(res => res.json())
            .then(data => {
                console.log('Success', data)
                toast.update(testToast, { render: "Uplaod avec succès", type: "success", isLoading: false, autoClose: 2000, })
                setImage(data)
            })
            .catch((error) => {
                console.error('Error:', error)
                toast.update(testToast, { render: "Errer", type: "error", isLoading: false, autoClose: 2000, })
            })
    }



    const handleImagePreview = (files) => {

        const allFiles = files.target.files
        const imageEl = document.getElementById('image')
        if (allFiles) {
            Array.from(allFiles).forEach(file => {
                const img = document.createElement('img')
                const container = document.createElement('div')
                const uploadLogo = document.createElement('span')
                uploadLogo.innerHTML =
                    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cloud-arrow-up-fill" viewBox="0 0 16 16">
                        <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"/>
                    </svg>`
                container.className = 'border import'
                img.classList.add('image-preview')
                uploadLogo.id = 'uploadImage'
                let imgSrc = URL.createObjectURL(file)
                img.src = imgSrc
                container.appendChild(img)
                container.appendChild(uploadLogo)
                imageEl.parentNode.insertBefore(container, imageEl.nextSibling)
                uploadLogo.addEventListener('click', () => {
                    handleUpload(file)
                })
            })
        }
    }

    const generateQR = async () => {
        await fetch('https://skydrone-api.herokuapp.com/api/v1/qrcodes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body:
                JSON.stringify({
                    "src": `https://skydrone-api.herokuapp.com/api/v1/drones/${data.drone._id}`,
                    "drone_id": data.drone._id
                })
        })
            .then(res => res.json())
            .then(data => {
                setData({ qrcode: data.qrcode[0] })
            })
    }

    const deleteImage = (id) => {
        const testToast = toast.loading("Suppression...")
        fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + user.token }
        })
            .then(res => res.json())
            .then(data => {
                console.log('Success', data)
                setImage(data)
                toast.update(testToast, { render: "Supprimer avec succès", type: "success", isLoading: false, autoClose: 2000, })
            })
            .catch((error) => {
                console.error('Error:', error)
                toast.update(testToast, { render: "Errer", type: "error", isLoading: false, autoClose: 2000, })
            })
    }
    return (
        <>
            <ToastContainer />
            <h2>{id ? 'Drone' : 'Nouveau Drone'}</h2>
            <hr />
            <div className="row mt-3">
                <form className="col-8" onSubmit={id ? handleSubmit : handleSubmitNew} >

                    <h3>Informations</h3>
                    <div className="card p-4" >
                        <div className="mb-3 ">
                            <label htmlFor="title" className="form-label">Titre</label>
                            <input type="text" name='name_d' className="form-control" id="title" placeholder="Titre du produit" value={data.drone ? data.drone.name_d : ''} onChange={e => handleChange(e, 'drone')}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label">Description</label>
                            <textarea className="form-control" name='description_d' id="desc" rows="6" placeholder="Description du produit" value={data.drone ? data.drone.description_d : ''} onChange={e => handleChange(e, 'drone')}></textarea>
                        </div>
                        <div className="mb-3 ">
                            <label htmlFor="price" className="form-label">Prix</label>
                            <input type="number" name='pricePerDay_d' className="form-control w-auto" id="price" placeholder="Prix du produit" value={data.drone ? data.drone.pricePerDay_d : ''} onChange={e => handleChange(e, 'drone')}></input>
                        </div>
                        {id ?
                            <div className="mb-0">
                                <label htmlFor="image" className="form-label">Images</label>
                                <input type="file" className="form-control w-auto" id="image" multiple onChange={e => handleImagePreview(e)}></input>
                                <div className='container-images d-flex mt-2 row p-2 m-0'>
                                    {data.images ? data.images.map((img, index) => {
                                        return (
                                            <div className='card-images col-2' key={index}>
                                                <img src={img.url} alt="preview"></img>
                                                <span onClick={() => deleteImage(img.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square-fill" viewBox="0 0 16 16">
                                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z" />
                                                    </svg>
                                                </span>
                                            </div>
                                        )
                                    }) : null}
                                </div>
                            </div>
                            : null}
                        {
                            data.qrcode ?
                                <div className='mt-3'>
                                    <label htmlFor="qrcode" className="">QR Code</label><div className='d-flex justify-content-start'>
                                        <img src={data.qrcode} alt="Qr code" className=' w-25' />
                                    </div>
                                </div>
                                :
                                <div className='container'>
                                    <button className='btn btn-success' onClick={() => generateQR()}>Generer un QR Code</button>
                                </div>
                        }
                        <div className='col-12 d-flex mt-3'>
                            <DeleteButton text={'Supprimer le drone'} id={id} target={'drone'} />
                            <Link to={'/products'}><button className='btn btn-dark'>Retour</button></Link>
                            <button type='submit' className='btn btn-primary ms-auto'>Enregistrer</button>
                        </div>
                    </div>
                </form>

                {id ?
                    <div className="col-4">
                        <h3>Réservations</h3>
                        <div className="order-container">
                            {data.orders.length ? data.orders.map((order, index) => {
                                return (
                                    < OrderCard order={order} key={index} style='mini' />
                                )
                            }) :
                                <div className='card d-flex p-4 justify-content-center'>
                                    <span>Aucune réservation &#128554;</span>
                                </div>
                            }
                        </div>
                    </div>
                    : null
                }
            </div>
        </>
    )
}
