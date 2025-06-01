import { Request, Response } from "express";
import { SqlUserModel } from "../sql-models/usermodel";

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await SqlUserModel.getAll();
    res.status(200).json(users);
    
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await SqlUserModel.getById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by id:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    const updatedUser = await SqlUserModel.update(id, { name, email });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};
export const deleteUserController = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await SqlUserModel.deleteById(id);
    res.status(200).json({ message: `User with id ${id} deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(404).json({ error: `User with id ${id} not found` });
  }
};
export const createUserController = (req: Request, res: Response) => {
  const { name, email } = req.body;
  SqlUserModel.createUserDetails({
    name,
    email,
  })
    .then((newuser: any) => {
      res.status(201).json(newuser);
    })
    .catch((error: any) => {
      console.error("Create error:", error.message || error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    });
};