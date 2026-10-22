import { formatLength, formatWeight } from '../constants.js';
import Avatar from './Avatar.jsx';
import StateView from './StateView.jsx';

function DangerLevel({ level }) {
  if (!level) return '—';
  return (
    <span className="danger" aria-label={`${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= level ? 'danger__dot is-on' : 'danger__dot'} />
      ))}
    </span>
  );
}

export default function DinoDetails({
  selectedId,
  details,
  isPending,
  actionError,
  onRetry,
  onToggleDisplay,
  onEdit,
  onDelete,
  onClose,
}) {
  let content;
  const isCurrent = details.id === selectedId;

  if (selectedId === null) {
    content = <StateView kind="empty" title="No dinosaur selected" text="Pick one from the list to load its full profile." />;
  } else if (!isCurrent || details.status === 'loading') {
    content = <StateView kind="loading" title={`Loading profile #${selectedId}…`} />;
  } else if (details.status === 'error') {
    content = (
      <StateView kind="error" title="Could not load this profile" text={details.error} actionLabel="Try again" onAction={onRetry} />
    );
  } else {
    const dino = details.data;
    const fields = [
      { label: 'Species', value: dino.species },
      { label: 'Diet', value: dino.diet },
      { label: 'Period', value: dino.period },
      { label: 'Enclosure', value: dino.enclosure },
      { label: 'Weight', value: formatWeight(dino.weightKg) },
      { label: 'Length', value: formatLength(dino.lengthM) },
      { label: 'Keeper', value: dino.keeper },
      { label: 'Danger level', value: <DangerLevel level={dino.dangerLevel} /> },
    ];

    content = (
      <article className="details">
        <div className="details__top">
          <Avatar species={dino.species} size="large" />
          <div className="details__title">
            <p className="details__id">#{dino.id}</p>
            <h2>{dino.name}</h2>
            <span className={`badge ${dino.onDisplay ? 'badge--on' : 'badge--off'}`}>
              {dino.onDisplay ? 'On display for visitors' : 'Hidden from visitors'}
            </span>
          </div>
        </div>

        <p className="details__description">{dino.description || 'No description yet.'}</p>

        <dl className="details__grid">
          {fields.map((f) => (
            <div key={f.label} className="details__field">
              <dt>{f.label}</dt>
              <dd>{f.value || '—'}</dd>
            </div>
          ))}
        </dl>

        {actionError && (
          <p className="details__error" role="alert">
            Request failed: {actionError}. Try again.
          </p>
        )}

        <div className="details__actions">
          <button
            type="button"
            className="btn btn--dark"
            disabled={isPending}
            onClick={() => onToggleDisplay(dino)}
          >
            {isPending ? 'Saving…' : dino.onDisplay ? 'Hide from visitors' : 'Put on display'}
          </button>
          <button type="button" className="btn btn--outline" disabled={isPending} onClick={() => onEdit(dino)}>
            Edit
          </button>
          <button type="button" className="btn btn--danger" disabled={isPending} onClick={() => onDelete(dino)}>
            Delete
          </button>
        </div>
      </article>
    );
  }

  return (
    <section id="details-panel" className="panel details-panel" aria-label="Dinosaur profile">
      <div className="details-panel__head">
        <h2>Profile</h2>
        {selectedId !== null && (
          <button type="button" className="icon-btn" aria-label="Close profile" onClick={onClose}>
            ×
          </button>
        )}
      </div>
      {content}
    </section>
  );
}
