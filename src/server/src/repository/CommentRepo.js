// Repository for managing comment data in the database using Supabase.

export default class CommentRepo{
    constructor(supabase) {
    this.supabase = supabase;
  }

  // Adds a new project to the database.
    async addComment(comment) {
        const { data, error } = await this.supabase
            .from("comments")
            .insert([{
                commentId:  comment.commentId,
                projectId:  comment.projectId,
                userId:     comment.userId,
                body:       comment.body
                }])
            .select()
            .single();
        if (error) throw error;
        return data;
    }

    async getById(commentId) {
        const { data, error } = await this.supabase
            .from("comments")
            .select("*")
            .eq("commentId", commentId)
            .single();    
        if (error) throw error;
        return data;
    }

    async getByProjectId(projectId) {
        const { data, error } = await this.supabase
            .from("comments")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    async updateComment(commentId, body){
        const { data, error } = await this.supabase
            .from("comments")
            .update({ body })
            .eq("commentId", commentId)
            .select()
            .single(); 
        if (error) throw error;
        return data;
    }

    async delete(commentId) {
        const { data, error } = await this.supabase
            .from("comments")
            .delete()
            .eq("commentId", commentId)
            .select()
        if (error) throw error;
        return data;
    }
}