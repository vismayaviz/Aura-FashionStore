import { Link } from "react-router-dom";
import { categories } from "../../data/categories";

const FeaturedCategories = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-gray-500 mb-3">
              Featured Categories
            </p>
            <h2 className="text-4xl font-semibold max-w-2xl">
             Flirty, floral, and timeless
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group block overflow-hidden rounded-[2rem] bg-black/5 shadow-luxury transition duration-300 hover:-translate-y-1"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="text-sm uppercase tracking-[0.3em] text-white opacity-90">
                    {category.name}
                  </span>
                  <p className="text-white text-xl font-semibold mt-2 leading-tight">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
