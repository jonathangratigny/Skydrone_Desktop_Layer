import React, {useContext, useEffect, useState} from 'react'
import './SideNav.scss'
import { UserContext } from '../user/UserContext'
import { Link, useNavigate } from 'react-router-dom'
import "bootstrap-icons/font/bootstrap-icons.css";


export default function SideNav () {
    const {user, setUser} = useContext(UserContext)
    let customer = user.user
    const logOut = () => {
        localStorage.clear()
        setUser(null)
    }

    let links = document.querySelectorAll('.nav-link')
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function () {
            for (let j = 0; j < links.length; j++)
                links[j].classList.remove('active')
            this.classList.add('active')
        })
    }

    const navigate = useNavigate();

/*     const [ page, setPage ] = useState('home')

    const checkPage = (page) => {
        if ( page.test(window.location.href) ) return 'active'
    }

    const url = window.location.pathname.split('/').pop();
    //TODO: add a check for the page to be active when the user is on the same page and not rerendering the page

    useEffect(() => {
        setPage(window.location.href)
    }
    , [url]) */


    
  return (
      <aside>
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark flex-grow-1">
            <div className="d-flex align-items-center mb-3 mb-md-0 text-white text-decoration-none">
                <a href="/" className="text-white text-decoration-none">
                    <span className="fs-4">SKY'DRONE</span>
                </a>
                <nav className='d-flex ms-auto pagination'>
                    <span className='btn text-white' onClick={() => navigate(-1)}> <i className="bi bi-caret-left"></i> </span>
                    <span className='btn text-white' onClick={() => navigate(1)}> <i className="bi bi-caret-right"></i> </span>
                </nav>
            </div>
            <hr></hr>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to={'/'} className="nav-link text-white">
                        <i className="bi bi-house me-2"></i>
                        Accueil
                    </Link>
                </li>
                <li>
                    <Link to={'products'} className="nav-link text-white">
                        <i className="bi bi-airplane-engines me-2"></i>
                        Drones
                    </Link>
                </li>
                <li>
                    <Link to={'orders'} className="nav-link text-white">
                        <i className="bi bi-card-checklist me-2"></i>
                        Commandes
                    </Link>
                </li>
                <li>
                    <Link to={'customers'} className="nav-link text-white">
                        <i className="bi bi-people me-2"></i>
                        Utilisateurs
                    </Link>
                </li>
                <li>
                    <Link to={'/'} className="nav-link text-muted disabled">
                        <i className="bi bi-bar-chart-line me-2"></i>
                        Dashboard
                    </Link>
                </li>
            </ul>
            <hr></hr>
            { user ? 
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle fs-4 me-2"></i>
                    <strong>{customer.firstName_u} {customer.lastName_u}</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><a className="dropdown-item disabled" href="#">Settings</a></li>
                    <li><a className="dropdown-item disabled" href="#">Profile</a></li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li><button type='button' className="dropdown-item" onClick={logOut}>Sign out</button></li>
                </ul>
            </div>
            : null }
        </div>
    </aside>
  )
}
