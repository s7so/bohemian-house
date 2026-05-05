import { useEffect, useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const defaultServices = [
  { id: 'd1', title: 'Interior Design', description: 'Full interior design solutions combining bohemian aesthetics with sustainable materials and eco-certified products.', icon: '🪴' },
  { id: 'd2', title: 'Space Planning', description: 'Thoughtful space planning that maximizes flow, functionality, and natural harmony within your home or office.', icon: '📐' },
  { id: 'd3', title: 'Furniture Curation', description: 'Hand-selected pieces from local artisans and ethical brands that tell a story and stand the test of time.', icon: '🛋️' },
  { id: 'd4', title: 'Color Consultation', description: 'Earth-inspired palettes drawn from nature — terracotta, sage, sand, and clay — that breathe life into every space.', icon: '🎨' },
  { id: 'd5', title: 'Eco Certification', description: 'We guide you through sustainable material choices and help your space achieve the highest eco-design standards.', icon: '🌿' },
  { id: 'd6', title: 'Project Management', description: 'End-to-end project management from concept to completion, ensuring a smooth and stress-free experience.', icon: '✅' },
];

function TiltCard({ service, index }) {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      className="relative group cursor-default"
    >
      <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-[#E9DFC6] overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-[#A05035]/10">
        {/* Glow on hover */}
        <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(160,80,53,0.08) 0%, transparent 70%)' }} />

        {/* Top accent line */}
        <motion.div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-[#A05035] to-[#B88D6A] rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }} />

        {/* Icon with 3D lift */}
        <motion.div
          style={{ translateZ: 20 }}
          className="text-5xl mb-6 inline-block">
          {service.icon}
        </motion.div>

        <motion.h3 style={{ translateZ: 15 }}
          className="font-cormorant text-2xl font-semibold text-[#3D2B1E] mb-3 group-hover:text-[#A05035] transition-colors duration-300">
          {service.title}
        </motion.h3>

        <motion.p style={{ translateZ: 10 }}
          className="font-inter text-[#7C563D] text-sm leading-relaxed">
          {service.description}
        </motion.p>

        {/* Bottom arrow */}
        <motion.div className="mt-6 flex items-center gap-2 text-[#A05035] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
          <span className="font-inter text-xs tracking-widest uppercase">Learn More</span>
          <span>→</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    base44.entities.Service.list('order', 20).then(data => {
      setServices(data.length > 0 ? data : defaultServices);
    }).catch(() => setServices(defaultServices));
  }, []);

  const displayed = services.length > 0 ? services : defaultServices;

  return (
    <section className="py-32 px-6 bg-[#F5EFE6] relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, #E9DFC6 1px, transparent 1px), radial-gradient(circle at 80% 50%, #E9DFC6 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto relative">
        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4">What We Offer</motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-cormorant text-6xl font-light text-[#3D2B1E]">Our Services</motion.h2>
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-[#A05035] to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {displayed.map((service, i) => (
            <TiltCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}