// project-api.js - API calls related to projects
export async function getPublicProjects() {
  const response = await fetch("/api/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch public projects");
  }
  return response.json();
}

export async function getUserProjects(UserId) {
  const response = await fetch(`/api/projects/user/${UserId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch User projects");
  }
  return response.json();
}
 
// FIX: added support parameter to match the form field collected in NewProjectModal
export async function addProject(userId, title, description,support, techStack, stage, visibility, status) {
  try {
    const response = await fetch("api/projects/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, userId, description, stage, visibility, techStack, status, support }),
    });
 
    if (!response.ok) throw new Error("Failed to save project");
    const result = await response.json();
    console.log("Project added:", result);
    return result;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

export async function updateProject(projectId, title, description, support, techStack, stage, visibility, status)
{
    console.log("updated projectId", projectId)
    try
    {
        const response = await fetch(`/api/projects/update/${projectId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, stage, visibility, techStack, status, support }),
        });

        if (!response.ok) throw new Error("Failed to update project");
        const result = await response.json();
        console.log("project updated:", result);
        return result;
    } catch (error) 
    {
        console.error("Error updating project:", error);
        throw error;
    }
}

export async function deleteProject(projectId) {
    console.log(projectId)
    try
    {
        const response = await fetch(`/api/projects/delete/${projectId}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Failed to delete project");
    } catch (error) 
    {
        console.error("Error deleting project:", error);
        throw error;
    }
}