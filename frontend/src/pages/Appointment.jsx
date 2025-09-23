import React from 'react';
import AppointmentForm from '../components/AppointmentForm';
import Hero from "../components/Hero"

const Appointment = () => {
  return (
    <>
      <Hero tittle={"Schedule Your Appointment | ZeeCare Medical Instuite"} imageUrl={"/signin.png"}/>
      <AppointmentForm/>
    </>
  )
}

export default Appointment;