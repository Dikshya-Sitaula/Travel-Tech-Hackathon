import React, { useEffect, useState } from 'react';
import { BarChart3, Crown, MessageSquare, Camera, Map, RefreshCw, Users, WalletCards } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { usageService } from '../../services/usageService';

const money = (value) => `NPR ${Number(value || 0).toLocaleString()}`;

const RevenueDashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try { setData(await usageService.getRevenue()); }
    catch (loadError) { setError(loadError.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const metrics = data ? [
    { label: 'Monthly recurring revenue', value: money(data.monthlyRecurringRevenue), note: `${data.premiumUsers} premium members`, icon: WalletCards },
    { label: 'Annual run rate', value: money(data.annualRunRate), note: 'Based on current MRR', icon: BarChart3 },
    { label: 'Total users', value: data.totalUsers, note: `${data.freeUsers} free · ${data.premiumUsers} premium`, icon: Users },
    { label: 'Free → Premium', value: `${data.conversionRate}%`, note: `Premium is ${money(data.premiumPrice)}/month`, icon: Crown },
  ] : [];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div><div style={{ color: 'var(--color-primary-green)', fontSize: '.78rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Business console</div><h1 style={{ margin: '.25rem 0', fontSize: '2rem', color: 'var(--color-dark-green)' }}>Revenue & plan usage</h1><p style={{ margin: 0, color: 'var(--color-secondary-text)' }}>Server-recorded product usage and premium revenue—no estimated sales.</p></div>
        <Button variant="outline" onClick={load} disabled={loading}><RefreshCw size={16} /> {loading ? 'Refreshing…' : 'Refresh data'}</Button>
      </div>

      {error && <div role="alert" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: '#FEF2F2', color: '#B91C1C', marginBottom: '1rem' }}>{error}</div>}
      {loading && !data ? <Card>Loading revenue data…</Card> : data && <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {metrics.map(({ label, value, note, icon: Icon }) => <Card key={label} style={{ padding: '1.25rem' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: 'var(--color-secondary-text)', fontSize: '.82rem', fontWeight: 700 }}>{label}</span><Icon size={19} color="var(--color-primary-green)" /></div><strong style={{ display: 'block', fontSize: '1.7rem', margin: '.75rem 0 .25rem', color: 'var(--color-dark-green)' }}>{value}</strong><small style={{ color: 'var(--color-secondary-text)' }}>{note}</small></Card>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(300px, .85fr)', gap: '1rem' }}>
          <Card style={{ padding: '1.4rem', overflowX: 'auto' }}><h2 style={{ fontSize: '1.15rem', margin: '0 0 1rem' }}>Feature consumption</h2><div style={{ display: 'grid', gap: '.8rem' }}>{[
            { label: 'AI itineraries', value: data.featureTotals.itinerary, icon: Map, color: '#0F766E' },
            { label: 'LLM chats', value: data.featureTotals.chat, icon: MessageSquare, color: '#2563EB' },
            { label: 'Landmark scans', value: data.featureTotals.landmark, icon: Camera, color: '#9333EA' },
          ].map(({ label, value, icon: Icon, color }) => <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.9rem', border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)' }}><div style={{ padding: '.55rem', borderRadius: '.6rem', background: `${color}12`, color }}><Icon size={18} /></div><span style={{ flex: 1, fontWeight: 650 }}>{label}</span><strong style={{ fontSize: '1.15rem' }}>{value}</strong></div>)}</div></Card>
          <Card style={{ padding: '1.4rem', background: 'linear-gradient(145deg, #073B35, #0A6658)', color: 'white' }}><Crown size={28} color="#FDE68A" /><h2 style={{ margin: '.8rem 0 .4rem', color: 'white' }}>Premium foundation</h2><div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{money(data.premiumPrice)}<span style={{ fontSize: '.85rem', opacity: .72 }}>/month</span></div><p style={{ color: 'rgba(255,255,255,.82)', lineHeight: 1.55 }}>Premium usage is unlimited. Revenue starts counting only when a user record has an active premium plan.</p><div style={{ borderTop: '1px solid rgba(255,255,255,.18)', paddingTop: '.8rem', fontSize: '.82rem', color: 'rgba(255,255,255,.76)' }}>Payment checkout and subscription verification are the next integration step.</div></Card>
        </div>

        <Card style={{ padding: '1.4rem', marginTop: '1rem', overflowX: 'auto' }}><h2 style={{ fontSize: '1.15rem', margin: '0 0 1rem' }}>User plan ledger</h2>{data.users.length === 0 ? <p style={{ color: 'var(--color-secondary-text)' }}>No usage has been recorded yet.</p> : <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}><thead><tr>{['User', 'Plan', 'Itineraries', 'Chats', 'Landmarks', 'Last active'].map((heading) => <th key={heading} style={{ textAlign: 'left', padding: '.7rem', borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-secondary-text)', fontSize: '.76rem', textTransform: 'uppercase' }}>{heading}</th>)}</tr></thead><tbody>{data.users.map((user) => <tr key={user.userId}><td style={{ padding: '.8rem .7rem', borderBottom: '1px solid var(--color-gray-200)', fontWeight: 650 }}>{user.userId}</td><td style={{ padding: '.8rem .7rem', borderBottom: '1px solid var(--color-gray-200)', textTransform: 'capitalize' }}>{user.plan}</td><td style={{ padding: '.8rem .7rem', borderBottom: '1px solid var(--color-gray-200)' }}>{user.usage.itinerary}</td><td style={{ padding: '.8rem .7rem', borderBottom: '1px solid var(--color-gray-200)' }}>{user.usage.chat}</td><td style={{ padding: '.8rem .7rem', borderBottom: '1px solid var(--color-gray-200)' }}>{user.usage.landmark}</td><td style={{ padding: '.8rem .7rem', borderBottom: '1px solid var(--color-gray-200)', color: 'var(--color-secondary-text)' }}>{new Date(user.updatedAt).toLocaleString()}</td></tr>)}</tbody></table>}</Card>
      </>}
    </div>
  );
};

export default RevenueDashboardPage;
