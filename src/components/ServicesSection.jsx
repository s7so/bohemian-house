import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const defaultServices = [
  { id: 'd1', title: 'Interior Design', description: 'Full interior design solutions combining bohemian aesthetics with sustainable materials and eco-certified products.', icon: '🪴' },
  { id: 'd2', title: 'Space Planning', description: 'Thoughtful space planning that maximizes flow, functionality, and natural harmony within your home or office.', icon: '📐' },
  { id: 'd3', title: 'Furniture Curation', description: 'Hand-selected pieces from local artisans and ethical brands that tell a story and stand the test of time.', icon: '🛋️' },
  { id: 'd4', title: 'Color Consultation', description: 'Earth-inspired palettes drawn from nature — terracotta, sage, sand, and clay — that breathe life into every space.', icon: '🎨' },
  { id: 'd5', title: 'Eco Certification', description: 'We guide you through sustainable material choices and help your space achieve the highest eco-design standards.', icon: '🌿' },
  { id: 'd6', title: 'Project Management', description: 'End-to-end project management from concept to completion, ensuring a smooth and stress-free experience.', icon: '✅' },
];

export default function ServicesSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    base44.entities.Service.list('order', 20).then(data => {
      setServices(data.length > 0 ? data : defaultServices);
    }).catch(() => setServices(defaultServices));
  }, []);

  const displayed = services.length > 0 ? services : defaultServices;

  return (
    <section className="py-24 px-6 bg-[#F5EFE6]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-4">What We Offer</p>
          <h2 className="font-cormorant text-5xl font-light text-[#3D2B1E]">Our Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayed.map((service, i) => (
            <motion.div key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-[#E9DFC6] hover:shadow-lg hover:border-[#B88D6A] transition-all duration-300 group">
              <div className="text-4xl mb-5">{service.icon}</div>
              <h3 className="font-cormorant text-2xl font-semibold text-[#3D2B1E] mb-3 group-hover:text-[#A05035] transition-colors">{service.title}</h3>
              <p className="font-inter text-[#7C563D] text-sm leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}