import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/72/38/a1/7238a1e183e1af652edca7269463bb84.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent" />
      <div className="container-custom relative py-28 md:py-32 lg:py-36">
        <div className="max-w-3xl space-y-6">
          <span className="inline-block text-sm uppercase tracking-[0.4em] text-gray-300">
            Vintage Collection
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
            Curating one-of-a-kind vintage fashion for the modern wardrobe
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-gray-200 leading-relaxed">
             Discover handpicked, one-of-a-kind clothing from the '70s, '80s, '90s, and Y2K.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 ">
            <button
              type="button"
              onClick={() => navigate("/new-arrivals")}
              className="btn-primary text-sm sm:text-base hover:bg-white hover:text-black transition duration-300"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
