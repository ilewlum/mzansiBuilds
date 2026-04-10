// Repository for managing Milestone data in the database using Supabase.

export default class MilestoneRepo{
    constructor(supabase) {
    this.supabase = supabase;
  }

  // Adds a new milestone to the database.
    async addMilestone( milestone ) {
        console.log(milestone);
        const { data, error } = await this.supabase
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

    async getById(milestoneId) {
        const { data, error } = await this.supabase
            .from("milestones")
            .select("*")
            .eq("milestoneId", milestoneId)
            .single();    
        if (error) throw error;
        return data;
    }

    async getByProjectId(projectId) {
        const { data, error } = await this.supabase
            .from("milestones")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    async updateMilestone(milestoneId, description){
        const { data, error } = await this.supabase
            .from("milestones")
            .update({ description })
            .eq("milestoneId", milestoneId)
            .select()
            .single(); 
        if (error) throw error;
        return data;
    }

    async delete(milestoneId) {
        const { data, error } = await this.supabase
            .from("milestones")
            .delete()
            .eq("milestoneId", milestoneId)
            .select()
        if (error) throw error;
        return data;
    }
}