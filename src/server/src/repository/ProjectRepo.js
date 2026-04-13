// Repository for managing project data in the database using Supabase.

export default class ProjectRepo {
    constructor(supabase) {
    this.supabase = supabase; 
  }
  
    getClient(client){
        return client || this.supabase
    }

    // Adds a new project to the database.
    async createProject(project, client) {
        const { data, error } = await this.getClient(client)
            .from("projects")
            .insert([{
                projectId: project.projectId,
                userId: project.userId,
                title: project.title,
                description: project.description,
                stage: project.stage,
                visibility: project.visibility,
                techStack: project.techStack,
                status: project.status,
                support: project.support
                }])
            .select()
            .single();
        if (error) throw error;
        console.log(error)
        return data;
    }

    // Retrieves a project by its unique identifier.
    async getById(projectId, client) {
        const { data, error } = await this.getClient(client)
            .from("projects")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    // Retrieves all projects associated with a specific user.
    async getByUserId(userId, client) {
        const { data, error } = await this.getClient(client)
            .from("projects")
            .select("projectId, users(userId, username), title, description, stage, visibility, techStack, status, support, createdAt, milestones(milestoneId, title, description), collaborations(collaborationId, title, status, users!collaborations_requestingUserId_fkey(userId, username))")
            .eq("userId", userId)
            .order("createdAt", { ascending: false });
        if (error) throw error;
        console.log( "project Repo",JSON.stringify(data, null, 2));
        return data;
    }

    // Retrieves all public projects that are currently active.
    async getPublic(){
        const { data, error } = await this.supabase            
            .from("projects")
            .select("projectId, users(userId,username), title, description, stage, visibility, techStack, status, support, createdAt, comments(commentId, body, createdAt, users(username)), milestones(milestoneId, title, description), collaborations(collaborationId, requestingUserId, title, status, users!collaborations_requestingUserId_fkey(userId, username))")
            .eq("visibility", "PUBLIC")
            .order("createdAt", { ascending: false })
            .order("createdAt", { foreignTable: "comments", ascending: false })
        if (error) throw error;
        //console.log(JSON.stringify(data, null, 2));
        return data;
    }

    // Updates an existing project's details in the database.
    async updateProject({ projectId, title, description, stage, visibility, techStack, status, support }, client){
        const { data, error } = await this.getClient(client)
            .from("projects")
            .update({ 
                title, 
                description, 
                stage, 
                visibility, 
                techStack, 
                status,
                support
             })
            .eq("projectId", projectId)
            .select()
            .single(); 
        if (error) throw error;
        return data;
    }

    // Deletes a project from the database based on its unique identifier.
    async delete(projectId, client) {
        console.log("Repo deleting project: id ", projectId)
        const { data, error } = await this.getClient(client)
            .from("projects")
            .delete()
            .eq("projectId", projectId)
            .select()
            .single();
        if (error) throw error;
        console.log(error)
        return data;
    }
}