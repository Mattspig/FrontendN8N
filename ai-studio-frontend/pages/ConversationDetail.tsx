import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Edit3, AlertTriangle, Send, User, ChevronRight, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import StatusPill from '../components/StatusPill';

const ConversationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mock detail data based on ID (static for now)
  const detail = {
    senderName: 'Lulu',
    senderEmail: 'lulu@example.com',
    subject: 'Interested in the downtown property',
    date: 'Oct 24, 2023, 10:23 AM',
    content: `Hi there,
    
I saw the listing for the apartment on Main St and I'm very interested. 
Is it still available for a viewing this weekend? 

Also, does the building allow pets? I have a small dog.

Thanks,
Lulu`,
    aiState: {
        intent: 'Buyer',
        confidence: 92,
        entities: ['Apartment', 'Main St', 'Viewing', 'Pets'],
        reasoning: [
            'Detected keywords "interested", "viewing", "listing".',
            'Sentiment analysis: Positive.',
            'Entity extraction matched "Main St" property.',
            'Pet policy query identified.'
        ],
        draftReply: `Hi Lulu,

Thanks for your interest in the Main St apartment!

Yes, the unit is still available. We have viewing slots open this Saturday between 10 AM - 2 PM. Would that work for you?

Regarding pets: Yes, the building is pet-friendly for small dogs with a deposit.

Let me know if you'd like to book a specific time.

Best,
Iris Property Management`
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header title="Conversation Detail" />
      
      <main className="p-6 max-w-7xl mx-auto w-full h-[calc(100vh-64px)] flex flex-col">
        
        <button 
            onClick={() => navigate('/conversations')} 
            className="flex items-center text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors w-fit"
        >
            <ArrowLeft size={16} className="mr-1" /> Back to list
        </button>

        <div className="flex flex-col lg:flex-row gap-6 h-full pb-6">
            
            {/* Left: Original Email */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                L
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{detail.senderName}</h3>
                                <p className="text-sm text-gray-500">{detail.senderEmail}</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{detail.date}</span>
                    </div>
                    <h2 className="mt-6 text-lg font-semibold text-gray-800">{detail.subject}</h2>
                </div>
                
                <div className="p-8 flex-1 overflow-y-auto whitespace-pre-wrap text-gray-700 leading-relaxed font-normal">
                    {detail.content}
                </div>
            </div>

            {/* Right: AI Analysis & Action */}
            <div className="w-full lg:w-[480px] flex flex-col gap-6">
                
                {/* AI Context Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                             <div className="p-1.5 bg-emerald-100 rounded-md">
                                <MessageCircle size={16} className="text-emerald-600" />
                             </div>
                             <span className="font-semibold text-gray-800">AI Analysis</span>
                        </div>
                        <StatusPill type="confidence" value="High" score={detail.aiState.confidence} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <span className="text-sm text-gray-500 font-medium">Detected Intent</span>
                            <StatusPill type="intent" value={detail.aiState.intent} />
                        </div>
                        
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Decision Logic</span>
                            <ul className="space-y-2">
                                {detail.aiState.reasoning.map((step, idx) => (
                                    <li key={idx} className="flex items-start text-sm text-gray-600">
                                        <ChevronRight size={14} className="mt-1 mr-1 text-gray-400 flex-shrink-0" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                         <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Entities</span>
                            <div className="flex flex-wrap gap-2">
                                {detail.aiState.entities.map((entity, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                                        {entity}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Response Action Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-semibold text-gray-800">Generated Response</span>
                        <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Ready to send</span>
                    </div>

                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-sm text-gray-700 whitespace-pre-wrap font-mono">
                        {detail.aiState.draftReply}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                         <button className="col-span-2 flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow">
                            <Check size={18} />
                            <span>Looks good, send it</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-medium transition-colors">
                            <Edit3 size={18} />
                            <span>Edit reply</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-white border border-gray-200 hover:bg-amber-50 text-gray-700 hover:text-amber-700 hover:border-amber-200 py-2.5 rounded-lg font-medium transition-colors">
                            <AlertTriangle size={18} />
                            <span>Escalate</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
};

export default ConversationDetail;