import React from 'react'
import DronesList from '../drone/DronesList'
import OrderList from '../order/OrderList'
import CustomerList from '../customer/CustomerList'
import './Home.scss'

export default function Home () {
  return (
    <>
      <h1>Home Page</h1>
      <section>
        <DronesList style={'mini'} />
      </section>
      <section>
        <OrderList style={'mini'} />
      </section>
      <section>
        <CustomerList style={'mini'} />
      </section>

    </>
  )
}
