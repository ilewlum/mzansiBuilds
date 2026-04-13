// Route definitions for milestone-related endpoints, mapping HTTP requests to MilestoneController methods.

import express from "express"
import MilestoneController from "../controller/MilestoneController.js"
import MilestoneService from "../service/MilestoneService.js"
import MilestoneRepo from "../repository/MilestoneRepo.js"
import { requireAuth } from "../middleware/AuthMiddleware.js"

const router = express.Router();

// dependency injection
const milestoneRepo = new MilestoneRepo()
const milestoneService = new MilestoneService(milestoneRepo);
const milestoneController = new MilestoneController(milestoneService)

// routes
router.post("/add", requireAuth, milestoneController.createMilestone);
router.get("/:id", requireAuth,milestoneController.getMilestoneById);
router.get("/projectId/:id", requireAuth,milestoneController.getMilestoneByProjectId);
router.put("/update/:id", requireAuth,milestoneController.updateMilestone);
router.delete("/delete/:id", requireAuth,milestoneController.deleteMilestone);

export default router;