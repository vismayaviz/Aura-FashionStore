import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { Products } from "../pages/Products";
import { Categories } from "../pages/Categories";
import { Users } from "../pages/Users";
import { Orders } from "../pages/Orders";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageShell } from "../components/layout/PageShell";

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route
        element={
          <PageShell>
            <Dashboard />
          </PageShell>
        }
        path="/"
      />
      <Route
        element={
          <PageShell>
            <Products />
          </PageShell>
        }
        path="/products"
      />
      <Route
        element={
          <PageShell>
            <Categories />
          </PageShell>
        }
        path="/categories"
      />
      <Route
        element={
          <PageShell>
            <Orders />
          </PageShell>
        }
        path="/orders"
      />
      <Route
        element={
          <PageShell>
            <Users />
          </PageShell>
        }
        path="/users"
      />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
