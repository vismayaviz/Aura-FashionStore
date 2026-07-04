import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { categoryService } from "../services/categoryService";
import { productService } from "../services/productService";
import { StateBlock } from "../components/ui/StateBlock";
import { TableContainer } from "../components/ui/TableContainer";
import { getErrorMessage } from "../utils/apiError";
import { useToast } from "../hooks/useToast";
import type { CategoryItem } from "../types/category";
import type { ProductItem} from "../types/product";

// Create an interface that maps our form tracking structure using actual File objects
interface ProductFileFormValues {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: File[];
}

const defaultFormValues: ProductFileFormValues = {
  title: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
  images: [],
};

export const Products = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [formValues, setFormValues] = useState<ProductFileFormValues>(defaultFormValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  if (formOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [formOpen]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        setProducts(productsResponse);
        setCategories(categoriesResponse);
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load products"));
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const openNewProductForm = () => {
    setSelectedProduct(null);
    setFormValues(defaultFormValues);
    setFormOpen(true);
  };

  const openEditProductForm = (product: ProductItem) => {
    setSelectedProduct(product);
    setFormValues({
      title: product.title,
      description: product.description,
      price: product.price,
      category:
        !product.category
          ? ""
          : typeof product.category === "string"
          ? product.category
          : product.category._id,
      stock: product.stock,
      images: [], // Keep array empty unless uploading replacements
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setSelectedProduct(null);
    setFormValues(defaultFormValues);
    setError(null);
  };

  const getCategoryName = (product: ProductItem) => {
    if (!product.category) {
      return "Uncategorized";
    }

    if (typeof product.category !== "string") {
      return product.category?.name || "Uncategorized";
    }

    return (
      categories.find((category) => category._id === product.category)
        ?.name ?? "Uncategorized"
    );
  };

  const handleFormChange = (
    key: keyof Omit<ProductFileFormValues, "images">,
    value: string | number
  ) => {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  // 🟢 Append chosen files into local component state
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFormValues((current) => ({
        ...current,
        images: [...current.images, ...selectedFiles],
      }));
    }
  };

  // 🟢 Remove item out of selected files array list queue
  const handleRemoveImage = (indexToRemove: number) => {
    setFormValues((current) => ({
      ...current,
      images: current.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formValues.title.trim() || !formValues.description.trim()) {
      setError("Please complete all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      // 🟢 1. Build Multi-part Form Data payload body payload context
      const formDataPayload = new FormData();
      formDataPayload.append("title", formValues.title);
      formDataPayload.append("description", formValues.description);
      formDataPayload.append("price", String(formValues.price));
      formDataPayload.append("category", formValues.category);
      formDataPayload.append("stock", String(formValues.stock));

      // Append files directly into backend's multi-file processing field array key
      formValues.images.forEach((fileItem) => {
        formDataPayload.append("images", fileItem);
      });

      // 🟢 2. Send multi-part header structure payload to backend services
      const product = selectedProduct
        ? await productService.update(selectedProduct._id, formDataPayload)
        : await productService.create(formDataPayload);

      const category =
        categories.find((item) => item._id === formValues.category) ??
        formValues.category;
      const hydratedProduct: ProductItem = {
        ...product,
        category,
      };

      setProducts((current) => {
        if (selectedProduct) {
          return current.map((item) =>
            item._id === hydratedProduct._id ? hydratedProduct : item
          );
        }
        return [hydratedProduct, ...current];
      });

      showToast({
        title: selectedProduct ? "Product updated" : "Product created",
        description: `${hydratedProduct.title} is ready in the catalog.`,
        variant: "success",
      });
      closeForm();
    } catch (err) {
      const message = getErrorMessage(err, "Failed to save product");
      setError(message);
      showToast({
        title: "Product save failed",
        description: message,
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await productService.delete(id);
      setProducts((current) => current.filter((item) => item._id !== id));
      showToast({
        title: "Product deleted",
        variant: "success",
      });
    } catch (err) {
      const message = getErrorMessage(err, "Failed to delete product");
      setError(message);
      showToast({
        title: "Delete failed",
        description: message,
        variant: "error",
      });
    }
  };

  const productRows = products.map((product) => (
    <tr key={product._id} className="border-b border-slate-200 last:border-none">
      <td className="px-4 py-4 text-sm text-slate-700">{product.title}</td>
      <td className="px-4 py-4 text-sm text-slate-700">{getCategoryName(product)}</td>
      <td className="px-4 py-4 text-sm text-slate-700">${product.price.toFixed(2)}</td>
      <td className="px-4 py-4 text-sm text-slate-700">{product.stock}</td>
      <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">{new Date(product.createdAt).toLocaleDateString()}</td>
      <td className="px-4 py-4 text-right text-sm text-slate-700">
        <button
          type="button"
          onClick={() => openEditProductForm(product)}
          className="mr-2 inline-flex items-center gap-2 rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        <button
          type="button"
          onClick={() => handleDelete(product._id)}
          className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Manage products</p>
          <h2 className="text-2xl font-semibold text-slate-950">Products</h2>
        </div>
        <button
          type="button"
          onClick={openNewProductForm}
          className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <StateBlock>Loading products...</StateBlock>
      ) : error ? (
        <StateBlock tone="error">{error}</StateBlock>
      ) : products.length === 0 ? (
        <StateBlock>No products found.</StateBlock>
      ) : (
        <TableContainer>
          <table className="min-w-full border-collapse text-left text-slate-700">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.24em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Title</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Stock</th>
                <th className="px-4 py-4">Created</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>{productRows}</tbody>
          </table>
        </TableContainer>
      )}

      {formOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    onClick={closeForm}
  >
    <div
      className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">
                {selectedProduct ? "Edit Product" : "Add Product"}
              </h3>
              <p className="text-sm text-slate-500">
                {selectedProduct ? "Update the product details." : "Fill the fields to create a new product."}
              </p>
            </div>
            <button
  type="button"
  onClick={closeForm}
  className="absolute right-6 top-6 rounded-full p-2 transition hover:bg-slate-100"
>
  <X className="h-5 w-5" />
</button>
          </div>

          <form className="grid gap-6" onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Title
                <input
                  value={formValues.title}
                  onChange={(event) => handleFormChange("title", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Category
                <select
                  value={formValues.category}
                  onChange={(event) => handleFormChange("category", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2 text-sm text-slate-700">
              Description
              <textarea
                value={formValues.description}
                onChange={(event) => handleFormChange("description", event.target.value)}
                rows={4}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
            </label>

            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                Price
                <input
                  type="number"
                  value={formValues.price}
                  onChange={(event) => handleFormChange("price", Number(event.target.value))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                Stock
                <input
                  type="number"
                  value={formValues.stock}
                  onChange={(event) => handleFormChange("stock", Number(event.target.value))}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </label>
            </div>

            {/* 🟢 REPLACED: URL list block replaced with a Native File Attachment Picker Block */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-slate-900">Upload Product Images</p>
                <p className="text-xs text-slate-500">Select one or multiple images to showcase this product item catalog collection.</p>
              </div>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm outline-none text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-950 file:text-white hover:file:bg-slate-800 cursor-pointer"
              />

              {/* Display a list of files that are ready to be uploaded */}
              {formValues.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formValues.images.map((file, idx) => (
                    <div key={idx} className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-700 font-medium">
                      <span className="truncate max-w-[180px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error ? (
              <div className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Saving..." : selectedProduct ? "Update Product" : "Create Product"}
            </button>
          </form>
           </div>
  </div>
)}
    </div>
  );
};

export default Products;