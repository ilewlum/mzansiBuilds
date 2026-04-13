// Service layer for collaboration-related operations, handling business logic and interactions with the CollaborationRepository.
export default class CollaborationService{
    constructor(collaborationRepo) {
    this.collaborationRepo = collaborationRepo;
  }

  // Adds a new collaboration to a project and returns the saved collaboration.
  async addCollaboration(collaboration, client) {
    const savedCollaboration = await this.collaborationRepo.addCollaboration(collaboration, client);
    return savedCollaboration;
  }

  // Get all collaborations for a project
  async getCollaborationsByProjectId( projectId, client){
    const collaborations = await this.collaborationRepo.getByProjectId(projectId, client);
    return collaborations;
  }

  // Get all collaborations for a user
  async getCollaborationsByUserId( UserId, client){
    const collaborations = await this.collaborationRepo.getByUserId(UserId, client);
    return collaborations;
  }

  // Get collaboration by id
  async getCollaborationById( collaborationId, client){
    const collaboration = await this.collaborationRepo.getById(collaborationId, client);
    return collaboration;
  }

  // Update collaboration status by id
  async updateCollaboration(collaborationId, status, client){
    const collaboration = await this.collaborationRepo.updateCollaboration(collaborationId, status, client);
    return collaboration
  }

  // delete collaboration by id
  async deleteCollaboration(collaborationId, client){
    await this.collaborationRepo.delete(collaborationId, client);
  }
}