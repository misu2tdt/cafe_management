import { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../../../context/shopContext'
import { assets } from '../../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import './Menu.css'

const Menu = () => {
  const { url } = useContext(ShopContext)
  const [menuList, setMenuList] = useState([])
  const [filteredMenuList, setFilteredMenuList] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState('name')
  const token = localStorage.getItem('token')

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: 1
  })
  const [image, setImage] = useState(null)

  const categoryNames = {
    1: "Cà phê",
    2: "Trà trái cây",
    3: "Macchiato & Matcha",
    4: "Trà sữa",
    5: "Đá xay",
    6: "Nước ép"
  }

  const fetchAllMenu = async () => {
    try {
      const response = await axios.get(`${url}/menuItems/list-all`, {
        headers: { Authorization: token }
      })
      setMenuList(response.data)
      setFilteredMenuList(response.data)
    } catch (error) {
      console.error("Error fetching all menu items:", error)
      toast.error("Không thể tải danh sách món")
    }
  }

  useEffect(() => {
    fetchAllMenu()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMenuList(menuList)
      return
    }

    const filtered = menuList.filter(item => {
      if (searchType === 'name') {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase())
      } else if (searchType === 'category') {
        const categoryName = categoryNames[item.categoryId].toLowerCase()
        return categoryName.includes(searchTerm.toLowerCase())
      }
      return false
    })

    setFilteredMenuList(filtered)
  }, [searchTerm, searchType, menuList])

  const resetForm = () => {
    setNewItem({
      name: "",
      description: "",
      price: "",
      categoryId: 1
    })
    setImage(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem({
      ...newItem,
      [name]: value
    })
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value)
    setSearchTerm('')
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!image) {
      toast.error("Vui lòng chọn ảnh sản phẩm")
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("name", newItem.name)
      formData.append("description", newItem.description)
      formData.append("price", newItem.price)
      formData.append("categoryId", newItem.categoryId)
      formData.append("imageURL", image)

      const response = await axios.post(`${url}/menuItems`, formData, {
        headers: { Authorization: token }
      })

      if (response.data.success) {
        toast.success("Thêm món thành công")
        setShowAddModal(false)
        resetForm()
        fetchAllMenu()
      } else {
        toast.error(response.data.message || "Thêm món thất bại")
      }
    } catch (error) {
      console.error("Error adding menu item:", error)
      toast.error("Có lỗi xảy ra khi thêm món")
    } finally {
      setLoading(false)
    }
  }

  const handleEditItem = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await axios.put(
        `${url}/menuItems/${selectedItem.id}`,
        {
          name: newItem.name,
          price: newItem.price,
          description: newItem.description,
          categoryId: newItem.categoryId
        }, {
        headers: { Authorization: token }
      }
      )

      if (response.data.success) {
        toast.success("Cập nhật món thành công")
        setShowEditModal(false)
        resetForm()
        fetchAllMenu()
      } else {
        toast.error(response.data.message || "Cập nhật món thất bại")
      }
    } catch (error) {
      console.error("Error updating menu item:", error)
      toast.error("Có lỗi xảy ra khi cập nhật món")
    } finally {
      setLoading(false)
    }
  }

  const handleDisableItem = async (item) => {
    try {
      setLoading(true)
      const response = await axios.put(`${url}/menuItems/disable/${item.id}`, {}, {
        headers: { Authorization: token }
      })

      if (response.data.success) {
        toast.success("Vô hiệu hóa món thành công")
        fetchAllMenu()
      } else {
        toast.error(response.data.message || "Vô hiệu hóa món thất bại")
      }
    } catch (error) {
      console.error("Error disabling menu item:", error)
      toast.error("Có lỗi xảy ra khi vô hiệu hóa món")
    } finally {
      setLoading(false)
    }
  }

  const handleEnableItem = async (item) => {
    try {
      setLoading(true)
      const response = await axios.put(`${url}/menuItems/enable/${item.id}`, {}, {
        headers: { Authorization: token }
      })

      if (response.data.success) {
        toast.success("Kích hoạt lại món thành công")
        fetchAllMenu()
      } else {
        toast.error(response.data.message || "Kích hoạt món thất bại")
      }
    } catch (error) {
      console.error("Error enabling menu item:", error)
      toast.error("Có lỗi xảy ra khi kích hoạt món")
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (item) => {
    setSelectedItem(item)
    setNewItem({
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId
    })
    setShowEditModal(true)
  }

  return (
    <div className="menu-management">
      <div className="menu-header">
        <h2>Quản lý thực đơn</h2>
        <div className="search-container">
          <select className="search-type-select" value={searchType} onChange={handleSearchTypeChange}>
            <option value="name">Tìm theo tên món</option>
            <option value="category">Tìm theo danh mục</option>
          </select>
          <div className="search-input-wrapper">
            <input type="text" className="search-input" placeholder={searchType === 'name' ? 'Nhập tên món cần tìm...' : 'Nhập tên danh mục...'} value={searchTerm} onChange={handleSearchChange} />
            {searchTerm && (
              <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {searchTerm && (
        <div className="search-results-info">
          Tìm thấy {filteredMenuList.length} kết quả cho "{searchTerm}"
          {searchType === 'category' && ` trong danh mục`}
        </div>
      )}

      <div className="menu-grid">
        {filteredMenuList && filteredMenuList.map(item => (
          <div className={`menu-item ${item.isDisable ? 'disabled' : ''}`} key={item.id}>
            {item.isDisable && <div className="disabled-overlay">VÔ HIỆU HÓA</div>}
            <div className="menu-item-image">
              <img src={`${url}/images/${item.imageURL}`} alt={item.name} />
            </div>
            <div className="menu-item-content">
              <h3>{item.name}</h3>
              <p className="menu-item-desc">{item.description}</p>
              <div className="menu-item-footer">
                <p className="menu-item-price">{new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(item.price)}</p>
                <p className="menu-item-category">{categoryNames[item.categoryId]}</p>
              </div>
            </div>
            <div className="menu-item-actions">
              <button className="edit-btn" onClick={() => openEditModal(item)}>
                <img src={assets.edit_icon} alt="Edit" />
              </button>
              {item.isDisable ? (
                <button className="enable-btn" onClick={() => handleEnableItem(item)} disabled={loading}>
                  <img src={assets.enable_icon || assets.check_icon} alt="Enable" />
                </button>
              ) : (
                <button className="disable-btn" onClick={() => handleDisableItem(item)} disabled={loading}>
                  <img src={assets.disable_icon || assets.cross_icon} alt="Disable" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredMenuList.length === 0 && searchTerm && (
        <div className="no-results">
          <p>Không tìm thấy món nào phù hợp với từ khóa "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')} className="clear-search-btn-large">
            Xóa bộ lọc
          </button>
        </div>
      )}

      <div className="add-button" onClick={() => setShowAddModal(true)}>
        <span>+</span>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Thêm món mới</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddItem}>
              <div className="modal-body">
                <div className="form-group add-img">
                  <p>Đăng tải ảnh</p>
                  <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" />
                  </label>
                  <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
                </div>

                <div className="form-group">
                  <label>Tên món nước</label>
                  <input type="text" name="name" value={newItem.name} onChange={handleInputChange} placeholder="Điền tên món nước" required />
                </div>

                <div className="form-group">
                  <label>Mô tả món</label>
                  <textarea name="description" value={newItem.description} onChange={handleInputChange} placeholder="Viết mô tả ở đây" rows="3" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phân loại món</label>
                    <select name="categoryId" value={newItem.categoryId} onChange={handleInputChange} required>
                      <option value="1">Cà phê</option>
                      <option value="2">Trà trái cây</option>
                      <option value="3">Macchiato & Matcha</option>
                      <option value="4">Trà sữa</option>
                      <option value="5">Đá xay</option>
                      <option value="6">Nước ép</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá món (VNĐ)</label>
                    <input type="number" name="price" value={newItem.price} onChange={handleInputChange} placeholder="Nhập giá" required />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang xử lý..." : "Thêm món"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Chỉnh sửa món</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditItem}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Tên món nước</label>
                  <input type="text" name="name" value={newItem.name} onChange={handleInputChange} placeholder="Điền tên món nước" required />
                </div>

                <div className="form-group">
                  <label>Mô tả món</label>
                  <textarea name="description" value={newItem.description} onChange={handleInputChange} placeholder="Viết mô tả ở đây" rows="3" required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phân loại món</label>
                    <select name="categoryId" value={newItem.categoryId} onChange={handleInputChange} required>
                      <option value="1">Coffee</option>
                      <option value="2">Tea</option>
                      <option value="3">Desserts</option>
                      <option value="4">Smoothies</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Giá món (VNĐ)</label>
                    <input type="number" name="price" value={newItem.price} onChange={handleInputChange} placeholder="Nhập giá" required />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Đang xử lý..." : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu