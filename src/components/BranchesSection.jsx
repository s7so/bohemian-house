import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const branches = [
  { flag: '🇪🇬', city: 'New Cairo', country: 'Egypt' },
  { flag: '🇸🇦', city: 'Riyadh', country: 'Saudi Arabia' },
  { flag: '🇳🇱', city: 'Luxembourg', country: 'Europe' },
];

const services = ['Design & Furniture', 'Styling'];

export default function BranchesSection() {
  return (
    <section className="py-24 px-6 bg-[#EFE8DA] relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">

        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4"
        >
          Our Presence
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-cormorant text-5xl md:text-6xl font-light text-[#3D2B1E] mb-4"
        >
          Our Branches
        </motion.h2>

        {/* Services tags */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 flex-wrap mb-12"
        >
          {services.map((s, i) => (
            <span key={i} className="font-inter text-xs tracking-widest uppercase bg-[#A05035]/10 border border-[#A05035]/30 text-[#A05035] px-4 py-1.5 rounded-full">
              {s}
            </span>
          ))}
        </motion.div>

        {/* Branches grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {branches.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/60 backdrop-blur-sm border border-[#E9DFC6] rounded-3xl p-8 flex flex-col items-center gap-4 hover:shadow-xl hover:shadow-[#A05035]/10 transition-shadow duration-300"
            >
              <span className="text-5xl">{b.flag}</span>
              <div className="flex items-center gap-2 text-[#A05035]">
                <MapPin size={16} />
                <span className="font-inter text-sm font-medium text-[#3D2B1E]">{b.city}</span>
              </div>
              <p className="font-inter text-xs tracking-widest uppercase text-[#B88D6A]">{b.country}</p>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-cormorant text-3xl md:text-4xl italic text-[#3D2B1E]"
        >
          Your Vision, Our Blueprint.
        </motion.p>
      </div>
    </section>
  );
}