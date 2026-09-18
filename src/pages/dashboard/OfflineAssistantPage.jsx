import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Bot, Wifi, SignalZero } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { sendAssistantMessage } from '../../services/api';
import { useTrip } from '../../context/TripContext';

const OfflineAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      text: "Namaste! 🙏 I'm your YatraX AI Assistant. Ask me anything about packing, trekking, local food, or safety in Nepal!",
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

    const response = await sendAssistantMessage(text, currentTrip);
    
    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  const quickPrompts = [
    "What should I pack for Nepal?",
    "What can I do in Pokhara?",
    "What is the best time to visit Mustang?",
    "Give me local food recommendations.",
    "What should I know before trekking?"
  ];

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 7rem)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem', fontFamily: 'var(--font-heading)' }}>
            <Bot color="var(--color-primary-green)" size={28} /> YatraX AI Assistant
          </h1>
          <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>Your intelligent travel companion for Nepal.</p>
        </div>
        
        <Badge variant={isOnline ? 'green' : 'gray'} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem' }}>
          {isOnline ? <Wifi size={14} /> : <SignalZero size={14} />}
          {isOnline ? 'Online Ready' : 'Offline Ready'}
        </Badge>
      </div>

      {/* Chat Container */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--color-very-light-bg)' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ alignSelf: msg.isUser ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: msg.isUser ? 'var(--color-primary-green)' : 'white',
                color: msg.isUser ? 'white' : 'var(--color-dark-text)',
                boxShadow: 'var(--shadow-sm)',
                borderBottomRightRadius: msg.isUser ? 0 : 'var(--radius-lg)',
                borderBottomLeftRadius: !msg.isUser ? 0 : 'var(--radius-lg)',
                lineHeight: 1.55,
                fontSize: '0.95rem'
              }}>
                {msg.text}
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
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', scrollbarWidth: 'none' }}>
            {quickPrompts.map(p => (
              <Badge 
                key={p} 
                variant="gray" 
                onClick={() => handleSend(p)}
                style={{ 
                  cursor: 'pointer', 
                  whiteSpace: 'nowrap', 
                  border: '1px solid var(--color-mint-green)',
                  backgroundColor: 'var(--color-very-light-bg)',
                  color: 'var(--color-dark-green)',
                  fontWeight: 500,
                  padding: '0.4rem 0.85rem'
                }}
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
              placeholder="Ask YatraX anything about traveling in Nepal..."
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
          
          <div style={{ textAlign: 'center', marginTop: '0.6rem', fontSize: '0.75rem', color: 'var(--color-secondary-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            <Sparkles size={12} color="var(--color-primary-green)" /> Powered by YatraX Travel AI
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
