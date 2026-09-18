import React, { useState, useRef } from 'react';
import { Camera, Upload, Info, MapPin, Clock, Ticket, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { landmarkService } from '../../services/landmarkService';

const LandmarkExplorerPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      setResult(null); // Clear previous result
    }
  };

  const identifyLandmark = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    const mockFile = { name: 'mock_image.jpg' }; // Mock file
    const data = await landmarkService.identifyLandmark(mockFile);
    setResult(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          📸 Landmark Explorer
        </h1>
        <p style={{ color: 'var(--color-gray-600)' }}>Point your camera at a landmark and discover its story.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Upload/Preview Area */}
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current.click()}
              style={{ 
                border: '2px dashed var(--color-gray-300)', 
                borderRadius: 'var(--radius-md)',
                padding: '4rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--color-gray-50)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-blue)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-gray-300)'}
            >
              <Camera size={48} color="var(--color-gray-400)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Upload Image or Take Photo</h3>
              <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>Drag and drop an image here, or click to browse</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ width: '100%', height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: '#000' }}>
                <img src={selectedImage} alt="Selected landmark" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button variant="outline" onClick={() => {setSelectedImage(null); setResult(null);}} fullWidth>Change Image</Button>
                <Button variant="primary" onClick={identifyLandmark} disabled={isAnalyzing || result} fullWidth>
                  {isAnalyzing ? 'Analyzing...' : 'Identify Landmark ✨'}
                </Button>
              </div>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
        </Card>

        {/* Loading State */}
        {isAnalyzing && (
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--color-gray-200)', borderTopColor: 'var(--color-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Analyzing image...</h3>
            <p style={{ color: 'var(--color-gray-500)' }}>Preparing travel information</p>
          </Card>
        )}

        {/* Results Area */}
        {result && (
          <Card className="animate-fade-in">
            {result.confidence > 80 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{result.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gray-600)', fontSize: '0.875rem' }}>
                      <MapPin size={14} /> {result.location}
                    </div>
                  </div>
                  <Badge variant="green">Confidence: {result.confidence}%</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}><Info size={16} color="var(--color-blue)" /> About</h4>
                    <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>{result.description}</p>
                  </div>
                  
                  <div>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--color-navy)' }}><Clock size={16} color="var(--color-orange)" /> History</h4>
                    <p style={{ color: 'var(--color-gray-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>{result.history}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'var(--color-gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>BEST TIME</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{result.bestTime}</div>
                    </div>
                    <div style={{ backgroundColor: 'var(--color-gray-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: '0.25rem' }}>ENTRY FEE</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{result.entryFee}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button variant="primary" style={{ flex: 1 }}>Add to My Trip</Button>
                  <Button variant="outline" style={{ flex: 1 }}>Save</Button>
                  <Button variant="ghost" style={{ flex: 1 }}>Explore Nearby</Button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--color-orange-light)', borderRadius: '50%', color: 'white', marginBottom: '1.5rem' }}>
                  <Info size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Couldn't confidently identify this landmark.</h3>
                <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>Please try uploading a clearer photo from a different angle.</p>
                <Button variant="outline" onClick={() => {setSelectedImage(null); setResult(null);}}>Try another photo</Button>
              </div>
            )}
          </Card>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
    </div>
  );
};

export default LandmarkExplorerPage;
