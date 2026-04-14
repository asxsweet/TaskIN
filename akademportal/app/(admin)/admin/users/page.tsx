"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { roleLabel } from "@/lib/work-labels";
import { apiJsonSafe } from "@/lib/fetcher";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<
    { id: string; name: string; email: string; role: string; faculty?: { name: string } }[]
  >([]);
  useEffect(() => {
    apiJsonSafe<{
      users?: { id: string; name: string; email: string; role: string; faculty?: { name: string } }[];
    }>("/api/users", { users: [] }).then((d) => setUsers(d.users ?? []));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Пайдаланушылар</h1>
      <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-bold text-neutral-400 uppercase border-b bg-neutral-50">
              <th className="px-6 py-4">Аты</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Рөлі</th>
              <th className="px-6 py-4">Факультет</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-neutral-50">
                <td className="px-6 py-4 flex items-center gap-2">
                  <Avatar
                    initials={u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                    size="sm"
                  />
                  {u.name}
                </td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{roleLabel(u.role)}</td>
                <td className="px-6 py-4 text-neutral-500">{u.faculty?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
