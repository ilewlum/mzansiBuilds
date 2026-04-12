import Collaboration from "../model/Collaboration.js"

export default class CollaborationService{
    constructor(collaborationRepo) {
    this.collaborationRepo = collaborationRepo;
  }

  async addCollaboration(collaboration, client) {
    const savedCollaboration = await this.collaborationRepo.addCollaboration(collaboration, client);
    return savedCollaboration;
  }

  async getCollaborationsByProjectId( projectId, client){
    const collaborations = await this.collaborationRepo.getByProjectId(projectId, client);
    return collaborations;
  }

  async getCollaborationsByUserId( UserId, client){
    const collaborations = await this.collaborationRepo.getByUserId(UserId, client);
    return collaborations;
  }

  async getCollaborationById( collaborationId, client){
    const collaboration = await this.collaborationRepo.getById(collaborationId, client);
    return collaboration;
  }

  async updateCollaboration(collaborationId, status, client){
    const collaboration = await this.collaborationRepo.updateCollaboration(collaborationId, status, client);
    return collaboration
  }

  async deleteCollaboration(collaborationId, client){
    await this.collaborationRepo.delete(collaborationId, client);
  }
}