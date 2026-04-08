import { Route, Routes, useLocation} from "react-router-dom";
import Login from "./pages/Login-page.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}