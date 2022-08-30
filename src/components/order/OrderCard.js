import React, {useState, useEffect, useContext} from 'react'
import { Link } from 'react-router-dom'
import ContentLoader from 'react-content-loader'
import { UserContext } from '../user/UserContext'


function toBase64(arr) {
//arr = new Uint8Array(arr) if it's an ArrayBuffer
return btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
);
}

const displayDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : null
}

const displayTime = (date) => {
    return date ? new Date(date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : null
}
  

export default function DroneCard({order}) {
    // const [image, setImage] = useState('')
    const [drone, setDrone] = useState({})
    const {user} = useContext(UserContext)
    const [customer, setCustomer] = useState({})
    const [load, setLoad] = useState(true)
    useEffect (() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/drones/' + order.drone_id._id)
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

    return (
        <div className="card my-2">
            <h5 className="card-header">Crée le {displayDate(order.createdAt)} à {displayTime(order.createdAt)}</h5>
            <div className="card-body row">
                <div className='col-10'>
                    <div className='row'>
                        <div className='col'>
                            <h5 className="card-title">État : {order.state_o}</h5>
                            <p className="card-text">Client : {customer.firstName_u} {customer.lastName_u}</p>
                        </div>
                        <div className='col'>
                            <h5 className="card-title">Du {displayDate(order.startAt_o)} au { displayDate(order.endAt_o)}</h5>
                            <p className="card-text">{drone.name_d}</p>
                        </div>
                    </div>
                </div>
                <div className='col d-flex align-items-end'>
                    <Link to={'/order/' + order._id} className="btn btn-primary ms-auto">
                        Détails
                    </Link>
                </div>
            </div>
        </div>
    )
}
