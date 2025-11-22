import React, { useEffect, useState } from 'react';
import LineChart from '../../charts/LineChart01';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';
import axios from 'axios';
import { io } from 'socket.io-client';

function DashboardCard03() {

  const [labels, setLabels] = useState([]);
  const [thisYear, setThisYear] = useState([]);
  const [lastYear, setLastYear] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  // Fetch monthly sales
  useEffect(() => {
    async function fetchMonthlyData() {
      try {
        const res = await axios.get('http://localhost:3000/sales/monthly-chart', {
          params: { productType: 'AcmeAdvanced' },
        });

        setLabels(res.data.labels);
        setThisYear(res.data.thisYear);
        setLastYear(res.data.lastYear);
      } catch (err) {
        console.error('Failed to fetch monthly chart data', err);
      }
    }

    fetchMonthlyData();
  }, []);

  // Fetch total
  useEffect(() => {
    async function fetchTotal() {
      try {
        const res = await axios.get('http://localhost:3000/sales/total', {
          params: { productType: 'AcmeAdvanced' },
        });

        setTotalSales(res.data.total);
      } catch (err) {
        console.error('Failed to fetch total sales', err);
      }
    }

    fetchTotal();
  }, []);

  // WebSockets
  useEffect(() => {
    const socket = io('http://localhost:3000/dashboard');

    socket.on('sales:total:AcmeProfessional', (data) => {
      setTotalSales(typeof data === 'number' ? data : data.total);
    });

    socket.on('sales:monthly:AcmeProfessional', (data) => {
      setLabels(data.labels);
      setThisYear(data.thisYear);
      setLastYear(data.lastYear);
    });

    return () => socket.disconnect();
  }, []);

  const chartData = {
    labels,
    datasets: [
      {
        data: thisYear,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return adjustColorOpacity(getCssVariable('--color-violet-500'), 0.1);
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-violet-500'), 0.2) },
          ]);
        },
        borderColor: getCssVariable('--color-violet-500'),
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
      },
      {
        data: lastYear,
        borderColor: adjustColorOpacity(getCssVariable('--color-gray-500'), 0.25),
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Acme Professional</h2>
        </header>
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">Sales</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mr-2">${totalSales.toLocaleString()}</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {/* Change the height attribute to adjust the chart height */}
        {labels.length > 0 && <LineChart data={chartData} width={389} height={128} />}
      </div>
    </div>
  );
}

export default DashboardCard03;
