import React, { useState, useEffect, useRef } from 'react';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import RealtimeChart from '../../charts/RealtimeChart';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `${API_URL}/dashboard`;

function DashboardCard05() {
  const [slicedData, setSlicedData] = useState([]);
  const [slicedLabels, setSlicedLabels] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    socketRef.current = io(SOCKET_URL);

    // Listen to market updates
    socketRef.current.on('market:update', (latest) => {
      setSlicedData((prev) => [...prev.slice(-34), latest.value]); // keep last 35 points
      setSlicedLabels((prev) => [...prev.slice(-34), new Date()]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const chartData = {
    labels: slicedLabels,
    datasets: [
      {
        data: slicedData,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) },
          ]);
        },
        borderColor: getCssVariable('--color-violet-500'),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-violet-500'),
        pointHoverBackgroundColor: getCssVariable('--color-violet-500'),
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Market Value</h2>
      </header>
      <RealtimeChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard05;
