import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Info, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || 'dikshya@yatrax.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. If you signed up, please enter your registered email and password.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-soft-bg)' }}>
      {/* Visual Side Banner */}
      <div 
        className="auth-visual" 
        style={{ 
          flex: 1, 
          display: 'none', 
          position: 'relative', 
          backgroundColor: 'var(--color-dark-green)',
          overflow: 'hidden' 
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop" 
          alt="Nepal Mountains" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,59,46,0.9) 0%, transparent 60%)' }} />
        
        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem', color: 'white' }}>
          <span style={{ backgroundColor: 'var(--color-primary-green)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Welcome Back
          </span>
          <h2 style={{ fontSize: '2.75rem', color: 'white', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            Welcome Back to YatraX
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-light-mint)', opacity: 0.95, lineHeight: 1.6 }}>
            Access your saved itineraries, safety guidelines, and personal AI travel assistant.
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2.5rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 'auto' }}>
          <img 
            src="/assets/logo.png" 
            alt="YatraX Logo" 
            style={{ height: '2.8rem', width: 'auto', objectFit: 'contain' }} 
          />
        </Link>

        <div style={{ width: '100%', maxWidth: '420px', margin: 'auto' }} className="animate-fade-in">
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'var(--color-dark-green)' }}>
            Welcome Back to YatraX
          </h1>
          <p style={{ color: 'var(--color-secondary-text)', marginBottom: '2rem', fontSize: '0.975rem' }}>
            Enter your credentials to sign in to your user dashboard.
          </p>

          <Card style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', backgroundColor: '#FFFFFF' }}>
            {error && (
              <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <div style={{ backgroundColor: 'var(--color-light-mint)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.825rem', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} style={{ flexShrink: 0 }} /> Demo credentials pre-filled (`dikshya@yatrax.com` / `password123`) or use your registered details!
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-dark-text)' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dikshya@yatrax.com"
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }} 
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-dark-text)' }}>Password</label>
                  <button 
                    type="button"
                    onClick={() => setShowForgotModal(true)} 
                    style={{ fontSize: '0.85rem', color: 'var(--color-primary-green)', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }} 
                />
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting} style={{ borderRadius: 'var(--radius-full)', marginTop: '0.5rem', padding: '0.85rem' }}>
                {isSubmitting ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
              </Button>
            </form>
          </Card>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-secondary-text)', fontSize: '0.95rem' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary-green)', fontWeight: 700 }}>Create one</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(23,46,33,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
          onClick={() => setShowForgotModal(false)}
        >
          <Card 
            style={{ maxWidth: '420px', width: '100%', padding: '2rem', borderRadius: 'var(--radius-xl)', textAlign: 'center', backgroundColor: '#FFFFFF', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowForgotModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-secondary-text)' }}
            >
              <X size={20} />
            </button>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Info size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--color-dark-green)' }}>Password Recovery</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Password recovery will be available when backend functionality is connected.
            </p>
            <Button variant="primary" fullWidth onClick={() => setShowForgotModal(false)} style={{ borderRadius: 'var(--radius-full)' }}>
              Got It
            </Button>
          </Card>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .auth-visual { display: block !important; }
        }
      `}} />
    </div>
  );
};

export default LoginPage;
