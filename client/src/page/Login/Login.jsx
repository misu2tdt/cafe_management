import { useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'

import axios from "axios"
import { ShopContext } from '../../context/shopContext.jsx'


const Login = ({ setShowLogin }) => {
  const [curState, setCurState] = useState("Login")
  const { url } = useContext(ShopContext)

  const [data, setData] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newURL = url + (curState === "Login" ? "/users/login" : "/users/register")

    try {
      const response = await axios.post(newURL, data)
      const token = response.data
      localStorage.setItem("token", token)
      setShowLogin(false)
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra")
    }
  }

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{curState === "Login" ? "Đăng nhập" : "Đăng ký"}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-input">
          {curState === "Login" ? <></> : (
            <>
              <input name='fullname' onChange={onChangeHandler} value={data.fullname} type="text" placeholder='Họ và tên' required />
              <input name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='Số điện thoại' required />
            </>
          )}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email của bạn' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Mật khẩu' required />
        </div>
        <button type='submit'>{curState === "Sign Up" ? "Đăng ký" : "Đăng nhập"}</button>
        {curState === "Login"
          ? <p>Chưa có tài khoản? <span onClick={() => setCurState("Sign Up")}>Đăng kí ở đây</span></p>
          : <p>Đã có tài khoản rồi? <span onClick={() => {
            setCurState("Login")
            setData({
              fullname: "",
              phone: "",
              email: "",
              password: ""
            })
          }}>Đăng nhập ở đây</span></p>
        }
      </form>
    </div>
  )
}
export default Login