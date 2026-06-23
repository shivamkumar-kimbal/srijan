"use client";

import { Check, ShieldAlert } from "lucide-react";
import {
  PERMISSIONS,
  ROLES,
  ROLE_PERMISSIONS,
  USERS,
  can,
  type Role,
} from "@/lib/access";
import { useAuthStore, useCurrentUser, usePermission } from "@/lib/auth-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminPage() {
  const canManage = usePermission("users:manage");
  const me = useCurrentUser();
  const overrides = useAuthStore((s) => s.roleOverrides);
  const setRole = useAuthStore((s) => s.setRole);

  if (!canManage) {
    return (
      <div className="animate-viewIn max-w-[640px] mx-auto px-8 py-16 text-center">
        <ShieldAlert size={40} className="mx-auto text-[#C2552E] mb-3" />
        <h1 className="text-[20px] font-extrabold mb-1">Access denied</h1>
        <p className="text-[14px] text-muted-2">
          You need the <b>users:manage</b> permission to view the admin panel.
          {me && <> Signed in as <b>{me.name}</b> ({me.role}).</>}
        </p>
      </div>
    );
  }

  const roleColor = (r: Role) => ROLES.find((x) => x.key === r)?.color ?? "#5B5A55";

  return (
    <div className="animate-viewIn max-w-[1100px] mx-auto px-8 py-7 pb-20">
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Admin · Users &amp; Roles</h1>
      <p className="text-[14.5px] text-muted mb-6">
        Manage who can do what. Role changes apply immediately and persist locally.
      </p>

      {/* USERS */}
      <div className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-3">
        Users ({USERS.length})
      </div>
      <Card className="overflow-hidden mb-8">
        <table className="w-full text-[13.5px]">
          <thead>
            <tr className="text-left text-[12px] text-muted-2 border-b border-[#F1F0EC]">
              <th className="font-semibold px-4 py-3">User</th>
              <th className="font-semibold px-4 py-3 hidden md:table-cell">Email</th>
              <th className="font-semibold px-4 py-3">Role</th>
              <th className="font-semibold px-4 py-3 text-right">Permissions</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((u) => {
              const role = overrides[u.id] ?? u.role;
              const permCount = ROLE_PERMISSIONS[role].length;
              return (
                <tr key={u.id} className="border-b border-[#F4F3EF] last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-8 h-8 rounded-[9px] text-white flex items-center justify-center font-bold text-[11px] flex-none"
                        style={{ background: roleColor(role) }}
                      >
                        {u.initials}
                      </span>
                      <div className="leading-tight">
                        <div className="font-semibold">
                          {u.name}
                          {me?.id === u.id && (
                            <span className="ml-1.5 text-[11px] text-muted-2">(you)</span>
                          )}
                        </div>
                        <div className="text-[11.5px] text-muted-2">{u.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[12.5px] text-muted hidden md:table-cell">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={role}
                      onChange={(e) => setRole(u.id, e.target.value as Role)}
                      className="h-8 px-2 rounded-[8px] border border-[#E7E6E0] bg-white text-[13px] font-semibold outline-none focus:border-primary capitalize"
                    >
                      {ROLES.map((r) => (
                        <option key={r.key} value={r.key}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-[12.5px] text-muted-2">
                    {permCount} / {PERMISSIONS.length}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* ROLE CARDS */}
      <div className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-3">
        Roles
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-8">
        {ROLES.map((r) => (
          <Card key={r.key} className="p-[16px_17px]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
              <span className="font-bold text-[14px]">{r.label}</span>
              <Badge
                style={{ background: `${r.color}14`, color: r.color }}
                className="ml-auto font-mono"
              >
                {ROLE_PERMISSIONS[r.key].length} perms
              </Badge>
            </div>
            <p className="text-[12.5px] text-muted-2">{r.desc}</p>
          </Card>
        ))}
      </div>

      {/* PERMISSION MATRIX */}
      <div className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-3">
        Permission matrix
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full text-[13px] min-w-[560px]">
          <thead>
            <tr className="text-left text-[12px] text-muted-2 border-b border-[#F1F0EC]">
              <th className="font-semibold px-4 py-3">Permission</th>
              {ROLES.map((r) => (
                <th key={r.key} className="font-semibold px-3 py-3 text-center capitalize">
                  {r.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((p) => (
              <tr key={p.key} className="border-b border-[#F4F3EF] last:border-0">
                <td className="px-4 py-2.5">
                  <span className="font-semibold">{p.label}</span>
                  <span className="block font-mono text-[11px] text-muted-2">{p.key}</span>
                </td>
                {ROLES.map((r) => (
                  <td key={r.key} className="px-3 py-2.5 text-center">
                    {can(r.key, p.key) ? (
                      <Check size={16} className="inline text-green" />
                    ) : (
                      <span className="text-[#D8D6CE]">–</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
