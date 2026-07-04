import { useNavigate } from "react-router-dom";
import { LogOut, Mail, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useShop } from "../hooks/useShop";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart, wishlist } = useShop();

  const cartCount =
    cart?.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    ) ?? 0;

  const wishlistCount =
    wishlist?.products.length ?? 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const BACKEND_URL = "http://localhost:5000";

  return (
    <section className="container-custom py-10 md:py-16">
      <div className="bg-white rounded-2xl p-6 md:p-10 max-w-3xl">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          {user?.profilePhoto ? (
            <img
              src={`${BACKEND_URL}${user.profilePhoto}`}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
              {user?.name?.charAt(0) ??
                "U"}
            </div>
          )}

          <div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {user?.name}
            </h1>
            <p className="text-gray-500 flex items-center gap-2 mt-2">
              <Mail size={18} />
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          <div className="border rounded-2xl p-5">
            <p className="text-gray-500">
              Cart Items
            </p>
            <p className="text-3xl font-bold mt-2">
              {cartCount}
            </p>
          </div>
          <div className="border rounded-2xl p-5">
            <p className="text-gray-500">
              Wishlist
            </p>
            <p className="text-3xl font-bold mt-2">
              {wishlistCount}
            </p>
          </div>
          <div className="border rounded-2xl p-5">
            <p className="text-gray-500">
              Account
            </p>
            <p className="font-bold mt-3 flex items-center gap-2">
              <User size={18} />
              Verified
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-outline mt-10 flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </section>
  );
};

export default Profile;
