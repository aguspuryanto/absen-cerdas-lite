
import React, { useState } from 'react';
import { OfficeSettings } from '../types';
import { Map, Clock, Shield, BellRing, Save } from 'lucide-react';

interface SettingsProps {
  settings: OfficeSettings;
  onSave: (settings: OfficeSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<OfficeSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      alert("Pengaturan berhasil disimpan!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Pengaturan Sistem</h2>
        <p className="text-slate-500">Konfigurasi lokasi kantor, jam kerja, dan parameter keamanan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Work Hours */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Clock className="text-indigo-500" size={20} /> Jam Kerja
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Masuk</label>
                  <input 
                    type="time" 
                    value={formData.workStart}
                    onChange={(e) => setFormData({...formData, workStart: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pulang</label>
                  <input 
                    type="time" 
                    value={formData.workEnd}
                    onChange={(e) => setFormData({...formData, workEnd: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Toleransi (Menit)</label>
                <input 
                  type="number" 
                  value={formData.toleranceMinutes}
                  onChange={(e) => setFormData({...formData, toleranceMinutes: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Location / Geofencing */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Map className="text-emerald-500" size={20} /> Geofencing
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Latitude</label>
                <input 
                  type="text" 
                  value={formData.lat}
                  onChange={(e) => setFormData({...formData, lat: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Longitude</label>
                <input 
                  type="text" 
                  value={formData.lng}
                  onChange={(e) => setFormData({...formData, lng: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Radius Kehadiran (Meter)</label>
                <input 
                  type="number" 
                  value={formData.radius}
                  onChange={(e) => setFormData({...formData, radius: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Security & Notifications */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Shield className="text-rose-500" size={20} /> Keamanan & Notifikasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <input type="checkbox" checked readOnly className="w-5 h-5 text-indigo-600 rounded" />
              </div>
              <div>
                <p className="font-bold text-slate-700">Device Lock</p>
                <p className="text-sm text-slate-500">Hanya izinkan absensi dari perangkat yang sudah terverifikasi.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <input type="checkbox" checked readOnly className="w-5 h-5 text-indigo-600 rounded" />
              </div>
              <div>
                <p className="font-bold text-slate-700">WhatsApp Notification</p>
                <p className="text-sm text-slate-500">Kirim laporan otomatis ke HR dan karyawan setiap absensi.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save size={20} />
            )}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
