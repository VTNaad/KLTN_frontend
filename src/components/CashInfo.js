import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/CashInfo.css";
import { FaCoins, FaMedal, FaQuestionCircle, FaArrowRight } from "react-icons/fa";

const CashInfo = () => {
  const [cashData, setCashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCashInfo = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?._id;
        if (userId) {
          const response = await fetch(`${apiUrl}/cash/${userId}`);
          const data = await response.json();
          if (data.success) {
            setCashData(data.data);
          } else {
            setError("Không thể tải thông tin ví Cash");
          }
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin ví Cash");
      } finally {
        setLoading(false);
      }
    };

    fetchCashInfo();
  }, [apiUrl]);

  if (loading) return <div className="cash-loading">Đang tải thông tin ví...</div>;
  if (error) return <div className="cash-error">{error}</div>;

  const getLevelInfo = (level) => {
    switch (level) {
      case "bronze":
        return { name: "Đồng", color: "#cd7f32", bonus: "0%", next: "5 đơn" };
      case "silver":
        return { name: "Bạc", color: "#c0c0c0", bonus: "10%", next: "10 đơn" };
      case "gold":
        return { name: "Vàng", color: "#ffd700", bonus: "20%", next: "15 đơn" };
      case "diamond":
        return { name: "Kim cương", color: "#b9f2ff", bonus: "50%", next: "Đã đạt cấp cao nhất" };
      default:
        return { name: "Đồng", color: "#cd7f32", bonus: "0%", next: "5 đơn" };
    }
  };

  const levelInfo = getLevelInfo(cashData?.level || "bronze");

  return (
    <div className="cash-info-container">

      {/* Balance Card */}
      <div className="cash-balance-card" style={{ borderColor: levelInfo.color }}>
        <div className="balance-info">
          <h3>Số dư hiện tại</h3>
          <h2>{cashData?.money?.toLocaleString()}₫</h2>
        </div>
        <div className="level-badge" style={{ backgroundColor: levelInfo.color }}>
          {levelInfo.name}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <h3>Tiến trình thăng hạng</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{
              width: `${Math.min(100, (cashData?.totalSpent || 0) * 6.66)}%`,
              backgroundColor: levelInfo.color
            }}
          ></div>
        </div>
        <p>Đã tích lũy: {cashData?.totalSpent || 0} đơn (Cần {levelInfo.next} để lên hạng tiếp theo)</p>
      </div>

      {/* Level Benefits */}
      <div className="benefits-section">
        <h3><FaMedal /> Ưu đãi theo hạng</h3>
        <div className="benefits-grid">
          <div className={`benefit-tier ${cashData?.level === 'bronze' ? 'active' : ''}`}>
            <h4 style={{ color: '#cd7f32' }}>Đồng</h4>
            <p>Cashback: 0%</p>
            <p>Từ 0 đơn</p>
          </div>
          <div className={`benefit-tier ${cashData?.level === 'silver' ? 'active' : ''}`}>
            <h4 style={{ color: '#c0c0c0' }}>Bạc</h4>
            <p>Cashback: +10%</p>
            <p>Từ 5 đơn</p>
          </div>
          <div className={`benefit-tier ${cashData?.level === 'gold' ? 'active' : ''}`}>
            <h4 style={{ color: '#ffd700' }}>Vàng</h4>
            <p>Cashback: +20%</p>
            <p>Từ 10 đơn</p>
          </div>
          <div className={`benefit-tier ${cashData?.level === 'diamond' ? 'active' : ''}`}>
            <h4 style={{ color: '#b9f2ff' }}>Kim cương</h4>
            <p>Cashback: +50%</p>
            <p>Từ 15 đơn</p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="how-to-use">
        <h3><FaQuestionCircle /> Cách sử dụng ví Cash</h3>
        <div className="usage-steps">
          <div className="usage-step">
            <div className="step-number">1</div>
            <p>Khi thanh toán, chọn "Sử dụng ví Cash"</p>
          </div>
          <div className="usage-step">
            <div className="step-number">2</div>
            <p>Chọn số tiền muốn sử dụng (tối đa 200,000₫/đơn)</p>
          </div>
          <div className="usage-step">
            <div className="step-number">3</div>
            <p>Hoàn tất thanh toán phần còn lại</p>
          </div>
        </div>
        <button className="use-cash-btn" onClick={() => navigate('/')}>
          Đặt phòng ngay <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default CashInfo;