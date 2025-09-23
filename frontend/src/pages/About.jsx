import React from 'react'
import Hero from '../components/Hero';
import Biography from '../components/Biography';

const About = () => {
  return (
    <>
      <Hero tittle={"Learn More About Us | Zeecare Medical Instuite"} imageUrl={"/about.png"}/>
      <Biography imageUrl={"/whoweare.png"}/>
    </>
  )
}

export default About;