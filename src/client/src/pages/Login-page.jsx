import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import "./Login-page.css";
import { handleRegistration } from '../services/user-api.js';
import { useUser } from "../context/UserContext.jsx";
import ForgotPasswordModal from "../components/ForgotPasswordModal.jsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgot, setShowForgot] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const register = async (e) => {
        e.preventDefault();
        await handleRegistration(email, password);
    }

    const handleLoginClick = async (e) => {
        e.preventDefault();
        await login(email, password);
        navigate("/feed");
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

                <span className="forgot" onClick={() => setShowForgot(true)}>forgot?</span>

                <div className="btn-row">
                    <button className="btn" onClick={handleLoginClick}>Login</button>
                    <button className="btn" onClick={register}>Register</button>
                </div>
            </div>

            {/* Forgot password modal */}
            {showForgot && (
                <ForgotPasswordModal onClose={() => setShowForgot(false)} />
            )}
        </div>
    );
}