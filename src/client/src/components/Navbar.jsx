// Navbar component that displays the navigation bar with links to other pages

import { FaHome, FaFolder, FaBell, FaHandshake } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import { useUser } from "../context/UserContext";
import { useProject } from "../context/ProjectContext";
import NotificationDrawer from "./NotificationDrawer";

export default function Navbar() 
{ 
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { userProfile } = useUser();
    const { userProjects} = useProject()
    const navigate = useNavigate();
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
                    <FaBell />Notifications
                </button> 
                <div className="avatar">{avatarHelper(userProfile?.username)}</div>  
            </nav> 

            <NotificationDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                projects={userProjects}
            />
        </>
        

        
    ); 
} 

function avatarHelper(str) {
  return str ? str[0] : "";
}