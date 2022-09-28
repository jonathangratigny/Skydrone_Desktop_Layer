import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../user/UserContext'
import { useParams, Link } from "react-router-dom"
import OrderCard from '../order/OrderCard'
import './Customer.scss'
import {displayDate, displayTime} from '../../utils/dateFormat'
import { ToastContainer, toast } from 'react-toastify'

export default function CustomerPage() {
    const { id } = useParams()
    const { user } = useContext(UserContext)
    const [data, setData] = useState({
        customer: null,
        orders: [],
        roles: []
    })
    const [orders, setOrders] = useState(null)
    const [roles, setRoles] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('https://skydrone-api.herokuapp.com/api/v1/users/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(data.customer)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        }
        )
    }

    useEffect(() => {
        let userData, 
            ordersList, 
            rolesList

        async function fetchData() {
            await fetch(`https://skydrone-api.herokuapp.com/api/v1/users/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    userData = data.user
                }
                )

            await fetch(`https://skydrone-api.herokuapp.com/api/v1/orders/user/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    ordersList = data
                }
                )

            await fetch(`https://skydrone-api.herokuapp.com/api/v1/roles`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    rolesList = data
                }
                )
        }

        if (!id) {
            fetch(`https://skydrone-api.herokuapp.com/api/v1/roles`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setData({
                        roles: data
                    })
                }
                )
        }

        async function setFetchData() {
            await fetchData()
            setData({
                customer: userData,
                orders: ordersList,
                roles: rolesList
            })
            
        }

        if (id) {
            setFetchData()
        }
    }, [])

    const handleChange = (event, type) => {
        const { name, value } = event.target
        switch (type) {
            case 'customer':
                setData(prev => ({
                    ...prev,
                    customer: {
                        ...prev.customer,
                        [name]: value
                    }
                }))
                break;
            case 'orders':
                setData(prev => ({
                    ...prev,
                    orders: {
                        ...prev.orders,
                        [name]: value
                    }
                }))
                break;
            case 'roles':
                setData(prev => ({
                    ...prev,
                    roles: {
                        ...prev.roles,
                        [name]: value
                    }
                }))
                break;
            default:
                break;
        }
    }
    const [category, setCategory] = useState('user')

    const handleSubmitNew = (event) => {
        const testToast = toast.loading("Enregistrement...")
        console.log(data.customer);
        fetch('https://skydrone-api.herokuapp.com/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token
            },
            body: JSON.stringify(data.customer)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                /* setTimeout(() => {
                    toast.update(testToast, { render: "Ajouté avec succès", type: "success", isLoading: false, autoClose: 2000 })
                    setTimeout(() => {
                        window.location.href = '../products'
                    }, 2000)
                }, 1000) */
            })
            .catch((error) => {
                console.error('Error:', error)
                toast.update(testToast, { render: "Errer", type: "error", isLoading: false, autoClose: 2000, })
            })


        event.preventDefault()
    }

    return (
        <>
       <h1>Utilisateur</h1>
        <div className="row mt-3">
            <form className="col-12 "  onSubmit={id ? handleSubmit : handleSubmitNew} >
                <nav className='mb-3 '>
                    <button type='button' className='btn' onClick={ e => setCategory('user')}>Informations</button>
                    <button type='button' className='btn' onClick={ e => setCategory('company')}>Entreprise</button>
                    <button type='button' className='btn' onClick={ e => setCategory('order')}>Réservations</button>
                </nav>
                {category === 'user' && (
                <div className="card p-4" id='user'>
                    <div className="mb-3 d-flex">
                        <div className="me-3">
                            <label htmlFor="lastName" className="form-label">Nom</label>
                            <input type="text" name='lastName_u' className="form-control" id="lastName" placeholder="Nom" value={data.customer ? data.customer.lastName_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                        <div>
                            <label htmlFor="firstName" className="form-label">Prénom</label>
                            <input type="text" className="form-control" name='firstName_u' id="firstName" placeholder="Prénom" value={data.customer ? data.customer.firstName_u : '' } onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                    </div>
                    {id ? '' :
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mot de passe</label>
                        <input type="text" name='password' className="form-control" id="password" placeholder="password" onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    }
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Role</label>
                        <div className="form-group">
                            <select className="form-select" id='state' name='key_r' aria-label="Default select example" onChange={ e => handleChange(e, 'customer') } value={data.customer ? data.customer.key_r : ''}>
                            { data && data.roles.map((role, key) => {
                                return (
                            <option value={role.key_r} key={key}>{role.name_r}</option>
                                )
                            }) }
                        </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Adresse</label>
                        <input type="text" name='address_u' className="form-control" id="address" placeholder="Adresse" value={data.customer ? data.customer.address_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="zipcode" className="form-label">Code postale</label>
                        <input type="text" name='zipCode_u' className="form-control" id="zipcode" placeholder="Code Postale" value={data.customer ? data.customer.zipCode_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="country" className="form-label">Pays</label>
                        <input type="text" name='country_u' className="form-control" id="country" placeholder="Pays" value={data.customer ? data.customer.country_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Téléphone</label>
                        <input type="tel" name='phone_u' className="form-control" id="phone" placeholder="Adresse mail" value={data.customer ? data.customer.phone_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Adresse mail</label>
                        <input type="text" name='email' className="form-control" id="email" placeholder="Adresse mail" value={data.customer ? data.customer.email : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    
                </div>
                )}
                {category === 'company' && (
                <div className="card p-4" id='order'>
                    <div className="mb-3">
                        <label htmlFor="comanyName" className="form-label">Nom de l'entreprise</label>
                        <input type="text" name='company_u' className="form-control" id="comanyName" placeholder="Nom de l'entreprise" value={data.customer ? data.customer.company_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="siret" className="form-label">Siret de l'entreprise</label>
                        <input type="text" name='siret_u' className="form-control" id="siret" placeholder="Siret de l'entreprise" value={data.customer ? data.customer.siret_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                </div>
                )}
                {category === 'order' && (
                <div className="card p-4" id='order'>
                    <div className="mb-3">
                        <div className='orderPreview' id='style-7'>
                            <div className='listContainer'>
                                {data.orders ? Array.isArray(data.orders) ? data.orders.map((order, key) =>
                                (
                                    < OrderCard order={order} key={key} />
                                )) : (
                                    <p>{data.orders.message}</p>
                                ) : <p>Aucune réservation</p>}
                            </div>
                        </div>
                    </div>
                </div>
                )}
                <div className="my-3 d-flex justify-content-between">
                    {data.customer ? 
                    <div>
                        <p>Création le {displayDate(data.customer.createdAt)} à {displayTime(data.customer.createdAt)}</p>
                        <p>Dernière modification le {displayDate(data.customer.updatedAt)} à {displayTime(data.customer.updatedAt)}</p>
                    </div>
                    : '' }
                    <div>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}