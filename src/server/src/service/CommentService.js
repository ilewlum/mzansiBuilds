import Comment from "../model/Comment.js"

export default class CommentService{
    constructor(commentRepo) {
    this.commentRepo = commentRepo;
  }

  async addComment(comment) {
    const savedComment = await this.commentRepo.addComment(comment);
    return savedComment;
  }

  async getCommentsByProjectId( projectId){
    const comments = await this.commentRepo.getByProjectId(projectId);
    return comments;
  }

  async getCommentById( commentId){
    const comment = await this.commentRepo.getById(commentId);
    return comment;
  }

  async updateComment(commentId, body){
    const comment = await this.commentRepo.updateComment(commentId, body);
    return comment
  }

  async deleteComment(commentId){
    await this.commentRepo.delete(commentId);
  }
}