import { useContext, useState } from 'react'
import { ShopContext } from '../../../context/shopContext'

const Menu = ({ addToCart }) => {
  const {
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
    getFilteredMenuItems,
    calculatePrice,
    formatPrice,
    url
  } = useContext(ShopContext)

  const [selectedSizes, setSelectedSizes] = useState({})
  const [selectedItemNotes, setSelectedItemNotes] = useState({})

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  const handleSizeSelect = (itemId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [itemId]: size
    }))
  }

  const handleItemNoteChange = (itemId, note) => {
    setSelectedItemNotes(prev => ({
      ...prev,
      [itemId]: note
    }))
  }

  const getSelectedSize = (itemId) => {
    return selectedSizes[itemId] || "S"
  }

  const getItemNote = (itemId) => {
    return selectedItemNotes[itemId] || ""
  }

  const handleAddToCart = (item) => {
    const size = getSelectedSize(item.id)
    const note = getItemNote(item.id)
    addToCart(item, size, note)
  }

  const filteredMenuItems = getFilteredMenuItems()

  const getImagePath = (imageURL) => {
    if (imageURL) {
      return `${url}/images/${imageURL}`
    }
  }

  return (
    <div className="menu-section">
      <div className="menu-header">
        <h2>Menu</h2>
      </div>
      
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
        <div className="menu-items-grid">
          {filteredMenuItems.map((item) => (
            <div className="menu-item-card" key={item.id}>
              <div className="menu-item-image">
                <img src={getImagePath(item.imageURL)} alt={item.name} />
              </div>
              <div className="menu-item-details">
                <div className="menu-item-name">{item.name}</div>
                <div className="menu-item-price">
                  {formatPrice(calculatePrice(item.price, getSelectedSize(item.id)))}
                </div>
                <div className="menu-item-controls">
                  <div className="size-selector">
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
                  <input
                    type="text"
                    placeholder="Ghi chú"
                    value={getItemNote(item.id)}
                    onChange={(e) => handleItemNoteChange(item.id, e.target.value)}
                    className="menu-item-note"
                  />
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(item)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-items-message">
          Không có sản phẩm nào trong danh mục này.
        </div>
      )}
    </div>
  )
}

export default Menu