
import { useEffect, useState , useCallback} from "react";
import { ProjectContext } from "./ProjectContext";
import { getPublicProjects,deleteProject as deleteProjectApi, addProject as addProjectApi, updateProject as updateProjectApi} from "../services/project-api";
import { useUser } from "./UserContext";

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error, setError] = useState(null);
    const { userProfile } = useUser();


    const refreshProjects = useCallback(async () => {
        setLoadingProjects(true);
        setError(null);
        try {
            const data = await getPublicProjects();
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

    async function updateProject(
        projectId, 
        title, 
        description, 
        support, 
        techStack, 
        stage,
        visibility,
        status)
    {
        console.log("updating project");
        const updatedProject = await updateProjectApi(projectId,title,description,support,techStack,stage,visibility,status);
        await refreshProjects();
        return updatedProject;
    }

    async function deleteProject(projectId){
        await deleteProjectApi(projectId)
        await refreshProjects();
    }

    const activeProjects    = projects.filter(p => p.status === "ACTIVE" && p.visibility === "PUBLIC");
    const completedProjects = projects.filter(p => p.status === "COMPLETE" && p.visibility === "PUBLIC");
    const userProjects = userProfile
    ? projects.filter(p => p.userId === userProfile.userId)
    : [];

    const collabProjects = userProfile
    ?  projects.filter(p => p.collaborations.userId === userProfile.userId)
    : [];

    console.log(projects[0]);
    console.log(userProfile);

    return (
        <ProjectContext.Provider value={{
            projects,
            userProjects,
            activeProjects,
            completedProjects,
            collabProjects,
            loadingProjects,
            error,
            addProject,
            updateProject,
            deleteProject,
            refreshProjects,
        }}>
            {children}
        </ProjectContext.Provider>
    );
}