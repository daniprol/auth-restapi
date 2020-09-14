import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1/companydb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("Database is connected"))
  .catch((error) => console.log(error));
