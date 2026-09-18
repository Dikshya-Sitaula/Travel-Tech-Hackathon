import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup, login } = useAuth();

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords must match.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await signup(name, email, password);
      // Auto log in after demo registration
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
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
          src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1600&auto=format&fit=crop" 
          alt="Nepal Travel Adventure" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,59,46,0.9) 0%, transparent 60%)' }} />
        
        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem', color: 'white' }}>
          <span style={{ backgroundColor: 'var(--color-primary-green)', padding: '0.35rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
            Join YatraX
          </span>
          <h2 style={{ fontSize: '2.75rem', color: 'white', marginTop: '0.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
            Start Your Yatra with YatraX
          </h2>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-light-mint)', opacity: 0.95, lineHeight: 1.6 }}>
            Discover popular destinations, get travel and safety guidance, and chat with your AI companion across Nepal.
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
            Start Your Yatra with YatraX
          </h1>
          <p style={{ color: 'var(--color-secondary-text)', marginBottom: '2rem', fontSize: '0.975rem' }}>
            Create your demo account to explore Nepal smarter.
          </p>

          <Card style={{ borderRadius: 'var(--radius-xl)', padding: '2rem', backgroundColor: '#FFFFFF' }}>
            {error && (
              <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-dark-text)' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dikshya Sharma"
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-dark-text)' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }} 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-dark-text)' }}>Password (min. 6 characters)</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-dark-text)' }}>Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }} 
                />
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting} style={{ borderRadius: 'var(--radius-full)', marginTop: '0.5rem', padding: '0.85rem' }}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} />
              </Button>
            </form>
          </Card>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-secondary-text)', fontSize: '0.95rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary-green)', fontWeight: 700 }}>Sign In</Link>
          </p>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .auth-visual { display: block !important; }
        }
      `}} />
    </div>
  );
};

export default SignUpPage;
