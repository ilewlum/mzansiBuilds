// Navbar component that displays the navigation bar with links to other pages

import { FaHome, FaFolder, FaBell, FaHandshake } from "react-icons/fa";
import "./Navbar.css";
import { useUser } from "../context/UserContext";

export default function Navbar() 
{ 
    const { userProfile } = useUser();
    return ( 
        <nav className="navbar">  
            {/* <Link to="/" className="navbar-brand">login</Link>*/}
            <div className="brand">MzansiBuilds</div>
            <button className="nav-btn">
                <FaHome />Feed
            </button>
            <button className="nav-btn">
                <FaFolder />Projects
            </button>
            <button className="nav-btn">
                <FaHandshake /> Collaborate
            </button> 
            <button className="nav-btn">
                <FaBell />Notifications
            </button> 
            <div className="avatar">{avatarHelper(userProfile?.username)}</div>  
        </nav> 
    ); 
} 

function avatarHelper(str) {
  return str ? str[0] : "";
}