

export default class MilestoneService{
    constructor(milestoneRepo) {
    this.milestoneRepo = milestoneRepo;
  }

  async addMilestone( milestone, client) {
    const savedMilestone = await this.milestoneRepo.addMilestone(milestone, client);
    return savedMilestone;
  }

  async getMilestoneByProjectId( projectId, client){
    const milestones = await this.milestoneRepo.getByProjectId(projectId, client);
    return milestones;
  }

  async getMilestoneById( milestoneId, client){
    const milestone = await this.milestoneRepo.getById(milestoneId, client);
    return milestone;
  }

  async updateMilestone(milestoneId, description, client){
    const milestone = await this.milestoneRepo.updateMilestone(milestoneId, description, client);
    return milestone
  }

  async deleteMilestone(milestoneId, client){
    await this.milestoneRepo.delete(milestoneId, client);
  }
}