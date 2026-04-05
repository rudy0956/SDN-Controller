import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import ForceGraph2D from 'react-force-graph-2d';
import { Wifi, Clock, AlertTriangle, AlertOctagon } from 'lucide-react';

const Dashboard = () => {
  const [topology, setTopology] = useState({ nodes: [], links: [] });
  const [metrics, setMetrics] = useState(null);
  const graphRef = useRef();

  const fetchData = async () => {
    try {
      const [topoRes, metricsRes] = await Promise.all([
        axios.get('/api/topology'),
        axios.get('/api/metrics/current')
      ]);
      setTopology(topoRes.data);
      setMetrics(metricsRes.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Network Topology & Live Telemetry</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-textSecondary font-medium font-mono border border-white/10 px-3 py-1 bg-surface rounded-full">
            {metrics ? metrics.timestamp.split('T')[1].split('.')[0] : 'Loading...'}
          </span>
        </div>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Global Throughput"
            value={`${metrics.global.throughput} Mbps`}
            icon={<Wifi size={24} />}
            color="text-blue-400"
            bg="bg-blue-400/10"
          />
          <MetricCard
            title="Average Delay"
            value={`${metrics.global.avgDelay} ms`}
            icon={<Clock size={24} />}
            color={metrics.global.avgDelay > 50 ? "text-danger" : "text-green-400"}
            bg={metrics.global.avgDelay > 50 ? "bg-red-400/10 border-red-500/30" : "bg-green-400/10"}
          />
          <MetricCard
            title="Packet Loss"
            value={`${(metrics.global.packetLoss * 100).toFixed(1)} %`}
            icon={<AlertTriangle size={24} />}
            color={metrics.global.packetLoss > 0.02 ? "text-danger" : "text-green-400"}
            bg={metrics.global.packetLoss > 0.02 ? "bg-red-400/10" : "bg-green-400/10"}
          />
        </div>
      )}

      {/* Network Graph */}
      <div className="glass-card flex-1 min-h-[500px] relative overflow-hidden flex flex-col">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-surface/90 p-4 rounded-lg border border-white/10 backdrop-blur-md">
          <h4 className="text-sm font-bold text-white mb-1">Legend</h4>
          <div className="flex items-center gap-2 text-xs text-textSecondary"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Switch (OVS)</div>
          <div className="flex items-center gap-2 text-xs text-textSecondary"><div className="w-3 h-3 rounded-full bg-purple-400"></div> Host</div>
          <div className="flex items-center gap-2 text-xs text-textSecondary"><div className="w-4 h-1 bg-white/30"></div> Normal Link</div>
          <div className="flex items-center gap-2 text-xs text-textSecondary"><div className="w-4 h-1 bg-red-500 animate-pulse"></div> Congested Link</div>
        </div>

        {topology.nodes.length > 0 ? (
          <ForceGraph2D
            ref={graphRef}
            width={800} // This would dynamically resize in a real app, keeping fixed for simplicity
            height={500}
            graphData={topology}
            nodeLabel="id"
            nodeColor={node => node.group === 'switch' ? '#3B82F6' : '#A855F7'}
            nodeRelSize={8}
            linkColor={link => link.congested ? '#EF4444' : 'rgba(255,255,255,0.2)'}
            linkWidth={link => link.congested ? 4 : 2}
            linkDirectionalParticles={link => link.congested ? 0 : 2}
            linkDirectionalParticleSpeed={0.01}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            onEngineStop={() => graphRef.current.zoomToFit(400, 50)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-textSecondary">
            Loading Topology Data...
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color, bg }) => (
  <div className={`glass-card p-6 flex items-center gap-6 ${bg || ''}`}>
    <div className={`p-4 rounded-xl bg-surface border border-white/5 shadow-inner ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-textSecondary font-medium text-sm mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </div>
);

export default Dashboard;
