import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./UserProfile.css";

const UserProfile = () => {
  const { token, url, userProfile, setUserProfile } = useContext(StoreContext);
  const navigate = useNavigate();

  // Redirect nếu chưa đăng nhập
  if (!token) {
    navigate("/");
    return null;
  }

  return (
    <div className="user-profile">
      <h1 className="user-profile-title">Trang cá nhân</h1>
      <BasicInfoForm token={token} url={url} userProfile={userProfile} setUserProfile={setUserProfile} />
      <PasswordForm token={token} url={url} />
      <AddressForm token={token} url={url} userProfile={userProfile} setUserProfile={setUserProfile} />
    </div>
  );
};

/* ─── BasicInfoForm ─────────────────────────────────────────────────────── */
const BasicInfoForm = ({ token, url, userProfile, setUserProfile }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Pre-fill khi userProfile load xong
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name || "");
      setEmail(userProfile.email || "");
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.put(
        url + "/api/user/profile",
        { name, email },
        { headers: { token } }
      );
      if (res.data?.success) {
        setUserProfile(res.data.data);
        setSuccess("Cập nhật thông tin thành công!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.data?.message || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="profile-section">
      <h2 className="profile-section-title">Thông tin cơ bản</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-field">
          <label>Họ tên</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
            required
          />
        </div>
        <div className="profile-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>
        {success && <p className="profile-msg profile-msg--success">{success}</p>}
        {error && <p className="profile-msg profile-msg--error">{error}</p>}
        <button type="submit" className="profile-btn" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thông tin"}
        </button>
      </form>
    </section>
  );
};

/* ─── PasswordForm ──────────────────────────────────────────────────────── */
const PasswordForm = ({ token, url }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation: mật khẩu mới phải khớp xác nhận
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        url + "/api/user/password",
        { currentPassword, newPassword },
        { headers: { token } }
      );
      if (res.data?.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccess("Đổi mật khẩu thành công!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.data?.message || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="profile-section">
      <h2 className="profile-section-title">Đổi mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-field">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
            required
          />
        </div>
        <div className="profile-field">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ít nhất 8 ký tự"
            required
          />
        </div>
        <div className="profile-field">
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            required
          />
        </div>
        {success && <p className="profile-msg profile-msg--success">{success}</p>}
        {error && <p className="profile-msg profile-msg--error">{error}</p>}
        <button type="submit" className="profile-btn" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </section>
  );
};

/* ─── AddressForm ───────────────────────────────────────────────────────── */
const AddressForm = ({ token, url, userProfile, setUserProfile }) => {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Pre-fill từ defaultAddress
  useEffect(() => {
    const addr = userProfile?.defaultAddress;
    if (addr) {
      setStreet(addr.street || "");
      setCity(addr.city || "");
      setState(addr.state || "");
      setZipcode(addr.zipcode || "");
      setCountry(addr.country || "");
    }
  }, [userProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.put(
        url + "/api/user/profile",
        { defaultAddress: { street, city, state, zipcode, country } },
        { headers: { token } }
      );
      if (res.data?.success) {
        setUserProfile(res.data.data);
        setSuccess("Lưu địa chỉ thành công!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.data?.message || "Có lỗi xảy ra");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="profile-section">
      <h2 className="profile-section-title">Địa chỉ giao hàng mặc định</h2>
      <form onSubmit={handleSubmit}>
        <div className="profile-field">
          <label>Địa chỉ</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Số nhà, tên đường"
          />
        </div>
        <div className="profile-fields-row">
          <div className="profile-field">
            <label>Thành phố</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Thành phố"
            />
          </div>
          <div className="profile-field">
            <label>Tỉnh/Thành</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Tỉnh/Thành"
            />
          </div>
        </div>
        <div className="profile-fields-row">
          <div className="profile-field">
            <label>Mã bưu điện</label>
            <input
              type="text"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              placeholder="Mã bưu điện"
            />
          </div>
          <div className="profile-field">
            <label>Quốc gia</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Quốc gia"
            />
          </div>
        </div>
        {success && <p className="profile-msg profile-msg--success">{success}</p>}
        {error && <p className="profile-msg profile-msg--error">{error}</p>}
        <button type="submit" className="profile-btn" disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu địa chỉ"}
        </button>
      </form>
    </section>
  );
};

export default UserProfile;
