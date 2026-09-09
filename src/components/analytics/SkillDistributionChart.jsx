import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export function SkillDistributionChart({ skills = [], students = [] }) {
  // Compute how many students possess each skill
  const counts = {};
  students.forEach(st => {
    (st.technicalSkills || []).forEach(sk => {
      counts[sk.name] = (counts[sk.name] || 0) + 1;
    });
  });

  const data = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const colors = ['#38bdf8', '#00f0ff', '#818cf8', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  if (!data.length) {
    return <div className="p-6 text-center text-slate-400 text-sm">No skill data available.</div>;
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 5 }}>
          <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
          <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} width={100} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            }}
            formatter={(value) => [`${value} Students`, 'Total Count']}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
