import { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { ShopContext } from '../../../context/shopContext'
import { toast } from 'react-toastify'

const Cart = ({ cart, setCart, setMessage }) => {
  const { formatPrice, url } = useContext(ShopContext)
  const [notes, setNotes] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const token = localStorage.getItem('token')

  const handleIncrease = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    )
  }

  const handleDecrease = (id) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 1) > 0)

      const removedItem = prev.find(
        (item) => item.id === id && (item.quantity || 1) === 1
      )
      if (removedItem) {
        setTimeout(() => setMessage(`Đã loại bỏ "${removedItem.name} (${removedItem.size})" khỏi giỏ hàng.`), 0)
        setTimeout(() => setMessage(''), 1500)
      }
      return updated
    })
  }

  const handleDelete = (id) => {
    setCart((prev) => {
      const removedItem = prev.find((item) => item.id === id)
      if (removedItem) {
        setTimeout(() => setMessage(`Đã xóa "${removedItem.name} (${removedItem.size})" khỏi giỏ hàng.`), 0)
        setTimeout(() => setMessage(''), 1500)
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const handleNoteChange = (id, value) => {
    setNotes(prev => ({
      ...prev,
      [id]: value
    }))

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, note: value } : item
      )
    )
  }

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1))
    }, 0)
  }

  const prepareOrderData = () => {
    const items = cart.map(item => {
      const menuItemId = parseInt(item.id.split('-')[0])

      return {
        menuItemId,     
        quantity: item.quantity || 1,
        size: item.size,
        note: notes[item.id] || item.note || ""
      }
    })

    return {
      paymentMethod: "CASH",  
      total: calculateCartTotal(),
      items,
      OrderName: customerName.trim() || null
    }
  }

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast.warning("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.")
      return
    }

    try {
      setIsSubmitting(true)
      const orderData = prepareOrderData()
      const response = await axios.post(`${url}/orders`, orderData, 
        { headers: { Authorization: token } }
      )

      if (response.data.success) {
        toast.success("Đơn hàng đã được gửi thành công!")
        setCart([]) 
        setCustomerName("") 
        setNotes({}) 
        localStorage.removeItem("cart")
      } else {
        toast.error(response.data.message || "Lỗi khi tạo đơn hàng")
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error)

      if (error.response) {
        toast.error(`${error.response.data.message || 'Không được ủy quyền. Vui lòng đăng nhập lại.'}`)
      } else if (error.request) {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      } else {
        toast.error(`Có lỗi xảy ra: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h2>Giỏ hàng</h2>
      </div>
      
      {cart.length === 0 ? (
        <div className="cart-empty">
          <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-header">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-size">{item.size}</div>
                </div>
                
                <div className="cart-item-details">
                  <div className="cart-item-price">{formatPrice(item.price)}</div>
                  
                  <div className="cart-item-quantity">
                    <button className="quantity-btn" onClick={() => handleDecrease(item.id)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button className="quantity-btn" onClick={() => handleIncrease(item.id)}>+</button>
                  </div>
                  
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                    <i className="delete-icon">×</i>
                  </button>
                </div>
                
                <div className="cart-item-note-container">
                  <input
                    type="text"
                    placeholder="Ghi chú"
                    value={notes[item.id] || item.note || ""}
                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    className="cart-item-note"
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-footer">
            <div className="customer-name-container">
              <input
                type="text"
                placeholder="Tên khách hàng"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="customer-name-input"
              />
            </div>
            
            <div className="cart-total">
              <span>Tổng cộng:</span>
              <span className="total-amount">{formatPrice(calculateCartTotal())}</span>
            </div>
            
            <button 
              className="order-btn"
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Xác nhận đơn hàng"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart