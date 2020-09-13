## REST API con identificación, autorización y roles

### Librerías usadas:

1. Express
2. Bcryptjs: cifrado datos (e.g., contraseñas)
3. CORS: comunicar backend con otros servidores.
4. Dotenv: permite crear variables de entorno
5. JWT: pase/contraseñas para usuarios
6. Mongoose: permite crear modelos/esquemas para usar con MongoDB.
7. Helmet: seguridad. Permite evitar que se puedan ver ciertas características del servidor.

8. Babeljs: convierte codigo de JS moderno en código legible por navegadores y NodeJS para poder usar características de ES6 (imports, async/await...). 

   ```shell
   npm i -d  @babel/core @babel/cli @babel/node @babel/preset-env nodemon
   ```

### Usar Babel

Añadir en `package.json` el script:

```json
scripts: {
    "dev1": "babel-node src/index.js",
    "dev": "nodemon src/index.js --exec babel-node", // Para usar con NODEMON
}
```

Crear archivo `.babelrc`

```json
{
  "presets": ["@babel/preset-env"]
}
```

Ahora podemos usar ES6 sin problemas, porque gracias a Babel cualquier entorno antiguo lo va a poder ejecutar.

* Crear **entorno de producción**: usamos script `"build": "babel src --out-dir build"` 

* Ejecutar **entorno de produccion**: usamos script `"start": 'node build/index.js'`

## Express

* Devolver respuesta a una petición en formato json:

```js
(req, res) => {
    res.sendStatus(500).json('Respuesta');
    // .json y .send envían un código 200 por defecto, así que darán un error si lo explicitas!
}
```

* Por defecto, Express no viene preparado para recibir datos en formato JSON. Tenemos que usar un middleware para ello:

```js
app.use(express.json())
```

​	Ahora cada vez que hagamos una petición de tipo POST con cabeceras `"Content-type": "application/json"` ya podemos leer lo que pone, tan solo usando `req.body`

* Guardar una variable en  express: esto permite poder usarlo en cualquier otro endpoint de la aplicación sin tener que volver a importar archivos, etc...

```js
app.set("pkg", pkg); // Guardamos variable como ()'key', value)

app.get("/", (req, res) => {
  res.json({
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version,
  });
});

```

* Conectar enrutador a la applicación principal:

```js
import productRoutes from "./routes/products.routes";
app.use('/products', productRoutes)
```

## MongoDB

Para comprobar si el servicio de MongoDb se encuentra en ejecución usar:

```shell
sudo systemctl status mongod
```

Para poner en marcha/parar el servicio, usar:

```shell
sudo systemctl start mongod
sudo systemctl stop mongod
```

Para que MongoDB se inicie a la vez que el equipo usar:

```shell
sudo systemctl enable mongod
```

* Schema: definición del esquema del modelo.
  * timestamps: `true` así cada vez que se cree un nuevo dato se guardará la fecha de creación también. Esto se guarda en los campos `createdAt`  y  `updatedAt` .
  * versionKey: para que no ponga la barra abajo `_v`
* Model: forma de interactuar con la base de datos

## Postman

* Peticiones HTTP de tipo POST:

  ```
  "Content-type": "application/json"
  ```

  