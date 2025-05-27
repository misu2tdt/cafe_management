import { useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login/Login"
import Menu from "./pages/Manager/Menu/Menu"
import Staff from "./pages/Manager/Staff/Staff"
import Report from "./pages/Manager/Report/Report"
import Orders from "./pages/Employee/Orders/Orders"
import Add_order from "./pages/Employee/Add_order/Add_order"
import Layout from "./components/Layout"


const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkToken = () => {
    const token = localStorage.getItem("token")

    if (!token) {
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]))
      const isExpired = tokenData.exp * 1000 < Date.now()

      if (isExpired) {
        localStorage.removeItem("token")
        setIsAuthenticated(false)
      } else {
        setUserRole(tokenData.role)
        setIsAuthenticated(true)
      }
    } catch (err) {
      console.error("Invalid token:", err)
      localStorage.removeItem("token")
      setIsAuthenticated(false)
    }

    setLoading(false)
  }

  useEffect(() => {
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

  if (loading) return <div>Đang tải...</div>
  if (!isAuthenticated) return <Navigate to="/login" />
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/unauthorized" />

  return children
}



const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Route khi không có quyền */}
      <Route path="/unauthorized" element={<div>Không có quyền truy cập.</div>} />

      {/* Manager routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute requiredRole="MANAGER">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="menu" element={<Menu />} />
        <Route path="staff" element={<Staff />} />
        <Route path="report" element={<Report />} />
      </Route>

      {/* Employee routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute requiredRole="EMPLOYEE">
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="add-order" element={<Add_order />} />
        <Route path="orders" element={<Orders />} />
      </Route>

      {/* Default routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App