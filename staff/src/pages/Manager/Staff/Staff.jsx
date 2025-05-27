import { useState, useEffect, useContext } from 'react'
import { ShopContext } from '../../../context/shopContext'
import axios from 'axios'
import './Staff.css'

const Staff = () => {
  const { url } = useContext(ShopContext)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const token = localStorage.getItem('token')
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    salary: 0
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/users/employees`, {
        headers: { Authorization: token }
      })
      
      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (err) {
      setError('Không thể tải thông tin nhân viên')
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee.id);
    setFormData({
      fullname: employee.fullname,
      email: employee.email,
      phone: employee.phone,
      salary: employee.Employee.salary
    })
  }

  const handleCancel = () => {
    setEditingEmployee(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseInt(value, 10) : value
    }))
  }

  const handleSave = async (id) => {
    try {
      const response = await axios.put(`${url}/users/${id}`, formData, {
        headers: { Authorization: token }
      })
      
      if (response.data && response.data.success) {
        setEmployees(employees.map(emp => 
          emp.id === id ? { 
            ...emp, 
            fullname: formData.fullname,
            email: formData.email,
            phone: formData.phone,
            Employee: {
              ...emp.Employee,
              salary: formData.salary
            }
          } : emp
        ))
        setEditingEmployee(null)
      }
    } catch (err) {
      console.error('Error updating employee:', err)
      alert('Không thể cập nhật thông tin nhân viên')
    }
  }

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount)
  }

  if (loading) return <div className="loading">Đang tải...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="staff-container">
      <h1 className="staff-title">Quản lý nhân viên</h1>
      
      <div className="staff-table-container">
        <table className="staff-table">
          <thead>
            <tr>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Lương</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  {editingEmployee === employee.id ? (
                    <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="staff-input"/>
                  ) : (
                    employee.fullname
                  )}
                </td>
                <td>
                  {editingEmployee === employee.id ? (
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="staff-input"/>
                  ) : (
                    employee.email
                  )}
                </td>
                <td>
                  {editingEmployee === employee.id ? (
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="staff-input"
                    />
                  ) : (
                    employee.phone
                  )}
                </td>
                <td>
                  {editingEmployee === employee.id ? (
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="staff-input"/>
                  ) : (
                    formatSalary(employee.Employee.salary)
                  )}
                </td>
                <td>
                  {editingEmployee === employee.id ? (
                    <div className="button-group">
                      <button onClick={() => handleSave(employee.id)} className="save-button">
                        Lưu
                      </button>
                      <button onClick={handleCancel} className="cancel-button">
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(employee)} className="edit-button">
                      Chỉnh sửa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && (
        <div className="no-data">
          Không có dữ liệu nhân viên.
        </div>
      )}
    </div>
  );
};

export default Staff