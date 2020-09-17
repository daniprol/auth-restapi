import { Router } from "express";
import * as productsCtrl from "../controllers/products.controller";
const router = Router();

// Importamos los middlewares
import { authJwt } from "../middlewares";

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isModerator],
  productsCtrl.createProduct
); // Es necesario el rol de moderador para crear un producto
router.get(
  "/",
  //   [authJwt.verifyToken, authJwt.isModerator],
  productsCtrl.getProducts
);
router.get(
  "/:productId",
  //   [authJwt.verifyToken, authJwt.isModerator],
  productsCtrl.getProductById
);
router.put(
  "/:productId",
  [authJwt.verifyToken, authJwt.isAdmin],
  productsCtrl.updateProductById
);
router.delete(
  "/:productId",
  [authJwt.verifyToken, authJwt.isAdmin],
  productsCtrl.deleteProductById
);
export default router;
