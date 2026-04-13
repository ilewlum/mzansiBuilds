// Navbar component that displays the navigation bar with links to other pages

import { FaHome, FaFolder, FaBell, FaHandshake } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import { useUser } from "../context/UserContext";
import { useProject } from "../context/ProjectContext";
import NotificationDrawer from "./NotificationDrawer";
import AvatarDrawer from "./AvatarDrawer";

export default function Navbar() 
{ 
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const { userProfile } = useUser();
    const { activeProjects} = useProject()
    const navigate = useNavigate();

    const userProjects = activeProjects

    const pendingCount = userProjects
        .flatMap(p => p.collaborations ?? [])
        .filter(c => c.status === "PENDING")
        .length;

    return ( 
        <>
            <nav className="navbar">  
                {/* <Link to="/" className="navbar-brand">login</Link>*/}
                <div className="brand">MzansiBuilds</div>
                <button className="nav-btn" onClick={() => navigate("/feed")} >
                    <FaHome />Feed
                </button>
                <button className="nav-btn" onClick={() => navigate("/projects")}  >
                    <FaFolder />Projects
                </button>
                <button className="nav-btn" onClick={() => setDrawerOpen(true)} >
                    <span className="bell-wrap">
                        <FaBell />
                        {pendingCount > 0 && (
                            <span className="bell-badge">{pendingCount > 99 ? "99+" : pendingCount}
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