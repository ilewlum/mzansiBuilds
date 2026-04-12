// Route definitions for Project-related endpoints

import express from "express";
import ProjectController from "../controller/ProjectController.js";
import ProjectService from "../service/ProjectService.js";
import ProjectRepo from "../repository/ProjectRepo.js";
import { supabaseAdmin } from "../config/supabaseClient.js";
import { requireAuth } from "../middleware/AuthMiddleware.js"

const router = express.Router();

// dependency injection
const projectRepo = new ProjectRepo(supabaseAdmin);
const projectService = new ProjectService(projectRepo);
const projectController = new ProjectController(projectService);

// routes
router.post("/add", requireAuth ,projectController.createProject);
router.get("/:id", requireAuth ,projectController.getProjectById);
router.get("/user/:id", requireAuth ,projectController.getProjectByUserId);
router.get("/",projectController.getAllPublicProjects);
router.put("/update/:id", requireAuth ,projectController.updateProject);
router.delete("/delete/:id", projectController.deleteProject);

export default router;