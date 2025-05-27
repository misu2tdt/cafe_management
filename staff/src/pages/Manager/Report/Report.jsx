import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ShopContext } from '../../../context/shopContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './Report.css'

const Report = () => {
  const { url, formatPrice } = useContext(ShopContext)
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dailyData, setDailyData] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true)
        

        const dashboardResponse = await axios.get(`${url}/dashboard`, {
          headers: { Authorization: token }
        })
        setReportData(dashboardResponse.data)
        
        try {
          const dailyRevenue = await axios.get(`${url}/dashboard/daily-revenue`, {
            headers: { Authorization: token }
          })
          
          if (dailyRevenue.data && Array.isArray(dailyRevenue.data)) {
            const processedData = dailyRevenue.data.map(item => ({
              name: item.day.toString(),
              revenue: parseFloat(item.revenue) || 0,
              fullDate: item.date
            }))
            setDailyData(processedData)
          } else {
            throw new Error('Invalid daily revenue data format')
          }
        } catch (dailyError) {
          console.warn('Failed to fetch daily revenue, using fallback:', dailyError)
          const currentDate = new Date()
          const currentDay = currentDate.getDate()
          
          const chartData = [{
            name: `${currentDay}`,
            revenue: dashboardResponse.data.totalRevenue || 0,
            fullDate: currentDate.toISOString().split('T')[0]
          }]
          setDailyData(chartData)
        }
        
        setLoading(false)
      } catch (err) {
        console.error("Error fetching report data:", err)
        setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.")
        setLoading(false)
      }
    }

    if (token) {
      fetchReportData()
    }
  }, [url, token])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">
            Ngày {label} {data.fullDate ? `(${new Date(data.fullDate).toLocaleDateString('vi-VN')})` : ''}
          </p>
          <p className="tooltip-revenue">
            Doanh thu: {formatPrice(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="report-loading">
        <h2>Đang tải dữ liệu báo cáo...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="report-error">
        <h2>{error}</h2>
      </div>
    )
  }

  return (
    <div className="report-container">
      <h1 className="report-title">Báo Cáo Hoạt Động</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue-icon">💰</div>
          <div className="stat-content">
            <h3>Doanh Thu Tháng Này</h3>
            <p className="stat-value">{reportData ? formatPrice(reportData.totalRevenue) : '0 VND'}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orders-icon">📋</div>
          <div className="stat-content">
            <h3>Tổng Đơn Hàng</h3>
            <p className="stat-value">{reportData ? reportData.totalOrders : 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon customers-icon">👥</div>
          <div className="stat-content">
            <h3>Số Khách Hàng</h3>
            <p className="stat-value">{reportData ? reportData.customerCount : 0}</p>
          </div>
        </div>
      </div>
      
      <div className="report-row">
        <div className="chart-container">
          <h2>Doanh Thu Theo Ngày Trong Tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={dailyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#e0e0e0', strokeWidth: 1 }}
                tickLine={{ stroke: '#e0e0e0', strokeWidth: 1 }}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                axisLine={{ stroke: '#e0e0e0', strokeWidth: 1 }}
                tickLine={{ stroke: '#e0e0e0', strokeWidth: 1 }}
                tick={{ fontSize: 12, fill: '#666' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Doanh Thu" 
                stroke="#4285F4" 
                strokeWidth={3}
                dot={{ 
                  r: 5, 
                  fill: '#4285F4', 
                  strokeWidth: 2, 
                  stroke: '#fff' 
                }}
                activeDot={{ 
                  r: 7, 
                  fill: '#4285F4', 
                  strokeWidth: 3, 
                  stroke: '#fff',
                  boxShadow: '0 0 10px rgba(66, 133, 244, 0.5)'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="top-item-container">
          <h2>Sản Phẩm Bán Chạy Nhất</h2>
          {reportData && reportData.topMenuItem ? (
            <div className="top-item-card">
              <div className="top-item-icon">🏆</div>
              <h3>{reportData.topMenuItem.name}</h3>
              <p>Đã bán: <strong>{reportData.topMenuItem.quantity}</strong> ly</p>
            </div>
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Report