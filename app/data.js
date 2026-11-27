// Indonesia in numbers: published headline figures from BPS (Statistics
// Indonesia) and the World Bank, rounded for display. Every series below
// carries its year; single-year figures name their source in the views.
// GDP is in current-price rupiah; population is the mid-year estimate.

export const COUNTRY = {
  name: 'Indonesia',
  short: 'IDN',
  capital: 'Jakarta (Nusantara under construction)',
  provinces: 38,
  currency: 'Rupiah (IDR)',
  updated: 'November 2026',
};

// Annual series, 2019-2024. Values are the published headline numbers,
// rounded to the decimals shown.
export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

export const SERIES = {
  // Gross domestic product, current prices, trillion rupiah (BPS).
  gdpRpTrillion: [15833, 15443, 16971, 19588, 20892, 22139],
  // Real GDP growth, percent year on year (BPS).
  gdpGrowth: [5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
  // Mid-year population, millions (BPS census 2020 + projections).
  populationMillions: [268.1, 270.2, 272.7, 275.8, 278.7, 283.5],
  // Consumer price inflation, December year on year, percent (BPS).
  inflation: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
  // Open unemployment rate, August, percent (BPS).
  unemployment: [5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
  // Poverty rate, September, percent of population (BPS).
  poverty: [9.22, 10.19, 9.71, 9.57, 9.36, 8.57],
};

// GDP per capita is computed from the two series above, so the dashboard
// can never disagree with its own charts.
export function gdpPerCapitaRpMillion(yearIndex) {
  const gdp = SERIES.gdpRpTrillion[yearIndex] * 1e12;
  const pop = SERIES.populationMillions[yearIndex] * 1e6;
  return gdp / pop / 1e6;
}

// Largest sectors by share of GDP, 2024, percent (BPS).
export const SECTORS_2024 = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Wholesale & retail trade', share: 13.0 },
  { name: 'Agriculture, forestry & fishing', share: 12.5 },
  { name: 'Construction', share: 9.9 },
  { name: 'Mining & quarrying', share: 9.0 },
  { name: 'Transport & storage', share: 5.6 },
  { name: 'Information & communication', share: 5.4 },
  { name: 'All other sectors', share: 21.9 },
];

// Foreign trade, 2024, billion US dollars (BPS).
export const TRADE_2024 = {
  exports: 264.7,
  imports: 233.7,
  surplus: 31.0,
  topExports: 'Coal, palm oil, iron & steel, copper, nickel',
  topPartner: 'China, then the United States and Japan',
};

// Age structure, 2024, percent of population (BPS, rounded).
export const AGE_2024 = [
  { group: '0–14 years', share: 24.5 },
  { group: '15–64 years', share: 68.8 },
  { group: '65 years and over', share: 6.7 },
];

// People indicators, latest published year (BPS / World Bank).
export const PEOPLE = {
  lifeExpectancy: { value: 74.1, unit: 'years', year: 2024, source: 'BPS' },
  literacy: { value: 96.5, unit: '% of people 15+', year: 2024, source: 'BPS' },
  meanSchooling: { value: 9.3, unit: 'years', year: 2024, source: 'BPS' },
  hdi: { value: 75.0, unit: 'index (0–100)', year: 2024, source: 'BPS' },
  gini: { value: 0.379, unit: 'ratio (0–1)', year: 'Mar 2024', source: 'BPS' },
  internetUsers: { value: 79.5, unit: '% of population', year: 2024, source: 'APJII / World Bank' },
};

// Ten most populous provinces: mid-2024 population (millions) and
// September 2024 poverty rate (percent). BPS, rounded.
export const PROVINCES = [
  { name: 'West Java', pop: 50.4, poverty: 8.0 },
  { name: 'East Java', pop: 41.8, poverty: 10.3 },
  { name: 'Central Java', pop: 37.9, poverty: 10.5 },
  { name: 'North Sumatra', pop: 15.6, poverty: 8.2 },
  { name: 'Banten', pop: 12.4, poverty: 5.8 },
  { name: 'Jakarta', pop: 10.6, poverty: 4.1 },
  { name: 'South Sulawesi', pop: 9.5, poverty: 8.5 },
  { name: 'Lampung', pop: 9.3, poverty: 10.6 },
  { name: 'South Sumatra', pop: 8.9, poverty: 11.4 },
  { name: 'Riau', pop: 6.9, poverty: 6.9 },
];

export const SOURCES = [
  { name: 'BPS — Statistics Indonesia', what: 'GDP, population, inflation, unemployment, poverty, life expectancy, HDI', url: 'bps.go.id' },
  { name: 'World Bank — World Development Indicators', what: 'Cross-checks on GDP, trade and population', url: 'data.worldbank.org' },
  { name: 'APJII — Indonesian Internet Service Providers Association', what: 'Internet penetration, 2024', url: 'apjii.or.id' },
];

export const fmt = {
  int: (n) => String(Math.round(n)),
  one: (n) => n.toFixed(1),
  two: (n) => n.toFixed(2),
  signed: (n) => (n > 0 ? '+' : '') + n.toFixed(2),
};
