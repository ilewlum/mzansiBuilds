
export default class MilestoneService{
    constructor(milestoneRepo) {
    this.milestoneRepo = milestoneRepo;
  }

  // Adds a new milestone to a project and returns the saved milestone.
  async addMilestone( milestone, client) {
    const savedMilestone = await this.milestoneRepo.addMilestone(milestone, client);
    return savedMilestone;
  }

  // Get all milestones for a project
  async getMilestoneByProjectId( projectId, client){
    const milestones = await this.milestoneRepo.getByProjectId(projectId, client);
    return milestones;
  }

  // Get milestone by id
  async getMilestoneById( milestoneId, client){
    const milestone = await this.milestoneRepo.getById(milestoneId, client);
    return milestone;
  }

  // Update milestone description by id
  async updateMilestone(milestoneId, description, client){
    const milestone = await this.milestoneRepo.updateMilestone(milestoneId, description, client);
    return milestone
  }

  // delete milestone by id
  async deleteMilestone(milestoneId, client){
    await this.milestoneRepo.delete(milestoneId, client);
  }
}