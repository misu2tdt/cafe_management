import { Routes, Route, useNavigate } from "react-router-dom"
import Home from './page/Home/Home'
import Navbar from './components/Navbar/Navbar'
import Discount from './page/Discount/Discount'
import Menu from './page/Menu/Menu'
import Login from './page/Login/Login'
import Cart from './page/Cart/Cart'
import Orders from './page/Orders/Orders'
import { useState, useEffect } from 'react'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkToken = () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const payload = JSON.parse(atob(token.split(".")[1]))
        const currentTime = Date.now() / 1000

        if (currentTime > payload.exp) {
          localStorage.removeItem("token")
          navigate('/')
        }
      } catch (error) {
        localStorage.removeItem("token")
        navigate('/')
      }
    }
    checkToken()

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkToken()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <>
      {showLogin && <Login setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discount" element={<Discount />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </>
  )
}

export default App
