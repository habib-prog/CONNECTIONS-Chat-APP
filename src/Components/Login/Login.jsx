import React, { useState } from "react";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    toast.success("Login submitted");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup submitted", avatar);
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      {/* Login Section */}
      <div className="auth-section">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="divider">
        <span>OR</span>
      </div>

      {/* Signup Section */}
      <div className="auth-section">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Avatar</label>
            <div className="avatar-upload">
              <label htmlFor="avatar-input" className="avatar-label">
                {avatar.url ? (
                  <img
                    src={avatar.url}
                    alt="Avatar Preview"
                    className="avatar-preview"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <span>📷</span>
                    <p>Upload Photo</p>
                  </div>
                )}
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn-primary">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
