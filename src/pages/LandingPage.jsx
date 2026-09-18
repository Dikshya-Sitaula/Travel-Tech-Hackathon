import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Map, SignalZero, Camera, ShieldAlert, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page animate-fade-in">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero container">
          <div style={{ textTransform: 'uppercase', tracking: '0.1em', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-primary-green)', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-light-mint)', padding: '0.35rem 1rem', borderRadius: '20px' }}>
            <Sparkles size={14} /> YOUR AI TRAVEL COMPANION
          </div>
          <h1 className="hero-title">
            Explore Nepal, Your Way.
          </h1>
          <p className="hero-subtitle">
            Plan your journey, discover amazing places, and stay safe with an AI-powered travel companion built for Nepal.
          </p>
          <div className="hero-actions">
            <Link to="/signup">
              <Button size="lg" variant="primary">
                Plan My Trip <ArrowRight size={18} />
              </Button>
            </Link>
            <a href="#explore">
              <Button size="lg" variant="outline">
                Explore Nepal
              </Button>
            </a>
          </div>

          <div className="hero-visual">
            <div className="hero-image" style={{ background: 'linear-gradient(135deg, var(--color-dark-green), var(--color-primary-green))', position: 'relative', overflow: 'hidden' }}>
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop" 
                alt="Nepal Mountains" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
              />
            </div>
            
            <Card className="hero-floating-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-green)', textTransform: 'uppercase' }}>
                  YatraX Trip Planner
                </span>
                <Badge variant="green">Journey ready</Badge>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                <MapPin size={16} color="var(--color-golden-yellow)" /> Pokhara, Nepal
              </div>
              <div style={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                5 Days • Adventure + Nature
              </div>
              
              <div style={{ fontSize: '0.875rem', color: 'var(--color-primary-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✓</span> Offline AI assistance saved
              </div>
            </Card>
          </div>
        </section>

        <div className="trust-strip">
          Plan • Explore • Discover • Travel Safely
        </div>

        {/* Feature Section */}
        <section id="features" className="section container">
          <div className="section-header">
            <h2 className="section-title">One intelligent companion for your entire journey.</h2>
            <p>Smart tools built specifically to elevate your experience across Nepal.</p>
          </div>

          <div className="features-grid">
            <Card className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)' }}>
                <Map size={24} />
              </div>
              <h3>AI Trip Planner</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Create personalized day-by-day journeys based on your travel style, pace, budget, and hidden gem preferences.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)' }}>
                <SignalZero size={24} />
              </div>
              <h3>Offline AI Assistant</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Get essential travel guidance, packing advice, and local tips even when connectivity disappears in remote areas.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)' }}>
                <Camera size={24} />
              </div>
              <h3>Landmark Scanner</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Identify Nepalese stupas, temples, and historical landmarks instantly with instant cultural and historical context.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)' }}>
                <ShieldAlert size={24} />
              </div>
              <h3>Emergency SOS</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Quickly request assistance, prepare emergency broadcasts, and access offline emergency numbers whenever help is needed.
              </p>
            </Card>
          </div>
        </section>

        {/* Discover Nepal Section */}
        <section id="explore" className="section section-bg">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Discover Nepal</h2>
              <p>Explore the diverse landscapes and rich culture across Nepal's iconic destinations.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[
                { name: 'Pokhara', tag: 'Lakes & Peaks', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop' },
                { name: 'Kathmandu', tag: 'Culture & Heritage', img: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=600&auto=format&fit=crop' },
                { name: 'Chitwan', tag: 'Wildlife & Nature', img: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=600&auto=format&fit=crop' },
                { name: 'Mustang', tag: 'High Desert & Himalayas', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600&auto=format&fit=crop' },
              ].map((item) => (
                <Card key={item.name} style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ height: '180px', position: 'relative' }}>
                    <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,91,76,0.8), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: 'white' }}>
                      <h3 style={{ color: 'white', fontSize: '1.25rem' }}>{item.name}</h3>
                      <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{item.tag}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p>Three simple steps to your dream trip to Nepal.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
                1
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Plan</h3>
              <p>Set your destination, dates, budget, travel style, and interests in the AI planner.</p>
            </Card>

            <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
                2
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Explore</h3>
              <p>Follow your custom itinerary, scan landmarks on the spot, and chat with your AI assistant.</p>
            </Card>

            <Card style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ width: '3.5rem', height: '3.5rem', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontWeight: 700, fontSize: '1.25rem' }}>
                3
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Travel Safely</h3>
              <p>Keep offline backups of your trip and emergency contacts ready for complete peace of mind.</p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section section-bg text-center" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--color-light-mint), var(--color-very-light-bg))' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>Ready to Explore Nepal?</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Your next adventure starts with YatraX.</p>
            <Link to="/signup">
              <Button size="lg" variant="primary">
                Plan My Trip <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
