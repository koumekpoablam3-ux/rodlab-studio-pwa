"use client";

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const fmt = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1).replace(".", ",")} M` : `${Math.round(v / 1000)} k`;

export function RevenueChart({ data }: { data: { month: string; total: number }[] }) {
  return (
    <div className="h-72 w-full" role="img" aria-label="Graphique des revenus mensuels">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eae1cd" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#75695c" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={fmt} tick={{ fontSize: 12, fill: "#75695c" }} axisLine={false} tickLine={false} width={48} />
          <Tooltip
            formatter={(value: number) => [`${new Intl.NumberFormat("fr-FR").format(value)} FCFA`, "Encaissé"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #eae1cd", fontSize: 13 }}
          />
          <Bar dataKey="total" fill="#d2603a" radius={[8, 8, 0, 0]} maxBarSize={42} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const PIE_COLORS = ["#d69e35", "#d2603a", "#357a55", "#a89c8c", "#b3261e"];

export function StatusDonut({ data }: { data: { name: string; value: number }[] }) {
  const filtered = data.filter((d) => d.value > 0);
  if (filtered.length === 0) {
    return <p className="flex h-72 items-center justify-center text-sm text-ink-400">Aucun projet pour le moment</p>;
  }
  return (
    <div className="h-72 w-full" role="img" aria-label="Répartition des projets par statut">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={filtered} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
            {filtered.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eae1cd", fontSize: 13 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
