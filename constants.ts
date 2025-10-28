
import { Patient, MetricType, MetricStatus, MedicationStatus, AlertType, User } from './types';

// Mock users for login simulation
export const USERS: User[] = [
    { 
        id: 1, 
        name: 'Sarah Vance', 
        email: 'caregiver@example.com', 
        password: 'password',
        notificationSettings: {
            [AlertType.ABNORMAL_VITALS]: true,
            [AlertType.FALL_DETECTED]: true,
            [AlertType.SOS_BUTTON]: true,
            [AlertType.MISSED_MEDICATION]: true,
            [AlertType.FOLLOW_UP_REMINDER]: true,
        }
    },
    { 
        id: 2, 
        name: 'John Pendelton', 
        email: 'john@example.com', 
        password: 'password123',
        notificationSettings: {
            [AlertType.ABNORMAL_VITALS]: true,
            [AlertType.FALL_DETECTED]: false,
            [AlertType.SOS_BUTTON]: true,
            [AlertType.MISSED_MEDICATION]: true,
            [AlertType.FOLLOW_UP_REMINDER]: false,
        }
    },
];

const generateHeartRateHistory = (base: number) => {
    const history = [];
    let current = base;
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        current += Math.floor(Math.random() * 7) - 3; // Fluctuate a bit
        history.push({ value: current, timestamp: date.toISOString() });
    }
    return history;
}

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 1,
    userId: 1, // Belongs to Sarah Vance
    name: 'Eleanor Vance',
    age: 82,
    photoUrl: 'https://picsum.photos/seed/eleanor/200',
    primaryCaregiver: 'Sarah Vance (Daughter)',
    emergencyContact: 'Dr. Miller - (555) 123-4567',
    conditions: 'Hypertension, Type 2 Diabetes',
    allergies: 'Penicillin',
    notes: 'Needs help with mobility in the mornings. Prefers meals to be low-sodium.',
    location: {
        address: '15, Anna Salai, Chennai, Tamil Nadu',
        timestamp: 'Updated 5 mins ago',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=15,Anna+Salai,Chennai,Tamil+Nadu'
    },
    symptoms: [
        { id: 1, description: 'Slight headache in the morning.', timestamp: new Date(Date.now() - 86400000).toLocaleString() }
    ],
    healthMetrics: [
      { type: MetricType.HEART_RATE, value: '72', unit: 'bpm', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable', history: generateHeartRateHistory(72) },
      { type: MetricType.BLOOD_PRESSURE, value: '130/85', unit: 'mmHg', status: MetricStatus.ELEVATED, timestamp: 'Now', trend: 'up' },
      { type: MetricType.SPO2, value: '96', unit: '%', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable' },
      { type: MetricType.GLUCOSE, value: '110', unit: 'mg/dL', status: MetricStatus.NORMAL, timestamp: '8:00 AM', trend: 'down' },
    ],
    medicationSchedule: [
      { id: 1, name: 'Lisinopril', dosage: '10mg', time: '8:00 AM', status: MedicationStatus.TAKEN, period: 'Morning', adherenceRate: 0.95 },
      { id: 2, name: 'Metformin', dosage: '500mg', time: '8:00 AM', status: MedicationStatus.TAKEN, period: 'Morning', adherenceRate: 0.98 },
      { id: 3, name: 'Atorvastatin', dosage: '20mg', time: '8:00 PM', status: MedicationStatus.SCHEDULED, period: 'Evening', adherenceRate: 0.9 },
    ],
    alerts: [
      { id: 1, type: AlertType.ABNORMAL_VITALS, details: 'Blood pressure spike detected.', timestamp: '10 mins ago', severity: 'Medium' },
    ],
  },
  {
    id: 2,
    userId: 2, // Belongs to John Pendelton
    name: 'Arthur Pendelton',
    age: 78,
    photoUrl: 'https://picsum.photos/seed/arthur/200',
    primaryCaregiver: 'John Pendelton (Son)',
    emergencyContact: 'Emergency Services - 911',
    conditions: 'Arthritis, Asthma',
    allergies: 'None reported',
    location: {
        address: '100 Feet Rd, Gandhipuram, Coimbatore, Tamil Nadu',
        timestamp: 'Updated 12 mins ago',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=100+Feet+Rd,Gandhipuram,Coimbatore,Tamil+Nadu'
    },
    symptoms: [],
    healthMetrics: [
      { type: MetricType.HEART_RATE, value: '65', unit: 'bpm', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable', history: generateHeartRateHistory(65) },
      { type: MetricType.BLOOD_PRESSURE, value: '125/80', unit: 'mmHg', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable' },
      { type: MetricType.SPO2, value: '98', unit: '%', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable' },
      { type: MetricType.WEIGHT, value: '180', unit: 'lbs', status: MetricStatus.NORMAL, timestamp: 'Yesterday', trend: 'down' },
    ],
    medicationSchedule: [
      { id: 4, name: 'Aspirin', dosage: '81mg', time: '9:00 AM', status: MedicationStatus.TAKEN, period: 'Morning', adherenceRate: 1.0 },
      { id: 5, name: 'Vitamin D', dosage: '1000 IU', time: '9:00 AM', status: MedicationStatus.MISSED, period: 'Morning', adherenceRate: 0.75 },
      { id: 6, name: 'Albuterol Inhaler', dosage: 'As needed', time: 'Afternoon', status: MedicationStatus.SCHEDULED, period: 'Afternoon' },
    ],
    alerts: [
        { id: 2, type: AlertType.FALL_DETECTED, details: 'Potential fall detected in the living room.', timestamp: '2 hours ago', severity: 'High' },
    ],
  },
    {
    id: 3,
    userId: 1, // Also belongs to Sarah Vance
    name: 'George Miller',
    age: 75,
    photoUrl: 'https://picsum.photos/seed/george/200',
    primaryCaregiver: 'Sarah Vance (Neighbor)',
    emergencyContact: '(555) 987-6543',
    conditions: 'Early-stage dementia',
    allergies: 'Shellfish',
    location: {
        address: '22, West Masi Street, Madurai, Tamil Nadu',
        timestamp: 'Updated 30 mins ago',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=22,West+Masi+Street,Madurai,Tamil+Nadu'
    },
    symptoms: [],
    healthMetrics: [
      { type: MetricType.HEART_RATE, value: '80', unit: 'bpm', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable', history: generateHeartRateHistory(80) },
      { type: MetricType.BLOOD_PRESSURE, value: '128/82', unit: 'mmHg', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable' },
    ],
    medicationSchedule: [
      { id: 7, name: 'Donepezil', dosage: '5mg', time: '8:00 PM', status: MedicationStatus.SCHEDULED, period: 'Evening', adherenceRate: 0.85 },
    ],
    alerts: [],
  },
];
