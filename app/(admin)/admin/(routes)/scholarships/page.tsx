"use client";

import { useEffect, useState } from "react";
import {
    getAllScholarshipApplications,
    updateScholarshipApplicationStatus,
    deleteScholarshipApplication,
} from "@/app/_actions/scholarship";

type Application = {
    _id: string;
    full_names: string;
    age: string;
    biggest_struggle: string;
    why_choose_you: string;
    ready_to_commit: string;
    whatsapp_number: string;
    call_number: string;
    location: string;
    status: "pending" | "approved" | "rejected";
    submitted_at: string;
};

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
    pending: { pill: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400" },
    approved: { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400" },
    rejected: { pill: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-400" },
};

const FILTER_OPTIONS = ["all", "pending", "approved", "rejected"] as const;
type Filter = (typeof FILTER_OPTIONS)[number];

export default function ScholarshipAdminPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [selected, setSelected] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState<Filter>("all");
    const [search, setSearch] = useState("");

    const fetchApplications = async () => {
        setLoading(true);
        const data = await getAllScholarshipApplications();
        if ("error" in data) setError(data.error);
        else setApplications(data as Application[]);
        setLoading(false);
    };

    useEffect(() => { fetchApplications(); }, []);

    const handleStatusChange = async (id: string, status: Application["status"]) => {
        await updateScholarshipApplicationStatus(id, status);
        await fetchApplications();
        setSelected((prev) => (prev?._id === id ? { ...prev, status } : prev));
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this application? This cannot be undone.")) return;
        await deleteScholarshipApplication(id);
        setSelected(null);
        await fetchApplications();
    };

    const downloadPDF = (app: Application) => {
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/>
    <title>Application — ${app.full_names}</title>
    <style>
      body{font-family:Georgia,serif;margin:48px;color:#111;line-height:1.6}
      h1{font-size:24px;margin:0 0 4px}
      .meta{color:#888;font-size:13px;margin-bottom:30px}
      .badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:28px}
      .pending{background:#fef3c7;color:#92400e}
      .approved{background:#d1fae5;color:#065f46}
      .rejected{background:#fee2e2;color:#991b1b}
      .q{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin:0 0 5px}
      .a{font-size:14px;background:#f7f7f7;border-left:3px solid #e02020;padding:10px 16px;border-radius:0 6px 6px 0;margin-bottom:20px}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
      footer{margin-top:48px;font-size:10px;color:#ccc;text-align:center;border-top:1px solid #eee;padding-top:16px}
    </style></head><body>
    <h1>🌙 New Moon Gym Plus</h1>
    <div class="meta">Full Body Transformation Scholarship Application</div>
    <span class="badge ${app.status}">${app.status}</span>
    <div class="grid">
      <div><div class="q">Full Names</div><div class="a">${app.full_names}</div></div>
      <div><div class="q">Age</div><div class="a">${app.age}</div></div>
    </div>
    <div class="q">Biggest Struggle</div><div class="a">${app.biggest_struggle}</div>
    <div class="q">Why Should We Choose You?</div><div class="a">${app.why_choose_you}</div>
    <div class="q">Ready to Commit?</div><div class="a">${app.ready_to_commit}</div>
    <div class="grid">
      <div><div class="q">WhatsApp</div><div class="a">${app.whatsapp_number}</div></div>
      <div><div class="q">Direct Call</div><div class="a">${app.call_number}</div></div>
    </div>
    <div class="q">Location</div><div class="a">${app.location}</div>
    <footer>Submitted: ${new Date(app.submitted_at).toLocaleString()} &nbsp;·&nbsp; ID: ${app._id}</footer>
    </body></html>`;

        const win = window.open("", "_blank");
        if (win) { win.document.write(html); win.document.close(); win.print(); }
    };

    const filtered = applications.filter((a) => {
        const matchFilter = filter === "all" || a.status === filter;
        const matchSearch =
            a.full_names.toLowerCase().includes(search.toLowerCase()) ||
            a.location.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const counts = {
        all: applications.length,
        pending: applications.filter((a) => a.status === "pending").length,
        approved: applications.filter((a) => a.status === "approved").length,
        rejected: applications.filter((a) => a.status === "rejected").length,
    };

    return (
        <div className="min-h-screen bg-[#f5f4f1]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+NeuePlayfair+Display:wght@700family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');`}</style>

            {/* Sidebar */}
            <div className="flex h-screen overflow-hidden">
                <aside className="w-72 bg-[#0b0c10] flex flex-col flex-shrink-0 overflow-hidden">
                    {/* Brand */}
                    <div className="px-6 py-6 border-b border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">🌙</span>
                            <span className="text-white font-semibold text-sm">New Moon Gym Plus</span>
                        </div>
                        <p className="text-[10px] text-white/25 uppercase tracking-widest pl-7">Admin Panel</p>
                    </div>

                    {/* Search */}
                    <div className="px-4 py-4 border-b border-white/5">
                        <input
                            type="text"
                            placeholder="Search applicants..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 outline-none focus:border-[#e02020]/50"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        />
                    </div>

                    {/* Filters */}
                    <div className="px-4 py-3 border-b border-white/5 space-y-1">
                        {FILTER_OPTIONS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
                                style={{
                                    background: filter === f ? "rgba(224,32,32,0.12)" : "transparent",
                                    color: filter === f ? "#e02020" : "rgba(255,255,255,0.4)",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                <span className="capitalize">{f}</span>
                                <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                    style={{
                                        background: filter === f ? "rgba(224,32,32,0.2)" : "rgba(255,255,255,0.05)",
                                    }}
                                >
                                    {counts[f]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto py-2 px-2">
                        {loading && (
                            <p className="text-white/25 text-xs text-center py-8">Loading...</p>
                        )}
                        {!loading && filtered.length === 0 && (
                            <p className="text-white/25 text-xs text-center py-8">No applications found</p>
                        )}
                        {filtered.map((app) => (
                            <button
                                key={app._id}
                                onClick={() => setSelected(app)}
                                className="w-full text-left rounded-xl px-3 py-3 mb-1 transition-all"
                                style={{
                                    background:
                                        selected?._id === app._id
                                            ? "rgba(224,32,32,0.1)"
                                            : "transparent",
                                    border: selected?._id === app._id
                                        ? "1px solid rgba(224,32,32,0.25)"
                                        : "1px solid transparent",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                }}
                            >
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-white text-sm font-medium truncate pr-2">{app.full_names}</span>
                                    <span
                                        className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_STYLES[app.status].dot}`}
                                    />
                                </div>
                                <p className="text-white/30 text-xs truncate">{app.location} · Age {app.age}</p>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto">
                    {!selected ? (
                        <div className="h-full flex flex-col items-center justify-center text-center px-6">
                            <div className="text-5xl mb-4 opacity-20">🌙</div>
                            <p className="text-[#999] text-sm">Select an application from the sidebar to review it</p>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto px-8 py-10">
                            {/* Top bar */}
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h1
                                        className="text-3xl font-bold text-[#111] mb-1"
                                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                                    >
                                        {selected.full_names}
                                    </h1>
                                    <p className="text-[#888] text-sm">Age {selected.age} · {selected.location}</p>
                                    <p className="text-[#bbb] text-xs mt-1">
                                        Submitted {new Date(selected.submitted_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0 ml-4 mt-1">
                                    <button
                                        onClick={() => downloadPDF(selected)}
                                        className="text-sm font-medium bg-[#0b0c10] text-white px-4 py-2 rounded-lg hover:bg-[#222] transition"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        ↓ PDF
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selected._id)}
                                        className="text-sm font-medium bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2 mb-8">
                                <span className="text-xs text-[#aaa] font-medium mr-1">Status</span>
                                {(["pending", "approved", "rejected"] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(selected._id, s)}
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-full transition capitalize ${selected.status === s
                                                ? STATUS_STYLES[s].pill
                                                : "bg-white border border-[#e5e5e5] text-[#bbb] hover:border-[#ccc] hover:text-[#888]"
                                            }`}
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>

                            {/* Answer cards */}
                            <div className="space-y-5">
                                <AnswerCard q="What is your biggest struggle?" a={selected.biggest_struggle} accent />
                                <AnswerCard q="Why should we choose you?" a={selected.why_choose_you} accent />
                                <AnswerCard q="Are you 100% ready to commit?" a={selected.ready_to_commit} />
                                <div className="grid grid-cols-2 gap-4">
                                    <AnswerCard q="WhatsApp Number" a={selected.whatsapp_number} />
                                    <AnswerCard q="Direct Call Number" a={selected.call_number} />
                                </div>
                                <AnswerCard q="Location" a={selected.location} />
                            </div>

                            <p className="text-[#ccc] text-xs mt-8">ID: {selected._id}</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function AnswerCard({ q, a, accent }: { q: string; a: string; accent?: boolean }) {
    return (
        <div
            className="bg-white rounded-xl border border-[#eee] p-5"
            style={{ borderLeft: accent ? "3px solid #e02020" : undefined }}
        >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#bbb] mb-2">{q}</p>
            <p className="text-[#222] text-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a}</p>
        </div>
    );
}