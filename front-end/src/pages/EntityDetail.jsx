// front-end/src/pages/EntityDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import FrontmatterFields from '../components/FrontmatterFields.jsx';

// ── NPC stat block read view ─────────────────────────────────────────────────
function NpcStatBlock({ data }) {
  const typeLabel = data.adversary_type
    ? data.adversary_type.charAt(0).toUpperCase() + data.adversary_type.slice(1)
    : 'Standard';

  return (
    <div className="stat-block">
      <div className="stat-block__header">
        <div className="stat-block__identity">
          <span className="stat-block__type">{typeLabel} · Tier {data.tier ?? '?'}</span>
          <div className="stat-block__badges">
            {data.role && data.role !== 'unknown' && (
              <span className={`stat-block__badge stat-block__badge--${data.role}`}>
                {data.role}
              </span>
            )}
            {data.status && data.status !== 'unknown' && (
              <span className={`stat-block__badge stat-block__badge--${data.status}`}>
                {data.status}
              </span>
            )}
            {data.faction && (
              <span className="stat-block__badge">⚑ {data.faction}</span>
            )}
          </div>
        </div>
      </div>

      <div className="stat-block__core">
        <div className="stat-block__stat">
          <span className="stat-block__stat-label">Difficulty</span>
          <span className="stat-block__stat-value">{data.difficulty ?? '—'}</span>
        </div>
        <div className="stat-block__stat">
          <span className="stat-block__stat-label">HP</span>
          <span className="stat-block__stat-value">{data.hp ?? '—'}</span>
        </div>
        <div className="stat-block__stat">
          <span className="stat-block__stat-label">Stress</span>
          <span className="stat-block__stat-value">{data.stress ?? '—'}</span>
        </div>
        <div className="stat-block__stat">
          <span className="stat-block__stat-label">Atk Mod</span>
          <span className="stat-block__stat-value">
            {data.attack_modifier != null
              ? (data.attack_modifier >= 0 ? `+${data.attack_modifier}` : data.attack_modifier)
              : '—'}
          </span>
        </div>
      </div>

      <div className="stat-block__thresholds">
        <span className="stat-block__threshold">
          <span className="stat-block__threshold-label">Major</span>
          <span className="stat-block__threshold-value">{data.thresholds_major ?? '—'}</span>
        </span>
        <span className="stat-block__threshold-divider">·</span>
        <span className="stat-block__threshold">
          <span className="stat-block__threshold-label">Severe</span>
          <span className="stat-block__threshold-value">{data.thresholds_severe ?? '—'}</span>
        </span>
        <span className="stat-block__threshold-divider">·</span>
        <span className="stat-block__damage">
          {data.damage_dice ?? '—'}{' '}
          <span className="stat-block__damage-type">
            {data.damage_type === 'mag' ? 'magic' : 'physical'}
          </span>
        </span>
      </div>

      {data.motives_and_tactics && (
        <div className="stat-block__tactics">
          <span className="stat-block__tactics-label">Motives &amp; Tactics</span>
          <p className="stat-block__tactics-text">{data.motives_and_tactics}</p>
        </div>
      )}

      {data.experiences?.length > 0 && (
        <div className="stat-block__experiences">
          <span className="stat-block__tactics-label">Experiences</span>
          <div className="stat-block__experience-pills">
            {data.experiences.map((exp, i) => (
              <span key={i} className="stat-block__experience-pill">{exp}</span>
            ))}
          </div>
        </div>
      )}

      <div className="stat-block__features-hint">
        <span className="stat-block__tactics-label">Features</span>
        <p className="stat-block__tactics-text stat-block__tactics-text--muted">
          See notes below.
        </p>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function EntityDetail() {
  const { campaign, type, slug } = useParams();
  const navigate = useNavigate();

  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [draftFrontmatter, setDraftFrontmatter] = useState({});
  const [draftBody, setDraftBody] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setEditing(false);
    api.getEntity(campaign, type, slug)
      .then(data => {
        setEntity(data);
        setDraftFrontmatter(data.frontmatter ?? {});
        setDraftBody(data.body ?? '');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [campaign, type, slug]);

  function handleFrontmatterChange(key, value) {
    setDraftFrontmatter(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await api.updateEntity(campaign, type, slug, {
        ...draftFrontmatter,
        body: draftBody,
      });
      setEntity(updated);
      setDraftFrontmatter(updated.frontmatter ?? {});
      setDraftBody(updated.body ?? '');
      setEditing(false);
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setDraftFrontmatter(entity.frontmatter ?? {});
    setDraftBody(entity.body ?? '');
    setEditing(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${entity.frontmatter?.name}"? This cannot be undone.`)) return;
    try {
      await api.deleteEntity(campaign, type, slug);
      navigate(`/${campaign}/${type}`);
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  }

  if (loading) return <p className="entity-detail__state">Loading…</p>;
  if (error)   return <p className="entity-detail__state entity-detail__state--error">{error}</p>;
  if (!entity) return null;

  const fm = editing ? draftFrontmatter : (entity.frontmatter ?? {});

  return (
    <div className="entity-detail">
      <div className="entity-detail__header">
        <div className="entity-detail__title-row">
          {editing ? (
            <input
              className="entity-detail__name-input"
              type="text"
              value={draftFrontmatter.name ?? ''}
              onChange={e => handleFrontmatterChange('name', e.target.value)}
            />
          ) : (
            <h1 className="entity-detail__name">{fm.name}</h1>
          )}
          <div className="entity-detail__actions">
            {editing ? (
              <>
                <button
                  className="btn btn--ghost"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="btn btn--primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn--ghost"
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
                <button
                  className="btn btn--ghost btn--danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {fm.tags?.length > 0 && (
          <div className="entity-detail__tags">
            {fm.tags.map(tag => (
              <span key={tag} className="entity-detail__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Stat block read view — NPC only, hidden during edit */}
      {type === 'npcs' && !editing && (
        <NpcStatBlock data={fm} />
      )}

      {/* Type-specific frontmatter fields — edit mode only */}
      {editing && (
        <div className="entity-detail__frontmatter">
          <FrontmatterFields
            type={type}
            data={draftFrontmatter}
            onChange={handleFrontmatterChange}
          />
        </div>
      )}

      {/* Markdown body */}
      <div className="entity-detail__body">
        {editing ? (
          <textarea
            className="entity-detail__textarea"
            value={draftBody}
            onChange={e => setDraftBody(e.target.value)}
            placeholder="Notes, features, descriptions…"
            rows={20}
          />
        ) : (
          <div className="entity-detail__markdown">
            {entity.body
              ? entity.body.split('\n').map((line, i) =>
                  line.startsWith('## ') ? (
                    <h2 key={i} className="md__h2">{line.slice(3)}</h2>
                  ) : line.startsWith('### ') ? (
                    <h3 key={i} className="md__h3">{line.slice(4)}</h3>
                  ) : line.startsWith('**') && line.endsWith('**') ? (
                    <p key={i}><strong>{line.slice(2, -2)}</strong></p>
                  ) : line.trim() === '' ? (
                    <br key={i} />
                  ) : (
                    <p key={i} className="md__p">{line}</p>
                  )
                )
              : <p className="entity-detail__empty">No notes yet. Click Edit to add some.</p>
            }
          </div>
        )}
      </div>

      <div className="entity-detail__footer">
        <span className="entity-detail__meta">
          Created {fm.created} · Updated {fm.updated}
        </span>
      </div>
    </div>
  );
}