// frontend api that sends all milestone related requests to the backend
import { getAccessToken } from "./user-api";

// Milestone API calls
// Adds a new milestone to a project in the backend
export async function addMilestone(projectId, title, description)
{
    try
    {
        const token = await getAccessToken();
        const response = await fetch("api/milestones/add" ,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" ,
                        Authorization : `Bearer ${token}`
            },
            body: JSON.stringify({ projectId, title, description }),
        });

        if (!response.ok) throw new Error("Failed to add milestone");
        const result = await response.json();
        console.log("milestone added:", result);
    } catch (error) 
    {
        console.error("Error adding milestone:", error);
        throw error;
    }
}

// Updates an existing milestone in the backend
export async function updateMilestone(milestoneId, description)
{
    try
    {
        const token = await getAccessToken();
        const response = await fetch(`/api/milestones/update/${milestoneId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" ,
                        Authorization : `Bearer ${token}`
            },
            body: JSON.stringify({ description }),
        });

        if (!response.ok) throw new Error("Failed to update milestone");
        const result = await response.json();
        return result;
    } catch (error) 
    {
        console.error("Error updating milestone:", error);
        throw error;
    }
}

// Deletes a milestone from the backend
export async function deleteMilestone(milestoneId) {
    try
    {
        const token = await getAccessToken();
        const response = await fetch(`/api/milestones/delete/${milestoneId}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
                        Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Failed to delete milestone");
    } catch (error) 
    {
        console.error("Error deleting milestone:", error);
        throw error;
    }
}