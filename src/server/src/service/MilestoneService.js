

export default class MilestoneService{
    constructor(milestoneRepo) {
    this.milestoneRepo = milestoneRepo;
  }

  async addMilestone( milestone) {
    const savedMilestone = await this.milestoneRepo.addMilestone(milestone);
    return savedMilestone;
  }

  async getMilestoneByProjectId( projectId){
    const milestones = await this.milestoneRepo.getByProjectId(projectId);
    return milestones;
  }

  async getMilestoneById( milestoneId){
    const milestone = await this.milestoneRepo.getById(milestoneId);
    return milestone;
  }

  async updateMilestone(milestoneId, description){
    const milestone = await this.milestoneRepo.updateMilestone(milestoneId, description);
    return milestone
  }

  async deleteMilestone(milestoneId){
    await this.milestoneRepo.delete(milestoneId);
  }
}