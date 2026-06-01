import React, { memo } from 'react'
import CandidateHeader from '../components/Header/CandidateHeader'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'

export default memo(function Layout() {
  return (
    <>
     <CandidateHeader />
     <main className="min-h-[calc(100vh-128px)] bg-slate-50/50">
       <Outlet />
     </main>
     <Footer /> 
    </>
  )
})
