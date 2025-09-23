import React from 'react'

const Biography = ({imageUrl}) => {
  return (
    <div className='container biography'>
        <div className="banner">
            <img src={imageUrl} alt="aboutimg" />
        </div>
        <div className="banner">
            <p>Biography</p>
            <h3>Who are we</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem animi blanditiis dolore molestiae iste magni accusantium ab vitae alias voluptatem, nisi dolor incidunt earum, accusamus voluptatum itaque? Maiores dignissimos, est cumque corrupti consequatur quam at! Nam veniam nulla, error rem, quia deserunt eveniet optio ipsam quod sequi libero a tenetur.</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
            <p>Lorem ipsum dolor sit amet.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex voluptates voluptatem architecto quaerat eos assumenda aspernatur ratione nulla neque. Ipsum rem rerum ab? Distinctio ex id consequatur aliquid suscipit at nesciunt voluptate veritatis non sunt!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta, porro?</p>
            <p>Lorem, ipsum dolor.</p>
        </div>
    </div>
  )
}

export default Biography