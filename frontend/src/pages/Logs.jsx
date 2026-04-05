import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AlertCircle, FileTerminal, RefreshCw } from 'lucide-react';

const Logs = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/alerts`);
      setAlerts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold">Routing Logs & Alerts</h2>
          <p className="text-sm text-textSecondary mt-1">Audit trail of controller decisions and link congestions.</p>
        </div>
        <button onClick={fetchAlerts} className="p-2 hover:bg-white/5 rounded-lg text-textSecondary hover:text-white transition-colors">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        {alerts.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-textSecondary gap-4">
            <FileTerminal size={48} className="opacity-50" />
            <p>No recent alerts or routing events.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-6 hover:bg-white/5 transition-colors flex gap-6 items-start">
                <div className={`mt-1 p-2 rounded-full ${alert.type === 'congestion' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-white uppercase text-xs tracking-wider border border-white/10 px-2 py-1 rounded bg-surface">
                      {alert.type}
                    </span>
                    <span className="text-xs font-mono text-textSecondary">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-textSecondary leading-relaxed">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
