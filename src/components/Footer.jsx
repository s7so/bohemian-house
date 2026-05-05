import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#2A1E14] text-[#E9DFC6] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <img src="https://media.base44.com/images/public/69f970ba7a3f346d678d9612/c096bdc86_image.png" alt="Bohemian House" className="h-20 w-auto object-contain brightness-[10] opacity-90" />
        </div>

        <div className="flex gap-8">
          {[['Home', '/'], ['Portfolio', '/portfolio'], ['Contact', '/#contact']].map(([label, path]) => (
            <Link key={path} to={path} className="font-inter text-xs tracking-widest uppercase text-[#B88D6A] hover:text-[#F5EFE6] transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <p className="font-inter text-xs text-[#7C563D]">© {new Date().getFullYear()} Bohemian House. All rights reserved.</p>
      </div>
    </footer>
  );
}