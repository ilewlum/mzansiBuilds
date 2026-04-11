
import { useEffect, useState , useCallback} from "react";
import { ProjectContext } from "./ProjectContext";
import { getProjects, addProject as addProjectApi} from "../services/project-api";

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error, setError] = useState(null);


    const refreshProjects = useCallback(async () => {
        setLoadingProjects(true);
        setError(null);
        try {
            const data = await getProjects();
            console.log(data);
            setProjects(data);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError(err);
        } finally {
            setLoadingProjects(false);
        }
    }, []);

    useEffect (() => { 
        refreshProjects(); } , 
        [refreshProjects]
    );

    async function addProject(
            userId, 
            title, 
            description, 
            support, 
            stack, 
            stage, 
            visibility, 
            status) 
        {
        const newProject = await addProjectApi(
                userId, 
                title, 
                description, 
                support, 
                stack, 
                stage, 
                visibility, 
                status
        );

        await refreshProjects();
        return newProject;
    }

    const activeProjects    = projects.filter(p => p.status === "ACTIVE");
    const completedProjects = projects.filter(p => p.status === "COMPLETE");

    return (
        <ProjectContext.Provider value={{
            projects,
            activeProjects,
            completedProjects,
            loadingProjects,
            error,
            addProject,
            refreshProjects,
        }}>
            {children}
        </ProjectContext.Provider>
    );
}