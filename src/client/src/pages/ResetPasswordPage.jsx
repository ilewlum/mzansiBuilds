import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                setReady(true);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        if (password !== confirm) {
            setError("Passwords don't match");
            return;
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setError(error.message);
        } else {
            setDone(true);
            setTimeout(() => navigate("/"), 2000);
        }
    }

    if (done) return <p>Password updated! Redirecting to login...</p>;
    if (!ready) return <p>Verifying your reset link...</p>;

    return (
        <div className="login-root">
            <div className="login-card">
                <div className="brand">MzansiBuilds</div>
                <div className="page-title">Reset Password</div>
                <form onSubmit={handleSubmit}>
                    <div className="details">
                        <label className="field-label">New Password</label>
                        <input
                            className="field-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label className="field-label">Confirm Password</label>
                        <input
                            className="field-input"
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <div className="btn-row">
                        <button className="btn" type="submit">Update Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
}