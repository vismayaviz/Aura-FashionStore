import {
  Heart,
  Menu,
  Package,
  Search,
  ShoppingBag,
  X,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartDrawer from "../cart/CartDrawer";
import { useShop } from "../../hooks/useShop";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
import type { Product } from "../../types/product";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // New States for Search Category Dropdown Logic
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { cart, wishlist } = useShop();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount =
    cart?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;

  const wishlistCount = wishlist?.products.length ?? 0;

  // Fetch products for the search menu
  useEffect(() => {
  const loadSearchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get<Product[]>("/products"),
        api.get<Category[]>("/categories"),
      ]);

      setAllProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to load search data", err);
    }
  };

  loadSearchData();
}, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
        setHoveredCategory(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "text-gray-900 font-semibold" : "text-gray-600 hover:text-gray-900";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const BACKEND_URL = "http://localhost:5000";

  const activeCategorySlug = hoveredCategory;

  const filteredCategories =
  searchQuery.trim() === ""
    ? categories
    : categories.filter((cat) =>
        cat.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      const filteredProducts = allProducts.filter((product) => {
  const query = searchQuery.trim().toLowerCase();

  const matchesSearch =
    query === "" ||
    product.title.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query) ||
    product.category?.name?.toLowerCase().includes(query);

  const matchesCategory =
    !activeCategorySlug ||
    product.category?.slug === activeCategorySlug;

  return matchesSearch && matchesCategory;
});

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="container-custom flex h-14 items-center justify-between gap-4">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold tracking-[0.25em] uppercase text-gray-900"
        >
          AURA
        </Link>

        

        {/* Dynamic Search Box Container */}
        <div ref={searchContainerRef} className="relative hidden lg:block">
          <div className="flex items-center gap-4 bg-gray-100 rounded-full px-4 py-2 w-[340px] focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-200 transition-all">
            <Search size={18} className="text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search products..."
              className="bg-transparent ml-3 outline-none w-full text-sm text-gray-700"
            />
          </div>

          {/* Advanced Luxury Dropdown Panel */}
          {searchFocused && (
            <div className="absolute left-0 mt-3 w-[580px] bg-white rounded-2xl border border-neutral-100 shadow-2xl overflow-hidden flex z-50 grid grid-cols-5 h-[280px]">
              {/* Left Side: Categories Selection */}
              <div className="col-span-2 bg-neutral-50/80 border-r border-neutral-100 p-2 flex flex-col gap-1 overflow-y-auto">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 p-2">
                  Categories
                </span>
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onMouseEnter={() => setHoveredCategory(cat.slug)}
                    onClick={() => {
                      navigate(`/category/${cat.slug}`);
                      setSearchFocused(false);
                    }}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      activeCategorySlug === cat.slug
                        ? "bg-white text-neutral-950 shadow-sm border border-neutral-100 font-semibold"
                        : "text-neutral-600 hover:text-neutral-950 hover:bg-white/50"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight size={12} className={activeCategorySlug === cat.slug ? "text-neutral-900" : "text-neutral-400"} />
                  </button>
                ))}
              </div>

              {/* Right Side: Product Names Preview */}
              <div className="col-span-3 p-4 flex flex-col gap-1 overflow-y-auto bg-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Matching Pieces
                </span>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link
  key={product._id}
  to={`/product/${product._id}`}
  onClick={() => setSearchFocused(false)}
  className="flex items-center gap-3 rounded-xl p-2 hover:bg-neutral-50 transition"
>

  <div className="flex flex-col overflow-hidden">
    <span className="truncate text-sm font-medium text-neutral-800">
      {product.title}
    </span>

    <span className="text-xs text-neutral-500">
      ₹{product.price}
    </span>
  </div>
</Link>
                  ))
                ) : (
                  <p className="text-xs text-neutral-400 italic p-2 mt-4 text-center">
                    No matching pieces found
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 md:gap-9">
          <Link
            to="/wishlist"
            className="relative text-gray-600 hover:text-gray-900"
            aria-label="Wishlist"
          >
            <Heart size={22} />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>

          <Link to="/cart" className="relative text-gray-600 hover:text-gray-900" aria-label="Cart">
            <ShoppingBag size={22} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          <Link
            to="/orders"
            className="hidden xl:block text-gray-600 hover:text-gray-900"
            aria-label="Orders"
          >
            <Package size={22} />
          </Link>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => setProfileOpen((value) => !value)}
            aria-label="Account menu"
          >
            {user?.profilePhoto ? (
              <img
                src={`${BACKEND_URL}${user.profilePhoto}`}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="font-semibold">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            )}
          </button>

          <button
            type="button"
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Profile menu snippet */}
      {profileOpen && (
        <div className="absolute right-4 top-20 z-40 w-52 rounded-3xl border border-gray-200 bg-white shadow-xl">
          <div className="flex flex-col p-4 text-sm text-gray-700">
            <Link
              to="/profile"
              className="rounded-2xl px-3 py-3 hover:bg-gray-50"
              onClick={() => setProfileOpen(false)}
            >
              My Profile
            </Link>
            <Link
              to="/orders"
              className="rounded-2xl px-3 py-3 hover:bg-gray-50"
              onClick={() => setProfileOpen(false)}
            >
              Orders
            </Link>
            <Link
              to="/wishlist"
              className="rounded-2xl px-3 py-3 hover:bg-gray-50"
              onClick={() => setProfileOpen(false)}
            >
              Wishlist
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 rounded-2xl px-3 py-3 text-left text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Mobile nav menu snippet */}
      {menuOpen && (
        <nav className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/category/men" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            Men
          </NavLink>
          <NavLink to="/category/women" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            Women
          </NavLink>
          <NavLink to="/wishlist" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            Wishlist
          </NavLink>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            Cart
          </NavLink>
          <NavLink to="/orders" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            Orders
          </NavLink>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={navLinkClass}>
            Profile
          </NavLink>
          <button
            type="button"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="text-left text-sm font-medium text-red-600"
          >
            Logout
          </button>
        </nav>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Navbar;