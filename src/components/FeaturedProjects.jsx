import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const placeholders = [
  { id: 'p1', title: 'Desert Bloom Villa', category: 'Residential', location: 'New Cairo', cover_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80' },
  { id: 'p2', title: 'Terra Café', category: 'Commercial', location: 'Zamalek', cover_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' },
  { id: 'p3', title: 'Oasis Apartment', category: 'Residential', location: 'Maadi', cover_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80' },
];

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 80 : 0, index % 2 === 0 ? 0 : 80]);

  return (
    <motion.div ref={ref} style={{ y }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="group relative overflow-hidden rounded-3xl cursor-pointer"
      style={{ aspectRatio: index === 1 ? '3/4' : '4/5' }}>

      <motion.img
        src={project.cover_image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'}
        alt={project.title}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A110A]/90 via-[#1A110A]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <motion.div
          initial={false}
          className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="font-inter text-xs tracking-[0.25em] uppercase text-[#D4956A] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {project.category} · {project.location}
          </p>
          <h3 className="font-cormorant text-3xl font-semibold text-[#F5EFE6] leading-tight">{project.title}</h3>

          <motion.div
            className="mt-4 flex items-center gap-2 text-[#D4956A] opacity-0 group-hover:opacity-100 transition-all duration-500"
            initial={{ x: -10 }}
            whileHover={{ x: 0 }}>
            <span className="font-inter text-xs tracking-widest uppercase">View Project</span>
            <ArrowRight size={14} />
          </motion.div>
        </motion.div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#A05035]/0 group-hover:bg-[#A05035]/20 backdrop-blur-sm border border-[#A05035]/0 group-hover:border-[#A05035]/60 transition-all duration-500 flex items-center justify-center">
        <span className="text-[#D4956A] text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">✦</span>
      </div>
    </motion.div>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    base44.entities.Project.filter({ featured: true }, '-created_date', 6).then(data => {
      setProjects(data.length > 0 ? data : placeholders);
    }).catch(() => setProjects(placeholders));
  }, []);

  const displayed = projects.length > 0 ? projects : placeholders;

  return (
    <section className="py-32 px-6 bg-[#EFE8DA] relative overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#B88D6A]/20 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#B88D6A]/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4">Selected Work</motion.p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-cormorant text-6xl md:text-7xl font-light text-[#3D2B1E]">Featured Projects</motion.h2>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <Link to="/portfolio"
              className="group flex items-center gap-3 font-inter text-sm tracking-widest uppercase text-[#A05035] border-b border-[#A05035]/30 pb-1 hover:border-[#A05035] transition-all">
              View All Work
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ArrowRight size={16} />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Staggered masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {displayed.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}