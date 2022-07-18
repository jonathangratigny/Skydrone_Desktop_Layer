
import React, { useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'
/* import Navbar from './components/Navbar';
import Footer from './components/Footer'; */
import SideNav from '../SideNav/SideNav.component'
import Home from '../home/Home.component'
import Login from '../login/Login.component'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserContext } from '../user/UserContext'
import DronePage from '../drone/DronePage'
import DronesList from '../drone/DronesList'


const App = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser])


  return (
    <>
        <Router>
          <UserContext.Provider value={providerValue}>
            {!user ? <Login /> :
            <>
            <SideNav user={user} />
              <main className='container-fluid'>
                <Routes>
                  <Route path='/' exact element={<Home />}></Route>
                  <Route path='/products' exact element={<DronesList />}></Route>
                  <Route path='/product/:id' exact element={<DronePage />}></Route>
                </Routes>
              </main>
            </>
            }
          </UserContext.Provider>
        </Router>
    </>
  );
}

export default App;