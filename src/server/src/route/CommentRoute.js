import express from "express"
import { supabaseAdmin } from "../config/supabaseClient.js"
import CommentController from "../controller/CommentController.js"
import CommentService from "../service/CommentService.js"
import CommentRepo from "../repository/CommentRepo.js"
import { requireAuth } from "../middleware/AuthMiddleware.js"

const router = express.Router();

// dependency injection
const commentRepo = new CommentRepo(supabaseAdmin)
const commentService = new CommentService(commentRepo);
const commentController = new CommentController(commentService)

// routes
router.post("/add", requireAuth ,commentController.addComment);
router.get("/:id", requireAuth ,commentController.getCommentById);
router.get("/projectId/:id", requireAuth ,commentController.getCommentByProjectId);
router.put("/update/:id", requireAuth ,commentController.updateComment);
router.delete("/delete/:id", requireAuth ,commentController.deleteProject);

export default router;