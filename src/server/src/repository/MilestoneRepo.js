// Repository for managing Milestone data in the database using Supabase.

export default class MilestoneRepo{
    constructor(supabase) {
    this.supabase = supabase; 
  }

    getClient(client){
        return client || this.supabase
    }

  // Adds a new milestone to the database.
    async addMilestone( milestone , client) {
        const { data, error } = await this.getClient(client)
            .from("milestones")
            .insert([{
                milestoneId:    milestone.milestoneId,
                projectId:      milestone.projectId,
                title:          milestone.title,
                description:    milestone.description,
                }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    // Retrieves a milestone by its unique identifier.
    async getById(milestoneId , client) {
        const { data, error } = await this.getClient(client)
            .from("milestones")
            .select("*")
            .eq("milestoneId", milestoneId)
            .single();    
        if (error) throw error;
        return data;
    }

    // Retrieves all milestones associated with a specific project.
    async getByProjectId(projectId, client) {
        const { data, error } = await this.getClient(client)
            .from("milestones")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    // Update an existing milestone's description in the database by its unique identifier.
    async updateMilestone(milestoneId, description, client){
        const { data, error } = await this.getClient(client)
            .from("milestones")
            .update({ description })
            .eq("milestoneId", milestoneId)
            .select()
            .single(); 
        if (error) throw error;
        return data;
    }
    // Deletes a milestone from the database by its unique identifier.
    async delete(milestoneId, client) {
        const { data, error } = await this.getClient(client)
            .from("milestones")
            .delete()
            .eq("milestoneId", milestoneId)
            .select()
        if (error) throw error;
        return data;
    }
}