import React, { useState } from 'react';
import { MapPin, Mail, CheckCircle } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: "What is YatraX?",
      a: "YatraX is an AI-powered smart tourism and travel safety platform for Nepal that helps you plan, navigate, explore landmarks, and stay safe."
    },
    {
      q: "Does the Offline Assistant require internet?",
      a: "No. Once you save your itinerary offline, the basic assistant functionalities work without any internet connection."
    },
    {
      q: "Can I save my itinerary offline?",
      a: "Yes, you can save your generated itineraries to your device so they are accessible anywhere."
    },
    {
      q: "How does landmark identification work?",
      a: "You simply take a photo or upload an image of a landmark, and our AI will analyze it to provide historical context and details."
    }
  ];

  return (
    <div className="animate-fade-in">
      <Navbar />

      <main className="container" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
          
          {/* Left Column */}
          <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Let's connect.</h1>
            <p style={{ fontSize: '1.125rem', marginBottom: '3rem', color: 'var(--color-gray-600)' }}>
              Have a question, suggestion, partnership idea, or feedback? We'd love to hear from you.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-blue-bg)', borderRadius: 'var(--radius-full)', color: 'var(--color-blue)' }}>
                  <MapPin />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Location</div>
                  <div style={{ color: 'var(--color-gray-600)' }}>Kathmandu, Nepal</div>
                </div>
              </Card>
              
              <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-green-light)', borderRadius: 'var(--radius-full)', color: 'white' }}>
                  <Mail />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Email</div>
                  <div style={{ color: 'var(--color-gray-600)' }}>hello@yatrax.com</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {!submitted ? (
              <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
                    <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                    <input type="email" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subject</label>
                    <input type="text" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message</label>
                    <textarea required rows="4" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }}></textarea>
                  </div>
                  <Button type="submit" variant="primary" size="lg">Send Message →</Button>
                </form>
              </Card>
            ) : (
              <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <CheckCircle size={64} color="var(--color-green)" style={{ margin: '0 auto 1.5rem' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Message sent successfully!</h3>
                <p style={{ color: 'var(--color-gray-600)' }}>Thanks for reaching out to YatraX.</p>
                <Button onClick={() => setSubmitted(false)} variant="outline" style={{ marginTop: '2rem' }}>Send Another</Button>
              </Card>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: '6rem', maxWidth: '800px', margin: '6rem auto 0' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Have a quick question?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <Card 
                key={idx} 
                hoverable 
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  {faq.q}
                  <span>{expandedFaq === idx ? '−' : '+'}</span>
                </div>
                {expandedFaq === idx && (
                  <div style={{ marginTop: '1rem', color: 'var(--color-gray-600)', animation: 'fadeIn 0.2s ease forwards' }}>
                    {faq.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
