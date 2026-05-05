import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowDown } from 'lucide-react';

const images = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1800&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1800&q=80',
  'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1800&q=80',
];

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const rotateY = useTransform(springX, [-15, 15], [-3, 3]);

  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setImgIndex(i => (i + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(((clientX - left) / width - 0.5) * 30);
    mouseY.set(((clientY - top) / height - 0.5) * 20);
  };

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#1A110A]" onMouseMove={handleMouseMove}>

      {/* Parallax BG images */}
      {images.map((src, i) => (
        <motion.div key={i} className="absolute inset-0"
          animate={{ opacity: i === imgIndex ? 1 : 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}>
          <motion.img src={src} alt="" className="w-full h-full object-cover"
            style={{ y, scale, x: springX, rotateY }} />
        </motion.div>
      ))}

      {/* Deep overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A110A]/30 via-[#1A110A]/20 to-[#1A110A]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A110A]/60 via-transparent to-[#1A110A]/30" />

      {/* Floating orbs */}
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#A05035]/10 blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#737B4C]/10 blur-3xl pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Main content */}
      <motion.div style={{ opacity }} className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8 inline-flex items-center gap-2 border border-[#A05035]/40 bg-[#A05035]/10 backdrop-blur-sm text-[#D4956A] px-5 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A05035] animate-pulse" />
          <span className="font-inter text-xs tracking-[0.3em] uppercase">Eco-Friendly Interior Design · Cairo</span>
        </motion.div>

        {/* Headline */}
        <div className="mb-6 overflow-hidden">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair text-6xl md:text-8xl lg:text-9xl font-semibold text-[#F5EFE6] leading-none">
            Where Nature
          </motion.h1>
        </div>
        <div className="mb-10 overflow-hidden">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-playfair text-6xl md:text-8xl lg:text-9xl font-semibold italic text-[#D4956A] leading-none">
            Meets Design
          </motion.h1>
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="font-inter text-base md:text-lg text-[#C4A882] max-w-lg mx-auto mb-12 font-light leading-relaxed">
          Sustainable bohemian spaces inspired by nature — earthy materials, organic forms, timeless elegance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to="/portfolio"
            className="relative group font-inter text-sm tracking-widest uppercase bg-[#A05035] text-[#F5EFE6] px-10 py-4 rounded-full overflow-hidden">
            <span className="relative z-10">View Our Work</span>
            <motion.div className="absolute inset-0 bg-[#7C563D]"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }} />
          </Link>
          <a href="#contact"
            className="font-inter text-sm tracking-widest uppercase border border-[#F5EFE6]/30 text-[#F5EFE6] px-10 py-4 rounded-full hover:bg-[#F5EFE6]/10 backdrop-blur-sm transition-all duration-300">
            Book a Consult
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
          className="mt-20 flex gap-12 md:gap-20">
          {[['120+', 'Projects'], ['8+', 'Years'], ['100%', 'Eco-Certified']].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="font-cormorant text-3xl md:text-4xl font-semibold text-[#D4956A]">{num}</p>
              <p className="font-inter text-xs tracking-widest uppercase text-[#C4A882]/70 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Image indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <button key={i} onClick={() => setImgIndex(i)}
            className={`transition-all duration-500 rounded-full ${i === imgIndex ? 'w-8 h-1.5 bg-[#A05035]' : 'w-1.5 h-1.5 bg-white/30'}`} />
        ))}
      </div>

      {/* Scroll arrow */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-[#A05035]">
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}