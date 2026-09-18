import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Bot, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const AboutPage = () => {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-soft-bg)' }}>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero container" style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center' }}>
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              backgroundColor: 'var(--color-light-mint)', 
              color: 'var(--color-dark-green)', 
              padding: '0.4rem 1.1rem', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              marginBottom: '1.5rem' 
            }}
          >
            <Sparkles size={16} color="var(--color-primary-green)" /> ABOUT YATRAX
          </div>
          <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1.25rem', color: 'var(--color-dark-text)' }}>
            Discover Nepal. Experience More.
          </h1>
          <p className="hero-subtitle" style={{ maxWidth: '750px', margin: '0 auto 2.5rem', fontSize: '1.25rem', color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
            YatraX is a smart Nepal tourism platform that helps tourists discover destinations, get travel and safety guidance, understand local culture, receive personalized recommendations, and interact with an AI travel assistant.
          </p>

          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: '360px', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
            <img 
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop" 
              alt="Himalayan Mountain Vista" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,59,46,0.8) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white', textAlign: 'left' }}>
              <span style={{ backgroundColor: 'var(--color-primary-green)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                Smart Travel Innovation
              </span>
              <h3 style={{ color: 'white', fontSize: '1.75rem', marginTop: '0.35rem' }}>Designed for Nepal's Unique Terrains</h3>
            </div>
          </div>
        </section>

        {/* Section 1: What is YatraX? */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            <h2 className="section-title text-center" style={{ textAlign: 'center', fontSize: '2.25rem', marginBottom: '1.5rem', color: 'var(--color-dark-green)' }}>
              What is YatraX?
            </h2>
            <p style={{ fontSize: '1.125rem', marginBottom: '1.25rem', lineHeight: 1.7, color: 'var(--color-dark-text)' }}>
              YatraX is an integrated digital tourism platform created specifically to enhance how travelers discover, prepare for, and navigate their journeys across Nepal.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-secondary-text)', lineHeight: 1.7 }}>
              Whether trekking high Himalayan passes, navigating ancient temple precincts in Kathmandu Valley, or embarking on jungle safaris in Terai, YatraX provides structured travel advice, cultural etiquette insights, safety guidelines, and interactive AI assistance in one seamless experience.
            </p>
          </div>
        </section>

        {/* Section 2: Our Mission */}
        <section className="section container text-center" style={{ textAlign: 'center', maxWidth: '850px', padding: '5rem 1.5rem' }}>
          <span style={{ color: 'var(--color-primary-green)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
            Our Purpose
          </span>
          <h2 className="section-title" style={{ fontSize: '2.25rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Our Mission
          </h2>
          <Card style={{ backgroundColor: 'var(--color-light-mint)', border: '1px solid var(--color-mint-green)', padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-dark-green)', lineHeight: 1.5, margin: 0 }}>
              "To make exploring Nepal smarter, safer, and deeply culturally enriching for travelers worldwide through accessible digital intelligence."
            </p>
          </Card>
        </section>

        {/* Section 3: Why We Built YatraX */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            <h2 className="section-title text-center" style={{ textAlign: 'center', fontSize: '2.25rem', marginBottom: '1.5rem', color: 'var(--color-dark-green)' }}>
              Why We Built YatraX
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-secondary-text)' }}>
              <p>
                Nepal is one of the world's most spectacular travel destinations, offering diverse topographies, rich indigenous cultures, and warm hospitality. However, travelers frequently face fragmented travel information, unpredictable mountain weather, altitude challenges, and remote connectivity limitations.
              </p>
              <p>
                We built YatraX to solve these pain points by consolidating destination intelligence, cultural norms, trekking prep tips, emergency guidelines, and AI chat assistance into a single unified platform.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: What We Offer */}
        <section className="section container" style={{ padding: '5rem 1.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
            <h2 className="section-title" style={{ fontSize: '2.25rem', color: 'var(--color-dark-text)' }}>
              What We Offer
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-secondary-text)' }}>
              Core features designed for a modern, confident Nepal journey.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            <Card style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>Smart Destination Discovery</h3>
              <p style={{ fontSize: '0.925rem' }}>In-depth travel intelligence on iconic regions, heritage sites, and hidden gems.</p>
            </Card>

            <Card style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>Safety & Trek Prep Guidance</h3>
              <p style={{ fontSize: '0.925rem' }}>Altitude safety advice, permit details, emergency contacts, and packing lists.</p>
            </Card>

            <Card style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Bot size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>AI Travel Companion</h3>
              <p style={{ fontSize: '0.925rem' }}>Interactive AI assistant delivering instant responses to your travel queries.</p>
            </Card>

            <Card style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <MapPin size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>Cultural Respect & Etiquette</h3>
              <p style={{ fontSize: '0.925rem' }}>Practical guidance on local customs, greetings, temple etiquette, and traditions.</p>
            </Card>
          </div>
        </section>

        {/* Section 5: Our Vision */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '850px', textAlign: 'center' }}>
            <h2 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '1.25rem', color: 'var(--color-dark-green)' }}>
              Our Vision
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-secondary-text)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              We envision a future where every traveler visiting Nepal can experience its breathtaking mountains, rich culture, and warm hospitality with confidence, safety, and cultural reverence.
            </p>

            <Link to="/signup">
              <Button size="lg" variant="primary" style={{ padding: '0.9rem 2.25rem', borderRadius: 'var(--radius-full)' }}>
                Start Your Journey With YatraX <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
