// ProjectProvider.jsx provides the state of a project as well as project logic to the app 
import { useEffect, useState, useCallback } from "react";
import { ProjectContext } from "./ProjectContext";
import { getPublicProjects, getUserProjects, deleteProject as deleteProjectApi, addProject as addProjectApi, updateProject as updateProjectApi } from "../services/project-api";
import { getCollaborationsById } from "../services/collaboration-api";
import { useUser } from "./UserContext";
import supabase from "../lib/supabase";


export function ProjectProvider({ children }) {
    // store the local states
    const [publicProjects, setPublicProjects] = useState([]);
    const [userProjects, setUserProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [error, setError] = useState(null);
    const [sentCollaborations, setSentCollaborations] = useState([]);
    const [collaborationToast, setCollaborationToast] = useState(null);
    const { userProfile } = useUser();

    // function to fetch the latest data from the project table
    const refreshProjects = useCallback(async () => {
        setLoadingProjects(true);
        setError(null);
        try {
            const dataPublicProjects = await getPublicProjects();
            setPublicProjects(dataPublicProjects);

            const dataUserProjects = userProfile
                ? await getUserProjects(userProfile.userId)
                : [];
            setUserProjects(dataUserProjects);

            const dataSentCollab = userProfile
                ? await getCollaborationsById(userProfile.userId)
                :[];
            setSentCollaborations(dataSentCollab)
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError(err);
        } finally {
            setLoadingProjects(false);
        }
    }, [userProfile?.userId]);

    // function to create a channel for realtime updates, recreates the channel when user logs in or update information
    useEffect(() => {
        if (!userProfile?.userId) return;

        // creates the channel to subscribe to realtime updates
        const channel = supabase
            .channel(`realtime-${userProfile.userId}`)
            .on("postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "projects",
                },
                (payload) => {
                    console.log("projects event:", payload.eventType);
                    refreshProjects();
                }
            )
            .on("postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "collaborations",
                    filter: `requestingUserId=eq.${userProfile.userId}`,
                },
                (payload) => {
                    const requestResponse = payload.eventType;
                    
                    // notify the user when a request to collaborate occurs or a request to collaborate is responded to
                    if (requestResponse === "INSERT") {
                        console.log("collaboration event: sent a collaboration", payload.eventType);
                    } else if (requestResponse === "UPDATE") {
                        console.log("collaboration event: request updated", payload.eventType);
                        const newStatus = payload.new?.status;
                        if (newStatus === "ACCEPTED" || newStatus === "REJECTED") {
                            setCollaborationToast({
                                status: newStatus,
                                projectTitle: payload.new?.title ?? "a project",
                            });
                            setTimeout(() => setCollaborationToast(null), 4000);
                        }
                    }

                    refreshProjects();
                }
            )
            .subscribe((status) => {
                console.log("Channel status:", status);
            });

        refreshProjects();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userProfile?.userId]);

    // add new project logic
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
        console.log("adding project");
        return newProject;
    }

    // update project logic
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
        const updatedProject = await updateProjectApi(
            projectId,
            title,
            description,
            support,
            techStack,
            stage,
            visibility,
            status
        );
        return updatedProject;
    }

    // delete project
    async function deleteProject(projectId) {
        await deleteProjectApi(projectId);
    }


    // filtered project collection for app pages including feed
    const activeProjects = publicProjects.filter(
        (p) => p.status === "ACTIVE" && p.visibility === "PUBLIC"
    );
    const completedProjects = publicProjects.filter(
        (p) => p.status === "COMPLETE" && p.visibility === "PUBLIC"
    );
    const collabProjects = userProfile
        ? publicProjects.filter((p) =>
            p.collaborations?.some((c) =>
                c.users?.userId === userProfile.userId
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
            collaborationToast,
            sentCollaborations,
            clearCollaborationToast: () => setCollaborationToast(null),
        }}>
            {children}
        </ProjectContext.Provider>
    );
}