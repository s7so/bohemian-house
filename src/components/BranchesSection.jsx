import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const branches = [
  { city: 'New Cairo', country: 'Egypt', flag: '🇪🇬', services: ['Design & Furniture', 'Styling'] },
  { city: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', services: ['Design & Furniture', 'Styling'] },
  { city: 'Luxembourg', country: 'Luxembourg', flag: '🇱🇺', services: ['Design & Furniture', 'Styling'] },
];

export default function BranchesSection() {
  return (
    <section className="py-24 px-6 bg-[#EFE8DA] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4"
          >
            Where to Find Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-6xl font-light text-[#3D2B1E] mb-4"
          >
            Our Branches
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-cormorant text-xl italic text-[#A05035]"
          >
            Your Vision, Our Blueprint.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-[#A05035] to-transparent"
          />
        </div>

        {/* Branches grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-[#E9DFC6] hover:shadow-xl hover:shadow-[#A05035]/10 transition-all duration-500 group"
            >
              {/* Flag & location */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{branch.flag}</span>
                <div>
                  <p className="font-cormorant text-2xl font-semibold text-[#3D2B1E] group-hover:text-[#A05035] transition-colors duration-300">
                    {branch.city}
                  </p>
                  <p className="font-inter text-xs text-[#B88D6A] tracking-wide">{branch.country}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-[#E9DFC6] mb-6" />

              {/* Services */}
              <div className="space-y-3">
                {branch.services.map((service) => (
                  <div key={service} className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#A05035] flex-shrink-0" />
                    <span className="font-inter text-sm text-[#7C563D]">{service}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}