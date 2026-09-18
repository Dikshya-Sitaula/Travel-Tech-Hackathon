import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Map, SignalZero, Camera, ShieldAlert } from 'lucide-react';
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
          <h1 className="hero-title">
            Explore Nepal.<br />
            <span className="highlight-text">Travel Smarter.</span> Stay Safer.
          </h1>
          <p className="hero-subtitle">
            Your AI-powered travel companion for personalized journeys, hidden gems, offline assistance, landmark discovery, and emergency support.
          </p>
          <div className="hero-actions">
            <Link to="/signup">
              <Button size="lg" variant="primary">
                Start Planning <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Explore TrekSafe
              </Button>
            </Link>
          </div>

          <div className="hero-visual">
            <div className="hero-image" style={{ background: 'linear-gradient(135deg, #2D4C73, #2D7D46)' }}>
              {/* Placeholder for beautiful Nepal mountain image */}
            </div>
            
            <Card className="hero-floating-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-blue)', textTransform: 'uppercase' }}>
                  AI Travel Assistant
                </span>
                <Badge variant="green">Journey ready</Badge>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                <MapPin size={16} color="var(--color-orange)" /> Pokhara, Nepal
              </div>
              <div style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                5 Days • Adventure + Nature
              </div>
              
              <div style={{ fontSize: '0.875rem', color: 'var(--color-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>✓</span> Offline information saved
              </div>
            </Card>
          </div>
        </section>

        <div className="trust-strip">
          Plan • Explore • Discover • Stay Safe
        </div>

        {/* Problem Section */}
        <section className="section section-bg">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Travel shouldn't become harder when the signal disappears.</h2>
              <p>
                Travelers face fragmented travel information, unreliable connectivity, difficulty discovering less-crowded destinations, and uncertainty during emergencies.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="section container">
          <div className="section-header">
            <h2 className="section-title">One intelligent companion for the entire journey.</h2>
          </div>

          <div className="features-grid">
            <Card className="feature-card">
              <div className="feature-icon-wrapper"><Map size={24} /></div>
              <h3>AI Trip Planner</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Create personalized day-by-day journeys based on your preferences, budget, interests, and travel style.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-green-light)', color: 'white' }}>
                <SignalZero size={24} />
              </div>
              <h3>Offline AI Assistant</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Get essential travel guidance even when connectivity is limited.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-orange-light)', color: 'white' }}>
                <Camera size={24} />
              </div>
              <h3>Landmark Explorer</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Identify landmarks through your camera and discover their stories.
              </p>
            </Card>

            <Card className="feature-card">
              <div className="feature-icon-wrapper" style={{ backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)' }}>
                <ShieldAlert size={24} />
              </div>
              <h3>SOS & Emergency</h3>
              <p style={{ marginTop: '0.5rem' }}>
                Access emergency information and prepare an SOS request when help is needed.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section section-bg text-center" style={{ textAlign: 'center' }}>
          <div className="container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Your next adventure starts here.</h2>
            <Link to="/signup">
              <Button size="lg" variant="primary">
                Start Planning <ArrowRight size={18} />
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
