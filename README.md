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

## TRICKS:

* Si queremos importar el archivo `../middlewares/index.js` de una carpeta específica solo tenemos que importar la carpeta:

  ```js
  import { verifyToken } from '../middlewares'
  ```

* Añadir una cabecera (*headers*) en una petición HTTP: `req.userId = decodedToken.id` 

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

**IMPORTANTE:** la ruta tiene que empezar por `/`

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

Para comprobar los roles que hay en la base de datos:

```shell
show dbs
use companydb
show collections
db.roles.find()
```



## Mongoose

* Para actualizar datos de un documento:

```js
  const updatedProduct = await Product.findByIdAndUpdate(productId, newProduct, {
    new: true   // Esto hace que se devuelva el producto actualizado y no el original!!
  });
```

* Como relacionar el campo de un *schema* con otro modelo de la misma base de datos.

  ```js
     roles: [
        {
          ref: "Role", // El nombre del modelo al que hacemos referencia
          type: Schema.Types.ObjectId, // El tipo va a a ser un _id de mongodb
        },
      ],
  
  ```

* Si solo quieren enviar un status para la petición HTTP: `res.sendStatus(200)`.

* En el caso de que queramos enviar el status a la vez que una respuesta en json: `res.status(200).json('mensaje en json')` 

* Devolver el valor de un campo en vez del id asociado:

  Usamos la opción **populate("nombre_del_campo")** para que en vez de devolver el `_id` correspondiente, te devuelvan el objeto entero.

  ```js
    const userFound = await User.findOne({
      email: req.body.email,
    }).populate("roles");
  ```

* Si no queremos que se devuelva un campo del documento cuando lo busquemos en la base de datos usamos `{ password: 0 }`:

  ```js
    const user = await User.findById(req.userId, { password: 0 }); // password: 0 para que no nos devuelva la contraseña!
  ```

  

## Postman

* Peticiones HTTP de tipo POST:

  ```
  "Content-type": "application/json"
  ```

  

## Identificación (authentication)

* Cuando creamos un nuevo usuario no podemos guardar la contraseña de forma directa sino que tenemos que cifrarla antes.

  Para ello creamos un método estático en el modelo de usuario: 

  ```js
  userSchema.statics.encryptPassword = async (password) => {
    // Generamos el algoritmo
    const salt = await bcrypt.genSalt(10);
    // Retornamos la contraseña cifrada
    return await bcrypt.hash(password, salt);
  };
  ```

  Después podemos crear ya el nuevo usuario cifrando la contraseña directamente sin guardarla en ningún lado:

  ```js
  const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
      roles,
    });
  
  const savedUser = await newUser.save();
  ```

  Una vez creado el usuario no devolvemos el objeto guardado sino un token con el id:

  ```js
    const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
      expiresIn: 86400, // 24 hours
    });
  ```

  

* **Identificación con JWT:** 

  Lo primero que tenemos que hacer es crear un *middleware* que extraiga el token de los headers de la petición http (en concreto de `x-access-token`) 

   ```js
  const token = req.headers['x-access-token']
   ```

  

  Después tenemos que comprobar que la firma es válida:

  ```js
    const decoded = jwt.verify(token, config.SECRET); // No deberíamos usar aquí un await?????
    console.log(decoded);
  ```

  