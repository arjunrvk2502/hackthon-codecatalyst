import React, { useState, useRef, useEffect } from 'react';
import type { Patient } from '../types';

interface PatientSelectorProps {
  patients: Patient[];
  selectedPatientId: number;
  onSelectPatient: (id: number) => void;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ patients, selectedPatientId, onSelectPatient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (id: number) => {
    onSelectPatient(id);
    setIsOpen(false);
  };
  
  if (!selectedPatient) return null;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-brand-surface-light dark:bg-brand-surface-dark border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-left w-full md:w-56 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
      >
        <img className="h-8 w-8 rounded-full" src={selectedPatient.photoUrl} alt={selectedPatient.name} />
        <span className="flex-grow text-brand-text-primary dark:text-brand-text-primary_dark font-medium truncate">{selectedPatient.name}</span>
        <svg className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-2 w-full bg-brand-surface-light dark:bg-brand-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-y-auto">
            {patients.map(patient => (
              <li key={patient.id}>
                <button
                  onClick={() => handleSelect(patient.id)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-brand-text-primary dark:text-brand-text-primary_dark hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <img className="h-8 w-8 rounded-full mr-3" src={patient.photoUrl} alt={patient.name} />
                  {patient.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PatientSelector;