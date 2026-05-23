// front-end/src/components/CreateEntityForm.jsx
import { useState } from 'react';
import { ENTITY_TYPE_CONFIG } from '../config/entityTypes.js';

// ── NPC sub-form ────────────────────────────────────────────────────────────
function NpcFields({ fields, onChange }) {
  return (
    <>
      <fieldset className="create-form__fieldset">
        <legend className="create-form__legend">Identity</legend>
        <div className="create-form__row">
          <label className="create-form__label">
            Role
            <select
              className="create-form__select"
              value={fields.role}
              onChange={e => onChange('role', e.target.value)}
            >
              <option value="unknown">Unknown</option>
              <option value="villain">Villain</option>
              <option value="ally">Ally</option>
              <option value="neutral">Neutral</option>
            </select>
          </label>
          <label className="create-form__label">
            Status
            <select
              className="create-form__select"
              value={fields.status}
              onChange={e => onChange('status', e.target.value)}
            >
              <option value="unknown">Unknown</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
            </select>
          </label>
        </div>
        <div className="create-form__row">
          <label className="create-form__label">
            Adversary Type
            <select
              className="create-form__select"
              value={fields.adversary_type}
              onChange={e => onChange('adversary_type', e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="bruiser">Bruiser</option>
              <option value="horde">Horde</option>
              <option value="leader">Leader</option>
              <option value="minion">Minion</option>
              <option value="ranged">Ranged</option>
              <option value="skulk">Skulk</option>
              <option value="social">Social</option>
              <option value="solo">Solo</option>
              <option value="support">Support</option>
            </select>
          </label>
          <label className="create-form__label">
            Tier
            <select
              className="create-form__select"
              value={fields.tier}
              onChange={e => onChange('tier', Number(e.target.value))}
            >
              <option value={0}>0 — Level 1</option>
              <option value={1}>1 — Levels 2–4</option>
              <option value={2}>2 — Levels 5–7</option>
              <option value={3}>3 — Levels 8–10</option>
            </select>
          </label>
        </div>
        <label className="create-form__label">
          Faction (slug, optional)
          <input
            className="create-form__input"
            type="text"
            value={fields.faction}
            placeholder="e.g. iron-covenant"
            onChange={e => onChange('faction', e.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="create-form__fieldset">
        <legend className="create-form__legend">Combat Stats</legend>
        <div className="create-form__row create-form__row--four">
          <label className="create-form__label">
            Difficulty
            <input
              className="create-form__input"
              type="number"
              value={fields.difficulty}
              onChange={e => onChange('difficulty', Number(e.target.value))}
            />
          </label>
          <label className="create-form__label">
            HP
            <input
              className="create-form__input"
              type="number"
              min={1}
              value={fields.hp}
              onChange={e => onChange('hp', Number(e.target.value))}
            />
          </label>
          <label className="create-form__label">
            Stress
            <input
              className="create-form__input"
              type="number"
              min={0}
              value={fields.stress}
              onChange={e => onChange('stress', Number(e.target.value))}
            />
          </label>
          <label className="create-form__label">
            Atk Mod
            <input
              className="create-form__input"
              type="number"
              value={fields.attack_modifier}
              onChange={e => onChange('attack_modifier', Number(e.target.value))}
            />
          </label>
        </div>
        <div className="create-form__row">
          <label className="create-form__label">
            Major Threshold
            <input
              className="create-form__input"
              type="number"
              value={fields.thresholds_major}
              onChange={e => onChange('thresholds_major', Number(e.target.value))}
            />
          </label>
          <label className="create-form__label">
            Severe Threshold
            <input
              className="create-form__input"
              type="number"
              value={fields.thresholds_severe}
              onChange={e => onChange('thresholds_severe', Number(e.target.value))}
            />
          </label>
        </div>
        <div className="create-form__row">
          <label className="create-form__label">
            Damage Dice
            <input
              className="create-form__input"
              type="text"
              value={fields.damage_dice}
              placeholder="e.g. 2d6+2"
              onChange={e => onChange('damage_dice', e.target.value)}
            />
          </label>
          <label className="create-form__label">
            Damage Type
            <select
              className="create-form__select"
              value={fields.damage_type}
              onChange={e => onChange('damage_type', e.target.value)}
            >
              <option value="phy">Physical</option>
              <option value="mag">Magic</option>
            </select>
          </label>
        </div>
        <label className="create-form__label">
          Motives &amp; Tactics
          <textarea
            className="create-form__textarea"
            rows={3}
            value={fields.motives_and_tactics}
            placeholder="What does this NPC want? How do they fight?"
            onChange={e => onChange('motives_and_tactics', e.target.value)}
          />
        </label>
      </fieldset>
    </>
  );
}

// ── Session sub-form ─────────────────────────────────────────────────────────
function SessionFields({ fields, onChange }) {
  return (
    <fieldset className="create-form__fieldset">
      <legend className="create-form__legend">Session Info</legend>
      <div className="create-form__row">
        <label className="create-form__label">
          Session Number
          <input
            className="create-form__input"
            type="number"
            min={1}
            value={fields.session_number}
            onChange={e => onChange('session_number', Number(e.target.value))}
          />
        </label>
        <label className="create-form__label">
          Date
          <input
            className="create-form__input"
            type="date"
            value={fields.date}
            onChange={e => onChange('date', e.target.value)}
          />
        </label>
      </div>
    </fieldset>
  );
}

// ── Location sub-form ────────────────────────────────────────────────────────
function LocationFields({ fields, onChange }) {
  return (
    <fieldset className="create-form__fieldset">
      <legend className="create-form__legend">Location Info</legend>
      <div className="create-form__row">
        <label className="create-form__label">
          Region
          <input
            className="create-form__input"
            type="text"
            value={fields.region}
            placeholder="e.g. The Thornwood"
            onChange={e => onChange('region', e.target.value)}
          />
        </label>
        <label className="create-form__label">
          Status
          <select
            className="create-form__select"
            value={fields.status}
            onChange={e => onChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="destroyed">Destroyed</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
    </fieldset>
  );
}

// ── Faction sub-form ─────────────────────────────────────────────────────────
function FactionFields({ fields, onChange }) {
  return (
    <fieldset className="create-form__fieldset">
      <legend className="create-form__legend">Faction Info</legend>
      <div className="create-form__row">
        <label className="create-form__label">
          Alignment
          <input
            className="create-form__input"
            type="text"
            value={fields.alignment}
            placeholder="e.g. Lawful, Chaotic, Mercantile"
            onChange={e => onChange('alignment', e.target.value)}
          />
        </label>
        <label className="create-form__label">
          Status
          <select
            className="create-form__select"
            value={fields.status}
            onChange={e => onChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="disbanded">Disbanded</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
    </fieldset>
  );
}

// ── Plot Thread sub-form ─────────────────────────────────────────────────────
function PlotThreadFields({ fields, onChange }) {
  return (
    <fieldset className="create-form__fieldset">
      <legend className="create-form__legend">Thread Info</legend>
      <div className="create-form__row">
        <label className="create-form__label">
          Status
          <select
            className="create-form__select"
            value={fields.status}
            onChange={e => onChange('status', e.target.value)}
          >
            <option value="open">Open</option>
            <option value="dormant">Dormant</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
        <label className="create-form__label">
          Priority
          <select
            className="create-form__select"
            value={fields.priority}
            onChange={e => onChange('priority', e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>
    </fieldset>
  );
}

// ── Prep sub-form ────────────────────────────────────────────────────────────
function PrepFields({ fields, onChange }) {
  return (
    <fieldset className="create-form__fieldset">
      <legend className="create-form__legend">Prep Info</legend>
      <div className="create-form__row">
        <label className="create-form__label">
          Prep Type
          <select
            className="create-form__select"
            value={fields.prep_type}
            onChange={e => onChange('prep_type', e.target.value)}
          >
            <option value="general">General</option>
            <option value="encounter">Encounter</option>
            <option value="handout">Handout</option>
          </select>
        </label>
        <label className="create-form__label">
          Session Target (slug)
          <input
            className="create-form__input"
            type="text"
            value={fields.session_target}
            placeholder="e.g. session-04"
            onChange={e => onChange('session_target', e.target.value)}
          />
        </label>
      </div>
    </fieldset>
  );
}

// ── Type-field router ────────────────────────────────────────────────────────
function TypeFields({ type, fields, onChange }) {
  switch (type) {
    case 'npcs':         return <NpcFields fields={fields} onChange={onChange} />;
    case 'sessions':     return <SessionFields fields={fields} onChange={onChange} />;
    case 'locations':    return <LocationFields fields={fields} onChange={onChange} />;
    case 'factions':     return <FactionFields fields={fields} onChange={onChange} />;
    case 'plot-threads': return <PlotThreadFields fields={fields} onChange={onChange} />;
    case 'prep':         return <PrepFields fields={fields} onChange={onChange} />;
    default:             return null;
  }
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function CreateEntityForm({ type, campaignSlug, onCreate, onCancel }) {
  const config = ENTITY_TYPE_CONFIG[type] ?? { label: type, defaults: {} };

  const [name, setName] = useState('');
  const [tags, setTags] = useState('');
  const [typeFields, setTypeFields] = useState({ ...config.defaults });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleFieldChange(key, value) {
    setTypeFields(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      linked: [],
      ...typeFields,
    };

    try {
      await onCreate(payload);
    } catch (err) {
      setError(err.message ?? 'Failed to create entity.');
      setSubmitting(false);
    }
  }

  return (
    <div className="create-form__backdrop">
      <form className="create-form" onSubmit={handleSubmit}>
        <div className="create-form__header">
          <h2 className="create-form__title">New {config.label}</h2>
          <button
            type="button"
            className="create-form__close"
            onClick={onCancel}
            aria-label="Cancel"
          >
            ✕
          </button>
        </div>

        <fieldset className="create-form__fieldset">
          <legend className="create-form__legend">Basic Info</legend>
          <label className="create-form__label">
            Name <span className="create-form__required">*</span>
            <input
              className="create-form__input"
              type="text"
              value={name}
              autoFocus
              required
              placeholder={`${config.label} name…`}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label className="create-form__label">
            Tags
            <input
              className="create-form__input"
              type="text"
              value={tags}
              placeholder="comma, separated, tags"
              onChange={e => setTags(e.target.value)}
            />
          </label>
        </fieldset>

        <TypeFields type={type} fields={typeFields} onChange={handleFieldChange} />

        {error && <p className="create-form__error">{error}</p>}

        <div className="create-form__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Creating…' : `Create ${config.label}`}
          </button>
        </div>
      </form>
    </div>
  );
}