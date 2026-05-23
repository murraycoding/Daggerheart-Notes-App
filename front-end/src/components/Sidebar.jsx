import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useCampaign } from '../hooks/useCampaign.jsx';
 
const ENTITY_TYPES = [
  { type: 'sessions',      label: 'Sessions'      },
  { type: 'npcs',          label: 'NPCs'           },
  { type: 'locations',     label: 'Locations'      },
  { type: 'factions',      label: 'Factions'       },
  { type: 'plot-threads',  label: 'Plot Threads'   },
  { type: 'prep',          label: 'Prep'           },
];
 
export default function Sidebar() {
  const { activeCampaign, campaigns, setActiveCampaign } = useCampaign();
  const { campaign: routeCampaign } = useParams();
 
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h1>⚔ Daggerheart</h1>
      </div>
 
      <div className="sidebar-nav">
        <div className="sidebar-section-label">Campaign</div>
        <select
          value={activeCampaign?.slug || ''}
          onChange={e => {
            const found = campaigns.find(c => c.slug === e.target.value);
            if (found) setActiveCampaign(found);
          }}
          style={{ margin: '4px 12px', width: 'calc(100% - 24px)' }}
        >
          {campaigns.map(c => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
 
        <NavLink to="/campaigns" style={{ marginTop: 4 }}>
          ＋ New Campaign
        </NavLink>
 
        {activeCampaign && (
          <>
            <div className="sidebar-section-label" style={{ marginTop: 12 }}>Content</div>
            {ENTITY_TYPES.map(({ type, label }) => (
              <NavLink
                key={type}
                to={`/${activeCampaign.slug}/${type}`}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {label}
              </NavLink>
            ))}
          </>
        )}
      </div>
    </nav>
  );
}
