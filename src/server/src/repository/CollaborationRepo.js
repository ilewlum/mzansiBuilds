// Repository for managing collaboration data in the database using Supabase.

export default class Collaboration{
    constructor(supabase) {
    this.supabase = supabase;
  }

  // Adds a new collaborationRequest to the database.
    async addCollaboration( collaboration ) {
        const { data, error } = await this.supabase
            .from("collaborations")
            .insert([{
                collaborationId:    collaboration.collaborationId,
                projectId:          collaboration.projectId,
                requestingUserId:   collaboration.requestingUserId,
                title:              collaboration.title,
                message:            collaboration.message,
                }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async getById(collaborationId) {
        const { data, error } = await this.supabase
            .from("collaborations")
            .select("*")
            .eq("collaborationId", collaborationId)
            .single();    
        if (error) throw error;
        return data;
    }

    async getByProjectId(projectId) {
        const { data, error } = await this.supabase
            .from("collaborations")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    async getByUserId( userId ) {
        const { data, error } = await this.supabase
            .from("collaborations")
            .select("*")
            .eq("userId", userId)
            .single();    
        if (error) throw error;
        return data;
    }

    async updateCollaboration(collaborationId, status){
        const { data, error } = await this.supabase
            .from("collaborations")
            .update({ status })
            .eq("collaborationId", collaborationId)
            .select()
            .single(); 
        if (error) throw error;
        return data;
    }

    async delete(collaborationId) {
        const { data, error } = await this.supabase
            .from("collaborations")
            .delete()
            .eq("collaborationId", collaborationId)
            .select()
        if (error) throw error;
        return data;
    }
}