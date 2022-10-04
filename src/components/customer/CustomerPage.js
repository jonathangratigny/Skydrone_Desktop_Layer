import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../user/UserContext'
import { useParams, Link } from "react-router-dom"
import OrderCard from '../order/OrderCard'
import './Customer.scss'
import {displayDate, displayTime} from '../../utils/dateFormat'
import { ToastContainer, toast } from 'react-toastify'
import DeleteButton from '../button/deleteButton'

export default function CustomerPage() {
    const { id } = useParams()
    const { user } = useContext(UserContext)
    const [data, setData] = useState({
        customer: null,
        orders: [],
        roles: []
    })

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

    function navOutline () {
        const allBtn = document.querySelectorAll('.user nav span')
        const outline = document.getElementById('outline')
        const btnActive = document.querySelector('.user nav .active')
        let index
        allBtn.forEach((el, key) => {
            if (el == btnActive) {
                index = key
            }
        })
        switch (index) {
            case 0:
                outline.style.width = allBtn[0].offsetWidth + 'px'
                outline.style.left = 0 + 'px'
                break;
            case 1:
                outline.style.width = allBtn[1].offsetWidth + 'px'
                outline.style.left = allBtn[0].offsetWidth + 'px'
                break;
            case 2:
                outline.style.width = allBtn[2].offsetWidth + 'px'
                outline.style.left = allBtn[0].offsetWidth + allBtn[1].offsetWidth + 'px'
                break;
            default:
                break;
        }
    }
    
    useEffect(() => {
        navOutline()
    }, [category])

    return (
        <>
       <h2>Utilisateur</h2>
       <hr></hr>
        <div className="row mt-3 user">
            <form className="col-12 "  onSubmit={id ? handleSubmit : handleSubmitNew} >
                <nav className='mb-3 '>
                    <span type='button' className={'btn ' + (category == 'user' ? 'active' : '')} onClick={ e => setCategory('user')}>Informations</span>
                    <span type='button' className={'btn ' + (category == 'company' ? 'active' : '')} onClick={ e => setCategory('company')}>Entreprise</span>
                    <span type='button' className={'btn ' + (category == 'order' ? 'active' : '')} onClick={ e => setCategory('order')}>Réservations</span>
                    <span id='outline'></span>
                </nav>
                {category === 'user' && (
                <div className="card p-4" id='user'>
                    <div className=" d-flex flex-wrap">
                        <div className="me-3 mb-3">
                            <label htmlFor="lastName" className="form-label">Nom</label>
                            <input type="text" name='lastName_u' className="form-control" id="lastName" placeholder="Nom" value={data.customer ? data.customer.lastName_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                        <div className='me-3 mb-3'>
                            <label htmlFor="firstName" className="form-label">Prénom</label>
                            <input type="text" className="form-control" name='firstName_u' id="firstName" placeholder="Prénom" value={data.customer ? data.customer.firstName_u : '' } onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                        {id ? '' :
                        <div className='mb-3'>
                            <label htmlFor="password" className="form-label">Mot de passe</label>
                            <input type="text" name='password' className="form-control" id="password" placeholder="password" onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                        }
                    </div>
                    
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Role</label>
                        <div className="form-group">
                            <select className="form-select w-auto" id='state' name='key_r' aria-label="Default select example" onChange={ e => handleChange(e, 'customer') } value={data.customer ? data.customer.key_r : ''}>
                            { data && data.roles.map((role, key) => {
                                return (
                            <option value={role.key_r} key={key}>{role.name_r}</option>
                                )
                            }) }
                        </select>
                        </div>
                    </div>
                    <div className=" d-flex flex-wrap">
                        <div className="mb-3 me-3">
                            <label htmlFor="address" className="form-label">Adresse</label>
                            <input type="text" name='address_u' className="form-control" id="address" placeholder="Adresse" value={data.customer ? data.customer.address_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                        <div className="mb-3 me-3">
                            <label htmlFor="zipcode" className="form-label">Code postale</label>
                            <input type="text" name='zipCode_u' className="form-control" id="zipcode" placeholder="Code Postale" value={data.customer ? data.customer.zipCode_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="country" className="form-label">Ville</label>
                            <input type="text" name='city_u' className="form-control" id="country" placeholder="Pays" value={data.customer ? data.customer.city_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Téléphone</label>
                        <input type="tel" name='phone_u' className="form-control w-auto" id="phone" placeholder="Numéro" value={data.customer ? data.customer.phone_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Adresse mail</label>
                        <input type="text" name='email' className="form-control w-auto" id="email" placeholder="Adresse mail" value={data.customer ? data.customer.email : ''} onChange={ e => handleChange(e, 'customer')}></input>
                    </div>
                    {data.customer ? 
                    <div>
                        <p>Création le {displayDate(data.customer.createdAt)} à {displayTime(data.customer.createdAt)}</p>
                        <p>Dernière modification le {displayDate(data.customer.updatedAt)} à {displayTime(data.customer.updatedAt)}</p>
                    </div>
                    : '' }
                </div>
                )}
                {category === 'company' && 
                <div className="card p-4" id='order'>
                    <div className=" d-flex flex-wrap">
                        <div className="mb-3  me-3">
                            <label htmlFor="comanyName" className="form-label">Nom de l'entreprise</label>
                            <input type="text" name='company_u' className="form-control" id="comanyName" placeholder="Nom de l'entreprise" value={data.customer ? data.customer.company_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                        <div className="mb-3 me-3">
                            <label htmlFor="siret" className="form-label">Siret de l'entreprise</label>
                            <input type="text" name='siret_u' className="form-control" id="siret" placeholder="Siret de l'entreprise" value={data.customer ? data.customer.siret_u : ''} onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                    </div>
                </div>
                }
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
                    {data.customer && 
                        <DeleteButton text={"Supprimer l'utilisateur"} id={data.customer._id}  target={'user'} />
                    }
                    <button type="submit" className="btn btn-primary ms-auto">Enregistrer</button>
                </div>
            </form>
        </div>
        </>
    )
}