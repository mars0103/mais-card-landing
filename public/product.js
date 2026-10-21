(function () {
  var toggle = document.getElementById('menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('[data-mega]').forEach(function (mega) {
    var btn = mega.querySelector('.hud-mega__btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      mega.classList.toggle('is-open');
    });
    document.addEventListener('click', function (e) {
      if (!mega.contains(e.target)) mega.classList.remove('is-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') mega.classList.remove('is-open');
    });
  });

  var money = function (n) { return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var fmt = function (n) { return Number(n).toLocaleString('pt-BR'); };

  function pickChip(list, picked, onPick) {
    list.forEach(function (b) {
      b.addEventListener('click', function () {
        list.forEach(function (x) { x.classList.toggle('is-on', x === b); });
        onPick(b);
      });
    });
  }

  function toast(el, ms) {
    if (!el) return;
    el.classList.add('is-on');
    if (ms) setTimeout(function () { el.classList.remove('is-on'); }, ms);
  }

  var tcChips = document.querySelectorAll('.js-tc-chips b');
  if (tcChips.length) {
    var tcVal = document.querySelector('.js-tc-val'), tcOut = document.querySelector('.js-tc-out');
    pickChip([].slice.call(tcChips), null, function (b) {
      var n = Number(b.dataset.n);
      tcVal.textContent = fmt(n);
      tcOut.textContent = 'R$ ' + money(n / 2500);
    });
  }

  var sqChips = document.querySelectorAll('.js-sq-chips b');
  if (sqChips.length) {
    var sqVal = document.querySelector('.js-sq-val');
    pickChip([].slice.call(sqChips), null, function (b) { sqVal.textContent = money(Number(b.dataset.n)); });
  }
  var sqBtn = document.querySelector('.js-sq-btn'), sqToast = document.querySelector('.js-sq-toast');
  if (sqBtn) sqBtn.addEventListener('click', function () { toast(sqToast, 2600); });

  var trButtons = document.querySelectorAll('.js-tr-contacts button');
  if (trButtons.length) {
    var trTo = document.querySelector('.js-tr-to');
    pickChip([].slice.call(trButtons), null, function (b) { trTo.textContent = b.dataset.name; });
  }
  var trBtn = document.querySelector('.js-tr-btn'), trToast = document.querySelector('.js-tr-toast');
  if (trBtn) trBtn.addEventListener('click', function () { toast(trToast, 2200); });

  var asChips = document.querySelectorAll('.js-as-chips b');
  if (asChips.length) {
    var asVal = document.querySelector('.js-as-val'), asAmt = document.querySelector('.js-as-amt');
    pickChip([].slice.call(asChips), null, function (b) {
      asVal.textContent = money(Number(b.dataset.n));
      if (asAmt) asAmt.textContent = 'R$ ' + money(Number(b.dataset.n));
    });
  }
  var asStatus = document.querySelector('.js-as-status'), asToast = document.querySelector('.js-as-toast');
  if (asStatus) {
    setTimeout(function () {
      asStatus.textContent = 'Pago! Saldo adicionado.';
      toast(asToast);
    }, 1800);
  }

  var lp = document.querySelector('.js-lp-copy');
  if (lp) {
    lp.addEventListener('click', function () {
      var span = lp.querySelector('span'), prev = span.textContent;
      var link = document.querySelector('.js-lp-link');
      var text = link ? 'https://' + link.textContent : 'https://mais.cc/cobrar/8f2k';
      (navigator.clipboard && navigator.clipboard.writeText(text).catch(function () {}));
      span.textContent = 'Copiado!';
      setTimeout(function () { span.textContent = prev; }, 1800);
    });
  }

  var cfBar = document.querySelector('.js-cf-bar'), cfTotal = document.querySelector('.js-cf-total');
  if (cfBar) {
    var target = Number(cfBar.dataset.target || 60);
    setTimeout(function () { cfBar.style.width = target + '%'; }, 300);
  }
  if (cfTotal) {
    var to = Number(cfTotal.dataset.to || 0), start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / 1200);
      cfTotal.textContent = 'R$ ' + fmt(Math.round(to * p));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  var rcOp = document.querySelectorAll('.js-rc-op b');
  if (rcOp.length) pickChip([].slice.call(rcOp), null, function () {});
  var rcVal = document.querySelectorAll('.js-rc-val b');
  if (rcVal.length) {
    var rcAmt = document.querySelector('.js-rc-amt');
    pickChip([].slice.call(rcVal), null, function (b) { if (rcAmt) rcAmt.textContent = 'R$ ' + b.dataset.n; });
  }
  var rcBtn = document.querySelector('.js-rc-btn'), rcToast = document.querySelector('.js-rc-toast');
  if (rcBtn) rcBtn.addEventListener('click', function () { toast(rcToast, 2600); });

  var copyBtn = document.querySelector('.js-copy-code');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var span = copyBtn.querySelector('span'), prev = span.textContent;
      (navigator.clipboard && navigator.clipboard.writeText(copyBtn.dataset.code || '').catch(function () {}));
      span.textContent = 'Copiado!';
      setTimeout(function () { span.textContent = prev; }, 1800);
    });
  }
})();
