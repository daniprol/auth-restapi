import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
// Importamos rutas
import productRoutes from "./routes/products.routes";

const app = express();

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

app.use("/products", productRoutes);
export default app;
