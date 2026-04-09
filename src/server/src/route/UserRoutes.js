// Route definitions for User-related endpoints

import express from "express";
import UserController from "../controller/UserController.js";
import UserService from "../service/UserService.js";
import UserRepo from "../Repository/UserRepo.js";
import supabase from "../config/supabaseClient.js";

const router = express.Router();

// dependency injection
const userRepo = new UserRepo(supabase);
const userService = new UserService(userRepo);
const userController = new UserController(userService);

// routes
router.post("/add", userController.createUser);
router.get("/:id", userController.getUserById);
router.get("/", userController.getAllUsers);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

export default router;