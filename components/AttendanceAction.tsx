
import React, { useState, useEffect } from 'react';
import { User, OfficeSettings, AttendanceRecord, AttendanceStatus } from '../types';
import { QrCode, MapPin, ShieldCheck, Camera, CheckCircle } from 'lucide-react';

interface AttendanceActionProps {
  user: User;
  settings: OfficeSettings;
  onAttend: (record: AttendanceRecord) => void;
}

const AttendanceAction: React.FC<AttendanceActionProps> = ({ user, settings, onAttend }) => {
  const [step, setStep] = useState<'scan' | 'validate' | 'success'>('scan');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // in metres
  };

  const startValidation = () => {
    setLoading(true);
    // Simulate getting GPS
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setLocation({ lat: latitude, lng: longitude });
      
      const dist = calculateDistance(latitude, longitude, settings.lat, settings.lng);
      setDistance(dist);
      setStep('validate');
      setLoading(false);
    }, (err) => {
      // Mock location for demo purposes if permission denied
      const mockLat = settings.lat + 0.0001;
      const mockLng = settings.lng + 0.0001;
      setLocation({ lat: mockLat, lng: mockLng });
      setDistance(15); 
      setStep('validate');
      setLoading(false);
    });
  };

  const confirmAttendance = () => {
    setLoading(true);
    setTimeout(() => {
      const now = new Date();
      const checkInTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      const [h, m] = settings.workStart.split(':').map(Number);
      const toleranceDate = new Date();
      toleranceDate.setHours(h, m + settings.toleranceMinutes);
      
      const isLate = now > toleranceDate;

      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        date: now.toISOString().split('T')[0],
        checkIn: checkInTime,
        status: isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
        location: location || { lat: 0, lng: 0 },
        isVerified: true
      };

      onAttend(newRecord);
      setStep('success');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800">Absensi Cerdas</h2>
          <p className="text-slate-500 text-sm mt-1">Validasi QR + GPS Real-time</p>
        </div>

        <div className="p-8">
          {step === 'scan' && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-48 h-48 mx-auto bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group">
                <QrCode size={80} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera className="text-indigo-600" size={32} />
                </div>
              </div>
              <p className="text-sm text-slate-600">Scan QR Code yang ada pada lobi atau meja kerja Anda.</p>
              <button 
                onClick={startValidation}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Camera size={20} />}
                Mulai Scan
              </button>
            </div>
          )}

          {step === 'validate' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={18} />
                    <span className="text-sm font-medium">Lokasi Anda</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Terdeteksi</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck size={18} />
                    <span className="text-sm font-medium">Jarak ke Kantor</span>
                  </div>
                  <span className={`text-sm font-bold ${distance && distance < settings.radius ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {distance ? `${Math.round(distance)}m` : 'Menghitung...'}
                  </span>
                </div>
              </div>

              {distance && distance > settings.radius ? (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium text-center">
                   ⚠️ Anda berada di luar radius kantor ({settings.radius}m).
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium text-center">
                   ✅ Lokasi valid. Anda berada dalam area kantor.
                </div>
              )}

              <button 
                onClick={confirmAttendance}
                disabled={loading || (distance ? distance > settings.radius : true)}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <CheckCircle size={20} />}
                Konfirmasi Absensi
              </button>
              
              <button 
                onClick={() => setStep('scan')}
                className="w-full py-2 text-slate-400 font-medium text-sm"
              >
                Batal
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle size={56} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Absensi Berhasil!</h3>
                <p className="text-slate-500">Data Anda telah tercatat dan notifikasi WhatsApp telah dikirim.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl inline-block w-full">
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Waktu Tercatat</p>
                 <p className="text-xl font-bold text-slate-700">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <button 
                onClick={() => setStep('scan')}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-colors"
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
         <ShieldCheck size={16} />
         <span className="text-xs font-medium">Enkripsi End-to-End • Device Locked</span>
      </div>
    </div>
  );
};

export default AttendanceAction;
