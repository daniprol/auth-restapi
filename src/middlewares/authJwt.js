import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/User";
import Role from "../models/Role";

export const verifyToken = async (req, res, next) => {
  try {
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
  } catch (err) {
    return res.send(401).json({ message: "Unauthorized" });
  }
};

export const isModerator = async (req, res, next) => {
  const user = await User.findById(req.userId); // Guardamos el userId en el middleware anterior
  const roles = await Role.find({ _id: { $in: user.roles } });
  // Me devuelve los objetos de los roles que cumplan que su _id está dentrol del array user.roles
  console.log("Imprimimos los roles del usuario identificado: ", roles);

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "moderator") {
      return next(); // IMPORTANTE: poner 'return' para asegurarnos de que salimos del middleware y no volvemos a él.
    }
  }

  return res
    .status(403)
    .json({ message: "Moderator role is required for this action" });
};
export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId); // Guardamos el userId en el middleware anterior
  const roles = await Role.find({ _id: { $in: user.roles } });
  // Me devuelve los objetos de los roles que cumplan que su _id está dentrol del array user.roles
  console.log("Imprimimos los roles del usuario identificado: ", roles);

  for (let i = 0; i < roles.length; i++) {
    if (roles[i].name === "admin") {
      return next(); // IMPORTANTE: poner 'return' para asegurarnos de que salimos del middleware y no volvemos a él.
    }
  }

  return res
    .status(403)
    .json({ message: "Admin role is required for this action" });
};
