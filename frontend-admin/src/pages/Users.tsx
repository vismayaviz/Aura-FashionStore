import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { StateBlock } from "../components/ui/StateBlock";
import { TableContainer } from "../components/ui/TableContainer";
import { getErrorMessage } from "../utils/apiError";
import type { UserItem } from "../types/user";

export const Users = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsers(await userService.getAll());
      } catch (err) {
        setError(
          getErrorMessage(
            err,
            "Unable to load users. The backend does not expose a users endpoint yet."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const BACKEND_URL = "http://localhost:5000";

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white px-6 py-6 shadow-sm shadow-slate-200/40">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">User management</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Users</h2>
        </div>
      </div>

      {loading ? (
        <StateBlock>Loading users...</StateBlock>
      ) : error ? (
        <StateBlock tone="error">{error}</StateBlock>
      ) : users.length === 0 ? (
        <StateBlock>No users found.</StateBlock>
      ) : (
        <TableContainer>
          <table className="min-w-full border-collapse text-left text-slate-700">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.24em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Email</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-slate-200 last:border-none">
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <div className="flex items-center gap-3">
                      {user.profilePhoto ? (
                        <img
                          src={`${BACKEND_URL}${user.profilePhoto}`}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-semibold text-slate-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-700">{user.email}</td>
                  <td className="px-4 py-4 text-sm text-slate-700 capitalize">{user.role}</td>
                  <td className="px-4 py-4 text-sm text-slate-700">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.isVerified
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      )}
    </div>
  );
};
