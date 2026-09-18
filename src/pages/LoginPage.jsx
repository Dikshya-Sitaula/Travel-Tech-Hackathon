import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mountain, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-bg)' }}>
      {/* Visual Side */}
      <div style={{ flex: 1, display: 'none', position: 'relative', background: 'linear-gradient(135deg, var(--color-navy), var(--color-blue))' }} className="auth-visual">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem', color: 'white' }}>
          <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem' }}>Welcome back.</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Continue planning your next adventure.</p>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: 'auto' }}>
          <Mountain color="var(--color-green)" /> TrekSafe
        </Link>

        <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }} className="animate-fade-in">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Log In</h1>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>Enter your details to access your dashboard.</p>

          <Card>
            {error && <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} 
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
                  <a href="#" style={{ fontSize: '0.875rem', color: 'var(--color-blue)' }}>Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Remember me</label>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Log In'} <ArrowRight size={16} />
              </Button>
            </form>
          </Card>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-gray-600)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-blue)', fontWeight: 500 }}>Sign up</Link>
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

export default LoginPage;
