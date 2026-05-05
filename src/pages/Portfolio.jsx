import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const placeholders = [
  { id: 'p1', title: 'Desert Bloom Villa', category: 'Residential', location: 'New Cairo', year: '2024', cover_image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80', description: 'A warm residential project blending earthy tones and natural materials.' },
  { id: 'p2', title: 'Terra Café', category: 'Commercial', location: 'Zamalek', year: '2024', cover_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', description: 'A cozy bohemian café with reclaimed wood and lush greenery.' },
  { id: 'p3', title: 'Oasis Apartment', category: 'Residential', location: 'Maadi', year: '2023', cover_image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80', description: 'An urban oasis with indoor plants and natural light design.' },
  { id: 'p4', title: 'Bamboo Office', category: 'Office', location: 'Downtown Cairo', year: '2023', cover_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', description: 'A biophilic office space promoting wellness and productivity.' },
  { id: 'p5', title: 'Sahel Beach House', category: 'Residential', location: 'North Coast', year: '2024', cover_image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', description: 'A breezy coastal retreat with natural textures and organic shapes.' },
  { id: 'p6', title: 'Clay Boutique Hotel', category: 'Hospitality', location: 'Siwa', year: '2023', cover_image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80', description: 'An earthy boutique hotel inspired by Siwa\'s traditional architecture.' },
];

const categories = ['All', 'Residential', 'Commercial', 'Hospitality', 'Office', 'Outdoor'];

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.Project.list('-created_date', 50).then(data => {
      setProjects(data.length > 0 ? data : placeholders);
    }).catch(() => setProjects(placeholders));
  }, []);

  const displayed = projects.length > 0 ? projects : placeholders;
  const filtered = filter === 'All' ? displayed : displayed.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-16 px-6 text-center bg-[#EFE8DA]">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4">Our Work</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-cormorant text-6xl font-light text-[#3D2B1E] mb-6">Portfolio</motion.h1>
        <p className="font-inter text-[#7C563D] max-w-xl mx-auto text-sm leading-relaxed">
          A curated collection of spaces we've brought to life — each one a unique story told through natural materials, bohemian spirit, and sustainable design.
        </p>
      </div>

      {/* Filter */}
      <div className="sticky top-20 z-30 bg-[#F5EFE6]/95 backdrop-blur-md border-b border-[#E9DFC6] px-6 py-4">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`font-inter text-xs tracking-widest uppercase px-5 py-2 rounded-full transition-all whitespace-nowrap flex-shrink-0 ${filter === cat ? 'bg-[#A05035] text-[#F5EFE6]' : 'border border-[#E9DFC6] text-[#7C563D] hover:border-[#A05035] hover:text-[#A05035]'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((project, i) => (
            <motion.div key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(project)}
              className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-pointer">
              <img
                src={project.cover_image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'}
                alt={project.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3D2B1E]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                <p className="font-inter text-xs tracking-[0.2em] uppercase text-[#B88D6A] mb-1">{project.category}{project.location ? ` · ${project.location}` : ''}</p>
                <h3 className="font-cormorant text-2xl font-semibold text-[#F5EFE6]">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-cormorant text-3xl text-[#B88D6A]">No projects in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-[#3D2B1E]/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#F5EFE6] rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selected.cover_image} alt={selected.title} className="w-full h-72 object-cover" />
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#3D2B1E]/60 text-white flex items-center justify-center text-lg hover:bg-[#3D2B1E]">✕</button>
            </div>
            <div className="p-8">
              <p className="font-inter text-xs tracking-[0.2em] uppercase text-[#A05035] mb-2">{selected.category}{selected.location ? ` · ${selected.location}` : ''}{selected.year ? ` · ${selected.year}` : ''}</p>
              <h2 className="font-cormorant text-4xl font-light text-[#3D2B1E] mb-4">{selected.title}</h2>
              {selected.description && <p className="font-inter text-sm text-[#7C563D] leading-relaxed">{selected.description}</p>}
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}