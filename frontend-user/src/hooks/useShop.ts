import { useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";

export const useShop = () =>
  useContext(ShopContext);
