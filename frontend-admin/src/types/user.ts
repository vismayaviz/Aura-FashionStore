export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  role?: "user" | "admin";
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  isVerified: boolean;
  role: "user" | "admin";
}
