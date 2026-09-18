import React, { useState } from 'react';
import { MapPin, Mail, CheckCircle2, Clock, Send, MessageSquare } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required.';
    if (!formData.message.trim()) newErrors.message = 'Message is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
  };

  const faqs = [
    {
      q: "What is YatraX?",
      a: "YatraX is a smart Nepal tourism platform that provides travel guidance, safety information, cultural insights, personalized recommendations, and AI travel assistance."
    },
    {
      q: "How does the AI Travel Assistant work?",
      a: "Our AI assistant answers queries on Nepal destinations, mountain safety tips, packing advice, local customs, and travel itineraries in real-time."
    },
    {
      q: "Is YatraX free to use for travelers?",
      a: "Yes, YatraX provides core travel exploration, destination details, safety guides, and AI assistant tools free for travelers."
    },
    {
      q: "Can I use YatraX to plan treks across Nepal?",
      a: "Yes! YatraX provides trekking preparation tips, altitude guidelines, seasonal recommendations, and destination details for Everest, Annapurna, Mustang, and more."
    }
  ];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-soft-bg)' }}>
      <Navbar />

      <main className="container" style={{ padding: '5rem 1.5rem 6rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem' }}>
          <span style={{ color: 'var(--color-primary-green)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
            We'd Love to Hear From You
          </span>
          <h1 style={{ fontSize: '3.25rem', marginTop: '0.35rem', marginBottom: '1rem', color: 'var(--color-dark-text)' }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-secondary-text)' }}>
            Have questions about YatraX or need assistance planning your trip to Nepal? Send us a message below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem' }}>
          
          {/* Contact Information Column */}
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--color-dark-green)' }}>
              Contact Information
            </h2>
            <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6, marginBottom: '2rem' }}>
              We are dedicated to building a smarter, safer travel experience for everyone visiting Nepal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-dark-text)', fontSize: '0.95rem' }}>Nepal Location</div>
                  <div style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>Kathmandu, Nepal</div>
                </div>
              </Card>

              <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-dark-text)', fontSize: '0.95rem' }}>Email Placeholder</div>
                  <div style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>contact@yatrax.demo</div>
                </div>
              </Card>

              <Card style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-dark-text)', fontSize: '0.95rem' }}>Operating Hours</div>
                  <div style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>Sunday – Friday (9:00 AM – 6:00 PM NPT)</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Form Column */}
          <div>
            {!submitted ? (
              <Card style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-dark-green)' }}>
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark-text)' }}>Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name" 
                      style={{ 
                        width: '100%', 
                        padding: '0.85rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: errors.name ? '1.5px solid var(--color-red)' : '1px solid var(--color-gray-300)',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }} 
                    />
                    {errors.name && <span style={{ color: 'var(--color-red)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark-text)' }}>Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com" 
                      style={{ 
                        width: '100%', 
                        padding: '0.85rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: errors.email ? '1.5px solid var(--color-red)' : '1px solid var(--color-gray-300)',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }} 
                    />
                    {errors.email && <span style={{ color: 'var(--color-red)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark-text)' }}>Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is your message about?" 
                      style={{ 
                        width: '100%', 
                        padding: '0.85rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: errors.subject ? '1.5px solid var(--color-red)' : '1px solid var(--color-gray-300)',
                        outline: 'none',
                        fontSize: '0.95rem'
                      }} 
                    />
                    {errors.subject && <span style={{ color: 'var(--color-red)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.subject}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-dark-text)' }}>Message</label>
                    <textarea 
                      name="message"
                      rows="4" 
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your message here..."
                      style={{ 
                        width: '100%', 
                        padding: '0.85rem 1rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: errors.message ? '1.5px solid var(--color-red)' : '1px solid var(--color-gray-300)',
                        outline: 'none',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    ></textarea>
                    {errors.message && <span style={{ color: 'var(--color-red)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.message}</span>}
                  </div>

                  <Button type="submit" variant="primary" size="lg" style={{ borderRadius: 'var(--radius-full)', marginTop: '0.5rem' }}>
                    Send Message <Send size={16} />
                  </Button>
                </form>
              </Card>
            ) : (
              <Card style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)', backgroundColor: '#FFFFFF' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={40} />
                </div>
                <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 2rem' }}>
                  Thank you for reaching out to YatraX. Your message has been recorded for this demo demonstration.
                </p>
                <Button 
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }} 
                  variant="outline"
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  Send Another Message
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ marginTop: '6rem', maxWidth: '850px', margin: '6rem auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '2rem', color: 'var(--color-dark-green)' }}>Frequently Asked Questions</h3>
            <p style={{ color: 'var(--color-secondary-text)' }}>Quick answers to common questions about YatraX.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <Card 
                key={idx} 
                hoverable 
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                style={{ cursor: 'pointer', borderRadius: 'var(--radius-lg)' }}
              >
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-dark-text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.25rem', color: 'var(--color-primary-green)' }}>{expandedFaq === idx ? '−' : '+'}</span>
                </div>
                {expandedFaq === idx && (
                  <div style={{ marginTop: '0.85rem', color: 'var(--color-secondary-text)', lineHeight: 1.6, fontSize: '0.95rem', animation: 'fadeIn 0.2s ease' }}>
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
