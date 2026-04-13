// Controller for handling HTTP requests related to comments, including creating, retrieving, updating, 
// and deleting comments. It interacts with the CommentService to perform these operations and 
// sends appropriate JSON responses back to the client.
import Comment from "../model/Comment.js"

export default class CommentController{
    constructor(commentService){
        this.commentService = commentService;
    }

    // Creates a new comment with the provided details and sends the created comment as a JSON response with a 201 status code.
    addComment = async (req, res) => {
        try{
            const {userId, projectId, body } = req.body;
            const newComment = Comment.createComment(projectId ,userId ,body);
            const comment = await this.commentService.addComment(newComment.toJSON(), req.supabase);
            res.status(201).json(comment);
        }
        catch (err) {
            console.log(err)
            res.status(500).json({ error: err.message });
        }
    };

    // Get a comment by its unique identifier and send the comment as a JSON response.
    getCommentById = async (req, res) => {
        try {
            const { id } = req.params;
            const comment = await this.commentService.getCommentById(id, req.supabase);
            res.json(comment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Get all comments for a project by the project's unique identifier and send them as a JSON response.
    getCommentByProjectId = async (req, res) => {
        try {
            const { id } = req.params;
            const comments = await this.commentService.getCommentByProjectId(id, req.supabase);
            res.json(comments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    //  Update a comment's description by its unique identifier and send the updated comment as a JSON response.
    updateComment = async (req, res) => {
        try {
            const { id } = req.params;
            const { body} = req.body;
            console.log(id, body);
            const comment = await this.commentService.updateComment(
                id,
                body,
                req.supabase
            );
            res.json(comment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    // Delete a comment by its unique identifier and send a 204 No Content response if successful.
    deleteProject = async (req, res) => {
        try {
            const { id } = req.params;
            await this.commentService.deleteComment(id, req.supabase);
            res.status(204).send();
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ error: err.message });
        }
    };
}