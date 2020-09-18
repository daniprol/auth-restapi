import { Router } from "express";
import { verify } from "jsonwebtoken";
const router = Router();

// Importamos las funciones "controladores"
import * as authCtrl from "../controllers/auth.controller";
import { verifySignup } from "../middlewares";

router.post(
  "/signup",
  [verifySignup.checkDuplicateUserOrEmail, verifySignup.checkRoleExists],
  authCtrl.signUp
);
router.post("/signin", authCtrl.signIn);

export default router;
