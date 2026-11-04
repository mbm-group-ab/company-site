// "Start a project" form (live rough price, request) and the Sana chat. API: the sana repo (sana.mbm-group.se).
(() => {
  const root = document.getElementById('sana');
  const api = (root && root.dataset.api) || 'https://sana.mbm-group.se';
  const form = document.getElementById('start-form');
  const rangeEl = document.getElementById('estimate-range');
  const monthlyEl = document.getElementById('estimate-monthly');
  const errorEl = document.getElementById('start-error');
  const thanksEl = document.getElementById('start-thanks');
  const CHAT_KEY = 'mbm-sana-chat';

  let lang = document.documentElement.lang || 'en';
  let lastEstimate = null;
  let viaChat = false;

  const text = (key) => translate(translations[lang] || translations.en, key) || translate(translations.en, key) || '';
  const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
  const money = (value) => new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : lang === 'sv' ? 'sv-SE' : 'en-GB').format(value);

  async function post(path, body) {
    const response = await fetch(`${api}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const reason = (data.detail && data.detail.reason) || 'generic';
      throw Object.assign(new Error(reason), { reason });
    }
    return data;
  }

  // ---- form ----
  function brief() {
    const data = new FormData(form);
    return {
      types: data.getAll('types'),
      features: data.getAll('features'),
      scope: data.get('scope') || 'medium',
      timeline: data.get('timeline') || 'normal',
      care: data.get('care') === 'on'
    };
  }

  function showEstimate(estimate) {
    lastEstimate = estimate;
    if (!rangeEl) return;
    rangeEl.classList.toggle('empty', !estimate);
    if (!estimate) {
      rangeEl.textContent = text('start.estimateEmpty');
      monthlyEl.hidden = true;
      return;
    }
    const currency = text('start.currency');
    rangeEl.textContent = `${money(estimate.low)}–${money(estimate.high)} ${currency}`;
    monthlyEl.hidden = !estimate.monthly_high;
    monthlyEl.textContent = fill(text('start.monthly'), {
      low: money(estimate.monthly_low), high: `${money(estimate.monthly_high)} ${currency}`
    });
  }

  let estimateTimer = null;
  function refreshEstimate() {
    clearTimeout(estimateTimer);
    estimateTimer = setTimeout(async () => {
      const current = brief();
      if (!current.types.length) return showEstimate(null);
      try {
        showEstimate((await post('/v1/estimate', current)).estimate);
      } catch (error) {
        // Keep the last range; the request itself still works without it.
      }
    }, 250);
  }

  function showError(reason) {
    errorEl.hidden = false;
    errorEl.textContent = text(`start.errors.${reason}`) || text('start.errors.generic');
  }

  if (form) {
    form.addEventListener('change', refreshEstimate);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorEl.hidden = true;
      const data = new FormData(form);
      const current = brief();
      if (!current.types.length) return showError('no_type');
      if (!form.elements.email.checkValidity() || !data.get('email')) return showError('bad_email');
      if (!data.get('name')) return showError('generic');
      if (data.get('consent') !== 'on') return showError('no_consent');

      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = text('start.sending');
      try {
        const result = await post('/v1/leads', {
          ...current,
          lang,
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company') || '',
          phone: data.get('phone') || '',
          description: data.get('description') || '',
          consent: true,
          via_chat: viaChat,
          website: data.get('website') || ''
        });
        if (result.estimate) showEstimate(result.estimate);
        form.hidden = true;
        thanksEl.hidden = false;
        document.getElementById('start-thanks-text').textContent = fill(text('start.thanksText'), { ref: result.ref });
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { method: viaChat ? 'sana' : 'form' });
      } catch (error) {
        showError(error.reason || 'generic');
      } finally {
        button.disabled = false;
        button.textContent = text('start.submit');
      }
    });
  }

  function fillForm(fromChat) {
    if (!form) return;
    const set = (name, values) => form.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
      input.checked = values.includes(input.value);
    });
    set('types', fromChat.types || []);
    set('features', fromChat.features || []);
    set('scope', [fromChat.scope || 'medium']);
    set('timeline', [fromChat.timeline || 'normal']);
    form.elements.care.checked = Boolean(fromChat.care);
    if (fromChat.description && !form.elements.description.value) form.elements.description.value = fromChat.description;
    viaChat = true;
    refreshEstimate();
    document.getElementById('start').scrollIntoView({ behavior: 'smooth' });
    form.elements.name.focus({ preventScroll: true });
  }

  // ---- Sana chat ----
  const openButton = document.getElementById('sana-open');
  const panel = document.getElementById('sana-panel');
  const log = document.getElementById('sana-log');
  const chatForm = document.getElementById('sana-form');
  const input = document.getElementById('sana-text');
  let messages = [];
  let lastBrief = null;
  let waiting = false;

  try {
    messages = JSON.parse(sessionStorage.getItem(CHAT_KEY) || '[]').slice(-30);
  } catch (error) {
    messages = [];
  }

  function saveChat() {
    try {
      sessionStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-30)));
    } catch (error) {
      // The chat still works, it just does not survive a reload.
    }
  }

  function bubble(role, content, extraClass = '') {
    const el = document.createElement('div');
    el.className = `sana-msg sana-${role} ${extraClass}`.trim();
    el.textContent = content; // never HTML: replies come from an AI
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function briefButton() {
    log.querySelectorAll('.sana-use').forEach((el) => el.remove());
    if (!lastBrief) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-secondary sana-use';
    button.textContent = text('sana.useBrief');
    button.addEventListener('click', () => fillForm(lastBrief));
    log.appendChild(button);
    log.scrollTop = log.scrollHeight;
  }

  function renderLog() {
    log.textContent = '';
    messages.forEach((m) => bubble(m.role, m.text));
    briefButton();
  }

  async function ask() {
    if (waiting) return;
    waiting = true;
    const typing = bubble('sana', text('sana.typing'), 'sana-typing');
    try {
      const answer = await post('/v1/chat', { lang, messages });
      typing.remove();
      messages.push({ role: 'sana', text: answer.reply });
      saveChat();
      bubble('sana', answer.reply);
      lastBrief = answer.ready ? answer.brief : lastBrief;
      briefButton();
    } catch (error) {
      typing.remove();
      bubble('sana', text(error.reason === 'rate_limited' ? 'sana.busy' : 'sana.error'), 'sana-error');
    } finally {
      waiting = false;
    }
  }

  function setOpen(open) {
    panel.hidden = !open;
    openButton.setAttribute('aria-expanded', String(open));
    root.classList.toggle('open', open);
    if (open) {
      renderLog();
      if (!messages.length) ask();
      input.focus();
    }
  }

  if (openButton && panel) {
    openButton.addEventListener('click', () => setOpen(panel.hidden));
    document.getElementById('sana-close').addEventListener('click', () => setOpen(false));

    chatForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const content = input.value.trim();
      if (!content || waiting) return;
      input.value = '';
      messages.push({ role: 'visitor', text: content.slice(0, 2000) });
      saveChat();
      bubble('visitor', content);
      ask();
    });

    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
      }
    });
  }

  document.addEventListener('mbm:language', (event) => {
    lang = event.detail.lang;
    showEstimate(lastEstimate);
    if (thanksEl && !thanksEl.hidden) return;
    if (panel && !panel.hidden) briefButton();
  });
})();
