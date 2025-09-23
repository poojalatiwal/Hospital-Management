import React from 'react'

const Hero = ({tittle,imageUrl}) => {
  return (
    <div className='hero container'>
        <div className="banner">
            <h1>{tittle}</h1>
            <p>
            Zeecare Health Institute is committed to delivering exceptional healthcare services with a focus on patient-centered care, innovation, and compassion. The institute is known for its highly qualified medical professionals, advanced diagnostic and treatment facilities, and a holistic approach that integrates modern medicine with personalized attention. By prioritizing quality, transparency, and accessibility, Zeecare Health Institute ensures that every patient receives the best possible care in a safe, supportive, and healing environment. 
            </p>
        </div>
        <div className="banner">
            <img src={imageUrl} alt="heroimg" className='animated-image' />
            <span>
                <img src="/vector.png" alt="vector" />
            </span>
        </div>
    </div>
  )
}

export default Hero