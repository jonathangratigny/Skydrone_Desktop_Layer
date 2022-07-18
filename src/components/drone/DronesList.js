import React, {useState, useEffect} from 'react'
import './DronesList.scss'
import { Link } from 'react-router-dom'
import DroneCard from './DroneCard'

const droneImage = async (id) => {
    fetch('https://skydrone-api.herokuapp.com/api/v1/images/' + id)
    .then(response => response.blob())
    .then(data => {
        const objectURL = URL.createObjectURL(data);
        return objectURL;
})}


export default function DroneList() {
    const [drones, setDrones] = useState([])
    useEffect (() => {
        fetch('https://skydrone-api.herokuapp.com/api/v1/drones')
            .then(res => res.json())
            .then(data => {
                setDrones(data)
            })
    }, [])
   
    

  return (
    <div className='row g-3 droneList'>
        <div className='col-12'>
            <h2>Les drones</h2>
            <hr></hr>
        </div>
        {drones.map((drone, key) =>
        (
            < DroneCard drone={drone} key={key} />
        ))}
    </div>
  )
}
