// main application component that sets up routing and context for the app
import { Route, Routes, useLocation} from "react-router-dom";
import { UserProvider } from "./context/UserProvider.jsx";
import { ProjectProvider } from "./context/ProjectProvider.jsx";
import Login from "./pages/Login-page.jsx";
import Feed from "./pages/Feed-page.jsx";
import ProjectsPage from "./pages/Project-page.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <UserProvider>
      <ProjectProvider>

        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>

      </ProjectProvider>
    </UserProvider>
  );
}