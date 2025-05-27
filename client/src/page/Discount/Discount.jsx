import React, { useState } from 'react'
import './Discount.css'
import Foot from '../../components/Foot/Foot'
import { assets } from '../../assets/assets'

const promotions = [
  {
    id: 1,
    image: assets.discount1,
    alt: "Coffee",
    title: "Mua 1 tặng 1 vào thứ 2",
    details: "Áp dụng cho tất cả các loại cà phê. Không giới hạn số lượng. Chỉ áp dụng tại cửa hàng từ 7h-17h thứ 2.",
  },
  {
    id: 2,
    image: assets.discount2,
    alt: "Cake and Coffee",
    title: "Giảm 30% combo bánh + cà phê",
    details: "Áp dụng từ 14h - 17h mỗi ngày. Không áp dụng đồng thời với chương trình khác.",
  },
  {
    id: 3,
    image: assets.discount3,
    alt: "Gift",
    title: "Tích điểm đổi quà",
    details: "Mỗi hóa đơn 20.000đ = 1 điểm. Đổi quà hấp dẫn vào cuối tháng tại quầy dịch vụ.",
  },
]

const Discount = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleDetails = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <>
      <div className="discount-container">
        <h1 className="discount-title">🎉 Các chương trình khuyến mãi</h1>
        <img className="discount-banner" src={assets.discount_banner} alt="Khuyến mãi" />

        <div className="promotion-list">
        {promotions.map((promo, index) => (
  <div key={index} className="promotion-item">
    <div className="promotion-title" onClick={() => toggleDetails(index)}>
      <img src={promo.image} alt={promo.alt} className="promo-icon" />
      <span>{promo.title}</span>
    </div>
    {activeIndex === index && (
      <div className="promotion-details">{promo.details}</div>
    )}
  </div>
))}
        </div>
      </div>

      <Foot />
    </>
  )
}

export default Discount