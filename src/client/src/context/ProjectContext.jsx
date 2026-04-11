import { createContext, useContext } from "react";

export const ProjectContext = createContext(null);

export function useProject() {
    return useContext(ProjectContext);
}