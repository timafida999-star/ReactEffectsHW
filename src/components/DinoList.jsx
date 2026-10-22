import { SORT_OPTIONS } from '../constants.js';
import DinoListItem from './DinoListItem.jsx';
import Pagination from './Pagination.jsx';
import StateView from './StateView.jsx';

export default function DinoList({
  items,
  status,
  error,
  search,
  sort,
  page,
  pageInfo,
  selectedId,
  pendingIds,
  onSearchChange,
  onSortChange,
  onPageChange,
  onReload,
  onSelect,
  onAdd,
}) {
  const isLoading = status === 'loading';
  const hasItems = items.length > 0;

  let content;
  if (isLoading && !hasItems) {
    content = <StateView kind="loading" title="Loading dinosaurs…" />;
  } else if (status === 'error') {
    content = (
      <StateView kind="error" title="Could not load the list" text={error} actionLabel="Try again" onAction={onReload} />
    );
  } else if (!hasItems && search) {
    content = <StateView kind="empty" title={`Nobody matches "${search}"`} text="Try another name or word from the description." />;
  } else if (!hasItems) {
    content = (
      <StateView kind="empty" title="The park is empty" text="Add the first dinosaur." actionLabel="+ Add dinosaur" onAction={onAdd} />
    );
  } else {
    content = (
      <ul className={`list${isLoading ? ' is-refreshing' : ''}`}>
        {items.map((dino) => (
          <DinoListItem
            key={dino.id}
            dino={dino}
            isSelected={dino.id === selectedId}
            isPending={pendingIds.includes(dino.id)}
            onSelect={onSelect}
          />
        ))}
      </ul>
    );
  }

  return (
    <section className="panel list-panel" aria-label="Dinosaur list">
      <div className="list-panel__head">
        <h2>
          Dinosaurs
          {status === 'success' && <span className="count">{pageInfo.total}</span>}
        </h2>
        <button type="button" className="btn btn--outline" onClick={onReload}>
          <span className={isLoading ? 'reload-icon is-spinning' : 'reload-icon'} aria-hidden="true">↻</span>
          Reload
        </button>
      </div>

      <div className="list-panel__controls">
        <input
          type="search"
          className="input"
          placeholder="Search by name or description"
          aria-label="Search dinosaurs"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select className="input input--auto" aria-label="Sort" value={sort} onChange={(e) => onSortChange(e.target.value)}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {isLoading && hasItems && <p className="refresh-note">Refreshing…</p>}

      {content}

      {status !== 'error' && hasItems && (
        <Pagination page={page} totalPages={pageInfo.totalPages} disabled={isLoading} onPageChange={onPageChange} />
      )}
    </section>
  );
}
