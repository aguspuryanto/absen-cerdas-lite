
import React from 'react';
import { User, AttendanceRecord, AttendanceStatus } from '../types';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface EmployeeDashboardProps {
  user: User;
  records: AttendanceRecord[];
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, records }) => {
  const userRecords = records.filter(r => r.userId === user.id);
  
  const stats = {
    present: userRecords.filter(r => r.status === AttendanceStatus.PRESENT).length,
    late: userRecords.filter(r => r.status === AttendanceStatus.LATE).length,
    averageCheckIn: "08:05" // Mock logic
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Halo, {user.name.split(' ')[0]}! 👋</h2>
            <p className="text-indigo-100 opacity-80">Selamat datang kembali. Jangan lupa untuk melakukan absensi hari ini.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Status Hari Ini</p>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
               <p className="text-xl font-bold italic">Sudah Absen</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Kehadiran Bulan Ini</p>
          <p className="text-2xl font-bold text-slate-800">{stats.present} Hari</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Keterlambatan</p>
          <p className="text-2xl font-bold text-amber-600">{stats.late} Kali</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">Rata-rata Jam Masuk</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.averageCheckIn}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Riwayat Absensi Terakhir</h3>
          <button className="text-sm text-indigo-600 font-semibold hover:underline">Lihat Semua</button>
        </div>
        <div className="divide-y divide-slate-50">
          {userRecords.length > 0 ? (
            userRecords.map(record => (
              <div key={record.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    record.status === AttendanceStatus.PRESENT ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {record.status === AttendanceStatus.PRESENT ? <CheckCircle2 /> : <Clock />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="text-xs text-slate-500">Kantor Utama • Verified GPS</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Check In</p>
                    <p className="font-bold text-slate-700">{record.checkIn}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Check Out</p>
                    <p className="font-bold text-slate-700">{record.checkOut || '--:--'}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    record.status === AttendanceStatus.PRESENT ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {record.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400">
               Belum ada data absensi tercatat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
