import React from "react";
import "../css/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Về chúng tôi</h4>
          <p>Website hỗ trợ đặt vé máy bay và khách sạn nhanh chóng, thuận tiện, thân thiện với người dùng.</p>
        </div>
        <div className="footer-section">
          <h4>Liên hệ</h4>
          <p>Email: hovanhuynhhop@gmail.com</p>
          <p>Hotline: 0987624512</p>
        </div>
        <div className="footer-section">
          <h4>Theo dõi chúng tôi</h4>
          <p>Facebook | Instagram | Twitter</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 Booking App. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
