import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#2A1E14] text-[#E9DFC6] pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        {/* Logo with professional frame */}
        <div className="relative flex flex-col items-center">
          {/* Outer decorative ring */}
          <div className="relative p-1 rounded-full" style={{ background: 'linear-gradient(135deg, #A05035 0%, #7C563D 50%, #B88D6A 100%)' }}>
            <div className="rounded-full bg-[#2A1E14] p-1">
              <div className="rounded-full overflow-hidden w-36 h-36 flex items-center justify-center bg-[#1A110A]">
                <img
                  src="https://media.base44.com/images/public/69f970ba7a3f346d678d9612/c096bdc86_image.png"
                  alt="Bohemian House"
                  className="w-full h-full object-cover"
                  style={{ mixBlendMode: 'screen' }}
                />
              </div>
            </div>
          </div>
          {/* Glow beneath */}
          <div className="absolute bottom-0 w-24 h-4 rounded-full blur-xl" style={{ background: 'rgba(160,80,53,0.35)' }} />
        </div>

        {/* Brand name */}
        <div className="text-center">
          <p className="font-cormorant text-2xl font-light tracking-[0.2em] text-[#E9DFC6]">BOHEMIAN HOUSE</p>
          <p className="font-inter text-xs tracking-[0.3em] uppercase text-[#B88D6A] mt-1">Eco-Friendly Interior Design</p>
        </div>

        {/* Divider */}
        <div className="w-32 h-px" style={{ background: 'linear-gradient(to right, transparent, #A05035, transparent)' }} />

        {/* Links */}
        <div className="flex gap-10">
          {[['Home', '/'], ['Portfolio', '/portfolio'], ['Contact', '/#contact']].map(([label, path]) => (
            <Link key={path} to={path} className="font-inter text-xs tracking-widest uppercase text-[#B88D6A] hover:text-[#F5EFE6] transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <p className="font-inter text-xs text-[#5C3D2A]">© {new Date().getFullYear()} Bohemian House. All rights reserved.</p>
      </div>
    </footer>
  );
}