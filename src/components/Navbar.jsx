import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#F5EFE6]/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center">
          <img
            src="https://media.base44.com/images/public/69f970ba7a3f346d678d9612/c096bdc86_image.png"
            alt="Bohemian House"
            className="h-14 w-auto object-contain"
            style={{ mixBlendMode: 'multiply' }}
          />
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

        {/* Mobile menu */}
        <button className="md:hidden text-[#3D2B1E]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#F5EFE6]/98 backdrop-blur-md border-t border-[#E9DFC6] px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <Link key={l.path} to={l.path} onClick={() => setMenuOpen(false)}
              className="font-inter text-sm tracking-widest uppercase text-[#3D2B1E] hover:text-[#A05035]">
              {l.label}
            </Link>
          ))}
          <Link to="/#contact" onClick={() => setMenuOpen(false)}
            className="font-inter text-sm tracking-widest uppercase bg-[#A05035] text-[#F5EFE6] px-6 py-2.5 rounded-full text-center hover:bg-[#7C563D] transition-colors">
            Book a Consult
          </Link>
        </div>
      )}
    </nav>
  );
}