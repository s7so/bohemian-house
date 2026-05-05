import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Eye, MessageSquare, Folder, Star, Pencil, X, Check, LogOut, Upload, Lock } from 'lucide-react';

const PASSWORD = 'bohemian2030';

const EMPTY_PROJECT = { title: '', category: 'Residential', location: '', year: '', description: '', cover_image: '', featured: false };

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('bh_admin') === '1');
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);

  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authed) return;
    base44.entities.Project.list('-created_date', 100).then(setProjects);
    base44.entities.ContactMessage.list('-created_date', 100).then(setMessages);
    base44.entities.Testimonial.list('-created_date', 100).then(setTestimonials);
  }, [authed]);

  const login = (e) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      sessionStorage.setItem('bh_admin', '1');
      setAuthed(true);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('bh_admin');
    setAuthed(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setProjectForm(f => ({ ...f, cover_image: file_url }));
    setUploading(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setProjectForm(EMPTY_PROJECT);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditingId(project.id);
    setProjectForm({ title: project.title, category: project.category, location: project.location || '', year: project.year || '', description: project.description || '', cover_image: project.cover_image || '', featured: project.featured || false });
    setShowForm(true);
  };

  const saveProject = async () => {
    if (!projectForm.title) return;
    if (editingId) {
      const updated = await base44.entities.Project.update(editingId, projectForm);
      setProjects(prev => prev.map(p => p.id === editingId ? updated : p));
    } else {
      const p = await base44.entities.Project.create(projectForm);
      setProjects(prev => [p, ...prev]);
    }
    setShowForm(false);
    setEditingId(null);
    setProjectForm(EMPTY_PROJECT);
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    await base44.entities.Project.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const markRead = async (msg) => {
    await base44.entities.ContactMessage.update(msg.id, { status: 'read' });
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
  };

  const deleteMessage = async (id) => {
    await base44.entities.ContactMessage.delete(id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // ─── LOGIN SCREEN ───
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#1A110A] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#A05035]/20 border border-[#A05035]/40 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-[#A05035]" />
            </div>
            <h1 className="font-cormorant text-3xl text-[#F5EFE6] mb-1">Bohemian House</h1>
            <p className="font-inter text-xs text-[#B88D6A] tracking-widest uppercase">Admin Dashboard</p>
          </div>
          <form onSubmit={login} className="bg-[#2A1E14] rounded-2xl p-8 border border-[#3D2B1E]">
            <label className="font-inter text-xs text-[#B88D6A] uppercase tracking-widest mb-2 block">Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Enter password"
              className={`w-full bg-[#1A110A] border rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] focus:outline-none mb-4 transition-colors ${pwError ? 'border-red-500' : 'border-[#3D2B1E] focus:border-[#A05035]'}`}
            />
            {pwError && <p className="text-red-400 text-xs font-inter mb-3">Wrong password. Try again.</p>}
            <button type="submit" className="w-full bg-[#A05035] text-[#F5EFE6] font-inter text-sm tracking-widest uppercase py-3 rounded-full hover:bg-[#7C563D] transition-colors">
              Enter
            </button>
          </form>
          <p className="text-center font-inter text-xs text-[#5C3D2A] mt-6">Password: <span className="text-[#B88D6A]">bohemian2030</span></p>
        </div>
      </div>
    );
  }

  const newMsgCount = messages.filter(m => m.status === 'new').length;

  // ─── DASHBOARD ───
  return (
    <div className="min-h-screen bg-[#F0EBE0]">
      {/* Top bar */}
      <div className="bg-[#3D2B1E] text-[#F5EFE6] px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <span className="font-cormorant text-xl font-semibold">Bohemian House — Admin</span>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="font-inter text-xs tracking-widest uppercase text-[#B88D6A] hover:text-white flex items-center gap-1.5">
            <Eye size={13} /> View Site
          </a>
          <button onClick={logout} className="font-inter text-xs tracking-widest uppercase text-[#B88D6A] hover:text-red-400 flex items-center gap-1.5 transition-colors">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 border border-[#E9DFC6] shadow-sm w-fit">
          {[
            { id: 'projects', label: 'Projects', icon: <Folder size={15} />, count: projects.length },
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={15} />, count: newMsgCount, badge: true },
            { id: 'testimonials', label: 'Testimonials', icon: <Star size={15} />, count: testimonials.length },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-inter text-sm transition-all ${tab === t.id ? 'bg-[#A05035] text-white shadow-sm' : 'text-[#7C563D] hover:bg-[#F0EBE0]'}`}>
              {t.icon} {t.label}
              {t.badge && t.count > 0 ? (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{t.count}</span>
              ) : (
                <span className={`text-xs rounded-full px-2 py-0.5 ${tab === t.id ? 'bg-white/20 text-white' : 'bg-[#E9DFC6] text-[#7C563D]'}`}>{t.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── PROJECTS ── */}
        {tab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-cormorant text-3xl text-[#3D2B1E]">Projects</h2>
              <button onClick={openAdd}
                className="flex items-center gap-2 bg-[#A05035] text-white font-inter text-sm px-5 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors shadow-sm">
                <Plus size={15} /> Add Project
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white rounded-2xl p-6 border border-[#E9DFC6] mb-6 shadow-md">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-cormorant text-2xl text-[#3D2B1E]">{editingId ? 'Edit Project' : 'New Project'}</h3>
                  <button onClick={() => setShowForm(false)} className="text-[#B88D6A] hover:text-[#3D2B1E]"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Title *</label>
                    <input value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Desert Bloom Villa"
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] bg-[#FAFAF8]" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Category</label>
                    <select value={projectForm.category} onChange={e => setProjectForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] bg-[#FAFAF8]">
                      {['Residential', 'Commercial', 'Hospitality', 'Office', 'Outdoor'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Location</label>
                    <input value={projectForm.location} onChange={e => setProjectForm(f => ({ ...f, location: e.target.value }))}
                      placeholder="e.g. New Cairo"
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] bg-[#FAFAF8]" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Year</label>
                    <input value={projectForm.year} onChange={e => setProjectForm(f => ({ ...f, year: e.target.value }))}
                      placeholder="e.g. 2024"
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] bg-[#FAFAF8]" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea rows={3} value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of the project..."
                    className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] resize-none bg-[#FAFAF8]" />
                </div>

                {/* Image upload */}
                <div className="mb-5">
                  <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Cover Image</label>
                  <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors ${uploading ? 'border-[#A05035] bg-[#A05035]/5' : 'border-[#E9DFC6] hover:border-[#A05035] bg-[#FAFAF8]'}`}>
                    <Upload size={18} className="text-[#A05035]" />
                    <span className="font-inter text-sm text-[#7C563D]">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {projectForm.cover_image && (
                    <div className="mt-3 relative inline-block">
                      <img src={projectForm.cover_image} alt="" className="h-28 rounded-xl object-cover border border-[#E9DFC6]" />
                      <button onClick={() => setProjectForm(f => ({ ...f, cover_image: '' }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                        <X size={11} />
                      </button>
                    </div>
                  )}
                </div>

                <label className="flex items-center gap-2 font-inter text-sm text-[#7C563D] mb-5 cursor-pointer select-none">
                  <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm(f => ({ ...f, featured: e.target.checked }))} className="accent-[#A05035]" />
                  Show on homepage (Featured)
                </label>

                <div className="flex gap-3">
                  <button onClick={saveProject} disabled={!projectForm.title}
                    className="flex items-center gap-2 bg-[#A05035] text-white font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors disabled:opacity-40">
                    <Check size={15} /> {editingId ? 'Save Changes' : 'Save Project'}
                  </button>
                  <button onClick={() => setShowForm(false)}
                    className="border border-[#E9DFC6] text-[#7C563D] font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#E9DFC6] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(project => (
                <div key={project.id} className="bg-white rounded-2xl overflow-hidden border border-[#E9DFC6] shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-44">
                    <img src={project.cover_image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=60'} alt={project.title} className="w-full h-full object-cover" />
                    {project.featured && <span className="absolute top-3 left-3 bg-[#A05035] text-white font-inter text-xs px-3 py-1 rounded-full shadow">Featured</span>}
                  </div>
                  <div className="p-4">
                    <p className="font-inter text-xs text-[#A05035] uppercase tracking-wider mb-1">{project.category}</p>
                    <h3 className="font-cormorant text-xl text-[#3D2B1E] mb-1 leading-tight">{project.title}</h3>
                    <p className="font-inter text-xs text-[#B88D6A]">{project.location}{project.year ? ` · ${project.year}` : ''}</p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#F0EBE0]">
                      <button onClick={() => openEdit(project)}
                        className="flex items-center gap-1 text-xs text-[#7C563D] hover:text-[#A05035] font-inter transition-colors">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => deleteProject(project.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-inter transition-colors">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {projects.length === 0 && !showForm && (
              <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#E9DFC6]">
                <p className="font-cormorant text-2xl text-[#B88D6A] mb-4">No projects yet</p>
                <button onClick={openAdd} className="bg-[#A05035] text-white font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors">
                  Add Your First Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab === 'messages' && (
          <div>
            <h2 className="font-cormorant text-3xl text-[#3D2B1E] mb-6">Messages</h2>
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`bg-white rounded-2xl p-6 border shadow-sm ${msg.status === 'new' ? 'border-[#A05035]' : 'border-[#E9DFC6]'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-inter font-semibold text-[#3D2B1E] text-sm">{msg.name}</span>
                      <span className="font-inter text-xs text-[#B88D6A]">{msg.email}</span>
                      {msg.phone && <span className="font-inter text-xs text-[#B88D6A]">{msg.phone}</span>}
                      {msg.status === 'new' && <span className="bg-[#A05035] text-white text-xs px-2 py-0.5 rounded-full">New</span>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                      {msg.status === 'new' && (
                        <button onClick={() => markRead(msg)} className="font-inter text-xs text-[#7C563D] hover:text-[#A05035] underline">Mark read</button>
                      )}
                      <button onClick={() => deleteMessage(msg.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {msg.service_interest && <p className="font-inter text-xs text-[#A05035] mb-2 bg-[#A05035]/10 inline-block px-3 py-1 rounded-full">{msg.service_interest}</p>}
                  <p className="font-inter text-sm text-[#7C563D] leading-relaxed">{msg.message}</p>
                </div>
              ))}
              {messages.length === 0 && <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#E9DFC6]"><p className="font-cormorant text-2xl text-[#B88D6A]">No messages yet.</p></div>}
            </div>
          </div>
        )}

        {/* ── TESTIMONIALS ── */}
        {tab === 'testimonials' && (
          <div>
            <h2 className="font-cormorant text-3xl text-[#3D2B1E] mb-6">Client Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white rounded-2xl p-6 border border-[#E9DFC6] shadow-sm">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => <span key={j} className="text-[#B88D6A] text-sm">★</span>)}
                  </div>
                  <p className="font-cormorant text-lg text-[#3D2B1E] italic mb-4 leading-relaxed">"{t.quote}"</p>
                  <p className="font-inter text-sm font-semibold text-[#7C563D]">{t.client_name}</p>
                  <p className="font-inter text-xs text-[#B88D6A]">{t.client_title}</p>
                </div>
              ))}
              {testimonials.length === 0 && <div className="col-span-2 text-center py-24 bg-white rounded-2xl border border-dashed border-[#E9DFC6]"><p className="font-cormorant text-2xl text-[#B88D6A]">No testimonials yet.</p></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}