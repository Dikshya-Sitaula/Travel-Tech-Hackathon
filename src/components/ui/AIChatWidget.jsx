import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { sendAssistantMessage } from '../../services/api';

export const AIChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      isUser: true,
      text: "I'm travelling to Pokhara for 3 days. What should I prepare?"
    },
    {
      id: 2,
      isUser: false,
      text: "Here's a simple preparation guide for your Pokhara trip, including essential items, local travel tips, weather considerations, and places you may want to visit:"
    },
    {
      id: 3,
      isUser: false,
      isGuideList: true,
      items: [
        "🎒 Essentials: Lightweight warm jacket, comfortable walking shoes, sunscreen (SPF 50+), and cash (NPR).",
        "🌄 Top Sights: Sunrise at Sarangkot, boating on Phewa Lake to Tal Barahi Temple, and Peace Pagoda hike.",
        "🌧️ Weather: Mild days (18-25°C), cool mornings; pack a compact raincoat or umbrella.",
        "💡 Local Tip: Rent a bicycle or electric scooter along Lakeside for relaxed exploring!"
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "What permits do I need for trekking?",
    "Best places to visit in Kathmandu?",
    "What local Nepalese dishes should I try?",
    "How to prevent altitude sickness in Everest?"
  ];

  const handleSend = async (queryToSend) => {
    const textToSend = queryToSend || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      isUser: true,
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryToSend) setInput('');
    setLoading(true);

    try {
      const aiResponse = await sendAssistantMessage(textToSend);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          isUser: false,
          text: aiResponse.text
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          isUser: false,
          text: "I am ready to help you plan your journey in Nepal. What specific destination or activity would you like to know about?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-gray-200)',
        overflow: 'hidden',
        maxWidth: '850px',
        margin: '0 auto'
      }}
    >
      {/* Widget Header */}
      <div 
        style={{
          backgroundColor: 'var(--color-dark-green)',
          color: 'white',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div 
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <Bot size={22} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
              YatraX AI Assistant <Sparkles size={14} color="var(--color-golden-yellow)" />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-mint-green)', opacity: 0.9 }}>
              Ask travel questions, safety tips & packing guidance for Nepal
            </div>
          </div>
        </div>

        <span 
          style={{
            backgroundColor: 'rgba(158, 210, 184, 0.2)',
            color: 'var(--color-mint-green)',
            fontSize: '0.75rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80' }}></span> Demo AI Active
        </span>
      </div>

      {/* Messages Container */}
      <div 
        style={{
          padding: '1.5rem',
          maxHeight: '380px',
          overflowY: 'auto',
          backgroundColor: 'var(--color-soft-bg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
              animation: 'fadeIn 0.25s ease'
            }}
          >
            {!msg.isUser && (
              <div 
                style={{ 
                  width: '2.25rem', 
                  height: '2.25rem', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-primary-green)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0 
                }}
              >
                <Bot size={16} />
              </div>
            )}

            <div 
              style={{
                maxWidth: '80%',
                padding: '0.9rem 1.2rem',
                borderRadius: msg.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                backgroundColor: msg.isUser ? 'var(--color-primary-green)' : '#FFFFFF',
                color: msg.isUser ? 'white' : 'var(--color-dark-text)',
                boxShadow: msg.isUser ? 'none' : 'var(--shadow-sm)',
                border: msg.isUser ? 'none' : '1px solid var(--color-gray-200)',
                fontSize: '0.925rem',
                lineHeight: 1.55
              }}
            >
              {msg.text}

              {msg.isGuideList && msg.items && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {msg.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        backgroundColor: 'var(--color-light-mint)', 
                        padding: '0.6rem 0.85rem', 
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.875rem',
                        color: 'var(--color-dark-green)',
                        fontWeight: 500
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.isUser && (
              <div 
                style={{ 
                  width: '2.25rem', 
                  height: '2.25rem', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-dark-green)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0 
                }}
              >
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div 
              style={{ 
                width: '2.25rem', 
                height: '2.25rem', 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-primary-green)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Bot size={16} />
            </div>
            <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#FFFFFF', borderRadius: '18px', fontSize: '0.875rem', color: 'var(--color-secondary-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={14} className="animate-spin" /> YatraX AI is thinking...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div 
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-gray-200)',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary-text)', alignSelf: 'center', flexShrink: 0 }}>Try asking:</span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            style={{
              padding: '0.35rem 0.85rem',
              backgroundColor: 'var(--color-light-mint)',
              color: 'var(--color-dark-green)',
              borderRadius: '20px',
              fontSize: '0.775rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid var(--color-gray-200)',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-green)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-light-mint)';
              e.currentTarget.style.color = 'var(--color-dark-green)';
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{
          display: 'flex',
          padding: '1rem 1.5rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--color-gray-200)',
          gap: '0.75rem'
        }}
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask YatraX AI anything about traveling in Nepal..."
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-gray-300)',
            outline: 'none',
            fontSize: '0.925rem',
            backgroundColor: 'var(--color-soft-bg)'
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: input.trim() ? 'var(--color-primary-green)' : 'var(--color-gray-300)',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: input.trim() ? 'var(--shadow-sm)' : 'none'
          }}
        >
          <span>Send</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
