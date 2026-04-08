import Project from "../model/Project.js";

export default class ProjectService {
  constructor(projectRepo) {
    this.projectRepo = projectRepo;
  }

  async createProject(project) {
    const savedProject = await this.projectRepo.Add(project);
    return savedProject;
  }

  async updateProject({ projectId, title, description, stage, visibility, techStack, status }) {
    const savedProject = await this.projectRepo.update({ projectId, 
                                                        title, 
                                                        description, 
                                                        stage, 
                                                        visibility, 
                                                        techStack, 
                                                        status });
    return savedProject;
  }

  async getProjectById(projectId) {
    const project = await this.projectRepo.findById(projectId);
    return project;
  }

  async getProjectByUserId(UserId) {
    const projects = await this.projectRepo.findByUserId(UserId);
    return projects;
  }

  async getAllPublicProjects() {
    const projects = await this.projectRepo.findPublic();
    return projects;
  }

  async deleteProject(projectId) {
    const project = await this.projectRepo.delete(projectId);
    return project;
  }
}