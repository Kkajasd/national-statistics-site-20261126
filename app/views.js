// Page renderers for NusaStats. Each view returns an HTML string for one
// hash route. All figures come from data.js; every figure on screen names
// its source and year, per the bounty brief.

import { AGE_2024, COUNTRY, PEOPLE, PROVINCES, SECTORS_2024, SERIES, SOURCES, TRADE_2024, YEARS, fmt, gdpPerCapitaRpMillion } from './data.js';
import { barChart, hbarChart, lineChart } from './charts.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const LAST = YEARS.length - 1;

function card(value, label, source) {
  return `<div class="card"><div class="card-value">${escape(value)}</div><div class="card-label">${escape(label)}</div><div class="card-source">${escape(source)}</div></div>`;
}

function sectionTitle(title, note) {
  return `<h1>${escape(title)}</h1><p class="lede">${escape(note)}</p>`;
}

// --- Overview -------------------------------------------------------------
export function homeView(state) {
  const metric = state.chart === 'population' ? 'population' : 'gdp';
  const chart =
    metric === 'population'
      ? barChart({ labels: YEARS.map(String), values: SERIES.populationMillions, format: (v) => fmt.one(v) })
      : barChart({ labels: YEARS.map(String), values: SERIES.gdpRpTrillion, format: (v) => fmt.int(v) });
  const chartTitle = metric === 'population' ? 'Population, millions, 2019–2024 (BPS)' : 'GDP, trillion rupiah, 2019–2024 (BPS)';
  return `
  <section class="hero">
    <p class="kicker">NusaStats · Indonesia in numbers</p>
    <h1>Indonesia, in numbers.</h1>
    <p class="lede">The headline statistics of the world's fourth most populous country — population, economy, people and regions — from published official figures, kept up to date and explained in plain words.</p>
  </section>
  <div class="cards">
    ${card(fmt.one(SERIES.populationMillions[LAST]) + ' m', 'Population', 'BPS, mid-2024')}
    ${card('Rp ' + fmt.int(SERIES.gdpRpTrillion[LAST]) + ' tn', 'GDP, current prices', 'BPS, 2024')}
    ${card('Rp ' + fmt.one(gdpPerCapitaRpMillion(LAST)) + ' m', 'GDP per person', 'BPS, 2024, computed')}
    ${card(fmt.signed(SERIES.gdpGrowth[LAST]) + '%', 'Real GDP growth', 'BPS, 2024')}
    ${card(fmt.two(SERIES.inflation[LAST]) + '%', 'Inflation, Dec year on year', 'BPS, 2024')}
    ${card(fmt.two(SERIES.unemployment[LAST]) + '%', 'Unemployment, August', 'BPS, 2024')}
  </div>
  <section class="panel">
    <div class="panel-head">
      <h2>${escape(chartTitle)}</h2>
      <div class="toggle" role="group" aria-label="Choose the chart">
        <button data-chart="gdp" class="${metric === 'gdp' ? 'active' : ''}">GDP</button>
        <button data-chart="population" class="${metric === 'population' ? 'active' : ''}">Population</button>
      </div>
    </div>
    ${chart}
    <p class="note">Tap GDP or Population to switch the chart. The 2020 dip is the COVID-19 recession: real GDP fell 2.07% that year, the first contraction since 1998.</p>
  </section>
  <section class="panel">
    <h2>At a glance</h2>
    <ul class="facts">
      <li><strong>38 provinces</strong> across more than 17,000 islands, from Aceh to Papua.</li>
      <li><strong>8.57% of people live below the poverty line</strong> (BPS, September 2024) — the lowest on record.</li>
      <li><strong>US$ 264.7 billion of exports in 2024</strong> against US$ 233.7 billion of imports (BPS).</li>
      <li><strong>Life expectancy 74.1 years</strong> and a human development index of 75.0 (BPS, 2024).</li>
    </ul>
    <p class="note">Every figure on this site names its source and year. See <a href="#/sources">Sources &amp; methods</a>.</p>
  </section>`;
}

// --- Economy --------------------------------------------------------------
export function economyView(state) {
  const i = state.yearIndex;
  const year = YEARS[i];
  const options = YEARS.map((y, j) => `<option value="${j}" ${j === i ? 'selected' : ''}>${y}</option>`).join('');
  return `
  ${sectionTitle('Economy', 'How big the economy is, how fast it grows, what it is made of, and what it trades.')}
  <section class="panel">
    <div class="panel-head">
      <h2>Pick a year</h2>
      <label class="year-pick">Year <select id="year-select" aria-label="Choose a year">${options}</select></label>
    </div>
    <div class="cards">
      ${card('Rp ' + fmt.int(SERIES.gdpRpTrillion[i]) + ' tn', 'GDP, current prices', 'BPS, ' + year)}
      ${card(fmt.signed(SERIES.gdpGrowth[i]) + '%', 'Real GDP growth', 'BPS, ' + year)}
      ${card('Rp ' + fmt.one(gdpPerCapitaRpMillion(i)) + ' m', 'GDP per person', 'BPS, ' + year + ', computed')}
      ${card(fmt.two(SERIES.inflation[i]) + '%', 'Inflation, December y/y', 'BPS, ' + year)}
    </div>
    <p class="note">The year selector updates every figure in this panel. 2020 shows the pandemic year: GDP shrank in nominal terms and real growth was −2.07%.</p>
  </section>
  <section class="panel">
    <h2>GDP growth, 2019–2024</h2>
    ${lineChart({ labels: YEARS.map(String), values: SERIES.gdpGrowth, format: (v) => fmt.signed(v) + '%' })}
    <p class="note">Real GDP growth, percent year on year (BPS). Growth has held near 5% a year since the 2021 recovery.</p>
  </section>
  <section class="panel">
    <h2>What the economy is made of — 2024</h2>
    ${hbarChart({ rows: SECTORS_2024.map((s) => ({ label: s.name, value: s.share })), format: (v) => fmt.one(v) + '%' })}
    <p class="note">Share of GDP by sector, percent (BPS, 2024). Manufacturing is the largest single sector; services together are more than half the economy.</p>
  </section>
  <section class="panel">
    <h2>Trade — 2024</h2>
    <div class="cards">
      ${card('US$ ' + fmt.one(TRADE_2024.exports) + ' bn', 'Exports', 'BPS, 2024')}
      ${card('US$ ' + fmt.one(TRADE_2024.imports) + ' bn', 'Imports', 'BPS, 2024')}
      ${card('US$ ' + fmt.one(TRADE_2024.surplus) + ' bn', 'Trade surplus', 'BPS, 2024')}
    </div>
    <p class="note">Top exports: ${escape(TRADE_2024.topExports)}. Largest trading partner: ${escape(TRADE_2024.topPartner)}.</p>
  </section>`;
}

// --- Population -----------------------------------------------------------
export function populationView() {
  return `
  ${sectionTitle('Population', 'How many people, how the population is changing, and where they live.')}
  <div class="cards">
    ${card(fmt.one(SERIES.populationMillions[LAST]) + ' m', 'Population', 'BPS, mid-2024')}
    ${card('4th', 'Most populous country', 'World Bank, 2024')}
    ${card('57%', 'Live on Java', 'BPS, 2020 census')}
    ${card('~1.0%', 'Annual growth', 'BPS, 2024')}
  </div>
  <section class="panel">
    <h2>Population, 2019–2024</h2>
    ${barChart({ labels: YEARS.map(String), values: SERIES.populationMillions, format: (v) => fmt.one(v) })}
    <p class="note">Mid-year population, millions (BPS; 2020 is the census count). Growth has slowed to about 1% a year as fertility falls.</p>
  </section>
  <section class="panel">
    <h2>Age structure — 2024</h2>
    ${hbarChart({ rows: AGE_2024.map((a) => ({ label: a.group, value: a.share })), format: (v) => fmt.one(v) + '%' })}
    <p class="note">Share of population by age group, percent (BPS, 2024, rounded). Two in three Indonesians are of working age — the demographic dividend.</p>
  </section>
  <section class="panel">
    <h2>Where people live</h2>
    ${hbarChart({ rows: PROVINCES.slice(0, 6).map((p) => ({ label: p.name, value: p.pop })), format: (v) => fmt.one(v) + ' m' })}
    <p class="note">Most populous provinces, millions (BPS, mid-2024). West Java alone holds about one in six Indonesians. Full table: <a href="#/regions">Regions</a>.</p>
  </section>`;
}

// --- People ---------------------------------------------------------------
export function peopleView() {
  return `
  ${sectionTitle('People', 'Health, education and living standards — how life is changing for Indonesians.')}
  <div class="cards">
    ${card(fmt.one(PEOPLE.lifeExpectancy.value) + ' yrs', 'Life expectancy', 'BPS, ' + PEOPLE.lifeExpectancy.year)}
    ${card(fmt.one(PEOPLE.literacy.value) + '%', 'Literacy, age 15+', 'BPS, ' + PEOPLE.literacy.year)}
    ${card(fmt.one(PEOPLE.meanSchooling.value) + ' yrs', 'Mean years of schooling', 'BPS, ' + PEOPLE.meanSchooling.year)}
    ${card(fmt.one(PEOPLE.hdi.value), 'Human development index', 'BPS, ' + PEOPLE.hdi.year)}
    ${card(fmt.two(PEOPLE.gini.value), 'Gini ratio', 'BPS, ' + PEOPLE.gini.year)}
    ${card(fmt.one(PEOPLE.internetUsers.value) + '%', 'Internet users', PEOPLE.internetUsers.source + ', ' + PEOPLE.internetUsers.year)}
  </div>
  <section class="panel">
    <h2>Poverty is falling — 2019–2024</h2>
    ${lineChart({ labels: YEARS.map(String), values: SERIES.poverty, format: (v) => fmt.two(v) + '%' })}
    <p class="note">Poverty rate, percent of population in September each year (BPS). The pandemic pushed it above 10% in 2020; by September 2024 it reached 8.57%, the lowest on record.</p>
  </section>
  <section class="panel">
    <h2>Unemployment is back below 5% — 2019–2024</h2>
    ${lineChart({ labels: YEARS.map(String), values: SERIES.unemployment, format: (v) => fmt.two(v) + '%' })}
    <p class="note">Open unemployment rate, percent in August each year (BPS). It spiked to 7.07% in the pandemic year and fell to 4.91% by August 2024.</p>
  </section>`;
}

// --- Regions --------------------------------------------------------------
export function regionsView(state) {
  const q = (state.query || '').trim().toLowerCase();
  const rows = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q));
  const body =
    rows.length === 0
      ? `<tr><td colspan="3">No province matches “${escape(state.query)}”. Try another name.</td></tr>`
      : rows
          .map(
            (p) => `<tr><td>${escape(p.name)}</td><td>${fmt.one(p.pop)}</td><td>${fmt.one(p.poverty)}%</td></tr>`,
          )
          .join('');
  return `
  ${sectionTitle('Regions', 'The ten most populous provinces: how many people live there, and how many live in poverty.')}
  <section class="panel">
    <div class="panel-head">
      <h2>Provinces</h2>
      <label class="search">Search <input id="province-search" type="search" placeholder="e.g. Java" value="${escape(state.query || '')}" aria-label="Search provinces"></label>
    </div>
    <table class="data-table">
      <thead><tr><th>Province</th><th>Population (millions)</th><th>Poverty rate</th></tr></thead>
      <tbody>${body}</tbody>
    </table>
    <p class="note">Population: BPS mid-2024 estimates, millions. Poverty rate: BPS, September 2024, percent of the province's population. Jakarta's low rate reflects the capital's incomes; the national rate is 8.57%.</p>
  </section>
  <section class="panel">
    <h2>Population by province</h2>
    ${hbarChart({ rows: PROVINCES.map((p) => ({ label: p.name, value: p.pop })), format: (v) => fmt.one(v) + ' m' })}
    <p class="note">The ten most populous provinces, millions (BPS, mid-2024). Java's four provinces hold more than half the country.</p>
  </section>`;
}

// --- Sources --------------------------------------------------------------
export function sourcesView() {
  const items = SOURCES.map(
    (s) => `<li><strong>${escape(s.name)}</strong> (${escape(s.url)}) — ${escape(s.what)}.</li>`,
  ).join('');
  return `
  ${sectionTitle('Sources & methods', 'Where every number comes from, and how this site handles them.')}
  <section class="panel">
    <h2>Sources</h2>
    <ul class="facts">${items}</ul>
    <h2>Methods &amp; notes</h2>
    <ul class="facts">
      <li>Figures are the published headline values, rounded to the decimals shown; provincial figures are rounded estimates.</li>
      <li>GDP per person is computed from this site's own GDP and population series, so the dashboard can never disagree with its charts.</li>
      <li>Years are calendar years unless a month is named (inflation is December year on year; unemployment is August; poverty is September).</li>
      <li>${escape(COUNTRY.name)} has ${COUNTRY.provinces} provinces since the 2022 expansion in Papua. Currency is the ${escape(COUNTRY.currency)}.</li>
      <li>This site is an independent presentation of public statistics. It is not affiliated with BPS or any government body. Figures updated ${escape(COUNTRY.updated)}.</li>
    </ul>
  </section>`;
}

export function missingView() {
  return `<h1>Not found</h1><p class="lede">There is no page at this address. <a href="#/">Back to the overview</a>.</p>`;
}
