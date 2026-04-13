import { FaHome, FaFolder, FaBell, FaHandshake } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import { useUser } from "../context/UserContext";
import { useProject } from "../context/ProjectContext";
import NotificationDrawer from "./NotificationDrawer";
import AvatarDrawer from "./AvatarDrawer";

export default function Navbar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const { userProfile } = useUser();
    const { userProjects, sentCollaborations } = useProject();
    const navigate = useNavigate();

    // Bell shows count of:
    // - PENDING requests on user's own projects (incoming, needs response)
    // - ACCEPTED/REJECTED on requests user sent (responses they haven't seen)
    const notificationCount = userProjects
        .flatMap(p => p.collaborations ?? [])
        .filter(c =>
            (c.status === "PENDING" && c.requestingUserId !== userProfile?.userId) ||
            ((c.status === "ACCEPTED" || c.status === "REJECTED") && c.requestingUserId === userProfile?.userId)
        ).length +
        sentCollaborations.filter(c => c.status === "ACCEPTED" || c.status === "REJECTED")
        .length;

    return (
        <>
            <nav className="navbar">
                <div className="brand">MzansiBuilds</div>
                <button className="nav-btn" onClick={() => navigate("/feed")}>
                    <FaHome />Feed
                </button>
                <button className="nav-btn" onClick={() => navigate("/projects")}>
                    <FaFolder />Projects
                </button>
                <button className="nav-btn" onClick={() => setDrawerOpen(true)}>
                    <span className="bell-wrap">
                        <FaBell />
                        {notificationCount > 0 && (
                            <span className="bell-badge">
                                {notificationCount > 99 ? "99+" : notificationCount}
                            </span>
                        )}
                    </span>
                </button>
                <div
                    className="user-avatar"
                    onClick={() => setAvatarOpen(true)}
                >
                    {avatarHelper(userProfile?.username)}
                </div>
            </nav>

            <NotificationDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                projects={userProjects}
            />
            <AvatarDrawer
                open={avatarOpen}
                onClose={() => setAvatarOpen(false)}
            />
        </>
    );
}

function avatarHelper(str) {
    return str ? str[0] : "";
}