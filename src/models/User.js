import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        ref: "Role",
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    versionkey: false,
  }
);

// Statics: formas de llamar a un método sin tener que instanciar el objeto (metodos estáticos que son iguales para todas las instancias)
userSchema.statics.encryptPassword = async (password) => {
  // Generamos el algoritmo
  const salt = await bcrypt.genSalt(10);
  // Retornamos la contraseña cifrada
  return await bcrypt.hash(password, salt);
};
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword); // retornamos True o False dependiendo de si coninciden
};
export default model("User", userSchema);
