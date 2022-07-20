import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../user/UserContext'
import { useParams } from "react-router-dom"



export default function OrderPage() {
    const [image, setImage] = useState('')
    const [drone, setDrone] = useState({})
    const {user} = useContext(UserContext)
    const [customer, setCustomer] = useState({})
    const [load, setLoad] = useState(true)
    const [ order, setOrder ] = useState({})
    const { id } = useParams()

    useEffect (() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/orders/' + id)
        .then(response => response.json())
        .then(data => {
            setOrder(data)
            })

        fetch('https://skydrone-api.herokuapp.com/api/v1/drones/' + order.drone_id)
        .then(response => response.json())
        .then(data => {
            setDrone(data)
            })

        fetch('https://skydrone-api.herokuapp.com/api/v1/users/' + order.user_id, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
        })
        .then(response => response.json())
        .then(data => {
            setCustomer(data.user)
            })
        }
    , [])

    const handleSubmit = (event) => {

        fetch('https://skydrone-api.herokuapp.com/api/v1/orders/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token},
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
        event.preventDefault();
    } 

  return (
    <>
    <h1>Réservation</h1>
    <div className="row mt-3">
        <form className="col-8" onSubmit={handleSubmit} >
            <h2>Informations</h2>
            <div className="card p-4" >
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Titre</label>
                    <input type="text" className="form-control" id="title" placeholder="Titre du produit" value={title} onChange={e => setTitle(e.target.value)}></input>
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <textarea className="form-control" id="desc" rows="8" placeholder="Description du produit"  value={desc} onChange={e => setDesc(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Prix</label>
                    <input type="number" className="form-control" id="price" placeholder="Prix du produit"  value={price} onChange={e => setPrice(e.target.value)}></input>
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
