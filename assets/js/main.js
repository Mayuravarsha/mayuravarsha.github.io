(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
  });
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

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
  if (!reduceMotion && typeof TYPED_WORDS !== 'undefined') {
    let w = 0, i = TYPED_WORDS[0].length, deleting = true;
    const tick = () => {
      const word = TYPED_WORDS[w];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 40 : 80;
      if (!deleting && i === word.length) { deleting = true; delay = 2200; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % TYPED_WORDS.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 2500);
  }

  /* ---------- Stat counters ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const fmt = (v) => prefix + v.toFixed(decimals) + suffix;
    if (reduceMotion) return (el.textContent = fmt(target));
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = fmt(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }
    });
  });
  document.querySelectorAll('[data-count]').forEach((el) => countObserver.observe(el));

  /* ---------- Experience timeline ---------- */
  $('#timeline').innerHTML = EXPERIENCE.map(
    (job) => `
    <li class="tl-item">
      <div class="tl-dot"></div>
      <div class="tl-card glass">
        <div class="tl-head">
          <div>
            <h3>${esc(job.role)} <span class="at">@ ${esc(job.company)}</span></h3>
            <p class="muted">${esc(job.location)}</p>
          </div>
          <span class="mono period">${esc(job.period)}</span>
        </div>
        <ul class="bullets">${job.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        <div class="chips small">${job.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
      </div>
    </li>`
  ).join('');

  /* ---------- Projects ---------- */
  const grid = $('#projectGrid');
  const filters = $('#filters');
  const allTags = ['All', ...new Set(PROJECTS.flatMap((p) => p.tags))];

  const linkIcon =
    '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  const renderProjects = (tag) => {
    const list = tag === 'All' ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(tag));
    grid.innerHTML = list
      .map((p) => {
        const links = (p.links || [])
          .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ${linkIcon}</a>`)
          .join('');
        const more = p.points && p.points.length
          ? `<details><summary>Details</summary><ul class="bullets">${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>`
          : '';
        return `
        <article class="project glass ${p.featured ? 'featured' : ''}">
          <div class="project-top">
            <svg class="folder" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            <div class="project-links">${links}</div>
          </div>
          ${p.badge ? `<span class="badge">★ ${esc(p.badge)}</span>` : ''}
          <h3>${esc(p.title)}</h3>
          ${p.period ? `<p class="mono muted small-text">${esc(p.period)}</p>` : ''}
          <p class="summary">${esc(p.summary)}</p>
          ${more}
          <div class="chips small">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</div>
        </article>`;
      })
      .join('');
    attachTilt();
  };

  filters.innerHTML = allTags
    .map((t, i) => `<button role="tab" class="filter ${i === 0 ? 'active' : ''}" data-tag="${esc(t)}">${esc(t)}</button>`)
    .join('');
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    filters.querySelectorAll('.filter').forEach((b) => b.classList.toggle('active', b === btn));
    renderProjects(btn.dataset.tag);
  });

  /* Subtle glow that follows the cursor on cards */
  function attachTilt() {
    document.querySelectorAll('.glass').forEach((card) => {
      if (card.dataset.glow) return;
      card.dataset.glow = '1';
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  renderProjects('All');

  /* ---------- Skills ---------- */
  $('#skillsGrid').innerHTML = SKILLS.map(
    (s) => `
    <div class="skill-card glass">
      <div class="skill-head"><span class="skill-icon">${s.icon}</span><h3>${esc(s.group)}</h3></div>
      <div class="chips">${s.items.map((i) => `<span>${esc(i)}</span>`).join('')}</div>
    </div>`
  ).join('');
  attachTilt();

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  $('#year').textContent = new Date().getFullYear();
})();
