import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck,
  Flame, 
  Lightbulb, 
  Heart, 
  Globe, 
  Target, 
  Eye, 
  ArrowRight
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Dikshya Sitaula',
      role: 'FRONTEND DEV, AI INTEGRATION & CO-LEAD',
      avatar: '/assets/team/dikshya.jpg'
    },
    {
      name: 'Devasish Bogati',
      role: 'BACKEND DEV, AI INTEGRATION & CO-LEAD',
      avatar: '/assets/team/devasish.jpg'
    },
    {
      name: 'Shreya Thapa',
      role: 'DATABASE & MODEL TRAINING',
      avatar: '/assets/team/shreya.jpg'
    },
    {
      name: 'Sulav Nepal',
      role: 'DATABASE & MODEL TRAINING',
      avatar: '/assets/team/sulav.jpg'
    }
  ];

  const coreValues = [
    {
      icon: Flame,
      title: 'Sustainability',
      desc: 'Promoting environmentally responsible trekking habits and greener lifestyles across Nepal\'s trails.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      desc: 'Using AI and smart technology to simplify travel planning and make mountain guidance practical.'
    },
    {
      icon: Heart,
      title: 'Community',
      desc: 'Positive tourism impact grows stronger through local collaboration, tea house support, and meaningful connections.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      desc: 'Making destination intelligence and safety information accessible to everyone regardless of experience level.'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: '#FFFFFF', color: 'var(--color-dark-text)' }}>
      <Navbar />

      <main>
        {/* ================= 1. HERO SECTION ================= */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '4.5rem 0 3.5rem', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '850px' }}>
            
            {/* Top Pill Badge with Person Icon */}
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                backgroundColor: 'var(--color-light-mint)', 
                color: 'var(--color-dark-green)', 
                padding: '0.45rem 1.25rem', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.85rem', 
                fontWeight: 700, 
                marginBottom: '1.5rem',
                border: '1px solid var(--color-gray-200)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <UserCheck size={16} color="var(--color-primary-green)" />
              <span>Get to Know Us</span>
            </div>

            {/* Main Title */}
            <h1 
              style={{ 
                fontSize: '3.25rem', 
                fontWeight: 800, 
                color: 'var(--color-dark-green)', 
                lineHeight: 1.15,
                marginBottom: '1.25rem' 
              }}
            >
              Rooted in Purpose. <br />
              <span style={{ color: 'var(--color-sage-green)' }}>Growing Together.</span>
            </h1>

            {/* Subtitle */}
            <p 
              style={{ 
                fontSize: '1.15rem', 
                color: 'var(--color-secondary-text)', 
                lineHeight: 1.65, 
                maxWidth: '720px', 
                margin: '0 auto 3rem' 
              }}
            >
              We are a passionate team of innovators and creators dedicated to bridging the gap between nature and technology, making sustainable travel and exploration accessible for everyone.
            </p>

            <hr style={{ borderColor: 'var(--color-gray-200)', opacity: 0.6, margin: '0 0 2.5rem' }} />

            {/* Stat Strip */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                gap: '2rem', 
                textAlign: 'center' 
              }}
            >
              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>10K+</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Travel Recommendations
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>500+</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Destinations & Spots
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-dark-green)' }}>100+</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Local Trail Guides
                </div>
              </div>

              <div>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                  Growing <span style={{ fontSize: '1.25rem', color: '#4ADE80' }}>↗</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Travel Community
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. OUR JOURNEY SECTION ================= */}
        <section className="section" style={{ backgroundColor: 'var(--color-cream)', padding: '5.5rem 0' }}>
          <div className="container">
            
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Our Journey
              </span>
            </div>

            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '3.5rem', 
                alignItems: 'center' 
              }}
            >
              {/* Left Side: Living trail map */}
              <div className="journey-visual" aria-label="Animated illustration of a Nepal trail journey">
                <div className="journey-sun" />
                <div className="journey-cloud journey-cloud-one" />
                <div className="journey-cloud journey-cloud-two" />
                <div className="journey-mountain journey-mountain-back" />
                <div className="journey-mountain journey-mountain-front" />
                <div className="journey-route journey-route-one" />
                <div className="journey-route journey-route-two" />
                <div className="journey-marker journey-marker-start"><span>01</span></div>
                <div className="journey-marker journey-marker-mid"><span>02</span></div>
                <div className="journey-marker journey-marker-end"><span>03</span></div>
                <div className="journey-peak-label">Himalayan trail <strong>→</strong></div>
                <div className="journey-panel">
                  <div className="journey-panel-icon"><Globe size={18} /></div>
                  <div>
                    <span>LIVE EXPLORATION</span>
                    <strong>Find your way to wonder</strong>
                  </div>
                  <div className="journey-signal"><i /><i /><i /></div>
                </div>
                <div className="journey-compass"><span>N</span><div>✦</div><span>S</span></div>
              </div>

              {/* Right Side: Narrative */}
              <div>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                  Why We Started This Journey
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '1rem', color: 'var(--color-secondary-text)', lineHeight: 1.7 }}>
                  <p>
                    Our story began with a very real and relatable problem. Many travelers genuinely want to explore Nepal's rich landscapes and cultural heritage but often feel confused about where to start. Travel details are scattered, mountain weather is unpredictable, and remote connectivity can be uncertain.
                  </p>
                  <p>
                    At the same time, local tea houses, guides, and heritage spots need better digital visibility to connect with global explorers seamlessly. We saw an opportunity to create a meaningful bridge between people, nature, and technology.
                  </p>
                  <p>
                    This inspired us to build <strong>YatraX</strong> — a platform that simplifies Nepal travel while making destination guidance, safety, and cultural awareness accessible, affordable, and community-driven. By combining AI technology with sustainable travel practices, we empower individuals to confidently explore Nepal — no matter their experience level.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. OUR PURPOSE & PERSPECTIVE ================= */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '5.5rem 0' }}>
          <div className="container">
            
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                What Drives Us
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark-green)', marginTop: '0.5rem' }}>
                Our Purpose & Perspective
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Left Card: Our Mission & What is YatraX */}
              <Card 
                style={{ 
                  padding: '3rem 2.5rem', 
                  borderRadius: 'var(--radius-xl)', 
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--color-gray-200)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div 
                    style={{ 
                      width: '3.25rem', 
                      height: '3.25rem', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--color-light-mint)', 
                      color: 'var(--color-dark-green)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1.75rem' 
                    }}
                  >
                    <Target size={24} />
                  </div>

                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '1rem' }}>
                    What is YatraX & Our Mission
                  </h3>

                  <p style={{ fontSize: '1rem', color: 'var(--color-secondary-text)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    YatraX is a smart Nepal tourism platform designed to provide travel guidance, safety information, cultural insights, personalized recommendations, and AI travel assistance.
                  </p>

                  <p style={{ fontSize: '1rem', color: 'var(--color-secondary-text)', lineHeight: 1.7 }}>
                    We aim to make travel planning simple, accessible, and enjoyable for everyone. Through AI-powered guidance, personalized itinerary recommendations, and local travel awareness, we empower people to confidently explore Nepal safely and sustainably.
                  </p>
                </div>
              </Card>

              {/* Right Card: Our Vision (Dark Green Card) */}
              <Card 
                style={{ 
                  padding: '3rem 2.5rem', 
                  borderRadius: 'var(--radius-xl)', 
                  backgroundColor: 'var(--color-dark-green)', 
                  color: 'white',
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div 
                    style={{ 
                      width: '3.25rem', 
                      height: '3.25rem', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                      color: 'var(--color-mint-green)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1.75rem' 
                    }}
                  >
                    <Eye size={24} />
                  </div>

                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                    Our Vision
                  </h3>

                  <p style={{ fontSize: '1.05rem', color: 'var(--color-light-mint)', opacity: 0.95, lineHeight: 1.75 }}>
                    We envision a future where technology and sustainability work together to reconnect people with nature and culture. Our goal is to create safer mountain travel, support local communities, and build stronger travel awareness through smart environmental care and digital accessibility.
                  </p>
                </div>
              </Card>

            </div>
          </div>
        </section>

        {/* ================= 4. THE TEAM BEHIND THE VISION ================= */}
        <section className="section" style={{ backgroundColor: 'var(--color-cream)', padding: '5.5rem 0' }}>
          <div className="container">
            
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Our People
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark-green)', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                The Team Behind the Vision
              </h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--color-secondary-text)' }}>
                A passionate team of creators, innovators, and problem-solvers building technology that reconnects people with nature and travel.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {teamMembers.map((member, idx) => (
                <Card 
                  key={idx} 
                  hoverable
                  style={{ 
                    padding: '2.25rem 1.5rem', 
                    borderRadius: 'var(--radius-xl)', 
                    backgroundColor: '#FFFFFF',
                    textAlign: 'center',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div 
                    style={{ 
                      width: '7.5rem', 
                      height: '7.5rem', 
                      borderRadius: '50%', 
                      overflow: 'hidden', 
                      marginBottom: '1.5rem',
                      boxShadow: 'var(--shadow-md)',
                      border: '4px solid var(--color-light-mint)'
                    }}
                  >
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '0.4rem' }}>
                    {member.name}
                  </h3>

                  <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--color-secondary-text)', textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.4 }}>
                    {member.role}
                  </div>
                </Card>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 5. THE VALUES THAT SHAPE OUR VISION ================= */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '5.5rem 0' }}>
          <div className="container">
            
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-dark-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Our Core Values
              </span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-dark-green)', marginTop: '0.5rem' }}>
                The Values That Shape Our Vision
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem' }}>
              {coreValues.map((val, idx) => (
                <Card 
                  key={idx} 
                  hoverable
                  style={{ 
                    padding: '2.25rem 1.75rem', 
                    borderRadius: 'var(--radius-xl)', 
                    backgroundColor: '#FFFFFF',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--color-gray-200)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start'
                  }}
                >
                  <div 
                    style={{ 
                      width: '2.75rem', 
                      height: '2.75rem', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--color-light-mint)', 
                      color: 'var(--color-dark-green)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: '1.25rem' 
                    }}
                  >
                    <val.icon size={20} />
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-dark-green)', marginBottom: '0.75rem' }}>
                    {val.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: 'var(--color-secondary-text)', lineHeight: 1.6, margin: 0 }}>
                    {val.desc}
                  </p>
                </Card>
              ))}
            </div>

          </div>
        </section>

        {/* ================= 6. CALL TO ACTION SECTION ================= */}
        <section className="section" style={{ backgroundColor: '#FFFFFF', padding: '4rem 0 6rem', textAlign: 'center' }}>
          <div className="container" style={{ maxWidth: '750px' }}>
            <h2 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--color-dark-green)', marginBottom: '1rem' }}>
              Ready to Start Your Nepal Journey?
            </h2>
            <p style={{ fontSize: '1.15rem', color: 'var(--color-secondary-text)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Explore Nepal smarter with AI-powered travel guidance, safety information, and personalized recommendations.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup">
                <Button 
                  size="lg" 
                  variant="primary" 
                  style={{ 
                    padding: '0.9rem 2.25rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '1rem',
                    backgroundColor: 'var(--color-dark-green)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  Get Started Now
                </Button>
              </Link>

              <Link to="/">
                <Button 
                  size="lg" 
                  variant="outline" 
                  style={{ 
                    padding: '0.9rem 2.25rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '1rem',
                    borderColor: 'var(--color-gray-300)'
                  }}
                >
                  Explore Destinations
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
