export interface CategoryItem {
  slug: string;
  name: string;
  image: string;
  description: string;
}

export const categories: CategoryItem[] = [
  {
    slug: "men",
    name: "Men",
    image:
      "https://i.pinimg.com/vwebp/1200x/16/29/f3/1629f3202d88f8916ecfbb7339cc5dd0.webp",
    description: "Nostalgic threads for the modern gentleman.",
  },
  {
    slug: "women",
    name: "Women",
    image:
      "https://i.pinimg.com/736x/5b/3a/29/5b3a29d3bd8c6fdeafe08694e079c58e.jpg",
    description: "Timeless elegance with a contemporary twist.",
  },
  {
    slug: "shoes",
    name: "Shoes",
    image:
      "https://i.pinimg.com/vwebp/1200x/a7/dd/7e/a7dd7e2d184936016f9f993903d40cdd.webp",
    description: "Step into the past with modern flair.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    image:
      "https://i.pinimg.com/736x/50/73/c6/5073c6425ba0ec9b7702f32cb857121f.jpg",
    description: "Make a statement with curated vintage pieces.",
  },
];
