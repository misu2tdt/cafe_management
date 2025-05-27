import { useContext, useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../../context/shopContext'

const Navbar = ({setShowLogin}) => {
  const token = localStorage.getItem('token')
  const { setCart } = useContext(ShopContext)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(!!token)
  
  useEffect(() => {
    setIsLoggedIn(!!token)
  }, [token])
  
  const LogOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("cart")
    setCart([])
    setIsLoggedIn(false)
    navigate("/")
  }
  
  const handleCartClick = () => {
    navigate('/cart')
  }

  const handleOrdersClick = () => {
    navigate('/orders')
  }

  return (
    <div className='navbar'>
      <img src={assets.logo} className='logo' alt="Logo" />
      <ul className="navbar_menu">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/menu" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Menu
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/discount" 
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Discount
          </NavLink>
        </li>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="Search" className='search_icon'/>
        <div className='div_bucket_icon' onClick={handleCartClick} style={{ cursor: 'pointer' }}>
          <img src={assets.bucket_icon} alt="Cart" className='bucket_icon'/>
          <div className='div_dot'></div>
        </div>
        {!isLoggedIn ? 
          <button onClick={()=>setShowLogin(true)}>Đăng nhập</button>
          :
          <div className='profile'>
            <img src={assets.user_icon} alt="" />
            <ul className="profile-dropdown">
              <li onClick={handleOrdersClick}><img src={assets.order_icon} alt="" /><p>Đơn hàng</p></li>
              <hr />
              <li onClick={LogOut}><img src={assets.logout_icon} alt="" /><p>Đăng xuất</p></li>
            </ul>
          </div>
        }
      </div>
    </div>
  )
}

export default Navbar