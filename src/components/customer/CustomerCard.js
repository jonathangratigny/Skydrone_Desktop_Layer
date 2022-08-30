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

    

    return (
        <div className="card my-4">
            <h5 className="card-header">Créer le {displayDate(customer.createdAt)} à {displayTime(customer.createdAt)}</h5>
            <div className="card-body row">
                <div className='col-10'>
                    <div className='row'>
                        <div className='col'>
                            <h5 className="card-title">Prénom et Nom</h5>
                            <p className="card-text">{customer.firstName_u} {customer.lastName_u}</p>
                        </div>
                        <div className='col'>
                            <h5 className="card-title">Entreprise</h5>
                            <p className="card-text">{customer.company_u}</p>
                        </div>
                    </div>
                </div>
                <div className='col d-flex align-items-end'>
                    <Link to={'/customer/' + customer._id} className="btn btn-primary ms-auto">
                        Détails
                    </Link>
                </div>
            </div>
        </div>
    )
}