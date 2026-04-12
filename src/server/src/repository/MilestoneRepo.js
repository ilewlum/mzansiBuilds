// Repository for managing Milestone data in the database using Supabase.

export default class MilestoneRepo{
    constructor(supabase) {
    this.supabase = supabase; // ✅ this was removed at some point
  }

    getClient(client){
        return client || this.supabase
    }

  // Adds a new milestone to the database.
    async addMilestone( milestone , client) {
        console.log(milestone);
        console.log(client);
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

    async getById(milestoneId , client) {
        const { data, error } = await this.getClient(client)
            .from("milestones")
            .select("*")
            .eq("milestoneId", milestoneId)
            .single();    
        if (error) throw error;
        return data;
    }

    async getByProjectId(projectId, client) {
        const { data, error } = await this.getClient(client)
            .from("milestones")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

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