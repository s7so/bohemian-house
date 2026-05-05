import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Send, CheckCircle } from 'lucide-react';

const services = [
  'Interior Design',
  'Space Planning',
  'Furniture Curation',
  'Color Consultation',
  'Eco Certification',
  'Full Project Management',
];

const budgets = [
  'Under 50K EGP',
  '50K–150K EGP',
  '150K–300K EGP',
  '300K+ EGP',
  'To be discussed',
];

export default function ConsultationBookingForm() {
  const [form, setForm] = useState({
    client_name: '',
    email: '',
    phone: '',
    service_type: '',
    project_description: '',
    preferred_date: '',
    budget_range: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ConsultationBooking.create({ ...form, status: 'new' });
    setSent(true);
    setLoading(false);
  };

  return (
    <section id="booking" className="py-32 px-6 bg-[#2A1E14] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(160,80,53,0.10) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(115,123,76,0.07) 0%, transparent 60%)' }} />

      <div className="max-w-3xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4">Free Consultation</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-cormorant text-5xl md:text-6xl font-light text-[#F5EFE6]">
            Book Your <em className="italic text-[#D4956A]">Design Session</em>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="font-inter text-sm text-[#B88D6A] mt-4 leading-relaxed">
            Tell us about your vision and we'll get back to you within 24 hours.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-center bg-[#3D2B1E]/60 border border-[#A05035]/30 rounded-3xl p-16">
              <CheckCircle size={48} className="text-[#A05035] mx-auto mb-6" />
              <h3 className="font-cormorant text-4xl text-[#F5EFE6] mb-3">Request Received!</h3>
              <p className="font-inter text-sm text-[#B88D6A]">Our team will contact you within 24 hours to confirm your consultation.</p>
            </motion.div>
          ) : (
            <motion.form key="form"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="bg-[#3D2B1E]/50 backdrop-blur-sm border border-[#5C3D2A] rounded-3xl p-8 md:p-12 space-y-6">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Full Name *">
                  <input required value={form.client_name} onChange={e => set('client_name', e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-[#2A1E14] border border-[#5C3D2A] rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] placeholder-[#7C563D] focus:outline-none focus:border-[#A05035] transition-colors" />
                </Field>
                <Field label="Email *">
                  <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-[#2A1E14] border border-[#5C3D2A] rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] placeholder-[#7C563D] focus:outline-none focus:border-[#A05035] transition-colors" />
                </Field>
              </div>

              {/* Phone + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="Phone Number">
                  <input value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+20 1XX XXX XXXX"
                    className="w-full bg-[#2A1E14] border border-[#5C3D2A] rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] placeholder-[#7C563D] focus:outline-none focus:border-[#A05035] transition-colors" />
                </Field>
                <Field label="Preferred Date">
                  <div className="relative">
                    <input type="date" value={form.preferred_date} onChange={e => set('preferred_date', e.target.value)}
                      className="w-full bg-[#2A1E14] border border-[#5C3D2A] rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] focus:outline-none focus:border-[#A05035] transition-colors [color-scheme:dark]" />
                    <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C563D] pointer-events-none" />
                  </div>
                </Field>
              </div>

              {/* Service */}
              <Field label="Service Required *">
                <select required value={form.service_type} onChange={e => set('service_type', e.target.value)}
                  className="w-full bg-[#2A1E14] border border-[#5C3D2A] rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] focus:outline-none focus:border-[#A05035] transition-colors">
                  <option value="">Select a service...</option>
                  {services.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>

              {/* Budget */}
              <Field label="Budget Range">
                <div className="flex flex-wrap gap-3">
                  {budgets.map(b => (
                    <button type="button" key={b}
                      onClick={() => set('budget_range', b)}
                      className={`font-inter text-xs px-4 py-2 rounded-full border transition-all duration-200 ${form.budget_range === b
                        ? 'bg-[#A05035] border-[#A05035] text-[#F5EFE6]'
                        : 'border-[#5C3D2A] text-[#B88D6A] hover:border-[#A05035] hover:text-[#D4956A]'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Description */}
              <Field label="Project Description">
                <textarea rows={4} value={form.project_description} onChange={e => set('project_description', e.target.value)}
                  placeholder="Tell us about your space, style preferences, and goals..."
                  className="w-full bg-[#2A1E14] border border-[#5C3D2A] rounded-xl px-4 py-3 font-inter text-sm text-[#F5EFE6] placeholder-[#7C563D] focus:outline-none focus:border-[#A05035] transition-colors resize-none" />
              </Field>

              <button type="submit" disabled={loading}
                className="w-full bg-[#A05035] text-[#F5EFE6] font-inter text-sm tracking-widest uppercase py-4 rounded-full hover:bg-[#7C563D] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? 'Sending...' : <><Send size={16} /> Book My Consultation</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="font-inter text-xs tracking-widest uppercase text-[#B88D6A] mb-2 block">{label}</label>
      {children}
    </div>
  );
}