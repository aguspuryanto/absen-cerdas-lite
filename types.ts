
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  deviceId?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  isVerified: boolean;
}

export interface OfficeSettings {
  name: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  workStart: string; // e.g., "08:00"
  workEnd: string; // e.g., "17:00"
  toleranceMinutes: number;
}
