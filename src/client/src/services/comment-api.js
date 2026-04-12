import { getAccessToken } from "./user-api";

export async function addComment(projectId, userId, body)
{
    console.log(projectId, userId, body)
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
        console.log("comment added:", result);
    } catch (error) 
    {
        console.error("Error adding comment:", error);
        throw error;
    }
}

export async function updateComment(commentId, body)
{
    console.log(commentId, body)
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
        console.log("comment updated:", result);
        return result;
    } catch (error) 
    {
        console.error("Error updating comment:", error);
        throw error;
    }
}

export async function deleteComment(commentId) {
    console.log(commentId)
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