import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { auth } from '@/api/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { Plus, Trash2, Eye, MessageSquare, Folder, Star, Pencil, X, Check, LogOut, Lock, Mail, Loader2, AlertCircle, RefreshCw, Upload, Wrench, ArrowUp, ArrowDown } from 'lucide-react';

const SITE_BASE = import.meta.env.BASE_URL || '/';
const CLOUDINARY_CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'bohemian_unsigned';

async function uploadToCloudinary(file) {
  if (!CLOUDINARY_CLOUD) throw new Error('Cloudinary not configured');
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url;
}

function Toast({ toast, onDismiss }) {
  const bg = toast.type === 'error'
    ? 'bg-red-600'
    : toast.type === 'success'
      ? 'bg-emerald-600'
      : 'bg-[#3D2B1E]';

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div className={`${bg} text-white px-5 py-3 rounded-xl shadow-lg font-inter text-sm flex items-center gap-3 min-w-[280px] animate-slide-up`}>
      {toast.type === 'error' && <AlertCircle size={16} className="flex-shrink-0" />}
      <span className="flex-1">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => <Toast key={t.id} toast={t} onDismiss={onDismiss} />)}
    </div>
  );
}

let toastIdCounter = 0;

const EMPTY_PROJECT = { title: '', category: 'Residential', location: '', year: '', description: '', cover_image: '', featured: false };
const EMPTY_SERVICE = { title: '', description: '', icon: '🪴', order: 0 };

const SERVICE_ICONS = ['🪴', '📐', '🛋️', '🎨', '🌿', '✅', '🏠', '🔨', '💡', '🪵', '🌳', '🏗️'];

export default function Admin() {
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const [tab, setTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [savingService, setSavingService] = useState(false);

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastIdCounter;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsub;
  }, []);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const [p, m, t, s] = await Promise.all([
        base44.entities.Project.list('-created_date', 100),
        base44.entities.ContactMessage.list('-created_date', 100),
        base44.entities.Testimonial.list('-created_date', 100),
        base44.entities.Service.list('order', 100),
      ]);
      setProjects(p);
      setMessages(m);
      setTestimonials(t);
      setServices(s);
    } catch (err) {
      console.error('Failed to load data:', err);
      setDataError('Failed to load data. Check your internet connection and try again.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadData();
  }, [user, loadData]);

  const getAuthErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email address.';
      case 'auth/user-disabled': return 'This account has been disabled.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/invalid-credential': return 'Invalid email or password.';
      case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed': return 'Network error. Check your internet connection.';
      default: return 'Login failed. Please try again.';
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setLoginError(getAuthErrorMessage(err.code));
    } finally {
      setLoginLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSent(true);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        addToast('No account found with this email.', 'error');
      } else {
        addToast('Failed to send reset email. Try again.', 'error');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProjects([]);
      setMessages([]);
      setTestimonials([]);
      setServices([]);
    } catch {
      addToast('Failed to log out. Try again.', 'error');
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setProjectForm(EMPTY_PROJECT);
    setShowForm(true);
  };

  const openEdit = (project) => {
    setEditingId(project.id);
    setProjectForm({
      title: project.title,
      category: project.category,
      location: project.location || '',
      year: project.year || '',
      description: project.description || '',
      cover_image: project.cover_image || '',
      featured: project.featured || false,
    });
    setShowForm(true);
  };

  const saveProject = async () => {
    if (!projectForm.title.trim()) {
      addToast('Project title is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await base44.entities.Project.update(editingId, projectForm);
        setProjects(prev => prev.map(p => p.id === editingId ? { ...p, ...updated } : p));
        addToast('Project updated.');
      } else {
        const p = await base44.entities.Project.create(projectForm);
        setProjects(prev => [p, ...prev]);
        addToast('Project created.');
      }
      setShowForm(false);
      setEditingId(null);
      setProjectForm(EMPTY_PROJECT);
    } catch {
      addToast('Failed to save project. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Delete this project? This action cannot be undone.')) return;
    try {
      await base44.entities.Project.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      addToast('Project deleted.');
    } catch {
      addToast('Failed to delete project.', 'error');
    }
  };

  const toggleFeatured = async (project) => {
    try {
      const updated = await base44.entities.Project.update(project.id, { featured: !project.featured });
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, ...updated } : p));
      addToast(project.featured ? 'Removed from homepage.' : 'Added to homepage.');
    } catch {
      addToast('Failed to update project.', 'error');
    }
  };

  const markRead = async (msg) => {
    try {
      await base44.entities.ContactMessage.update(msg.id, { status: 'read' });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
    } catch {
      addToast('Failed to mark message as read.', 'error');
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await base44.entities.ContactMessage.delete(id);
      setMessages(prev => prev.filter(m => m.id !== id));
      addToast('Message deleted.');
    } catch {
      addToast('Failed to delete message.', 'error');
    }
  };

  const deleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await base44.entities.Testimonial.delete(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
      addToast('Testimonial deleted.');
    } catch {
      addToast('Failed to delete testimonial.', 'error');
    }
  };

  // Auth state still loading
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#1A110A] flex items-center justify-center">
        <Loader2 size={32} className="text-[#A05035] animate-spin" />
      </div>
    );
  }

  // ─── LOGIN SCREEN ───
  if (!user) {
    return (
      <div className="min-h-screen bg-[#1A110A] flex items-center justify-center px-4">
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#A05035]/20 border border-[#A05035]/40 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-[#A05035]" />
            </div>
            <h1 className="font-cormorant text-3xl text-[#F5EFE6] mb-1">Bohemian House</h1>
            <p className="font-inter text-xs text-[#B88D6A] tracking-widest uppercase">Admin Dashboard</p>
          </div>

          {showReset ? (
            <div className="bg-[#2A1E14] rounded-2xl p-8 border border-[#3D2B1E]">
              {resetSent ? (
                <div className="text-center">
                  <Mail size={32} className="text-[#A05035] mx-auto mb-4" />
                  <p className="font-inter text-sm text-[#F5EFE6] mb-2">Reset email sent!</p>
                  <p className="font-inter text-xs text-[#B88D6A] mb-6">Check your inbox and follow the link to reset your password.</p>
                  <button onClick={() => { setShowReset(false); setResetSent(false); setResetEmail(''); }}
                    className="font-inter text-xs text-[#A05035] hover:underline">
                    Back to login
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset}>
                  <p className="font-inter text-sm text-[#F5EFE6] mb-4">Enter your admin email to receive a password reset link.</p>
                  <label className="font-inter text-xs text-[#B88D6A] uppercase tracking-widest mb-2 block">Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-[#1A110A] border border-[#3D2B1E] rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] focus:outline-none focus:border-[#A05035] mb-4"
                    autoComplete="email"
                    disabled={resetLoading}
                  />
                  <button type="submit" disabled={resetLoading || !resetEmail.trim()}
                    className="w-full bg-[#A05035] text-[#F5EFE6] font-inter text-sm tracking-widest uppercase py-3 rounded-full hover:bg-[#7C563D] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4">
                    {resetLoading && <Loader2 size={16} className="animate-spin" />}
                    Send Reset Link
                  </button>
                  <button type="button" onClick={() => { setShowReset(false); setResetEmail(''); }}
                    className="w-full font-inter text-xs text-[#B88D6A] hover:text-[#F5EFE6] transition-colors">
                    Back to login
                  </button>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={login} className="bg-[#2A1E14] rounded-2xl p-8 border border-[#3D2B1E]">
              <label className="font-inter text-xs text-[#B88D6A] uppercase tracking-widest mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setLoginError(''); }}
                placeholder="admin@example.com"
                className={`w-full bg-[#1A110A] border rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] focus:outline-none mb-4 transition-colors ${loginError ? 'border-red-500' : 'border-[#3D2B1E] focus:border-[#A05035]'}`}
                autoComplete="email"
                disabled={loginLoading}
              />
              <label className="font-inter text-xs text-[#B88D6A] uppercase tracking-widest mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                placeholder="Enter password"
                className={`w-full bg-[#1A110A] border rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] focus:outline-none mb-2 transition-colors ${loginError ? 'border-red-500' : 'border-[#3D2B1E] focus:border-[#A05035]'}`}
                autoComplete="current-password"
                disabled={loginLoading}
              />
              <div className="flex justify-end mb-4">
                <button type="button" onClick={() => { setShowReset(true); setResetEmail(email); setLoginError(''); }}
                  className="font-inter text-xs text-[#B88D6A] hover:text-[#A05035] transition-colors">
                  Forgot password?
                </button>
              </div>
              {loginError && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-4">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-xs font-inter">{loginError}</p>
                </div>
              )}
              <button type="submit" disabled={loginLoading}
                className="w-full bg-[#A05035] text-[#F5EFE6] font-inter text-sm tracking-widest uppercase py-3 rounded-full hover:bg-[#7C563D] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loginLoading && <Loader2 size={16} className="animate-spin" />}
                Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─── LOADING STATE ───
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#F0EBE0] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-[#A05035] animate-spin mx-auto mb-4" />
          <p className="font-inter text-sm text-[#7C563D]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ─── DATA ERROR STATE ───
  if (dataError) {
    return (
      <div className="min-h-screen bg-[#F0EBE0] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="font-cormorant text-2xl text-[#3D2B1E] mb-2">Something went wrong</h2>
          <p className="font-inter text-sm text-[#7C563D] mb-6">{dataError}</p>
          <button onClick={loadData}
            className="flex items-center gap-2 bg-[#A05035] text-white font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors mx-auto">
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  const newMsgCount = messages.filter(m => m.status === 'new').length;

  // ─── DASHBOARD ───
  return (
    <div className="min-h-screen bg-[#F0EBE0]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top bar */}
      <div className="bg-[#3D2B1E] text-[#F5EFE6] px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <span className="font-cormorant text-xl font-semibold">Bohemian House — Admin</span>
        <div className="flex items-center gap-4">
          <span className="font-inter text-xs text-[#B88D6A] hidden sm:inline">{user.email}</span>
          <a href={SITE_BASE} target="_blank" rel="noopener noreferrer" className="font-inter text-xs tracking-widest uppercase text-[#B88D6A] hover:text-white flex items-center gap-1.5">
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
            { id: 'services', label: 'Services', icon: <Wrench size={15} />, count: services.length },
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
                    {uploading ? <Loader2 size={18} className="text-[#A05035] animate-spin" /> : <Upload size={18} className="text-[#A05035]" />}
                    <span className="font-inter text-sm text-[#7C563D]">{uploading ? 'Uploading...' : 'Click to upload image (max 5MB)'}</span>
                    <input type="file" accept="image/*" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) { addToast('Image must be under 5MB.', 'error'); return; }
                      if (!file.type.startsWith('image/')) { addToast('Please select an image file.', 'error'); return; }
                      setUploading(true);
                      try {
                        const url = await uploadToCloudinary(file);
                        setProjectForm(f => ({ ...f, cover_image: url }));
                        addToast('Image uploaded.');
                      } catch { addToast('Failed to upload image. Check Cloudinary config.', 'error'); }
                      finally { setUploading(false); e.target.value = ''; }
                    }} className="hidden" disabled={uploading} />
                  </label>
                  {projectForm.cover_image && (
                    <div className="mt-3 relative inline-block">
                      <img src={projectForm.cover_image} alt="" className="h-28 rounded-xl object-cover border border-[#E9DFC6]" onError={e => { e.target.style.display = 'none'; }} />
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
                  <button onClick={saveProject} disabled={!projectForm.title.trim() || saving}
                    className="flex items-center gap-2 bg-[#A05035] text-white font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors disabled:opacity-40">
                    {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    {editingId ? 'Save Changes' : 'Save Project'}
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
                      <button
                        onClick={() => toggleFeatured(project)}
                        className={`flex items-center gap-1 text-xs font-inter transition-colors ${ project.featured ? 'text-[#A05035] hover:text-[#7C563D]' : 'text-[#B88D6A] hover:text-[#A05035]' }`}>
                        {project.featured ? '★ On Home' : '☆ Add to Home'}
                      </button>
                      <button onClick={() => deleteProject(project.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-inter transition-colors ml-auto">
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

        {/* ── SERVICES ── */}
        {tab === 'services' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-cormorant text-3xl text-[#3D2B1E]">Services</h2>
              <button onClick={() => { setEditingServiceId(null); setServiceForm({ ...EMPTY_SERVICE, order: services.length + 1 }); setShowServiceForm(true); }}
                className="flex items-center gap-2 bg-[#A05035] text-white font-inter text-sm px-5 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors shadow-sm">
                <Plus size={15} /> Add Service
              </button>
            </div>

            {showServiceForm && (
              <div className="bg-white rounded-2xl p-6 border border-[#E9DFC6] mb-6 shadow-md">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-cormorant text-2xl text-[#3D2B1E]">{editingServiceId ? 'Edit Service' : 'New Service'}</h3>
                  <button onClick={() => setShowServiceForm(false)} className="text-[#B88D6A] hover:text-[#3D2B1E]"><X size={20} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Title *</label>
                    <input value={serviceForm.title} onChange={e => setServiceForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Interior Design & Renovation"
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] bg-[#FAFAF8]" />
                  </div>
                  <div>
                    <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Order</label>
                    <input type="number" min="1" value={serviceForm.order} onChange={e => setServiceForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] bg-[#FAFAF8]" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_ICONS.map(icon => (
                      <button key={icon} type="button" onClick={() => setServiceForm(f => ({ ...f, icon }))}
                        className={`text-2xl w-11 h-11 rounded-xl flex items-center justify-center transition-all ${serviceForm.icon === icon ? 'bg-[#A05035]/15 border-2 border-[#A05035] scale-110' : 'bg-[#FAFAF8] border border-[#E9DFC6] hover:border-[#A05035]'}`}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-5">
                  <label className="font-inter text-xs text-[#7C563D] uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea rows={3} value={serviceForm.description} onChange={e => setServiceForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Brief description of this service..."
                    className="w-full border border-[#E9DFC6] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#A05035] resize-none bg-[#FAFAF8]" />
                </div>
                <div className="flex gap-3">
                  <button onClick={async () => {
                    if (!serviceForm.title.trim()) { addToast('Service title is required.', 'error'); return; }
                    setSavingService(true);
                    try {
                      if (editingServiceId) {
                        const updated = await base44.entities.Service.update(editingServiceId, serviceForm);
                        setServices(prev => prev.map(s => s.id === editingServiceId ? { ...s, ...updated } : s).sort((a, b) => (a.order || 0) - (b.order || 0)));
                        addToast('Service updated.');
                      } else {
                        const s = await base44.entities.Service.create(serviceForm);
                        setServices(prev => [...prev, s].sort((a, b) => (a.order || 0) - (b.order || 0)));
                        addToast('Service created.');
                      }
                      setShowServiceForm(false);
                      setEditingServiceId(null);
                      setServiceForm(EMPTY_SERVICE);
                    } catch { addToast('Failed to save service.', 'error'); }
                    finally { setSavingService(false); }
                  }} disabled={!serviceForm.title.trim() || savingService}
                    className="flex items-center gap-2 bg-[#A05035] text-white font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors disabled:opacity-40">
                    {savingService ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                    {editingServiceId ? 'Save Changes' : 'Save Service'}
                  </button>
                  <button onClick={() => setShowServiceForm(false)}
                    className="border border-[#E9DFC6] text-[#7C563D] font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#E9DFC6] transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {services.map((svc, idx) => (
                <div key={svc.id} className="bg-white rounded-2xl p-5 border border-[#E9DFC6] shadow-sm flex items-center gap-4">
                  <span className="text-3xl flex-shrink-0">{svc.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cormorant text-xl text-[#3D2B1E] leading-tight">{svc.title}</h3>
                    <p className="font-inter text-xs text-[#B88D6A] mt-0.5 line-clamp-2">{svc.description}</p>
                  </div>
                  <span className="font-inter text-xs text-[#B88D6A] bg-[#F0EBE0] px-2.5 py-1 rounded-full flex-shrink-0">#{svc.order || idx + 1}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={async () => {
                      if (idx === 0) return;
                      try {
                        const prev = services[idx - 1];
                        await Promise.all([
                          base44.entities.Service.update(svc.id, { order: prev.order || idx }),
                          base44.entities.Service.update(prev.id, { order: svc.order || idx + 1 }),
                        ]);
                        setServices(s => {
                          const copy = [...s];
                          [copy[idx - 1], copy[idx]] = [{ ...copy[idx], order: prev.order || idx }, { ...copy[idx - 1], order: svc.order || idx + 1 }];
                          return copy;
                        });
                      } catch { addToast('Failed to reorder.', 'error'); }
                    }} disabled={idx === 0}
                      className="p-1.5 rounded-lg text-[#B88D6A] hover:text-[#A05035] hover:bg-[#F0EBE0] transition-colors disabled:opacity-30">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={async () => {
                      if (idx === services.length - 1) return;
                      try {
                        const next = services[idx + 1];
                        await Promise.all([
                          base44.entities.Service.update(svc.id, { order: next.order || idx + 2 }),
                          base44.entities.Service.update(next.id, { order: svc.order || idx + 1 }),
                        ]);
                        setServices(s => {
                          const copy = [...s];
                          [copy[idx], copy[idx + 1]] = [{ ...copy[idx + 1], order: svc.order || idx + 1 }, { ...copy[idx], order: next.order || idx + 2 }];
                          return copy;
                        });
                      } catch { addToast('Failed to reorder.', 'error'); }
                    }} disabled={idx === services.length - 1}
                      className="p-1.5 rounded-lg text-[#B88D6A] hover:text-[#A05035] hover:bg-[#F0EBE0] transition-colors disabled:opacity-30">
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <button onClick={() => {
                    setEditingServiceId(svc.id);
                    setServiceForm({ title: svc.title, description: svc.description || '', icon: svc.icon || '🪴', order: svc.order || idx + 1 });
                    setShowServiceForm(true);
                  }} className="flex items-center gap-1 text-xs text-[#7C563D] hover:text-[#A05035] font-inter transition-colors flex-shrink-0">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={async () => {
                    if (!confirm('Delete this service?')) return;
                    try {
                      await base44.entities.Service.delete(svc.id);
                      setServices(prev => prev.filter(s => s.id !== svc.id));
                      addToast('Service deleted.');
                    } catch { addToast('Failed to delete service.', 'error'); }
                  }} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-inter transition-colors flex-shrink-0">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              ))}
              {services.length === 0 && !showServiceForm && (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#E9DFC6]">
                  <p className="font-cormorant text-2xl text-[#B88D6A] mb-4">No services yet</p>
                  <button onClick={() => { setEditingServiceId(null); setServiceForm({ ...EMPTY_SERVICE, order: 1 }); setShowServiceForm(true); }}
                    className="bg-[#A05035] text-white font-inter text-sm px-6 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors">
                    Add Your First Service
                  </button>
                </div>
              )}
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-inter text-sm font-semibold text-[#7C563D]">{t.client_name}</p>
                      <p className="font-inter text-xs text-[#B88D6A]">{t.client_title}</p>
                    </div>
                    <button onClick={() => deleteTestimonial(t.id)}
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-inter transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
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
