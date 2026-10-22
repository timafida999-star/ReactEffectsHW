# Dino Park Registry

Task 4 — Async React: Effects & API. A dinosaur registry built on the provided
[fake API](https://github.com/leravanna/fake-api): Promises, random delays, random errors and `localStorage`.

**Live demo:** https://timafida999-star.github.io/REPO-NAME/

## Features

- List of dinosaurs loaded with `useEffect`, with search, sorting and pagination
- Select a dinosaur to load its full profile (11 fields) asynchronously
- Create, edit and delete dinosaurs
- "Put on display / Hide from visitors" action that updates the selected item through the API
- Loading, error, empty and success states for the list, the profile and every action
- Reload button for the list
- Network switch (normal / slow / unstable / fast) to demonstrate delays, errors and race conditions

## Project structure

```
src/
├── api/
│   ├── fakeApi.js              provided API, NOT modified
│   ├── settings.js             delays, error chance, localStorage key
│   ├── initial-data-sample.js  12 dinosaurs with 11 fields each
│   ├── dinoApi.js              thin layer: components import the API only from here
│   └── network.js              network presets for the demo
├── components/
│   ├── Header.jsx       title, network switch, Add button
│   ├── DinoList.jsx     search, sort, Reload, list states, pagination
│   ├── DinoListItem.jsx one row (short info)
│   ├── DinoDetails.jsx  full profile and actions
│   ├── DinoForm.jsx     create / edit form in a modal
│   ├── StateView.jsx    loading / error / empty block
│   ├── Avatar.jsx, Pagination.jsx, Toast.jsx
├── App.jsx              all state, effects and API calls
├── constants.js, debug.js
└── styles/              SCSS partials
```

## How the requirements are handled

**Effects and dependencies.** `App.jsx` has three effects:

| Effect | Dependencies | Cleanup |
|---|---|---|
| Load list | `[search, sort, page, listReloadKey]` | marks the request as outdated (`ignore = true`) |
| Load details | `[selectedId, detailsReloadKey]` | marks the request as outdated |
| Hide toast | `[notice]` | `clearTimeout` |

The Reload and "Try again" buttons bump a counter that is listed in the dependencies, so the effect runs again.

**Race conditions.** Each effect run has its own `ignore` flag. When the user selects another dinosaur, the cleanup
of the previous run sets `ignore = true`, so its late response is dropped. On top of that, the details state stores
the id it belongs to, and the profile is shown only when `details.id === selectedId`.

**Stale closures.** In `handleToggleDisplay`, `handleEdit` and `handleDelete`:

1. the item id (and the new value) is captured **before** `await`;
2. the id is added to `pendingIds`, which disables conflicting buttons for that dinosaur;
3. after `await`, state is updated with **functional updates** and matched **by the captured id**,
   so the response always updates the right dinosaur, even if the user selected another one meanwhile.

**Creating items with all fields.** The provided `createItem()` saves only `name` and `description`, and the API must
not be modified. `createDino()` in `dinoApi.js` therefore sends two requests: create, then PATCH the other fields.

**Restrictions.** Only `useState` and `useEffect`, no custom hooks, no debouncing, no fetching libraries.
Components never touch `localStorage`; only `fakeApi.js` does.

## Demo for the defense

Open DevTools → Console, set **Network → Slow** and click several dinosaurs quickly.
The console shows `[effect]`, `[cleanup]`, `[ignored]` and `[done]` messages, and the profile always shows the last
clicked dinosaur. Start "Hide from visitors" and switch to another dinosaur before it finishes: the first one is updated
in the list, the open profile is not touched.

To reset the data, delete the `dino-park-data` key in DevTools → Application → Local Storage and refresh.

## Run locally

```bash
npm install
npm run dev
```

## Image credits

Dinosaur pictures from Wikimedia Commons: DBCLS, [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
(T-Rex, Triceratops, Stegosaurus, Brachiosaurus, Ankylosaurus, Spinosaurus) and Fred Wierum,
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) (Velociraptor).
