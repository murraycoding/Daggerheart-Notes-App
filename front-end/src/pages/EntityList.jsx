// front-end/src/pages/EntityList.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useCampaign } from '../hooks/useCampaign.jsx';
import { ENTITY_TYPE_CONFIG } from '../config/entityTypes.js';
import CreateEntityForm from '../components/CreateEntityForm.jsx';

// Human-readable labels for inline list metadata
function EntityMeta({ type, entity }) {
  switch (type) {
    case 'npcs':
      return (
        <span className="entity-list__meta">
          {entity.adversary_type && (
            <span className="entity-list__badge">{entity.adversary_type}</span>
          )}
          {entity.role && entity.role !== 'unknown' && (
            <span className="entity-list__badge entity-list__badge--role">
              {entity.role}
            </span>
          )}
          {entity.status && entity.status !== 'unknown' && (
            <span
              className={`entity-list__badge entity-list__badge--status entity-list__badge--${entity.status}`}
            >
              {entity.status}
            </span>
          )}
        </span>
      );
    case 'sessions':
      return (
        <span className="entity-list__meta">
          {entity.session_number && (
            <span className="entity-list__badge">#{entity.session_number}</span>
          )}
          {entity.date && (
            <span className="entity-list__badge">{entity.date}</span>
          )}
        </span>
      );
    case 'locations':
      return (
        <span className="entity-list__meta">
          {entity.region && (
            <span className="entity-list__badge">{entity.region}</span>
          )}
          {entity.status && entity.status !== 'unknown' && (
            <span className="entity-list__badge">{entity.status}</span>
          )}
        </span>
      );
    case 'plot-threads':
      return (
        <span className="entity-list__meta">
          {entity.priority && (
            <span
              className={`entity-list__badge entity-list__badge--priority-${entity.priority}`}
            >
              {entity.priority}
            </span>
          )}
          {entity.status && (
            <span className="entity-list__badge">{entity.status}</span>
          )}
        </span>
      );
    default:
      return null;
  }
}

export default function EntityList() {
  const { campaign, type } = useParams();
  const navigate = useNavigate();
  const { activeCampaign } = useCampaign();

  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const config = ENTITY_TYPE_CONFIG[type] ?? { label: type };

  useEffect(() => {
    setLoading(true);
    setError(null);
    setShowForm(false);
    api.listEntities(campaign, type)
      .then(setEntities)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [campaign, type]);

  async function handleCreate(payload) {
    const created = await api.createEntity(campaign, type, payload);
    setShowForm(false);
    navigate(`/${campaign}/${type}/${created.slug}`);
  }

  return (
    <div className="entity-list">
      <div className="entity-list__header">
        <h1 className="entity-list__title">
          {activeCampaign?.name ?? campaign} — {config.label}s
        </h1>
        {!showForm && (
          <button
            className="btn btn--primary"
            onClick={() => setShowForm(true)}
          >
            + New {config.label}
          </button>
        )}
      </div>

      {showForm && (
        <CreateEntityForm
          type={type}
          campaignSlug={campaign}
          onCreate={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading && <p className="entity-list__state">Loading…</p>}
      {error && <p className="entity-list__state entity-list__state--error">{error}</p>}

      {!loading && !error && entities.length === 0 && (
        <p className="entity-list__state">
          No {config.label.toLowerCase()}s yet.{' '}
          {!showForm && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setShowForm(true)}
            >
              Create one.
            </button>
          )}
        </p>
      )}

      {!loading && entities.length > 0 && (
        <ul className="entity-list__items">
          {entities.map(entity => (
            <li key={entity._slug} className="entity-list__item">
              <Link
                to={`/${campaign}/${type}/${entity._slug}`}
                className="entity-list__link"
              >
                <span className="entity-list__name">{entity.name}</span>
                <EntityMeta type={type} entity={entity} />
                {entity.tags?.length > 0 && (
                  <span className="entity-list__tags">
                    {entity.tags.map(tag => (
                      <span key={tag} className="entity-list__tag">{tag}</span>
                    ))}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}