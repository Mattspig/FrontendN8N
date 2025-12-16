import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StatusPill from '../components/StatusPill';
import { Conversation, Intent, Action } from '../types';

const MOCK_DATA: Conversation[] = [
  {
    id: '1',
    senderName: 'Lulu',
    senderEmail: 'lulu@example.com',
    intent: 'Buyer',
    confidenceScore: 92,
    action: 'Auto-replied',
    label: 'Lead-Buyer',
    responseTime: '45s',
    date: '10 min ago',
    subject: 'Interested in the downtown property',
    preview: 'Hi, I saw the listing for the apartment on Main St...',
    fullBody: '',
    aiAnalysis: { decisionPath: [], detectedEntities: [] }
  },
  {
    id: '2',
    senderName: 'Anonymous',
    senderEmail: 'anon@gmail.com',
    intent: 'Other',
    confidenceScore: 23,
    action: 'Routed to Other',
    label: 'Needs Review',
    date: '1 hour ago',
    subject: 'Question about partnership',
    preview: 'We are a digital agency looking to partner...',
    fullBody: '',
    aiAnalysis: { decisionPath: [], detectedEntities: [] }
  },
  {
    id: '3',
    senderName: 'Mark Smith',
    senderEmail: 'mark.s@corporate.com',
    intent: 'Seller',
    confidenceScore: 88,
    action: 'Auto-replied',
    label: 'Potential Listing',
    responseTime: '1m 20s',
    date: '2 hours ago',
    subject: 'Selling my condo',
    preview: 'Hello, I am looking to sell my property at...',
    fullBody: '',
    aiAnalysis: { decisionPath: [], detectedEntities: [] }
  },
  {
    id: '4',
    senderName: 'Sarah Jenkins',
    senderEmail: 's.jenkins@yahoo.com',
    intent: 'Renter',
    confidenceScore: 76,
    action: 'Auto-replied',
    label: 'Lead-Renter',
    responseTime: '55s',
    date: '3 hours ago',
    subject: 'Application status?',
    preview: 'I submitted my application last week...',
    fullBody: '',
    aiAnalysis: { decisionPath: [], detectedEntities: [] }
  },
  {
    id: '5',
    senderName: 'David Lee',
    senderEmail: 'david.lee@tech.net',
    intent: 'Buyer',
    confidenceScore: 95,
    action: 'Auto-replied',
    label: 'Lead-Buyer',
    responseTime: '32s',
    date: 'Yesterday',
    subject: 'Schedule viewing',
    preview: 'Can I see the house on 5th Avenue this weekend?',
    fullBody: '',
    aiAnalysis: { decisionPath: [], detectedEntities: [] }
  }
];

const Conversations: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIntent, setFilterIntent] = useState<Intent | 'All'>('All');

  const filteredData = MOCK_DATA.filter(item => {
    const matchesSearch = item.senderName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.senderEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIntent = filterIntent === 'All' || item.intent === filterIntent;
    return matchesSearch && matchesIntent;
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header title="Conversations" />
      
      <main className="p-8 max-w-7xl mx-auto w-full">
        
        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder="Search by sender or email..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex items-center space-x-3">
                <div className="relative group">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Filter size={16} />
                        <span>Filter Intent: {filterIntent}</span>
                        <ChevronDown size={14} />
                    </button>
                    {/* Dropdown would go here, simplified for demo */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block z-10 py-1">
                        {['All', 'Buyer', 'Seller', 'Renter', 'Other'].map(intent => (
                            <button 
                                key={intent}
                                onClick={() => setFilterIntent(intent as any)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600"
                            >
                                {intent}
                            </button>
                        ))}
                    </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <SlidersHorizontal size={20} />
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Intent</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Label</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Res Time</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredData.map((row) => (
                            <tr 
                                key={row.id} 
                                onClick={() => navigate(`/conversations/${row.id}`)}
                                className="group hover:bg-emerald-50/30 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                            {row.senderName.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-700">{row.senderName}</p>
                                            <p className="text-xs text-gray-500">{row.senderEmail}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusPill type="intent" value={row.intent} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusPill type="confidence" value={row.confidenceScore >= 80 ? 'High' : row.confidenceScore >= 50 ? 'Med' : 'Low'} score={row.confidenceScore} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <StatusPill type="action" value={row.action} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                        {row.label}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {row.responseTime || '—'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-emerald-600 transition-colors">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredData.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No conversations found matching your criteria.
                </div>
            )}
             <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Showing {filteredData.length} of {MOCK_DATA.length} results</span>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default Conversations;