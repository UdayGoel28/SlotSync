"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ClientDetailPanel } from "./ClientDetailPanel";

export type ClientData = {
  name: string;
  email: string;
  phone: string;
  totalSpend: number;
  bookingCount: number;
  lastBookingDate: string;
  firstBookingDate: string;
  bookings: {
    id: string;
    serviceName: string;
    startTime: string;
    status: string;
    price: number;
  }[];
};

type SortKey = "name" | "bookingCount" | "lastBookingDate" | "totalSpend";
type SortDir = "asc" | "desc";

export function ClientsTable({ clients, bookingSlug }: { clients: ClientData[]; bookingSlug: string }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lastBookingDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return clients;
    return clients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [clients, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "bookingCount":
          cmp = a.bookingCount - b.bookingCount;
          break;
        case "totalSpend":
          cmp = a.totalSpend - b.totalSpend;
          break;
        case "lastBookingDate":
          cmp = new Date(a.lastBookingDate).getTime() - new Date(b.lastBookingDate).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ active, dir }: { active: boolean; dir: SortDir }) => (
    <span className={`ml-1 inline-block transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-30"}`}>
      {dir === "asc" ? "↑" : "↓"}
    </span>
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E8EDE6] to-[#F5F0EA] flex items-center justify-center mb-5">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="text-base font-semibold text-[#2C2C2C] mb-1">No clients yet</h3>
        <p className="text-sm text-[#2C2C2C]/50 max-w-xs">
          Share your booking link and clients will appear here once they book an appointment.
        </p>
        <div className="mt-4 px-4 py-2 rounded-xl bg-white/60 border border-white/80 text-xs text-[#2C2C2C]/60 font-mono">
          slotsync.app/book/{bookingSlug}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Search bar */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2C2C2C]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-gray-200 text-sm text-[#2C2C2C] placeholder:text-[#2C2C2C]/30 focus:outline-none focus:border-[#D4846A] focus:ring-2 focus:ring-[#D4846A]/10 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  <button type="button" onClick={() => handleSort("name")} className="group flex items-center">
                    Client
                    <SortIcon active={sortKey === "name"} dir={sortKey === "name" ? sortDir : "asc"} />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  <button type="button" onClick={() => handleSort("bookingCount")} className="group flex items-center">
                    Bookings
                    <SortIcon active={sortKey === "bookingCount"} dir={sortKey === "bookingCount" ? sortDir : "desc"} />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">
                  <button type="button" onClick={() => handleSort("lastBookingDate")} className="group flex items-center">
                    Last Visit
                    <SortIcon active={sortKey === "lastBookingDate"} dir={sortKey === "lastBookingDate" ? sortDir : "desc"} />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                  <button type="button" onClick={() => handleSort("totalSpend")} className="group flex items-center">
                    Spent
                    <SortIcon active={sortKey === "totalSpend"} dir={sortKey === "totalSpend" ? sortDir : "desc"} />
                  </button>
                </th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((client) => (
                <tr
                  key={client.email}
                  onClick={() => setSelectedClient(client)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4846A]/20 to-[#D4846A]/5 flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-[#D4846A]">{getInitials(client.name)}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-[#2C2C2C] truncate">{client.name}</div>
                        <div className="text-[#2C2C2C]/40 text-xs truncate">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#2C2C2C]/60 hidden md:table-cell">{client.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#D4846A]/10 text-[#D4846A] text-xs font-semibold">
                      {client.bookingCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#2C2C2C]/60 text-xs hidden sm:table-cell">
                    {format(new Date(client.lastBookingDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-700 text-xs">
                    ${client.totalSpend.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedClient(client); }}
                      className="text-xs font-medium text-[#D4846A] hover:text-[#c67a62] transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sorted.length === 0 && search && (
          <div className="py-10 text-center text-sm text-[#2C2C2C]/40">
            No clients matching "{search}"
          </div>
        )}
      </div>

      <p className="text-xs text-[#2C2C2C]/30 mt-3">{sorted.length} client{sorted.length !== 1 ? "s" : ""} total</p>

      {/* Detail Panel Modal */}
      {selectedClient && (
        <ClientDetailPanel
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </>
  );
}
