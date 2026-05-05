import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', service_interest: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ContactMessage.create({ ...form, status: 'new' });
    setSent(true);
    setLoading(false);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Info side */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4">Let's Talk</p>
            <h2 className="font-cormorant text-5xl font-light text-[#3D2B1E] mb-6">Start Your <em className="italic">Dream Space</em></h2>
            <p className="font-inter text-[#7C563D] leading-relaxed mb-12">
              Whether you're redesigning a room or building a home from scratch, we'd love to hear your vision. Let's create something beautiful together.
            </p>

            <div className="space-y-6">
              {[
                { icon: <MapPin size={18} />, label: 'Cairo, Egypt', sub: 'Serving all of Egypt & GCC' },
                { icon: <Mail size={18} />, label: 'bohemianhouse2030@gmail.com', sub: 'We reply within 24hrs' },
                { icon: <Phone size={18} />, label: '+20 10 24988931', sub: 'Sun–Thu, 9am–6pm' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E9DFC6] flex items-center justify-center text-[#A05035] flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-inter text-sm font-medium text-[#3D2B1E]">{item.label}</p>
                    <p className="font-inter text-xs text-[#B88D6A]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form side */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {sent ? (
              <div className="bg-[#737B4C]/10 border border-[#737B4C]/30 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="font-cormorant text-3xl text-[#3D2B1E] mb-3">Thank You!</h3>
                <p className="font-inter text-[#7C563D] text-sm">We've received your message and will be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-[#E9DFC6] space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-inter text-xs tracking-widest uppercase text-[#7C563D] mb-2 block">Name *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#F5EFE6] border border-[#E9DFC6] rounded-xl px-4 py-3 font-inter text-sm text-[#3D2B1E] focus:outline-none focus:border-[#A05035]" />
                  </div>
                  <div>
                    <label className="font-inter text-xs tracking-widest uppercase text-[#7C563D] mb-2 block">Email *</label>
                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#F5EFE6] border border-[#E9DFC6] rounded-xl px-4 py-3 font-inter text-sm text-[#3D2B1E] focus:outline-none focus:border-[#A05035]" />
                  </div>
                </div>
                <div>
                  <label className="font-inter text-xs tracking-widest uppercase text-[#7C563D] mb-2 block">Phone</label>
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#F5EFE6] border border-[#E9DFC6] rounded-xl px-4 py-3 font-inter text-sm text-[#3D2B1E] focus:outline-none focus:border-[#A05035]" />
                </div>
                <div>
                  <label className="font-inter text-xs tracking-widest uppercase text-[#7C563D] mb-2 block">Service Interest</label>
                  <select value={form.service_interest} onChange={e => setForm({ ...form, service_interest: e.target.value })}
                    className="w-full bg-[#F5EFE6] border border-[#E9DFC6] rounded-xl px-4 py-3 font-inter text-sm text-[#3D2B1E] focus:outline-none focus:border-[#A05035]">
                    <option value="">Select a service...</option>
                    <option>Interior Design</option>
                    <option>Space Planning</option>
                    <option>Furniture Curation</option>
                    <option>Color Consultation</option>
                    <option>Full Project</option>
                  </select>
                </div>
                <div>
                  <label className="font-inter text-xs tracking-widest uppercase text-[#7C563D] mb-2 block">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your space and vision..."
                    className="w-full bg-[#F5EFE6] border border-[#E9DFC6] rounded-xl px-4 py-3 font-inter text-sm text-[#3D2B1E] focus:outline-none focus:border-[#A05035] resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#A05035] text-[#F5EFE6] font-inter text-sm tracking-widest uppercase py-4 rounded-full hover:bg-[#7C563D] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? 'Sending...' : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}