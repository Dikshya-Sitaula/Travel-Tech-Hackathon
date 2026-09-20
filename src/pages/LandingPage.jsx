import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CalendarDays, ChevronRight, Compass, Map, MapPin, ShieldCheck, Users, WifiOff } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import '../styles/landing.css';

const benefits = [
  { icon: Bot, title: 'AI itineraries', copy: 'Personalised routes shaped around your time, pace, interests, and budget.' },
  { icon: Compass, title: 'Local discovery', copy: 'Find authentic places and useful local context beyond the usual guidebooks.' },
  { icon: ShieldCheck, title: 'Safety first', copy: 'Keep practical travel advice and emergency information close at hand.' },
  { icon: WifiOff, title: 'Offline ready', copy: 'Carry your itinerary and key trip details even when the signal disappears.' },
];

const LandingPage = () => (
  <div className="landing-page">
    <Navbar />
    <main>
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <h1>Nepal, planned around <em>you.</em></h1>
          <p>Smarter travel planning, deeper local experiences, and a safer journey — all in one place.</p>
          <div className="landing-hero-actions">
            <Link className="landing-primary-action" to="/signup">Plan my trip <ArrowRight size={18} /></Link>
            <Link className="landing-text-link" to="/signup">Explore destinations</Link>
          </div>
          <div className="landing-promise" aria-label="YatraX promise"><Map size={32} strokeWidth={1.5} /><span>Same places.<br /><strong>A deeper journey.</strong></span></div>
        </div>
        <div className="landing-hero-media">
          <img src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=90&w=1800&auto=format&fit=crop" alt="The Annapurna mountain range" />
          <div className="landing-planner-card">
            <h2>Plan your trip</h2>
            <div className="landing-planner-row"><MapPin size={18} /><span><small>Destination</small>Annapurna Region, Nepal</span><ChevronRight size={17} /></div>
            <div className="landing-planner-row"><CalendarDays size={18} /><span><small>Travel dates</small>Choose your dates</span><ChevronRight size={17} /></div>
            <div className="landing-planner-row"><Users size={18} /><span><small>Travellers</small>2 people</span><ChevronRight size={17} /></div>
            <Link to="/signup" className="landing-planner-button">Create my itinerary <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="landing-benefits container" aria-labelledby="benefits-title">
        <div className="landing-section-intro">
          <h2 id="benefits-title">A smarter way to experience Nepal</h2>
          <p>YatraX combines intelligent planning, trusted local insight, and practical safety tools so every journey feels considered.</p>
        </div>
        <div className="landing-benefit-list">
          {benefits.map(({ icon: Icon, title, copy }) => <article className="landing-benefit" key={title}><div className="landing-benefit-icon"><Icon size={23} strokeWidth={1.8} /></div><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="landing-cta"><div className="container landing-cta-inner"><h2>Your Nepal journey<br />starts here.</h2><div><p>Turn your travel ideas into a personalised plan with AI and local knowledge.</p><Link to="/signup">Plan my trip <ArrowRight size={18} /></Link></div></div></section>
    </main>
    <Footer />
  </div>
);

export default LandingPage;
