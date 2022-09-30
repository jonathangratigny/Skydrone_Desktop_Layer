import React, { useContext, useEffect, useState } from 'react'
import PriamryButton from '../button/primaryButton'
import { UserContext } from '../user/UserContext'
import OrderCard from './OrderCard'
import './OrderList.scss'
import { Link } from 'react-router-dom'

const droneImage = async (id) => {
    fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + id)
    .then(response => response.blob())
    .then(data => {
        const objectURL = URL.createObjectURL(data)
        return objectURL
})}


export default function OrderList({style}) {
    const [orders, setOrders] = useState([])
    const {user} = useContext(UserContext)
    useEffect (() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/orders', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(data.reverse())
            })
    }, [])

    const shortList = (style, key) => {
        if (style == null) {
            return true
        }
        if (style == 'mini' && key < 2) {
            return true
        }
    }

  return (
    <div className='row g-3 orderList'>
        <div className='col-12'>
            <div className="d-flex align-items-start">
                <h2 className='me-auto'>Les réservations</h2>
                <Link to={'../order/newOrder'} className="d-flex ">
                    < PriamryButton type='button' id='addOrder' text='Ajouter une réservation' />
                </Link>
            </div>
            <hr></hr>
        </div>
        <div className='col-12 listContainer'>
            {orders ? orders.map((order, key) =>
                shortList(style, key) ?
                (
                    < OrderCard order={order} key={key} />
                ) : null) 
            : (
                <p>Aucune réservation</p>
            )}
        </div>
        
    </div>
  )
}
