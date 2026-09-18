import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Bot, 
  Heart, 
  Sliders, 
  Sparkles, 
  CheckCircle2,
  BookOpen,
  Info,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DestinationModal } from '../components/ui/DestinationModal';
import { AIChatWidget } from '../components/ui/AIChatWidget';
import { useAuth } from '../context/AuthContext';

const destinationsList = [
  {
    id: 'kathmandu',
    name: 'Kathmandu',
    tagline: 'Cultural Heritage & Living History',
    region: 'Bagmati Province',
    bestTime: 'Oct - Apr',
    vibe: 'Historical & Spiritual',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=800&auto=format&fit=crop',
    description: 'The vibrant capital city of Nepal, Kathmandu is an open-air museum of ancient temples, bustling narrow alleys, historic Durbar Squares, and iconic stupas like Swayambhunath and Boudhanath.',
    whyVisit: 'Experience centuries of Newari craftsmanship, authentic street foods like Momos and Dal Bhat, and seven UNESCO World Heritage sites within a single valley.',
    attractions: [
      'Boudhanath Stupa',
      'Swayambhunath (Monkey Temple)',
      'Kathmandu Durbar Square',
      'Pashupatinath Temple',
      'Thamel Shopping Alleys'
    ]
  },
  {
    id: 'pokhara',
    name: 'Pokhara',
    tagline: 'Lake City & Himalayan Gateway',
    region: 'Gandaki Province',
    bestTime: 'Sep - May',
    vibe: 'Nature & Adventure',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    description: 'Surrounded by the majestic Annapurna mountain range, Pokhara offers serene lake vistas, adventure sports, and scenic tranquility. It is the premier launching pad for Himalayan treks.',
    whyVisit: 'Soak in the reflection of Machhapuchhre (Fishtail) peak on Phewa Lake, go paragliding, or relax at lakeside cafes after high-altitude treks.',
    attractions: [
      'Phewa Lake & Tal Barahi Temple',
      'Sarangkot Sunrise Viewpoint',
      'World Peace Pagoda',
      'Davis Falls & Gupteshwor Cave',
      'International Mountain Museum'
    ]
  },
  {
    id: 'everest',
    name: 'Everest Region',
    tagline: 'Roof of the World & Sherpa Culture',
    region: 'Solukhumbu District',
    bestTime: 'Mar-May / Sep-Nov',
    vibe: 'Trekking & High Altitude',
    image: 'https://images.unsplash.com/photo-1518002171953-a0847b1f6492?q=80&w=800&auto=format&fit=crop',
    description: 'Home to Mount Everest (8,848.86m), Khumbu is legendary for high-altitude trekking, ancient Buddhist monasteries, Sherpa villages, and breathtaking glacier landscapes.',
    whyVisit: 'Walk among the highest peaks on Earth, witness the Tengboche Monastery ceremony, and experience Sherpa mountain hospitality.',
    attractions: [
      'Everest Base Camp (5,364m)',
      'Kala Patthar Viewpoint',
      'Namche Bazaar (Sherpa Capital)',
      'Tengboche Monastery',
      'Gokyo Lakes & Gokyo Ri'
    ]
  },
  {
    id: 'annapurna',
    name: 'Annapurna Region',
    tagline: 'World-Class Alpine Trails & Valleys',
    region: 'Central Nepal',
    bestTime: 'Oct-Nov / Mar-Apr',
    vibe: 'Scenic Trekking & Villages',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    description: 'Consistently ranked among top global trekking destinations, the Annapurna region features dramatic landscape contrasts from subtropical forests to arid high-altitude deserts.',
    whyVisit: 'Hike through rhododendron forests in spring, marvel at the Annapurna Sanctuary, and watch dawn break over Poon Hill.',
    attractions: [
      'Annapurna Base Camp (ABC)',
      'Poon Hill Sunrise Hike',
      'Annapurna Circuit & Thorong La Pass',
      'Ghandruk Gurung Cultural Village',
      'Tatopani Natural Hot Springs'
    ]
  },
  {
    id: 'chitwan',
    name: 'Chitwan',
    tagline: 'Subtropical Jungle Safari & Wildlife',
    region: 'Terai Lowlands',
    bestTime: 'Oct - Mar',
    vibe: 'Wildlife & Tharu Culture',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?q=80&w=800&auto=format&fit=crop',
    description: 'Chitwan National Park is Nepal’s premier wildlife sanctuary, protecting endangered one-horned rhinoceros, Royal Bengal tigers, leopards, and over 500 bird species.',
    whyVisit: 'Embark on jungle safaris, dugout canoe rides down the Rapti River, and experience traditional Tharu stick dance performances.',
    attractions: [
      'Jungle Jeep Safari',
      'Rapti River Canoe Trip',
      'Tharu Cultural Village Tours',
      'Elephant Breeding Center',
      'Bird Watching Walks'
    ]
  },
  {
    id: 'mustang',
    name: 'Mustang',
    tagline: 'Forbidden Kingdom of the High Himalayas',
    region: 'Rain-shadow Himalayas',
    bestTime: 'Mar - Nov',
    vibe: 'Mystical & Mountain Desert',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    description: 'Upper & Lower Mustang present a dramatic high-altitude desert landscape of eroded canyon cliffs, ancient cave dwellings, Tibetan Buddhist chortens, and walled fortress towns.',
    whyVisit: 'Discover Muktinath, a sacred temple for Hindus & Buddhists alike, explore Lo Manthang, and trek through timeless Himalayan rain-shadow terrain.',
    attractions: [
      'Muktinath Sacred Temple (3,710m)',
      'Walled City of Lo Manthang',
      'Ancient Sky Caves of Chhoser',
      'Marpha Apple Orchards',
      'Kali Gandaki Gorge'
    ]
  }
];

const LandingPage = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true });
  };

  return (
    <div className="landing-page animate-fade-in" style={{ backgroundColor: 'var(--color-soft-bg)' }}>
      <Navbar />

      <main>
        {/* ================= HERO SECTION ================= */}
        <section className="hero container" style={{ paddingTop: '4.5rem', paddingBottom: '5rem', textAlign: 'center' }}>
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.65rem', 
              backgroundColor: 'var(--color-light-mint)', 
              color: 'var(--color-dark-green)', 
              padding: '0.45rem 1.25rem', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              marginBottom: '1.75rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Sparkles size={16} color="var(--color-primary-green)" />
            <span>NEPAL'S SMART TOURISM PLATFORM</span>
          </div>

          <h1 className="hero-title" style={{ maxWidth: '850px', margin: '0 auto 1.5rem', fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-dark-text)', lineHeight: 1.15 }}>
            Explore Nepal. Travel Smarter.
          </h1>

          <p className="hero-subtitle" style={{ maxWidth: '720px', margin: '0 auto 2.5rem', fontSize: '1.25rem', color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
            Discover Nepal with smarter travel guidance, safety-focused information, personalized recommendations, and an AI-powered travel companion.
          </p>

          <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button size="lg" variant="primary" onClick={handleGetStarted} style={{ padding: '0.9rem 2.25rem', borderRadius: 'var(--radius-full)', fontSize: '1.05rem' }}>
              Get Started <ArrowRight size={18} />
            </Button>
            <Link to="/about">
              <Button size="lg" variant="outline" style={{ padding: '0.9rem 2.25rem', borderRadius: 'var(--radius-full)', fontSize: '1.05rem' }}>
                Learn More
              </Button>
            </Link>
          </div>

          {/* Hero Image Showcase Banner */}
          <div className="hero-visual" style={{ marginTop: '4rem', position: 'relative' }}>
            <div 
              style={{ 
                borderRadius: 'var(--radius-xl)', 
                overflow: 'hidden', 
                boxShadow: 'var(--shadow-lg)', 
                height: '420px', 
                position: 'relative' 
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop" 
                alt="Nepal Himalayan Mountain Landscape" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,59,46,0.85) 0%, transparent 60%)' }} />
              
              <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', textAlign: 'left', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ backgroundColor: 'var(--color-primary-green)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    Featured Destination
                  </span>
                  <h3 style={{ color: 'white', fontSize: '1.85rem', marginTop: '0.35rem' }}>Annapurna Range & Machhapuchhre</h3>
                  <p style={{ color: 'var(--color-light-mint)', opacity: 0.9, margin: 0, fontSize: '0.95rem' }}>Experience pristine mountain air, rich traditions, and epic trekking routes.</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => setSelectedDestination(destinationsList[1])}
                    style={{ backgroundColor: 'white', color: 'var(--color-dark-green)', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem' }}
                  >
                    Quick View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '6rem 0' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem' }}>
              <span style={{ color: 'var(--color-primary-green)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                Why Choose YatraX
              </span>
              <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--color-dark-text)' }}>
                Everything You Need for a Better Nepal Journey
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-secondary-text)' }}>
                Tailored solutions designed to make exploring Nepal effortless, safe, and deeply rewarding.
              </p>
            </div>

            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {/* Card 1 */}
              <Card hoverable className="feature-card" style={{ padding: '2.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="feature-icon-wrapper" style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <BookOpen size={26} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>1. Smart Travel Guidance</h3>
                <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
                  Provide useful information to help tourists prepare for and navigate their journey.
                </p>
              </Card>

              {/* Card 2 */}
              <Card hoverable className="feature-card" style={{ padding: '2.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="feature-icon-wrapper" style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Compass size={26} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>2. Destination Discovery</h3>
                <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
                  Discover popular destinations, trekking regions, cultural places, and hidden gems across Nepal.
                </p>
              </Card>

              {/* Card 3 */}
              <Card hoverable className="feature-card" style={{ padding: '2.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="feature-icon-wrapper" style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <ShieldCheck size={26} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>3. Travel Safety</h3>
                <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
                  Access practical safety-focused travel information and guidance.
                </p>
              </Card>

              {/* Card 4 */}
              <Card hoverable className="feature-card" style={{ padding: '2.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="feature-icon-wrapper" style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Bot size={26} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>4. AI Travel Assistant</h3>
                <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
                  Ask travel-related questions and receive helpful AI-powered guidance.
                </p>
              </Card>

              {/* Card 5 */}
              <Card hoverable className="feature-card" style={{ padding: '2.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="feature-icon-wrapper" style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Heart size={26} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>5. Local & Cultural Awareness</h3>
                <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
                  Learn about local customs, etiquette, traditions, and cultural considerations.
                </p>
              </Card>

              {/* Card 6 */}
              <Card hoverable className="feature-card" style={{ padding: '2.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="feature-icon-wrapper" style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <Sliders size={26} />
                </div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>6. Personalized Recommendations</h3>
                <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6 }}>
                  Receive recommendations based on destinations, interests, and travel preferences.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ================= HOW YATRAX WORKS ================= */}
        <section className="section container" style={{ padding: '6rem 1.5rem' }}>
          <div className="section-header" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem' }}>
            <span style={{ color: 'var(--color-primary-green)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
              Simple & Seamless
            </span>
            <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--color-dark-text)' }}>
              How YatraX Works
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-secondary-text)' }}>
              Follow these simple steps to make your journey through Nepal smooth, memorable, and safe.
            </p>
          </div>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem',
              position: 'relative' 
            }}
          >
            {[
              { num: '01', title: 'Discover', desc: 'Explore rich destination guides, local culture, and seasonal insights across Nepal.' },
              { num: '02', title: 'Choose Your Destination', desc: 'Pick your preferred region—from historic valleys to Himalayan trails.' },
              { num: '03', title: 'Get Travel & Safety Guidance', desc: 'Receive essential checklists, altitude tips, permits info, and weather considerations.' },
              { num: '04', title: 'Plan Your Journey', desc: 'Generate customized day-by-day itineraries tailored to your pace and budget.' },
              { num: '05', title: 'Travel With Confidence', desc: 'Access your AI assistant and travel information with complete peace of mind.' }
            ].map((step, idx) => (
              <Card 
                key={idx} 
                style={{ 
                  padding: '2rem 1.25rem', 
                  borderRadius: 'var(--radius-lg)', 
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                  borderTop: '4px solid var(--color-primary-green)'
                }}
              >
                <div 
                  style={{ 
                    width: '3rem', 
                    height: '3rem', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-light-mint)', 
                    color: 'var(--color-dark-green)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontWeight: 800, 
                    fontSize: '1.1rem',
                    margin: '0 auto 1.25rem' 
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>{step.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)', lineHeight: 1.5 }}>{step.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ================= DESTINATIONS SECTION ================= */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '6rem 0' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem' }}>
              <span style={{ color: 'var(--color-primary-green)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                Featured Places
              </span>
              <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--color-dark-text)' }}>
                Discover Nepal
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-secondary-text)' }}>
                Explore Nepal’s most iconic regions, cultural hotspots, and mountain destinations.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {destinationsList.map((item) => (
                <Card 
                  key={item.id} 
                  hoverable 
                  style={{ 
                    padding: 0, 
                    overflow: 'hidden', 
                    borderRadius: 'var(--radius-lg)', 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }}
                >
                  <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }} 
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,46,33,0.85) 0%, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem', color: 'white' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-mint-green)', textTransform: 'uppercase' }}>
                        {item.tagline}
                      </span>
                      <h3 style={{ color: 'white', fontSize: '1.5rem', marginTop: '0.2rem' }}>{item.name}</h3>
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: '0.925rem', color: 'var(--color-secondary-text)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                      {item.description}
                    </p>

                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedDestination(item)}
                      style={{ width: '100%', justifyContent: 'center', borderRadius: 'var(--radius-md)' }}
                    >
                      Explore Details <ChevronRight size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SAFETY SECTION ================= */}
        <section className="section container" style={{ padding: '6rem 1.5rem' }}>
          <div 
            style={{ 
              backgroundColor: 'var(--color-dark-green)', 
              borderRadius: 'var(--radius-xl)', 
              color: 'white', 
              padding: '4rem 3rem',
              boxShadow: 'var(--shadow-lg)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            <div>
              <span style={{ backgroundColor: 'var(--color-primary-green)', color: 'white', fontSize: '0.775rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: '20px', textTransform: 'uppercase' }}>
                Safety First
              </span>
              <h2 style={{ color: 'white', fontSize: '2.5rem', marginTop: '0.75rem', marginBottom: '1.25rem' }}>
                Travel Nepal With Confidence
              </h2>
              <p style={{ color: 'var(--color-light-mint)', opacity: 0.95, fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                YatraX equips you with essential safety guidelines, trekking preparation checklists, local awareness tips, and emergency contacts to keep your adventure worry-free.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  'Travel safety guidance',
                  'Trekking preparation tips',
                  'Local awareness',
                  'Emergency-related information',
                  'Destination-specific tips',
                  'Smart travel recommendations'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.925rem', color: 'white' }}>
                    <CheckCircle2 size={18} color="var(--color-mint-green)" style={{ flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid rgba(255,255,255,0.15)' }}>
              <h3 style={{ color: 'white', fontSize: '1.35rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck color="var(--color-mint-green)" /> Safety Essentials Checklist
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--color-light-mint)' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Elevation Rule:</strong> Ascend maximum 300-500m daily once above 3,000m.
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Water Safety:</strong> Always use water purification tablets or UV sterilizers.
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Trail Register:</strong> Store emergency contact numbers offline before trekking.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= AI TRAVEL ASSISTANT DEMO ================= */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '6rem 0' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
              <span style={{ color: 'var(--color-primary-green)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                Interactive Preview
              </span>
              <h2 className="section-title" style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--color-dark-text)' }}>
                Try the AI Travel Assistant
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-secondary-text)' }}>
                Ask travel questions below to see how YatraX AI assists your trip in real-time.
              </p>
            </div>

            <AIChatWidget />
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-light-mint), var(--color-soft-bg))', padding: '6rem 0', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '750px' }}>
            <h2 style={{ fontSize: '2.75rem', marginBottom: '1rem', color: 'var(--color-dark-green)' }}>
              Your Nepal Adventure Starts Here.
            </h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: 'var(--color-secondary-text)' }}>
              Discover new places, prepare smarter, and experience Nepal with confidence.
            </p>
            <Link to="/signup">
              <Button size="lg" variant="primary" style={{ padding: '1rem 2.75rem', borderRadius: 'var(--radius-full)', fontSize: '1.1rem' }}>
                Start Exploring <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <DestinationModal 
          destination={selectedDestination} 
          onClose={() => setSelectedDestination(null)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default LandingPage;
