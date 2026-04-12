import express from "express"
import CollaborationController from "../controller/CollaborationController.js"
import CollaborationService from "../service/CollaborationService.js"
import CollaborationRepo from "../repository/CollaborationRepo.js"
import { requireAuth } from "../middleware/AuthMiddleware.js"

const router = express.Router();

// dependency injection
const collaborationRepo = new CollaborationRepo()
const collaborationService = new CollaborationService(collaborationRepo);
const collaborationController = new CollaborationController(collaborationService)

// routes
router.post("/add", requireAuth ,collaborationController.requestCollaboration);
router.get("/:id", requireAuth ,collaborationController.getCollaborationById);
router.get("/projectId/:id", requireAuth ,collaborationController.getProjectCollaborations);
router.get("/userId/:id", requireAuth ,collaborationController.getUserCollaborations);
router.put("/update/:id", requireAuth ,collaborationController.updateCollaboration);
router.delete("/delete/:id", requireAuth ,collaborationController.deleteCollaboration);

export default router;