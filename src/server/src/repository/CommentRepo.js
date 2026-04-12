// Repository for managing comment data in the database using Supabase.

export default class CommentRepo{
    constructor(supabase) {
    this.supabase = supabase; // ✅ this was removed at some point
  }


    getClient(client){
        return client || this.supabase
    }

  // Adds a new project to the database.
    async addComment(comment, client) {
      // ✅ define first
        const { data, error } = await this.getClient(client)   // ✅ use it here
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

    async getById(commentId, client) {
        const { data, error } = await this.getClient(client)
            .from("comments")
            .select("*")
            .eq("commentId", commentId)
            .single();    
        if (error) throw error;
        return data;
    }

    async getByProjectId(projectId, client) {
        const { data, error } = await this.getClient(client)
            .from("comments")
            .select("*")
            .eq("projectId", projectId)
            .single();    
        if (error) throw error;
        return data;
    }

    async updateComment(commentId, body, client){
        const { data, error } = await this.getClient(client)
            .from("comments")
            .update({ body })
            .eq("commentId", commentId)
            .select()
            .single(); 
        if (error) throw error;
        return data;
    }

    async delete(commentId , client) {
        const { data, error } = await this.getClient(client)
            .from("comments")
            .delete()
            .eq("commentId", commentId)
            .select()
        if (error) throw error;
        return data;
    }
}