import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function StatusBadge({
  label,
  colorClass,
  className,
}: {
  label: string;
  colorClass: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "terra",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: "terra" | "forest" | "gold" | "ink";
}) {
  const accents: Record<string, string> = {
    terra: "bg-terra-50 text-terra-600",
    forest: "bg-forest-50 text-forest-600",
    gold: "bg-gold-100 text-gold-600",
    ink: "bg-cream-200 text-ink-700",
  };
  return (
    <div className="rounded-2xl border border-cream-300 bg-card p-5 shadow-card transition hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-ink-500">{label}</p>
          <p className="mt-1.5 font-display text-2xl font-semibold text-ink-900 truncate">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", accents[accent])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-cream-400 bg-cream-50/60 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-200">
        <Icon className="h-7 w-7 text-ink-400" aria-hidden="true" />
      </div>
      <p className="mt-4 font-display text-lg font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function ProgressRing({ value, size = 44 }: { value: number; size?: number }) {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f4eee1" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={value >= 100 ? "#357a55" : value >= 50 ? "#d2603a" : "#d69e35"}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="rotate-90 fill-ink-900 text-[10px] font-semibold"
        style={{ transformOrigin: "center" }}
      >
        {value}%
      </text>
    </svg>
  );
}
