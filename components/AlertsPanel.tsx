import React, { useState, useEffect } from 'react';
import type { Alert } from '../types';
import { AlertType } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertIcon: React.FC<{ type: AlertType, severity: 'High' | 'Medium' | 'Low' }> = ({ type, severity }) => {
  const colorClass = severity === 'High' ? 'text-brand-danger' : severity === 'Medium' ? 'text-brand-warning' : 'text-brand-text-secondary dark:text-brand-text-secondary_dark';
  let path;
  switch (type) {
    case AlertType.FALL_DETECTED:
      path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657l-5.657-5.657-5.657 5.657-1.414-1.414 5.657-5.657-5.657-5.657L6.343 4.343l5.657 5.657 5.657-5.657 1.414 1.414-5.657 5.657 5.657 5.657-1.414 1.414z" />;
      break;
    case AlertType.ABNORMAL_VITALS:
      path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />;
      break;
    case AlertType.SOS_BUTTON:
      path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
      break;
    case AlertType.MISSED_MEDICATION:
       path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 3v2m6-2v2" />;
       break;
    case AlertType.FOLLOW_UP_REMINDER:
        path = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
        break;
  }
  return (
    <div className={`flex-shrink-0 mr-4 ${colorClass}`}>
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {path}
      </svg>
    </div>
  );
};

const getSeverityStyles = (severity: Alert['severity']) => {
    switch(severity) {
        case 'High':
            return 'bg-red-50 dark:bg-red-900/40 ring-red-200 dark:ring-red-800';
        case 'Medium':
            return 'bg-yellow-50 dark:bg-yellow-900/40 ring-yellow-200 dark:ring-yellow-800';
        default:
            return 'bg-gray-50 dark:bg-gray-800/50 ring-gray-200 dark:ring-gray-700';
    }
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>(alerts);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCurrentAlerts(alerts);
    setAcknowledgedAlerts(new Set());
  }, [alerts]);

  const handleAcknowledge = (id: number) => {
    setAcknowledgedAlerts(prev => new Set(prev).add(id));
  };

  const handleDismiss = (id: number) => {
    setCurrentAlerts(prev => prev.filter(alert => alert.id !== id));
    setAcknowledgedAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
    });
  };
  
  return (
    <div className="bg-brand-surface-light dark:bg-brand-surface-dark rounded-xl shadow-md p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-warning" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-8a1 1 0 011-1h.008a1 1 0 011 1v3.008a1 1 0 01-2 0V5z" clipRule="evenodd" />
        </svg>
        Urgent Alerts
      </h3>
      {currentAlerts.length > 0 ? (
        <ul className="space-y-4">
          {currentAlerts.map(alert => {
            const isAcknowledged = acknowledgedAlerts.has(alert.id);
            return (
               <li key={alert.id} className={`p-4 rounded-lg transition-all ring-1 ${getSeverityStyles(alert.severity)} ${isAcknowledged ? 'ring-2 !ring-brand-success' : ''}`}>
                <div className="flex items-start">
                  <AlertIcon type={alert.type} severity={alert.severity} />
                  <div className="flex-grow">
                    <p className="font-semibold">{alert.type}</p>
                    <p className="text-sm text-brand-text-secondary dark:text-brand-text-secondary_dark">{alert.details}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
                {!isAcknowledged && (
                <div className="mt-3 flex justify-end space-x-2">
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    aria-label={`Acknowledge alert ${alert.id}`}
                    className="text-xs font-semibold py-1 px-3 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-brand-text-secondary dark:text-brand-text-primary_dark transition-colors"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    aria-label={`Dismiss alert ${alert.id}`}
                    className="text-xs font-semibold py-1 px-3 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-red-100 dark:hover:bg-red-900/50 text-brand-text-secondary dark:text-brand-text-primary_dark hover:text-brand-danger dark:hover:text-red-400 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-center text-brand-text-secondary dark:text-brand-text-secondary_dark py-4">No urgent alerts.</p>
      )}
    </div>
  );
};

export default AlertsPanel;