import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { Users, Briefcase, MessageSquare } from 'lucide-react';

import plumberImg from '../assets/master-plumber.jpg';
import electricianImg from '../assets/electrician-facts.jpg';
import laundryImg from '../assets/laundry.png';

const LandingPage = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section id="hero" className="relative flex-1 flex items-center justify-center bg-gray-50 overflow-hidden py-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={plumberImg} 
            alt="Home Services" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/90" />
        </div>
        <div className="container relative z-10 px-4 md:px-6 text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900"
          >
            Connecting Your Home to the <span className="text-primary">Services It Needs</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-[700px] mx-auto text-lg text-gray-600"
          >
            The ultimate society management platform for residents and local service providers.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-white">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button onClick={scrollToFeatures} variant="outline" size="lg" className="px-8 py-6 text-lg bg-white text-primary border-primary hover:bg-gray-50">
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-[800px] mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">About HomeNexus</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              HomeNexus was built with a simple vision: to make everyday life inside residential societies easier. 
              We noticed how difficult it was for residents to find trusted local help, and equally hard for local 
              service providers to reach the people right next door. By bridging this gap, HomeNexus creates a 
              tighter, more efficient community where help is always just a click away.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Why HomeNexus?</h2>
            <p className="mt-4 text-gray-500">Everything you need to manage your society services.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Residents</h3>
              <p className="text-gray-600">Find verified plumbers, electricians, and more with one click.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Providers</h3>
              <p className="text-gray-600">Grow your local business and manage your bookings efficiently.</p>
            </div>
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Communicate instantly to coordinate service times and details.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Our Popular Services</h2>
            <p className="mt-4 text-gray-500">Trusted professionals right in your neighborhood.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
              <div className="overflow-hidden aspect-video">
                <img src={plumberImg} alt="Plumbing" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold">Expert Plumbing</h3>
                <p className="text-gray-500 text-sm mt-2">Fast, reliable leak fixes and pipe installations.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
              <div className="overflow-hidden aspect-video">
                <img src={electricianImg} alt="Electrical" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold">Electrical Repair</h3>
                <p className="text-gray-500 text-sm mt-2">Safe and certified home wiring and appliance repair.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 group cursor-pointer">
              <div className="overflow-hidden aspect-video">
                <img src={laundryImg} alt="Laundry" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold">Laundry & Ironing</h3>
                <p className="text-gray-500 text-sm mt-2">Fresh clothes delivered right to your door.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
