import Avatar from './Avatar.jsx';

export default function DinoListItem({ dino, isSelected, isPending, onSelect }) {
  let className = 'list-item';
  if (isSelected) className += ' is-selected';

  return (
    <li>
      <button type="button" className={className} onClick={() => onSelect(dino.id)} aria-pressed={isSelected}>
        <Avatar species={dino.species} />
        <span className="list-item__text">
          <span className="list-item__name">{dino.name}</span>
          <span className="list-item__meta">
            {dino.species || 'Unknown species'}
            {dino.enclosure ? ` · ${dino.enclosure}` : ''}
          </span>
        </span>
        {isPending ? (
          <span className="badge badge--pending">Saving…</span>
        ) : (
          <span className={`badge ${dino.onDisplay ? 'badge--on' : 'badge--off'}`}>
            {dino.onDisplay ? 'On display' : 'Hidden'}
          </span>
        )}
      </button>
    </li>
  );
}
