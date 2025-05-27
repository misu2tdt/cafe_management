import { useContext, useState } from 'react'
import './Menu.css'
import { ShopContext } from '../../context/shopContext'
import Foot from '../../components/Foot/Foot'

const Menu = () => {
  const {
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    getFilteredMenuItems,
    calculatePrice,
    formatPrice,
    addToCart,
    url
  } = useContext(ShopContext)

  const [selectedSizes, setSelectedSizes] = useState({})
  const [notes, setNotes] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [showModal, setShowModal] = useState(false)

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handleSizeSelect = (itemId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }))
  }

  const handleNoteChange = (itemId, note) => {
    setNotes(prev => ({
      ...prev,
      [itemId]: note
    }))
  }

  const getSelectedSize = (itemId) => {
    return selectedSizes[itemId] || "S"
  }

  const getNote = (itemId) => {
    return notes[itemId] || ""
  }

  const handleAddToCart = (item) => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      setShowModal(true)
      return
    }

    const size = getSelectedSize(item.id)
    const note = getNote(item.id)
    addToCart(item, size, note)
    setSuccessMessage(`Đã thêm "${item.name} (${size})" vào giỏ hàng.`)
    setTimeout(() => setSuccessMessage(''), 1500)
  }

  const filteredMenuItems = getFilteredMenuItems()

  const getImagePath = (imageURL) => {
    if (imageURL) {
      return `${url}/images/${imageURL}`
    }
  }

  return (
    <>
      <div className="menu-container">
        <div className="menu-header">
          <div className="menu-title">
            <h1>MENU</h1>
          </div>
          <div className="menu-info">
            <h3>Coffee Shop</h3>
            <div className="divider"></div>
            <h5>Pleased to meet you</h5>
          </div>
        </div>

        {successMessage && (
          <div className="cart-message success-message">{successMessage}</div>
        )}

        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredMenuItems.length > 0 ? (
          <div className="menu-items">
            {filteredMenuItems.map((item) => (
              <div className="menu-item" key={item.id}>
                <div className="menu-item-image">
                  <img src={getImagePath(item.imageURL)} alt={item.name} />
                </div>
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <div className="menu-item-name">{item.name}</div>
                    <div className="menu-item-price">
                      {formatPrice(calculatePrice(item.price, getSelectedSize(item.id)))}
                    </div>
                  </div>
                  <div className="menu-item-description">{item.description}</div>

                  <div className="menu-item-size-selector">
                    {["S", "M", "L"].map((size) => (
                      <div
                        key={size}
                        className={`size-option ${getSelectedSize(item.id) === size ? 'selected' : ''}`}
                        onClick={() => handleSizeSelect(item.id, size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>

                  <div className="menu-item-note">
                    <input
                      type="text"
                      placeholder="Ghi chú (không bắt buộc)"
                      value={getNote(item.id)}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      className="note-input"
                    />
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-items-message">
            No items available in this category.
          </div>
        )}
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Yêu cầu đăng nhập</h2>
            <p>Vui lòng đăng nhập để có thể đặt món và thêm vào giỏ hàng.</p>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>
              Đóng
            </button>
          </div>
        </div>
      )}
      
      <Foot></Foot>
    </>
  )
}

export default Menu