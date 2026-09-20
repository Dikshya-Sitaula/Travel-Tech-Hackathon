import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Clock3, ExternalLink, MapPin, Radio, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { emergencyApi } from '../../services/emergencyApi';

const getActive = () => emergencyApi.listActive();
const update = (eventId, action) => emergencyApi.updateStatus(eventId, action);

const EmergencyCenterPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const load = async () => { setError(''); try { setData(await getActive()); } catch (e) { setError(e.message); } };
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      setError('');
      try { const next = await getActive(); if (active) { setData(next); setLastUpdated(new Date()); } }
      catch (e) { if (active) setError(e.message); }
    };
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => { active = false; clearInterval(timer); };
  }, []);
  const act = async (eventId, action) => { setBusy(eventId); try { await update(eventId, action); await load(); } catch (e) { setError(e.message); } finally { setBusy(''); } };

  return <div className="animate-fade-in">
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}><div><div style={{ color: '#B91C1C', fontWeight: 800, fontSize: '.75rem', letterSpacing: '.1em' }}>RESPONDER OPERATIONS</div><h1 style={{ margin: '.25rem 0' }}>Emergency Center</h1><p style={{ color: 'var(--color-secondary-text)', margin: 0 }}>Live server-recorded YatraX emergency events.</p></div><div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', flexWrap: 'wrap' }}><span style={{ color: 'var(--color-secondary-text)', fontSize: '.78rem' }}><Clock3 size={13} /> {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Connecting…'}</span><Button variant="outline" onClick={load}><RefreshCw size={15} /> Refresh</Button></div></div>
    {data && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '.7rem', marginBottom: '1rem' }}><div style={{ padding: '1rem', background: '#FFF', border: '1px solid var(--color-gray-200)', borderRadius: 12 }}><small style={{ color: 'var(--color-secondary-text)' }}>Active alerts</small><strong style={{ display: 'block', fontSize: '1.5rem' }}>{data.total}</strong></div><div style={{ padding: '1rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12 }}><small style={{ color: '#991B1B' }}>Critical</small><strong style={{ display: 'block', fontSize: '1.5rem', color: '#991B1B' }}>{data.critical}</strong></div><div style={{ padding: '1rem', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12 }}><small style={{ color: '#065F46' }}>Monitor</small><strong style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: '#065F46' }}><Activity size={17} /> Live · 5s</strong></div></div>}
    <div style={{ padding: '.8rem 1rem', borderRadius: 10, background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A', marginBottom: '1rem' }}><AlertTriangle size={16} /> A dashboard acknowledgement coordinates the prototype response; it does not confirm police, ambulance, or rescue dispatch.</div>
    {error && <div role="alert" style={{ padding: '1rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: 10 }}>{error}</div>}
    {!data ? <Card>Loading active emergencies…</Card> : data.signals.length === 0 ? <Card style={{ textAlign: 'center', padding: '3rem' }}><ShieldCheck size={36} color="#16A34A" /><h2>No active SOS events</h2></Card> : <div style={{ display: 'grid', gap: '1rem' }}>{data.signals.map((event) => {
      const hasLocation = Number.isFinite(event.latitude) && Number.isFinite(event.longitude);
      const mapUrl = hasLocation ? `https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}#map=16/${event.latitude}/${event.longitude}` : null;
      return <Card key={event.eventId} style={{ borderColor: event.severity === 'CRITICAL' ? '#FCA5A5' : 'var(--color-gray-200)' }}><div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}><div><div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', color: '#991B1B', fontWeight: 800 }}><Radio size={18} /> {event.emergencyType}</div><h2 style={{ margin: '.35rem 0', fontSize: '1.15rem' }}>{event.eventId}</h2><p style={{ margin: 0, color: 'var(--color-secondary-text)' }}>{event.details || 'No additional details supplied.'}</p></div><span style={{ height: 'fit-content', padding: '.35rem .6rem', borderRadius: 999, background: '#FEE2E2', color: '#991B1B', fontWeight: 800, fontSize: '.75rem' }}>{event.severity}</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '.7rem', margin: '1rem 0', fontSize: '.82rem' }}>{[['Device', event.deviceId], ['Status', event.status], ['Channel', event.communicationChannel], ['Gateway', event.gatewayId || '—'], ['Battery', event.battery == null ? 'Unknown' : `${event.battery}%`], ['Location source', event.locationSource], ['Last itinerary stop', event.lastItineraryStop], ['Timestamp', new Date(event.timestamp).toLocaleString()]].map(([label, value]) => <div key={label} style={{ padding: '.7rem', background: 'var(--color-very-light-bg)', borderRadius: 8 }}><small style={{ display: 'block', color: 'var(--color-secondary-text)' }}>{label}</small><strong>{value || '—'}</strong></div>)}</div><div style={{ display: 'flex', gap: '.55rem', flexWrap: 'wrap' }}>{event.status !== 'ACKNOWLEDGED' && <Button size="sm" onClick={() => act(event.eventId, 'acknowledge')} disabled={busy === event.eventId}>Acknowledge</Button>}{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer"><Button variant="outline" size="sm"><MapPin size={14} /> View Location <ExternalLink size={12} /></Button></a>}<Button variant="outline" size="sm" onClick={() => act(event.eventId, 'resolve')} disabled={busy === event.eventId}>Mark Resolved</Button></div></Card>;
    })}</div>}
  </div>;
};

export default EmergencyCenterPage;
