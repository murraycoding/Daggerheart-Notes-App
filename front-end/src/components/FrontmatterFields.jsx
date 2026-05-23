// front-end/src/components/FrontmatterFields.jsx

// ── NPC fields ───────────────────────────────────────────────────────────────
function NpcFrontmatter({ data, onChange }) {
  return (
    <>
      <div className="fm__section">
        <h3 className="fm__section-title">Identity</h3>
        <div className="fm__row">
          <label className="fm__label">
            Role
            <select
              className="fm__select"
              value={data.role ?? 'unknown'}
              onChange={e => onChange('role', e.target.value)}
            >
              <option value="unknown">Unknown</option>
              <option value="villain">Villain</option>
              <option value="ally">Ally</option>
              <option value="neutral">Neutral</option>
            </select>
          </label>
          <label className="fm__label">
            Status
            <select
              className="fm__select"
              value={data.status ?? 'unknown'}
              onChange={e => onChange('status', e.target.value)}
            >
              <option value="unknown">Unknown</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
            </select>
          </label>
          <label className="fm__label">
            Adversary Type
            <select
              className="fm__select"
              value={data.adversary_type ?? 'standard'}
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
          <label className="fm__label">
            Tier
            <select
              className="fm__select"
              value={data.tier ?? 1}
              onChange={e => onChange('tier', Number(e.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>
        </div>
        <label className="fm__label">
          Faction (slug)
          <input
            className="fm__input"
            type="text"
            value={data.faction ?? ''}
            placeholder="e.g. iron-covenant"
            onChange={e => onChange('faction', e.target.value)}
          />
        </label>
      </div>

      <div className="fm__section">
        <h3 className="fm__section-title">Combat</h3>
        <div className="fm__stat-grid">
          <label className="fm__label">
            Difficulty
            <input
              className="fm__input fm__input--stat"
              type="number"
              value={data.difficulty ?? 12}
              onChange={e => onChange('difficulty', Number(e.target.value))}
            />
          </label>
          <label className="fm__label">
            HP
            <input
              className="fm__input fm__input--stat"
              type="number"
              min={1}
              value={data.hp ?? 3}
              onChange={e => onChange('hp', Number(e.target.value))}
            />
          </label>
          <label className="fm__label">
            Stress
            <input
              className="fm__input fm__input--stat"
              type="number"
              min={0}
              value={data.stress ?? 3}
              onChange={e => onChange('stress', Number(e.target.value))}
            />
          </label>
          <label className="fm__label">
            Atk Mod
            <input
              className="fm__input fm__input--stat"
              type="number"
              value={data.attack_modifier ?? 0}
              onChange={e => onChange('attack_modifier', Number(e.target.value))}
            />
          </label>
          <label className="fm__label">
            Major Threshold
            <input
              className="fm__input fm__input--stat"
              type="number"
              value={data.thresholds_major ?? 8}
              onChange={e => onChange('thresholds_major', Number(e.target.value))}
            />
          </label>
          <label className="fm__label">
            Severe Threshold
            <input
              className="fm__input fm__input--stat"
              type="number"
              value={data.thresholds_severe ?? 14}
              onChange={e => onChange('thresholds_severe', Number(e.target.value))}
            />
          </label>
          <label className="fm__label">
            Damage Dice
            <input
              className="fm__input"
              type="text"
              value={data.damage_dice ?? '1d8+1'}
              placeholder="e.g. 2d6+2"
              onChange={e => onChange('damage_dice', e.target.value)}
            />
          </label>
          <label className="fm__label">
            Damage Type
            <select
              className="fm__select"
              value={data.damage_type ?? 'phy'}
              onChange={e => onChange('damage_type', e.target.value)}
            >
              <option value="phy">Physical</option>
              <option value="mag">Magic</option>
            </select>
          </label>
        </div>
        <label className="fm__label">
          Motives &amp; Tactics
          <textarea
            className="fm__textarea"
            rows={3}
            value={data.motives_and_tactics ?? ''}
            placeholder="What does this NPC want? How do they fight?"
            onChange={e => onChange('motives_and_tactics', e.target.value)}
          />
        </label>
        <ExperienceEditor
          experiences={data.experiences ?? []}
          onChange={val => onChange('experiences', val)}
        />
      </div>
    </>
  );
}

// ── Experience editor (NPC only) ─────────────────────────────────────────────
function ExperienceEditor({ experiences, onChange }) {
  function update(index, value) {
    const next = [...experiences];
    next[index] = value;
    onChange(next);
  }

  function add() {
    onChange([...experiences, '']);
  }

  function remove(index) {
    onChange(experiences.filter((_, i) => i !== index));
  }

  return (
    <div className="fm__experience">
      <div className="fm__experience-header">
        <span className="fm__label-text">Experiences</span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={add}>
          + Add
        </button>
      </div>
      {experiences.length === 0 && (
        <p className="fm__empty">No experiences yet.</p>
      )}
      {experiences.map((exp, i) => (
        <div key={i} className="fm__experience-row">
          <input
            className="fm__input"
            type="text"
            value={exp}
            placeholder='e.g. "Thief +2"'
            onChange={e => update(i, e.target.value)}
          />
          <button
            type="button"
            className="btn btn--ghost btn--sm btn--danger"
            onClick={() => remove(i)}
            aria-label="Remove experience"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Session fields ───────────────────────────────────────────────────────────
function SessionFrontmatter({ data, onChange }) {
  return (
    <div className="fm__section">
      <h3 className="fm__section-title">Session Info</h3>
      <div className="fm__row">
        <label className="fm__label">
          Session Number
          <input
            className="fm__input fm__input--stat"
            type="number"
            min={1}
            value={data.session_number ?? 1}
            onChange={e => onChange('session_number', Number(e.target.value))}
          />
        </label>
        <label className="fm__label">
          Date
          <input
            className="fm__input"
            type="date"
            value={data.date ?? ''}
            onChange={e => onChange('date', e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

// ── Location fields ──────────────────────────────────────────────────────────
function LocationFrontmatter({ data, onChange }) {
  return (
    <div className="fm__section">
      <h3 className="fm__section-title">Location Info</h3>
      <div className="fm__row">
        <label className="fm__label">
          Region
          <input
            className="fm__input"
            type="text"
            value={data.region ?? ''}
            placeholder="e.g. The Thornwood"
            onChange={e => onChange('region', e.target.value)}
          />
        </label>
        <label className="fm__label">
          Status
          <select
            className="fm__select"
            value={data.status ?? 'active'}
            onChange={e => onChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="destroyed">Destroyed</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
    </div>
  );
}

// ── Faction fields ───────────────────────────────────────────────────────────
function FactionFrontmatter({ data, onChange }) {
  return (
    <div className="fm__section">
      <h3 className="fm__section-title">Faction Info</h3>
      <div className="fm__row">
        <label className="fm__label">
          Alignment
          <input
            className="fm__input"
            type="text"
            value={data.alignment ?? ''}
            placeholder="e.g. Lawful, Mercantile"
            onChange={e => onChange('alignment', e.target.value)}
          />
        </label>
        <label className="fm__label">
          Status
          <select
            className="fm__select"
            value={data.status ?? 'active'}
            onChange={e => onChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="disbanded">Disbanded</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>
    </div>
  );
}

// ── Plot thread fields ───────────────────────────────────────────────────────
function PlotThreadFrontmatter({ data, onChange }) {
  return (
    <div className="fm__section">
      <h3 className="fm__section-title">Thread Info</h3>
      <div className="fm__row">
        <label className="fm__label">
          Status
          <select
            className="fm__select"
            value={data.status ?? 'open'}
            onChange={e => onChange('status', e.target.value)}
          >
            <option value="open">Open</option>
            <option value="dormant">Dormant</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>
        <label className="fm__label">
          Priority
          <select
            className="fm__select"
            value={data.priority ?? 'medium'}
            onChange={e => onChange('priority', e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>
    </div>
  );
}

// ── Prep fields ──────────────────────────────────────────────────────────────
function PrepFrontmatter({ data, onChange }) {
  return (
    <div className="fm__section">
      <h3 className="fm__section-title">Prep Info</h3>
      <div className="fm__row">
        <label className="fm__label">
          Prep Type
          <select
            className="fm__select"
            value={data.prep_type ?? 'general'}
            onChange={e => onChange('prep_type', e.target.value)}
          >
            <option value="general">General</option>
            <option value="encounter">Encounter</option>
            <option value="handout">Handout</option>
          </select>
        </label>
        <label className="fm__label">
          Session Target (slug)
          <input
            className="fm__input"
            type="text"
            value={data.session_target ?? ''}
            placeholder="e.g. session-04"
            onChange={e => onChange('session_target', e.target.value)}
          />
        </label>
      </div>
    </div>
  );
}

// ── Router / main export ─────────────────────────────────────────────────────
export default function FrontmatterFields({ type, data, onChange }) {
  switch (type) {
    case 'npcs':         return <NpcFrontmatter data={data} onChange={onChange} />;
    case 'sessions':     return <SessionFrontmatter data={data} onChange={onChange} />;
    case 'locations':    return <LocationFrontmatter data={data} onChange={onChange} />;
    case 'factions':     return <FactionFrontmatter data={data} onChange={onChange} />;
    case 'plot-threads': return <PlotThreadFrontmatter data={data} onChange={onChange} />;
    case 'prep':         return <PrepFrontmatter data={data} onChange={onChange} />;
    default:             return null;
  }
}