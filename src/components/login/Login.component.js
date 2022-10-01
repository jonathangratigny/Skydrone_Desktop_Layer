import React, {useState, useEffect, useContext} from 'react'
import {baseUrl} from '../../utils/globalVariables'
import {UserContext} from '../user/UserContext'
import { useForm } from "react-hook-form";


export default function Login() {
    const {user, setUser} = useContext(UserContext)
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
    const onSubmit = data => handleLogin(data)

    function CheckError(response) {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      }

    const handleLogin = (data) => {
        fetch(`${baseUrl}/login`,{
            method:'post',
            body:JSON.stringify(data),
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(CheckError)
        .then(result => {
            let json = JSON.stringify(result)
            localStorage.setItem('user', json)
            setUser(result)
        })
        .catch(err => {
            console.error(err)
            setError('api', { type: 'custom', message: err });
        })
    }

    const errorOrNot = (name) => {
        if (Object.keys(errors).length === 0) return false
        return true
    }

  return (
    <div className="w-100">
        <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xxl-4 col-lg-5">
                            <div className="card">
                                <div className="card-header pt-4 pb-4 text-center bg-primary">
                                    <a href="index.html">
                                        <span className='text-white fs-4'>SKY'DRONE</span>
                                    </a>
                                </div>
                                <div className="card-body p-4">
                                    <div className="text-center w-75 m-auto">
                                        <h4 className="text-dark-50 text-center pb-0 fw-bold">Connection</h4>
                                        <p className="text-muted mb-4">Entrer votre adresse mail et votre mot de passe pour acceder aux outils d'administration</p>
                                    </div>
                                    {errorOrNot() && <span className='errorMessage'>Email ou mot de passe incorrect</span>}
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mb-3">
                                            <label htmlFor="emailaddress" className="form-label">Email address</label>
                                            <input className="form-control"
                                                {...register("email", { required: "Ce champ est requis.", pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g })}
                                                placeholder="Entrer votre adresse mail">
                                            </input>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <div className="">
                                                <input className="form-control"
                                                    {...register("password", { required: true })}
                                                    placeholder="Entrer votre mot de passe">
                                                </input>
                                            </div>
                                        </div>
                                        <div className="mb-3 mb-0 text-center">
                                            <button className="btn btn-primary" type="submit" onClick={() => clearErrors("api")}>Connection</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
