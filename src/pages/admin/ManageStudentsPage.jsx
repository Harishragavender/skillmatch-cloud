import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SkillChip } from '../../components/common/SkillChip';
import {
  Users,
  Search,
  GraduationCap,
  Mail,
  Shield,
  ExternalLink,
} from 'lucide-react';

export function ManageStudentsPage({ onNavigate }) {
  const { students } = useData();
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      (s.technicalSkills || []).some(sk => sk.name.toLowerCase().includes(search.toLowerCase()));
    const matchesYear = selectedYear === 'All' || s.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-cyan-400" />
            Manage Enrolled Students ({students.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review registered student profiles, verify skill levels, and monitor capstone team participation.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name, department, or skill..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-400"
          />
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-400"
        >
          <option value="All">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-card-3d">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-white/10 tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Student Info</th>
                <th className="py-3.5 px-4">Department & Year</th>
                <th className="py-3.5 px-4">Top Technical Skills</th>
                <th className="py-3.5 px-4">Interests</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt={st.name}
                        className="w-10 h-10 rounded-xl object-cover border border-white/10"
                      />
                      <div>
                        <div
                          onClick={() => onNavigate('teammate_profile', { studentId: st.id })}
                          className="font-bold text-white hover:text-cyan-300 cursor-pointer transition-colors"
                        >
                          {st.name}
                        </div>
                        <span className="text-[11px] text-slate-400">{st.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="text-white font-medium">{st.department}</div>
                    <span className="text-xs text-brand-400">{st.year}</span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(st.technicalSkills || []).slice(0, 3).map((sk, idx) => (
                        <SkillChip key={idx} name={sk.name} level={sk.level} size="xs" />
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(st.interests || []).slice(0, 2).map((int, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {int}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => onNavigate('teammate_profile', { studentId: st.id })}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/5 hover:border-cyan-400/40 transition-colors inline-flex items-center gap-1"
                    >
                      Inspect <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
