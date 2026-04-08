import Project from "../model/Project.js";
export default class ProjectController{
    constructor(projectService){
        this.projectService = projectService;
    }

    createProject = async (req, res) => {
        try {
            const { userId, title, description, stage, visibility, techStack, status, createdAt } = req.body;
            const newProject = Project.createProject({ userId, title, description, stage, visibility, techStack, status, createdAt });
            const project = await this.projectService.createProject(newProject.toJSON());
            res.status(201).json(project);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    updateProject = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, stage, visibility, techStack, status } = req.body;

            const project = await this.projectService.updateProject({
                projectId: id,
                title,
                description,
                stage,
                visibility,
                techStack,
                status
            });

            res.json(project);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getProjectById = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await this.projectService.getProjectById(id);
            res.json(project);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getProjectByUserId = async (req, res) => {
        try {
            const { id } = req.params;
            const project = await this.projectService.getProjectByUserId(id);
            res.json(project);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getAllPublicProjects = async (req, res) => {
        try {
            const projects = await this.projectService.getAllPublicProjects();
            res.json(projects);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

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