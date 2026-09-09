import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function CategoryBreakdownChart({ projects = [] }) {
  const counts = {};
  projects.forEach(p => {
    const cat = p.category || 'General';
    counts[cat] = (counts[cat] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#38bdf8', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#00f0ff', '#818cf8'];

  if (!data.length) {
    return <div className="p-6 text-center text-slate-400 text-sm">No category data.</div>;
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(val) => [`${val} Projects`, 'Total']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TeamVelocityChart({ teams = [] }) {
  const statusCounts = {
    'Planning': 0,
    'In Progress': 0,
    'Review': 0,
    'Completed': 0,
  };

  teams.forEach(t => {
    const s = t.status || 'In Progress';
    if (statusCounts[s] !== undefined) {
      statusCounts[s] += 1;
    }
  });

  const data = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  const colors = {
    'Planning': '#f59e0b',
    'In Progress': '#38bdf8',
    'Review': '#a855f7',
    'Completed': '#10b981',
  };

  return (
    <div className="space-y-3 pt-2">
      {data.map((item) => (
        <div key={item.status} className="space-y-1">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300">{item.status}</span>
            <span className="font-mono text-slate-400">{item.count} Teams</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${teams.length ? (item.count / teams.length) * 100 : 0}%`,
                backgroundColor: colors[item.status],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
