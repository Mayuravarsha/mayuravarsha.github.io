(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isExternal = (url) => /^https?:/.test(url);
  const linkIcon =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const chips = (items, cls = 'small') => `<div class="chips ${cls}">${items.map((s) => `<span>${esc(s)}</span>`).join('')}</div>`;
  const links = (list = []) =>
    list
      .map((l) =>
        isExternal(l.url)
          ? `<a class="text-link" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${linkIcon}</a>`
          : `<a class="text-link" href="${esc(l.url)}">${esc(l.label)} →</a>`
      )
      .join('');

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  $('#themeToggle').addEventListener('click', () => {
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    const next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  const setMenu = (open) => {
    navLinks.classList.toggle('open', open);
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
  };
  menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });

  /* ---------- Nav shadow on scroll + active link ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('.nav-links a').forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

  /* ---------- Typed headline ---------- */
  const typed = $('#typed');
  if (!reduceMotion) {
    let w = 0, i = TYPED_WORDS[0].length, deleting = true;
    const tick = () => {
      const word = TYPED_WORDS[w];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 75;
      if (!deleting && i === word.length) { deleting = true; delay = 2400; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % TYPED_WORDS.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2800);
  }

  /* ---------- Toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  /* ---------- Case studies ---------- */
  $('#caseStudies').innerHTML = CASE_STUDIES.map(
    (c, idx) => `
    <article class="case ${idx % 2 ? 'flip' : ''}" id="${esc(c.id)}">
      <div class="case-body">
        <p class="kicker mono">${esc(c.kicker)}</p>
        <h3 class="case-title">${esc(c.title)}</h3>
        ${c.badge ? `<span class="badge">★ ${esc(c.badge)}</span>` : ''}
        <p class="pitch">${esc(c.pitch)}</p>
        <p class="problem"><span class="label mono">Why</span>${esc(c.problem)}</p>
        ${
          c.results
            ? `<div class="results">${c.results
                .map((r) => `<div class="result"><span class="value">${esc(r.value)}</span><span class="rlabel">${esc(r.label)}</span></div>`)
                .join('')}</div>`
            : ''
        }
        ${c.guarantees ? `<ul class="checks">${c.guarantees.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
        ${chips(c.stack)}
        <div class="case-links">${links(c.links)}</div>
      </div>
      <div class="case-side">
        ${c.diagram && DIAGRAMS[c.diagram] ? `<figure class="diagram-wrap glass">${DIAGRAMS[c.diagram]()}</figure>` : ''}
        <details class="how glass">
          <summary>How it works</summary>
          <ol class="steps">
            ${c.approach.map((s) => `<li><strong>${esc(s.head)}.</strong> ${esc(s.body)}</li>`).join('')}
          </ol>
        </details>
      </div>
    </article>`
  ).join('');

  /* ---------- More projects ---------- */
  if (PROJECTS.length) {
    $('#projectGrid').innerHTML = PROJECTS.map(
      (p) => `
      <article class="project glass">
        <p class="kicker mono">${esc(p.kicker || '')}</p>
        <h4>${esc(p.title)}</h4>
        <p class="summary">${esc(p.summary)}</p>
        ${chips(p.stack)}
        ${p.links && p.links.length ? `<div class="case-links">${links(p.links)}</div>` : ''}
      </article>`
    ).join('');
  } else {
    $('#moreHead').remove();
  }

  /* ---------- Research ---------- */
  const citation = (p) =>
    `${p.authors.slice(0, -1).join(', ')}, and ${p.authors[p.authors.length - 1]}, "${p.title}," ${p.conference}, ` +
    `Bangalore, India, ${p.year}, pp. ${p.pages}, doi: ${p.doi}.`;

  $('#publications').innerHTML = PUBLICATIONS.map(
    (p, i) => `
    <article class="publication glass">
      <div class="pub-meta mono">
        <span>Peer-reviewed · ${esc(p.publisher)} · ${p.year}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <p class="authors">${p.authors.map((a) => (a === p.me ? `<strong>${esc(a)}</strong>` : esc(a))).join(', ')}</p>
      <p class="venue">${esc(p.conference)}, ${esc(p.place)}, pp. ${esc(p.pages)}.</p>
      ${p.award ? `<div class="award-ribbon"><span aria-hidden="true">🏆</span> ${esc(p.award)}</div>` : ''}
      ${p.role ? `<p class="pub-role"><span class="label mono">My part</span>${esc(p.role)}</p>` : ''}
      <div class="pub-actions">
        <a class="btn btn-primary btn-sm" href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">Read on IEEE Xplore ${linkIcon}</a>
        <button class="btn btn-ghost btn-sm" data-cite="${i}">Copy citation</button>
        ${p.caseStudy ? `<a class="btn btn-ghost btn-sm" href="${esc(p.caseStudy)}">Project write-up</a>` : ''}
      </div>
      <p class="doi mono">DOI <a href="https://doi.org/${esc(p.doi)}" target="_blank" rel="noopener">${esc(p.doi)}</a></p>
    </article>`
  ).join('');

  $('#publications').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-cite]');
    if (!btn) return;
    const text = citation(PUBLICATIONS[+btn.dataset.cite]);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Citation copied (IEEE format)');
    } catch (err) {
      window.prompt('Copy the citation', text);
    }
  });

  /* ---------- Experience ---------- */
  $('#jobs').innerHTML = EXPERIENCE.map(
    (j) => `
    <article class="job glass">
      <header class="job-head">
        <div>
          <h3>${esc(j.company)}</h3>
          <p class="role">${esc(j.role)}</p>
        </div>
        <div class="job-when mono">
          <span>${esc(j.period)}</span>
          <span class="muted">${esc(j.location)}</span>
        </div>
      </header>
      ${j.intro ? `<p class="job-intro">${esc(j.intro)}</p>` : ''}
      ${
        j.highlights.length
          ? `<ul class="impact">${j.highlights
              .map((h) => `<li><span class="impact-tag mono">${esc(h.tag)}</span><span>${esc(h.text)}</span></li>`)
              .join('')}</ul>`
          : ''
      }
    </article>`
  ).join('');

  /* ---------- Toolbox ---------- */
  $('#toolbox').innerHTML = TOOLBOX.map(
    (t) => `<div class="tool-row"><span class="tool-group mono">${esc(t.group)}</span>${chips(t.items)}</div>`
  ).join('');

  /* ---------- Cursor glow on cards ---------- */
  document.querySelectorAll('.glass').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    },
    { threshold: 0.05 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  $('#year').textContent = new Date().getFullYear();
})();
