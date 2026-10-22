export default function StateView({ kind, title, text, actionLabel, onAction }) {
  return (
    <div className={`state state--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {kind === 'loading' && <span className="spinner" aria-hidden="true" />}
      {kind === 'error' && <span className="state__icon" aria-hidden="true">!</span>}
      {kind === 'empty' && <span className="state__icon" aria-hidden="true">🦴</span>}
      <p className="state__title">{title}</p>
      {text && <p className="state__text">{text}</p>}
      {actionLabel && (
        <button type="button" className="btn btn--outline" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
