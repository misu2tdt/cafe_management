import "./Navbar.css"
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from "../../context/shopContext"
import { useContext } from "react"

const Navbar = () => {
  const { setCart } = useContext(ShopContext)
  const navigate = useNavigate()
  const LogOut = () =>{
    localStorage.removeItem("token")
    localStorage.removeItem("cart")
    setCart([])
    navigate("/login")
  }
  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className='profile'>
        <img src={assets.user_icon} alt="" />
        <ul className="profile-dropdown">
          <li onClick={LogOut}><img src={assets.logout_icon} alt="" /><p>Đăng xuất</p></li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar