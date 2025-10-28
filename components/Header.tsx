
import React from 'react';
import type { Patient, User } from '../types';
import PatientSelector from './PatientSelector';
import Tooltip from './Tooltip';

interface HeaderProps {
  patients: Patient[];
  selectedPatientId: number | null;
  selectedPatientName?: string;
  onSelectPatient: (id: number) => void;
  onAddPatient: () => void;
  onLogout: () => void;
  onSOS: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: User;
}

const Header: React.FC<HeaderProps> = ({ patients, selectedPatientId, onSelectPatient, onAddPatient, onLogout, onSOS, onOpenSettings, theme, toggleTheme, currentUser }) => {
  return (
    <header className="bg-brand-surface-light dark:bg-brand-surface-dark shadow-sm sticky top-0 z-20 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <svg className="h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h1 className="ml-3 text-2xl font-bold text-brand-text-primary dark:text-brand-text-primary_dark hidden sm:block">CareConnect</h1>
          </div>
          
          {/* Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
             {patients.length > 0 && selectedPatientId && (
                <PatientSelector 
                  patients={patients} 
                  selectedPatientId={selectedPatientId} 
                  onSelectPatient={onSelectPatient} 
                />
             )}
            <Tooltip text="Add Patient">
                <button
                  onClick={onAddPatient}
                  className="p-2.5 rounded-full bg-brand-blue text-white hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
                  aria-label="Add new patient"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </button>
            </Tooltip>
            <Tooltip text="SOS Alert">
                <button
                  onClick={onSOS}
                  disabled={!selectedPatientId}
                  className="p-2.5 rounded-full bg-brand-danger text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-danger transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed animate-pulse disabled:animate-none"
                  aria-label="Trigger SOS Alert"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 012 0v5a1 1 0 11-2 0V4zm1 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                   </svg>
                </button>
            </Tooltip>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            
            <Tooltip text="Settings">
                <button
                  onClick={onOpenSettings}
                  className="p-2.5 rounded-full text-brand-text-secondary dark:text-brand-text-secondary_dark hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
                  aria-label="Open settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
            </Tooltip>
            <Tooltip text={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full text-brand-text-secondary dark:text-brand-text-secondary_dark hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 14.95a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM5 11a1 1 0 100-2H4a1 1 0 100 2h1z" clipRule="evenodd" /></svg>
                  )}
                </button>
            </Tooltip>
             <Tooltip text="Logout">
                <button
                  onClick={onLogout}
                  className="p-2.5 rounded-full text-brand-text-secondary dark:text-brand-text-secondary_dark hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors"
                  aria-label="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                </button>
            </Tooltip>
            <div className="hidden md:flex items-center pl-2 space-x-3">
               <span className="text-sm font-medium text-brand-text-primary dark:text-brand-text-primary_dark">{currentUser.name}</span>
               <img className="h-10 w-10 rounded-full" src={`https://picsum.photos/seed/${currentUser.name.split(' ')[0]}/200`} alt="Caregiver" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
