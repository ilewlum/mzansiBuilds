// AvatarDrawer.jsx
import "./AvatarDrawer.css";
import { useUser } from "../context/UserContext";

export default function AvatarDrawer({ open, onClose }) {
  const { logout } = useUser(); // assume you have this

  return (
    <div className={`avatar-drawer ${open ? "open" : ""}`}>
      <div className="avatar-drawer-content">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h3>Account</h3>

        <button 
          className="logout-btn"
          onClick={() => {
            logout();
            onClose();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}