
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Modal from './components/Modal';
import AddPatientForm from './components/AddPatientForm';
import SettingsPanel from './components/SettingsPanel';
import Chatbot from './components/Chatbot';
import { INITIAL_PATIENTS, USERS } from './constants';
import type { Patient, MedicationLog, MedicationStatus, User, Alert } from './types';
import { MetricType, MetricStatus, MedicationStatus as MedicationStatusEnum, AlertType } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(USERS);
  const [allPatients, setAllPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [sosBanner, setSosBanner] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') as 'light' | 'dark' || 'light');
  
  const sosBannerTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Cleanup effect for the timeout
    return () => {
        if (sosBannerTimeoutRef.current) {
            clearTimeout(sosBannerTimeoutRef.current);
        }
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const userPatients = currentUser ? allPatients.filter(p => p.userId === currentUser.id) : [];
  const selectedPatient = userPatients.find(p => p.id === selectedPatientId) || userPatients[0] || null;
  
  useEffect(() => {
    if(currentUser && !selectedPatientId && userPatients.length > 0) {
      setSelectedPatientId(userPatients[0].id)
    }
  }, [currentUser, userPatients, selectedPatientId])


  const handleSelectPatient = (id: number) => {
    setSelectedPatientId(id);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const firstPatient = allPatients.find(p => p.userId === user.id);
    setSelectedPatientId(firstPatient ? firstPatient.id : null);
  };

  const handleCreateAccount = (newUser: Omit<User, 'id' | 'notificationSettings'>) => {
     const userWithId: User = {
        ...newUser,
        id: Date.now(),
        notificationSettings: {
            [AlertType.ABNORMAL_VITALS]: true,
            [AlertType.FALL_DETECTED]: true,
            [AlertType.SOS_BUTTON]: true,
            [AlertType.MISSED_MEDICATION]: true,
            [AlertType.FOLLOW_UP_REMINDER]: true,
        }
    };
    setAllUsers(prev => [...prev, userWithId]);
    setCurrentUser(userWithId);
    setSelectedPatientId(null); // No patients for a new user yet
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedPatientId(null);
  };
  
  const handleSOS = () => {
      if (!selectedPatient) return;

      const confirmation = window.confirm(`Are you sure you want to trigger an SOS alert for ${selectedPatient.name}? This will immediately notify emergency contacts.`);

      if (confirmation) {
          const newAlert: Alert = {
              id: Date.now(),
              type: AlertType.SOS_BUTTON,
              details: 'SOS button pressed by caregiver.',
              timestamp: 'Now',
              severity: 'High'
          };

          setAllPatients(prevPatients =>
              prevPatients.map(p =>
                  p.id === selectedPatient.id
                      ? { ...p, alerts: [newAlert, ...p.alerts] }
                      : p
              )
          );

          // Clear any existing banner timeout to ensure reliability
          if (sosBannerTimeoutRef.current) {
              clearTimeout(sosBannerTimeoutRef.current);
          }

          // Show banner and set a new timeout
          setSosBanner({ visible: true, message: `SOS alert triggered for ${selectedPatient.name}!` });
          sosBannerTimeoutRef.current = window.setTimeout(() => {
              setSosBanner({ visible: false, message: ''});
              sosBannerTimeoutRef.current = null;
          }, 5000);
      }
  };

  const handleAddPatient = (patientData: Omit<Patient, 'id' | 'userId' | 'healthMetrics' | 'medicationSchedule' | 'alerts' | 'location' | 'photoUrl' | 'symptoms'> & { photoUrl?: string }) => {
    if (!currentUser) return;

    const newId = Date.now();
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      userId: currentUser.id,
      photoUrl: patientData.photoUrl || `https://picsum.photos/seed/${patientData.name.split(' ')[0]}/200`,
      healthMetrics: [
        { type: MetricType.HEART_RATE, value: '75', unit: 'bpm', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable', history: [{value: 75, timestamp: new Date().toISOString()}] },
        { type: MetricType.BLOOD_PRESSURE, value: '120/80', unit: 'mmHg', status: MetricStatus.NORMAL, timestamp: 'Now', trend: 'stable' },
      ],
      medicationSchedule: [
         { id: newId + 1, name: 'Multivitamin', dosage: '1 tablet', time: '9:00 AM', status: MedicationStatusEnum.SCHEDULED, period: 'Morning', adherenceRate: 1.0 },
      ],
      alerts: [],
      symptoms: [],
      location: {
        address: '45, Ranganathan Street, T. Nagar, Chennai, Tamil Nadu',
        timestamp: 'Just now',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=45,Ranganathan+Street,T.+Nagar,Chennai,Tamil+Nadu'
      }
    };
    setAllPatients(prev => [...prev, newPatient]);
    setSelectedPatientId(newPatient.id);
    setIsAddPatientModalOpen(false);
  };
  
  const handleUpdatePatient = (updatedData: Omit<Patient, 'id' | 'userId'>) => {
      if (!patientToEdit) return;
      setAllPatients(prev => prev.map(p => 
          p.id === patientToEdit.id ? { ...p, ...updatedData } : p
      ));
      setPatientToEdit(null);
  };
  
  const handleUpdatePatientPhoto = (patientId: number, photoUrl: string) => {
    setAllPatients(prev => prev.map(p => 
        p.id === patientId ? { ...p, photoUrl } : p
    ));
  };

  const handleUpdateMedicationStatus = (patientId: number, medicationId: number, newStatus: MedicationStatus) => {
    setAllPatients(prevPatients => 
      prevPatients.map(p => {
        if (p.id === patientId) {
          const medication = p.medicationSchedule.find(m => m.id === medicationId);
          let newAlerts = p.alerts;

          if (newStatus === MedicationStatusEnum.MISSED && medication) {
            const missedMedAlert: Alert = {
              id: Date.now(),
              type: AlertType.MISSED_MEDICATION,
              details: `${medication.name} dose was missed.`,
              timestamp: 'Now',
              severity: 'Medium'
            };
             const followupAlert: Alert = {
                id: Date.now() + 1,
                type: AlertType.FOLLOW_UP_REMINDER,
                details: `Check on patient about missed ${medication.name} dose.`,
                timestamp: 'Later Today',
                severity: 'Low'
            };
            newAlerts = [missedMedAlert, followupAlert, ...p.alerts];
          }

          return {
            ...p,
            alerts: newAlerts,
            medicationSchedule: p.medicationSchedule.map(med => 
              med.id === medicationId ? { ...med, status: newStatus } : med
            )
          };
        }
        return p;
      })
    );
  };
  
  const handleAddSymptom = (patientId: number, description: string) => {
      if (!description.trim()) return;

      setAllPatients(prev => prev.map(p => {
          if (p.id === patientId) {
              const newSymptom = {
                  id: Date.now(),
                  description,
                  timestamp: new Date().toLocaleString()
              };
              return { ...p, symptoms: [...p.symptoms, newSymptom] };
          }
          return p;
      }));
  };
  
  const handleUpdateUserSettings = (newSettings: User['notificationSettings']) => {
      if (!currentUser) return;
      
      const updatedUser = { ...currentUser, notificationSettings: newSettings };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };
  
  const closePatientModal = () => {
    setIsAddPatientModalOpen(false);
    setPatientToEdit(null);
  };


  if (!currentUser) {
    return <Login onLogin={handleLogin} onCreateAccount={handleCreateAccount} users={allUsers} />;
  }

  return (
    <div className="min-h-screen bg-brand-background-light dark:bg-brand-background-dark text-brand-text-primary dark:text-brand-text-primary_dark font-sans transition-colors duration-300">
       {sosBanner.visible && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-brand-danger text-white text-center py-3 font-semibold shadow-lg animate-pulse">
            {sosBanner.message}
        </div>
      )}
      <Header
        patients={userPatients}
        selectedPatientId={selectedPatientId}
        selectedPatientName={selectedPatient?.name}
        onSelectPatient={handleSelectPatient}
        onAddPatient={() => setIsAddPatientModalOpen(true)}
        onLogout={handleLogout}
        onSOS={handleSOS}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {selectedPatient ? (
          <Dashboard 
            patient={selectedPatient} 
            onUpdateMedicationStatus={handleUpdateMedicationStatus} 
            onAddSymptom={handleAddSymptom}
            onUpdatePatientPhoto={handleUpdatePatientPhoto}
            onEditPatient={setPatientToEdit}
            currentUser={currentUser}
            onOpenChatbot={() => setIsChatbotOpen(true)}
          />
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold">No patient selected.</h2>
            <p className="text-brand-text-secondary dark:text-brand-text-secondary_dark mt-2">Please add your first patient to begin monitoring.</p>
          </div>
        )}
      </main>
      
      <Modal isOpen={isAddPatientModalOpen || !!patientToEdit} onClose={closePatientModal} title={patientToEdit ? 'Edit Patient Details' : 'Add New Patient'}>
        <AddPatientForm 
            onSubmit={(data) => {
                if (patientToEdit) {
                    handleUpdatePatient(data as Omit<Patient, 'id' | 'userId'>);
                } else {
                    handleAddPatient(data as Parameters<typeof handleAddPatient>[0]);
                }
            }} 
            onCancel={closePatientModal}
            initialData={patientToEdit}
        />
      </Modal>

       <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Notification Settings">
        <SettingsPanel 
            settings={currentUser.notificationSettings} 
            onUpdateSettings={handleUpdateUserSettings} 
            onClose={() => setIsSettingsModalOpen(false)}
        />
      </Modal>

      {selectedPatient && (
        <Modal isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} title="CareBot Assistant">
            <Chatbot patient={selectedPatient} />
        </Modal>
      )}
    </div>
  );
};

export default App;
