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