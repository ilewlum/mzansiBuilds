// Route definitions for Project-related endpoints

import express from "express";
import ProjectController from "../controller/ProjectController.js";
import ProjectService from "../service/ProjectService.js";
import ProjectRepo from "../repository/ProjectRepo.js";
import supabase from "../config/supabaseClient.js";

const router = express.Router();

// dependency injection
const projectRepo = new ProjectRepo(supabase);
const projectService = new ProjectService(projectRepo);
const projectController = new ProjectController(projectService);

// routes
router.post("/add", projectController.createProject);
router.get("/:id", projectController.getProjectById);
router.get("/user/:id", projectController.getProjectByUserId);
router.get("/", projectController.getAllPublicProjects);
router.put("/update/:id", projectController.updateProject);
router.delete("/delete/:id", projectController.deleteProject);

export default router;