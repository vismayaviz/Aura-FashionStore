import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );