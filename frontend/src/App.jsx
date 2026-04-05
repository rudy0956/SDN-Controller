import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Network, Activity, FileText, BarChart2, Zap } from 'lucide-react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Results from './pages/Results';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-surface/50 border-r border-white/5 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/50 text-primary shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Zap size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight text-white">SDN-TE</h1>
          <p className="text-xs text-textSecondary uppercase tracking-wider font-semibold">Controller</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <NavItem to="/" icon={<Network size={20} />} label="Overview" />
        <NavItem to="/dashboard" icon={<Activity size={20} />} label="Live Dashboard" />
        <NavItem to="/logs" icon={<FileText size={20} />} label="Routing Logs" />
        <NavItem to="/results" icon={<BarChart2 size={20} />} label="TE Results" />
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-400 rounded-md text-sm border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          FastAPI Connected
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm' 
            : 'text-textSecondary hover:text-white hover:bg-white/5'
        }`
      }
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
};

function App() {
  return (
    <Router>
      <div className="flex bg-background min-h-screen text-textPrimary">
        <Sidebar />
        <main className="flex-1 ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
