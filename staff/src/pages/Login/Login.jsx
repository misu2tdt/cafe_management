import { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

const Login = () => {
  const navigate = useNavigate()
  const URL = 'http://localhost:3000'

  const [data, setData] = useState({
    email: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }

  const onLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${URL}/users/login`, data)
      const token = response.data
      const tokenData = parseJwt(token)
      localStorage.setItem("token", token)
      
      if (tokenData.role === 'MANAGER') {
        navigate('/manager/menu')
      } else if (tokenData.role === 'EMPLOYEE') {
        navigate('/employee/add-order')
      } else {
        setError("Bạn không có quyền truy cập vào trang này")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại")
    } finally {
      setLoading(false)
    }
  }

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch (e) {
      return null
    }
  }

  return (
    <div className='login-container'>
      <div className='login-form'>
        <div className="login-header">
          <h2>Đăng nhập nhân viên</h2>
          <p>Vui lòng đăng nhập để tiếp tục</p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        
        <form onSubmit={onLogin}>
          <div className="login-input">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                name='email' 
                onChange={onChangeHandler} 
                value={data.email} 
                type="email" 
                placeholder='Email của bạn' 
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <input 
                id="password"
                name='password' 
                onChange={onChangeHandler} 
                value={data.password} 
                type="password" 
                placeholder='Mật khẩu' 
                required 
              />
            </div>
          </div>
          
          <button 
            type='submit' 
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login