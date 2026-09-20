import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock3, ExternalLink, MapPin, RadioTower, RefreshCw, Send, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { emergencyApi } from '../../services/emergencyApi';

const isPending = (status) => String(status || '').toUpperCase() !== 'RESOLVED';

const MonitoringDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);
  const load = async () => { try { setError(''); setData(await emergencyApi.listActive()); setUpdatedAt(new Date()); } catch (loadError) { setError(loadError.message || 'Unable to reach the SOS monitor.'); } };
  useEffect(() => { load(); const timer = setInterval(load, 5000); return () => clearInterval(timer); }, []);
  const run = async (eventId, action) => { setBusy(eventId); try { await action(); await load(); } catch (actionError) { setError(actionError.message); } finally { setBusy(''); } };
  const alerts = data?.signals || [];
  const critical = alerts.filter((alert) => alert.severity === 'CRITICAL').length;

  return <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
      <div><div style={{ color: '#B91C1C', fontWeight: 800, letterSpacing: '.1em', fontSize: '.76rem' }}>YATRAX SAFETY OPERATIONS</div><h1 style={{ fontSize: '2rem', margin: '.25rem 0', color: 'var(--color-dark-green)' }}>SOS monitoring center</h1><p style={{ color: 'var(--color-secondary-text)', margin: 0 }}>Live incoming alerts, responder acknowledgement, and resolution tracking.</p></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}><span style={{ fontSize: '.75rem', color: 'var(--color-secondary-text)' }}><Clock3 size={13} /> {updatedAt ? updatedAt.toLocaleTimeString() : 'Connecting…'}</span><Button variant="outline" onClick={load}><RefreshCw size={15} /> Refresh</Button></div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '.75rem', marginBottom: '1rem' }}>
      {[["Pending alerts", alerts.filter((alert) => isPending(alert.status)).length, ShieldAlert, '#B91C1C'], ['Critical', critical, AlertTriangle, '#B91C1C'], ['Monitor', 'Live · 5s', Activity, '#166534']].map(([label, value, Icon, color]) => <Card key={label} style={{ padding: '1rem' }}><small style={{ color: 'var(--color-secondary-text)' }}>{label}</small><strong style={{ display: 'flex', alignItems: 'center', gap: '.45rem', marginTop: '.35rem', fontSize: '1.35rem', color }}><Icon size={18} /> {value}</strong></Card>)}
    </div>
    <div style={{ padding: '.85rem 1rem', borderRadius: 10, background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A', marginBottom: '1rem', fontSize: '.84rem', lineHeight: 1.45 }}><AlertTriangle size={16} /> Alerts remain <strong>PENDING</strong> until an operator acknowledges them. They become <strong>RESOLVED</strong> only after an inbound <code>DONE SOS-…</code> SMS reply is received. A delivery log never means police, ambulance, or rescue dispatch.</div>
    {error && <div role="alert" style={{ padding: '1rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: 10, marginBottom: '1rem' }}>{error}</div>}
    {!data ? <Card>Loading SOS monitor…</Card> : alerts.length === 0 ? <Card style={{ textAlign: 'center', padding: '3rem' }}><CheckCircle2 size={36} color="#16A34A" /><h2>No active SOS alerts</h2><p style={{ color: 'var(--color-secondary-text)' }}>New alerts will appear automatically.</p></Card> : <div style={{ display: 'grid', gap: '1rem' }}>{alerts.map((alert) => {
      const hasLocation = Number.isFinite(alert.latitude) && Number.isFinite(alert.longitude);
      const mapUrl = hasLocation ? `https://www.openstreetmap.org/?mlat=${alert.latitude}&mlon=${alert.longitude}#map=16/${alert.latitude}/${alert.longitude}` : null;
      const pending = isPending(alert.status);
      const notification = alert.notification || {};
      return <Card key={alert.eventId} style={{ borderColor: alert.severity === 'CRITICAL' ? '#FCA5A5' : 'var(--color-gray-200)' }}><div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.8rem' }}><div><div style={{ color: '#991B1B', fontWeight: 800, fontSize: '.8rem' }}><RadioTower size={16} /> {alert.emergencyType} · {alert.severity}</div><h2 style={{ margin: '.35rem 0', fontSize: '1.12rem' }}>{alert.eventId}</h2><p style={{ margin: 0, color: 'var(--color-secondary-text)' }}>{alert.details || 'No responder details supplied.'}</p></div><span style={{ height: 'fit-content', padding: '.35rem .6rem', borderRadius: 999, background: pending ? '#FFF7ED' : '#ECFDF5', color: pending ? '#9A3412' : '#166534', fontSize: '.75rem', fontWeight: 800 }}>{pending ? `PENDING · ${alert.status}` : 'RESOLVED'}</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(165px, 1fr))', gap: '.65rem', margin: '1rem 0', fontSize: '.8rem' }}>{[['Location', alert.location], ['Channel', alert.communicationChannel], ['SMS forwarding', notification.status === 'SENT' ? 'Sent to configured responder' : notification.status === 'NOT_CONFIGURED' ? 'Not configured' : notification.status || 'Not recorded'], ['Received', new Date(alert.receivedAt).toLocaleString()]].map(([label, value]) => <div key={label} style={{ padding: '.7rem', background: 'var(--color-very-light-bg)', borderRadius: 8 }}><small style={{ display: 'block', color: 'var(--color-secondary-text)' }}>{label}</small><strong>{value || '—'}</strong></div>)}</div><div style={{ display: 'flex', gap: '.55rem', flexWrap: 'wrap' }}>{pending && alert.status !== 'ACKNOWLEDGED' && <Button size="sm" onClick={() => run(alert.eventId, () => emergencyApi.updateStatus(alert.eventId, 'acknowledge', 'YatraX monitoring operator'))} disabled={busy === alert.eventId}>Acknowledge</Button>}{mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer"><Button variant="outline" size="sm"><MapPin size={14} /> Map <ExternalLink size={12} /></Button></a>}{import.meta.env.VITE_SOS_DEMO_MODE !== 'false' && pending && <Button variant="outline" size="sm" onClick={() => run(alert.eventId, () => emergencyApi.recordDemoDone(alert.eventId))} disabled={busy === alert.eventId}><Send size={14} /> Simulate DONE reply</Button>}</div></Card>;
    })}</div>}
  </div>;
};

export default MonitoringDashboard;
