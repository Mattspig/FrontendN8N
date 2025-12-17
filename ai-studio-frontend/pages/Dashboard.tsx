import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Mail, Zap, Clock, ArrowRight, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Header from '../components/Header';


const confidenceData = [
  { time: '09:00', score: 85 },
  { time: '10:00', score: 88 },
  { time: '11:00', score: 82 },
  { time: '12:00', score: 90 },
  { time: '13:00', score: 95 },
  { time: '14:00', score: 89 },
  { time: '15:00', score: 92 },
];

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

const fetchState = useCallback(async () => {
  try {
    const res = await fetch('/api/state', { cache: 'no-store' });
    if (!res.ok) return;

    const result = await res.json();
    const evts = Array.isArray(result)
      ? result
      : (result?.events ?? result?.data ?? [result]);

    setEvents(evts);
  } catch (err) {
    console.error('Failed to fetch /api/state', err);
  }
}, []);

useEffect(() => {
  fetchState();
  const t = setInterval(fetchState, 3000);
  return () => clearInterval(t);
}, [fetchState]);

  const kpis = useMemo(() => {
  const total = events.length;

  const autoHandledCount = events.filter(e =>
    String(e.action_taken || '').toLowerCase() === 'auto_replied'
  ).length;

  const autoHandledPct = total ? Math.round((autoHandledCount / total) * 100) : 0;

  const routedToOther = events.filter(e =>
    String(e.intent || '').toLowerCase() === 'other'
  ).length;

  const times = events
    .map(e => e.response_time_seconds)
    .filter((v: any) => typeof v === 'number' && !Number.isNaN(v));

  const avgResponseTime = times.length
    ? Math.round(times.reduce((a: number, b: number) => a + b, 0) / times.length)
    : null;

  return {
    total,
    autoHandledPct,
    avgResponseTime, // number|null (seconds)
    routedToOther,
  };
}, [events]);

  const intentData = useMemo(() => {
  const counts = {
    Buyer: 0,
    Seller: 0,
    Renter: 0,
    Other: 0,
  };

  events.forEach((e) => {
    const intentRaw = String(e.intent || '').toLowerCase();
    if (intentRaw === 'buyer') counts.Buyer++;
    else if (intentRaw === 'seller') counts.Seller++;
    else if (intentRaw === 'renter') counts.Renter++;
    else counts.Other++;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return [
    { name: 'Buyer', value: Math.round((counts.Buyer / total) * 100), color: '#3b82f6' },
    { name: 'Seller', value: Math.round((counts.Seller / total) * 100), color: '#a855f7' },
    { name: 'Renter', value: Math.round((counts.Renter / total) * 100), color: '#f97316' },
    { name: 'Other', value: Math.round((counts.Other / total) * 100), color: '#94a3b8' },
  ];
}, [events]);


const stats = [
  { label: 'Total Emails', value: kpis.total, icon: Mail, color: 'bg-blue-500', trend: '+2 this hour' },
  { label: 'Auto-handled', value: `${kpis.autoHandledPct}%`, icon: Zap, color: 'bg-emerald-500', trend: '+5% vs last week' },
  { label: 'Avg Response', value: kpis.avgResponseTime === null ? '—' : `${kpis.avgResponseTime}s`, icon: Clock, color: 'bg-purple-500', trend: '-10s improvement' },
  { label: 'Routed to Other', value: kpis.routedToOther, icon: AlertCircle, color: 'bg-gray-500', trend: '—' },
];

  const avgConfidence = useMemo(() => {
  const vals = events
    .map(e => {
  if (typeof e.confidence !== 'number') return null;
  return Math.max(0, Math.min(100, e.confidence));
})

  if (vals.length === 0) return null;

  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}, [events]);


  if (!kpis) return null;
  
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header title="Overview" />
      
      <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-gray-400">
                <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mr-2">
                    {stat.trend}
                </span>
                since today
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Intent Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Intent Distribution</h3>
                        <p className="text-sm text-gray-500">Breakdown of incoming email categories</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <Users size={18} />
                    </button>
                </div>
                <div className="h-64 w-full flex">
                    <div className="w-1/2 h-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={intentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {intentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-1/2 flex flex-col justify-center space-y-3">
                        {intentData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between pr-8">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm font-medium text-gray-600">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-gray-800">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Confidence Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
  <h3 className="text-lg font-bold text-gray-800 mb-2">
    Average AI Confidence
  </h3>
  <p className="text-sm text-gray-500 mb-6">
    How confident Iris is when automatically handling incoming emails
  </p>

  <div className="flex items-center justify-center h-40">
    {avgConfidence === null ? (
      <span className="text-gray-400 text-sm">No confidence data yet</span>
    ) : (
      <div className="text-center">
        <div className="text-5xl font-extrabold text-emerald-600">
          {avgConfidence}%
        </div>
        <div className="mt-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${avgConfidence >= 80
              ? 'bg-emerald-100 text-emerald-700'
              : avgConfidence >= 50
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'}`}>
            {avgConfidence >= 80 ? 'High confidence' : avgConfidence >= 50 ? 'Medium confidence' : 'Low confidence'}
          </span>
        </div>
      </div>
    )}
  </div>
</div>


        </div>

      </main>
    </div>
  );
};

export default Dashboard;
