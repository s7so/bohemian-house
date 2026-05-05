import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const defaults = [
  { id: 't1', client_name: 'Nour El Shamy', client_title: 'Homeowner, New Cairo', quote: 'Bohemian House transformed our apartment into a sanctuary. Every detail was thoughtfully chosen — we feel like we are living inside a forest.', rating: 5 },
  { id: 't2', client_name: 'Karim Mansour', client_title: 'Restaurant Owner, Zamalek', quote: 'The team understood our vision perfectly. Our café now has a warmth and soul that our customers absolutely love. Best investment we ever made.', rating: 5 },
  { id: 't3', client_name: 'Dina Fouad', client_title: 'Interior Enthusiast, Maadi', quote: 'Professional, creative, and deeply committed to sustainability. They sourced everything locally and the result is breathtaking.', rating: 5 },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    base44.entities.Testimonial.list('-created_date', 10).then(data => {
      setTestimonials(data.length > 0 ? data : defaults);
    }).catch(() => setTestimonials(defaults));
  }, []);

  const displayed = testimonials.length > 0 ? testimonials : defaults;

  const go = (dir) => {
    setDirection(dir);
    setCurrent(i => (i + dir + displayed.length) % displayed.length);
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0, scale: 0.95 }),
  };

  return (
    <section className="py-32 px-6 bg-[#3D2B1E] relative overflow-hidden">
      {/* Animated background */}
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(160,80,53,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(115,123,76,0.08) 0%, transparent 60%)' }}
      />

      {/* Large decorative quote */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 font-cormorant text-[20rem] text-[#F5EFE6]/3 leading-none pointer-events-none select-none">"</div>

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-inter text-xs tracking-[0.3em] uppercase text-[#B88D6A] mb-4">Kind Words</motion.p>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-cormorant text-6xl font-light text-[#F5EFE6]">Client Stories</motion.h2>
        </div>

        {/* Testimonial slider */}
        <div className="relative min-h-[280px] flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col items-center text-center px-8">

              {/* Stars */}
              <div className="flex gap-1.5 mb-8">
                {Array.from({ length: displayed[current]?.rating || 5 }).map((_, j) => (
                  <motion.div key={j} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: j * 0.1 }}>
                    <Star size={16} fill="#D4956A" className="text-[#D4956A]" />
                  </motion.div>
                ))}
              </div>

              {/* Quote */}
              <p className="font-cormorant text-2xl md:text-3xl text-[#E9DFC6] leading-relaxed italic mb-10">
                "{displayed[current]?.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A05035] to-[#7C563D] flex items-center justify-center font-cormorant text-xl font-semibold text-[#F5EFE6]">
                  {displayed[current]?.client_name?.[0]}
                </div>
                <div className="text-left">
                  <p className="font-inter text-sm font-medium text-[#F5EFE6]">{displayed[current]?.client_name}</p>
                  <p className="font-inter text-xs text-[#B88D6A]">{displayed[current]?.client_title}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button onClick={() => go(-1)}
            className="w-10 h-10 rounded-full border border-[#7C563D] text-[#B88D6A] hover:bg-[#A05035] hover:border-[#A05035] hover:text-white transition-all duration-300 flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {displayed.map((_, i) => (
              <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`transition-all duration-400 rounded-full ${i === current ? 'w-6 h-1.5 bg-[#A05035]' : 'w-1.5 h-1.5 bg-[#7C563D]'}`} />
            ))}
          </div>
          <button onClick={() => go(1)}
            className="w-10 h-10 rounded-full border border-[#7C563D] text-[#B88D6A] hover:bg-[#A05035] hover:border-[#A05035] hover:text-white transition-all duration-300 flex items-center justify-center">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}