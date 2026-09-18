import React, { useState, useEffect, useRef } from 'react';
import { Send, SignalZero, Wifi, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { offlineTripService } from '../../services/offlineTripService';
import { useTrip } from '../../context/TripContext';

const OfflineAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hi there! I'm your offline travel assistant. I can help you with your itinerary, emergency info, and basic translations even without an internet connection.",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { currentTrip } = useTrip();
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    
    const newMsg = { text, isUser: true, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    const response = await offlineTripService.queryAssistant(text, currentTrip);
    
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  const quickPrompts = [
    "My next activity",
    "Show my itinerary",
    "Emergency help",
    "Nepali phrases",
    "Safety tips"
  ];

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🤖 Offline AI Assistant
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>Your travel companion when connectivity disappears.</p>
        </div>
        
        <Badge variant={isOnline ? 'green' : 'red'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          {isOnline ? <Wifi size={14} /> : <SignalZero size={14} />}
          {isOnline ? 'ONLINE: Cloud services available' : 'OFFLINE MODE: No internet connection'}
        </Badge>
      </div>

      {/* Chat Area */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ alignSelf: msg.isUser ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: msg.isUser ? 'var(--color-blue)' : 'var(--color-gray-100)',
                color: msg.isUser ? 'white' : 'var(--color-navy)',
                borderBottomRightRadius: msg.isUser ? 0 : 'var(--radius-lg)',
                borderBottomLeftRadius: !msg.isUser ? 0 : 'var(--radius-lg)'
              }}>
                {msg.text}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: '0.25rem', textAlign: msg.isUser ? 'right' : 'left' }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ alignSelf: 'flex-start', padding: '1rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-gray-100)', borderBottomLeftRadius: 0 }}>
              <div className="typing-indicator" style={{ display: 'flex', gap: '4px' }}>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-gray-400)', borderRadius: '50%' }}></span>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-gray-400)', borderRadius: '50%', animationDelay: '0.2s' }}></span>
                <span className="dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--color-gray-400)', borderRadius: '50%', animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--color-gray-200)', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none' }}>
            {quickPrompts.map(p => (
              <Badge 
                key={p} 
                variant="gray" 
                onClick={() => handleSend(p)}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap', border: '1px solid var(--color-gray-300)' }}
              >
                {p}
              </Badge>
            ))}
          </div>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ display: 'flex', gap: '0.5rem', position: 'relative' }}
          >
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about your trip..."
              className="form-input"
              style={{ paddingRight: '3rem' }}
            />
            <Button type="submit" variant="primary" size="sm" style={{ position: 'absolute', right: '0.25rem', top: '0.25rem', bottom: '0.25rem', padding: '0 0.75rem' }} disabled={!input.trim()}>
              <Send size={16} />
            </Button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            <Sparkles size={12} /> Powered by local AI
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
