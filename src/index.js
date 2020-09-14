import app from "./app";
// Importamos db para que se inicialice también
import "./database";

app.listen(3000, () => console.log("Server listening on port", 3000));
