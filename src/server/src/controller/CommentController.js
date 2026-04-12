import Comment from "../model/Comment.js"

export default class CommentController{
    constructor(commentService){
        this.commentService = commentService;
    }

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

    getCommentById = async (req, res) => {
        try {
            const { id } = req.params;
            const comment = await this.commentService.getCommentById(id, req.supabase);
            res.json(comment);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

    getCommentByProjectId = async (req, res) => {
        try {
            const { id } = req.params;
            const comments = await this.commentService.getCommentByProjectId(id, req.supabase);
            res.json(comments);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };

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