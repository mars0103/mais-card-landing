import { gsap } from 'gsap';

const ico = (n) => `<svg class="i"><use href="#i-${n}"/></svg>`;
const status = (t, b) => `<div class="a-status"><span>${t}</span><span class="a-sys"><span class="a-sig"><i></i><i></i><i></i><i></i></span><em>4G</em><span class="a-bat">${b}</span></span></div>`;
const NAV = [['home', 'Início'], ['card', 'MAIS Card'], ['search', 'Buscar'], ['send', 'Indicar'], ['user', 'Perfil']];
const nav = (active) =>
  `<nav class="a-nav">${NAV.map(([i, l]) => `<span class="${l === active ? 'is-on' : ''}">${ico(i)}${l}<b></b></span>`).join('')}</nav>`;
const titleBar = (t, right = ['refresh', 'help']) =>
  `<div class="a-title">${ico('arrow-left')}<h4>${t}</h4>${right.map((r) => `<span class="a-ring">${ico(r)}</span>`).join('')}</div>`;

const SCREENS = {
  identidade: `
    ${'' }
    <div class="a-head--y">${status('14:31', '61')}
      <div class="a-bar">${ico('arrow-left')}<img class="a-logo" src="/brand/logo-apoio-pb.svg" alt="" /><span class="a-sp"></span>${ico('headset')}${ico('bell')}<span class="a-avatar">${ico('user')}</span></div>
    </div>
    <div class="a-idt">
      <div class="a-stepper"><b></b><s></s><b></b><s></s><b class="big"></b><s class="g"></s><b class="g"></b></div>
      <div class="a-seal"><span>${ico('check')}</span></div>
      <h4>Identidade confirmada!</h4>
      <p class="b">Parabéns, Carmen!</p>
      <p class="sub">Recebemos seu documento e sua selfie.<br />Sua identidade foi confirmada com sucesso.</p>
    </div>
    <div class="a-card a-card--cream" style="margin:14px 20px 0;padding:14px 15px 12px">
      <div class="a-limit"><span class="a-round">${ico('shield')}</span><p>Seu limite pré-aprovado continua reservado para você:</p></div>
      <strong class="a-amount">R$ 1.500,00</strong>
      <ul class="a-check">
        <li><span class="ok">${ico('check')}</span>Documento aprovado</li>
        <li><span class="ok">${ico('check')}</span>Selfie validada</li>
        <li><span class="ok">${ico('check')}</span>Identidade confirmada</li>
      </ul>
    </div>
    <div class="a-card a-next" style="margin:12px 20px 0"><span class="a-round a-round--y">${ico('pin')}</span><div><b>Próximo passo</b><p>Agora vamos apenas confirmar o endereço onde seu cartão será entregue.</p></div>${ico('chev')}</div>
    <button class="a-btn" type="button" tabindex="-1">${ico('pin')}Confirmar endereço</button>
    ${nav('')}`,

  parcelado: `
    ${status('14:56', '55')}${titleBar('MAIS Parcelado', ['refresh'])}
    <div class="a-pad">
      <div class="a-yc">
        <div class="top"><div class="row"><span>Valor disponível para MAIS Parcelado ${ico('help')}</span>${ico('eye')}</div><strong>R$ 400,00</strong><small>de R$ 400,00</small></div>
        <div class="band"><span>Valor mínimo por solicitação: R$ 25,00</span><b>Ver histórico</b></div>
      </div>
      <h5 class="a-h">1. Informe o valor do MAIS Parcelado</h5>
      <div class="a-input"><div><span>R$</span><strong class="js-val">0,00</strong></div><em>Usar máximo</em></div>
      <p class="a-hint">Mín. R$ 25,00 · Máx. R$ 300,00</p>
      <h5 class="a-h" style="margin-top:14px">2. Escolha o número de parcelas</h5>
      <p class="a-hint" style="margin:-4px 0 8px">Juros de 5,99% a.m. · Parcela mínima: R$ 25,00</p>
      <div class="a-chips js-chips"><b data-n="3">3x</b><b data-n="6">6x</b><b data-n="9">9x</b><b data-n="12">12x</b></div>
      <p class="a-hint js-cap" style="text-align:center;margin-top:8px">Informe o valor acima para ver as parcelas.</p>
      <div class="a-row">${ico('calc')}<span>Ver outras opções de parcelamento</span>${ico('chev')}</div>
      <h5 class="a-h" style="margin-top:14px">3. Recebimento na Carteira+</h5>
      <div class="a-auto">${ico('wallet')}<div><b>Crédito automático</b><p>Ao confirmar, o valor será creditado automaticamente no saldo disponível da sua Carteira+.</p></div></div>
      <div class="a-warn">${ico('alert')}<span>As parcelas serão lançadas na fatura do seu cartão na data de vencimento.</span></div>
    </div>
    ${nav('')}`,

  carteira: `
    <div class="a-wallet-top">${status('14:57', '55')}
      <div class="t">${ico('arrow-left')}<h4>Carteira+</h4></div>
      <p>Seu dinheiro e cada movimentação, em um só lugar.</p>
    </div>
    <div class="a-balance">
      <div class="c1"><span class="lbl">Meus saldos ${ico('eye')}${ico('refresh')}</span><small>Saldo disponível</small><strong>R$ 10,00</strong></div>
      <div class="c2"><span class="lbl">Em processamento ${ico('info')}</span><strong>R$ 0,00</strong></div>
      <div class="c3"><span class="lbl">Saldo reservado ${ico('lock')}</span><strong>R$ 25,00</strong></div>
    </div>
    <div class="a-sacar">${ico('cash')}Sacar</div>
    <div class="a-ext">
      <h5 class="a-h" style="font-size:14px;margin:22px 0 10px">Extrato</h5>
      <div class="a-fil"><b class="on1">Tudo</b><b>Entradas</b><b>Saídas</b></div>
      <div class="a-fil"><b class="on2">Todos</b><b>Pix</b><b>Saque</b><b>Pagamentos</b><b>Cofre+</b><b>Cashback</b></div>
      <ul class="a-list">
        <li><span class="ic">${ico('gift')}</span><span class="tx"><b>Indicação concluída</b><small>21 de set.</small></span><span class="v p">+ R$ 10,00</span></li>
        <li><span class="ic">${ico('wallet')}</span><span class="tx"><b>Saldo reservado</b><small>21 de set.</small></span><span class="v n">- R$ 25,00</span></li>
        <li><span class="ic">${ico('wallet')}</span><span class="tx"><b>Ajuste administrativo</b><small>21 de set.</small></span><span class="v p">+ R$ 25,00</span></li>
      </ul>
    </div>
    <div class="a-toast">${ico('gift')}+ R$ 10,00 · Indicação concluída</div>
    ${nav('')}`,

  coins: `
    ${status('14:57', '55')}${titleBar('+Coins')}
    <div class="a-pad">
      <div class="a-bal"><div class="t"><small>Seu saldo</small><div class="n"><strong class="js-coins">61.800</strong>${ico('coins')}</div><b>+Coins</b></div><div class="f"><span>1.000 +Coins até R$ 1,00 de cashback</span>${ico('info')}</div></div>
      <div class="a-acts"><div><span>${ico('medal')}</span>Ganhar<br />+Coins</div><div><span>${ico('trophy')}</span>Missões</div><div><span>${ico('refresh')}</span>Trocar<br />+Coins</div></div>
      <div class="a-goal"><div class="r"><div><small>Próxima conquista</small><b>Completar 10 indicações</b></div><em>+5.000<br /><span style="font:400 9px 'Plus Jakarta Sans';color:#666">+Coins</span></em></div><div class="frac">1/10</div><div class="a-bar-t"><i class="js-bar"></i></div></div>
      <div class="a-ind"><div class="r"><div><h5>Indique e ganhe muito mais!</h5><p>Cada indicação concluída</p><span class="g">+1.000 <span style="color:#141414;font-weight:600">+Coins</span></span></div>${ico('chev')}</div><hr /><div class="d"><span>Desafio 10 indicações</span><span>1/10</span></div><div class="a-bar-t"><i class="js-bar" style="width:10%"></i></div><div class="l"><span>Faltam <b style="color:#E8A200">9</b> indicações para ganhar <b style="color:#E8A200">+5.000</b> +Coins extras!</span>${ico('trophy')}</div></div>
      <div class="a-mv"><span>Últimas movimentações</span><em>Ver todas ›</em></div>
    </div>
    ${nav('')}`,

  indique: `
    ${status('15:11', '55')}
    <div class="a-ind-h"><h4>Indique e ganhe</h4><p>Convide amigos e ganhe Cashback e +Coins</p></div>
    <div class="a-green"><b>Seu código de indicação</b><div class="code"><strong class="js-code">095-836</strong>${ico('copy')}</div><small>Toque no código para copiar</small><div class="share">${ico('share')}Compartilhar convite</div></div>
    <div class="a-how">
      <h5>Como funciona</h5>
      <ul>
        <li><i>1</i><span>Compartilhe seu código com quem você quer convidar.</span></li>
        <li><i>2</i><span>Quando ele concluir o cadastro usando seu código, sua recompensa de <b class="g">R$ 10,00</b> + <b class="o">1.000</b> +Coins ficará em processamento.</span></li>
        <li><i>3</i><span>Para liberar a recompensa, ele precisa solicitar e emitir o MAIS Card.</span></li>
        <li><i>4</i><span>Você recebe <b class="g">R$ 10,00</b> na Carteira+ mais <b class="o">1.000</b> +Coins.</span></li>
      </ul>
    </div>
    <div class="a-tot"><div><small>Total ganho com indicações</small><strong>R$ 10,00</strong></div><span class="rn">${ico('wallet')}</span></div>
    <div class="a-toast a-toast--green">${ico('check')}Código copiado</div>
    ${nav('Indicar')}`,
};

const fmt = (n) => n.toLocaleString('pt-BR');
const money = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const screens = {
  root: null,
  current: null,
  parcelado: { value: 300, n: 6 },

  mount(viewport) {
    this.root = viewport;
    viewport.innerHTML = Object.entries(SCREENS)
      .map(([k, html]) => `<section class="screen" data-screen="${k}">${html}</section>`)
      .join('');
  },

  el(name) { return this.root.querySelector(`[data-screen="${name}"]`); },

  show(name) {
    if (!this.root || this.current === name) return;
    this.root.querySelectorAll('.screen').forEach((s) => s.classList.toggle('is-on', s.dataset.screen === name));
    this.current = name;
    this.play(name);
  },

  play(name) {
    const el = this.el(name);
    if (!el) return;
    const $ = (s) => el.querySelectorAll(s);
    const tl = gsap.timeline({ delay: 0.25 });
    if (name === 'identidade') {
      gsap.set($('.a-check li'), { opacity: 0, x: -14 });
      gsap.set($('.a-check .ok'), { scale: 0 });
      gsap.set($('.a-seal'), { scale: 0.6, opacity: 0 });
      tl.to($('.a-seal'), { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)' })
        .to($('.a-check li'), { opacity: 1, x: 0, duration: 0.4, stagger: 0.16 }, 0.5)
        .to($('.a-check .ok'), { scale: 1, duration: 0.45, ease: 'back.out(2.4)', stagger: 0.16 }, 0.55);
    }
    if (name === 'parcelado') {
      this.setParcelado(this.parcelado.value, this.parcelado.n, true);
    }
    if (name === 'carteira') {
      gsap.set($('.a-list li'), { opacity: 0, y: 18 });
      gsap.set($('.a-toast'), { opacity: 0, y: -16 });
      tl.to($('.a-list li'), { opacity: 1, y: 0, duration: 0.5, stagger: 0.14, ease: 'power3.out' })
        .to($('.a-toast'), { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }, 0.5)
        .to($('.a-toast'), { opacity: 0, y: -10, duration: 0.4 }, 2.8);
    }
    if (name === 'coins') {
      const num = el.querySelector('.js-coins');
      const o = { v: 0 };
      tl.to(o, { v: 61800, duration: 1.6, ease: 'power3.out', onUpdate: () => (num.textContent = fmt(Math.round(o.v))) }, 0);
      gsap.set($('.js-bar'), { scaleX: 0 });
      tl.to($('.js-bar'), { scaleX: 1, duration: 0.9, ease: 'power3.out', stagger: 0.15 }, 0.4);
      gsap.set($('.a-acts > div'), { opacity: 0, y: 10 });
      tl.to($('.a-acts > div'), { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, 0.3);
    }
    if (name === 'indique') {
      const code = el.querySelector('.js-code');
      const full = '095-836';
      const o = { i: 0 };
      code.textContent = '';
      gsap.set($('.a-how li'), { opacity: 0.25 });
      gsap.set($('.a-toast'), { opacity: 0, y: -10 });
      tl.to(o, { i: full.length, duration: 0.9, ease: 'none', onUpdate: () => (code.textContent = full.slice(0, Math.round(o.i))) }, 0)
        .to($('.a-how li'), { opacity: 1, duration: 0.4, stagger: 0.22 }, 0.5);
    }
    this.tl = tl;
  },

  setParcelado(value, n, animate = false) {
    this.parcelado = { value, n };
    const el = this.el('parcelado');
    if (!el) return;
    const val = el.querySelector('.js-val');
    const chips = el.querySelectorAll('.js-chips b');
    const cap = el.querySelector('.js-cap');
    chips.forEach((b) => b.classList.toggle('is-on', Number(b.dataset.n) === n));
    cap.textContent = `R$ ${money(value)} em ${n}x`;
    if (animate) {
      const o = { v: 0 };
      chips.forEach((b) => b.classList.remove('is-on'));
      gsap.to(o, { v: value, duration: 1.1, delay: 0.35, ease: 'power3.out', onUpdate: () => (val.textContent = money(o.v)), onComplete: () => chips.forEach((b) => b.classList.toggle('is-on', Number(b.dataset.n) === n)) });
    } else {
      val.textContent = money(value);
    }
  },

  flashCopied() {
    const t = this.el('indique')?.querySelector('.a-toast');
    if (!t) return;
    gsap.fromTo(t, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' });
    gsap.to(t, { opacity: 0, y: -10, duration: 0.4, delay: 1.8 });
  },
};
