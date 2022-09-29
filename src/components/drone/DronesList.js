import React, {useState, useEffect} from 'react'
import './DronesList.scss'
import { Link } from 'react-router-dom'
import DroneCard from './DroneCard'
import PriamryButton from '../button/primaryButton'
import {baseUrl} from '../../utils/globalVariables'

const droneImage = async (id) => {
    fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + id)
    .then(response => response.blob())
    .then(data => {
        const objectURL = URL.createObjectURL(data);
        return objectURL;
})}


export default function DroneList({style}) {
    const [drones, setDrones] = useState([])
    useEffect (() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/drones')
            .then(res => res.json())
            .then(data => {
                setDrones(data)
            })
    }, [])
   
    const shortList = (style, key) => {
        if (style == null) {
            return true
        }
        if (style == 'mini' && key < 5) {
            return true
        }
    }

  return (
    <div className='row g-3 droneList'>
        <div className='col-12'>
            <div className='d-flex align-items-start'>
                <h2 className='me-auto'>Les drones</h2>
                <Link to={'../product/newDrone'} className="d-flex ">
                    < PriamryButton type='button' id='addDrone' text='Ajouter un Drone' />
                </Link>
            </div>
            <hr></hr>
        </div>
        {drones.map((drone, key) =>
        shortList(style, key) ? 
        (
            < DroneCard drone={drone} key={key} style={style}/>
        ) : null)}
        
    </div>
  )
}
