import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import './Cart.css'
import { ShopContext } from '../../context/shopContext'

const Cart = () => {
  const [message, setMessage] = useState('')
  const [notes, setNotes] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { cart, setCart, calculateCartTotal, formatPrice, url } = useContext(ShopContext)

  useEffect(() => {
    if (cart.length > 0) {
      const initialNotes = {}
      cart.forEach(item => {
        initialNotes[item.id] = item.note || ''
      })
      setNotes(initialNotes)
    }
  }, [cart])

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
      total: calculateCartTotal(cart),
      items
    }
  }

  const handleSubmitOrder = async () => {
    try {
      setIsSubmitting(true)
      const orderData = prepareOrderData()
      const token = localStorage.getItem('token')

      const response = await axios.post(`${url}/orders`, orderData, {
        headers: { Authorization: token }
      })

      if (response.data.success) {
        setMessage("Đơn hàng đã được gửi thành công!")
        setCart([])
        setTimeout(() => {
          setMessage('')
        }, 2000)
      }
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error)

      if (error.response) {
        setMessage(`Lỗi: ${error.response.status} - ${error.response.data.message || 'Không được ủy quyền. Vui lòng đăng nhập lại.'}`)
      } else if (error.request) {
        setMessage("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.")
      } else {
        setMessage(`Có lỗi xảy ra: ${error.message}`)
      }

      setTimeout(() => setMessage(''), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const cartTotal = calculateCartTotal(cart)

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>
      {message && (
        <div className={`cart-message ${message.includes("thành công") ? "success" : ""}`}>
          {message}
        </div>
      )}
      {cart.length === 0 ? (
        <p className="cart-empty">Chưa có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <>
          <div className="cart-table-wrapper">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Tên món</th>
                  <th>Size</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th>Điều chỉnh</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.size}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.quantity || 1}</td>
                    <td>{formatPrice(item.price * (item.quantity || 1))}</td>
                    <td>
                      <button className="cart-btn minus" onClick={() => handleDecrease(item.id)}>-</button>
                      <button className="cart-btn plus" onClick={() => handleIncrease(item.id)}>+</button>
                    </td>
                    <td>
                      <button className="cart-btn delete" onClick={() => handleDelete(item.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="cart-total-label">Tổng cộng:</td>
                  <td colSpan="3" className="cart-total-value">{formatPrice(cartTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="cart-notes-section">
            <h3>Ghi chú cho từng món</h3>
            {cart.map((item) => (
              <div className="cart-note-item" key={`note-${item.id}`}>
                <label>{item.name} ({item.size}):</label>
                <input
                  type="text"
                  value={notes[item.id] || item.note || ""}
                  onChange={(e) => handleNoteChange(item.id, e.target.value)}
                  placeholder="Ghi chú (không bắt buộc)"
                  className="cart-note-input"
                />
              </div>
            ))}
          </div>

          <button className="cart-btn order" onClick={handleSubmitOrder} disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Gửi đơn hàng"}
          </button>
        </>
      )}
    </div>
  )
}

export default Cart