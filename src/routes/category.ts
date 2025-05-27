import express, { Request, Response, NextFunction } from "express";
import {  getAllCategoryController, getCategoryByIdController,createCategoryController,updateCategoryController,deleteCategoryController} from "../controllers/category";
const router = express.Router();
router.get("/",    getAllCategoryController);
router.get("/:id",getCategoryByIdController);
router .post("/", createCategoryController);
router.put("/:id",updateCategoryController);
router.delete("/:id",deleteCategoryController);

export default router;
