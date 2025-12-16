import React from 'react';
import Header from '../components/Header';
import { Clock, Shield, Tag, Languages, Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header title="Settings" />
      
      <main className="p-8 max-w-4xl mx-auto w-full space-y-6">
        
        {/* Business Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Clock size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Business Hours</h3>
                    <p className="text-sm text-gray-500">Define when Iris should auto-reply instantly.</p>
                </div>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Work Days</label>
                        <div className="flex gap-2">
                             {['M','T','W','T','F','S','S'].map((day, i) => (
                                 <button key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${i < 5 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                                     {day}
                                 </button>
                             ))}
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                         <div className="flex items-center gap-2">
                             <input type="time" defaultValue="09:00" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                             <span className="text-gray-400">to</span>
                             <input type="time" defaultValue="18:00" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5" />
                         </div>
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    <input id="weekend-reply" type="checkbox" className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500" />
                    <label htmlFor="weekend-reply" className="ml-2 text-sm text-gray-700">Send "Out of Office" response outside business hours</label>
                </div>
            </div>
        </div>

        {/* Confidence Thresholds */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
                 <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Shield size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Confidence Thresholds</h3>
                    <p className="text-sm text-gray-500">Configure AI autonomy levels.</p>
                </div>
            </div>
            <div className="p-6">
                 <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Auto-Reply Threshold</span>
                            <span className="text-sm font-medium text-emerald-600">85%</span>
                        </div>
                         <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Iris will automatically reply if confidence is above this score.</p>
                    </div>

                     <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Flag for Review</span>
                            <span className="text-sm font-medium text-amber-600">50%</span>
                        </div>
                         <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Conversations below this score are routed to human agents.</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* Label Mapping */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
                 <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Tag size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Label Mapping</h3>
                    <p className="text-sm text-gray-500">Map detected intents to CRM labels.</p>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                    {['Buyer', 'Seller', 'Renter', 'Other'].map((intent) => (
                        <div key={intent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                             <span className="text-sm font-medium text-gray-700">{intent}</span>
                             <div className="flex items-center text-gray-400">
                                <ArrowRightIcon />
                             </div>
                             <select className="bg-white border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-1.5">
                                 <option>Lead - {intent}</option>
                                 <option>Support Ticket</option>
                                 <option>Urgent</option>
                                 <option>Spam</option>
                             </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        {/* Language Handling */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
                 <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                    <Languages size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Language Handling</h3>
                    <p className="text-sm text-gray-500">Manage supported languages for detection.</p>
                </div>
            </div>
            <div className="p-6">
                <div className="flex flex-wrap gap-2">
                    {['English (US)', 'Spanish', 'French', 'German'].map(lang => (
                        <span key={lang} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 flex items-center gap-2">
                            {lang}
                            <button className="text-gray-400 hover:text-red-500">×</button>
                        </span>
                    ))}
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-transparent rounded-full text-sm text-gray-600 transition-colors">
                        + Add Language
                    </button>
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
            <button className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-slate-200">
                <Save size={18} />
                <span>Save Changes</span>
            </button>
        </div>

      </main>
    </div>
  );
};

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
)

export default Settings;