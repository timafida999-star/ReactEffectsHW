import { getSpecies } from '../constants.js';

export default function Avatar({ species, size = 'small' }) {
  const info = getSpecies(species);
  const code = info ? info.code : '?';

  return (
    <span className={`avatar avatar--${size} avatar--${code.toLowerCase()}`}>
      {code}
      {info && (
        <img
          className="avatar__img"
          src={info.image}
          alt={species}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </span>
  );
}
