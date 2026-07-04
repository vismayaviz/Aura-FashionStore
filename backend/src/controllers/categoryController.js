import Category from "../models/Category.js";

export const createCategory = async (
  req,
  res
) => {
  try {
    const { name } = req.body;

    const category =
      await Category.create({
        name,
        slug: name
          .toLowerCase()
          .replaceAll(" ", "-")
      });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getCategories = async (
  req,
  res
) => {
  const categories =
    await Category.find();

  res.json(categories);
};

export const deleteCategory = async (
  req,
  res
) => {
  await Category.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Category deleted"
  });
};