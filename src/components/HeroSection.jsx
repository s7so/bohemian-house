import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const heroBg = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=80';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F5EFE6]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Bohemian interior" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5EFE6]/60 via-transparent to-[#F5EFE6]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="font-inter text-xs tracking-[0.3em] uppercase text-[#A05035] mb-6">
          Eco-Friendly Interior Design · Cairo
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="font-cormorant text-6xl md:text-8xl font-light text-[#3D2B1E] leading-tight mb-6">
          Where Nature <br />
          <em className="italic text-[#A05035]">Meets Design</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="font-inter text-lg text-[#7C563D] max-w-xl mx-auto mb-12 font-light leading-relaxed">
          We create sustainable bohemian spaces inspired by nature — blending earthy materials, organic forms, and timeless elegance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/portfolio"
            className="font-inter text-sm tracking-widest uppercase bg-[#A05035] text-[#F5EFE6] px-10 py-4 rounded-full hover:bg-[#7C563D] transition-all duration-300 hover:shadow-lg">
            View Our Work
          </Link>
          <a href="#contact"
            className="font-inter text-sm tracking-widest uppercase border border-[#A05035] text-[#A05035] px-10 py-4 rounded-full hover:bg-[#A05035] hover:text-[#F5EFE6] transition-all duration-300">
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#A05035]">
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}