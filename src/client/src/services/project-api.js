// project-api.js - API calls related to projects
export async function getProjects() {
  const response = await fetch("/api/projects");
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
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
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}