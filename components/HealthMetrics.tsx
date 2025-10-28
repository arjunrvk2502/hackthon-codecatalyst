
import React, { useState, useEffect } from 'react';
import type { Patient, HealthMetric } from '../types';
import { MetricStatus, MetricType } from '../types';
import { generateHealthSummary, generateHealthInsights } from '../services/geminiService';
import LineChart from './LineChart';

interface HealthMetricsProps {
  patient: Patient;
}

const getStatusColor = (status: MetricStatus) => {
  switch (status) {
    case MetricStatus.CRITICAL: return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case MetricStatus.ELEVATED:
    case MetricStatus.LOW:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case MetricStatus.NORMAL:
    default:
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
  }
};

const MetricCard: React.FC<{ metric: HealthMetric }> = ({ metric }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex flex-col justify-between transition-colors duration-300">
      <div>
        <p className="text-sm text-brand-text-secondary dark:text-brand-text-secondary_dark">{metric.type}</p>
        <p className="text-2xl font-bold text-brand-text-primary dark:text-brand-text-primary_dark">{metric.value} <span className="text-lg font-normal">{metric.unit}</span></p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(metric.status)}`}>
          {metric.status}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{metric.timestamp}</span>
      </div>
    </div>
  );
};

const HealthMetrics: React.FC<HealthMetricsProps> = ({ patient }) => {
  const [currentMetrics, setCurrentMetrics] = useState(patient.healthMetrics);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [insights, setInsights] = useState('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  
  const heartRateMetric = patient.healthMetrics.find(m => m.type === MetricType.HEART_RATE);

  useEffect(() => {
    setCurrentMetrics(patient.healthMetrics);
    setSummary(''); // Reset summary when patient changes
    setInsights(''); // Reset insights when patient changes
  }, [patient]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetrics(prevMetrics =>
        prevMetrics.map(metric => {
          if (metric.type === 'Heart Rate') {
            const oldValue = metric.history && metric.history.length > 0 ? metric.history[metric.history.length - 1].value : parseInt(metric.value);
            const newValue = oldValue + Math.floor(Math.random() * 5) - 2;
            const newHistory = [...(metric.history || []).slice(-6), { value: newValue, timestamp: new Date().toISOString() }];
            return { ...metric, value: String(newValue), timestamp: 'Now', history: newHistory };
          }
          if (metric.type === 'SpO2' && Math.random() > 0.8) {
             const newValue = parseInt(metric.value) + (Math.random() > 0.5 ? 1 : -1);
             return { ...metric, value: String(Math.max(95, Math.min(99, newValue))), timestamp: 'Now' };
          }
          return metric;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [patient.id]);

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    setSummary('');
    const result = await generateHealthSummary(patient);
    setSummary(result);
    setIsLoadingSummary(false);
  };
  
  const handleGenerateInsights = async () => {
    setIsLoadingInsights(true);
    setInsights('');
    const result = await generateHealthInsights(patient);
    setInsights(result);
    setIsLoadingInsights(false);
  };
  
  return (
    <div className="bg-brand-surface-light dark:bg-brand-surface-dark rounded-xl shadow-md p-6 transition-colors duration-300">
      <h3 className="text-lg font-bold mb-4">Live Health Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentMetrics.map(metric => (
          <MetricCard key={metric.type} metric={metric} />
        ))}
      </div>

       {heartRateMetric?.history && (
        <div className="mt-6 border-t dark:border-gray-700 pt-4">
            <h4 className="text-md font-bold mb-2">Health Trends (7 Days)</h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <LineChart 
                    data={heartRateMetric.history}
                    title="Heart Rate (bpm)"
                    color="hsl(217, 91%, 60%)" // brand-blue
                />
            </div>
        </div>
       )}

       <div className="mt-6 border-t dark:border-gray-700 pt-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h4 className="text-md font-bold">AI Daily Summary</h4>
          <button
            onClick={handleGenerateSummary}
            disabled={isLoadingSummary}
            className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoadingSummary ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>
        {isLoadingSummary && (
          <div className="mt-4 p-4 text-center text-brand-text-secondary dark:text-brand-text-secondary_dark">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
            <p className="mt-2">AI is analyzing the data...</p>
          </div>
        )}
        {summary && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-gray-800 border border-blue-200 dark:border-blue-900 rounded-lg whitespace-pre-wrap font-mono text-sm text-brand-text-primary dark:text-brand-text-primary_dark">
            {summary}
          </div>
        )}
      </div>

      <div className="mt-6 border-t dark:border-gray-700 pt-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h4 className="text-md font-bold">AI Health Insights</h4>
          <button
            onClick={handleGenerateInsights}
            disabled={isLoadingInsights}
            className="bg-brand-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-blue-dark disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoadingInsights ? 'Analyzing...' : 'Get AI Insights'}
          </button>
        </div>
        {isLoadingInsights && (
          <div className="mt-4 p-4 text-center text-brand-text-secondary dark:text-brand-text-secondary_dark">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
            <p className="mt-2">AI is analyzing trends for predictive insights...</p>
          </div>
        )}
        {insights && (
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-gray-800 border border-indigo-200 dark:border-indigo-900 rounded-lg whitespace-pre-wrap font-mono text-sm text-brand-text-primary dark:text-brand-text-primary_dark">
            {insights}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthMetrics;
