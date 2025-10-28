
import React, { useRef } from 'react';
import type { Patient } from '../types';

interface PatientProfileProps {
  patient: Patient;
  onUpdatePhoto: (patientId: number, photoUrl: string) => void;
  onEdit: (patient: Patient) => void;
}

const DetailRow: React.FC<{ label: string; value?: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start py-3">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">{icon}</div>
    <div className="ml-4 flex-grow">
      <dt className="text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-brand-text-primary dark:text-brand-text-primary_dark">{value || 'N/A'}</dd>
    </div>
  </div>
);

const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onUpdatePhoto, onEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleActionClick = (action: 'Video Call' | 'Message') => {
    alert(`${action} with ${patient.name} initiated.`);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePhoto(patient.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-brand-surface-light dark:bg-brand-surface-dark rounded-xl shadow-md p-6 flex flex-col h-full transition-colors duration-300">
      <div className="flex justify-between items-start">
         <div className="flex-grow flex flex-col items-center text-center">
            <div className="relative group">
                <img className="h-24 w-24 rounded-full mb-4 ring-4 ring-gray-200 dark:ring-gray-600 object-cover" src={patient.photoUrl} alt={patient.name} />
                <button 
                    onClick={handleImageClick}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Change profile picture"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            <h2 className="text-xl font-bold">{patient.name}</h2>
            <p className="text-brand-text-secondary dark:text-brand-text-secondary_dark">Age: {patient.age}</p>
        </div>
        <button onClick={() => onEdit(patient)} className="p-2 text-brand-text-secondary dark:text-brand-text-secondary_dark hover:text-brand-blue dark:hover:text-brand-blue-light transition-colors" aria-label="Edit patient details">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
            </svg>
        </button>
      </div>
      
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700">
        <dl className="divide-y divide-gray-200 dark:divide-gray-700">
          <DetailRow label="Primary Caregiver" value={patient.primaryCaregiver} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.028.658a.78.78 0 01-.357.542zM10 12a5 5 0 015 5H5a5 5 0 015-5zM12 8a2 2 0 114 0 2 2 0 01-4 0zM14.51 15.326a.78.78 0 01.358-.442 3 3 0 01-4.308-3.516 6.484 6.484 0 001.905 3.959c.023.222.014.442-.028.658a.78.78 0 01.357.542z" /></svg>} />
          <DetailRow label="Emergency Contact" value={patient.emergencyContact} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>} />
          <DetailRow label="Conditions" value={patient.conditions} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>} />
          <DetailRow label="Allergies" value={patient.allergies} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>} />
        </dl>
      </div>

       {patient.notes && (
         <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
           <h4 className="text-sm font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Caregiver Notes</h4>
           <p className="mt-2 text-sm text-brand-text-primary dark:text-brand-text-primary_dark bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md whitespace-pre-wrap">{patient.notes}</p>
         </div>
       )}

      <div className="mt-auto pt-6 flex space-x-4">
        <button 
          onClick={() => handleActionClick('Video Call')}
          className="flex-1 bg-brand-blue text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-brand-blue-dark transition duration-200 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
          <span>Video Call</span>
        </button>
        <button
          onClick={() => handleActionClick('Message')}
          className="flex-1 bg-gray-200 dark:bg-gray-600 text-brand-text-primary dark:text-brand-text-primary_dark font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-200 flex items-center justify-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" /></svg>
          <span>Message</span>
        </button>
      </div>
    </div>
  );
};

export default PatientProfile;
