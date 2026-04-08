import { useState } from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import "./Login-page.css";
import {handleRegistration, handleLogin} from '../services/user-api.js'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async (e) => {
        e.preventDefault() // stop page refresh
        await handleRegistration(email, password)
    }

    const login = async (e) => {
        e.preventDefault() // stop page refresh
        await handleLogin(email, password)
    }

    return (
    <div className="login-root">
        <div className="login-card">

            <div className="brand">MzansiBuilds</div>
            <div className="page-title">Login</div>

            <div className="details">
                <label className="field-label">Email</label>
                <input
                className="field-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <label className="field-label">Password</label>
                <input
                className="field-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <span className="forgot">forgot?</span>

            <div className="btn-row">
                <button className="btn" onClick={login}>Login</button>
                <button className="btn" onClick={register}> Register </button>
            </div>

            <div className="social-divider">Sign in with</div>

            <div className="social-row">
                <button className="social-btn">
                    <FaGoogle /> Sign in with Google
                </button>

                <button className="social-btn">
                    <FaGithub /> Sign in with GitHub
                </button>
            </div>
        </div>
    </div>
  );
}