import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../user/UserContext'
import { useParams } from "react-router-dom"

const displayDate = (date) => {
    return new Date(date).toLocaleDateString('sv');
}

const stateName = ['En attente de validation', 'Acceptée', 'Rejetée', 'En cours' , 'Terminée']



export default function OrderPage() {
    const [drone, setDrone] = useState({})
    const [drones, setDrones] = useState([])
    const {user} = useContext(UserContext)
    const [ order, setOrder ] = useState({})
    const { id } = useParams()

    useEffect(() => {
        console.log('testsssssssssss');

        fetch('https://skydrone-api.herokuapp.com/api/v1/orders/' + id, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setOrderValue(data.order)
            })
        
        fetch('https://skydrone-api.herokuapp.com/api/v1/drones')
        .then(response => response.json())
        .then(data => {
            handleChangeInfo('allDrones', data)
            })
    }
    , [])

    // Fill input
    const [orderValue, setOrderValue] = useState({})
    const [infoValue, setInfoValue] = useState({})

    const handleChange = (event) => {
        const { name, value } = event.target
        setOrderValue(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleChangeInfo = (name, value) => {
        setInfoValue(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const calcTotalDays = (startDate, endDate) => {
        let start = new Date(startDate)
        let end = new Date(endDate)
        let diff = end.getTime() - start.getTime()
        return diff / (1000 * 60 * 60 * 24)
    }
    console.log('test');
    console.log('testddddddddd');

 

    useEffect(() => {
        console.log('ffffffffffffffff');
    }
    , [])



    const setNewDrone = (e) => {
        const newDrone = drones.filter(drone => drone._id === e.target.value)[0]
        setDrone(newDrone)
    }



    const handleSubmit = (event) => {

        /* fetch('https://skydrone-api.herokuapp.com/api/v1/orders/' + id, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + user.token},
            body: JSON.stringify({
                state_o: status,
                drone_id: drone,
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
            }
        )
        event.preventDefault(); */
    } 

    const [ totalPrice, setTotalPrice ] = useState(0)


  return (
    <>
    <h1>Réservation</h1>
    <div className="row mt-3">
        <form className="col-8" onSubmit={handleSubmit} >
            <h2>Informations</h2>
            <div className="card p-4" >
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <div className="form-group">
                        <select className="form-select" id='state' name='state_o' aria-label="Default select example" onChange={ e => handleChange(e) } value={orderValue.state_o}>
                        { stateName.map((state, key) => {
                            return (
                        <option value={state} key={key}>{state}</option>
                            )
                        }) }
                    </select>
                    </div>
                </div>
                <div className="mb-3 d-flex">
                    <div className="me-3">
                        <label htmlFor="startDate" className="form-label">Début</label>
                        <input type="date" className="form-control" name='startAt_o' id="startDate" value={displayDate(orderValue.startAt_o)} onChange={e => handleChange(e)}></input>
                    </div>
                    <div className="">
                        <label htmlFor="endDate" className="form-label">Fin</label>
                        <input type="date" className="form-control" name='endAt_o' id="endDate" value={displayDate(orderValue.endAt_o)} onChange={e => handleChange(e)}></input>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Description</label>
                    <textarea className="form-control" id="desc" name='report_o' rows="4" placeholder="Description du produit"  value={orderValue.report_o} onChange={e => handleChange(e)} ></textarea>
                </div>
                
                <div className="mb-0">
                    <label htmlFor="drone" className="form-label">Drone</label>
                    <select className="form-select" name='drone_id' id='drone' aria-label="Default select example" onChange={e => handleChange(e)} value={drone._id}>
                        { infoValue.allDrones.map((dro, key) => {
                            return (
                        <option value={dro._id} key={key}>{dro.name_d}</option>
                            )
                        }) }
                    </select>
                    
                </div>
            </div>
            <div className='col-12 d-flex mt-3'>
                <button type='submit' className='btn btn-primary ms-auto'>Enregistrer</button>
            </div>
        </form>
        <div className="col-4">
            <h2>Infos</h2>
            <div className="card p-4" >
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Prix totale</label>
                    <input type="number" className="form-control" id="price" placeholder="Prix du produit" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} disabled></input>
                </div>
            </div>
        </div>

    </div>
    
    </>
  )
}
