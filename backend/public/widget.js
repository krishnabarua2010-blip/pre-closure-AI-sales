(function() {
  'use strict';

  // --- CONFIG ---
  var cfg = window.PreCloserConfig || {};
  var SLUG = cfg.slug || '';
  var API  = cfg.apiUrl || '';

  if (!SLUG || !API) {
    console.warn('[PreCloser] Missing slug or apiUrl in window.PreCloserConfig');
    return;
  }

  var STORE_KEY = 'precloser_' + SLUG;
  var isOpen = false;
  var session = null; // { conversationId, publicToken, assistantName }
  var messages = [];  // { role: 'user'|'ai', text }

  // --- RESTORE SESSION ---
  try {
    var saved = localStorage.getItem(STORE_KEY);
    if (saved) session = JSON.parse(saved);
  } catch(e) {}

  // --- STYLES ---
  var style = document.createElement('style');
  style.textContent = [
    '#pc-bubble{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#6366F1;box-shadow:0 4px 20px rgba(99,102,241,.45);cursor:pointer;z-index:999998;display:flex;align-items:center;justify-content:center;transition:transform .2s,box-shadow .2s;border:none;outline:none;}',
    '#pc-bubble:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(99,102,241,.6);}',
    '#pc-bubble svg{width:28px;height:28px;fill:white;}',
    '#pc-modal{position:fixed;bottom:96px;right:24px;width:370px;height:540px;background:#0f1117;border:1px solid #1f2937;border-radius:16px;z-index:999999;display:none;flex-direction:column;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.5);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
    '#pc-modal.open{display:flex;}',
    '#pc-header{padding:16px 20px;background:#111827;border-bottom:1px solid #1f2937;display:flex;align-items:center;justify-content:space-between;}',
    '#pc-header h3{margin:0;color:#fff;font-size:14px;font-weight:600;}',
    '#pc-header span{font-size:11px;color:#6b7280;margin-top:2px;display:block;}',
    '#pc-close{background:none;border:none;color:#6b7280;cursor:pointer;font-size:18px;padding:0 4px;line-height:1;}',
    '#pc-close:hover{color:#fff;}',
    '#pc-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}',
    '#pc-messages::-webkit-scrollbar{width:4px;}',
    '#pc-messages::-webkit-scrollbar-thumb{background:#374151;border-radius:4px;}',
    '.pc-msg{max-width:82%;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.5;word-wrap:break-word;}',
    '.pc-msg.ai{background:#1e1e2e;color:#e5e7eb;align-self:flex-start;border-bottom-left-radius:4px;}',
    '.pc-msg.user{background:#6366F1;color:#fff;align-self:flex-end;border-bottom-right-radius:4px;}',
    '.pc-msg.system{background:transparent;color:#6b7280;align-self:center;font-size:11px;text-align:center;}',
    '#pc-input-wrap{padding:12px 16px;background:#111827;border-top:1px solid #1f2937;display:flex;gap:8px;align-items:center;}',
    '#pc-input{flex:1;background:#1a1a2e;border:1px solid #2d2d44;border-radius:10px;padding:10px 14px;color:#fff;font-size:13px;outline:none;resize:none;font-family:inherit;line-height:1.4;}',
    '#pc-input::placeholder{color:#4b5563;}',
    '#pc-input:focus{border-color:#6366F1;}',
    '#pc-send{width:36px;height:36px;border-radius:10px;background:#6366F1;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;flex-shrink:0;}',
    '#pc-send:hover{background:#5558e3;}',
    '#pc-send:disabled{opacity:.4;cursor:default;}',
    '#pc-send svg{width:16px;height:16px;fill:white;}',
    '.pc-typing{display:flex;gap:4px;align-items:center;padding:10px 14px;align-self:flex-start;}',
    '.pc-typing span{width:6px;height:6px;background:#6366F1;border-radius:50%;animation:pcBounce .6s infinite alternate;}',
    '.pc-typing span:nth-child(2){animation-delay:.15s;}',
    '.pc-typing span:nth-child(3){animation-delay:.3s;}',
    '@keyframes pcBounce{to{opacity:.3;transform:translateY(-4px);}}'
  ].join('\n');
  document.head.appendChild(style);

  // --- BUBBLE ---
  var bubble = document.createElement('button');
  bubble.id = 'pc-bubble';
  bubble.setAttribute('aria-label', 'Open chat');
  bubble.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4A2 2 0 002 4v12a2 2 0 002 2h4l4 4 4-4h4a2 2 0 002-2V4a2 2 0 00-2-2zM6 9h12v2H6V9zm8 4H6v-2h8v2zm4-6H6V5h12v2z"/></svg>';
  document.body.appendChild(bubble);

  // --- MODAL ---
  var modal = document.createElement('div');
  modal.id = 'pc-modal';
  modal.innerHTML = [
    '<div id="pc-header">',
      '<div><h3 id="pc-title">AI Assistant</h3><span>Powered by Pre Closer AI</span></div>',
      '<button id="pc-close">&times;</button>',
    '</div>',
    '<div id="pc-messages"></div>',
    '<div id="pc-input-wrap">',
      '<input id="pc-input" type="text" placeholder="Type your message..." autocomplete="off" />',
      '<button id="pc-send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>',
    '</div>'
  ].join('');
  document.body.appendChild(modal);

  var messagesEl = document.getElementById('pc-messages');
  var inputEl    = document.getElementById('pc-input');
  var sendBtn    = document.getElementById('pc-send');
  var titleEl    = document.getElementById('pc-title');

  // --- HELPERS ---
  function addMsg(role, text) {
    messages.push({ role: role, text: text });
    var div = document.createElement('div');
    div.className = 'pc-msg ' + role;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    var div = document.createElement('div');
    div.className = 'pc-typing';
    div.id = 'pc-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('pc-typing');
    if (t) t.remove();
  }

  function saveSession() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(session)); } catch(e) {}
  }

  // --- INIT SESSION ---
  async function initSession() {
    if (session) {
      if (session.assistantName) titleEl.textContent = session.assistantName;
      return;
    }
    try {
      var res = await fetch(API + '/widget/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: SLUG })
      });
      if (!res.ok) throw new Error('Init failed');
      var data = await res.json();
      session = {
        conversationId: data.conversationId,
        publicToken: data.publicToken,
        assistantName: data.assistantName
      };
      if (session.assistantName) titleEl.textContent = session.assistantName;
      saveSession();
      addMsg('ai', "Hi! I'm here to help. What are you looking for today?");
    } catch(e) {
      addMsg('system', 'Unable to connect. Please try again later.');
    }
  }

  // --- SEND MESSAGE ---
  async function sendMessage() {
    var text = inputEl.value.trim();
    if (!text || !session) return;

    inputEl.value = '';
    sendBtn.disabled = true;
    addMsg('user', text);
    showTyping();

    try {
      var res = await fetch(API + '/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: session.conversationId,
          publicToken: session.publicToken,
          message: text
        })
      });

      hideTyping();

      if (!res.ok) {
        var err = await res.json().catch(function() { return {}; });
        addMsg('system', err.error || 'Something went wrong.');
        sendBtn.disabled = false;
        return;
      }

      var data = await res.json();
      addMsg('ai', data.reply);
    } catch(e) {
      hideTyping();
      addMsg('system', 'Network error. Please try again.');
    }
    sendBtn.disabled = false;
    inputEl.focus();
  }

  // --- EVENTS ---
  bubble.addEventListener('click', function() {
    isOpen = !isOpen;
    if (isOpen) {
      modal.classList.add('open');
      initSession();
      inputEl.focus();
    } else {
      modal.classList.remove('open');
    }
  });

  document.getElementById('pc-close').addEventListener('click', function() {
    isOpen = false;
    modal.classList.remove('open');
  });

  sendBtn.addEventListener('click', sendMessage);

  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

})();
