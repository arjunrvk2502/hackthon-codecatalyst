
import React, { useState, useMemo } from 'react';

interface LineChartProps {
  data: { value: number; timestamp: string }[];
  title: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, title, color = '#3B82F6' }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; timestamp: string } | null>(null);

  const chartDimensions = { width: 500, height: 150, padding: 10 };

  const points = useMemo(() => {
    if (!data || data.length < 2) return '';

    const values = data.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    return data.map((point, i) => {
      const x = (i / (data.length - 1)) * (chartDimensions.width - chartDimensions.padding * 2) + chartDimensions.padding;
      const y = chartDimensions.height - ((point.value - minVal) / range) * (chartDimensions.height - chartDimensions.padding * 2) - chartDimensions.padding;
      return { x, y, value: point.value, timestamp: new Date(point.timestamp).toLocaleDateString() };
    });
  }, [data]);

  const pathD = useMemo(() => {
    if (!points || points.length < 2) return '';
    return points.reduce((acc, point, i) => {
      if (i === 0) return `M${point.x},${point.y}`;
      return `${acc} L${point.x},${point.y}`;
    }, '');
  }, [points]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!points || points.length === 0) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const closestPoint = points.reduce((prev, curr) => 
      Math.abs(curr.x - x) < Math.abs(prev.x - x) ? curr : prev
    );
    setTooltip(closestPoint);
  };
  
  if (!data || data.length < 2) {
    return (
        <div className="text-center p-4 text-sm text-brand-text-secondary dark:text-brand-text-secondary_dark">
            Not enough data to display a trend.
        </div>
    );
  }

  return (
    <div>
      <h5 className="font-semibold mb-2">{title}</h5>
      <div className="relative">
        <svg
          viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
          className="w-full h-auto"
        >
          <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {tooltip && (
            <>
              <line
                x1={tooltip.x}
                y1={chartDimensions.padding}
                x2={tooltip.x}
                y2={chartDimensions.height - chartDimensions.padding}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4"
                className="text-gray-400 dark:text-gray-500"
              />
              <circle cx={tooltip.x} cy={tooltip.y} r="4" fill={color} />
            </>
          )}
        </svg>
        {tooltip && (
          <div
            className="absolute p-2 text-xs bg-brand-surface-light dark:bg-brand-surface-dark text-brand-text-primary dark:text-brand-text-primary_dark rounded-md shadow-lg pointer-events-none transition-opacity"
            style={{ left: tooltip.x, top: tooltip.y - 50, transform: 'translateX(-50%)', opacity: 1 }}
          >
            <p className="font-bold">{tooltip.value}</p>
            <p className="text-gray-500">{tooltip.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineChart;
