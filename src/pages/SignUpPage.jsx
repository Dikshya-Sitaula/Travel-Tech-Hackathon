import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup } = useAuth();

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
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
      setError('Passwords do not match.');
      return;
    }
    if (!agree) {
      setError('You must agree to the Terms and Privacy Policy.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await signup(name, email, password);
      navigate('/login', { state: { message: 'Account created successfully! Please log in.' } });
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-very-light-bg)' }}>
      {/* Visual Side */}
      <div style={{ flex: 1, display: 'none', position: 'relative', background: 'linear-gradient(135deg, var(--color-dark-green), var(--color-primary-green))' }} className="auth-visual">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'url("https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=2000&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem', color: 'white' }}>
          <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Your journey starts here.</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Create your YatraX account and prepare for your next adventure in Nepal.</p>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-dark-green)', fontSize: '1.25rem', marginBottom: 'auto' }}>
          <img src="/assets/logo.png" alt="YatraX Logo" style={{ height: '2rem', width: 'auto' }} /> YatraX
        </Link>

        <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }} className="animate-fade-in">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Start your journey.</h1>
          <p style={{ color: 'var(--color-secondary-text)', marginBottom: '2rem' }}>Create an account to build your first AI itinerary.</p>

          <Card style={{ borderRadius: 'var(--radius-lg)' }}>
            {error && <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dikshya Sharma"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Password (min. 6 characters)</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="agree" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <label htmlFor="agree" style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)' }}>I agree to the Terms and Privacy Policy.</label>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Creating Account...' : 'Create Account'} <ArrowRight size={16} />
              </Button>
            </form>
          </Card>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-secondary-text)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--color-primary-green)', fontWeight: 600 }}>Log in</Link>
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
