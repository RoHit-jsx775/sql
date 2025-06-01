import { Request, Response } from "express";
import { SqlCategoryModel } from "../sql-models/category";

export const getAllCategoryController = async (req: Request, res: Response) => {
  const categories = await SqlCategoryModel.getAll();
  res.status(200).json(categories);

  res.status(500).json({ error: "Failed to fetch categories" });
};

export const getCategoryByIdController = async (
  req: Request,
  res: Response
) => {
  const id = parseInt(req.params.id);
  const category = await SqlCategoryModel.getById(id);

  if (!category) {
    return res.status(404).json({ error: "Category not found" });
  }
  res.status(200).json(category);
};

export const createCategoryController = async (req: Request, res: Response) => {
  const { name } = req.body;
 const create= await SqlCategoryModel.createCategory({
    name,
  });
  res.json(create);
};
export const updateCategoryController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  try {
    const updatedCategory = await SqlCategoryModel.update(id, {
      name,
    });
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    console.error("Update error:", error.message || error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await SqlCategoryModel.DeleteById(id);
    res
      .status(200)
      .json({ message: `Product with id ${id} deleted successfully` });
  } catch (error) {
    res.status(404).json({ error: `Product with id ${id} not found` });
  }
};
