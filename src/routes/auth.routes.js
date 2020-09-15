import { Router } from "express";
const router = Router();

// Importamos las funciones "controladores"
import * as authCtrl from "../controllers/auth.controller";

router.post("/signup", authCtrl.signUp);
router.post("/signin", authCtrl.signIn);

export default router;
