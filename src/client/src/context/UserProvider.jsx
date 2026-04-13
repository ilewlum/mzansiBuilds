// UserProvider.jsx - Provides user profile and authentication state to the app
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { getCurrentUser, findUserProfile, handleLogout, handleLogin } from "../services/user-api";

// 
export function UserProvider({ children }) {
    // 
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // On mount, check if user is logged in and load their profile
    useEffect(() => {
        async function loadProfile() {
            try {
                const { userId } = await getCurrentUser();
                if (!userId) return;

                const profile = await findUserProfile(userId);
                setUserProfile(profile);
            } catch {
                setUserProfile(null);
            } finally {
                setLoadingProfile(false);
            }
        }
        loadProfile();
    }, []);

    // Function to refresh the user profile (e.g., after login or profile update)
    async function refreshProfile() {
        try {
            const { userId } = await getCurrentUser();
            const profile = await findUserProfile(userId);
            setUserProfile(profile);
        } catch {
            setUserProfile(null);
        }
    }

    // Handles login and immediately loads the user profile into context
    async function login(email, password) {
        await handleLogin(email, password);
        await refreshProfile();
    }

    // Handles logout and clears the user profile from context
    async function logout() {
        await handleLogout();
        setUserProfile(null);
        window.location.href = "/";
    }

    return (
        <UserContext.Provider value={{ userProfile, loadingProfile, refreshProfile, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}