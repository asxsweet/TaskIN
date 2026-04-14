"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  Briefcase,
  Calendar,
  Check,
  CreditCard,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import type { ApprovalStatus } from "@prisma/client";

type Row = {
  id: string;
  name: string;
  email: string;
  position: string | null;
  phone: string | null;
  employeeId: string | null;
  approvalStatus: ApprovalStatus;
  approvalNote: string | null;
  approvedAt: string | null;
  approverName: string | null;
  facultyName: string;
  departmentName: string | null;
  createdAt: string;
};

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Бір сағаттан аз бұрын";
  if (h < 24) return `${h} сағат бұрын`;
  const days = Math.floor(h / 24);
  return `${days} күн бұрын`;
}

export default function AdminApprovalsPage() {
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [stats, setStats] = useState({ pendingCount: 0, approvedCount: 0, rejectedCount: 0 });
  const [users, setUsers] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmApprove, setConfirmApprove] = useState<Row | null>(null);
  const [rejectRow, setRejectRow] = useState<Row | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/approvals?filter=${filter}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { stats?: typeof stats; users?: Row[] } | null) => {
        if (d?.stats) setStats(d.stats);
        setUsers(d?.users ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function doApprove(id: string) {
    setActionLoading(true);
    const r = await fetch(`/api/admin/approvals/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve" }),
    });
    setActionLoading(false);
    setConfirmApprove(null);
    if (r.ok) load();
  }

  async function doReject(id: string) {
    if (!rejectNote.trim()) return;
    setActionLoading(true);
    const r = await fetch(`/api/admin/approvals/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject", note: rejectNote.trim() }),
    });
    setActionLoading(false);
    setRejectRow(null);
    setRejectNote("");
    if (r.ok) load();
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <h1 className="text-xl font-semibold">Жетекші өтінімдері</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="text-xs font-medium text-amber-800 uppercase">Күтуде</div>
          <div className="text-2xl font-semibold text-amber-900">{stats.pendingCount}</div>
        </div>
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <div className="text-xs font-medium text-teal-800 uppercase">Бекітілді</div>
          <div className="text-2xl font-semibold text-teal-900">{stats.approvedCount}</div>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="text-xs font-medium text-red-800 uppercase">Қабылданбады</div>
          <div className="text-2xl font-semibold text-red-900">{stats.rejectedCount}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2">
        {(
          [
            ["pending", `Күтуде (${stats.pendingCount})`],
            ["approved", "Бекітілді"],
            ["rejected", "Қабылданбады"],
            ["all", "Барлығы"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === key ? "bg-primary text-white" : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ?
        <p className="text-sm text-neutral-500">Жүктелуде…</p>
      : users.length === 0 ?
        <p className="text-sm text-neutral-500">Тізім бос.</p>
      : <div className="space-y-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-lg border border-neutral-200 shadow-xs p-5 flex flex-col lg:flex-row gap-6 lg:items-start"
            >
              <div className="flex gap-3 shrink-0">
                <Avatar
                  className="!bg-violet-600 !text-white text-lg"
                  initials={u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                  size="lg"
                />
                <div>
                  <div className="font-medium text-base text-neutral-900">{u.name}</div>
                  <Badge variant="tag" className="mt-1 bg-violet-100 text-violet-800 border-violet-200">
                    Жетекші
                  </Badge>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-sm text-neutral-700 min-w-0">
                <div className="flex items-start gap-2">
                  <Mail size={16} className="text-neutral-400 shrink-0 mt-0.5" />
                  <span className="break-all">{u.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 size={16} className="text-neutral-400 shrink-0 mt-0.5" />
                  <span>
                    {u.facultyName}
                    {u.departmentName ? ` — ${u.departmentName}` : ""}
                  </span>
                </div>
                {u.position ?
                  <div className="flex items-start gap-2">
                    <Briefcase size={16} className="text-neutral-400 shrink-0 mt-0.5" />
                    <span>{u.position}</span>
                  </div>
                : null}
                {u.employeeId ?
                  <div className="flex items-start gap-2">
                    <CreditCard size={16} className="text-neutral-400 shrink-0 mt-0.5" />
                    <span>{u.employeeId}</span>
                  </div>
                : null}
                {u.phone ?
                  <div className="flex items-start gap-2">
                    <Phone size={16} className="text-neutral-400 shrink-0 mt-0.5" />
                    <span>{u.phone}</span>
                  </div>
                : null}
                <div className="flex items-center gap-2 text-neutral-500 text-xs">
                  <Calendar size={14} />
                  {formatRelative(u.createdAt)}
                </div>
              </div>

              <div className="flex flex-col gap-2 items-stretch lg:items-end shrink-0 min-w-[180px]">
                {u.approvalStatus === "PENDING" && (
                  <>
                    <Button
                      type="button"
                      className="bg-teal-600 hover:bg-teal-700 text-white gap-1"
                      onClick={() => setConfirmApprove(u)}
                    >
                      <Check size={16} /> Бекіту
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className="border-danger text-danger hover:bg-red-50 gap-1"
                      onClick={() => {
                        setRejectRow(u);
                        setRejectNote("");
                      }}
                    >
                      <X size={16} /> Қабылдамау
                    </Button>
                  </>
                )}
                {u.approvalStatus === "APPROVED" && (
                  <div className="text-right space-y-1">
                    <Badge variant="tag" className="bg-teal-100 text-teal-800">
                      ✓ Бекітілді
                    </Badge>
                    {u.approverName ?
                      <div className="text-xs text-neutral-500">Бекіткен: {u.approverName}</div>
                    : null}
                    {u.approvedAt ?
                      <div className="text-xs text-neutral-400">
                        {new Date(u.approvedAt).toLocaleString("kk-KZ")}
                      </div>
                    : null}
                  </div>
                )}
                {u.approvalStatus === "REJECTED" && (
                  <div className="text-right space-y-1 max-w-xs">
                    <Badge variant="tag" className="bg-red-100 text-red-800">
                      Қабылданбады
                    </Badge>
                    {u.approvalNote ?
                      <p className="text-xs text-neutral-600 text-left lg:text-right">{u.approvalNote}</p>
                    : null}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      }

      {confirmApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-lg">Бекітуді растау</h3>
            <p className="text-sm text-neutral-600">
              <strong>{confirmApprove.name}</strong> жетекші ретінде бекітіледі.
            </p>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" onClick={() => setConfirmApprove(null)}>
                Болдырмау
              </Button>
              <Button
                type="button"
                className="bg-teal-600 hover:bg-teal-700 text-white"
                disabled={actionLoading}
                onClick={() => doApprove(confirmApprove.id)}
              >
                Иә, бекіту
              </Button>
            </div>
          </div>
        </div>
      )}

      {rejectRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h3 className="font-semibold text-lg">Қабылдамау себебі *</h3>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-neutral-200 px-3 py-2 text-sm"
              placeholder="Себебін жазыңыз, жетекшіге жіберіледі..."
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              required
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setRejectRow(null);
                  setRejectNote("");
                }}
              >
                Болдырмау
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={actionLoading || !rejectNote.trim()}
                onClick={() => doReject(rejectRow.id)}
              >
                Қабылдамау
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
