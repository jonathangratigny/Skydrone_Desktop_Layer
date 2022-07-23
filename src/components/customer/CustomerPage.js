import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../user/UserContext'
import { useParams } from "react-router-dom"

export default function CustomerPage() {
    const { id } = useParams()
    const { user } = useContext(UserContext)
    const [data, setData] = useState({
        customer: {},
        orders: [],
        roles: []
    })
    const [orders, setOrders] = useState(null)
    const [roles, setRoles] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault()
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

        async function setFetchData() {
            await fetchData()
            setData({
                customer: userData,
                orders: ordersList,
                roles: rolesList
            })
            
        }

        setFetchData()
    }, [])
    console.log(data);

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

    return (
        <>
       <h1>Utilisateur</h1>
        <div className="row mt-3">
            <form className="col-8" onSubmit={handleSubmit} >
                <h2>Informations</h2>
                <div className="card p-4" >
                    <div className="mb-3 d-flex">
                        <div className="me-3">
                            <label htmlFor="lastName" className="form-label">Nom</label>
                            <input type="text" name='lastName_u' className="form-control" id="lastName" placeholder="Nom" value={data.customer.lastName_u || ''} onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                        <div>
                            <label htmlFor="firstName" className="form-label">Prénom</label>
                            <input type="text" className="form-control" name='firstName_u' id="firstName" placeholder="Prénom" value={data.customer.firstName_u || '' } onChange={ e => handleChange(e, 'customer')}></input>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Role</label>
                        <div className="form-group">
                            <select className="form-select" id='state' name='key_r' aria-label="Default select example" onChange={ e => handleChange(e, 'customer') } value={data && data.customer.key_r}>
                            { data && data.roles.map((role, key) => {
                                return (
                            <option value={role.key_r} key={key}>{role.name_r}</option>
                                )
                            }) }
                        </select>
                        </div>
                    </div>
                </div>
            </form>
            <div className="col-4">
                <h2>Infos</h2>
                <div className="card p-4" >
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Prix totale</label>
                        <input type="number" className="form-control" id="price" placeholder="Prix du produit"  disabled></input>
                    </div>
                </div>
            </div>
    
        </div>
        </>
    )
}