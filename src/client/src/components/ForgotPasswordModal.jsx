import { useState } from "react";
import { handleForgotPassword } from "../services/user-api.js";
import "./ForgotPasswordModal.css"

export default function ForgotPasswordModal({ onClose }) {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await handleForgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                {submitted ? (
                    <>
                        <div className="modal-title">Check your email</div>
                        <p className="modal-body">
                            If an account exists for <strong>{email}</strong>, a reset link has been sent.
                        </p>
                        <button type="button" className="btn" onClick={onClose}>Done</button>
                    </>
                ) : (
                    <>
                        <div className="modal-title">Forgot password</div>
                        <p className="modal-body">Enter your email and we'll send you a reset link.</p>
                        <form onSubmit={handleSubmit}>
                            <label className="field-label">Email</label>
                            <input
                                className="field-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoFocus
                                required
                            />
                            {error && <p className="error-text">{error}</p>}
                            <button className="btn" type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send reset link"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}