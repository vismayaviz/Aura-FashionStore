import { useEffect, useState } from "react";

import api from "../../api/axios";

import ProductCard from "../products/ProductCard";

import type { Product } from "../../types/product";

const NewArrivals = () => {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          const res =
            await api.get<Product[]>(
              "/products"
            );

          setProducts(
            res.data
          );
        } catch (
          error
        ) {
          console.log(
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container-custom">
          <div className="skeleton h-10 w-56 rounded-lg mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="skeleton h-96 rounded-2xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">

      <div className="container-custom">

        <h2 className="text-4xl font-bold mb-10">

          All Products

        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {products.map(
            (product) => (
              <ProductCard
                key={
                  product._id
                }
                product={
                  product
                }
              />
            )
          )}

        </div>

      </div>

    </section>
  );
};

export default NewArrivals;
