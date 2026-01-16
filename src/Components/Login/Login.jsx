import React, { useState } from "react";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from "../../Database";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      // Add a new document in collection "cities"
      await setDoc(doc(db, "users", res.user.uid), {
        email,
        id: res.user.uid,
        blocked: [],
      });
      toast.success("Sign up completed");
    } catch (err) {
      toast.error(err);
    }
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
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
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
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />
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
