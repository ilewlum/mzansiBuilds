import express from "express"
import CommentController from "../controller/CommentController.js"
import CommentService from "../service/CommentService.js"
import CommentRepo from "../repository/CommentRepo.js"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

// dependency injection
const commentRepo = new CommentRepo(supabase)
const commentService = new CommentService(commentRepo);
const commentController = new CommentController(commentService)

// routes
router.post("/add", commentController.addComment);
router.get("/:id", commentController.getCommentById);
router.get("/projectId/:id", commentController.getCommentByProjectId);
router.put("/update/:id", commentController.updateComment);
router.delete("/delete/:id", commentController.deleteProject);

export default router;