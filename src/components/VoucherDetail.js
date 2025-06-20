import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTag, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../css/VoucherDetail.css";

const VoucherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await fetch(`${apiUrl}/vouchers/${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Không thể tải thông tin voucher");
        }

        setVoucher(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [id, apiUrl]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleApplyVoucher = () => {
    if (!voucher?.code) return;

    navigator.clipboard.writeText(voucher.code)
      .then(() => {
        alert(`Voucher ${voucher.code} đã được sao chép vào CLIPBOARD !`);
      })
      .catch((err) => {
        console.error("Lỗi khi sao chép:", err);
        alert("Không thể sao chép mã voucher.");
      });
  };
  if (loading) {
    return (
      <div className="voucher-loading">
        <div className="spinner"></div>
        <p>Đang tải thông tin voucher...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="voucher-error">
        <p>{error}</p>
        <button onClick={handleBack}>Quay lại</button>
      </div>
    );
  }

  if (!voucher) {
    return (
      <div className="voucher-not-found">
        <p>Không tìm thấy voucher</p>
        <button onClick={handleBack}>Quay lại</button>
      </div>
    );
  }

  // Tính toán ngày hết hạn
  const expiryDate = new Date(voucher.expiresAt);
  const isExpired = expiryDate < new Date();

  return (
    <div className="voucher-detail-container">
      {/* <button className="back-button" onClick={handleBack}>
        <FaArrowLeft /> Quay lại
      </button> */}

      <div className="voucher-card">
        <div className="voucher-image-container">
          {voucher.image ? (
            <img src={voucher.image} alt={voucher.code} className="voucher-image" />
          ) : (
            <div className="voucher-image-placeholder">
              <FaTag size={50} color="#fff" />
            </div>
          )}
          <div className="voucher-discount-badge">
            {voucher.discountType === "percent" ? (
              <span>-{voucher.discountValue}%</span>
            ) : (
              <span>-{voucher.discountValue.toLocaleString()}₫</span>
            )}
          </div>
        </div>

        <div className="voucher-info">
          <h1 className="voucher-title">{voucher.code}</h1>
          
          <div className="voucher-meta">
            <div className="meta-item">
              <FaCalendarAlt className="meta-icon" />
              <span>Hết hạn: {expiryDate.toLocaleDateString()}</span>
            </div>
            
            <div className="meta-item">
              {isExpired ? (
                <>
                  <FaTimesCircle className="meta-icon expired" />
                  <span className="expired">Đã hết hạn</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="meta-icon active" />
                  <span className="active">Còn hiệu lực</span>
                </>
              )}
            </div>
          </div>

          <div className="voucher-description">
            <h3>Mô tả voucher</h3>
            <ul>
              <li>
                <strong>Loại giảm giá:</strong> {voucher.discountType === "percent" ? "Phần trăm" : "Số tiền cố định"}
              </li>
              <li>
                <strong>Giá trị:</strong> {voucher.discountType === "percent" 
                  ? `${voucher.discountValue}%` 
                  : `${voucher.discountValue.toLocaleString()}₫`}
              </li>
              <li>
                <strong>Áp dụng cho:</strong> {voucher.applyTo === "hotel" ? "Khách sạn" 
                  : voucher.applyTo === "flight" ? "Vé máy bay" 
                  : "Tour du lịch"}
              </li>
              <li>
                <strong>Điều kiện sử dụng:</strong> {voucher.serviceId 
                  ? "Chỉ áp dụng cho dịch vụ cụ thể" 
                  : "Áp dụng cho tất cả dịch vụ loại này"}
              </li>
            </ul>
          </div>

          <div className="voucher-terms">
            <h3>Điều khoản và điều kiện</h3>
            <ul>
              <li>Voucher có hiệu lực đến ngày {expiryDate.toLocaleDateString()}</li>
              <li>Mỗi khách hàng chỉ được sử dụng 1 lần</li>
              <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác</li>
              <li>Không có giá trị quy đổi thành tiền mặt</li>
            </ul>
          </div>

          <button 
            className="apply-button" 
            onClick={handleApplyVoucher}
            disabled={isExpired}
          >
            {isExpired ? "Voucher đã hết hạn" : "Áp dụng voucher này"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetail;