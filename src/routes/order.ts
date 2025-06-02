import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getAllOrders,
updateorderbyId,
  deleteOrderById,
} from "../controllers/order";
import { get } from "http";



const router = Router();
router.post("/", createOrder);
router.get("/:id",getOrderById)
router.get("/", getAllOrders);
router.put("/:id",updateorderbyId)
router.delete("/:id", deleteOrderById);

export default router;
