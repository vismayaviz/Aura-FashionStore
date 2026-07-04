import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import ProductCard from "../components/products/ProductCard";
import { categories } from "../data/categories";
import type { Product } from "../types/product";

const Category = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const category = categories.find(
    (item) => item.slug === slug
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get<Product[]>("/products");
        setProducts(
          res.data.filter(
            (product) =>
              product.category?.slug === slug
          )
        );
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, [slug]);

  return (
    <section className="container-custom py-10 md:py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="rounded-[2rem] overflow-hidden bg-cover bg-center p-10 text-white"
            style={{
              backgroundImage:
                `url('https://i.pinimg.com/736x/a1/39/8e/a1398e31fe615b3ef2e2bd8474f9fd00.jpg')`,
            }}
          >
            <span className="uppercase tracking-[0.4em] text-sm text-gray-200 opacity-90">
              {category?.name ?? "Category"}
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold">
              {category?.name ?? "Explore"}
            </h1>
            <p className="mt-4 max-w-xl text-gray-200">
              {category?.description ?? "Browse our premium collection."}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <Link to="/" className="hover:text-black">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-900">
              {category?.name ?? "Category"}
            </span>
          </div>
        </div>

        <aside className="hidden lg:block rounded-2xl border border-neutral-100 bg-neutral-50/50 backdrop-blur-sm p-8 transition-all duration-300 hover:border-neutral-200 hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
  <h2 className="text-lg font-bold tracking-tight text-neutral-900 uppercase tracking-[0.2em] mb-4">
    Curated Style Guide
  </h2>
  <p className="text-neutral-500 text-sm leading-relaxed font-light">
    Explore refined pieces that blend premium craftsmanship with modern silhouettes.
  </p>
  
  {/* A minimalist divider line fitting the luxury aesthetic */}
  <div className="w-12 h-[1px] bg-neutral-950 my-6" />

  <div className="space-y-3.5 text-xs font-medium tracking-wide text-neutral-800 uppercase">
    <div className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
      <p>Limited edition offers</p>
    </div>
    <div className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
      <p>Free express shipping</p>
    </div>
    <div className="flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
      <p>Easy returns within 14 days</p>
    </div>
  </div>
</aside>
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6">
          {category?.name ?? "Category"} Pieces
        </h2>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="skeleton h-96 rounded-[2rem]"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-luxury">
            <h3 className="text-2xl font-semibold">No products found</h3>
            <p className="text-gray-500 mt-3">
              Try a different collection or return to the shop.
            </p>
            <Link to="/" className="btn-primary mt-6 inline-block">
              Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
