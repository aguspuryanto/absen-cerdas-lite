
import React, { useState, useEffect } from 'react';
import { User, UserRole, AttendanceRecord, OfficeSettings } from './types';
import { MOCK_USERS, MOCK_ATTENDANCE, INITIAL_OFFICE_SETTINGS } from './constants';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import AttendanceAction from './components/AttendanceAction';
import Settings from './components/Settings';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  const [settings, setSettings] = useState<OfficeSettings>(INITIAL_OFFICE_SETTINGS);

  // Auto-login simulation for demo
  useEffect(() => {
    // Defaulting to Admin for the sake of the developer preview
    setCurrentUser(MOCK_USERS[0]);
  }, []);

  const handleLogin = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const addAttendance = (record: AttendanceRecord) => {
    setAttendance(prev => [record, ...prev]);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">AbsenCerdas</h1>
            <p className="text-slate-500 mt-2">Employee Smart Attendance System</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Demo Access</p>
            {MOCK_USERS.map(user => (
              <button
                key={user.id}
                onClick={() => handleLogin(user.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
              >
                <div className="text-left">
                  <p className="font-bold text-slate-700">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.role} • {user.department}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-indigo-500 group-hover:text-white flex items-center justify-center transition-colors">
                  →
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentUser.role === UserRole.ADMIN ? 
          <AdminDashboard records={attendance} users={MOCK_USERS} /> : 
          <EmployeeDashboard user={currentUser} records={attendance} />;
      case 'attendance':
        return <AttendanceAction user={currentUser} settings={settings} onAttend={addAttendance} />;
      case 'reports':
        return <Reports records={attendance} isAdmin={currentUser.role === UserRole.ADMIN} />;
      case 'settings':
        return <Settings settings={settings} onSave={setSettings} />;
      default:
        return <AdminDashboard records={attendance} users={MOCK_USERS} />;
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
