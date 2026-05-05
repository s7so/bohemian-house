import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';

function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, v => Math.round(v));
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(count, to, { duration: 2, ease: 'easeOut' });
    }
  }, [isInView]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

const stats = [
  { value: 120, suffix: '+', label: 'Projects Completed', sub: 'Across Egypt & GCC' },
  { value: 8, suffix: '+', label: 'Years of Experience', sub: 'Designing with soul' },
  { value: 98, suffix: '%', label: 'Client Satisfaction', sub: 'Speak for themselves' },
  { value: 100, suffix: '%', label: 'Eco Certified', sub: 'Sustainable always' },
];

export default function StatsSection() {
  return (
    <section className="py-24 px-6 bg-[#2A1E14] relative overflow-hidden">
      {/* Horizontal scrolling text */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden py-3 border-b border-[#3D2B1E]">
        <motion.div className="flex gap-12 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-cormorant text-sm italic text-[#7C563D]">
              Bohemian House · Eco Design · Cairo · Sustainable Spaces ·
            </span>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="text-center group">
              <div className="font-cormorant text-5xl md:text-6xl font-light text-[#D4956A] mb-2 group-hover:text-[#A05035] transition-colors duration-300">
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-inter text-sm font-medium text-[#F5EFE6] mb-1">{stat.label}</p>
              <p className="font-inter text-xs text-[#7C563D]">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}