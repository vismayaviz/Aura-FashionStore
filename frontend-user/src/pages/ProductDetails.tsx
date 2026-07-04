import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import ProductGallery from "../components/products/ProductGallery";
import ProductInfo from "../components/products/ProductInfo";
import type { Product } from "../types/product";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] =
    useState<Product | null>(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const res =
          await api.get<Product>(
            `/products/${id}`
          );
        setProduct(res.data);
      } catch {
        toast.error(
          "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="container-custom py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="skeleton h-[360px] md:h-[600px] rounded-2xl" />
          <div className="space-y-5">
            <div className="skeleton h-10 w-3/4 rounded-lg" />
            <div className="skeleton h-8 w-40 rounded-lg" />
            <div className="skeleton h-28 rounded-lg" />
            <div className="skeleton h-12 w-56 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold">
          Product not found
        </h1>
        <Link
          to="/"
          className="btn-primary inline-block mt-6"
        >
          Back to shop
        </Link>
      </section>
    );
  }

  return (
    <section className="container-custom py-10 md:py-16">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery
          images={product.images}
          title={product.title}
        />
        <ProductInfo product={product} />
      </div>
    </section>
  );
};

export default ProductDetails;
