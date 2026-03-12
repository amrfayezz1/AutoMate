// App-level types built on top of database types
// database.types.ts is auto-generated from Supabase — never edit manually

export type TrackingMode = "time" | "mileage" | "both";
export type MaintenanceStatus = "ok" | "due-soon" | "overdue";
export type ReminderType = "push" | "email" | "both";

export interface Car {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  currentOdometer: number;
  trackingMode: TrackingMode;
  createdAt: string;
}

export interface MaintenanceType {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isDefault: boolean;
  defaultIntervalDays?: number;
  defaultIntervalKm?: number;
  sortOrder: number;
}

export interface MaintenanceRecord {
  id: string;
  carId: string;
  userId: string;
  typeId: string;
  type?: MaintenanceType;
  servicedAt: string;
  mileageAtService: number;
  cost?: number;
  providerName?: string;
  notes?: string;
  photoUrl?: string;
  nextDueDate?: string;
  nextDueKm?: number;
  createdAt: string;
}

export interface Reminder {
  id: string;
  carId: string;
  userId: string;
  typeId: string;
  type?: MaintenanceType;
  reminderType: ReminderType;
  advanceDays: number;
  advanceKm?: number;
  isActive: boolean;
  lastSentAt?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  carId: string;
  userId: string;
  name: string;
  expiryDate: string;
  fileUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface OdometerLog {
  id: string;
  carId: string;
  userId: string;
  reading: number;
  recordedAt: string;
}

export interface Profile {
  id: string;
  fullName?: string;
  email: string;
  avatarUrl?: string;
  preferredLanguage: "en" | "ar";
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface NextDueResult {
  nextDueDate: Date | null;
  nextDueKm: number | null;
}

export interface MaintenanceWithStatus extends MaintenanceRecord {
  status: MaintenanceStatus;
  daysUntilDue?: number;
  kmUntilDue?: number;
  urgencyScore: number;
}
