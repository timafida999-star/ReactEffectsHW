import { useEffect, useState } from 'react';
import { createDino, deleteItem, getItem, getItemsList, updateItem } from './api/dinoApi.js';
import { applyNetworkProfile } from './api/network.js';
import { PAGE_SIZE } from './constants.js';
import { log } from './debug.js';
import Header from './components/Header.jsx';
import DinoList from './components/DinoList.jsx';
import DinoDetails from './components/DinoDetails.jsx';
import DinoForm from './components/DinoForm.jsx';
import Toast from './components/Toast.jsx';

let listRequestNo = 0;
let detailsRequestNo = 0;

export default function App() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');
  const [page, setPage] = useState(1);
  const [listReloadKey, setListReloadKey] = useState(0);

  const [items, setItems] = useState([]);
  const [listStatus, setListStatus] = useState('loading');
  const [listError, setListError] = useState('');
  const [pageInfo, setPageInfo] = useState({ total: 0, totalPages: 1 });

  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState({ id: null, status: 'idle', data: null, error: '' });
  const [detailsReloadKey, setDetailsReloadKey] = useState(0);

  const [pendingIds, setPendingIds] = useState([]);
  const [actionError, setActionError] = useState(null);
  const [form, setForm] = useState(null);
  const [notice, setNotice] = useState(null);
  const [network, setNetwork] = useState('normal');

  useEffect(() => {
    let ignore = false;
    const requestNo = ++listRequestNo;
    const query = `?search=${encodeURIComponent(search)}&sort=${sort}&page=${page}&limit=${PAGE_SIZE}`;

    log('effect', `list #${requestNo} started: ${query}`);
    setListStatus('loading');
    setListError('');

    getItemsList(query)
      .then((result) => {
        if (ignore) {
          log('ignored', `list #${requestNo} finished too late, response ignored`);
          return;
        }
        if (result.data.length === 0 && result.page > 1) {
          setPage(Math.max(1, result.totalPages));
          return;
        }
        log('done', `list #${requestNo} shown (${result.data.length} items)`);
        setItems(result.data);
        setPageInfo({ total: result.total, totalPages: Math.max(1, result.totalPages) });
        setListStatus('success');
      })
      .catch((error) => {
        if (ignore) return;
        setListError(error.message);
        setListStatus('error');
      });

    return () => {
      ignore = true;
      log('cleanup', `list #${requestNo} is now outdated`);
    };
  }, [search, sort, page, listReloadKey]);

  useEffect(() => {
    if (selectedId === null) return;

    let ignore = false;
    const requestNo = ++detailsRequestNo;
    const id = selectedId;

    log('effect', `details #${requestNo} started for item ${id}`);
    setDetails({ id, status: 'loading', data: null, error: '' });

    getItem(id)
      .then((item) => {
        if (ignore) {
          log('ignored', `details #${requestNo} (item ${id}) finished too late, response ignored`);
          return;
        }
        log('done', `details #${requestNo} shown: ${item.name}`);
        setDetails({ id, status: 'success', data: item, error: '' });
      })
      .catch((error) => {
        if (ignore) return;
        setDetails({ id, status: 'error', data: null, error: error.message });
      });

    return () => {
      ignore = true;
      log('cleanup', `details #${requestNo} (item ${id}) is now outdated`);
    };
  }, [selectedId, detailsReloadKey]);

  useEffect(() => {
    if (!notice) return;
    const timerId = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timerId);
  }, [notice]);

  function markPending(id) {
    setPendingIds((prev) => [...prev, id]);
  }
  function unmarkPending(id) {
    setPendingIds((prev) => prev.filter((pendingId) => pendingId !== id));
  }

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }
  function handleSortChange(value) {
    setSort(value);
    setPage(1);
  }
  function handleReload() {
    setListReloadKey((k) => k + 1);
  }
  function handleSelect(id) {
    setSelectedId(id);
    if (window.innerWidth < 900) {
      document.getElementById('details-panel')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  function handleNetworkChange(name) {
    applyNetworkProfile(name);
    setNetwork(name);
  }

  async function handleToggleDisplay(item) {
    const id = item.id;
    const nextValue = !item.onDisplay;
    if (pendingIds.includes(id)) return;

    markPending(id);
    setActionError((prev) => (prev?.id === id ? null : prev));
    log('action', `PATCH item ${id}: onDisplay -> ${nextValue}`);

    try {
      const updated = await updateItem(id, { onDisplay: nextValue });
      log('action', `PATCH item ${id} done`);
      setItems((prev) => prev.map((d) => (d.id === id ? updated : d)));
      setDetails((prev) => (prev.id === id && prev.data ? { ...prev, data: updated } : prev));
      setNotice({
        type: 'success',
        text: `${updated.name} is now ${updated.onDisplay ? 'on display' : 'hidden from visitors'}.`,
      });
    } catch (error) {
      setActionError({ id, message: error.message });
    } finally {
      unmarkPending(id);
    }
  }

  async function handleCreate(values) {
    try {
      const created = await createDino(values);
      setForm(null);
      setListReloadKey((k) => k + 1);
      setSelectedId(created.id);
      setNotice({ type: 'success', text: `${created.name} joined the park.` });
    } catch (error) {
      if (error.createdId) {
        setForm(null);
        setListReloadKey((k) => k + 1);
        setSelectedId(error.createdId);
        setNotice({ type: 'error', text: error.message });
        return;
      }
      throw error;
    }
  }

  async function handleEdit(id, values) {
    markPending(id);
    try {
      const updated = await updateItem(id, values);
      setDetails((prev) => (prev.id === id && prev.data ? { ...prev, data: updated } : prev));
      setForm(null);
      setListReloadKey((k) => k + 1);
      setNotice({ type: 'success', text: `${updated.name} was updated.` });
    } finally {
      unmarkPending(id);
    }
  }

  async function handleDelete(item) {
    const id = item.id;
    const name = item.name;
    if (pendingIds.includes(id)) return;
    if (!window.confirm(`Remove ${name} from the park?`)) return;

    markPending(id);
    setActionError((prev) => (prev?.id === id ? null : prev));
    try {
      await deleteItem(id);
      setSelectedId((prev) => (prev === id ? null : prev));
      setListReloadKey((k) => k + 1);
      setNotice({ type: 'success', text: `${name} was removed.` });
    } catch (error) {
      setActionError({ id, message: error.message });
    } finally {
      unmarkPending(id);
    }
  }

  const isSelectedPending = selectedId !== null && pendingIds.includes(selectedId);

  return (
    <div className="app">
      <Header network={network} onNetworkChange={handleNetworkChange} onAdd={() => setForm({ mode: 'create' })} />

      <main className="layout">
        <DinoList
          items={items}
          status={listStatus}
          error={listError}
          search={search}
          sort={sort}
          page={page}
          pageInfo={pageInfo}
          selectedId={selectedId}
          pendingIds={pendingIds}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onPageChange={setPage}
          onReload={handleReload}
          onSelect={handleSelect}
          onAdd={() => setForm({ mode: 'create' })}
        />

        <DinoDetails
          selectedId={selectedId}
          details={details}
          isPending={isSelectedPending}
          actionError={actionError && actionError.id === selectedId ? actionError.message : ''}
          onRetry={() => setDetailsReloadKey((k) => k + 1)}
          onToggleDisplay={handleToggleDisplay}
          onEdit={(item) => setForm({ mode: 'edit', item })}
          onDelete={handleDelete}
          onClose={() => setSelectedId(null)}
        />
      </main>

      {form && (
        <DinoForm
          key={form.mode === 'edit' ? `edit-${form.item.id}` : 'create'}
          mode={form.mode}
          initialItem={form.mode === 'edit' ? form.item : null}
          onSubmit={(values) => (form.mode === 'edit' ? handleEdit(form.item.id, values) : handleCreate(values))}
          onCancel={() => setForm(null)}
        />
      )}

      {notice && <Toast type={notice.type} text={notice.text} onClose={() => setNotice(null)} />}

      <p className="credits">
        Dinosaur pictures: DBCLS (CC BY 4.0) and Fred Wierum (CC BY-SA 4.0), via Wikimedia Commons.
      </p>
    </div>
  );
}
