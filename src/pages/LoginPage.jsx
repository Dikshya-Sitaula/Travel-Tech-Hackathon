import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || 'dikshya@yatrax.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-very-light-bg)' }}>
      {/* Visual Side */}
      <div style={{ flex: 1, display: 'none', position: 'relative', background: 'linear-gradient(135deg, var(--color-dark-green), var(--color-primary-green))' }} className="auth-visual">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.25, backgroundImage: 'url("https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', bottom: '4rem', left: '4rem', right: '4rem', color: 'white' }}>
          <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Welcome back.</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.9 }}>Continue planning your next adventure in Nepal.</p>
        </div>
      </div>

      {/* Form Side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-dark-green)', fontSize: '1.25rem', marginBottom: 'auto' }}>
          <img src="/assets/logo.png" alt="YatraX Logo" style={{ height: '2rem', width: 'auto' }} /> YatraX
        </Link>

        <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }} className="animate-fade-in">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Log In</h1>
          <p style={{ color: 'var(--color-secondary-text)', marginBottom: '2rem' }}>Enter your details to access your dashboard.</p>

          <Card style={{ borderRadius: 'var(--radius-lg)' }}>
            {successMsg && <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-light-mint)', color: 'var(--color-dark-green)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>{successMsg}</div>}
            {error && <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-red-bg)', color: 'var(--color-red)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dikshya@yatrax.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} 
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo Mode: Use dikshya@yatrax.com / password123'); }} style={{ fontSize: '0.875rem', color: 'var(--color-primary-green)' }}>Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)' }} 
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="remember" defaultChecked />
                <label htmlFor="remember" style={{ fontSize: '0.875rem', color: 'var(--color-secondary-text)' }}>Remember me</label>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Log In'} <ArrowRight size={16} />
              </Button>
            </form>
          </Card>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-secondary-text)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary-green)', fontWeight: 600 }}>Sign up</Link>
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
