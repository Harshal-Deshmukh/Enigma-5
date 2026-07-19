// Enigma 5.0 — interactivity. Organized by feature block, top to bottom.

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE = window.matchMedia('(hover: none)').matches;

/* ---------- LOADER ---------- */
(function(){
  const lines = [
    "&gt; Booting ENIGMA Protocol...",
    "&gt; Establishing Secure Connection...",
    "&gt; Decrypting Quantum Encryption...",
    "&gt; Authenticating User...",
    "&gt; Access Granted."
  ];
  const container = document.getElementById('loader-lines');
  const bar = document.getElementById('loader-bar-fill');
  const loader = document.getElementById('loader');

  if(REDUCED){
    loader.classList.add('hidden');
    return;
  }

  let i = 0;
  function addLine(){
    if(i >= lines.length){
      bar.style.width = '100%';
      setTimeout(()=>{
        loader.classList.add('glitch');
        setTimeout(()=> loader.classList.add('hidden'), 420);
      }, 300);
      return;
    }
    const div = document.createElement('div');
    div.className = 'loader-line';
    div.innerHTML = lines[i] + '<span class="caret">▍</span>';
    container.insertBefore(div, bar.closest('.loader-bar'));
    requestAnimationFrame(()=> div.classList.add('show','typing'));
    bar.style.width = ((i+1)/lines.length*100) + '%';
    i++;
    setTimeout(addLine, 420);
  }
  setTimeout(addLine, 300);
})();

/* ---------- SCROLL PROGRESS + HEADER STATE + BACK TO TOP ---------- */
(function(){
  const bar = document.getElementById('scroll-progress');
  const header = document.getElementById('site-header');
  const toTop = document.getElementById('back-to-top');
  function onScroll(){
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = pct + '%';
    header.classList.toggle('scrolled', h.scrollTop > 20);
    toTop.classList.toggle('show', h.scrollTop > 600);
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  toTop.addEventListener('click', e=>{ e.preventDefault(); window.scrollTo({top:0, behavior: REDUCED ? 'auto' : 'smooth'}); });
})();

/* ---------- CURSOR GLOW + MAGNETIC BUTTONS ---------- */
(function(){
  if(COARSE || REDUCED) return;
  const glow = document.getElementById('cursor-glow');
  const dot = document.getElementById('cursor-dot');
  const aurora = document.getElementById('aurora');
  let mx=innerWidth/2, my=innerHeight/2, gx=mx, gy=my;

  window.addEventListener('mousemove', e=>{
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    aurora.style.setProperty('--mx', (mx/innerWidth*100) + '%');
    aurora.style.setProperty('--my', (my/innerHeight*100) + '%');
  });
  function raf(){
    gx += (mx-gx)*0.12; gy += (my-gy)*0.12;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  document.querySelectorAll('a,button,.track-card').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{ dot.style.width='18px'; dot.style.height='18px'; dot.style.background='transparent'; dot.style.boxShadow='0 0 0 2px #00F5FF'; });
    el.addEventListener('mouseleave', ()=>{ dot.style.width='8px'; dot.style.height='8px'; dot.style.background='#00F5FF'; dot.style.boxShadow='0 0 12px #00F5FF'; });
  });

  document.querySelectorAll('.magnetic').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*0.25}px, ${y*0.3}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform = 'translate(0,0)'; });
  });
})();

/* ---------- TILT CARDS ---------- */
(function(){
  if(COARSE || REDUCED) return;
  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--gx', (px*100)+'%');
      card.style.setProperty('--gy', (py*100)+'%');
      const rx = (py-0.5) * -8;
      const ry = (px-0.5) * 8;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)'; });
  });
})();

/* ---------- BACKGROUND CANVAS: particles + network lines + binary rain + shooting stars ---------- */
(function(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w,h,particles,drops;
  const GLYPHS = "01アイウエオカキクケコΣΦΔΩ";
  const PCOUNT = REDUCED ? 0 : (innerWidth < 700 ? 40 : 80);

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    particles = new Array(PCOUNT).fill(0).map(()=>({
      x:Math.random()*w, y:Math.random()*h,
      vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.25,
      r:Math.random()*1.6+0.4
    }));
    const cols = Math.floor(w/26);
    drops = new Array(cols).fill(0).map(()=> Math.random()*-100);
  }
  window.addEventListener('resize', resize);
  resize();

  if(REDUCED){ return; }

  let shootingStar = null;
  function maybeSpawnStar(){
    if(!shootingStar && Math.random() < 0.004){
      shootingStar = { x: Math.random()*w*0.6, y: -20, vx: 6, vy: 3.2, life: 0 };
    }
  }

  function draw(){
    ctx.clearRect(0,0,w,h);

    // binary rain, very faint
    ctx.font = '13px JetBrains Mono, monospace';
    for(let i=0;i<drops.length;i++){
      ctx.fillStyle = 'rgba(0,245,255,0.06)';
      ctx.fillText(GLYPHS[Math.floor(Math.random()*GLYPHS.length)], i*26, drops[i]*18);
      if(drops[i]*18 > h && Math.random() > 0.98){ drops[i] = 0; }
      drops[i] += 0.6;
    }

    // particles + connecting network lines
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(0,245,255,0.35)';
      ctx.fill();
      for(let j=i+1;j<particles.length;j++){
        const q = particles[j];
        const d = Math.hypot(p.x-q.x, p.y-q.y);
        if(d < 130){
          ctx.strokeStyle = `rgba(124,58,237,${0.12*(1-d/130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
        }
      }
    }

    // shooting star
    maybeSpawnStar();
    if(shootingStar){
      const s = shootingStar;
      s.x += s.vx; s.y += s.vy; s.life++;
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*14, s.y - s.vy*14);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.vx*14, s.y-s.vy*14); ctx.stroke();
      if(s.life > 90 || s.x>w || s.y>h){ shootingStar = null; }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---------- HERO DECRYPT TITLE ---------- */
(function(){
  const el = document.getElementById('scramble-title');
  const target = "ENIGMA 5.0";
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  function run(){
    if(REDUCED){ el.innerHTML = 'ENIGMA <span class="grad-text">5.0</span>'; return; }
    let frame = 0;
    const totalFrames = 30;
    const resolveAt = target.split('').map((_,i) => Math.floor((i/target.length)*totalFrames*0.7) + 6);
    function tick(){
      frame++;
      let out = '';
      for(let i=0;i<target.length;i++){
        const ch = target[i];
        if(ch === ' '){ out += ' '; continue; }
        out += (frame >= resolveAt[i]) ? ch : chars[Math.floor(Math.random()*chars.length)];
      }
      el.textContent = out;
      if(frame < totalFrames + 6){ requestAnimationFrame(tick); }
      else{ el.innerHTML = 'ENIGMA <span class="grad-text">5.0</span>'; }
    }
    requestAnimationFrame(tick);
  }
  // start once loader finishes (or immediately if reduced motion)
  setTimeout(run, REDUCED ? 0 : 2400);
})();

/* ---------- COUNTDOWN ---------- */
(function(){
  const target = new Date();
  target.setDate(target.getDate() + 6); // placeholder: 21 days out — replace with real event date
  const d = document.getElementById('cd-days'), h = document.getElementById('cd-hours'),
        m = document.getElementById('cd-mins'), s = document.getElementById('cd-secs');
  function tick(){
    const diff = Math.max(0, target - new Date());
    const days = Math.floor(diff/86400000);
    const hours = Math.floor((diff%86400000)/3600000);
    const mins = Math.floor((diff%3600000)/60000);
    const secs = Math.floor((diff%60000)/1000);
    d.textContent = String(days).padStart(2,'0');
    h.textContent = String(hours).padStart(2,'0');
    m.textContent = String(mins).padStart(2,'0');
    s.textContent = String(secs).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---------- SCROLL REVEAL ---------- */
(function(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, {threshold:0.12});
  els.forEach(el=>obs.observe(el));
})();

/* ---------- TIMELINE ACTIVE NODES ---------- */
(function(){
  const items = document.querySelectorAll('.vt-item');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('active'); } });
  }, {threshold:0.5});
  items.forEach(el=>obs.observe(el));
})();

/* ---------- PRIZE COUNTER ---------- */
(function(){
  const el = document.getElementById('prize-counter');
  const target = 25000;
  let started = false;
  function animate(){
    if(started) return;
    started = true;
    const dur = REDUCED ? 0 : 1400;
    const start = performance.now();
    function step(now){
      const p = dur === 0 ? 1 : Math.min(1, (now-start)/dur);
      const eased = 1 - Math.pow(1-p, 3);
      el.textContent = '₹' + Math.floor(target*eased).toLocaleString('en-IN');
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) animate(); });
  }, {threshold:0.4});
  obs.observe(el);
})();

/* ---------- CIPHER TOOL (unchanged logic) ---------- */
(function(){
  function caesarShift(str, shift){
    return str.split('').map(ch=>{
      const code = ch.charCodeAt(0);
      if(code >= 65 && code <= 90){ return String.fromCharCode(((code-65+shift)%26+26)%26+65); }
      if(code >= 97 && code <= 122){ return String.fromCharCode(((code-97+shift)%26+26)%26+97); }
      return ch;
    }).join('');
  }
  const input = document.getElementById('cipher-input');
  const slider = document.getElementById('shift-slider');
  const shiftVal = document.getElementById('shift-val');
  const output = document.getElementById('cipher-output');
  function updateEncoder(){
    const shift = parseInt(slider.value, 10);
    shiftVal.textContent = shift;
    output.textContent = caesarShift(input.value.toUpperCase(), shift) || '—';
  }
  if(input && slider){ input.addEventListener('input', updateEncoder); slider.addEventListener('input', updateEncoder); updateEncoder(); }

  const ENCRYPTED = "WHDPV RI IRXU. RQH VKRW. VHH BRX DW HQLJPD 5.0";
  const ANSWER = "TEAMS OF FOUR. ONE SHOT. SEE YOU AT ENIGMA 5.0";
  const cSlider = document.getElementById('challenge-slider');
  const cVal = document.getElementById('challenge-shift-val');
  const cMsg = document.getElementById('challenge-msg');
  const cStatus = document.getElementById('cipher-status');
  function updateChallenge(){
    const guess = parseInt(cSlider.value, 10);
    cVal.textContent = guess;
    const decoded = caesarShift(ENCRYPTED, -guess);
    cMsg.textContent = decoded;
    if(decoded === ANSWER){ cStatus.textContent = "Decoded. That's the whole point — see you at Enigma 5.0."; cStatus.classList.add('solved'); }
    else{ cStatus.textContent = "Move the slider to decode."; cStatus.classList.remove('solved'); }
  }
  if(cSlider){ cSlider.addEventListener('input', updateChallenge); updateChallenge(); }
})();

/* ---------- REGISTRATION FORM PROTOCOL ---------- */
(function() {
  const form = document.querySelector('#register form');
  const teamInput = document.getElementById('team-name');
  const emailInput = document.getElementById('lead-email');
  const trackInput = document.getElementById('track-select');
  const trackCards = document.querySelectorAll('.track-opt-card');
  const trackContainer = document.querySelector('.track-select-container');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Track selection handler
  function selectTrack(card) {
    const value = card.dataset.value;
    trackInput.value = value;
    
    trackCards.forEach(c => {
      if (c === card) {
        c.classList.add('active');
        c.setAttribute('aria-checked', 'true');
      } else {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      }
    });

    validateTrack(true);
  }

  // Bind track selection events (click and keyboard)
  trackCards.forEach(card => {
    card.addEventListener('click', () => selectTrack(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        selectTrack(card);
      }
    });
  });

  // Validations
  function validateTeamName(interactive = false) {
    const val = teamInput.value.trim();
    const isValid = val.length >= 2 && val.length <= 40;
    const errEl = document.getElementById('err-team');
    
    if (!isValid) {
      if (interactive || form.classList.contains('submitted')) {
        teamInput.classList.add('invalid-input');
        errEl.textContent = val.length === 0 ? "Team name is required." : "Team name must be between 2 and 40 characters.";
      }
      return false;
    } else {
      teamInput.classList.remove('invalid-input');
      errEl.textContent = "";
      return true;
    }
  }

  function validateEmail(interactive = false) {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(val);
    const errEl = document.getElementById('err-email');
    
    if (!isValid) {
      if (interactive || form.classList.contains('submitted')) {
        emailInput.classList.add('invalid-input');
        errEl.textContent = val.length === 0 ? "Email address is required." : "Please enter a valid email address.";
      }
      return false;
    } else {
      emailInput.classList.remove('invalid-input');
      errEl.textContent = "";
      return true;
    }
  }

  function validateTrack(interactive = false) {
    const val = trackInput.value;
    const isValid = !!val;
    const errEl = document.getElementById('err-track');
    
    if (!isValid) {
      if (interactive || form.classList.contains('submitted')) {
        trackContainer.classList.add('invalid-input');
        errEl.textContent = "Please select a track.";
      }
      return false;
    } else {
      trackContainer.classList.remove('invalid-input');
      errEl.textContent = "";
      return true;
    }
  }

  // Interactive error clearing on typing/selection
  teamInput.addEventListener('input', () => validateTeamName(true));
  emailInput.addEventListener('input', () => validateEmail(true));

  // Expose handleRegister globally
  window.handleRegister = function(event) {
    event.preventDefault();
    form.classList.add('submitted');

    // Run all validations
    const isTeamValid = validateTeamName();
    const isEmailValid = validateEmail();
    const isTrackValid = validateTrack();

    if (!isTeamValid || !isEmailValid || !isTrackValid) {
      return false;
    }

    // Valid state: Enter loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-spinner"></span>';

    // Simulate network delay (700-900ms)
    setTimeout(() => {
      const teamName = teamInput.value.trim();
      const leadEmail = emailInput.value.trim();
      const track = trackInput.value;
      const registrationCode = "ENIGMA-" + Math.floor(1000 + Math.random() * 9000);
      const timestamp = new Date().toISOString();

      // Persist registration in localStorage
      const registration = { teamName, email: leadEmail, track, code: registrationCode, timestamp };
      const registrations = JSON.parse(localStorage.getItem('enigma_registrations') || '[]');
      registrations.push(registration);
      localStorage.setItem('enigma_registrations', JSON.stringify(registrations));

      // Reset loading state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Reset Form State
      form.reset();
      form.classList.remove('submitted');
      trackCards.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      trackInput.value = "";

      // Build & Show Accessibility Modal
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'modal-title');
      modal.style.cssText = 'position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; background:rgba(5,8,22,0.85); backdrop-filter:blur(12px); font-family:var(--sans);';
      modal.innerHTML = `
        <div class="modal-card" style="background:var(--panel-solid); border:1px solid var(--cyan); padding:40px; border-radius:16px; width:90%; max-width:440px; text-align:center; box-shadow:0 0 40px rgba(0,245,255,0.15); position:relative;">
          <h3 id="modal-title" style="font-family:var(--display); font-size:24px; color:var(--cyan); margin-bottom:16px;">System Decoded</h3>
          <p style="color:var(--muted); font-size:14px; margin-bottom:24px;">Your team has been registered for the hackathon protocol.</p>
          <div style="background:rgba(0,245,255,0.05); border:1px solid rgba(0,245,255,0.2); padding:16px; border-radius:8px; margin-bottom:28px;">
            <div style="font-family:var(--mono); font-size:11px; color:var(--muted); text-transform:uppercase; margin-bottom:6px;">Team Access Code</div>
            <div style="font-family:var(--mono); font-size:22px; font-weight:700; color:var(--white); letter-spacing:0.05em;">${registrationCode}</div>
          </div>
          <button id="close-modal-btn" class="btn btn-grad" style="padding:12px 28px; width:100%; justify-content:center; cursor:pointer; font-weight:600; border:none; border-radius:8px;">Acknowledge</button>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('#close-modal-btn');

      function closeModal() {
        modal.remove();
        document.removeEventListener('keydown', handleKeydown);
        submitBtn.focus();
      }

      // Close modal events
      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Trap focus
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      // Immediately focus Acknowledge button
      setTimeout(() => {
        closeBtn.focus();
      }, 10);

      function handleKeydown(e) {
        if (e.key === 'Escape') {
          closeModal();
          return;
        }

        if (e.key === 'Tab') {
          if (focusableElements.length === 1) {
            e.preventDefault();
            closeBtn.focus();
            return;
          }

          if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusable) {
              lastFocusable.focus();
              e.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastFocusable) {
              firstFocusable.focus();
              e.preventDefault();
            }
          }
        }
      }

      document.addEventListener('keydown', handleKeydown);
    }, 800);

    return false;
  };
})();