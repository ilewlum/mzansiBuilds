import Collaboration from "../model/Collaboration.js"

export default class CollaborationService{
    constructor(collaborationRepo) {
    this.collaborationRepo = collaborationRepo;
  }

  async addCollaboration(collaboration) {
    const savedCollaboration = await this.collaborationRepo.addCollaboration(collaboration);
    return savedCollaboration;
  }

  async getCollaborationsByProjectId( projectId){
    const collaborations = await this.collaborationRepo.getByProjectId(projectId);
    return collaborations;
  }

  async getCollaborationsByUserId( UserId){
    const collaborations = await this.collaborationRepo.getByUserId(UserId);
    return collaborations;
  }

  async getCollaborationById( collaborationId){
    const collaboration = await this.collaborationRepo.getById(collaborationId);
    return collaboration;
  }

  async updateCollaboration(collaborationId, status){
    const collaboration = await this.collaborationRepo.updateCollaboration(collaborationId, status);
    return collaboration
  }

  async deleteCollaboration(collaborationId){
    await this.collaborationRepo.delete(collaborationId);
  }
}