export default class ProjectRepo {
  constructor(supabase) {
    this.supabase = supabase;
  }

    async Add(project) {
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
                createdAt: project.createdAt
                }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async findById(projectId) {
        const { data, error } = await this.supabase
            .from("projects")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    async findByUserId(userId) {
        const { data, error } = await this.supabase
            .from("projects")
            .select("*")
            .eq("userId", userId);
        if (error) throw error;
        return data;
    }

    async findPublic(){
        const { data, error } = await this.supabase            
            .from("projects")
            .select("*")
            .eq("visibility", "PUBLIC");
        if (error) throw error;
        return data;
    }

    async update({ projectId, title, description, stage, visibility, techStack, status}){
        const { data, error } = await this.supabase
            .from("projects")
            .update({ 
                title, 
                description, 
                stage, 
                visibility, 
                techStack, 
                status })
            .eq("projectId", projectId)
            .select()
            .single(); 
        if (error) throw error;
        return data;
    }

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