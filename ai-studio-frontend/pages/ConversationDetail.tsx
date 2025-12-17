import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Edit3, AlertTriangle, ChevronRight, MessageCircle } from 'lucide-react';
import Header from '../components/Header';
import StatusPill from '../components/StatusPill';

const ConversationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        // NOTE: use thread_id so it matches thread.js
        const res = await fetch(`/api/thread?thread_id=${encodeURIComponent(id || '')}`, {
          cache: 'no-store',
        });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        if (!alive) return;
        setEvents(json.events || []);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setEvents([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    if (id) load();
    return () => {
      alive = false;
    };
  }, [id]);

  // latest event in the thread (last item)
  const latest = useMemo(() => events[events.length - 1] || null, [events]);

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
          {/* Left: Thread view */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {latest?.sender_name?.[0]?.toUpperCase?.() || 'L'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {latest?.sender_name ?? '—'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(latest?.sender_email ?? '—').trim()}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {latest?.updated_date || latest?.created_date || '—'}
                </span>
              </div>
              <h2 className="mt-6 text-lg font-semibold text-gray-800">
                {latest?.subject ?? '—'}
              </h2>
            </div>

            <div className="p-6 flex-1 overflow-y-auto text-gray-700 font-normal">
              {loading ? (
                <div className="text-sm text-gray-400">Loading thread…</div>
              ) : events.length === 0 ? (
                <div className="text-sm text-gray-400">
                  No messages found for this thread.
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((e, idx) => (
                    <div
                      key={e.id || idx}
                      className="rounded-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 bg-gray-50/60 flex items-center justify-between">
                        <div className="text-xs font-semibold text-gray-600">
                          {e.sender_name || 'Sender'}{' '}
                          <span className="font-normal text-gray-400">
                            {String(e.sender_email || '').trim()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {e.updated_date || e.created_date || ''}
                        </div>
                      </div>

                      <div className="p-4 bg-white">
                        <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Incoming
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {e.original_body ? String(e.original_body) : '—'}
                        </div>
                      </div>

                      {e.reply_text ? (
                        <div className="p-4 bg-emerald-50 border-t border-emerald-100">
                          <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                            Iris Reply
                          </div>
                          <div className="text-sm whitespace-pre-wrap text-gray-800">
                            {String(e.reply_text)}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
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
                  <span className="font-semibold text-gray-800">
                    AI Analysis
                  </span>
                </div>
                <StatusPill
                  type="confidence"
                  value="High"
                  score={latest?.confidence ?? 0}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-500 font-medium">
                    Detected Intent
                  </span>
                  <StatusPill type="intent" value={latest?.intent} />
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Decision Logic
                  </span>
                  {Array.isArray(latest?.decision_path) &&
                  latest.decision_path.length > 0 ? (
                    <ul className="space-y-2">
                      {latest.decision_path.map((step: any, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <ChevronRight
                            size={14}
                            className="mt-1 mr-1 text-gray-400 flex-shrink-0"
                          />
                          {String(step)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-gray-400">
                      No decision path available.
                    </div>
                  )}

                  <div className="mt-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      Entities
                    </span>
                    {Array.isArray(latest?.extracted_entities) &&
                    latest.extracted_entities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {latest.extracted_entities.map((entity: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200"
                          >
                            {String(entity)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        No entities extracted.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Response Action Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-gray-800">
                  Generated Response
                </span>
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">
                  Ready to send
                </span>
              </div>

              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {latest?.reply_text ?? 'No reply generated yet.'}
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
