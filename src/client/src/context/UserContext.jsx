// UserContext provides a React context for user profile data and loading state
import { createContext, useContext } from "react";
export const UserContext = createContext(null);

export function useUser() {
    return useContext(UserContext);
}