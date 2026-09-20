import React, { useState, useEffect, useRef } from 'react';
import { Send, Wifi, SignalZero, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { checkOfflineModel, sendAssistantMessage } from '../../services/api';
import { useTrip } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { usageService } from '../../services/usageService';

const OfflineAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      text: "Namaste. I’m your offline Nepal safety informant. Ask me about emergencies, altitude, trek preparation, permits, packing, or your saved journey.",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isModelReady, setIsModelReady] = useState(false);
  const [modelMode, setModelMode] = useState(() => {
    const savedMode = localStorage.getItem('yatrax_assistant_mode');
    return savedMode === 'offline' ? 'offline' : 'online';
  });
  const [modelError, setModelError] = useState('');
  const { currentTrip } = useTrip();
  const { user } = useAuth();
  const [planUsage, setPlanUsage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user?.email) usageService.getUsage(user.email).then(setPlanUsage).catch(() => {});
  }, [user?.email]);

  useEffect(() => {
    let active = true;
    checkOfflineModel().then((ready) => { if (active) setIsModelReady(ready); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const newMsg = { text, isUser: true, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);
    setModelError('');
    try {
      const latestUsage = await usageService.getUsage(user.email);
      if (latestUsage.limits.chat !== null && latestUsage.usage.chat >= latestUsage.limits.chat) {
        throw new Error('You have used all 10 free AI chats. Upgrade to Premium for unlimited conversations.');
      }
      const response = await sendAssistantMessage(text, currentTrip, messages, modelMode);
      if (response.source === 'online-model' || response.source === 'groq-model' || response.source === 'local-model') {
        setPlanUsage(await usageService.consume(user.email, 'chat'));
      }
      setMessages(prev => [...prev, response]);
    } catch (error) {
      const message = error?.message || 'The selected model is unavailable.';
      setModelError(message);
      setMessages(prev => [...prev, { text: `Unable to answer: ${message}`, isUser: false, isError: true, timestamp: new Date().toISOString() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const chooseMode = (mode) => {
    setModelMode(mode);
    setModelError('');
    localStorage.setItem('yatrax_assistant_mode', mode);
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 7rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/assets/logo.png"
            alt="YatraX Logo"
            style={{ height: '2.8rem', width: 'auto', objectFit: 'contain', backgroundColor: 'white', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)' }}
          />
          <div>
            <h1 style={{ fontSize: '1.75rem', margin: 0, fontFamily: 'var(--font-heading)' }}>YatraX Safety Informant</h1>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>Switch between connected AI and private on-device guidance.</p>
          </div>
        </div>
        
        <Badge variant={isModelReady ? 'green' : 'gray'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem' }}>
          {isModelReady ? <Cpu size={14} /> : (isOnline ? <Wifi size={14} /> : <SignalZero size={14} />)}
          {isModelReady ? 'Local model ready' : 'Safety fallback ready'}
        </Badge>
      </div>

      <div role="group" aria-label="Assistant model" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.4rem', background: 'white', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
        <button type="button" aria-pressed={modelMode === 'online'} onClick={() => chooseMode('online')} disabled={!isOnline} style={{ display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.65rem .9rem', border: 0, borderRadius: 'var(--radius-sm)', cursor: isOnline ? 'pointer' : 'not-allowed', background: modelMode === 'online' ? '#2563EB' : 'transparent', color: modelMode === 'online' ? 'white' : 'var(--color-secondary-text)', fontWeight: 700, opacity: isOnline ? 1 : .5 }}><Sparkles size={16} /> Online AI</button>
        <button type="button" aria-pressed={modelMode === 'offline'} onClick={() => chooseMode('offline')} style={{ display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.65rem .9rem', border: 0, borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: modelMode === 'offline' ? 'var(--color-primary-green)' : 'transparent', color: modelMode === 'offline' ? 'white' : 'var(--color-secondary-text)', fontWeight: 700 }}><Cpu size={16} /> Offline Safety AI</button>
        <span style={{ fontSize: '.78rem', color: 'var(--color-secondary-text)', padding: '0 .45rem' }}>{modelMode === 'offline' ? (isModelReady ? 'Local Gemma endpoint ready' : 'On-device safety engine ready') : 'Internet required'}</span>
      </div>
      {planUsage && <div style={{ margin: '-.45rem 0 1rem', color: 'var(--color-secondary-text)', fontSize: '.78rem' }}>{planUsage.plan === 'premium' ? 'Premium · Unlimited chats' : `${planUsage.usage.chat} of ${planUsage.limits.chat} free AI chats used`}</div>}
      {modelError && <div role="alert" style={{ margin: '-.35rem 0 1rem', color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-sm)', padding: '.65rem .8rem', fontSize: '.85rem' }}>{modelError}</div>}

      {/* Chat Container */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--color-very-light-bg)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ alignSelf: msg.isUser ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: msg.isUser ? 'var(--color-primary-green)' : (msg.isError ? '#FEF2F2' : 'white'),
                color: msg.isUser ? 'white' : 'var(--color-dark-text)',
                boxShadow: 'var(--shadow-sm)',
                borderBottomRightRadius: msg.isUser ? 0 : 'var(--radius-lg)',
                borderBottomLeftRadius: !msg.isUser ? 0 : 'var(--radius-lg)',
                lineHeight: 1.55,
                fontSize: '0.95rem'
              }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary-text)', marginTop: '0.25rem', textAlign: msg.isUser ? 'right' : 'left' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'white', borderBottomLeftRadius: 0, boxShadow: 'var(--shadow-sm)' }}>
              <div className="typing-indicator" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <span className="dot" style={{ width: '7px', height: '7px', backgroundColor: 'var(--color-primary-green)', borderRadius: '50%' }}></span>
                <span className="dot" style={{ width: '7px', height: '7px', backgroundColor: 'var(--color-primary-green)', borderRadius: '50%', animationDelay: '0.2s' }}></span>
                <span className="dot" style={{ width: '7px', height: '7px', backgroundColor: 'var(--color-primary-green)', borderRadius: '50%', animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Suggested Chips Bar */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-gray-200)', backgroundColor: 'white' }}>
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}
          >
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
            placeholder="Ask about altitude, emergencies, trek safety, or permits..."
              className="form-input"
              style={{ paddingRight: '3.5rem', borderRadius: 'var(--radius-md)' }}
            />
            <Button 
              type="submit" 
              variant="primary" 
              size="sm" 
              style={{ position: 'absolute', right: '0.35rem', top: '0.35rem', bottom: '0.35rem', padding: '0 1rem', borderRadius: 'var(--radius-sm)' }} 
              disabled={!input.trim()}
            >
              <Send size={16} />
            </Button>
          </form>

          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingTop: '0.75rem' }}>
            {['I feel sick at altitude', 'What if I get lost?', 'What permits do I need?'].map((suggestion) => (
              <button key={suggestion} type="button" onClick={() => handleSend(suggestion)} disabled={isTyping} style={{ whiteSpace: 'nowrap', padding: '0.45rem 0.7rem', border: '1px solid var(--color-gray-300)', borderRadius: '999px', color: 'var(--color-dark-green)', fontSize: '0.78rem', background: 'var(--color-soft-bg)' }}>
                {suggestion}
              </button>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '0.6rem', fontSize: '0.75rem', color: 'var(--color-secondary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            {modelMode === 'online' ? <Sparkles size={12} color="#2563EB" /> : (isModelReady ? <Cpu size={12} color="var(--color-primary-green)" /> : <ShieldCheck size={12} color="var(--color-primary-green)" />)}
            {modelMode === 'online' ? `Secure online AI · saved trip + recent chat context${currentTrip?.destination ? ` · ${currentTrip.destination}` : ''}` : (isModelReady ? 'Using the private Gemma endpoint — public internet is not required' : 'On-device verified safety engine active — connect the local Gemma endpoint for generative answers')}
          </div>
        </div>
      </Card>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .dot { animation: bounce 1.4s infinite ease-in-out both; }
      `}} />
    </div>
  );
};

export default OfflineAssistantPage;
