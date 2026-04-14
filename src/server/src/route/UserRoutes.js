// Route definitions for User-related endpoints

import express from "express";
import UserController from "../controller/UserController.js";
import UserService from "../service/UserService.js";
import UserRepo from "../repository/UserRepo.js";
import { supabaseAdmin } from "../config/supabaseClient.js";
import { requireAuth } from "../middleware/AuthMiddleware.js"

const router = express.Router();

// dependency injection
const userRepo = new UserRepo(supabaseAdmin);
const userService = new UserService(userRepo);
const userController = new UserController(userService);

// routes
router.post("/add",userController.createUser);
router.get("/:id",requireAuth, userController.getUserById);
router.get("/", requireAuth ,userController.getAllUsers);
router.put("/update/:id", requireAuth ,userController.updateUser);
router.delete("/delete/:id", requireAuth ,userController.deleteUser);

export default router;