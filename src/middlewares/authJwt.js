import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";

export const verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"]; // Cogemos el token del header de la petición.
  console.log("Token: ", token);

  if (!token) return res.status(403).json({ message: "No token provided" });

  const decoded = jwt.verify(token, config.SECRET); // No deberíamos usar aquí un await?????
  console.log("Token decodificado: ", decoded);

  // Guardamos la identidad del token en los headers de la petición
  req.userId = decoded.id;
  const user = await User.findById(req.userId, { password: 0 }); // password: 0 para que no nos devuelva la contraseña!
  console.log("Documento usuario en db (sin password): ", user);
  if (!user) return res.status(404).json({ message: "No user found" });
  next();
};
