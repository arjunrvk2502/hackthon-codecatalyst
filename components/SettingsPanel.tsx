
import React, { useState } from 'react';
import { User, AlertType } from '../types';

interface SettingsPanelProps {
  settings: User['notificationSettings'];
  onUpdateSettings: (newSettings: User['notificationSettings']) => void;
  onClose: () => void;
}

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onChange: (enabled: boolean) => void }> = ({ label, enabled, onChange }) => (
  <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
    <span className="font-medium">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-14 h-8 rounded-full transition ${enabled ? 'bg-brand-blue' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${enabled ? 'translate-x-6' : ''}`}></div>
    </div>
  </label>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings, onClose }) => {
  const [currentSettings, setCurrentSettings] = useState(settings);

  const handleToggle = (key: AlertType, value: boolean) => {
    setCurrentSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    onUpdateSettings(currentSettings);
    onClose();
  };
  
  const alertTypes = Object.values(AlertType);

  return (
    <div className="flex flex-col">
      <p className="text-sm text-brand-text-secondary dark:text-brand-text-secondary_dark mb-4">
        Choose which alerts you would like to receive as push notifications.
      </p>
      <div className="space-y-3">
        {alertTypes.map(type => (
          <ToggleSwitch
            key={type}
            label={type}
            enabled={currentSettings[type] !== false} // Default to true if undefined
            onChange={(value) => handleToggle(type, value)}
          />
        ))}
      </div>
       <div className="flex justify-end pt-6 mt-4 border-t dark:border-gray-700">
        <button onClick={handleSave} className="bg-brand-blue text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-blue-dark transition">
          Done
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
