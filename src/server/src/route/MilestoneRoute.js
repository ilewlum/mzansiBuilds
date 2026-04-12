import express from "express"
import MilestoneController from "../controller/MilestoneController.js"
import MilestoneService from "../service/MilestoneService.js"
import MilestoneRepo from "../repository/MilestoneRepo.js"
import supabase from "../config/supabaseClient.js"

const router = express.Router();

// dependency injection
const milestoneRepo = new MilestoneRepo(supabase)
const milestoneService = new MilestoneService(milestoneRepo);
const milestoneController = new MilestoneController(milestoneService)

// routes
router.post("/add", milestoneController.createMilestone);
router.get("/:id", milestoneController.getMilestoneById);
router.get("/projectId/:id", milestoneController.getMilestoneByProjectId);
router.put("/update/:id", milestoneController.updateMilestone);
router.delete("/delete/:id", milestoneController.deleteMilestone);

export default router;