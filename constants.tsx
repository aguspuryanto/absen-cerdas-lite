
import { User, UserRole, OfficeSettings, AttendanceRecord, AttendanceStatus } from './types';

export const INITIAL_OFFICE_SETTINGS: OfficeSettings = {
  name: "Main HQ Office",
  lat: -6.2088, // Example Jakarta Coordinates
  lng: 106.8456,
  radius: 100,
  workStart: "08:00",
  workEnd: "17:00",
  toleranceMinutes: 15
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Budi Santoso', email: 'budi@company.com', role: UserRole.ADMIN, department: 'IT Operations' },
  { id: '2', name: 'Siti Aminah', email: 'siti@company.com', role: UserRole.EMPLOYEE, department: 'Human Resources' },
  { id: '3', name: 'Agus Salim', email: 'agus@company.com', role: UserRole.EMPLOYEE, department: 'Marketing' },
  { id: '4', name: 'Dewi Lestari', email: 'dewi@company.com', role: UserRole.EMPLOYEE, department: 'Finance' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'a1',
    userId: '2',
    userName: 'Siti Aminah',
    date: '2024-05-20',
    checkIn: '07:55',
    checkOut: '17:05',
    status: AttendanceStatus.PRESENT,
    location: { lat: -6.2088, lng: 106.8456 },
    isVerified: true
  },
  {
    id: 'a2',
    userId: '3',
    userName: 'Agus Salim',
    date: '2024-05-20',
    checkIn: '08:20',
    checkOut: '17:00',
    status: AttendanceStatus.LATE,
    location: { lat: -6.2090, lng: 106.8458 },
    isVerified: true
  }
];
