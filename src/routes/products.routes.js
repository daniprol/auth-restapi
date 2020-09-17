import { Router } from "express";
import * as productsCtrl from "../controllers/products.controller";
const router = Router();

// Importamos los middlewares
import { verifyToken } from "../middlewares";
router.post("/", verifyToken, productsCtrl.createProduct);
router.get("/", verifyToken, productsCtrl.getProducts);
router.get("/:productId", productsCtrl.getProductById);
router.put("/:productId", productsCtrl.updateProductById);
router.delete("/:productId", productsCtrl.deleteProductById);
export default router;
