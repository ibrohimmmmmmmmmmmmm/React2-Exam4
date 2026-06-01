import React, { memo } from 'react'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

export default memo(function Layout() {
  return (
    <>
     <Header />
     <Outlet />
     <Footer /> 
    </>
  )
})
