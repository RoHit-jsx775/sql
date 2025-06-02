import { Request, Response, NextFunction } from "express";
import { SqlOrderModel } from "../sql-models/order";
import { SqlProductModel } from "../sql-models/product-sql-model";
import { SqlUserModel } from "../sql-models/usermodel";


function validateOrderInput(body: any) {
  if (typeof body.userId !== "number") {
    return "userId must be a number";
  }
  if (!Array.isArray(body.productIds) || body.productIds.length === 0) {
    return "productIds must be a non-empty array";
  }
  // Check if user exists
  if (!SqlUserModel.getById(body.userId)) {
    return "User does not exist";
  }
  // Check if all products exist
  for (const pid of body.productIds) {
    if (!SqlProductModel.getById(pid)) {
      return `Product with id ${pid} does not exist`;
    }
  }
  return null;
}
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, productIds } = req.body;
  const error = validateOrderInput(req.body);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }
  try {
    const order = await SqlOrderModel.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }

};
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  const id = parseInt(req.params.id);
  console.log("Fetching order with id:", id);
  try {
    const order = await SqlOrderModel.getorderById(id);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  try {
    const orders = await SqlOrderModel.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}
export const updateorderbyId = async (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  const id = parseInt(req.params.id);
  const { userId, productIds } = req.body;
  const error = validateOrderInput(req.body);
  if (error) {
    res.status(400).json({ message: error });
    return;
  }
  try {
    const updatedOrder = await SqlOrderModel.updateOrderbyId(id, { userId, productIds });
    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
}
export const deleteOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  const id = parseInt(req.params.id);
  try {
    await SqlOrderModel.deleteOrderById(id);
    res.status(200).json({ message: `Order with id ${id} deleted successfully` });
  } catch (error) {
    next(error);
  }
} 