import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#2A1E14] text-[#E9DFC6] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <p className="font-cormorant text-2xl font-semibold text-[#F5EFE6] mb-1">Bohemian House</p>
          <p className="font-cormorant text-xs text-[#B88D6A]">Eco-Friendly Interior Design · Cairo, Egypt</p>
        </div>

        <div className="flex gap-8">
          {[['Home', '/'], ['Portfolio', '/portfolio'], ['Contact', '/#contact']].map(([label, path]) => (
            <Link key={path} to={path} className="font-cormorant text-xs tracking-widest uppercase text-[#B88D6A] hover:text-[#F5EFE6] transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <p className="font-cormorant text-xs text-[#7C563D]">© {new Date().getFullYear()} Bohemian House. All rights reserved.</p>
      </div>
    </footer>
  );
}