import Comment from "../model/Comment.js"

export default class CommentService{
    constructor(commentRepo) {
    this.commentRepo = commentRepo;
  }

  async addComment(comment, client) {
    const savedComment = await this.commentRepo.addComment(comment, client);
    return savedComment;
  }

  async getCommentsByProjectId( projectId, client){
    const comments = await this.commentRepo.getByProjectId(projectId, client);
    return comments;
  }

  async getCommentById( commentId, client){
    const comment = await this.commentRepo.getById(commentId, client);
    return comment;
  }

  async updateComment(commentId, body, client){
    const comment = await this.commentRepo.updateComment(commentId, body, client);
    return comment
  }

  async deleteComment(commentId, client){
    await this.commentRepo.delete(commentId, client);
  }
}