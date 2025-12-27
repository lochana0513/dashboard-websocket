import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `${API_URL}/dashboard`;

// Mapping iconKey to SVGs
const icons = {
  github: (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle fill="#24292E" cx="18" cy="18" r="18" />
      <path d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6..." fill="#FFF" />
    </svg>
  ),
  facebook: (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle fill="#1877F2" cx="18" cy="18" r="18" />
      <path d="M22.675 12.226h-3.2c-.796 0-1.9.4-1.9 2.1v2.4h5.1l-.7 5.1h-4.4v13h-5v-13h-4v-5.1h4v-3.7c0-4 2.4-6.2 6-6.2 1.7 0 3.2.1 3.6.1v4z" fill="#FFF" />
    </svg>
  ),
  google: (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle fill="#34A853" cx="18" cy="18" r="18" />
      <path d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6..." fill="#FFF" />
    </svg>
  ),
  vimeo: (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle fill="#1AB7EA" cx="18" cy="18" r="18" />
      <path d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6..." fill="#FFF" />
    </svg>
  ),
  indiehackers: (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle fill="#F675A8" cx="18" cy="18" r="18" />
      <path d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6..." fill="#FFF" />
    </svg>
  ),
  twitter: (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle fill="#1DA1F2" cx="18" cy="18" r="18" />
      <path d="M18 10.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6..." fill="#FFF" />
    </svg>
  ),
};

function DashboardCard07() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
      const fetchChannels = async () => {
        try {
          const res = await axios.get(`${API_URL}/channels`);
          setRows(res.data);
        } catch (err) {
          console.error("Failed to fetch channels", err);
        }
      };
      fetchChannels();
  }, []);

    // WebSocket updates
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("channels:update", (data) => {
      setRows((prevRows) =>
        prevRows.map((row) => {
          // Find the updated data for this source
          const updated = data.find((d) => d.source === row.source);
          if (!updated) return row; // no change

          // Only update numeric values
          return {
            ...row,
            visitors: updated.visitors,
            revenue: updated.revenue,
            sales: updated.sales,
            conversion: updated.conversion,
          };
        })
      );
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Top Channels
        </h2>
      </header>

      <div className="p-3">
        <div className="overflow-y-auto max-h-72 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="table-auto w-full dark:text-gray-300">
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2 text-left font-semibold">Source</th>
                <th className="p-2 text-center font-semibold">Visitors</th>
                <th className="p-2 text-center font-semibold">Revenue</th>
                <th className="p-2 text-center font-semibold">Sales</th>
                <th className="p-2 text-center font-semibold">Conversion</th>
              </tr>
            </thead>

            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="p-2">
                    <div className="flex items-center">
                      {row.iconKey && (
                        <span className="shrink-0 mr-2 sm:mr-3">{icons[row.iconKey]}</span>
                      )}
                      <div className="text-gray-800 dark:text-gray-100">{row.source}</div>
                    </div>
                  </td>
                  <td className="p-2 text-center">{row.visitors.toLocaleString()}</td>
                  <td className="p-2 text-center text-green-500">${row.revenue.toLocaleString()}</td>
                  <td className="p-2 text-center">{row.sales.toLocaleString()}</td>
                  <td className="p-2 text-center text-sky-500">{row.conversion.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
