// Service layer for project-related operations, handling business logic and interactions with the ProjectRepository.

import Project from "../model/Project.js";

export default class ProjectService {
  constructor(projectRepo) {
    this.projectRepo = projectRepo;
  }

  // Creates a new project with the provided details and saves it to the repository.
  async createProject(project) {
    const savedProject = await this.projectRepo.Add(project);
    return savedProject;
  }

  // Updates an existing project's details based on the provided information and saves the changes to the repository.
  async updateProject({ projectId, title, description, stage, visibility, techStack, status,support }) {
    const savedProject = await this.projectRepo.update({ projectId, 
                                                        title, 
                                                        description, 
                                                        stage, 
                                                        visibility, 
                                                        techStack, 
                                                        status,
                                                        support });
    return savedProject;
  }

  // Retrieves a project by its unique identifier from the repository.
  async getProjectById(projectId) {
    const project = await this.projectRepo.findById(projectId);
    return project;
  }

  // Retrieves all projects associated with a specific user identifier from the repository.
  async getProjectByUserId(UserId) {
    const projects = await this.projectRepo.findByUserId(UserId);
    return projects;
  }

  // Retrieves all public projects from the repository.
  async getAllPublicProjects() {
    const projects = await this.projectRepo.findPublic();
    return projects;
  }

  // Deletes a project by its unique identifier from the repository and returns the deleted project.
  async deleteProject(projectId) {
    const project = await this.projectRepo.delete(projectId);
    return project;
  }
}