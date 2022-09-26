import React, {useState, useEffect, useContext} from 'react'
import {baseUrl} from '../../utils/globalVariables'
import {UserContext} from '../user/UserContext'


export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {user, setUser} = useContext(UserContext)

    function CheckError(response) {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      }
    //TODO - add error handling in the api response
    const handleLogin = () => {
        fetch(`${baseUrl}/login`,{
            method:'post',
            body:JSON.stringify({email, password}),
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
        .catch(err => console.error(err))
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
                                        <span><img src="assets/images/logo.png" alt="" height="18"></img></span>
                                    </a>
                                </div>

                                <div className="card-body p-4">
                                    
                                    <div className="text-center w-75 m-auto">
                                        <h4 className="text-dark-50 text-center pb-0 fw-bold">Sign In</h4>
                                        <p className="text-muted mb-4">Enter your email address and password to access admin panel.</p>
                                    </div>

                                        <div className="mb-3">
                                            <label htmlFor="emailaddress" className="form-label">Email address</label>
                                            <input className="form-control" 
                                                type="email" 
                                                id="emailaddress" 
                                                onChange={(e) => setEmail(e.target.value)}
                                                value={email}
                                                placeholder="Enter your email">
                                            </input>
                                        </div>

                                        <div className="mb-3">
                                            <a href="pages-recoverpw.html" className="text-muted float-end"><small>Forgot your password?</small></a>
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <div className="input-group input-group-merge">
                                                <input className="form-control" 
                                                    type="password" 
                                                    id="password" 
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password}
                                                    placeholder="Enter your password">
                                                </input>
                                            </div>
                                        </div>

                                        <div className="mb-3 mb-3">
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="checkbox-signin" ></input>
                                                <label className="form-check-label" htmlFor="checkbox-signin">Remember me</label>
                                            </div>
                                        </div>

                                        <div className="mb-3 mb-0 text-center">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={handleLogin}
                                                type="button"> 
                                                    Log In 
                                            </button>
                                        </div>

                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-12 text-center">
                                    <p className="text-muted">Don't have an account? <a href="pages-register.html" className="text-muted ms-1"><b>Sign Up</b></a></p>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
