// Service layer for project-related operations, handling business logic and interactions with the ProjectRepository.

import Project from "../model/Project.js";

export default class ProjectService {
  constructor(projectRepo) {
    this.projectRepo = projectRepo;
  }

  // Creates a new project with the provided details and saves it to the repository.
  async createProject(project, client) {
    const savedProject = await this.projectRepo.createProject(project, client);
    return savedProject;
  }

  // Updates an existing project's details based on the provided information and saves the changes to the repository.
  async updateProject({ projectId, title, description, stage, visibility, techStack, status,support }, client) {
    const savedProject = await this.projectRepo.updateProject({ projectId, 
                                                        title, 
                                                        description, 
                                                        stage, 
                                                        visibility, 
                                                        techStack, 
                                                        status,
                                                        support }, client);
    return savedProject;
  }

  // Retrieves a project by its unique identifier from the repository.
  async getProjectById(projectId , client) {
    const project = await this.projectRepo.getById(projectId, client);
    return project;
  }

  // Retrieves all projects associated with a specific user identifier from the repository.
  async getProjectsByUserId(UserId, client) {
    const projects = await this.projectRepo.getByUserId(UserId, client);
    return projects;
  }

  // Retrieves all public projects from the repository.
  async getAllPublicProjects() {
    const projects = await this.projectRepo.getPublic();
    return projects;
  }

  // Deletes a project by its unique identifier from the repository and returns the deleted project.
  async deleteProject(projectId, client) {
    const project = await this.projectRepo.delete(projectId, client);
    return project;
  }
}