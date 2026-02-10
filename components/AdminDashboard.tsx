
import React, { useState, useEffect } from 'react';
import { AttendanceRecord, AttendanceStatus, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Clock, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { getAttendanceSummary } from '../services/geminiService';

interface AdminDashboardProps {
  records: AttendanceRecord[];
  users: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ records, users }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const stats = {
    total: users.length,
    present: records.filter(r => r.status === AttendanceStatus.PRESENT).length,
    late: records.filter(r => r.status === AttendanceStatus.LATE).length,
    absent: users.length - records.filter(r => r.date === new Date().toISOString().split('T')[0]).length,
  };

  const chartData = [
    { name: 'Hadir', value: stats.present, color: '#6366f1' },
    { name: 'Terlambat', value: stats.late, color: '#f59e0b' },
    { name: 'Mangkir', value: stats.absent, color: '#ef4444' },
  ];

  const dailyAttendance = [
    { day: 'Sen', hadir: 18, terlambat: 2 },
    { day: 'Sel', hadir: 20, terlambat: 0 },
    { day: 'Rab', hadir: 17, terlambat: 3 },
    { day: 'Kam', hadir: 19, terlambat: 1 },
    { day: 'Jum', hadir: 15, terlambat: 5 },
  ];

  const handleGenerateSummary = async () => {
    setLoadingAi(true);
    const summary = await getAttendanceSummary(records);
    setAiSummary(summary || "Terjadi kesalahan saat membuat rangkuman.");
    setLoadingAi(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ringkasan Hari Ini</h2>
          <p className="text-slate-500">Pantau kehadiran karyawan secara real-time.</p>
        </div>
        <div className="text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-lg border border-slate-200">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Karyawan" 
          value={stats.total} 
          icon={<Users className="text-indigo-500" />} 
          color="bg-indigo-50" 
        />
        <StatCard 
          label="Hadir" 
          value={stats.present} 
          icon={<CheckCircle className="text-emerald-500" />} 
          color="bg-emerald-50" 
        />
        <StatCard 
          label="Terlambat" 
          value={stats.late} 
          icon={<Clock className="text-amber-500" />} 
          color="bg-amber-50" 
        />
        <StatCard 
          label="Mangkir/Absen" 
          value={stats.absent} 
          icon={<AlertCircle className="text-rose-500" />} 
          color="bg-rose-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             Trend Kehadiran Mingguan
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyAttendance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="hadir" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="terlambat" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-bold mb-6">Distribusi Status</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-700">{Math.round((stats.present / stats.total) * 100)}%</span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Hadir</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Summary Section */}
      <div className="bg-indigo-900 text-white rounded-2xl p-8 overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Sparkles size={120} />
        </div>
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            AI Attendance Insight
          </h3>
          <p className="text-indigo-200 mb-6">
            Gunakan kekuatan AI untuk menganalisis tren kehadiran dan dapatkan saran langkah strategis untuk tim Anda.
          </p>
          
          {aiSummary ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 prose prose-invert max-w-none text-indigo-50">
               <div dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, '<br/>') }} />
               <button 
                 onClick={() => setAiSummary('')} 
                 className="mt-4 text-xs font-bold text-indigo-300 hover:text-white uppercase tracking-wider"
               >
                 Tutup Analisis
               </button>
            </div>
          ) : (
            <button 
              disabled={loadingAi}
              onClick={handleGenerateSummary}
              className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors disabled:opacity-50"
            >
              {loadingAi ? (
                <div className="w-5 h-5 border-2 border-indigo-900/30 border-t-indigo-900 rounded-full animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {loadingAi ? 'Menganalisis...' : 'Analisis dengan Gemini'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
