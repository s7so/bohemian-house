import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import FeaturedProjects from '../components/FeaturedProjects';
import VideosSection from '../components/VideosSection';

import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import ConsultationBookingForm from '../components/ConsultationBookingForm';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <FeaturedProjects />
      <VideosSection />
      <StatsSection />
      <TestimonialsSection />

      <ConsultationBookingForm />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}