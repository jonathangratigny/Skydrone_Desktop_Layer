import React, {useContext, useEffect, useState} from 'react'
import { UserContext } from '../user/UserContext'
import { Link } from 'react-router-dom'


const displayDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : null
}

const displayTime = (date) => {
    return date ? new Date(date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : null
}



export default function CustomerCard({customer}) {
    const { user } = useContext(UserContext)
    const [data, setData] = useState({
        customer: {},
        orders: [],
        roles: []
    })
    
    useEffect(() => {
        let userData, 
            ordersList, 
            rolesList
    
        async function fetchData() {
            await fetch(`https://skydrone-api.herokuapp.com/api/v1/users/${customer._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    userData = data.user
                    console.log(data);
                }
                )
    
            await fetch(`https://skydrone-api.herokuapp.com/api/v1/orders/user/${customer._id}`, {
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

    const getRole = (key) => { 
        if (data.roles.length == 0) return
        return data.roles.filter( role  =>  role.key_r == key)[0].name_r 
    }

    const formatPhone = (phone) => {
        phone.split('').map( ( num, key ) => key  )
    }
    return (
        <div className="card mb-2">
            <h5 className="card-header">Créer le {displayDate(data.customer.createdAt)} à {displayTime(data.customer.createdAt)}</h5>
            <div className="card-body row">
                <div className='col-10'>
                    <div className='row'>
                        <div className='col'>
                            <h5 className="card-title">{getRole(data.customer.key_r)}</h5>
                            <p className="card-text">{data.customer.firstName_u} {data.customer.lastName_u}</p>
                        </div>
                        <div className='col'>
                            <h5 className="card-title">{data.customer.phone_u}</h5>
                            <p className="card-text">{data.customer.email}</p>
                        </div>
                    </div>
                </div>
                <div className='col d-flex align-items-end'>
                    <Link to={'/customer/' + data.customer._id} className="btn btn-primary ms-auto">
                        Détails
                    </Link>
                </div>
            </div>
        </div>
    )
}