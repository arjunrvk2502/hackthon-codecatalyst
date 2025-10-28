import React from 'react';

interface LocationPanelProps {
  location: {
    address: string;
    timestamp: string;
    mapUrl: string;
  };
}

const LocationPanel: React.FC<LocationPanelProps> = ({ location }) => {
  return (
    <div className="bg-brand-surface-light dark:bg-brand-surface-dark rounded-xl shadow-md p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-brand-blue" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        Patient Location
      </h3>
      <div className="space-y-2">
        <div>
          <p className="font-semibold text-brand-text-primary dark:text-brand-text-primary_dark">{location.address}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{location.timestamp}</p>
        </div>
        <a 
          href={location.mapUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors"
        >
          View on Map &rarr;
        </a>
      </div>
    </div>
  );
};

export default LocationPanel;
