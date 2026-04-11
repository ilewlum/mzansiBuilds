// Controller layer for project-related operations, handling HTTP requests and responses,
// and delegating business logic to the ProjectService.

import Project from "../model/Project.js";
export default class ProjectController{
    constructor(projectService){
        this.projectService = projectService;
    }

    // Creates a new project with the provided details and sends the created project as a JSON response with a 201 status code.
    createProject = async (req, res) => {
        try {
            const { userId, title, description, stage, visibility, techStack, status, support, createdAt } = req.body;
            const newProject = Project.createProject({ userId, title, description, support ,techStack , stage, visibility, status, createdAt});
            const project = await this.projectService.createProject(newProject.toJSON());
            res.status(201).json(project);
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    // Updates an existing project's details based on the provided information and sends the updated project as a JSON response.
    updateProject = async (req, res) => {
        try {
            const { id } = req.params;
            console.log("projectController : id", id);
            const { title, description, stage, visibility, techStack, status, support } = req.body;
            const project = await this.projectService.updateProject({
                projectId: id,
                title,
                description,
                stage,
                visibility,
                techStack,
                status,
                support
            });

            res.json(project);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    };

    // Retrieves a project by its unique identifier and sends the project as a JSON response.
    getProjectById = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await this.projectService.getProjectById(id);
            res.json(project);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Retrieves all projects associated with a specific user identifier and sends them as a JSON response.
    getProjectByUserId = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await this.projectService.getProjectByUserId(id);
            res.json(project);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Retrieves all public projects and sends them as a JSON response.
    getAllPublicProjects = async (req, res) => {
        try {
            const projects = await this.projectService.getAllPublicProjects();
            console.log(projects)
            res.json(projects);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        }
    };

    // Deletes a project by its unique identifier and sends a 204 No Content response if successful.
    deleteProject = async (req, res) => {
        try {
            const { id } = req.params;
            await this.projectService.deleteProject(id);
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };
}