import express, { Request,Response } from "express"; 


const router= express.Router();
import { getAllUsersController, getUserByIdController,createUserController, updateUserController, deleteUserController } from "../controllers/userController";
router.get("/",getAllUsersController);
router.get("/:id",getUserByIdController); 
router.post("/",createUserController);
router.put("/:id",updateUserController);
router.delete("/:id",deleteUserController);  
export default router;