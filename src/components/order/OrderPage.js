import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../user/UserContext'
import { useParams, useNavigate, Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function OrderPage() {
    const { user } = useContext(UserContext)
    const { id } = useParams()
    
    // Fill input
    const [allUsers, setAllUser] = useState('')
    const [orderUser, setOrderUser] = useState('')
    const [orderValue, setOrderValue] = useState('')
    const [infoValue, setInfoValue] = useState('')
    const [totalPrice, setTotalPrice] = useState('')
    const navigate = useNavigate()
    const displayDate = (date) => {
        return new Date(date).toLocaleDateString('sv')
    }
    const statusName = ['En attente de validation', 'Acceptée', 'Rejetée', 'En cours', 'Terminée']

    const fetchData = async () => {
        const response = await fetch('https://skydrone-api.herokuapp.com/api/v1/orders/' + id, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const data = await response.json()
        setOrderValue(data.order)
        setTotalPrice((calcTotalDays(data.order.startAt_o, data.order.endAt_o) * data.order.drone_id.pricePerDay_d).toFixed(2))

        if (data.order.user_id) {
            const respondeUser = await fetch('https://skydrone-api.herokuapp.com/api/v1/users/' + data.order.user_id._id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const dataUser = await respondeUser.json()
            if (dataUser.user) {
                setOrderUser(dataUser.user)
            }
        }
    }

    const calcTotalDays = (startDate, endDate) => {
        let start = new Date(startDate)
        let end = new Date(endDate)
        let diff = end.getTime() - start.getTime()
        return diff / (1000 * 60 * 60 * 24)
    }

    useEffect(() => {
        id ?
        fetchData()
        :
        fetch('https://skydrone-api.herokuapp.com/api/v1/users',{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(response => response.json())
            .then(dataUser => {
                setAllUser(dataUser)
            })

        fetch('https://skydrone-api.herokuapp.com/api/v1/drones')
            .then(response => response.json())
            .then(data => {
                handleChangeInfo('allDrones', data)
            })
    }, [])


    const handleChange = (event) => {
        const { name, value } = event.target
        setOrderValue(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleChangeInfo = (name, value) => {
        setInfoValue(prev => ({
            ...prev,
            [name]: value
        }))
    }

    

    const showToastMessage = () => {
        toast.success('Commande mise à jour', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        fetch('https://skydrone-api.herokuapp.com/api/v1/orders/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify(orderValue)
        })
        .then(res => res.json())
        .then(data => {
            showToastMessage()
        })
        .catch((error) => {
            error('Error:', error);
        });

        if (event)
        setTimeout(() => {
            navigate('/orders')
        }, 4000)
    }

    const handleSubmitNew = (event) => {
        orderValue.createdBy_o = user.user._id
        const testToast = toast.loading("Enregistrement...")

        fetch('https://skydrone-api.herokuapp.com/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
                body: JSON.stringify(orderValue)
            })
            .then(res => res.json())
            .then(data => {
                setTimeout(() => {
                    toast.update(testToast, { render: "Ajouté avec succès", type: "success", isLoading: false, autoClose: 2000 });
                    setTimeout(() => {
                        window.location.href = '../orders'
                    }, 2000)
                }, 1000)
            })
            .catch((error) => {
                console.error('Error:', error);
                toast.update(testToast, { render: "Errer", type: "error", isLoading: false, autoClose: 2000, });
            });
        
        event.preventDefault();
    }

    return (
        <>
            <h2>{id ? 'Réservation' : 'Création de réservation'}</h2>
            <hr/>
            <div className="row mt-3">
                <form className="col-12 col-md-8" onSubmit={id ? handleSubmit : handleSubmitNew} >
                    <h3>Détails</h3>
                    <div className="card p-4" >
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <div className="form-group">
                                <select className="form-select w-auto" id='state' name='state_o' aria-label="Default select example" onChange={e => handleChange(e)} value={orderValue ? orderValue.state_o : ''}>
                                    {statusName && statusName.map((status, key) => {
                                        return (
                                            <option value={status} key={key}>{status}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3 d-flex">
                            <div className="me-3">
                                <label htmlFor="startDate" className="form-label">Début</label>
                                <input type="date" className="form-control" name='startAt_o' id="startDate" value={displayDate(orderValue ? orderValue.startAt_o : '')} onChange={e => handleChange(e)}></input>
                            </div>
                            <div className="">
                                <label htmlFor="endDate" className="form-label">Fin</label>
                                <input type="date" className="form-control" name='endAt_o' id="endDate" value={displayDate(orderValue ? orderValue.endAt_o : '')} onChange={e => handleChange(e)}></input>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label">Description</label>
                            <textarea className="form-control" id="desc" name='report_o' rows="4" placeholder="Information commande" value={orderValue ? orderValue.report_o : ''} onChange={e => handleChange(e)} ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="drone" className="form-label">Drone</label>
                            <select className="form-select w-auto" name='drone_id' id='drone' aria-label="Default select example" onChange={e => handleChange(e)} value={orderValue.drone_id ? orderValue.drone_id._id : ''}>
                                {infoValue && infoValue.allDrones.map((dro, key) => {
                                    return (
                                        <option value={dro._id} key={key}>{dro.name_d} </option>
                                    )
                                })}
                            </select>
                        </div>
                        
                        { id ? null : 
                        <div className="mb-0">
                            <label htmlFor="drone" className="form-label">Client</label>
                            <select className="form-select w-auto" name='user_id' id='user' aria-label="Default select example" onChange={e => handleChange(e)}>
                                {allUsers && allUsers.map((us, key) => {
                                    return (
                                        <option value={us._id} key={key}>{us.firstName_u + ' ' + us.lastName_u} </option>
                                    )
                                })}
                            </select>
                        </div>
                        }


                        <div className='col-12 d-flex mt-3'>
                            <Link to={'/orders'}><button className='btn btn-dark'>Retour</button></Link>
                            <button type='submit' className='btn btn-primary ms-auto'>Enregistrer</button>
                            <ToastContainer />
                        </div>
                    </div>
                    
                </form>
                {id ? 
                <div className="col-12 col-md-4">
                    <h3>Infos client</h3>
                    <div className="card p-4" >
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Client</label>
                            <input type="text" className="form-control" id="name" value={orderUser.firstName_u ? orderUser.firstName_u + ' ' + orderUser.lastName_u : 'Inconnu'} disabled></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="company" className="form-label">Entreprise</label>
                            <input type="text" className="form-control" id="company" value={orderUser.company_u || 'Inconnu'} disabled></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Téléphone</label>
                            <input type="text" className="form-control" id="phone" value={orderUser.phone_u || 'Inconnu'} disabled></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Adresse de livraison</label>
                            <input type="text" className="form-control" id="address" value={orderUser.address_u || 'Inconnu'} disabled></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Prix total</label>
                            <input type="number" className="form-control" id="price" placeholder="Prix du produit" value={totalPrice} disabled></input>
                        </div>
                    </div>
                </div>
                : null }
            </div>
        </>
    )
}

