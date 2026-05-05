import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Contact', path: '/#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#F5EFE6]/95 backdrop-blur-md shadow-sm' : 'bg-gradient-to-b from-[#1A110A]/60 to-transparent md:bg-none md:from-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link to="/" className={`font-cormorant text-2xl font-semibold tracking-wide transition-colors ${scrolled ? 'text-[#3D2B1E]' : 'text-[#F5EFE6] md:text-[#3D2B1E]'}`}>
          Bohemian House
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(l => (
            <Link key={l.path} to={l.path}
              className={`font-inter text-sm tracking-widest uppercase transition-colors hover:text-[#A05035] ${location.pathname === l.path ? 'text-[#A05035]' : 'text-[#3D2B1E]'}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/#contact"
            className="font-inter text-sm tracking-widest uppercase bg-[#A05035] text-[#F5EFE6] px-6 py-2.5 rounded-full hover:bg-[#7C563D] transition-colors">
            Book a Consult
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className={`md:hidden transition-colors ${scrolled ? 'text-[#3D2B1E]' : 'text-[#F5EFE6]'}`} onClick={() => setDrawerOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#1A110A]/50 z-40 md:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="fixed top-0 right-0 h-full w-72 bg-[#F5EFE6] z-50 shadow-2xl flex flex-col md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E9DFC6]">
                <span className="font-cormorant text-xl font-semibold text-[#3D2B1E]">Bohemian House</span>
                <button onClick={() => setDrawerOpen(false)} className="text-[#3D2B1E] hover:text-[#A05035] transition-colors">
                  <X size={22} />
                </button>
              </div>
              {/* Links */}
              <div className="flex flex-col gap-1 px-4 py-6 flex-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link to={l.path} onClick={() => setDrawerOpen(false)}
                      className={`block font-inter text-sm tracking-widest uppercase py-3 px-4 rounded-xl transition-colors hover:bg-[#E9DFC6] hover:text-[#A05035] ${
                        location.pathname === l.path ? 'text-[#A05035] bg-[#E9DFC6]' : 'text-[#3D2B1E]'
                      }`}>
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              {/* CTA */}
              <div className="px-6 py-6 border-t border-[#E9DFC6]">
                <Link to="/#contact" onClick={() => setDrawerOpen(false)}
                  className="block font-inter text-sm tracking-widest uppercase bg-[#A05035] text-[#F5EFE6] px-6 py-3 rounded-full text-center hover:bg-[#7C563D] transition-colors">
                  Book a Consult
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}