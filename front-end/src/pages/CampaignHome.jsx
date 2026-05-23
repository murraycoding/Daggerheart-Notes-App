import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useCampaign } from '../hooks/useCampaign.jsx';
 
export default function CampaignHome() {
  const { campaigns, setCampaigns, setActiveCampaign } = useCampaign();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
 
  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const created = await api.createCampaign({ name });
      setCampaigns(prev => [...prev, created]);
      setActiveCampaign(created);
      navigate(`/${created.slug}/sessions`);
    } catch (err) {
      setError(err.message);
    }
  }
 
  return (
    <div>
      <div className="page-header">
        <h2>Campaigns</h2>
      </div>
 
      <ul className="entity-list">
        {campaigns.map(c => (
          <li key={c.slug} className="entity-list-item">
            <a className="entity-name" href={`/${c.slug}/sessions`}>{c.name}</a>
            <span className="entity-meta">{c.system}</span>
          </li>
        ))}
      </ul>
 
      <form onSubmit={handleCreate} style={{ marginTop: 32, maxWidth: 360 }}>
        <h3 style={{ marginBottom: 12, fontSize: 14 }}>New Campaign</h3>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Campaign name"
          style={{ marginBottom: 10 }}
        />
        {error && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 8 }}>{error}</p>}
        <button type="submit" className="primary">Create</button>
      </form>
    </div>
  );
}
