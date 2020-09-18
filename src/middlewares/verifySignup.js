import { ROLES } from "../models/Role";
import User from "../models/User";

// Función para validar los roles que presenta el usuario
export const checkRoleExists = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(404).json({
          message: `Role ${req.body.roles[i]} does not exist!`,
        });
      }
    }
  }

  return next();
};

export const checkDuplicateUserOrEmail = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username });

  if (user)
    return res.status(400).json({ message: "The username already exists" });

  const email = await User.findOne({ email: req.body.email });

  if (email)
    return res.status(400).json({ message: "The email is already in use!" });

  return next();
};
