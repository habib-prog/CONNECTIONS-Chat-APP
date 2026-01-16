import React, { useState } from "react";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import { auth, db } from "../../Database";
import "react-toastify/dist/ReactToastify.css";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      // check kora email verified kina
      if (!res.user.emailVerified) {
        toast.warn("Please verify your email! Check your inbox.");
        await auth.signOut();
        return;
      } else {
        toast.success("Login Successful!");
      }
    } catch (err) {
      // Password ba Email bhul hole ekhane asbe
      if (err.code === "auth/invalid-credential") {
        toast.error("Invalid email or password.");
      } else {
        toast.error(err.message);
      }
    }
  };
  // Cloudinary Utility
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Chat_app");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlgwrts8q/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      // 1️Create Firebase User
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // 2️Send Email Verification
      await sendEmailVerification(res.user);

      // 3️ Upload Avatar to Cloudinary (if exists)
      const avatarURL = avatar.file
        ? await uploadToCloudinary(avatar.file)
        : "";

      // 4️ Update Firebase Auth user object
      await updateProfile(res.user, {
        displayName: username,
        photoURL: avatarURL,
      });

      // 5️Save user in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        username,
        email,
        avatar: avatarURL,
        blocked: [],
        createdAt: new Date(),
      });

      // 6️Initialize User Chats
      await setDoc(doc(db, "userschats", res.user.uid), { chats: [] });
      await auth.signOut();

      // 7️Toasts
      toast.success("Account created successfully!");
      toast.warning("Email verification link sent!");

      // 8️Clear avatar state
      setAvatar({ file: null, url: "" });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="bottom-right" />

      {/* Login Section */}
      <div className="auth-section">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="Email" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>

      <div className="divider">
        <span>OR</span>
      </div>

      {/* Signup Section */}
      <div className="auth-section">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Avatar</label>
            <div className="avatar-upload">
              <label htmlFor="avatar-input" className="avatar-label">
                {avatar.url ? (
                  <img
                    src={avatar.url}
                    alt="Avatar"
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
            <label>Username</label>
            <input
              name="username"
              type="text"
              placeholder="Pick a username"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="Email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
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
