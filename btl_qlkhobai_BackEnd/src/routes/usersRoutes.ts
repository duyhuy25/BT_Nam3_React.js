import { Router } from "express";
import {
  getUser,
  addUser,
  updateUser,
  deleteUser,
  searchUser,
  login,
} from "../controllers/usersController";

const router = Router();

router.get("/user", getUser);           
router.get("/user/search", searchUser); 
router.post("/login", login);
router.post("/adduser", addUser);       
router.put("/user/:id", updateUser);    
router.delete("/user/:id", deleteUser);

export default router;