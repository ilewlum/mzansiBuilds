// Repository for managing collaboration data in the database using Supabase.

export default class Collaboration{
    constructor(supabase) {
    this.supabase = supabase; // ✅ this was removed at some point
  }


    getClient(client){
        return client || this.supabase
    }

  // Adds a new collaborationRequest to the database.
    async addCollaboration( collaboration , client) {
        console.log(collaboration, client)
        const { data, error } = await this.getClient(client)
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

    async getById(collaborationId , client) {
        const { data, error } = await this.getClient(client)
            .from("collaborations")
            .select("*")
            .eq("collaborationId", collaborationId)
            .single();    
        if (error) throw error;
        return data;
    }

    async getByProjectId(projectId, client) {
        const { data, error } = await this.getClient(client)
            .from("collaborations")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    async getByUserId( userId , client) {
        const { data, error } = await this.getClient(client)
            .from("collaborations")
            .select("*")
            .eq("userId", userId)
            .single();    
        if (error) throw error;
        return data;
    }

    async updateCollaboration(collaborationId, status, client){
        const { data, error } = await this.getClient(client)
            .from("collaborations")
            .update({ status })
            .eq("collaborationId", collaborationId)
            .select()
            .single(); 
        if (error) throw error;
        return data;
    }

    async delete(collaborationId , client) {
        const { data, error } = await this.getClient(client)
            .from("collaborations")
            .delete()
            .eq("collaborationId", collaborationId)
            .select()
        if (error) throw error;
        return data;
    }
}