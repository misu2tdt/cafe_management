import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../../context/shopContext'
import axios from 'axios'
import './Orders.css'

const Orders = () => {
  const { url, formatPrice } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [viewingDetails, setViewingDetails] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${url}/orders`, {
          headers: { Authorization: token }
        })
        
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
        
        setOrders(sortedOrders)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching orders:', error)
        setLoading(false)
      }
    }

    if (token) {
      fetchAllOrders()
    }
  }, [token, url])

  const viewOrderDetails = async (orderId) => {
    try {
      setViewingDetails(true)
      const response = await axios.get(`${url}/orders/${orderId}`, {
        headers: { Authorization: token }
      })
      
      setOrderItems(response.data.items)
      setSelectedOrder(orders.find(order => order.id === orderId))
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdateLoading(true)
      await axios.put(`${url}/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: token } }
      )
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }))
      }
      
      setUpdateLoading(false)
    } catch (error) {
      console.error('Error updating order status:', error)
      setUpdateLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'status-pending'
      case 'PROCESSING':
        return 'status-processing'
      case 'DONE':
        return 'status-completed'
      case 'CANCELED':
        return 'status-canceled'
      default:
        return ''
    }
  }

  const translatePaymentMethod = (method) => {
    switch (method) {
      case 'CASH':
        return 'Tiền mặt'
      case 'CREDIT_CARD':
        return 'Thẻ tín dụng'
      case 'MOMO':
        return 'MoMo'
      default:
        return method
    }
  }

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'PROCESSING':
        return 'Đang chuẩn bị'
      case 'DONE':
        return 'Hoàn thành'
      case 'CANCELED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const backToOrders = () => {
    setViewingDetails(false)
    setSelectedOrder(null)
    setOrderItems([])
  }

  if (loading) {
    return <div className="orders-loading">Đang tải...</div>
  }

  if (viewingDetails && selectedOrder) {
    return (
      <div className="staff-order-details">
        <div className="staff-order-header">
          <button className="back-btn" onClick={backToOrders}>← Quay lại</button>
          <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
        </div>
        
        <div className="staff-order-info">
          <div className="customer-info">
            <span className="info-label">Khách hàng: </span>
            <span className="info-value customer-name">{selectedOrder.displayName}</span>
          </div>
          
          <div className="order-info-row">
            <div className="info-item">
              <span className="info-label">Ngày đặt:</span>
              <span className="info-value">{formatDate(selectedOrder.createdAt)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Thanh toán:</span>
              <span className="info-value">{translatePaymentMethod(selectedOrder.paymentMethod)}</span>
            </div>
          </div>
          
          <div className="order-info-row">
            <div className="info-item">
              <span className="info-label">Tổng tiền:</span>
              <span className="info-value order-price">{formatPrice(selectedOrder.total)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Trạng thái:</span>
              <span className={`order-status ${getStatusClass(selectedOrder.status)}`}>
                {translateStatus(selectedOrder.status)}
              </span>
            </div>
          </div>
          
          <div className="status-actions">
            <span className="status-label">Cập nhật trạng thái:</span>
            <div className="status-buttons">
              <button 
                className="status-btn pending"
                disabled={selectedOrder.status === 'PENDING' || updateLoading}
                onClick={() => updateOrderStatus(selectedOrder.id, 'PENDING')}
              >
                Chờ xác nhận
              </button>
              <button 
                className="status-btn processing"
                disabled={selectedOrder.status === 'PROCESSING' || updateLoading}
                onClick={() => updateOrderStatus(selectedOrder.id, 'PROCESSING')}
              >
                Đang chuẩn bị
              </button>
              <button 
                className="status-btn completed"
                disabled={selectedOrder.status === 'DONE' || updateLoading}
                onClick={() => updateOrderStatus(selectedOrder.id, 'DONE')}
              >
                Hoàn thành
              </button>
              <button 
                className="status-btn canceled"
                disabled={selectedOrder.status === 'CANCELED' || updateLoading}
                onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELED')}
              >
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
        
        <div className="staff-items-list">
          <h3>Các món đã đặt</h3>
          {orderItems.map((item, index) => (
            <div className="order-item" key={index}>
              <div className="item-image">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
              </div>
              <div className="item-details">
                <h4>{item.name}</h4>
                <div className="item-meta">
                  <span>Size: {item.size}</span>
                  <span>SL: {item.quantity}</span>
                  <span>{formatPrice(item.price)}</span>
                </div>
                {item.note && <div className="item-note">Ghi chú: {item.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="staff-orders">
      <h2>Quản lý đơn hàng</h2>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Không có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id} onClick={() => viewOrderDetails(order.id)}>
              <div className="order-header">
                <div className="order-id">Đơn hàng #{order.id}</div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {translateStatus(order.status)}
                </div>
              </div>
              
              <div className="order-body">
                <div className="order-info">
                  <span>Ngày đặt: {formatDate(order.createdAt)}</span>
                  <span>Thanh toán: {translatePaymentMethod(order.paymentMethod)}</span>
                </div>
                <div className="order-total">
                  <span>Tổng tiền:</span>
                  <span className="price">{formatPrice(order.total)}</span>
                </div>
              </div>
              
              <div className="order-footer">
                <button className="details-btn">Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders