// Provides user profile data and loading state to the app via context
import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { getCurrentUser, findUserProfile, handleLogout } from "../services/user-api";

export function UserProvider({ children }) {
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Load user profile on mount
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

    // Function to refresh profile data, can be called after updates
    async function refreshProfile() {
        try {
            const { userId } = await getCurrentUser();
            const profile = await findUserProfile(userId);
            setUserProfile(profile);
        } catch {
            setUserProfile(null);
        }
    }

    // Logs the user out and clears profile state
    async function logout() {
        await handleLogout();
        setUserProfile(null);
        window.location.href = "/";
    }

    return (
        <UserContext.Provider value={{ userProfile, loadingProfile, refreshProfile, logout }}>
            {children}
        </UserContext.Provider>
    );
}