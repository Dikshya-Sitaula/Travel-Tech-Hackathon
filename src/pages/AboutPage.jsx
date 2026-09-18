import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, SignalZero, Compass, ShieldAlert } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const AboutPage = () => {
  return (
    <div className="animate-fade-in">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero container">
          <h1 className="hero-title">Technology that travels with you.</h1>
          <p className="hero-subtitle">
            YatraX combines AI-powered trip planning, offline assistance, landmark discovery, and emergency support into one intelligent travel companion for Nepal.
          </p>
        </section>

        {/* Section 1 */}
        <section className="section section-bg">
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 className="section-title text-center" style={{ textAlign: 'center' }}>Why YatraX?</h2>
            <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              Travelers exploring unfamiliar destinations often need to search across multiple platforms for information about destinations, activities, routes, costs, and safety.
            </p>
            <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              In remote regions of Nepal, connectivity may also become unreliable.
            </p>
            <p style={{ fontSize: '1.125rem', fontWeight: 500, color: 'var(--color-dark-green)', textAlign: 'center' }}>
              YatraX brings these needs together into one unified platform.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section className="section container text-center" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="section-title">Our Mission</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 500, color: 'var(--color-primary-green)', lineHeight: 1.4 }}>
            "Make exploring Nepal smarter, more informed, and safer — even beyond reliable connectivity."
          </p>
        </section>

        {/* Section 3 */}
        <section className="section section-bg">
          <div className="container">
            <h2 className="section-title text-center" style={{ textAlign: 'center', marginBottom: '4rem' }}>What makes YatraX different?</h2>
            
            <div className="features-grid">
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <BrainCircuit color="var(--color-blue)" />
                  <h3 style={{ fontSize: '1.25rem' }}>AI-Powered</h3>
                </div>
                <p>Personalized recommendations and itinerary generation.</p>
              </Card>

              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <SignalZero color="var(--color-green)" />
                  <h3 style={{ fontSize: '1.25rem' }}>Offline-Ready</h3>
                </div>
                <p>Essential travel information remains accessible without internet.</p>
              </Card>

              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <Compass color="var(--color-orange)" />
                  <h3 style={{ fontSize: '1.25rem' }}>Discovery-Focused</h3>
                </div>
                <p>Help travelers discover less-crowded and local experiences.</p>
              </Card>

              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <ShieldAlert color="var(--color-red)" />
                  <h3 style={{ fontSize: '1.25rem' }}>Safety-Focused</h3>
                </div>
                <p>Emergency information and SOS functionality are built into the journey.</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="section container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Built for the Journey</h2>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '1rem',
            marginTop: '3rem',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-navy-light)'
          }}>
            <span>Plan</span>
            <ArrowRight size={20} color="var(--color-gray-400)" />
            <span>Prepare</span>
            <ArrowRight size={20} color="var(--color-gray-400)" />
            <span>Explore</span>
            <ArrowRight size={20} color="var(--color-gray-400)" />
            <span>Discover</span>
            <ArrowRight size={20} color="var(--color-gray-400)" />
            <span>Stay Safe</span>
          </div>
        </section>

        {/* Section 5 */}
        <section className="section section-bg">
          <div className="container">
            <h2 className="section-title text-center" style={{ textAlign: 'center', marginBottom: '4rem' }}>Built around real travel situations</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <Card>
                <h4 style={{ marginBottom: '0.5rem' }}>Planning before departure</h4>
                <p style={{ fontSize: '0.875rem' }}>Save hours of research by letting AI craft your itinerary.</p>
              </Card>
              <Card>
                <h4 style={{ marginBottom: '0.5rem' }}>Traveling with limited connectivity</h4>
                <p style={{ fontSize: '0.875rem' }}>Access your saved plans and chat offline.</p>
              </Card>
              <Card>
                <h4 style={{ marginBottom: '0.5rem' }}>Discovering an unfamiliar landmark</h4>
                <p style={{ fontSize: '0.875rem' }}>Point your camera to learn the history.</p>
              </Card>
              <Card>
                <h4 style={{ marginBottom: '0.5rem' }}>Needing emergency information</h4>
                <p style={{ fontSize: '0.875rem' }}>Quick access to local contacts and SOS queueing.</p>
              </Card>
            </div>

            <div style={{ textAlign: 'center', marginTop: '6rem' }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Ready to explore differently?</h3>
              <Link to="/signup">
                <Button size="lg" variant="primary">
                  Start Your Journey <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
