// project-api.js - API calls related to projects

import { getAccessToken } from "./user-api";

// Fetches all public projects from the backend
export async function getPublicProjects() {

  const response = await fetch("/api/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch public projects");
  }
  const data = await response.json()
  return data;
}

// Fetches projects associated with a specific user
export async function getUserProjects(UserId) {
  const token = await getAccessToken()
  const response = await fetch(`/api/projects/user/${UserId}`,{
    headers : {Authorization : `Bearer ${token}`}
  });
  if (!response.ok) {
    throw new Error("Failed to fetch User projects");
  }
  return response.json();
}
 

// Adds a new project to the backend
export async function addProject(userId, title, description,support, techStack, stage, visibility, status) {
  try {
    const token = await getAccessToken();
    const response = await fetch("api/projects/add", {
      method: "POST",
      headers: { "Content-Type": "application/json",
                  Authorization : `Bearer ${token}`
       },
      body: JSON.stringify({ title, userId, description, stage, visibility, techStack, status, support }),
    });
 
    if (!response.ok) throw new Error("Failed to save project");
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

// Updates an existing project in the backend
export async function updateProject(projectId, title, description, support, techStack, stage, visibility, status)
{
    const token = await getAccessToken();
    try
    {
        const response = await fetch(`/api/projects/update/${projectId}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json",
                        Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({ title, description, stage, visibility, techStack, status, support }),
        });

        if (!response.ok) throw new Error("Failed to update project");
        const result = await response.json();
        return result;
    } catch (error) 
    {
        console.error("Error updating project:", error);
        throw error;
    }
}

// Deletes a project from the backend
export async function deleteProject(projectId) {
    const token = await getAccessToken();
    try
    {
        const response = await fetch(`/api/projects/delete/${projectId}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json",
                       Authorization : `Bearer ${token}`
             },
            body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error("Failed to delete project");
    } catch (error) 
    {
        console.error("Error deleting project:", error);
        throw error;
    }
}