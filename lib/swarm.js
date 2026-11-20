// Named cursors construct reached content, then settle into the footer.
const AGENTS = [
  ['Neo', '#e7a8a6', '#944a48'], ['Kit', '#c4d3a2', '#596a34'],
  ['Hex', '#9acfc5', '#316c60'], ['Lyn', '#d5b2cb', '#835570'],
  ['Eon', '#e2c19a', '#8b6036'], ['Jet', '#a7c9f0', '#3e6692'],
  ['Bex', '#a5cbb5', '#376c50'], ['Cal', '#beb9df', '#66578a'],
];
const ARROW = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 2l7.5 19 2.7-8 8-2.8z" fill="currentColor" stroke="var(--bg)" stroke-width="1.4" stroke-linejoin="round"/></svg>';
const PACE = {
  travel: 460,
  outline: 500,
  partTravel: 300,
  partReveal: 340,
  textTravel: 120,
  character: 10,
  handoff: 160,
  dock: 800,
  skipFade: 260,
  skipStagger: 40,
  skipMaxDelay: 320,
};
export function createSwarm() {
  const doc = document;
  const root = doc.documentElement;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (performance.getEntriesByType('navigation')[0]?.type === 'reload') scrollTo({ top: 0, left: 0, behavior: 'instant' });
  if (!root.classList.contains('swarm') || motion.matches) {
    root.classList.remove('swarm');
    return { destroy() {} };
  }

  const targets = [...doc.querySelectorAll('[data-b]')];
  const dock = doc.querySelector('[data-cursor-dock]');
  const header = doc.querySelector('header.site');
  const timers = new Map();
  const completed = new Set();
  const queued = new Set();
  const reached = new Set();
  const active = new Set();
  const busy = new Set();
  const blueprints = new Set();
  let generation = 0;
  let destroyed = false;
  let done = false;
  let starting = false;
  let completing = false;
  const completionAnimations = new Set();
  const completionCopies = new Set();
  let nextCursor = 0;
  let pending = [];
  let observer = null;
  let scrollFrame = null;
  let launchFrame = null;
  let dockTimer = null;
  let focusCleanup = null;

  // Split text nodes, not elements, so links, icons, and line breaks stay intact.
  doc.querySelectorAll('[data-type]').forEach((el) => {
    if (el.dataset.split) return;
    const walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement.closest('[data-type]') === el && !node.parentElement.closest('svg, .typed-readable')) nodes.push(node);
    }
    const full = nodes.map((node) => node.textContent + (node.nextSibling?.nodeName === 'BR' ? ' ' : '')).join('').replace(/\s+/g, ' ').trim();
    nodes.forEach((node) => {
      const fragment = doc.createDocumentFragment();
      node.textContent.split(/(\s+)/).filter(Boolean).forEach((word) => {
        if (/^\s+$/.test(word)) { fragment.appendChild(doc.createTextNode(word)); return; }
        const span = doc.createElement('span');
        span.className = 'w';
        span.setAttribute('aria-hidden', 'true');
        for (const character of word) {
          const char = doc.createElement('span');
          char.className = 'ch';
          char.textContent = character;
          span.appendChild(char);
        }
        fragment.appendChild(span);
      });
      const text = doc.createElement('span');
      text.className = 'typed-text';
      text.setAttribute('aria-hidden', 'true');
      text.appendChild(fragment);
      node.replaceWith(text);
    });
    const readable = doc.createElement('span');
    readable.className = 'typed-readable';
    readable.textContent = full;
    el.appendChild(readable);
    el.dataset.split = '1';
  });

  const overlay = doc.createElement('div');
  overlay.className = 'build-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  doc.body.appendChild(overlay);
  const headerOverlay = doc.createElement('div');
  headerOverlay.className = 'build-overlay header-build-overlay';
  headerOverlay.setAttribute('aria-hidden', 'true');
  doc.body.appendChild(headerOverlay);
  const cursors = AGENTS.map(([name, color, ink]) => {
    const cursor = doc.createElement('div');
    cursor.className = 'cur';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.style.setProperty('--cursor-color', color);
    cursor.style.setProperty('--cursor-ink', ink);
    cursor.innerHTML = ARROW + '<b>' + name + '</b>';
    cursor.style.transform = 'translate(-80px,-80px)';
    overlay.appendChild(cursor);
    return cursor;
  });

  const skipButton = doc.createElement('button');
  skipButton.className = 'skip-animation';
  skipButton.type = 'button';
  skipButton.hidden = true;
  skipButton.setAttribute('aria-controls', 'top');
  skipButton.setAttribute('aria-keyshortcuts', 'Escape');
  skipButton.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 6 6 6-6 6m6-12 6 6-6 6M20 5v14"/></svg><span>Skip Building</span>';
  doc.body.appendChild(skipButton);
  const skipStatus = doc.createElement('div');
  skipStatus.className = 'typed-readable';
  skipStatus.setAttribute('role', 'status');
  doc.body.appendChild(skipStatus);

  function moveSkipFocus(force = false) {
    if (!force && doc.activeElement !== skipButton) return;
    const destination = [...doc.querySelectorAll('main h1, main h2')].find((el) => inViewport(el) && getComputedStyle(el).visibility === 'visible') || doc.getElementById('top');
    if (!destination) { skipButton.blur(); return; }
    if (focusCleanup) focusCleanup();
    const previousTabIndex = destination.getAttribute('tabindex');
    const restore = () => {
      destination.removeEventListener('blur', restore);
      if (previousTabIndex === null) destination.removeAttribute('tabindex');
      else destination.setAttribute('tabindex', previousTabIndex);
      focusCleanup = null;
    };
    focusCleanup = restore;
    destination.setAttribute('tabindex', '-1');
    destination.focus({ preventScroll: true });
    destination.addEventListener('blur', restore, { once: true });
  }

  function updateSkipControl() {
    // Keep an available action in place while the visitor is activating it.
    const interacting = !skipButton.hidden && (skipButton.matches(':hover') || doc.activeElement === skipButton);
    const playing = !destroyed && !done && !completing && !motion.matches && (starting || active.size > 0 || interacting);
    if (!playing) moveSkipFocus();
    skipButton.hidden = !playing;
  }

  const isRenderable = (el) => !el.hidden && el.getClientRects().length > 0;
  const current = (gen) => !destroyed && gen === generation;
  const allFinished = () => targets.every((el) => !isRenderable(el) || completed.has(el));

  function later(callback, ms) {
    const timer = setTimeout(() => { timers.delete(timer); callback(); }, ms);
    timers.set(timer, null);
    return timer;
  }

  const sleep = (ms) => new Promise((resolve) => {
    const timer = setTimeout(() => { timers.delete(timer); resolve(); }, ms);
    timers.set(timer, resolve);
  });

  function clearTimers() {
    timers.forEach((resolve, timer) => { clearTimeout(timer); if (resolve) resolve(); });
    timers.clear();
  }

  function clearCompletion() {
    completionAnimations.forEach((animation) => animation.cancel());
    completionAnimations.clear();
    completionCopies.forEach((copy) => copy.replaceWith(...copy.childNodes));
    completionCopies.clear();
    completing = false;
  }

  function place(cursor, x, y, duration = PACE.travel / 1000) {
    const fixed = cursor.style.position === 'fixed';
    cursor.style.setProperty('--t', duration + 's');
    cursor.style.opacity = '1';
    cursor.style.transform = 'translate3d(' + (x + (fixed ? 0 : scrollX)) + 'px,' + (y + (fixed ? 0 : scrollY)) + 'px,0)';
  }

  function setCursorLayer(cursor, onHeader) {
    const layer = onHeader ? headerOverlay : overlay;
    const position = onHeader ? 'fixed' : 'absolute';
    if (cursor.parentElement === layer && cursor.style.position === position) return;
    // Preserve the visible position when switching between viewport and document coordinates.
    const rect = cursor.getBoundingClientRect();
    layer.appendChild(cursor);
    cursor.style.position = position;
    cursor.style.setProperty('--t', '0s');
    cursor.style.transform = 'translate3d(' + (rect.left + (onHeader ? 0 : scrollX)) + 'px,' + (rect.top + (onHeader ? 0 : scrollY)) + 'px,0)';
    void cursor.offsetWidth;
  }

  function anchor(cursor, el, corner = 0, duration = PACE.travel / 1000) {
    setCursorLayer(cursor, Boolean(el.closest('header.site')));
    const rect = el.getBoundingClientRect();
    const points = [[rect.left, rect.top], [rect.right, rect.top], [rect.right, rect.bottom], [rect.left, rect.bottom]];
    place(cursor, ...points[corner % 4], duration);
  }

  function releaseCursors() {
    if (dockTimer !== null) { clearTimeout(dockTimer); timers.delete(dockTimer); dockTimer = null; }
    cursors.forEach((cursor) => {
      if (!cursor.classList.contains('parked')) return;
      const rect = cursor.getBoundingClientRect();
      overlay.appendChild(cursor);
      cursor.classList.remove('parked');
      cursor.style.left = '0';
      cursor.style.top = '0';
      cursor.style.position = 'absolute';
      place(cursor, rect.left, rect.top, 0);
    });
    if (dock) dock.classList.remove('ready');
  }

  function parkCursors(instant = false) {
    if (destroyed || !done || motion.matches || !dock) return;
    releaseCursors();
    dock.classList.add('ready');
    const slots = [...dock.querySelectorAll('[data-cursor-slot]')];
    const gen = generation;
    const settleInDock = () => {
      dockTimer = null;
      if (!current(gen) || !done || motion.matches) return;
      cursors.forEach((cursor, index) => {
        slots[index].appendChild(cursor);
        cursor.style.position = 'absolute';
        cursor.style.left = 'calc(50% - 11px)';
        cursor.style.top = '2px';
        cursor.style.transform = 'none';
        cursor.classList.add('parked');
        cursor.style.opacity = '1';
      });
    };
    if (instant) { settleInDock(); return; }
    cursors.forEach((cursor, index) => {
      setCursorLayer(cursor, false);
      const rect = slots[index].getBoundingClientRect();
      place(cursor, rect.left + rect.width / 2 - 11, rect.top + 2, PACE.dock / 1000);
    });
    dockTimer = later(settleInDock, PACE.dock + 50);
  }

  const hideCursors = () => cursors.forEach((cursor) => {
    cursor.style.opacity = '0';
    setCursorLayer(cursor, false);
  });
  const removeBlueprint = (blueprint) => { blueprints.delete(blueprint); blueprint.remove(); };
  const clearBlueprints = () => { blueprints.forEach((blueprint) => blueprint.remove()); blueprints.clear(); };

  function inViewport(el) {
    const rect = el.getBoundingClientRect();
    const top = el.closest('header.site') ? 0 : (header?.offsetHeight || 0);
    const visibleHeight = Math.min(rect.bottom, innerHeight - 16) - Math.max(rect.top, top);
    return !el.hidden && rect.width > 0 && visibleHeight >= Math.min(rect.height * .12, 80);
  }

  function reveal(el, instant = false) {
    el.classList.add('built');
    if (instant) {
      el.removeAttribute('data-building');
      el.classList.remove('assembling', 'typing');
      el.querySelectorAll('.typing').forEach((text) => text.classList.remove('typing'));
      el.querySelectorAll('.ch').forEach((char) => { char.classList.add('on'); char.classList.remove('typing-head'); });
      el.querySelectorAll('[data-build-part]').forEach((part) => part.classList.add('part-built'));
    }
  }

  async function typeIn(el, cursor, gen) {
    const chars = [...el.querySelectorAll('.ch')];
    if (!chars.length || chars.every((char) => char.classList.contains('on'))) return;
    anchor(cursor, chars[0], 3, PACE.textTravel / 1000);
    await sleep(PACE.textTravel);
    if (!current(gen)) return;
    reveal(el);
    el.classList.add('typing');
    const interval = PACE.character;
    let head = null;
    try {
      for (let index = 0; index < chars.length; index++) {
        if (!current(gen)) return;
        if (head) head.classList.remove('typing-head');
        head = chars[index];
        head.classList.add('on', 'typing-head');
        if (index % 6 === 0 || index === chars.length - 1) anchor(cursor, head, 2, .08);
        await sleep(interval);
      }
    } finally {
      if (head) head.classList.remove('typing-head');
      el.classList.remove('typing');
    }
  }

  async function typeContents(el, crew, gen) {
    const fields = el.matches('[data-type]') ? [el] : [...el.querySelectorAll('[data-type]')];
    let next = 0;
    await Promise.all(crew.map(async (cursor) => {
      while (next < fields.length && current(gen)) await typeIn(fields[next++], cursor, gen);
    }));
  }

  async function assembleParts(el, parts, crew, gen) {
    el.classList.add('assembling');
    reveal(el);
    await Promise.all(crew.map(async (cursor, worker) => {
      for (let index = worker; index < parts.length; index += crew.length) {
        if (!current(gen)) return;
        anchor(cursor, parts[index], 0, PACE.partTravel / 1000);
        await sleep(PACE.partTravel);
        if (!current(gen)) return;
        parts[index].classList.add('part-built');
        if (!parts[index].matches('[data-type]') && !parts[index].querySelector('[data-type]')) {
          anchor(cursor, parts[index], 2, PACE.partReveal / 1000);
          await sleep(PACE.partReveal);
        }
      }
    }));
    if (!current(gen)) return;
    el.classList.remove('assembling');
    await typeContents(el, crew, gen);
  }

  async function build(el, crew, gen) {
    if (!current(gen) || el.hidden) return false;
    const passed = reached.has(el) && el.getBoundingClientRect().top < 0;
    if (!inViewport(el) && !passed) return false;
    crew.forEach((cursor, index) => anchor(cursor, el, index, PACE.travel / 1000));
    await sleep(PACE.travel);
    if (!current(gen)) return false;
    const rect = el.getBoundingClientRect();
    const blueprint = doc.createElement('div');
    blueprint.className = 'bp';
    blueprint.setAttribute('aria-hidden', 'true');
    const fixed = Boolean(el.closest('header.site'));
    if (fixed) blueprint.style.position = 'fixed';
    blueprint.style.left = rect.left + (fixed ? 0 : scrollX) + 'px';
    blueprint.style.top = rect.top + (fixed ? 0 : scrollY) + 'px';
    blueprint.style.width = rect.width + 'px';
    blueprint.style.height = rect.height + 'px';
    blueprint.innerHTML = '<s></s><s></s><s></s><s></s><em>' + Math.round(rect.width) + ' × ' + Math.round(rect.height) + '</em>';
    (fixed ? headerOverlay : overlay).appendChild(blueprint);
    blueprints.add(blueprint);
    void blueprint.offsetWidth;
    blueprint.classList.add('drawn');
    crew.forEach((cursor, index) => anchor(cursor, el, index + 2, PACE.outline / 1000));
    await sleep(PACE.outline);
    if (!current(gen)) { removeBlueprint(blueprint); return false; }
    const parts = [...el.querySelectorAll('[data-build-part]')];
    if (el.hasAttribute('data-type')) await typeContents(el, crew, gen);
    else if (parts.length) await assembleParts(el, parts, crew, gen);
    else {
      reveal(el);
      if (el.querySelector('[data-type]')) await typeContents(el, crew, gen);
    }
    if (!current(gen)) { removeBlueprint(blueprint); return false; }
    completed.add(el);
    el.removeAttribute('data-building');
    blueprint.classList.add('out');
    later(() => removeBlueprint(blueprint), 280);
    await sleep(PACE.handoff);
    return current(gen);
  }

  function finish(instantDock = false) {
    const wasDone = done;
    done = true;
    updateSkipControl();
    if (destroyed || motion.matches) { releaseCursors(); hideCursors(); }
    else if (!wasDone) parkCursors(instantDock);
  }

  function teamSize(el) {
    const parts = el.querySelectorAll('[data-build-part]').length;
    if (parts > 1) return Math.min(parts, 3);
    return el.hasAttribute('data-type') ? 1 : Math.min(2, Math.max(1, el.querySelectorAll('[data-type]').length));
  }

  function takeTeam(size) {
    const crew = [];
    for (let checked = 0; checked < cursors.length && crew.length < size; checked++) {
      const cursor = cursors[nextCursor];
      nextCursor = (nextCursor + 1) % cursors.length;
      if (busy.has(cursor)) continue;
      busy.add(cursor);
      cursor.classList.add('working');
      crew.push(cursor);
    }
    return crew;
  }

  function pump(gen = generation) {
    if (starting || completing || !current(gen)) return;
    while (pending.length) {
      const size = teamSize(pending[0]);
      if (cursors.length - busy.size < size) break;
      const el = pending.shift();
      queued.delete(el);
      const crew = takeTeam(size);
      active.add(el);
      build(el, crew, gen).then((built) => {
        if (!current(gen)) return;
        active.delete(el);
        crew.forEach((cursor) => {
          busy.delete(cursor);
          cursor.classList.remove('working');
          cursor.style.opacity = '0';
          setCursorLayer(cursor, false);
        });
        if (!built) {
          el.removeAttribute('data-building');
          el.classList.remove('built', 'assembling');
          if (observer && !el.hidden) observer.observe(el);
        }
        pump(gen);
      }).catch((error) => {
        if (!current(gen)) return;
        console.error('Construction animation could not finish.', error);
        skip();
      });
    }
    if (!active.size && !pending.length) {
      if (allFinished()) finish();
      else hideCursors();
    }
    updateSkipControl();
  }

  function enqueue(el) {
    if (completed.has(el) || queued.has(el) || active.has(el) || !inViewport(el)) return;
    el.setAttribute('data-building', '');
    pending.push(el);
    queued.add(el);
    reached.add(el);
    if (observer) observer.unobserve(el);
  }

  function watchRest(gen) {
    observer = new IntersectionObserver((entries) => {
      if (!current(gen)) return;
      entries.forEach((entry) => { if (entry.isIntersecting) enqueue(entry.target); });
      pump(gen);
    }, { threshold: .12 });
    targets.forEach((el) => { if (!completed.has(el) && !queued.has(el)) observer.observe(el); });
  }

  const onScroll = () => {
    if (scrollFrame !== null || done || completing) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      targets.forEach(enqueue);
      pump();
    });
  };

  function start() {
    const gen = ++generation;
    releaseCursors();
    clearTimers();
    clearCompletion();
    clearBlueprints();
    if (observer) observer.disconnect();
    completed.clear(); queued.clear(); reached.clear(); active.clear(); busy.clear();
    cursors.forEach((cursor) => cursor.classList.remove('working'));
    done = false; starting = true; pending = [];
    skipButton.disabled = false;
    skipStatus.textContent = '';
    updateSkipControl();
    targets.forEach((el) => {
      el.removeAttribute('data-building');
      el.classList.remove('built', 'assembling');
      el.querySelectorAll('.ch.on').forEach((char) => char.classList.remove('on'));
      el.querySelectorAll('.part-built').forEach((part) => part.classList.remove('part-built'));
      enqueue(el);
    });
    watchRest(gen);
    later(() => { if (current(gen)) { starting = false; pump(gen); } }, 180);
  }

  function collectSkipContent(target) {
    const content = [];
    const concealed = !target.classList.contains('built');
    const fields = target.matches('[data-type]') ? [target] : [...target.querySelectorAll('[data-type]')];
    fields.forEach((field) => {
      const hidden = concealed || getComputedStyle(field).visibility === 'hidden';
      if (!hidden && !field.querySelector('.ch:not(.on)')) return;
      const opacity = !hidden && field.querySelector('.ch.on') ? .65 : 0;
      field.querySelectorAll('.typed-text').forEach((text) => content.push({ element: text, opacity }));
    });

    // Fade the copy, not its surface, to keep card backgrounds fully opaque.
    const walker = doc.createTreeWalker(target, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || !node.textContent.trim() || parent.closest('.typed-text, .typed-readable, svg') || parent.closest('[data-b]') !== target) return NodeFilter.FILTER_REJECT;
        return concealed || getComputedStyle(parent).visibility === 'hidden' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const copy = doc.createElement('span');
      node.replaceWith(copy);
      copy.appendChild(node);
      completionCopies.add(copy);
      content.push({ element: copy, opacity: 0 });
    });
    target.querySelectorAll('svg').forEach((icon) => {
      if (concealed || getComputedStyle(icon).visibility === 'hidden') content.push({ element: icon, opacity: 0 });
    });
    return content;
  }

  function completeProgressively(remaining, gen) {
    const jobs = remaining.filter(isRenderable)
      .map((target) => ({ target, visible: inViewport(target), content: collectSkipContent(target) }))
      .sort((a, b) => Number(b.visible) - Number(a.visible));
    remaining.filter((target) => !isRenderable(target)).forEach((target) => {
      reveal(target, true);
      completed.add(target);
    });
    jobs.forEach(({ target, content }, index) => {
      const show = () => {
        if (!current(gen)) return;
        content.forEach(({ element, opacity }) => {
          const animation = element.animate([{ opacity }, { opacity: 1 }], {
            duration: PACE.skipFade,
            easing: 'cubic-bezier(.16,1,.3,1)',
            fill: 'both',
          });
          completionAnimations.add(animation);
          animation.oncancel = () => completionAnimations.delete(animation);
          animation.onfinish = () => { completionAnimations.delete(animation); animation.cancel(); };
        });
        reveal(target, true);
        completed.add(target);
      };
      if (index === 0) show();
      else later(show, Math.min(index * PACE.skipStagger, PACE.skipMaxDelay));
    });
    const lastDelay = Math.min(Math.max(0, jobs.length - 1) * PACE.skipStagger, PACE.skipMaxDelay);
    later(() => {
      if (!current(gen)) return;
      clearCompletion();
      finish(true);
      skipStatus.textContent = 'Building skipped. All content is ready.';
    }, jobs.length ? lastDelay + PACE.skipFade : 0);
  }

  function skip(announce = false) {
    const hadSkipFocus = doc.activeElement === skipButton;
    const wasCompleting = completing;
    const progressive = announce && !wasCompleting && !destroyed && !motion.matches && typeof Element.prototype.animate === 'function';
    const remaining = targets.filter((target) => !completed.has(target));
    skipButton.disabled = true;
    const gen = ++generation;
    if (launchFrame !== null) cancelAnimationFrame(launchFrame);
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    launchFrame = null;
    scrollFrame = null;
    clearTimers();
    clearCompletion();
    completing = progressive;
    updateSkipControl();
    if (observer) observer.disconnect();
    clearBlueprints();
    starting = false; pending = []; queued.clear(); active.clear(); busy.clear();
    cursors.forEach((cursor) => cursor.classList.remove('working'));
    hideCursors();
    if (progressive) {
      skipStatus.textContent = 'Finishing the page.';
      completeProgressively(remaining, gen);
    } else {
      targets.forEach((el) => { reveal(el, true); completed.add(el); });
      finish(true);
      if ((announce || wasCompleting) && !destroyed) skipStatus.textContent = 'Building skipped. All content is ready.';
    }
    if (announce && !destroyed && hadSkipFocus) moveSkipFocus(true);
  }

  const filterObserver = new MutationObserver((records) => {
    if (destroyed || completing) return;
    records.forEach(({ target }) => {
      if (target.hidden) {
        pending = pending.filter((el) => el !== target);
        queued.delete(target);
        if (!active.has(target)) target.removeAttribute('data-building');
        if (observer) observer.unobserve(target);
      } else if (observer && !completed.has(target)) observer.observe(target);
    });
    if (done && !allFinished()) { releaseCursors(); hideCursors(); done = false; }
    pump();
  });
  targets.forEach((el) => filterObserver.observe(el, { attributes: true, attributeFilter: ['hidden'] }));

  const onResize = () => {
    if (motion.matches || completing) return;
    if (done && !allFinished()) { releaseCursors(); hideCursors(); done = false; }
    else if (done && dockTimer !== null) parkCursors();
    onScroll();
  };
  function onKey(event) {
    if (event.key === 'Escape' && !done) skip(!completing);
  }
  const onMotion = () => { if (motion.matches) { skip(); root.classList.remove('swarm'); } };
  addEventListener('resize', onResize, { passive: true });
  addEventListener('scroll', onScroll, { passive: true });
  doc.addEventListener('keydown', onKey);
  motion.addEventListener('change', onMotion);
  const onSkipClick = () => { if (!done && !destroyed && !completing) skip(true); };
  skipButton.addEventListener('click', onSkipClick);
  skipButton.addEventListener('pointerleave', updateSkipControl);
  skipButton.addEventListener('blur', updateSkipControl);

  // Defer setup so React's development cleanup can cancel the animation.
  launchFrame = requestAnimationFrame(() => { launchFrame = null; if (!destroyed) start(); });
  clearTimeout(window.__swarmFallback);
  delete window.__swarmFallback;

  return {
    destroy() {
      destroyed = true;
      skip();
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
      filterObserver.disconnect();
      removeEventListener('resize', onResize);
      removeEventListener('scroll', onScroll);
      doc.removeEventListener('keydown', onKey);
      motion.removeEventListener('change', onMotion);
      skipButton.removeEventListener('click', onSkipClick);
      skipButton.removeEventListener('pointerleave', updateSkipControl);
      skipButton.removeEventListener('blur', updateSkipControl);
      if (focusCleanup) focusCleanup();
      skipButton.remove();
      skipStatus.remove();
      overlay.remove();
      headerOverlay.remove();
    },
  };
}
