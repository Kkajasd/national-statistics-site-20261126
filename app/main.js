// Router and controls for NusaStats. Hash routes: #/ (overview), #/economy,
// #/population, #/people, #/regions, #/sources. The dashboard chart toggle,
// the economy year selector and the regions search all work by re-rendering
// the current view with new state — no page reload, no network.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { economyView, homeView, missingView, peopleView, populationView, regionsView, sourcesView } from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('nav a')];

// State that lives across renders of one visit.
const state = { chart: 'gdp', yearIndex: 5, query: '' };

const ROUTES = {
  '/': () => homeView(state),
  '/economy': () => economyView(state),
  '/population': () => populationView(),
  '/people': () => peopleView(),
  '/regions': () => regionsView(state),
  '/sources': () => sourcesView(),
};

const TITLES = {
  '/': 'NusaStats — Indonesia in numbers',
  '/economy': 'Economy | NusaStats',
  '/population': 'Population | NusaStats',
  '/people': 'People | NusaStats',
  '/regions': 'Regions | NusaStats',
  '/sources': 'Sources & methods | NusaStats',
};

function route() {
  const path = location.hash.replace(/^#/, '') || '/';
  return ROUTES[path] ? path : null;
}

function render() {
  window.__shotReady = false;
  const path = route();
  document.title = path ? TITLES[path] : 'Not found | NusaStats';
  app.innerHTML = path ? ROUTES[path]() : missingView();
  for (const a of navLinks) a.classList.toggle('active', a.getAttribute('href') === `#${path ?? ''}`);

  // Dashboard chart toggle.
  for (const button of app.querySelectorAll('[data-chart]')) {
    button.addEventListener('click', () => {
      state.chart = button.getAttribute('data-chart');
      render();
    });
  }
  // Economy year selector.
  const yearSelect = document.getElementById('year-select');
  if (yearSelect) {
    yearSelect.addEventListener('change', () => {
      state.yearIndex = Number(yearSelect.value);
      render();
    });
  }
  // Regions province search (keeps focus and caret while typing).
  const search = document.getElementById('province-search');
  if (search) {
    search.addEventListener('input', () => {
      state.query = search.value;
      const caret = search.selectionStart;
      render();
      const again = document.getElementById('province-search');
      again.focus();
      again.setSelectionRange(caret, caret);
    });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
