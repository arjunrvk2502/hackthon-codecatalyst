import React, { useMemo } from 'react';
import type { Patient, MedicationStatus, User } from '../types';
import { AlertType } from '../types';
import PatientProfile from './PatientProfile';
import AlertsPanel from './AlertsPanel';
import HealthMetrics from './HealthMetrics';
import MedicationSchedule from './MedicationSchedule';
import LocationPanel from './LocationPanel';
import SymptomLogger from './SymptomLogger';

interface DashboardProps {
  patient: Patient;
  onUpdateMedicationStatus: (patientId: number, medicationId: number, newStatus: MedicationStatus) => void;
  onAddSymptom: (patientId: number, description: string) => void;
  onUpdatePatientPhoto: (patientId: number, photoUrl: string) => void;
  onEditPatient: (patient: Patient) => void;
  onOpenChatbot: () => void;
  currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ patient, onUpdateMedicationStatus, onAddSymptom, onUpdatePatientPhoto, onEditPatient, onOpenChatbot, currentUser }) => {

  const filteredAlerts = useMemo(() => {
    if (!currentUser.notificationSettings) {
        return patient.alerts; // If no settings, show all
    }
    // Always show SOS alerts, regardless of settings. For others, check settings.
    return patient.alerts.filter(alert => 
        alert.type === AlertType.SOS_BUTTON || currentUser.notificationSettings[alert.type] !== false
    );
  }, [patient.alerts, currentUser.notificationSettings]);

  return (
    <div className="relative">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="xl:col-span-1 flex flex-col gap-6 lg:gap-8">
            <PatientProfile patient={patient} onUpdatePhoto={onUpdatePatientPhoto} onEdit={onEditPatient} />
            <AlertsPanel alerts={filteredAlerts} />
            <LocationPanel location={patient.location} />
          </div>
          {/* Right Column */}
          <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8">
            <HealthMetrics patient={patient} />
            <SymptomLogger 
                patientId={patient.id}
                symptoms={patient.symptoms}
                onAddSymptom={onAddSymptom}
            />
            <MedicationSchedule 
              patientId={patient.id}
              medications={patient.medicationSchedule} 
              onUpdateStatus={onUpdateMedicationStatus}
            />
          </div>
        </div>
        
        {/* Chatbot FAB */}
        <button
            onClick={onOpenChatbot}
            className="fixed bottom-8 right-8 bg-brand-blue text-white rounded-full p-4 shadow-lg hover:bg-brand-blue-dark transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue z-30"
            aria-label="Open AI health assistant"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 5.79 2 10.5C2 12.54 2.99 14.39 4.64 15.89L2.5 21.5L8.11 19.36C9.33 19.78 10.64 20 12 20C17.52 20 22 16.21 22 11.5C22 6.79 17.52 3 12 3C11.67 3 11.33 3.02 11 3.05C11 3.02 11 3 11 3M12 2L11.5 2.03C7.5 2.03 4.5 4.81 4.5 8.5C4.5 10.04 5.24 11.43 6.45 12.5L5 17L9.5 15.55C10.57 15.95 11.77 16.19 13 16.19C16.97 16.19 20 13.58 20 10C20 6.42 16.97 3.81 13 3.81C12.67 3.81 12.33 3.83 12 3.86L12 2Z" />
                <path d="M15.5 8.5A1.5 1.5 0 1 1 14 7A1.5 1.5 0 0 1 15.5 8.5M10.5 8.5A1.5 1.5 0 1 1 9 7A1.5 1.5 0 0 1 10.5 8.5M12 14C14.21 14 16 12.21 16 10L15 10C15 11.66 13.66 13 12 13S9 11.66 9 10L8 10C8 12.21 9.79 14 12 14Z" />
            </svg>
        </button>
    </div>
  );
};

export default Dashboard;