import React from 'react'
import './Button.scss'
  

export default function PriamryButton ({type, id}) {

    return (
        <div className='col-12 d-flex mt-3'>
            <button id={id} type={type} className='btn btn-primary'>+ Réservation</button>
        </div>
    )
}
