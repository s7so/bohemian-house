import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Eye, MessageSquare, Folder, Star, Settings } from 'lucide-react';

const tabs = [
  { id: 'projects', label: 'Projects', icon: <Folder size={16} /> },
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={16} /> },
  { id: 'testimonials', label: 'Testimonials', icon: <Star size={16} /> },
];

export default function Admin() {
  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', category: 'Residential', location: '', year: '', description: '', cover_image: '', featured: false });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    base44.entities.Project.list('-created_date', 50).then(setProjects);
    base44.entities.ContactMessage.list('-created_date', 50).then(setMessages);
    base44.entities.Testimonial.list('-created_date', 50).then(setTestimonials);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setProjectForm(f => ({ ...f, cover_image: file_url }));
    setUploading(false);
  };

  const saveProject = async () => {
    const p = await base44.entities.Project.create(projectForm);
    setProjects(prev => [p, ...prev]);
    setShowForm(false);
    setProjectForm({ title: '', category: 'Residential', location: '', year: '', description: '', cover_image: '', featured: false });
  };

  const deleteProject = async (id) => {
    await base44.entities.Project.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const markRead = async (msg) => {
    await base44.entities.ContactMessage.update(msg.id, { status: 'read' });
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
  };

  return (
    <div className="min-h-screen bg-[#F0EBE0]">
      {/* Top bar */}
      <div className="bg-[#3D2B1E] text-[#F5EFE6] px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-[#B88D6A]" />
          <span className="font-cormorant text-xl font-semibold">Bohemian House — Admin</span>
        </div>
        <a href="/" className="font-inter text-xs tracking-widest uppercase text-[#B88D6A] hover:text-white flex items-center gap-2">
          <Eye size={14} /> View Site
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-[#E9DFC6]">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 font-inter text-sm transition-all ${tab === t.id ? 'border-b-2 border-[#A05035] text-[#A05035]' : 'text-[#7C563D] hover:text-[#3D2B1E]'}`}>
              {t.icon} {t.label}
              {t.id === 'messages' && messages.filter(m => m.status === 'new').length > 0 && (
                <span className="bg-[#A05035] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {messages.filter(m => m.status === 'new').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* PROJECTS TAB */}
        {tab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-cormorant text-3xl text-[#3D2B1E]">Projects ({projects.length})</h2>
              <button onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-[#A05035] text-white font-inter text-sm px-5 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors">
                <Plus size={16} /> Add Project
              </button>
            </div>

            {/* Add form */}
            {showForm && (
              <div className="bg-white rounded-2xl p-6 border border-[#E9DFC6] mb-6 shadow-sm">
                <h3 className="font-cormorant text-2xl text-[#3D2B1E] mb-5">New Project</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1 block">Title *</label>
                    <input value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035]" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1 block">Category</label>
                    <select value={projectForm.category} onChange={e => setProjectForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035]">
                      {['Residential', 'Commercial', 'Hospitality', 'Office', 'Outdoor'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1 block">Location</label>
                    <input value={projectForm.location} onChange={e => setProjectForm(f => ({ ...f, location: e.target.value }))}
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035]" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1 block">Year</label>
                    <input value={projectForm.year} onChange={e => setProjectForm(f => ({ ...f, year: e.target.value }))}
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035]" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1 block">Description</label>
                  <textarea rows={3} value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] resize-none" />
                </div>
                <div className="mb-4">
                  <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1 block">Cover Image</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload}
                    className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm" />
                  {uploading && <p className="text-xs text-[#A05035] mt-1">Uploading...</p>}
                  {projectForm.cover_image && <img src={projectForm.cover_image} alt="" className="mt-2 h-24 rounded-lg object-cover" />}
                </div>
                <label className="flex items-center gap-2 font-inter text-sm text-[#7C563D] mb-5 cursor-pointer">
                  <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm(f => ({ ...f, featured: e.target.checked }))} />
                  Featured on homepage
                </label>
                <div className="flex gap-3">
                  <button onClick={saveProject}
                    className="bg-[#A05035] text-white font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors">
                    Save Project
                  </button>
                  <button onClick={() => setShowForm(false)}
                    className="border border-[#E9DFC6] text-[#7C563D] font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#E9DFC6] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Projects list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(project => (
                <div key={project.id} className="bg-white rounded-2xl overflow-hidden border border-[#E9DFC6] shadow-sm">
                  <div className="relative h-44">
                    <img src={project.cover_image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=60'} alt={project.title} className="w-full h-full object-cover" />
                    {project.featured && <span className="absolute top-3 left-3 bg-[#A05035] text-white font-inter text-xs px-3 py-1 rounded-full">Featured</span>}
                  </div>
                  <div className="p-4">
                    <p className="font-inter text-xs text-[#A05035] uppercase tracking-wider mb-1">{project.category}</p>
                    <h3 className="font-cormorant text-xl text-[#3D2B1E] mb-1">{project.title}</h3>
                    <p className="font-inter text-xs text-[#B88D6A]">{project.location} {project.year ? `· ${project.year}` : ''}</p>
                    <button onClick={() => deleteProject(project.id)}
                      className="mt-3 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-inter">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {projects.length === 0 && <p className="text-center text-[#B88D6A] font-cormorant text-2xl py-20">No projects yet. Add your first project!</p>}
          </div>
        )}

        {/* MESSAGES TAB */}
        {tab === 'messages' && (
          <div>
            <h2 className="font-cormorant text-3xl text-[#3D2B1E] mb-6">Messages ({messages.length})</h2>
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`bg-white rounded-2xl p-6 border shadow-sm ${msg.status === 'new' ? 'border-[#A05035]' : 'border-[#E9DFC6]'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-inter font-semibold text-[#3D2B1E] text-sm">{msg.name}</span>
                      <span className="font-inter text-xs text-[#B88D6A] ml-3">{msg.email}</span>
                      {msg.phone && <span className="font-inter text-xs text-[#B88D6A] ml-3">{msg.phone}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      {msg.status === 'new' && <span className="bg-[#A05035] text-white text-xs px-2 py-0.5 rounded-full">New</span>}
                      {msg.status === 'new' && (
                        <button onClick={() => markRead(msg)} className="font-inter text-xs text-[#7C563D] hover:text-[#A05035]">Mark read</button>
                      )}
                    </div>
                  </div>
                  {msg.service_interest && <p className="font-inter text-xs text-[#A05035] mb-2">Interest: {msg.service_interest}</p>}
                  <p className="font-inter text-sm text-[#7C563D] leading-relaxed">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && <p className="text-center text-[#B88D6A] font-cormorant text-2xl py-20">No messages yet.</p>}
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {tab === 'testimonials' && (
          <div>
            <h2 className="font-cormorant text-3xl text-[#3D2B1E] mb-6">Testimonials ({testimonials.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white rounded-2xl p-6 border border-[#E9DFC6] shadow-sm">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => <span key={j} className="text-[#B88D6A]">★</span>)}
                  </div>
                  <p className="font-cormorant text-lg text-[#3D2B1E] italic mb-4">"{t.quote}"</p>
                  <p className="font-inter text-sm font-medium text-[#7C563D]">{t.client_name}</p>
                  <p className="font-inter text-xs text-[#B88D6A]">{t.client_title}</p>
                </div>
              ))}
              {testimonials.length === 0 && <p className="col-span-2 text-center text-[#B88D6A] font-cormorant text-2xl py-20">No testimonials yet. Add them from the database.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}