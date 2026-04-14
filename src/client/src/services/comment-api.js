// frontend api that sends all comment related requests to the backend
import { getAccessToken } from "./user-api";

// Comment API calls
// Adds a new comment to a project in the backend
export async function addComment(projectId, userId, body)
{
    try
    {
        const token = await getAccessToken();
        const response = await fetch("api/comments/add" ,
        {
            method: "POST",
            headers: { "Content-Type": "application/json",
                        Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({ projectId, userId, body }),
        });

        if (!response.ok) throw new Error("Failed to add comment");
        const result = await response.json();
        return result
    } catch (error) 
    {
        console.error("Error adding comment:", error);
        throw error;
    }
}

// Updates an existing comment in the backend
export async function updateComment(commentId, body)
{
    try
    {
        const token = await getAccessToken();
        const response = await fetch(`/api/comments/update/${commentId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                        Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({ body }),
        });

        if (!response.ok) throw new Error("Failed to update comment");
        const result = await response.json();
        return result;
    } catch (error) 
    {
        console.error("Error updating comment:", error);
        throw error;
    }
}

// Deletes a comment from the backend
export async function deleteComment(commentId) {
    try
    {
        const token = await getAccessToken();
        const response = await fetch(`/api/comments/delete/${commentId}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
                        Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Failed to delete comment");
    } catch (error) 
    {
        console.error("Error deleting comment:", error);
        throw error;
    }
}