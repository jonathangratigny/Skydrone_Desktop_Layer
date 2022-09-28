import React from 'react'
import './Button.scss'
  

export default function PriamryButton ({type, id, text}) {

    return (
        <>
        <button id={id} type={type} className='btn btn-primary'>{text}</button>
        </>
    )
}
