import Role from "../models/Role";

// Llamaremos a esta función cuando se inicie la aplicación
export const createRoles = async () => {
  try {
    // Vamos a contar cuantos roles hay:
    const count = await Role.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "moderator" }).save(),
      new Role({ name: "admin" }).save(),
    ]);
  } catch (error) {
    console.log(error);
  }
};
