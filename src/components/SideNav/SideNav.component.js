import React, {useContext, useEffect, useState} from 'react'
import './SideNav.scss'
import { UserContext } from '../user/UserContext'
import { Link } from 'react-router-dom'


export default function SideNav () {
    const {user, setUser} = useContext(UserContext)
    let customer = user.user
    const logOut = () => {
        localStorage.clear()
        setUser(null)
    }

    const [ page, setPage ] = useState('home')

    const checkPage = (page) => {
        if ( page.test(window.location.href) ) return 'active'
        else return ''
    }

    const url = window.location.pathname.split('/').pop();
    //TODO: add a check for the page to be active when the user is on the same page and not rerendering the page

    useEffect(() => {
        setPage(window.location.href)
        console.log(page);
    }
    , [url])


    
  return (
      <aside>
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark flex-grow-1">
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <svg className="bi me-2" width="40" height="32"></svg>
                <span className="fs-4">Sidebar</span>
            </a>
            <hr></hr>
            <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
                <Link to={'/'} className="nav-link text-white active">
                <svg className="bi me-2" width="16" height="16"></svg>
                Home
                </Link>
            </li>
            <li>
                <Link to={'/'} className="nav-link text-white">
                <svg className="bi me-2" width="16" height="16"></svg>
                Dashboard
                </Link>
            </li>
            <li>
                <Link to={'orders'} className="nav-link text-white">
                <svg className="bi me-2" width="16" height="16"></svg>
                Orders
                </Link>
            </li>
            <li>
                <Link to={'products'} className="nav-link text-white">
                <svg className="bi me-2" width="16" height="16"></svg>
                Products
                </Link>
            </li>
            <li>
                <Link to={'customers'} className="nav-link text-white">
                <svg className="bi me-2" width="16" height="16"></svg>
                Customers
                </Link>
            </li>
            </ul>
            <hr></hr>
            { user ? 
            <div className="dropdown">
            <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="" width="32" height="32" className="rounded-circle me-2"></img>
                <strong>{customer.firstName_u}</strong>
            </a>
            <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li><a className="dropdown-item" href="#">New project...</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><hr className="dropdown-divider"></hr></li>
                <li><button type='button' className="dropdown-item" onClick={logOut}>Sign out</button></li>
            </ul>
            </div>
            : null }
        </div>
    </aside>
  )
}
