// Repository for managing project data in the database using Supabase.

export default class ProjectRepo {
  constructor(supabase) {
    this.supabase = supabase;
  }

    // Adds a new project to the database.
    async createProject(project) {
        const { data, error } = await this.supabase
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
        return data;
    }

    // Retrieves a project by its unique identifier.
    async getById(projectId) {
        const { data, error } = await this.supabase
            .from("projects")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    // Retrieves all projects associated with a specific user.
    async getByUserId(userId) {
        const { data, error } = await this.supabase
            .from("projects")
            .select("*")
            .eq("userId", userId);
        if (error) throw error;
        return data;
    }

    // Retrieves all public projects that are currently active.
    async getPublic(){
        const { data, error } = await this.supabase            
            .from("projects")
            .select("projectId, title, description, stage, visibility, techStack,status,support, users(username), createdAt, comments( commentId, body, createdAt, users(username))")
            .eq("visibility", "PUBLIC")
            .order("createdAt", { ascending: false })
            .order("createdAt", { foreignTable: "comments", ascending: false })
        if (error) throw error;
        return data;
    }

    // Updates an existing project's details in the database.
    async updateProject({ projectId, title, description, stage, visibility, techStack, status, support }){
        const { data, error } = await this.supabase
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
    async delete(projectId) {
        const { data, error } = await this.supabase
            .from("projects")
            .delete()
            .eq("projectId", projectId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
}