import React, {useEffect, useState, useContext} from "react";
import {UserContext} from "../user/UserContext";
import CustomerCard from "./CustomerCard";
import PriamryButton from '../button/primaryButton'

export default function CustomerList() {
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
            setCustomers(data)
        })
    }, [])

    return (
        <div className='row g-3 customersList'>
            <div className='col-12 py-2'>
                <h2>Utilisateurs</h2>
                <hr></hr>
            </div>
            <div className='col-12 listContainer'>
                {customers.map((customer, key) =>
                (
                    < CustomerCard customer={customer} key={key}/>
                ))}
            </div>
            < PriamryButton type='button' id='addCustomer' text='+ Utilisateur' />
        </div>
      )
}

