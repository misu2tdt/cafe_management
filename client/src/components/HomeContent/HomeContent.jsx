import React from 'react'
import './HomeContent.css'

const HomeContent = () => {
  return (
    <div className='home-container'>
      <section className='hero-section'>
        <div className='hero-content'>
          <h1 className='hero-title'>Chào mừng đến với Kohee</h1>
          <p className='hero-subtitle'>Nơi mỗi tách cà phê kể một câu chuyện</p>
          <div className='hero-divider'></div>
        </div>
      </section>

      <section className='news-section'>
        <div className='section-content'>
          <div className='news-badge'>TIN MỚI</div>
          <h2 className='section-title'>Tin tức mới nhất</h2>
          <p className='news-content'>
            Hai loại cà phê mới đặc biệt đã có mặt tại quán! Chúng tôi bắt đầu rang chúng từ thứ Sáu. 
            Hãy đến và thưởng thức hương vị độc đáo mà chúng tôi đã tỉ mỉ chọn lọc.
          </p>
        </div>
      </section>

      <section className='story-section'>
        <div className='section-content'>
          <div className='story-grid'>
            <div className='story-text'>
              <h2 className='section-title'>Câu chuyện của chúng tôi</h2>
              <p className='story-description'>
                Từ năm 2020, Coffee Shop đã trở thành điểm đến yêu thích của những người yêu cà phê 
                tại Thủ Đức. Chúng tôi tự hào về việc rang xay cà phê tươi mỗi ngày, tạo nên những 
                tách cà phê hoàn hảo với hương vị đậm đà và thơm ngon.
              </p>
              <p className='story-description'>
                Với không gian ấm cúng và đội ngũ barista chuyên nghiệp, chúng tôi cam kết mang đến 
                cho bạn trải nghiệm cà phê tuyệt vời nhất. Mỗi hạt cà phê được chúng tôi chọn lọc 
                kỹ càng từ những vùng trồng cà phê nổi tiếng.
              </p>
            </div>
            <div className='story-image'>
              <div className='coffee-icon'>☕</div>
              <p className='coffee-text'>Passion for Coffee</p>
            </div>
          </div>
        </div>
      </section>

      <section className='values-section'>
        <div className='section-content'>
          <h2 className='section-title'>Giá trị cốt lõi</h2>
          <div className='values-grid'>
            <div className='value-card'>
              <div className='value-icon'>🌱</div>
              <h3 className='value-title'>Bền vững</h3>
              <p className='value-description'>
                Chúng tôi cam kết sử dụng cà phê organic và hỗ trợ nông dân địa phương
              </p>
            </div>
            <div className='value-card'>
              <div className='value-icon'>👥</div>
              <h3 className='value-title'>Cộng đồng</h3>
              <p className='value-description'>
                Tạo ra không gian gắn kết, nơi mọi người có thể thư giãn và kết nối
              </p>
            </div>
            <div className='value-card'>
              <div className='value-icon'>⭐</div>
              <h3 className='value-title'>Chất lượng</h3>
              <p className='value-description'>
                Từng tách cà phê đều được pha chế với sự tỉ mỉ và đam mê
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='experience-section'>
        <div className='section-content'>
          <h2 className='section-title'>Trải nghiệm tại Coffee Shop</h2>
          <div className='experience-grid'>
            <div className='experience-item'>
              <h3>Không gian ấm cúng</h3>
              <p>Thiết kế hiện đại kết hợp với nét truyền thống, tạo không gian lý tưởng cho việc làm việc hoặc gặp gỡ bạn bè.</p>
            </div>
            <div className='experience-item'>
              <h3>Cà phê tươi rang</h3>
              <p>Mỗi ngày chúng tôi rang cà phê tươi, đảm bảo hương vị luôn đậm đà và thơm ngon nhất.</p>
            </div>
            <div className='experience-item'>
              <h3>Dịch vụ tận tâm</h3>
              <p>Đội ngũ nhân viên chuyên nghiệp, luôn sẵn sàng tư vấn và phục vụ bạn một cách tốt nhất.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeContent