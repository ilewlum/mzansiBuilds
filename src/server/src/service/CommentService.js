// Service layer for comment-related operations, handling business logic and interactions with the CommentRepository.

export default class CommentService{
    constructor(commentRepo) {
    this.commentRepo = commentRepo;
  }

  // Adds a new comment to a project and returns the saved comment.
  async addComment(comment, client) {
    const savedComment = await this.commentRepo.addComment(comment, client);
    return savedComment;
  }

  // Get all comments for a project
  async getCommentsByProjectId( projectId, client){
    const comments = await this.commentRepo.getByProjectId(projectId, client);
    return comments;
  }

  // Get comment by id
  async getCommentById( commentId, client){
    const comment = await this.commentRepo.getById(commentId, client);
    return comment;
  }

  // Update comment description by id
  async updateComment(commentId, body, client){
    const comment = await this.commentRepo.updateComment(commentId, body, client);
    return comment
  }

  // delete comment by id
  async deleteComment(commentId, client){
    await this.commentRepo.delete(commentId, client);
  }
}