import User from "../models/User";
import jwt from "jsonwebtoken";
import config from "../config";
import Role from "../models/Role";

export const signUp = async (req, res) => {
  const { username, email, password, roles } = req.body;
  // console.log(req.body);
  //   res.json("signup");
  // Buscamos si el usuario existe en la base de datos
  // const userFound = User.find({email})

  const newUser = new User({
    username,
    email,
    password: await User.encryptPassword(password),
  });

  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } }); // Esto devuelve un array con los roles existentes
    newUser.roles = foundRoles.map((role) => role._id); // solo necesitamos el id del rol
  } else {
    const role = await Role.findOne({ name: "user" }); // Si el usuario no tiene ningún rol asignado le damos uno por defecto
    newUser.roles = [role._id];
  }
  // IMPORTANTE: sino pones 'await' al cifrado de la contraseña no le va a dar tiempo y no va a guardar nada
  // NOTA: hemos creado el usuario pero aún no lo hemos guardado
  const savedUser = await newUser.save();
  console.log(newUser);
  // res.status(200).json(newUser);
  // No vamos a devolver el json con la información del usuario sino que vamos a devolver un token con todo esto:
  const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
    expiresIn: 86400, // 24 hours
  });
  res.status(200).json({ token });
};

export const signIn = async (req, res) => {
  // res.json("signin");
  const userFound = await User.findOne({
    email: req.body.email,
  }).populate("roles");

  if (!userFound) return res.status(400).json({ message: "User not found" });
  if (userFound && !req.body.password)
    return res.status(400).json({ message: "You must specify a password!" });
  // Si se encuentra un usuario:
  const matchPassword = await User.comparePassword(
    req.body.password, // Primero ponemos  ingresada por el usuario
    userFound.password // Ahora la contraseña almacenada en la base de datos
  );

  if (!matchPassword) {
    return res.status(401).json({ token: null, message: "Invalid password" });
  }
  console.log(userFound._id);
  // Vamos a devolver la información del usuario pero firmada:
  const token = jwt.sign({ id: userFound._id }, config.SECRET, {
    expiresIn: 86400,
  });
  res.json({ token });
};
