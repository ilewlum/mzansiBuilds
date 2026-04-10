

export async function addMilestone(projectId, title, description)
{
    console.log(projectId, title, description)
    try
    {
        const response = await fetch("api/milestones/add" ,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

export async function updateMilestone(milestoneId, description)
{
    try
    {
        const response = await fetch(`/api/comments/update/${milestoneId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description }),
        });

        if (!response.ok) throw new Error("Failed to update milestone");
        const result = await response.json();
        console.log("milestone updated:", result);
        return result;
    } catch (error) 
    {
        console.error("Error updating milestone:", error);
        throw error;
    }
}

export async function deleteComment(milestoneId) {
    console.log(milestoneId)
    try
    {
        const response = await fetch(`/api/comments/delete/${milestoneId}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Failed to delete milestone");
    } catch (error) 
    {
        console.error("Error deleting milestone:", error);
        throw error;
    }
}