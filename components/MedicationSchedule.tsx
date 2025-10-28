
import React, { useState, useMemo } from 'react';
import type { MedicationLog } from '../types';
import { MedicationStatus } from '../types';
import Tooltip from './Tooltip';

interface MedicationScheduleProps {
  medications: MedicationLog[];
  patientId: number;
  onUpdateStatus: (patientId: number, medicationId: number, newStatus: MedicationStatus) => void;
}

type SortKey = 'time' | 'name';

const timeToMinutes = (timeStr: string): number => {
    if (!timeStr.includes(':') || !timeStr.includes(' ')) return 9999;
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};


const StatusIcon: React.FC<{ status: MedicationStatus }> = ({ status }) => {
  switch (status) {
    case MedicationStatus.TAKEN:
      return (
        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-success flex items-center justify-center">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
      );
    case MedicationStatus.MISSED:
      return (
        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-brand-danger flex items-center justify-center">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
      );
    case MedicationStatus.SCHEDULED:
      return (
        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
          <svg className="h-4 w-4 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      );
    default:
      return null;
  }
};

const MedicationItem: React.FC<{ med: MedicationLog; patientId: number; onUpdateStatus: Function }> = ({ med, patientId, onUpdateStatus }) => {
  const lowAdherence = med.adherenceRate !== undefined && med.adherenceRate < 0.8;
  return (
    <li className="flex items-center p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
      <StatusIcon status={med.status} />
      <div className="ml-4 flex-grow">
        <p className="font-medium flex items-center">
            {med.name}
            {lowAdherence && (
                <Tooltip text={`Adherence is low (${(med.adherenceRate! * 100).toFixed(0)}%). Consider discussing with the patient.`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-brand-warning" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-8a1 1 0 011-1h.008a1 1 0 011 1v3.008a1 1 0 01-2 0V5z" clipRule="evenodd" />
                    </svg>
                </Tooltip>
            )}
            <span className="text-sm text-brand-text-secondary dark:text-brand-text-secondary_dark ml-2">{med.dosage}</span>
        </p>
        <p className="text-sm text-brand-text-secondary dark:text-brand-text-secondary_dark">{med.time}</p>
      </div>
      {med.status === MedicationStatus.SCHEDULED && (
        <div className="flex space-x-2">
          <button 
            onClick={() => onUpdateStatus(patientId, med.id, MedicationStatus.TAKEN)}
            className="text-xs font-semibold py-1 px-3 rounded-md bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900 text-brand-success dark:text-green-300 transition"
          >
            Take
          </button>
          <button
            onClick={() => onUpdateStatus(patientId, med.id, MedicationStatus.MISSED)}
            className="text-xs font-semibold py-1 px-3 rounded-md bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 text-brand-danger dark:text-red-300 transition"
          >
            Miss
          </button>
        </div>
      )}
    </li>
  );
};

const MedicationSchedule: React.FC<MedicationScheduleProps> = ({ medications, patientId, onUpdateStatus }) => {
  const [sortKey, setSortKey] = useState<SortKey>('time');
  
  const { takenCount, totalCount, percentage } = useMemo(() => {
    const total = medications.length;
    const taken = medications.filter(m => m.status === MedicationStatus.TAKEN).length;
    return {
      takenCount: taken,
      totalCount: total,
      percentage: total > 0 ? (taken / total) * 100 : 0
    };
  }, [medications]);

  const sortedMedications = useMemo(() => {
    const sorted = [...medications];
    sorted.sort((a, b) => {
      if (sortKey === 'time') {
        const timeA = timeToMinutes(a.time);
        const timeB = timeToMinutes(b.time);
        if (timeA !== timeB) return timeA - timeB;
      }
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [medications, sortKey]);

  const groupedMedications = sortedMedications.reduce((acc, med) => {
    (acc[med.period] = acc[med.period] || []).push(med);
    return acc;
  }, {} as Record<'Morning' | 'Afternoon' | 'Evening', MedicationLog[]>);

  const periods: ('Morning' | 'Afternoon' | 'Evening')[] = ['Morning', 'Afternoon', 'Evening'];
  
  const SortButton: React.FC<{ type: SortKey, label: string }> = ({ type, label }) => {
    const isActive = sortKey === type;
    return (
        <button 
            onClick={() => setSortKey(type)}
            className={`text-xs font-semibold py-1 px-3 rounded-full transition-colors ${isActive ? 'bg-brand-blue text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
            {label}
        </button>
    );
  };

  return (
    <div className="bg-brand-surface-light dark:bg-brand-surface-dark rounded-xl shadow-md p-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Medication Compliance
        </h3>
        <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-brand-text-secondary dark:text-brand-text-secondary_dark">Sort by:</span>
            <SortButton type="time" label="Time" />
            <SortButton type="name" label="Name" />
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-sm">Daily Progress</span>
          <span className="font-bold text-sm">{takenCount} / {totalCount} Taken</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div className="bg-brand-success h-2.5 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      <div className="space-y-6">
        {periods.map(period => (
          (groupedMedications[period] && groupedMedications[period].length > 0) ? (
          <div key={period}>
            <h4 className="font-semibold mb-2 text-brand-text-primary dark:text-brand-text-primary_dark border-b dark:border-gray-700 pb-2">{period}</h4>
              <ul className="space-y-1">
                {groupedMedications[period].map(med => (
                  <MedicationItem key={med.id} med={med} patientId={patientId} onUpdateStatus={onUpdateStatus} />
                ))}
              </ul>
          </div>
          ) : null
        ))}
      </div>
    </div>
  );
};

export default MedicationSchedule;
