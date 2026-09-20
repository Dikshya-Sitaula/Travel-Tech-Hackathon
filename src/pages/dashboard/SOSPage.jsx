import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Cloud, MapPin, RadioTower, RefreshCw, Send, ShieldAlert, WifiOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { gpsService } from '../../services/gpsService';
import { sosService, SOS_STATES } from '../../services/sosService';
import { useTrip } from '../../context/TripContext';

const INCIDENTS = ['Injury', 'Altitude sickness', 'Lost or stranded', 'Weather danger', 'Other emergency'];
const DELIVERY = {
  online: { title: 'Online SOS', copy: 'Send the alert and live location to the YatraX monitoring server.', scenario: 'production', icon: Cloud },
  mesh: { title: 'Offline Mesh Proxy', copy: 'Create a compact SOS packet through the demo relay. It queues if the gateway cannot be reached.', scenario: 'mesh-proxy', icon: RadioTower },
};

const SOSPage = () => {
  const { currentTrip } = useTrip();
  const [incident, setIncident] = useState('Injury');
  const [severity, setSeverity] = useState('Critical');
  const [details, setDetails] = useState('');
  const [delivery, setDelivery] = useState('online');
  const [location, setLocation] = useState(gpsService.getLastKnownLocation());
  const [locationNote, setLocationNote] = useState('');
  const [serverUrl, setServerUrl] = useState(sosService.getServerUrl());
  const [serverStatus, setServerStatus] = useState('Not tested');
  const [status, setStatus] = useState(sosService.getSOSStatus());
  const [pipeline, setPipeline] = useState(SOS_STATES.IDLE);
  const [hold, setHold] = useState(0);
  const [sending, setSending] = useState(false);
  const holdTimer = useRef(null);
  const progressTimer = useRef(null);

  const refreshLocation = async () => {
    setLocationNote('Getting location…');
    try {
      const next = await gpsService.getCurrentLocation();
      setLocation(next);
      setLocationNote(next.locationSource === 'LIVE_GPS' ? 'Live GPS ready' : 'Live GPS unavailable — using last known location');
    } catch (error) { setLocationNote(error.message); }
  };
  useEffect(() => { refreshLocation(); return () => { clearTimeout(holdTimer.current); clearInterval(progressTimer.current); }; }, []);

  const testServer = async () => {
    setServerStatus('Testing…');
    try { sosService.setServerUrl(serverUrl); await sosService.checkServer(); setServerStatus('Connected'); }
    catch (error) { setServerStatus(error.message || 'Could not reach server'); }
  };
  const selectDelivery = (next) => { setDelivery(next); sosService.setDemoScenario(DELIVERY[next].scenario); };
  const send = async () => {
    setSending(true);
    sosService.setServerUrl(serverUrl);
    sosService.setDemoScenario(DELIVERY[delivery].scenario);
    try {
      const result = await sosService.triggerSOS({ emergencyType: incident, severity, details, lastItineraryStop: currentTrip?.destination || 'Unknown region' }, setPipeline);
      setStatus(result);
    } catch (error) { setStatus({ status: SOS_STATES.ERROR, error: error.message }); }
    finally { setSending(false); }
  };
  const beginHold = () => {
    if (sending || status) return;
    const started = Date.now();
    progressTimer.current = setInterval(() => setHold(Math.min(100, Math.round((Date.now() - started) / 30))), 80);
    holdTimer.current = setTimeout(() => { clearInterval(progressTimer.current); setHold(100); send(); }, 3000);
  };
  const cancelHold = () => { clearTimeout(holdTimer.current); clearInterval(progressTimer.current); if (!sending) setHold(0); };
  const reset = () => { sosService.clearStatus(); setStatus(null); setPipeline(SOS_STATES.IDLE); setHold(0); };
  const selected = DELIVERY[delivery];
  const LocationIcon = location?.locationSource === 'LIVE_GPS' ? MapPin : WifiOff;
  const success = status?.status === SOS_STATES.GATEWAY_RECEIVED || status?.status === SOS_STATES.SMS_SENT;
  const queued = status?.status === SOS_STATES.QUEUED_OFFLINE;

  return <div className="animate-fade-in" style={{ maxWidth: 920, margin: '0 auto', paddingBottom: '3rem' }}>
    <div style={{ marginBottom: '1.5rem' }}><div style={{ color: '#B91C1C', fontWeight: 800, fontSize: '.75rem', letterSpacing: '.1em' }}>YATRAX SAFETY</div><h1 style={{ margin: '.3rem 0' }}>Emergency SOS</h1><p style={{ margin: 0, color: 'var(--color-secondary-text)' }}>Choose a delivery path. YatraX records the true outcome—sent, relayed, or safely queued.</p></div>
    <Card style={{ padding: '1.1rem', marginBottom: '1rem', background: '#FFFBEB', borderColor: '#FDE68A' }}><strong>For immediate danger, call local emergency services.</strong><span style={{ display: 'block', marginTop: '.3rem', color: '#92400E', fontSize: '.82rem' }}>This prototype logs alerts for the YatraX monitor; it does not automatically dispatch rescue services.</span></Card>
    <Card style={{ padding: '1.25rem', marginBottom: '1rem' }}><strong>What is happening?</strong><div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', margin: '.75rem 0 1rem' }}>{INCIDENTS.map((item) => <button key={item} type="button" onClick={() => setIncident(item)} style={{ border: `1px solid ${incident === item ? '#DC2626' : 'var(--color-gray-300)'}`, color: incident === item ? '#991B1B' : 'var(--color-secondary-text)', background: incident === item ? '#FEE2E2' : 'white', borderRadius: 999, padding: '.5rem .7rem', fontWeight: 700 }}>{item}</button>)}</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '.75rem' }}><label style={{ display: 'grid', gap: '.35rem', fontWeight: 700 }}>Severity<select value={severity} onChange={(event) => setSeverity(event.target.value)} style={{ padding: '.65rem', border: '1px solid var(--color-gray-300)', borderRadius: 8 }}>{['Critical', 'Urgent', 'High', 'Medium'].map((item) => <option key={item}>{item}</option>)}</select></label><label style={{ display: 'grid', gap: '.35rem', fontWeight: 700 }}>Details<textarea value={details} onChange={(event) => setDetails(event.target.value)} rows="2" placeholder="Symptoms, people affected, nearby marker…" style={{ resize: 'vertical', padding: '.65rem', border: '1px solid var(--color-gray-300)', borderRadius: 8, font: 'inherit' }} /></label></div></Card>
    <Card style={{ padding: '1.25rem', marginBottom: '1rem' }}><strong>Choose delivery path</strong><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '.75rem', marginTop: '.75rem' }}>{Object.entries(DELIVERY).map(([key, item]) => { const Icon = item.icon; const active = delivery === key; return <button key={key} type="button" onClick={() => selectDelivery(key)} style={{ textAlign: 'left', padding: '1rem', borderRadius: 12, border: `2px solid ${active ? '#0F766E' : 'var(--color-gray-200)'}`, background: active ? '#ECFDF5' : 'white', cursor: 'pointer' }}><Icon size={22} color={active ? '#0F766E' : '#64748B'} /><strong style={{ display: 'block', margin: '.45rem 0 .25rem', color: 'var(--color-dark-green)' }}>{item.title}</strong><span style={{ color: 'var(--color-secondary-text)', fontSize: '.8rem', lineHeight: 1.4 }}>{item.copy}</span></button>; })}</div></Card>
    <Card style={{ padding: '1rem', marginBottom: '1rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: '.8rem', flexWrap: 'wrap' }}><div><strong><LocationIcon size={16} /> Location</strong><div style={{ color: 'var(--color-secondary-text)', marginTop: '.3rem', fontSize: '.82rem' }}>{location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)} · ±${location.accuracy}m` : 'No saved location'}</div><small style={{ color: location?.locationSource === 'LIVE_GPS' ? '#166534' : '#92400E' }}>{locationNote || 'Waiting for location'}</small></div><Button variant="outline" size="sm" onClick={refreshLocation}><RefreshCw size={14} /> Refresh GPS</Button></div><div style={{ marginTop: '.8rem', borderTop: '1px solid var(--color-gray-200)', paddingTop: '.8rem' }}><small style={{ display: 'block', color: 'var(--color-secondary-text)', marginBottom: '.4rem' }}>Monitoring server (needed for online delivery and proxy logging)</small><div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap' }}><input value={serverUrl} onChange={(event) => setServerUrl(event.target.value)} placeholder="http://192.168.x.x:5174" style={{ flex: '1 1 260px', padding: '.6rem', border: '1px solid var(--color-gray-300)', borderRadius: 8 }} /><Button variant="outline" size="sm" onClick={testServer}>Test</Button></div><small style={{ color: serverStatus === 'Connected' ? '#166534' : 'var(--color-secondary-text)' }}>{serverStatus}</small></div></Card>
    <Card style={{ padding: '2rem', textAlign: 'center', background: status ? (queued ? '#FFFBEB' : success ? '#ECFDF5' : '#FEF2F2') : '#FEF2F2', borderColor: status ? (queued ? '#FDE68A' : success ? '#A7F3D0' : '#FCA5A5') : '#FCA5A5' }}>{status ? <><CheckCircle2 size={42} color={queued ? '#D97706' : success ? '#047857' : '#B91C1C'} /><h2 style={{ margin: '.6rem 0' }}>{success ? (status.communicationChannel === 'MESH_PROXY_DEMO' ? 'Mesh proxy received' : 'Online SOS received') : queued ? 'SOS safely queued' : 'SOS could not be sent'}</h2><p style={{ color: 'var(--color-secondary-text)' }}>{success ? `Event ${status.eventId} is visible in the YatraX monitoring center.` : queued ? 'The event stays on this device and retries without duplication when a delivery path is available.' : status.error}</p><div style={{ fontSize: '.82rem', marginBottom: '1rem' }}><strong>Channel:</strong> {status.communicationChannel || '—'} · <strong>State:</strong> {status.status}</div><Button variant="outline" onClick={reset}>Create another SOS</Button></> : <><button type="button" aria-label="Hold for three seconds to activate SOS" onPointerDown={beginHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold} style={{ width: 170, height: 170, borderRadius: '50%', border: '8px solid #FCA5A5', color: 'white', background: `conic-gradient(#991B1B ${hold}%, #DC2626 ${hold}%)`, cursor: 'pointer', touchAction: 'none' }}><ShieldAlert size={38} /><strong style={{ display: 'block', marginTop: '.35rem' }}>{hold ? `${hold}%` : 'ACTIVATE SOS'}</strong></button><h2 style={{ color: '#991B1B', margin: '1rem 0 .25rem' }}>{sending ? (pipeline === SOS_STATES.SENDING_SERVER ? 'Sending online SOS…' : pipeline === SOS_STATES.SENDING_LORA ? 'Relaying proxy packet…' : 'Preparing SOS…') : `Hold for 3 seconds · ${selected.title}`}</h2><p style={{ color: '#7F1D1D', margin: 0, fontSize: '.85rem' }}>Release early to cancel.</p></>}</Card>
  </div>;
};

export default SOSPage;
