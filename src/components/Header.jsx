import { NETWORK_PROFILES } from '../api/network.js';

export default function Header({ network, onNetworkChange, onAdd }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand__logo" aria-hidden="true">🦖</span>
        <div>
          <h1 className="brand__name">Dino Park Registry</h1>
          <p className="brand__tagline">Every dinosaur in the park, loaded from a slow and moody API.</p>
        </div>
      </div>

      <div className="header__actions">
        <label className="header__network">
          <span>Network</span>
          <select value={network} onChange={(e) => onNetworkChange(e.target.value)}>
            {Object.entries(NETWORK_PROFILES).map(([value, profile]) => (
              <option key={value} value={value}>{profile.label}</option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn--accent" onClick={onAdd}>
          + Add dinosaur
        </button>
      </div>
    </header>
  );
}
