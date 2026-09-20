import React, { useState, useRef } from 'react';
import { Camera, MapPin, Clock, Info, Sparkles, BookOpen, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { analyzeLandmark } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { usageService } from '../../services/usageService';

const LandmarkExplorerPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const [planUsage, setPlanUsage] = useState(null);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (user?.email) usageService.getUsage(user.email).then(setPlanUsage).catch(() => {});
  }, [user?.email]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleIdentify = async () => {
    if (!selectedImage) return;
    setError('');
    setIsAnalyzing(true);
    try {
      const latestUsage = await usageService.getUsage(user.email);
      if (latestUsage.limits.landmark !== null && latestUsage.usage.landmark >= latestUsage.limits.landmark) {
        throw new Error('Your free landmark scan has been used. Upgrade to Premium for unlimited scans.');
      }
      const data = await analyzeLandmark(selectedFile);
      setPlanUsage(await usageService.consume(user.email, 'landmark'));
      setResult(data);
    } catch (analysisError) {
      setError(analysisError.message || 'Unable to analyze this landmark.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
          <Camera size={28} color="var(--color-primary-green)" /> Landmark Explorer
        </h1>
        <p style={{ color: 'var(--color-secondary-text)' }}>Identify Nepalese landmarks from an uploaded photo or camera capture.</p>
        {planUsage && <div style={{ display: 'inline-flex', marginTop: '.7rem', padding: '.45rem .7rem', borderRadius: '999px', background: 'var(--color-light-mint)', color: 'var(--color-dark-green)', fontSize: '.78rem', fontWeight: 700 }}>{planUsage.plan === 'premium' ? 'Premium · Unlimited scans' : `${planUsage.usage.landmark} of ${planUsage.limits.landmark} free scan used`}</div>}
      </div>

      {error && <div role="alert" style={{ padding: '.8rem 1rem', marginBottom: '1rem', borderRadius: 'var(--radius-md)', color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Upload & Preview Card */}
        <Card style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)' }}>
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                border: '2px dashed var(--color-mint-green)', 
                borderRadius: 'var(--radius-md)',
                padding: '4rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--color-very-light-bg)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-green)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-mint-green)'}
            >
              <div style={{ width: '4rem', height: '4rem', backgroundColor: 'var(--color-light-mint)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-dark-green)', marginBottom: '1rem' }}>
                <Camera size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Upload Image or Take Photo</h3>
              <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem' }}>Click to select a photo of a Nepalese landmark</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ width: '100%', height: '280px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--color-dark-green)', position: 'relative' }}>
                <img src={selectedImage} alt="Selected landmark preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button variant="outline" onClick={() => { setSelectedImage(null); setSelectedFile(null); setResult(null); }} fullWidth>Change Image</Button>
                <Button variant="primary" onClick={handleIdentify} disabled={isAnalyzing || result} fullWidth>
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Landmark ✨'}
                </Button>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" capture="environment" style={{ display: 'none' }} />
        </Card>

        {/* Loading State */}
        {isAnalyzing && (
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ width: '44px', height: '44px', border: '3px solid var(--color-light-mint)', borderTopColor: 'var(--color-primary-green)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.25rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Analyzing landmark image...</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>Matching architecture and historical features</p>
          </Card>
        )}

        {/* Result Card */}
        {result && (
          <Card className="animate-fade-in" style={{ borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)', color: 'var(--color-dark-green)' }}>{result.name}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-secondary-text)', fontSize: '0.9rem' }}>
                  <MapPin size={15} color="var(--color-primary-green)" /> {result.location}
                </div>
              </div>
              <Badge variant="green" style={{ fontSize: '0.85rem' }}>Match: {result.confidence}%</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--color-dark-green)', fontFamily: 'var(--font-heading)' }}>
                  <Info size={16} /> Overview
                </h4>
                <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>{result.description}</p>
              </div>
              
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '0.35rem', color: 'var(--color-dark-green)', fontFamily: 'var(--font-heading)' }}>
                  <BookOpen size={16} /> History & Cultural Facts
                </h4>
                <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.9rem', lineHeight: 1.6 }}>{result.history}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--color-light-mint)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>BEST TIME TO VISIT</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-dark-text)' }}>{result.bestTime}</div>
                </div>
                <div style={{ backgroundColor: 'var(--color-light-mint)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-dark-green)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>ENTRY FEE</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark-text)' }}>{result.entryFee}</div>
                </div>
              </div>
            </div>

            <Button variant="primary" fullWidth style={{ fontWeight: 600 }}>
              <Check size={16} /> Add to My Saved Trip
            </Button>
          </Card>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
    </div>
  );
};

export default LandmarkExplorerPage;
