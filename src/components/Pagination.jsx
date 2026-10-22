export default function Pagination({ page, totalPages, disabled, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pages">
      <button
        type="button"
        className="btn btn--outline"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </button>
      <span className="pagination__info">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="btn btn--outline"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </nav>
  );
}
