// imports used by Project provider
import { useEffect, useState , useCallback} from "react";
import { ProjectContext } from "./ProjectContext";
import { getPublicProjects, getUserProjects ,deleteProject as deleteProjectApi, addProject as addProjectApi, updateProject as updateProjectApi} from "../services/project-api";
import { useUser } from "./UserContext";

export function ProjectProvider({ children }) {
    const [publicProjects, setPublicProjects] = useState([]);
    const [userProjects,   setUserProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error, setError] = useState(null);
    const { userProfile } = useUser();

    // Refresh projects after each update by this user
    const refreshProjects = useCallback(async () => {
        setLoadingProjects(true);
        setError(null);
        try {
            // get public projects used displayed in the feed page
            const dataPublicProjects = await getPublicProjects();
            console.log("Public projects recieved");
            setPublicProjects(dataPublicProjects);

            // get projects that belong to the user using user profile
            const dataUserProjects = userProfile ? await getUserProjects(userProfile.userId) :  [];
            console.log("User projects recieved");
            setUserProjects(dataUserProjects)
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError(err);
        } finally {
            setLoadingProjects(false);
        }
        // changed to userProfile triggers refreshProjects call
    }, [userProfile]); // 

    useEffect (() => { 
        refreshProjects(); } , 
        [refreshProjects]
    );

    // function to add a project
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

    // function to update projects
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

    // function to delete a projects
    async function deleteProject(projectId){
        await deleteProjectApi(projectId)
        await refreshProjects();
    }

    // filtered collection of projects used by the feed as well as project page
    const activeProjects    = publicProjects.filter(p => p.status === "ACTIVE" && p.visibility === "PUBLIC");
    const completedProjects = publicProjects.filter(p => p.status === "COMPLETE" && p.visibility === "PUBLIC");
    const collabProjects = userProfile
        ? publicProjects.filter(p =>
            p.collaborations?.some(
                c => c.users?.userId === userProfile.userId
            )
            )
        : [];

    return (
        <ProjectContext.Provider value={{
            publicProjects,
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