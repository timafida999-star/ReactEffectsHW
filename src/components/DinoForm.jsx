import { useState } from 'react';
import { DIETS, ENCLOSURES, PERIODS, SPECIES } from '../constants.js';

const EMPTY_VALUES = {
  name: '',
  description: '',
  species: 'T-Rex',
  diet: 'Carnivore',
  period: 'Cretaceous',
  enclosure: 'Jungle',
  weightKg: '',
  lengthM: '',
  dangerLevel: '3',
  keeper: '',
  onDisplay: false,
};

function toFormValues(item) {
  if (!item) return EMPTY_VALUES;
  return {
    ...EMPTY_VALUES,
    ...item,
    weightKg: item.weightKg ?? '',
    lengthM: item.lengthM ?? '',
    dangerLevel: String(item.dangerLevel ?? 3),
    onDisplay: Boolean(item.onDisplay),
  };
}

function validate(v) {
  if (!v.name.trim()) return 'Name is required.';
  if (!v.description.trim()) return 'Description is required.';
  if (!v.keeper.trim()) return 'Keeper name is required.';
  if (!(Number(v.weightKg) > 0)) return 'Weight must be a positive number.';
  if (!(Number(v.lengthM) > 0)) return 'Length must be a positive number.';
  return '';
}

export default function DinoForm({ mode, initialItem, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(initialItem));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    const message = validate(values);
    if (message) {
      setError(message);
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim(),
        species: values.species,
        diet: values.diet,
        period: values.period,
        enclosure: values.enclosure,
        weightKg: Number(values.weightKg),
        lengthM: Number(values.lengthM),
        dangerLevel: Number(values.dangerLevel),
        keeper: values.keeper.trim(),
        onDisplay: values.onDisplay,
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  const title = mode === 'edit' ? `Edit ${initialItem.name}` : 'New dinosaur';

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <form className="modal__box form" onSubmit={handleSubmit} noValidate>
        <div className="form__head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onCancel} disabled={saving}>
            ×
          </button>
        </div>

        <div className="form__grid">
          <label className="field field--wide">
            <span>Name</span>
            <input type="text" maxLength={30} value={values.name} onChange={(e) => update('name', e.target.value)} />
          </label>

          <label className="field field--wide">
            <span>Description</span>
            <textarea rows={2} maxLength={160} value={values.description} onChange={(e) => update('description', e.target.value)} />
          </label>

          <label className="field">
            <span>Species</span>
            <select value={values.species} onChange={(e) => update('species', e.target.value)}>
              {SPECIES.map((s) => <option key={s.value} value={s.value}>{s.value}</option>)}
            </select>
          </label>

          <label className="field">
            <span>Diet</span>
            <select value={values.diet} onChange={(e) => update('diet', e.target.value)}>
              {DIETS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>

          <label className="field">
            <span>Period</span>
            <select value={values.period} onChange={(e) => update('period', e.target.value)}>
              {PERIODS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <label className="field">
            <span>Enclosure</span>
            <select value={values.enclosure} onChange={(e) => update('enclosure', e.target.value)}>
              {ENCLOSURES.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </label>

          <label className="field">
            <span>Weight, kg</span>
            <input type="number" min="1" value={values.weightKg} onChange={(e) => update('weightKg', e.target.value)} />
          </label>

          <label className="field">
            <span>Length, m</span>
            <input type="number" min="0.1" step="0.1" value={values.lengthM} onChange={(e) => update('lengthM', e.target.value)} />
          </label>

          <label className="field">
            <span>Danger level (1-5)</span>
            <select value={values.dangerLevel} onChange={(e) => update('dangerLevel', e.target.value)}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>

          <label className="field">
            <span>Keeper</span>
            <input type="text" maxLength={30} value={values.keeper} onChange={(e) => update('keeper', e.target.value)} />
          </label>

          <label className="checkbox field--wide">
            <input type="checkbox" checked={values.onDisplay} onChange={(e) => update('onDisplay', e.target.checked)} />
            <span>On display for visitors</span>
          </label>
        </div>

        {error && <p className="form__error" role="alert">{error}</p>}

        <div className="form__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn--accent" disabled={saving}>
            {saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add dinosaur'}
          </button>
        </div>
      </form>
    </div>
  );
}
