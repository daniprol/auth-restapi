import Product from "../models/Product";

export const createProduct = async (req, res) => {
  //  console.log(req.body); // En caso de haber enviado un JSON ya podemos imprimirlo en pantalla con esto solo
  const { name, category, price, imageURL } = req.body;
  // res.json("Creating product");
  const newProduct = new Product({ name, category, price, imageURL });

  // Cuando guardamos datos en mongodb se nos devuelve el objeto creado
  const productSaved = await newProduct.save(); // Esto tarda tiempo en guardarse en la base de datos
  res.status(201).json(productSaved);
};

export const getProducts = (req, res) => {
  res.json("GET products");
};

export const getProductById = (req, res) => {};

export const updateProductById = (req, res) => {};

export const deleteProductById = (req, res) => {};
