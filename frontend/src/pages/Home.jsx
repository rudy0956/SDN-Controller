import React from 'react';
import { ArrowRight, Server, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <h1 className="text-4xl font-extrabold tracking-tight">SDN-Based Traffic Engineering System</h1>
      <p className="text-xl text-textSecondary max-w-3xl leading-relaxed">
        An academic project demonstrating how Software Defined Networking (SDN) 
        can actively monitor link congestion, predict latency, and intelligently
        reroute traffic using a centralized OpenFlow controller.
      </p>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <FeatureCard 
          icon={<Server className="text-blue-400" size={32} />}
          title="Centralized Control Plane"
          description="Ryu OpenFlow controller globally maps the network topology, detaching logic from physical switches."
        />
        <FeatureCard 
          icon={<Activity className="text-green-400" size={32} />}
          title="Real-Time Telemetry"
          description="Continuous polling of in-band statistics, including per-link throughput, packet loss, and latency."
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-purple-400" size={32} />}
          title="Dynamic Rerouting"
          description="Automated response to congestion events, redirecting traffic flows via shortest-path algorithms."
        />
      </div>

      {/* Architecture Diagram Placeholder / Description */}
      <div className="glass-card p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">System Architecture</h2>
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4 text-textSecondary leading-relaxed">
            <p>
              <strong className="text-white">1. Data Plane (Mininet):</strong> Simulated Open vSwitch (OVS) nodes and hosts connected in a partial mesh topology.
            </p>
            <p>
              <strong className="text-white">2. Control Plane (Ryu):</strong> Monitors ports using standard OFP messages and dictates routing choices pushing flows.
            </p>
            <p>
              <strong className="text-white">3. Orchestration API (FastAPI):</strong> Extrapolates telemetry data from the controller into a RESTful API standard.
            </p>
            <p>
              <strong className="text-white">4. Management Plane (React):</strong> This dashboard UI, interpreting JSON models into actionable metrics and graphs.
            </p>
          </div>
          <div className="w-full lg:w-1/2 h-64 bg-surface rounded-lg border border-white/5 flex items-center justify-center p-4">
            {/* Simple CSS architecture visual */}
            <div className="flex flex-col items-center gap-4 w-full">
               <div className="bg-primary/20 text-primary px-6 py-2 rounded-lg border border-primary/30 font-bold">Management Plane (React)</div>
               <div className="h-4 border-l-2 border-dashed border-gray-600"></div>
               <div className="bg-purple-500/20 text-purple-400 px-6 py-2 rounded-lg border border-purple-500/30 font-bold">API Gateway (FastAPI)</div>
               <div className="h-4 border-l-2 border-dashed border-gray-600"></div>
               <div className="bg-green-500/20 text-green-400 px-6 py-2 rounded-lg border border-green-500/30 font-bold">Control Plane (Ryu)</div>
               <div className="h-4 border-l-2 border-dashed border-gray-600"></div>
               <div className="bg-gray-700/50 text-gray-300 px-6 py-2 rounded-lg border border-gray-600 font-bold w-full text-center">Data Plane (Mininet Open vSwitches)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary hover:bg-primaryHover text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
          Open Live Dashboard
          <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-card p-6 flex flex-col gap-4">
    <div className="w-14 h-14 bg-surface rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white">{title}</h3>
    <p className="text-textSecondary text-sm leading-relaxed">{description}</p>
  </div>
);

export default Home;
