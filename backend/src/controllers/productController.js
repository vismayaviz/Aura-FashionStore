import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(
        file => `/uploads/${file.filename}`
      );
    }

    const product = await Product.create({
      ...req.body,
      images: imagePaths,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  const products = await Product.find()
    .populate("category")
    .sort({ createdAt: -1 });
  res.json(products);
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  res.json(product);
};

export const updateProduct = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // 🟢 If new files were supplied, capture them and overwrite or append the image array
    if (req.files && req.files.length > 0) {
      const newImagePaths = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = newImagePaths;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};