import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const placeholders = [
  { id: 'p1', title: 'Desert Bloom Villa', category: 'Residential', location: 'New Cairo', cover_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80' },
  { id: 'p2', title: 'Terra Café', category: 'Commercial', location: 'Zamalek', cover_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80' },
  { id: 'p3', title: 'Oasis Apartment', category: 'Residential', location: 'Maadi', cover_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80' },
];

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    base44.entities.Project.filter({ featured: true }, '-created_date', 6).then(data => {
      setProjects(data.length > 0 ? data : placeholders);
    }).catch(() => setProjects(placeholders));
  }, []);

  const displayed = projects.length > 0 ? projects : placeholders;

  return (
    <section className="py-24 px-6 bg-[#EFE8DA]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4">Selected Work</p>
            <h2 className="font-cormorant text-5xl font-light text-[#3D2B1E]">Featured Projects</h2>
          </div>
          <Link to="/portfolio"
            className="flex items-center gap-2 font-inter text-sm tracking-widest uppercase text-[#A05035] hover:gap-4 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayed.map((project, i) => (
            <motion.div key={project.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
              <img
                src={project.cover_image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1E]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="font-inter text-xs tracking-[0.2em] uppercase text-[#B88D6A] mb-1">{project.category} · {project.location}</p>
                <h3 className="font-cormorant text-2xl font-semibold text-[#F5EFE6]">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}