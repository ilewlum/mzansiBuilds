// main application component that sets up routing and context for the app
import { Route, Routes, useLocation} from "react-router-dom";
import { UserProvider } from "./context/UserProvider.jsx";
import Login from "./pages/Login-page.jsx";
import Feed from "./pages/Feed-page.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <UserProvider>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </UserProvider>
  );
}