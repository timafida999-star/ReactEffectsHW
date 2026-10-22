export default function Toast({ type, text, onClose }) {
  return (
    <div className={`toast toast--${type}`} role="status">
      <span>{text}</span>
      <button type="button" className="toast__close" aria-label="Close message" onClick={onClose}>
        ×
      </button>
    </div>
  );
}
