/*
 * Inline SVG diagrams for case studies. Colors come from CSS classes (see .dg-* in style.css)
 * so they follow the light/dark theme.
 */
const DIAGRAMS = (() => {
  const box = (x, y, w, h, title, sub, cls = '') => `
    <g class="dg-node ${cls}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" />
      <text class="dg-title" x="${x + w / 2}" y="${y + (sub ? h / 2 - 3 : h / 2 + 5)}">${title}</text>
      ${sub ? `<text class="dg-sub" x="${x + w / 2}" y="${y + h / 2 + 14}">${sub}</text>` : ''}
    </g>`;
  const arrow = (d, id, cls = '') => `<path class="dg-edge ${cls}" d="${d}" marker-end="url(#${id}${cls.includes('hot') ? '-hot' : ''})" />`;
  const label = (x, y, text, cls = '') => `<text class="dg-label ${cls}" x="${x}" y="${y}">${text}</text>`;
  const defs = (id) => `
    <defs>
      <marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="dg-head" d="M0 0 L10 5 L0 10 z" />
      </marker>
      <marker id="${id}-hot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="dg-head hot" d="M0 0 L10 5 L0 10 z" />
      </marker>
    </defs>`;

  const violence = () => {
    const id = 'ah-violence';
    return `
    <svg class="diagram" viewBox="0 0 480 380" role="img" aria-labelledby="dg-v-title">
      <title id="dg-v-title">Cascaded inference: the audio CNN screens each clip and the C3D video model runs only when audio finds no violence.</title>
      ${defs(id)}
      ${label(22, 76, 'AUDIO', 'lane start')}
      ${label(458, 76, 'VISUAL', 'lane end')}
      ${box(160, 12, 160, 40, 'Input clip', 'MP4 / AVI')}
      ${arrow('M240 52 V64 H120 V82', id)}
      ${arrow('M240 52 V64 H360 V82', id)}
      ${box(20, 84, 200, 48, 'Audio track', 'FFmpeg → WAV → STFT')}
      ${box(260, 84, 200, 48, 'Frames', '16-frame chunks · 112×112')}
      ${arrow('M120 132 V154', id)}
      ${box(20, 156, 200, 48, 'Audio CNN', '7 layers · 7.8M params', 'accent')}
      ${arrow('M120 204 V222', id)}
      <g class="dg-node">
        <polygon points="120,224 178,256 120,288 62,256" />
        <text class="dg-title" x="120" y="261">violent?</text>
      </g>
      ${arrow('M120 288 V314', id, 'hot')}
      ${label(132, 306, 'yes', 'hot start')}
      ${box(20, 316, 200, 48, 'Flag as violent', 'video model skipped', 'hot')}
      ${arrow('M178 256 H238 V180 H258', id)}
      ${label(192, 250, 'no', 'start')}
      ${arrow('M360 132 V154', id)}
      ${box(260, 156, 200, 48, 'C3D (Sports-1M)', 'frozen feature extractor')}
      ${arrow('M360 204 V226', id)}
      ${box(260, 228, 200, 48, 'Dense head', '4.7M trainable params', 'accent')}
      ${arrow('M360 276 V314', id)}
      ${box(260, 316, 200, 48, 'Violent / non-violent', 'final label')}
    </svg>`;
  };

  const rides = () => {
    const id = 'ah-rides';
    return `
    <svg class="diagram" viewBox="0 0 480 404" role="img" aria-labelledby="dg-r-title">
      <title id="dg-r-title">The Flask producer publishes each ride to a work queue for matching workers and a persistence queue for a MongoDB writer.</title>
      ${defs(id)}
      ${box(170, 12, 140, 40, 'Ride request', '')}
      ${arrow('M240 52 V74', id)}
      ${box(140, 76, 200, 48, 'Flask producer', 'publishes to both queues')}
      <rect class="dg-group" x="12" y="146" width="456" height="104" rx="14" />
      ${label(28, 166, 'RABBITMQ', 'lane start')}
      ${arrow('M240 124 V138 H120 V178', id)}
      ${arrow('M240 124 V138 H360 V178', id)}
      ${box(30, 180, 180, 52, 'Work queue', 'persistent messages')}
      ${box(270, 180, 180, 52, 'Persistence queue', 'persistent messages')}
      ${arrow('M90 232 V286', id)}
      ${arrow('M150 286 V236', id, 'hot dashed')}
      ${label(158, 266, 'requeued if', 'hot start')}
      ${label(158, 279, 'a worker dies', 'hot start')}
      ${arrow('M360 232 V286', id)}
      <rect class="dg-stack" x="38" y="296" width="180" height="52" rx="10" />
      <rect class="dg-stack" x="34" y="292" width="180" height="52" rx="10" />
      ${box(30, 288, 180, 52, 'Matching workers × N', 'prefetch 1 · ack after work', 'accent')}
      ${box(270, 288, 180, 52, 'MongoDB writer', 'keyed by shared request ID')}
      ${arrow('M360 340 V358', id)}
      ${box(290, 360, 140, 36, 'MongoDB', '')}
    </svg>`;
  };


  const lob = () => {
    const id = 'ah-lob';
    return `
    <svg class="diagram" viewBox="0 0 480 452" role="img" aria-labelledby="dg-l-title">
      <title id="dg-l-title">Market events and the market making strategy feed a C++ order book through a batched pybind11 API. Fills that respect queue position are split into spread capture, adverse selection and net profit per share.</title>
      ${defs(id)}
      ${box(20, 12, 200, 48, 'Market events', '400K simulated events')}
      ${box(260, 12, 200, 48, 'Market making strategy', 'quotes both sides')}
      ${arrow('M120 60 V74 H230 V94', id)}
      ${arrow('M360 60 V74 H250 V94', id)}
      ${box(100, 96, 280, 48, 'pybind11 batch API', 'about 10x faster than one call per event', 'accent')}
      <rect class="dg-group" x="12" y="166" width="456" height="138" rx="14" />
      ${label(28, 186, 'C++17 ORDER BOOK', 'lane start')}
      ${arrow('M240 144 V194', id)}
      ${box(30, 196, 190, 46, 'Bid levels', 'FIFO queue per price')}
      ${box(260, 196, 190, 46, 'Ask levels', 'FIFO queue per price')}
      ${box(130, 252, 220, 42, 'Pool allocator', 'no allocation on the hot path')}
      ${arrow('M240 304 V324', id)}
      ${box(90, 326, 300, 48, 'Fills with queue position', 'filled only after orders ahead are gone')}
      ${arrow('M240 374 V384 H90 V398', id)}
      ${arrow('M240 374 V396', id)}
      ${arrow('M240 384 H390 V398', id)}
      ${box(20, 400, 140, 46, '+1.40¢', 'spread captured')}
      ${box(170, 400, 140, 46, '−1.05¢', 'adverse selection', 'hot')}
      ${box(320, 400, 140, 46, '+0.55¢', 'net with +0.20¢ rebate', 'accent')}
    </svg>`;
  };

  const options = () => {
    const id = 'ah-options';
    return `
    <svg class="diagram" viewBox="0 0 480 382" role="img" aria-labelledby="dg-o-title">
      <title id="dg-o-title">Option chains go through an implied volatility solver and an SVI surface fit with arbitrage checks. Price history goes through a GJR-GARCH forecast tested out of sample. The two meet to measure the variance risk premium.</title>
      ${defs(id)}
      ${label(22, 76, 'SURFACES', 'lane start')}
      ${label(458, 76, 'FORECASTING', 'lane end')}
      ${box(20, 12, 200, 48, 'Option chains', 'SPY · AAPL · TSLA')}
      ${box(260, 12, 200, 48, 'Price history', 'daily returns')}
      ${arrow('M120 60 V84', id)}
      ${arrow('M360 60 V84', id)}
      ${box(20, 86, 200, 48, 'Implied volatility', 'Black-Scholes · Newton and Brent')}
      ${box(260, 86, 200, 48, 'GJR-GARCH', 'volatility forecast')}
      ${arrow('M120 134 V158', id)}
      ${arrow('M360 134 V158', id)}
      ${box(20, 160, 200, 48, 'SVI surface fit', 'one smile per expiry')}
      ${box(260, 160, 200, 48, 'Out of sample test', '2,500 days · QLIKE loss')}
      ${arrow('M120 208 V232', id)}
      ${box(20, 234, 200, 48, 'Arbitrage checks', 'butterfly and calendar', 'accent')}
      ${arrow('M360 208 V316', id)}
      ${arrow('M120 282 V316', id)}
      ${label(240, 304, 'implied vs forecast')}
      ${box(100, 318, 280, 52, 'Variance risk premium', 'about 1 vol point', 'accent')}
    </svg>`;
  };

  return { violence, rides, lob, options };
})();
