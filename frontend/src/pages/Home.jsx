import React from 'react'
import Hero from '../components/Hero';
import Biography from '../components/Biography';
import Departments from '../components/Department';
import MessageForm from '../components/MessageForm';

const home = () => {
  return <>
    <Hero tittle={"Welcome to Zeecare Medical Instuite | We care for your health"} imageUrl={"/hero.png"}/>
    <Biography imageUrl={"/about.png"}/>
    <Departments/>
    <MessageForm/>
  </>
}

export default home;