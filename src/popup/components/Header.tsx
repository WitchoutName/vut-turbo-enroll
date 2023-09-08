
import LogoImg from '../../assets/logo.png'


export default function Header () {
  return (
    <div className='d-flex align-items-center header'>
        <img src={LogoImg} alt="logo" width={40} height={40}/>
        <h3>VUT Turbo Enroll</h3>
      </div>
  )
}