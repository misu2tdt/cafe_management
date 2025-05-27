import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import "./Sidebar.css"
import { assets } from '../../assets/assets'

const Sidebar = () => {
  const [role, setRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const data = JSON.parse(atob(token.split('.')[1]))
        setRole(data.role)
      } catch (err) {
        console.error("Token lỗi:", err)
      }
    }
  }, [])

  return (
    <div className="sidebar">
      <h4 className="sidebar-title">Chức năng</h4>
      <div className="sidebar-menu">
        {role === "MANAGER" && (
          <>
            <NavLink to="/manager/menu" className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }>
              <img src={assets.menu_icon} alt="Menu" className="sidebar-icon" />
              <span>Quản lý Menu</span>
            </NavLink>
            
            <NavLink to="/manager/staff" className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }>
              <img src={assets.group_icon} alt="Staff" className="sidebar-icon" />
              <span>Danh sách nhân viên</span>
            </NavLink>
            
            <NavLink to="/manager/report" className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }>
              <img src={assets.chart_icon} alt="Reports" className="sidebar-icon" />
              <span>Báo cáo</span>
            </NavLink>
          </>
        )}

        {role === "EMPLOYEE" && (
          <>
            <NavLink to="/employee/add-order" className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }>
              <img src={assets.cart_icon} alt="Orders" className="sidebar-icon" />
              <span>Đặt đơn</span>
            </NavLink>
            
            <NavLink to="/employee/orders" className={({ isActive }) => 
              isActive ? "sidebar-item active" : "sidebar-item"
            }>
              <img src={assets.orders_icon} alt="Order Management" className="sidebar-icon" />
              <span>Quản lý đơn hàng</span>
            </NavLink>
          </>
        )}
      </div>
    </div>
  )
}

export default Sidebar