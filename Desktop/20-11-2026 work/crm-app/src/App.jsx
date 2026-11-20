import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [leads, setLeads] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Lead');

  useEffect(() => {
    // 1. Instantly load local data storage fallback values for responsive layout rendering
    const cachedLeads = localStorage.getItem('cv_crm_leads_backup');
    if (cachedLeads) {
      setLeads(JSON.parse(cachedLeads));
    }
    // 2. Fetch live data records from the Supabase cloud instance
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const { data, error } = await supabase.from('leads').select('*').order('id', { ascending: false });
      if (data && !error) {
        setLeads(data);
        localStorage.setItem('cv_crm_leads_backup', JSON.stringify(data));
      }
    } catch (e) {
      console.log('Using local fallback layer due to network restriction.');
    }
  }

  async function addLead(e) {
    e.preventDefault();
    if (!name || !email) return alert('Please enter both name and email');

    const leadValue = parseInt(value) || 0;
    const clientRecord = {
      id: Date.now(), // Generate numerical primary key fallback reference
      name,
      email,
      value: leadValue,
      status
    };

    // Update screen instantly for zero latency
    const syncState = [clientRecord, ...leads];
    setLeads(syncState);
    localStorage.setItem('cv_crm_leads_backup', JSON.stringify(syncState));

    // Clear operational inputs fields
    setName('');
    setEmail('');
    setValue('');
    setStatus('Lead');

    // Sync to Supabase in the background
    try {
      await supabase.from('leads').insert([{ name, email, value: leadValue, status }]);
    } catch (err) {
      console.log('Background cloud database synchronization paused.');
    }
  }

  async function loadMockData() {
    const defaultMocks = [
      { id: 101, name: 'Acme Corp', email: 'billing@acme.com', value: 12000, status: 'Proposal' },
      { id: 102, name: 'Stark Industries', email: 'pepper@stark.com', value: 45000, status: 'Won' },
      { id: 103, name: 'Wayne Enterprises', email: 'bruce@wayne.com', value: 28000, status: 'Lead' },
      { id: 104, name: 'Initech Software', email: 'peter@initech.com', value: 3500, status: 'Contacted' }
    ];

    setLeads(defaultMocks);
    localStorage.setItem('cv_crm_leads_backup', JSON.stringify(defaultMocks));

    try {
      await supabase.from('leads').insert(defaultMocks.map(({name, email, value, status}) => ({name, email, value, status})));
    } catch (e) {}
  }

  async function updateStatus(id, newStatus) {
    const updatedState = leads.map(item => item.id === id ? { ...item, status: newStatus } : item);
    setLeads(updatedState);
    localStorage.setItem('cv_crm_leads_backup', JSON.stringify(updatedState));

    try {
      await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    } catch (e) {}
  }

  async function deleteLead(id) {
    const filteredState = leads.filter(item => item.id !== id);
    setLeads(filteredState);
    localStorage.setItem('cv_crm_leads_backup', JSON.stringify(filteredState));

    try {
      await supabase.from('leads').delete().eq('id', id);
    } catch (e) {}
  }

  // Calculate reactive analytical metrics matrices
  const totalLeads = leads.length;
  const dealsWon = leads.filter(item => item.status === 'Won').length;
  const totalPipelineValue = leads.reduce((sum, item) => sum + (Number(item.value) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* Header Bar Area Container */}
      <header className="mb-8 border-b border-slate-700 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-400">💼 Live CV-CRM Dashboard</h1>
          <p className="text-slate-400 mt-1">Full-Stack Production Ready Showcase</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={loadMockData}
            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 text-xs font-semibold py-1.5 px-3 rounded-lg cursor-pointer transition shadow"
          >
            ⚡ Load Demo Data
          </button>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
            ● Active Sandbox Mode
          </span>
        </div>
      </header>

      {/* Metrics Performance Analytic Cards Grid Panel */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Pipelines</h3>
          <p className="text-4xl font-extrabold mt-2 text-white">{totalLeads}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Deals Closed Won</h3>
          <p className="text-4xl font-extrabold mt-2 text-emerald-400">{dealsWon}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Deal Value</h3>
          <p className="text-4xl font-extrabold mt-2 text-amber-400">${totalPipelineValue.toLocaleString()}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Input Controls Module Section */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit shadow-md">
          <h2 className="text-xl font-bold mb-4 text-slate-200">Add New Client Prospect</h2>
          <form onSubmit={addLead} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Contact Name</label>
              <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
              <input type="email" placeholder="john@company.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Deal Value ($)</label>
              <input type="number" placeholder="5000" value={value} onChange={e => setValue(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Initial Stage</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500">
                <option value="Lead">Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal">Proposal Sent</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 transition font-medium text-sm py-2.5 px-4 rounded-lg cursor-pointer shadow">
              Add to Sales Funnel
            </button>
          </form>
        </div>

        {/* Lead Grid Pipelines Data Table Workspace */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
          <h2 className="text-xl font-bold mb-4 text-slate-200">Active Sales Funnel</h2>
          {leads.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No leads inside the pipeline yet. Add your first client or use demo shortcuts to start!</p>
          ) : (
            <div className="overflow-x-auto space-y-3">
              {leads.map(item => (
                <div key={item.id} className="bg-slate-900 border border-slate-700 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-slate-600">
                  <div>
                    <h4 className="font-semibold text-base text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.email} • <span className="text-amber-400">${Number(item.value).toLocaleString()}</span></p>
                    <span className={`inline-block mt-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      item.status === 'Won' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      Stage: {item.status}
                    </span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    {item.status !== 'Won' && (
                      <button onClick={() => updateStatus(item.id, 'Won')} className="text-xs font-semibold bg-emerald-600/80 hover:bg-emerald-600 px-3 py-1.5 rounded transition cursor-pointer shadow">
                        🏆 Mark Won
                      </button>
                    )}
                    <button onClick={() => deleteLead(item.id)} className="text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded border border-red-500/20 transition cursor-pointer">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
