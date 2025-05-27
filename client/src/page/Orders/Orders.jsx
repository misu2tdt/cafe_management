import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/shopContext'
import axios from 'axios'
import './Orders.css'

const Orders = () => {
  const { url, formatPrice } = useContext(ShopContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [viewingDetails, setViewingDetails] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${url}/orders/customer/myOrders`, {
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
      fetchOrders()
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
      case 'CANCELLED':
        return 'status-cancelled'
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
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  // Back to orders list
  const backToOrders = () => {
    setViewingDetails(false)
    setSelectedOrder(null)
    setOrderItems([])
  }

  if (loading) {
    return <div className="profile-orders-loading">Đang tải...</div>
  }

  if (viewingDetails && selectedOrder) {
    return (
      <div className="order-details-container">
        <div className="order-details-header">
          <button className="back-button" onClick={backToOrders}>← Quay lại</button>
          <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
        </div>
        
        <div className="order-details-info">
          <div className="order-info-item">
            <span>Ngày đặt:</span>
            <span>{formatDate(selectedOrder.createdAt)}</span>
          </div>
          <div className="order-info-item">
            <span>Trạng thái:</span>
            <span className={getStatusClass(selectedOrder.status)}>
              {translateStatus(selectedOrder.status)}
            </span>
          </div>
          <div className="order-info-item">
            <span>Thanh toán:</span>
            <span>{translatePaymentMethod(selectedOrder.paymentMethod)}</span>
          </div>
          <div className="order-info-item">
            <span>Tổng tiền:</span>
            <span className="order-total">{formatPrice(selectedOrder.total)}</span>
          </div>
        </div>
        
        <div className="order-items-container">
          <h3>Các món đã đặt</h3>
          <div className="order-items-list">
            {orderItems.map((item, index) => (
              <div className="order-item" key={index}>
                <div className="order-item-image">
                  <img src={`${url}/images/${item.image}`} alt={item.name} />
                </div>
                <div className="order-item-details">
                  <h4>{item.name}</h4>
                  <div className="order-item-info">
                    <span>Size: {item.size}</span>
                    <span>SL: {item.quantity}</span>
                    <span>{formatPrice(item.price)}</span>
                  </div>
                  {item.note && <div className="order-item-note">Ghi chú: {item.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <h2>Lịch sử đơn hàng</h2>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Bạn chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id} onClick={() => viewOrderDetails(order.id)}>
              <div className="order-card-header">
                <div className="order-id">Đơn hàng #{order.id}</div>
                <div className={`order-status ${getStatusClass(order.status)}`}>
                  {translateStatus(order.status)}
                </div>
              </div>
              <div className="order-card-body">
                <div className="order-date">
                  <span>Ngày đặt:</span> {formatDate(order.createdAt)}
                </div>
                <div className="order-payment">
                  <span>Thanh toán:</span> {translatePaymentMethod(order.paymentMethod)}
                </div>
                <div className="order-total-row">
                  <span>Tổng tiền:</span>
                  <span className="order-total">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="order-card-footer">
                <button className="view-details-btn">Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders