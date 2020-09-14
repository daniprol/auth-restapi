import Product from "../models/Product";

export const createProduct = async (req, res) => {
  //  console.log(req.body); // En caso de haber enviado un JSON ya podemos imprimirlo en pantalla con esto solo
  const { name, category, price, imgURL } = req.body;
  // console.log(name, category, price, imgURL);
  // res.json("Creating product");
  const newProduct = new Product({ name, category, price, imgURL });

  // console.log(newProduct);
  // Cuando guardamos datos en mongodb se nos devuelve el objeto creado
  const productSaved = await newProduct.save(); // Esto tarda tiempo en guardarse en la base de datos
  res.status(201).json(productSaved);
  console.log("Product saved", productSaved);
};

export const getProducts = async (req, res) => {
  // res.json("GET products");
  const products = await Product.find();
  res.json(products);
};

export const getProductById = async (req, res) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  res.status(200).json(product);
};

export const updateProductById = async (req, res) => {
  const productId = req.params.productId;
  const newProduct = req.body;
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    newProduct,
    {
      new: true,
    }
  );
  console.log("Updated product", updatedProduct);
  res.status(200).json(updatedProduct);
};

export const deleteProductById = async (req, res) => {
  const productId = req.params.productId;
  const deletedProduct = await Product.findByIdAndDelete(productId);
  console.log("Deleted Product", deletedProduct);
  res.status(200).send(`${deletedProduct.name} (ID: ${productId} ) deleted`);
};
