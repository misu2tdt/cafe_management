import { useState, useContext } from 'react'
import './Add_order.css'
import MenuSection from './Menu.jsx'
import CartSidebar from './Cart.jsx'
import { ShopContext } from '../../../context/shopContext'

const Add_order = () => {
  const { calculatePrice, cart, setCart } = useContext(ShopContext)
  const [message, setMessage] = useState('')

  const addToCart = (item, size, note) => {
    const cartItemId = `${item.id}-${size}`
    
    const priceForSize = calculatePrice(item.price, size)
    
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === cartItemId
      )
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 1) + 1
        
        if (note && note.trim() !== "") {
          updatedCart[existingItemIndex].note = note
        }
        
        return updatedCart
      } else {
        const newCartItem = {
          id: cartItemId,
          itemId: item.id,
          name: item.name,
          price: priceForSize,
          basePrice: item.price,
          size: size,
          quantity: 1,
          note: note || "",
          imageURL: item.imageURL
        }
        
        return [...prevCart, newCartItem]
      }
    })
    setMessage(`Đã thêm "${item.name} (${size})" vào giỏ hàng.`)
    setTimeout(() => setMessage(''), 1500)
  }

  return (
    <div className="add-order-container">
      {message && (
        <div className={`cart-message ${message.includes("thành công") ? "success" : ""}`}>
          {message}
        </div>
      )}

      <div className="add-order-content">
        <MenuSection addToCart={addToCart} />
        <CartSidebar
          cart={cart}
          setCart={setCart}
          setMessage={setMessage}
        />
      </div>
    </div>
  )
}

export default Add_order