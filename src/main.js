import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-500.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/latin-500.css';
import '@fontsource/cormorant-garamond/vietnamese-400.css';
import '@fontsource/cormorant-garamond/vietnamese-400-italic.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import './style.css';
import { gift } from './config.js';
import { gardenMarkup } from './garden.js';
import flowerIcon from '@tabler/icons/outline/flower.svg?raw';
import heartIcon from '@tabler/icons/outline/heart.svg?raw';
import starIcon from '@tabler/icons/outline/star.svg?raw';
import sparkleIcon from '@tabler/icons/outline/sparkles.svg?raw';
import mailIcon from '@tabler/icons/outline/mail.svg?raw';
import photoIcon from '@tabler/icons/outline/photo.svg?raw';
import musicIcon from '@tabler/icons/outline/music.svg?raw';
import muteIcon from '@tabler/icons/outline/volume-off.svg?raw';
import settingsIcon from '@tabler/icons/outline/adjustments-horizontal.svg?raw';
import closeIcon from '@tabler/icons/outline/x.svg?raw';
import plusIcon from '@tabler/icons/outline/plus.svg?raw';
import arrowIcon from '@tabler/icons/outline/arrow-up-right.svg?raw';

const icons = { heart: heartIcon, flower: flowerIcon, star: starIcon };
let messages = [...gift.messages], symbol = gift.symbol;
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem('garden-gift-v1') || 'null');
  if (saved && Array.isArray(saved.messages)) {
    const valid = saved.messages.filter(s => typeof s === 'string' && s.trim()).slice(0, 12).map(s => s.slice(0, 100));
    if (valid.length) messages = valid;
    if (Object.hasOwn(icons, saved.symbol)) symbol = saved.symbol;
  }
} catch { storageAvailable = false; }
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let opened = false, ready = false, musicOn = false, musicDesired = false;
let resumeMusic = false, musicFailed = false;
const audio = new Audio(gift.music);
audio.loop = true; audio.volume = .35; audio.preload = 'none';
const app = document.querySelector('#app');
app.innerHTML = `
  <main class="world" id="world" aria-label="Khu vườn dành cho em">
    <canvas id="fireflies" aria-hidden="true"></canvas>
    <div class="sky-glow" aria-hidden="true"></div>
    <header class="scene-header">
      <div class="wordmark">${flowerIcon}<span>một chút thương</span><span class="wordmark-dot"></span></div>
      <button class="sound-button" id="sound" aria-label="Bật nhạc nền" aria-pressed="false">${musicIcon}<span>Nhạc đang tắt</span><i class="sound-bars" aria-hidden="true"><b></b><b></b><b></b></i></button>
    </header>
    <div class="scene-heading"><p class="eyebrow">DÀNH RIÊNG CHO NGƯỜI MÌNH THƯƠNG</p><h1>Một vườn hoa<br><em>dành cho em.</em></h1><p class="scene-subtitle">Có những dịu dàng, chỉ muốn gửi riêng em.</p></div>
    <div class="garden-stage">${gardenMarkup()}</div>
    <div class="memories" id="memories" aria-label="Những kỷ niệm"></div>
    <div class="floating-messages" id="floating-messages" aria-hidden="true"></div>
    <aside class="garden-menu" aria-label="Menu khu vườn">
      <div class="menu-options" id="menu-options" hidden>
        <button data-action="letter" aria-label="Đọc lời nhắn">${mailIcon}<span>Lời nhắn</span></button>
        <button data-action="gallery" aria-label="Xem ảnh kỷ niệm">${photoIcon}<span>Kỷ niệm</span></button>
        <button data-action="music" id="menu-sound" aria-label="Bật nhạc nền" aria-pressed="false">${musicIcon}<span>Nhạc nền</span></button>
        <button data-action="settings" aria-label="Mở cài đặt">${settingsIcon}<span>Cài đặt</span></button>
      </div>
      <button class="menu-trigger" id="menu-trigger" aria-label="Mở menu khu vườn" aria-expanded="false" aria-controls="menu-options">${plusIcon}</button>
      <span class="menu-caption">Một chút nữa</span>
    </aside>
    <div class="scene-note"><span class="note-line"></span><p>Hoa nở vì em.<br><span>Và mọi dịu dàng cũng thế.</span></p></div>
    <div class="touch-hint">${sparkleIcon}<span>Chạm nhẹ, gửi một chút thương</span></div>
    <div class="scene-vignette" aria-hidden="true"></div>
    <section class="welcome" id="welcome" aria-labelledby="welcome-title">
      <div class="welcome-stars" aria-hidden="true">✦</div>
      <div class="welcome-card">
        <div class="gift-seal" aria-hidden="true">${flowerIcon}</div>
        <p class="eyebrow">MỘT MÓN QUÀ NHỎ · MỘT CHÚT THƯƠNG</p>
        <h2 id="welcome-title">Có một món quà<br><em>dành cho em.</em></h2>
        <p class="welcome-copy">Một chút dịu dàng đã được gieo ở đây.<br>Chỉ chờ em ghé qua, để nở thành hoa.</p>
        <button class="open-gift" id="open-gift">Mở quà <span>${arrowIcon}</span></button>
        <p class="welcome-footnote">${musicIcon} Một chút nhạc sẽ làm khoảnh khắc đẹp hơn</p>
      </div>
      <p class="welcome-sign">Gửi em, bằng tất cả dịu dàng.</p>
    </section>
  </main>
  <dialog id="gift-dialog" aria-labelledby="dialog-title"><div class="dialog-content" id="dialog-content"></div></dialog>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>
`;

const $ = s => document.querySelector(s);
const world = $('#world'), dialog = $('#gift-dialog');
$('.scene-header').inert = true;
$('.garden-menu').inert = true;
$('#memories').inert = true;
let lastFocus;
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => $('#toast').classList.remove('visible'), 3500);
}
function renderMemories() {
  $('#memories').innerHTML = gift.photos.map((photo, i) => `<button class="memory memory-${i}" style="--rotation:${[-12,9,-7,13,-9][i]}deg;--float-delay:-${i*2.1}s;--appear-delay:${i*.45}s" data-photo="${i}" aria-label="Xem ảnh: ${escape(photo.caption)}"><span class="photo-paper"><img src="${escape(photo.src)}" alt="${escape(photo.alt)}" width="200" height="240"><span>${escape(photo.caption)}</span></span></button>`).join('');
}
function renderMessages() {
  $('#floating-messages').innerHTML = Array.from({length: 5}, (_,i) => `<span class="floating-message message-${i}" style="--float-delay:-${i*3.2}s;--appear-delay:${i*.6}s">${icons[symbol]}<span>${escape(messages[i%messages.length])}</span></span>`).join('');
}
renderMemories(); renderMessages();
function updateMusic() {
  $('#sound').setAttribute('aria-pressed', String(musicOn));
  $('#menu-sound').setAttribute('aria-pressed', String(musicOn));
  $('#sound').setAttribute('aria-label', musicOn ? 'Tắt nhạc nền' : 'Bật nhạc nền');
  $('#menu-sound').setAttribute('aria-label', musicOn ? 'Tắt nhạc nền' : 'Bật nhạc nền');
  $('#sound').querySelector('span').textContent = musicOn ? 'Nhạc đang bật' : 'Nhạc đang tắt';
  $('#sound').classList.toggle('is-playing', musicOn);
}
async function playMusic(quiet = false) {
  if (musicFailed) { if (!quiet) toast('Chưa tải được nhạc. Bạn vẫn có thể khám phá khu vườn.'); return; }
  musicDesired = true;
  try { await audio.play(); if (musicDesired && !document.hidden) musicOn = true; else audio.pause(); }
  catch { musicDesired = false; if (!quiet) toast('Chưa phát được nhạc. Hãy chạm lại nút nhạc để thử.'); }
  updateMusic();
}
function stopMusic() { musicDesired = false; audio.pause(); musicOn = false; resumeMusic = false; updateMusic(); }
function toggleMusic() { if (musicOn || musicDesired) stopMusic(); else playMusic(); }
audio.addEventListener('error', () => { musicFailed = true; musicOn = false; musicDesired = false; updateMusic(); if (opened) toast('Không tải được nhạc. Khu vườn vẫn đang chờ em.'); });
$('#sound').addEventListener('click', toggleMusic);
$('#open-gift').addEventListener('click', () => {
  if (opened) return;
  opened = true; world.classList.add('opened');
  $('#welcome').inert = true;
  playMusic(true);
  setTimeout(() => { $('#welcome').hidden = true; $('.scene-header').inert = false; $('.garden-menu').inert = false; $('#menu-trigger').focus({preventScroll:true}); }, reduced.matches ? 0 : 950);
  setTimeout(() => { ready = true; world.classList.add('ready'); $('#memories').inert = false; }, reduced.matches ? 250 : 5100);
});
const menuTrigger = $('#menu-trigger');
menuTrigger.addEventListener('click', () => {
  const expanded = menuTrigger.getAttribute('aria-expanded') === 'true';
  menuTrigger.setAttribute('aria-expanded', String(!expanded));
  menuTrigger.setAttribute('aria-label', expanded ? 'Mở menu khu vườn' : 'Đóng menu khu vườn');
  $('#menu-options').hidden = expanded;
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !dialog.open && !$('#menu-options').hidden) {
    menuTrigger.click(); menuTrigger.focus();
  }
});
function modal(content, kind = '') {
  if (!dialog.open) lastFocus = document.activeElement;
  dialog.className = kind;
  $('#dialog-content').innerHTML = `<button class="dialog-close" data-close aria-label="Đóng cửa sổ">${closeIcon}</button>${content}`;
  if (!dialog.open) dialog.showModal();
  dialog.querySelector('[data-close]').focus({preventScroll:true});
}
function closeModal() { dialog.close(); }
dialog.addEventListener('close', () => { if (lastFocus?.isConnected) lastFocus.focus({preventScroll:true}); });
dialog.addEventListener('click', event => {
  if (event.target.closest('[data-close]')) closeModal();
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeModal();
  }
  const photo = event.target.closest('[data-photo]');
  if (photo) showPhoto(Number(photo.dataset.photo));
  const nav = event.target.closest('[data-next-photo]');
  if (nav) showPhoto(Number(nav.dataset.nextPhoto));
});
function showLetter() {
  modal(`<div class="letter-mark">${heartIcon}</div><p class="eyebrow">MẤY DÒNG GỬI ${escape(gift.recipient.toLocaleUpperCase('vi'))}</p><h2 id="dialog-title">${escape(gift.letterTitle)}</h2><div class="letter-body">${gift.letter.map(p => `<p>${escape(p)}</p>`).join('')}</div><p class="letter-sign">Thương em,<br><em>${escape(gift.sender)}</em></p>`, 'letter-dialog');
}
function showGallery() {
  modal(`<p class="eyebrow">GIỮ LẠI NHỮNG DỊU DÀNG</p><h2 id="dialog-title">Những ngày có nhau.</h2><p class="dialog-intro">Những tấm hình nhỏ, những niềm vui thật lâu.</p><div class="gallery-grid">${gift.photos.map((p,i) => `<button data-photo="${i}" aria-label="Xem ảnh: ${escape(p.caption)}"><img src="${escape(p.src)}" alt="${escape(p.alt)}" width="300" height="360"><span>${escape(p.caption)}</span></button>`).join('')}</div><p class="sample-note">Ảnh phong cảnh mẫu · Có thể thay bằng ảnh của hai bạn.</p>`, 'gallery-dialog');
}
function showPhoto(index) {
  const i = (index + gift.photos.length) % gift.photos.length, p = gift.photos[i];
  modal(`<p class="eyebrow">MỘT MẢNH KỶ NIỆM · ${i+1} / ${gift.photos.length}</p><h2 id="dialog-title">${escape(p.caption)}</h2><img class="lightbox-image" src="${escape(p.src)}" alt="${escape(p.alt)}"><div class="photo-navigation"><button data-next-photo="${i-1}">← Ảnh trước</button><button data-next-photo="${i+1}">Ảnh sau →</button></div>`, 'photo-dialog');
}
function showSettings() {
  modal(`<p class="eyebrow">MỘT CHÚT THEO Ý EM</p><h2 id="dialog-title">Chăm chút khu vườn.</h2><p class="dialog-intro">Những điều nhỏ xinh, để món quà là của riêng mình.</p><form id="settings-form"><fieldset><legend>Biểu tượng yêu thương</legend><div class="symbol-options">${Object.entries(icons).map(([key,svg]) => `<label><input type="radio" name="symbol" value="${key}" ${symbol===key?'checked':''}><span>${svg}${{heart:'Trái tim',flower:'Bông hoa',star:'Ngôi sao'}[key]}</span></label>`).join('')}</div></fieldset><label class="message-label" for="messages-input">Lời nhắn bay trong vườn<span>Mỗi dòng một lời thương · tối đa 12 dòng</span></label><textarea id="messages-input" name="messages" rows="6" maxlength="1211" required>${escape(messages.join('\n'))}</textarea><p class="form-error" id="form-error" role="alert"></p><p class="storage-note">Tùy chỉnh được lưu trên trình duyệt này.</p><div class="dialog-actions"><button type="button" class="secondary-button" data-close>Đóng</button><button type="submit" class="primary-button">Lưu thay đổi ${heartIcon}</button></div></form>`, 'settings-dialog');
  $('#settings-form').addEventListener('submit', event => {
    event.preventDefault();
    const next = $('#messages-input').value.split('\n').map(s => s.trim()).filter(Boolean);
    if (!next.length) { $('#form-error').textContent = 'Hãy viết ít nhất một lời nhắn nhé.'; return; }
    if (next.length > 12 || next.some(s => s.length > 100)) { $('#form-error').textContent = 'Tối đa 12 lời nhắn, mỗi lời không quá 100 ký tự.'; return; }
    messages = next;
    symbol = new FormData(event.target).get('symbol');
    try { localStorage.setItem('garden-gift-v1', JSON.stringify({messages,symbol})); storageAvailable = true; } catch { storageAvailable = false; }
    renderMessages(); closeModal();
    toast(storageAvailable ? 'Đã giữ lại những lời thương của bạn.' : 'Đã áp dụng. Trình duyệt này chưa cho phép lưu tùy chỉnh.');
  });
}
$('#menu-options').addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  ({letter:showLetter,gallery:showGallery,music:toggleMusic,settings:showSettings})[action]?.();
});
$('#memories').addEventListener('click', event => { const target = event.target.closest('[data-photo]'); if (target) showPhoto(Number(target.dataset.photo)); });

// One shared, capped animation loop. It sleeps when the document is hidden.
const canvas = $('#fireflies'), ctx = canvas.getContext('2d');
let width = 0, height = 0, frame, lastTime = 0, elapsed = 0;
let particles = [], bursts = [];
function resize() {
  width = innerWidth; height = innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = width*dpr; canvas.height = height*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  particles = Array.from({length:width<600?38:85},(_,i) => ({x:Math.random()*width,y:Math.random()*height,phase:Math.random()*Math.PI*2,r:i%5===0?1.5:.5+Math.random()*.7,firefly:i%4===0}));
  if (reduced.matches) paint(0);
}
function paint(time) {
  ctx.clearRect(0,0,width,height);
  for (const p of particles) {
    const t = reduced.matches?0:time;
    const x=p.x+Math.sin(t*.0004+p.phase)*(p.firefly?24:4), y=p.y+Math.cos(t*.0003+p.phase)*15;
    const alpha=p.firefly?.25+Math.sin(t*.001+p.phase)*.2:.12+Math.sin(t*.0005+p.phase)*.08;
    ctx.fillStyle=p.firefly?`rgba(206,225,129,${alpha})`:`rgba(180,219,216,${alpha})`;
    ctx.shadowBlur=p.firefly?10:0; ctx.shadowColor='#cbef7d';
    ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
  }
  ctx.shadowBlur=0;
  bursts = bursts.filter(p=>time-p.start<1200);
  for(const p of bursts){
    const progress=(time-p.start)/1200;
    ctx.fillStyle=`rgba(247,201,224,${(1-progress)*.8})`;
    ctx.beginPath();ctx.arc(p.x+Math.cos(p.angle)*progress*p.distance,p.y+Math.sin(p.angle)*progress*p.distance-progress*12,Math.max(.1,(1-progress)*2.5),0,Math.PI*2);ctx.fill();
  }
}
function tick(time) {
  if(document.hidden || reduced.matches) return;
  if(time-lastTime>=32){ elapsed+=Math.min(time-lastTime,40);lastTime=time;paint(elapsed); }
  frame=requestAnimationFrame(tick);
}
resize();addEventListener('resize',resize);frame=requestAnimationFrame(tick);
world.addEventListener('pointerdown',event=>{
  if(!opened||!ready||reduced.matches||event.target.closest('button, aside, dialog'))return;
  for(let i=0;i<12;i++)bursts.push({x:event.clientX,y:event.clientY,angle:Math.PI*2*i/12,distance:25+Math.random()*35,start:elapsed});
  if(bursts.length>120)bursts=bursts.slice(-120);
});
document.addEventListener('visibilitychange',()=>{
  world.classList.toggle('sleeping',document.hidden);
  cancelAnimationFrame(frame);
  if(document.hidden){resumeMusic=musicDesired;audio.pause();musicOn=false;updateMusic();}
  else {lastTime=performance.now();if(!reduced.matches)frame=requestAnimationFrame(tick);if(resumeMusic)playMusic(true);}
});
reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);if(reduced.matches){paint(0);if(opened){ready=true;world.classList.add('ready');}}else{lastTime=performance.now();frame=requestAnimationFrame(tick);}});
