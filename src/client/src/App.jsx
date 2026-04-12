import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import { UserProvider } from "./context/UserProvider.jsx";
import { ProjectProvider } from "./context/ProjectProvider.jsx";
import Login from "./pages/Login-page.jsx";
import Feed from "./pages/Feed-page.jsx";
import ProjectsPage from "./pages/Project-page.jsx";
import Navbar from "./components/Navbar.jsx";
import { getCurrentUser } from "./services/user-api.js";

function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { userId } = await getCurrentUser();
      setAuthenticated(!!userId);
      setChecking(false);
    }
    checkAuth();
  }, []);

  if (checking) return null;
  if (!authenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <UserProvider>
      <ProjectProvider>
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Route>
        </Routes>
      </ProjectProvider>
    </UserProvider>
  );
}