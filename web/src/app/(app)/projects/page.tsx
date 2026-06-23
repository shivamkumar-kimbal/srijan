"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { useBoard } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { AVATAR_COLORS, type Board } from "@/lib/types";

type Columns = Board["columns"];
type Task = Columns[number]["tasks"][number];

export default function ProjectsPage() {
  const { data, isLoading } = useBoard();
  const [columns, setColumns] = useState<Columns>([]);
  const [dragging, setDragging] = useState<{ col: number; id: string } | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [adding, setAdding] = useState<number | null>(null);

  // Seed local board state once the API responds.
  useEffect(() => {
    if (data) setColumns(data.columns.map((c) => ({ ...c, tasks: [...c.tasks] })));
  }, [data]);

  const total = useMemo(
    () => columns.reduce((n, c) => n + c.tasks.length, 0),
    [columns]
  );

  if (isLoading || !data) return <div className="p-10 text-muted-2">Loading…</div>;

  function moveTask(toCol: number) {
    if (!dragging) return;
    setColumns((cols) => {
      const next = cols.map((c) => ({ ...c, tasks: [...c.tasks] }));
      const from = next[dragging.col];
      const idx = from.tasks.findIndex((t) => t.id === dragging.id);
      if (idx === -1) return cols;
      if (dragging.col === toCol) return cols;
      const [task] = from.tasks.splice(idx, 1);
      next[toCol].tasks.push(task);
      return next;
    });
    setDragging(null);
    setDragOver(null);
  }

  function addTask(col: number, title: string) {
    const clean = title.trim();
    if (!clean) {
      setAdding(null);
      return;
    }
    setColumns((cols) => {
      const next = cols.map((c) => ({ ...c, tasks: [...c.tasks] }));
      const newTask: Task = {
        id: `T-${String(total + 1).padStart(3, "0")}`,
        title: clean,
        tag: "New",
        tagColor: "#5046E5",
        assignee: data!.project.role.slice(0, 2).toUpperCase(),
        ai: col,
      };
      next[col].tasks.push(newTask);
      return next;
    });
    setAdding(null);
  }

  return (
    <div className="animate-viewIn px-8 py-7 pb-10 flex flex-col h-full">
      <div className="flex items-center gap-3.5 mb-1.5">
        <Badge style={{ background: "#EEEDFD", color: "#5046E5" }}>ACTIVE</Badge>
        <h1 className="text-[23px] font-extrabold tracking-[-0.5px]">{data.project.title}</h1>
      </div>
      <div className="flex items-center gap-4 mb-5 text-[13.5px] text-muted">
        <span>Lead: <b className="text-ink">{data.project.lead}</b></span>
        <span className="text-[#D8D6CE]">·</span>
        <span>You: <b className="text-ink">{data.project.role}</b></span>
        <span className="text-[#D8D6CE]">·</span>
        <span>Due in <b className="text-ink">{data.project.due}</b></span>
        <div className="ml-auto flex items-center">
          {data.teamAvatars.map((a) => (
            <div
              key={a.initials}
              className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-[11px] border-2 border-background -ml-1.5"
              style={{ background: AVATAR_COLORS[a.i % AVATAR_COLORS.length] }}
            >
              {a.initials}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 flex-1 min-h-0">
        {columns.map((col, ci) => (
          <div
            key={col.name}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(ci);
            }}
            onDragLeave={() => setDragOver((d) => (d === ci ? null : d))}
            onDrop={(e) => {
              e.preventDefault();
              moveTask(ci);
            }}
            className={`rounded-[13px] p-[11px_11px_14px] flex flex-col min-h-0 transition-colors ${
              dragOver === ci ? "bg-[#E6E4FB] ring-2 ring-primary/40" : "bg-[#F1F0EC]"
            }`}
          >
            <div className="flex items-center gap-2 p-[5px_7px_12px]">
              <span className="w-2 h-2 rounded-full" style={{ background: col.dot }} />
              <span className="font-bold text-[13px]">{col.name}</span>
              <span className="ml-auto font-mono font-semibold text-[11px] text-muted-2 bg-white px-1.5 rounded-full">
                {col.tasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2.5 overflow-y-auto flex-1">
              {col.tasks.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={() => setDragging({ col: ci, id: t.id })}
                  onDragEnd={() => {
                    setDragging(null);
                    setDragOver(null);
                  }}
                  className={`bg-white border border-[#E8E7E1] rounded-[10px] p-[11px_12px] cursor-grab active:cursor-grabbing transition-opacity ${
                    dragging?.id === t.id ? "opacity-40" : ""
                  }`}
                >
                  <span
                    className="inline-flex font-mono font-semibold text-[10.5px] px-1.5 py-0.5 rounded"
                    style={{ background: `${t.tagColor}14`, color: t.tagColor }}
                  >
                    {t.tag}
                  </span>
                  <div className="text-[13px] font-semibold leading-snug my-2 text-[#2A2926]">{t.title}</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md text-white flex items-center justify-center font-bold text-[10px]"
                      style={{ background: AVATAR_COLORS[t.ai % AVATAR_COLORS.length] }}
                    >
                      {t.assignee}
                    </div>
                    <span className="font-mono font-semibold text-[11px] text-[#B5B3AA] ml-auto">{t.id}</span>
                  </div>
                </div>
              ))}

              {adding === ci ? (
                <AddTaskInput
                  onCancel={() => setAdding(null)}
                  onSubmit={(title) => addTask(ci, title)}
                />
              ) : (
                <button
                  onClick={() => setAdding(ci)}
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-[9px] border border-dashed border-[#CFCDC4] text-[12px] font-semibold text-muted-2 hover:bg-white hover:text-ink transition-colors"
                >
                  <Plus size={14} /> Add task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddTaskInput({
  onSubmit,
  onCancel,
}: {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="bg-white border border-primary/40 rounded-[10px] p-2">
      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit(value);
          }
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Task title…"
        rows={2}
        className="w-full resize-none text-[13px] outline-none placeholder:text-muted-2"
      />
      <div className="flex items-center gap-1.5 mt-1">
        <button
          onClick={() => onSubmit(value)}
          className="h-7 px-3 rounded-md bg-primary text-white text-[12px] font-bold"
        >
          Add
        </button>
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded-md text-muted-2 hover:bg-[#F1F0EC] flex items-center justify-center"
          aria-label="cancel"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
