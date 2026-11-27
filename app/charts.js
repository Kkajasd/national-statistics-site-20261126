// Small SVG chart helpers, dependency-free. Every chart is drawn from the
// numbers passed in, with value labels on every bar and point, so a chart
// stays readable even as a small screenshot.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function niceMax(values) {
  const top = Math.max(...values);
  if (top <= 0) return 1;
  const step = 10 ** Math.floor(Math.log10(top));
  return Math.ceil(top / step) * step;
}

// Vertical bar chart. labels: short x labels; values: numbers; format:
// how to print a value above its bar.
export function barChart({ labels, values, format, height = 260, color = '#14635e', highlightLast = true }) {
  const width = 760;
  const padL = 46;
  const padB = 30;
  const padT = 26;
  const plotW = width - padL - 12;
  const plotH = height - padT - padB;
  const max = niceMax(values);
  const slot = plotW / values.length;
  const barW = Math.min(64, slot * 0.62);
  let bars = '';
  values.forEach((v, i) => {
    const h = Math.max(2, (v / max) * plotH);
    const x = padL + i * slot + (slot - barW) / 2;
    const y = padT + plotH - h;
    const fill = highlightLast && i === values.length - 1 ? '#e8a33d' : color;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="${fill}"/>`;
    bars += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 6).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="#1c2420">${escape(format(v))}</text>`;
    bars += `<text x="${(x + barW / 2).toFixed(1)}" y="${(padT + plotH + 20).toFixed(1)}" text-anchor="middle" font-size="13" fill="#4a564f">${escape(labels[i])}</text>`;
  });
  const grid = [0.5, 1]
    .map((f) => {
      const y = padT + plotH * (1 - f);
      return `<line x1="${padL}" y1="${y}" x2="${width - 12}" y2="${y}" stroke="#e3ddd2" stroke-width="1"/><text x="${padL - 8}" y="${y + 4}" text-anchor="end" font-size="12" fill="#6b756e">${escape(format(max * f))}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Bar chart">${grid}${bars}<line x1="${padL}" y1="${padT + plotH}" x2="${width - 12}" y2="${padT + plotH}" stroke="#c9c2b4" stroke-width="1"/></svg>`;
}

// Line chart with a dot and label on every point. Handles negative values.
export function lineChart({ labels, values, format, height = 260, color = '#14635e' }) {
  const width = 760;
  const padL = 46;
  const padB = 30;
  const padT = 26;
  const plotW = width - padL - 12;
  const plotH = height - padT - padB;
  const min = Math.min(0, ...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => padL + (i / (values.length - 1)) * plotW;
  const y = (v) => padT + plotH - ((v - min) / span) * plotH;
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const zeroY = y(0);
  let dots = '';
  values.forEach((v, i) => {
    dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="4.5" fill="#e8a33d" stroke="#1c2420" stroke-width="1"/>`;
    dots += `<text x="${x(i).toFixed(1)}" y="${(y(v) - 10).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="#1c2420">${escape(format(v))}</text>`;
    dots += `<text x="${x(i).toFixed(1)}" y="${(padT + plotH + 20).toFixed(1)}" text-anchor="middle" font-size="13" fill="#4a564f">${escape(labels[i])}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Line chart"><line x1="${padL}" y1="${zeroY}" x2="${width - 12}" y2="${zeroY}" stroke="#c9c2b4" stroke-width="1"/><polyline points="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${dots}</svg>`;
}

// Horizontal bars, one row per item: label left, bar, value right.
export function hbarChart({ rows, format, height = 280, color = '#14635e' }) {
  const width = 760;
  const labelW = 210;
  const valueW = 64;
  const rowH = (height - 16) / rows.length;
  const max = niceMax(rows.map((r) => r.value));
  let out = '';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const barW = ((width - labelW - valueW - 16) * r.value) / max;
    out += `<text x="0" y="${(y + rowH / 2 + 5).toFixed(1)}" font-size="14" fill="#1c2420">${escape(r.label)}</text>`;
    out += `<rect x="${labelW}" y="${(y + 6).toFixed(1)}" width="${Math.max(2, barW).toFixed(1)}" height="${(rowH - 12).toFixed(1)}" rx="3" fill="${color}"/>`;
    out += `<text x="${(labelW + Math.max(2, barW) + 8).toFixed(1)}" y="${(y + rowH / 2 + 5).toFixed(1)}" font-size="14" font-weight="700" fill="#1c2420">${escape(format(r.value))}</text>`;
  });
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="Horizontal bar chart">${out}</svg>`;
}
