import express from "express"
import CollaborationController from "../controller/CollaborationController.js"
import CollaborationService from "../service/CollaborationService.js"
import CollaborationRepo from "../repository/CollaborationRepo.js"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

// dependency injection
const collaborationRepo = new CollaborationRepo(supabase)
const collaborationService = new CollaborationService(collaborationRepo);
const collaborationController = new CollaborationController(collaborationService)

// routes
router.post("/add", collaborationController.requestCollaboration);
router.get("/:id", collaborationController.getCollaborationById);
router.get("/projectId/:id", collaborationController.getProjectCollaborations);
router.get("/userId/:id", collaborationController.getUserCollaborations);
router.put("/update/:id", collaborationController.updateCollaboration);
router.delete("/delete/:id", collaborationController.deleteCollaboration);

export default router;