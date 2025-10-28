
import React, { useState } from 'react';

interface Symptom {
    id: number;
    description: string;
    timestamp: string;
}

interface SymptomLoggerProps {
  patientId: number;
  symptoms: Symptom[];
  onAddSymptom: (patientId: number, description: string) => void;
}

const SymptomLogger: React.FC<SymptomLoggerProps> = ({ patientId, symptoms, onAddSymptom }) => {
  const [newSymptom, setNewSymptom] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSymptom(patientId, newSymptom);
    setNewSymptom('');
  };

  return (
    <div className="bg-brand-surface-light dark:bg-brand-surface-dark rounded-xl shadow-md p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold mb-4">Symptom Log</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSymptom}
          onChange={(e) => setNewSymptom(e.target.value)}
          placeholder="e.g., Feeling dizzy after lunch..."
          className="flex-grow mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue bg-brand-surface-light dark:bg-gray-700 text-brand-text-primary dark:text-brand-text-primary_dark"
        />
        <button
          type="submit"
          disabled={!newSymptom.trim()}
          className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
        >
          Log
        </button>
      </form>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
        {symptoms.length > 0 ? (
            [...symptoms].reverse().map(symptom => (
            <div key={symptom.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-sm">{symptom.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{symptom.timestamp}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-brand-text-secondary dark:text-brand-text-secondary_dark py-4">No symptoms logged yet.</p>
        )}
      </div>
    </div>
  );
};

export default SymptomLogger;
