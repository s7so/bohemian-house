import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const defaults = [
  { id: 't1', client_name: 'Nour El Shamy', client_title: 'Homeowner, New Cairo', quote: 'Bohemian House transformed our apartment into a sanctuary. Every detail was thoughtfully chosen — we feel like we are living inside a forest.', rating: 5 },
  { id: 't2', client_name: 'Karim Mansour', client_title: 'Restaurant Owner, Zamalek', quote: 'The team understood our vision perfectly. Our café now has a warmth and soul that our customers absolutely love. Best investment we ever made.', rating: 5 },
  { id: 't3', client_name: 'Dina Fouad', client_title: 'Interior Enthusiast, Maadi', quote: 'Professional, creative, and deeply committed to sustainability. They sourced everything locally and the result is breathtaking.', rating: 5 },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    base44.entities.Testimonial.list('-created_date', 6).then(data => {
      setTestimonials(data.length > 0 ? data : defaults);
    }).catch(() => setTestimonials(defaults));
  }, []);

  const displayed = testimonials.length > 0 ? testimonials : defaults;

  return (
    <section className="py-24 px-6 bg-[#3D2B1E]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-[#B88D6A] mb-4">Kind Words</p>
          <h2 className="font-cormorant text-5xl font-light text-[#F5EFE6]">Client Stories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayed.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#4A3525] rounded-2xl p-8 border border-[#7C563D]/30">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating || 5 }).map((_, j) => (
                  <Star key={j} size={14} fill="#B88D6A" className="text-[#B88D6A]" />
                ))}
              </div>
              <p className="font-cormorant text-xl text-[#E9DFC6] leading-relaxed mb-8 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#A05035] flex items-center justify-center font-cormorant text-[#F5EFE6] text-lg font-semibold">
                  {t.client_name?.[0]}
                </div>
                <div>
                  <p className="font-inter text-sm font-medium text-[#F5EFE6]">{t.client_name}</p>
                  <p className="font-inter text-xs text-[#B88D6A]">{t.client_title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}