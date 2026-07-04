import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { categoryService } from "../services/categoryService";
import { StateBlock } from "../components/ui/StateBlock";
import { TableContainer } from "../components/ui/TableContainer";
import { getErrorMessage } from "../utils/apiError";
import { useToast } from "../hooks/useToast";
import type { CategoryItem } from "../types/category";

export const Categories = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(await categoryService.getAll());
      } catch (err) {
        setError(getErrorMessage(err, "Unable to load categories"));
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    setSubmitting(true);

    try {
      const category = await categoryService.create({ name });
      setCategories((current) => [category, ...current]);
      setName("");
      showToast({
        title: "Category created",
        description: `${category.name} is now available.`,
        variant: "success",
      });
    } catch (err) {
      const message = getErrorMessage(err, "Failed to create category");
      setError(message);
      showToast({
        title: "Category save failed",
        description: message,
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this category?")) {
      return;
    }

    try {
      await categoryService.delete(id);
      setCategories((current) => current.filter((item) => item._id !== id));
      showToast({
        title: "Category deleted",
        variant: "success",
      });
    } catch (err) {
      const message = getErrorMessage(err, "Failed to delete category");
      setError(message);
      showToast({
        title: "Delete failed",
        description: message,
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Manage categories</p>
          <h2 className="text-2xl font-semibold text-slate-950">Categories</h2>
        </div>
        <form className="flex w-full max-w-md gap-3" onSubmit={handleCreate}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="New category name"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none focus:border-slate-400"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>
      </div>

      {loading ? (
        <StateBlock>Loading categories...</StateBlock>
      ) : error ? (
        <StateBlock tone="error">{error}</StateBlock>
      ) : categories.length === 0 ? (
        <StateBlock>No categories created yet.</StateBlock>
      ) : (
        <TableContainer>
          <table className="min-w-full border-collapse text-left text-slate-700">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.24em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Slug</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-slate-200 last:border-none">
                  <td className="px-4 py-4 text-sm text-slate-700">{category.name}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">{category.slug}</td>
                  <td className="px-4 py-4 text-right text-sm text-slate-700">
                    <button
                      type="button"
                      onClick={() => handleDelete(category._id)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}
    </div>
  );
};
