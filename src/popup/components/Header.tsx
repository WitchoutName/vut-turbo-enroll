import React from 'react';
import LogoImg from '../../assets/logo.png';

//Define Header stateless functional component
const Header: React.FC = () => {
  //Render Header component
    return (
        <div className='d-flex align-items-center header'>
            <img src={LogoImg} alt="logo" width={40} height={40}/>
            <h3>VUT Turbo Enroll</h3>
        </div>
    );
}

// Export Header component
export default Header;