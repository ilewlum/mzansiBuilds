// Collaboration frontend API
import { getAccessToken } from "./user-api";

// Function to request/add collaboration
export async function addCollaboration(projectId, requestingUserId, title, message)
{
    try
    {
        const token = await getAccessToken();
        const response = await fetch("api/collaborations/add" ,
        {
            method: "POST",
            headers: { "Content-Type": "application/json",
                        Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({ projectId, requestingUserId, title, message }),
        });

        if (!response.ok) throw new Error("Failed to request collaboration");
        const result = await response.json();
        return result
    } catch (error) 
    {
        console.error("Error requesting collaboration:", error);
        throw error;
    }
}

// Function to update collaboration status (accept/reject)
export async function updateCollaboration(collaborationId, status)
{
    console.log(collaborationId, status)
    try
    {
        const token = await getAccessToken();
        const response = await fetch(`/api/collaborations/update/${collaborationId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                        Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) throw new Error("Failed to update collaboration");
        const result = await response.json();
        return result;
    } catch (error) 
    {
        console.error("Error updating collaboration:", error);
        throw error;
    }
}

export async function getCollaborationsById(userId){
    const token = await getAccessToken()
    const response = await fetch(`/api/collaborations/user/${userId}`,{
        headers : {Authorization : `Bearer ${token}`}
    });
    if (!response.ok) {
        throw new Error("Failed to fetch User collaborations");
    }
    return response.json();
}

// Function to delete collaboration
export async function deleteCollaboration(collaborationId) {
    try
    {
        const token = await getAccessToken();
        const response = await fetch(`/api/collaborations/delete/${collaborationId}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
                        Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Failed to delete collaboration");
    } catch (error) 
    {
        console.error("Error deleting collaboration:", error);
        throw error;
    }
}