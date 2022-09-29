import React, {useEffect, useState, useContext} from "react";
import {UserContext} from "../user/UserContext";
import CustomerCard from "./CustomerCard";
import PriamryButton from '../button/primaryButton'
import { Link } from 'react-router-dom'

export default function CustomerList({style}) {
    const [customers, setCustomers] = useState([])
    const {user} = useContext(UserContext)

    useEffect(() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            let rev = data.reverse()
            setCustomers(rev)
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
        <div className='row g-3 customersList'>
            <div className='col-12'>
                <div className="d-flex align-items-start">
                    <h2 className="me-auto">Les utilisateurs</h2>
                    <Link to={'../customer/newCustomer'} className="d-flex text-decoration-none">
                        <PriamryButton type='button' id='addCustomer' text='Ajouter un utilisateur' />
                    </Link>
                </div>
                <hr></hr>
            </div>
            <div className='col-12 listContainer'>
                {customers.map((customer, key) =>
                shortList(style, key) ?
                (
                    < CustomerCard customer={customer} key={key} />
                ) : null)}
            </div>
            
        </div>
      )
}

