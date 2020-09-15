import User from "../models/User";

export const signUp = async (req, res) => {
  const { username, email, password, roles } = req.body;
  console.log(req.body);
  //   res.json("signup");
  // Buscamos si el usuario existe en la base de datos
  const user = new User({ username, email, password, roles });
  //   res.sendStatus(200);
};

export const signIn = async (req, res) => {
  res.json("signin");
};
