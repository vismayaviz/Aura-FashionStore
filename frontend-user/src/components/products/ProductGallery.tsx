import { useState } from "react";

interface Props {
  images: string[];
  title: string;
}

// 🟢 Point this to your backend server port instance
const API_BASE_URL = "http://localhost:5000";

const ProductGallery = ({ images, title }: Props) => {
  const [activeImage, setActiveImage] = useState(0);

  // Fallback to empty string if array is empty
  const rawImage = images[activeImage] ?? images[0] ?? "";

  // 🟢 Helper function to correctly format locally hosted image paths
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    if (imagePath.startsWith("/uploads")) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div>
      {/* Main Feature Display Image */}
      <img
        src={getImageUrl(rawImage)}
        alt={title}
        className="w-full h-[360px] md:h-[600px] rounded-2xl object-cover bg-gray-100"
      />

      {/* Thumbnails Row Section */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {images.map((thumbnail, index) => (
            <button
              type="button"
              key={thumbnail}
              onClick={() => setActiveImage(index)}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border flex-none ${
                rawImage === thumbnail
                  ? "border-black"
                  : "border-transparent"
              }`}
            >
              <img
                src={getImageUrl(thumbnail)}
                alt={title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;