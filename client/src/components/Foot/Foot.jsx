import './Foot.css'

const Foot = () => {
  return (
    <footer id="footer">
      <div className="footer-content">
        
        <section className="footer-section">
          <h2>📍 Liên hệ</h2>
          <div className="contact-info">
            <div className="info-item">
              <span>🏠</span>
              <div>
                <strong>Địa chỉ</strong>
                <p>Thu Duc, Ho Chi Minh</p>
              </div>
            </div>
            <div className="info-item">
              <span>📞</span>
              <div>
                <strong>Điện thoại</strong>
                <p><a href="tel:1111111111">1111111111</a></p>
              </div>
            </div>
            <div className="info-item">
              <span>✉️</span>
              <div>
                <strong>Email</strong>
                <p><a href="mailto:2004@gmail.com">2004@gmail.com</a></p>
              </div>
            </div>
          </div>
          <div className="social-links">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">🐦</a>
          </div>
        </section>
            
        <section className="footer-section">
          <h2>🗺️ Tìm chúng tôi</h2>
          <div className="map-container">
            <iframe 
              id="gmap_canvas" 
              src="https://maps.google.com/maps?q=200%20degree%2016%20flying%20horse%20walk&t=&z=15&ie=UTF8&iwloc=&output=embed" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0"
              title="Coffee Shop Location"
            ></iframe>
          </div>
        </section>
        
        <section className="footer-section">
          <h2>🕐 Giờ mở cửa</h2>
          <ul className="hours-list">
            <li className="hours-item">
              <span className="day">Thứ 2-6</span>
              <span className="time">07:30 - 20:00</span>
            </li>
            <li className="hours-item">
              <span className="day">Thứ 7</span>
              <span className="time">08:00 - 19:00</span>
            </li>
            <li className="hours-item">
              <span className="day">Chủ nhật</span>
              <span className="time">09:30 - 18:00</span>
            </li>
          </ul>
          <div className="special-note">
            <p>☕ Cà phê tươi rang mỗi ngày!</p>
          </div>
        </section>
        
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Coffee Shop. All rights reserved.</p>
        <p className="tagline">Crafted with ❤️ and lots of ☕</p>
      </div>
    </footer>
  )
}

export default Foot