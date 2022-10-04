import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../user/UserContext'
import { useParams, useNavigate, Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DeleteButton from '../button/deleteButton'

export default function OrderPage() {
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const [data, setData] = useState({
        order: '',
        customer: {},
        totalPrice: '',
        allUsers: [],
        allDrones: []
    })
    
    const navigate = useNavigate()
    const displayDate = (date) => {
        return new Date(date).toLocaleDateString('sv')
    }
    const statusName = ['En attente de validation', 'Acceptée', 'Rejetée', 'En cours', 'Terminée']

    

    const calcTotalDays = (startDate, endDate) => {
        let start = new Date(startDate)
        let end = new Date(endDate)
        let diff = end.getTime() - start.getTime()
        return diff / (1000 * 60 * 60 * 24)
    }

    useEffect(() => {
        let order,
            customer,
            totalPrice,
            allUsers,
            allDrones        

        const fetchData = async () => {
            if (id) {
                await fetch('https://skydrone-api.herokuapp.com/api/v1/orders/' + id, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                .then(response => response.json())
                .then(dataOrder => {
                    order = dataOrder.order
                    totalPrice = (calcTotalDays(dataOrder.order.startAt_o, dataOrder.order.endAt_o) * dataOrder.order.drone_id.pricePerDay_d).toFixed(2)
                })
                if (order.user_id) {
                    await fetch('https://skydrone-api.herokuapp.com/api/v1/users/' + order.user_id._id, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    })
                    .then(response => response.json())
                    .then(dataUser => {
                        if (dataUser.user) {
                            customer = dataUser.user
                        }
                    })
                }
            }
    
            await fetch('https://skydrone-api.herokuapp.com/api/v1/users',{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                    .then(response => response.json())
                    .then(dataUser => {
                        allUsers = dataUser
                    })
    
            await fetch('https://skydrone-api.herokuapp.com/api/v1/drones')
                    .then(response => response.json())
                    .then(dataAllDrones => {
                        allDrones = dataAllDrones
                    })
            if (!id) order = {drone_id: allDrones[0]._id, user_id: allUsers[0]._id, state_o: statusName[0]  }
        }

        async function setFetchData() {
            await fetchData()
            setData({order: order, customer:customer, totalPrice:totalPrice, allUsers:allUsers, allDrones:allDrones})
        }

        setFetchData()
}, [])

    const handleChange = (event) => {
        const { name, value } = event.target
            setData(prev => ({
                ...prev,
                order: {
                    ...prev.order,
                    [name]: value
                }
            }))
        }

    

    const showToastMessage = () => {
        toast.success('Commande mise à jour', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
            isLoading: false
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
            body: JSON.stringify(data.order)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showToastMessage()
        })
        .catch((error) => {
            error('Error:', error);
        });

        /* if (event)
        setTimeout(() => {
            navigate('/orders')
        }, 4000) */
    }

    const handleSubmitNew = (event) => {
        data.order.createdBy_o = user.user._id
        const testToast = toast.loading("Enregistrement...")

        fetch('https://skydrone-api.herokuapp.com/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
                body: JSON.stringify(data.order)
            })
            .then(res => res.json())
            .then(data => {
                setTimeout(() => {
                    toast.update(testToast, { render: "Ajouté avec succès", type: "success", isLoading: false, autoClose: 2000 });
                    /* setTimeout(() => {
                        window.location.href = '../orders'
                    }, 2000) */
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
                                <select className="form-select w-auto" id='state' name='state_o' aria-label="Default select example" onChange={e => handleChange(e)} value={data.order ? data.order.state_o : ''}>
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
                                <input type="date" className="form-control" name='startAt_o' id="startDate" value={displayDate(data.order ? data.order.startAt_o : '')} onChange={e => handleChange(e)}></input>
                            </div>
                            <div className="">
                                <label htmlFor="endDate" className="form-label">Fin</label>
                                <input type="date" className="form-control" name='endAt_o' id="endDate" value={displayDate(data.order ? data.order.endAt_o : '')} onChange={e => handleChange(e)}></input>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="desc" className="form-label">Description</label>
                            <textarea className="form-control" id="desc" name='report_o' rows="4" placeholder="Information commande" value={data.order ? data.order.report_o : ''} onChange={e => handleChange(e)} ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="drone" className="form-label">Drone</label>
                            <select className="form-select w-auto" name='drone_id' id='drone' aria-label="Default select example" onChange={e => handleChange(e)} value={data.order ? data.order.drone_id._id : ''}>
                                {data.allDrones && data.allDrones.map((dro, key) => {
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
                                {data.allUsers && data.allUsers.map((us, key) => {
                                    return (
                                        <option value={us._id} key={key}>{us.firstName_u + ' ' + us.lastName_u} </option>
                                    )
                                })}
                            </select>
                        </div>
                        }


                        <div className='col-12 d-flex mt-3'>
                            { data.totalPrice && 
                            <DeleteButton text={'Supprimer la réservation'} id={data.order._id} target={'order'} />
                            }
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
                            <input type="text" className="form-control" id="name" value={data.customer.firstName_u ? data.customer.firstName_u + ' ' + data.customer.lastName_u : 'Inconnu'} disabled></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="company" className="form-label">Entreprise</label>
                            <input type="text" className="form-control" id="company" value={data.customer.company_u || 'Inconnu'} disabled></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Téléphone</label>
                            <input type="text" className="form-control" id="phone" value={data.customer.phone_u || 'Inconnu'} disabled></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Adresse de livraison</label>
                            <input type="text" className="form-control" id="address" value={data.customer.address_u || 'Inconnu'} disabled></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Prix total</label>
                            <input type="number" className="form-control" id="price" placeholder="Prix du produit" value={data.totalPrice} disabled></input>
                        </div>
                    </div>
                </div>
                : null }
            </div>
        </>
    )
}

