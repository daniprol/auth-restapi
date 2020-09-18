import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
// Importamos rutas
import productRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
// Importamos el setup inicial para los roles de usuario
import { createRoles } from "./libs/initialSetup";
const app = express();
// Nada más iniciarse la aplicación se llama a la función que crea los roles
// Nótese que la conexión con la base de datos ya se hace en index.js
createRoles();

app.set("pkg", pkg);
// Morgan middleware
app.use(morgan("dev"));

// Para que el servidor de express pueda leer las peticiones que llegan en formato JSON:
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
export default app;
