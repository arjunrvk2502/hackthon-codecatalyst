
export enum MetricType {
  HEART_RATE = 'Heart Rate',
  BLOOD_PRESSURE = 'Blood Pressure',
  SPO2 = 'SpO2',
  GLUCOSE = 'Glucose',
  WEIGHT = 'Weight',
}

export enum MetricStatus {
  NORMAL = 'Normal',
  ELEVATED = 'Elevated',
  LOW = 'Low',
  CRITICAL = 'Critical',
}

export interface HealthMetric {
  type: MetricType;
  value: string;
  unit: string;
  status: MetricStatus;
  timestamp: string;
  trend: 'up' | 'down' | 'stable';
  history?: { value: number; timestamp: string }[];
}

export enum MedicationStatus {
  TAKEN = 'Taken',
  MISSED = 'Missed',
  SCHEDULED = 'Scheduled',
}

export interface MedicationLog {
  id: number;
  name: string;
  dosage: string;
  time: string;
  status: MedicationStatus;
  period: 'Morning' | 'Afternoon' | 'Evening';
  adherenceRate?: number;
}

export enum AlertType {
  FALL_DETECTED = 'Fall Detected',
  ABNORMAL_VITALS = 'Abnormal Vitals',
  SOS_BUTTON = 'SOS Button',
  MISSED_MEDICATION = 'Missed Medication',
  FOLLOW_UP_REMINDER = 'Follow-up Reminder',
}

export interface Alert {
  id: number;
  type: AlertType;
  details: string;
  timestamp: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface Patient {
  id: number;
  userId: number; // Link to a user
  name: string;
  age: number;
  photoUrl: string;
  primaryCaregiver: string;
  emergencyContact: string;
  conditions?: string;
  allergies?: string;
  notes?: string;
  location: {
    address: string;
    timestamp: string;
    mapUrl: string;
  };
  symptoms: {
      id: number;
      description: string;
      timestamp: string;
  }[];
  healthMetrics: HealthMetric[];
  medicationSchedule: MedicationLog[];
  alerts: Alert[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    notificationSettings: {
        [key in AlertType]?: boolean;
    };
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
