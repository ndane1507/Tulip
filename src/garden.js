// Layered SVG tulips: closed cups, translucent petal edges and lance-shaped leaves.
export function gardenMarkup(idPrefix = "") {
  const palettes = {
    rose: ["#ffedf0", "#f4b6ce", "#d2789d", "#77395f"],
    peach: ["#fff1e4", "#efc1ae", "#c78b83", "#8e5568"],
    lilac: ["#f1edff", "#c4b5db", "#9785b7", "#51476d"],
    cream: ["#fffce0", "#e6dfa5", "#b6b779", "#748251"],
  };
  const gradients = Object.entries(palettes)
    .map(
      ([name, c]) => `
    <linearGradient id="${name}-back" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="${c[1]}"/><stop offset=".6" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient>
    <linearGradient id="${name}-left" x1="0" y1="0" x2="1" y2=".7"><stop stop-color="${c[0]}"/><stop offset=".22" stop-color="${c[1]}"/><stop offset=".7" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient>
    <linearGradient id="${name}-right" x1="1" y1="0" x2="0" y2="1"><stop stop-color="${c[0]}"/><stop offset=".3" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient>
    <linearGradient id="${name}-front" x1=".15" y1=".1" x2=".85" y2=".9"><stop stop-color="${c[0]}"/><stop offset=".18" stop-color="${c[1]}"/><stop offset=".43" stop-color="${c[1]}"/><stop offset=".75" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[3]}"/></linearGradient>
    <radialGradient id="${name}-sheen" cx=".2" cy=".2" r=".9"><stop stop-color="${c[0]}" stop-opacity=".5"/><stop offset=".52" stop-color="${c[0]}" stop-opacity=".08"/><stop offset="1" stop-color="${c[0]}" stop-opacity="0"/></radialGradient>
    <radialGradient id="${name}-halo"><stop stop-color="${c[1]}" stop-opacity=".13"/><stop offset="1" stop-color="${c[1]}" stop-opacity="0"/></radialGradient>`,
    )
    .join("");
  function tulip({ x, y, height, angle, size, color, delay }) {
    const c = palettes[color];
    return `<g transform="translate(${x} ${y}) rotate(${angle})"><g class="tulip-sway" style="--wind:${7 + delay}s;--phase:-${delay * 3}s">
      <g class="plant-grow" style="--delay:${delay}s">
        <path d="M0 0C-12 -155,12 -${height * 0.65},0 -${height}" stroke="url(#stem)" stroke-width="7" stroke-linecap="round"/>
        <path d="M-1 0C-9 -155,9 -${height * 0.65},-1 -${height}" stroke="#abd8a6" stroke-opacity=".28" stroke-width="1.2"/>
        <g class="attached-leaf" style="--leaf-delay:${delay + 0.8}s;transform-origin:0px -${height * 0.28}px"><path d="M0 -${height * 0.28}C-28 -${height * 0.35},-97 -${height * 0.62},-81 -${height * 0.75}C-55 -${height * 0.66},-21 -${height * 0.57},0 -${height * 0.28}Z" fill="url(#leaf-light)"/><path d="M0 -${height * 0.28}Q-48 -${height * 0.52},-81 -${height * 0.75}" stroke="#bdd6a5" stroke-opacity=".17"/></g>
        <g class="attached-leaf" style="--leaf-delay:${delay + 1.1}s;transform-origin:0px -${height * 0.46}px"><path d="M0 -${height * 0.46}C28 -${height * 0.52},82 -${height * 0.72},62 -${height * 0.84}C42 -${height * 0.75},12 -${height * 0.66},0 -${height * 0.46}Z" fill="url(#leaf-dark)"/><path d="M0 -${height * 0.46}Q42 -${height * 0.64},62 -${height * 0.84}" stroke="#b7d6ab" stroke-opacity=".2"/></g>
      </g>
      <g transform="translate(0 -${height}) scale(${size})"><g class="tulip-bloom" style="--delay:${delay + 1.6}s">
        <ellipse class="bloom-aura" cx="0" cy="-65" rx="135" ry="154" fill="url(#${color}-halo)"/>
        <path d="M-16 -6Q0 3 17 -7Q7 21 0 22Q-8 19 -16 -6Z" fill="#588657"/>
        <path class="rear-petal" d="M-4 9C-37 -20,-48 -109,-24 -142C-10 -150,8 -127,14 -101C26 -125,41 -140,48 -132C65 -74,37 -7,-4 9Z" fill="url(#${color}-back)"/>
        <g class="petal-unfurl petal-unfurl-left" style="--delay:${delay + 2}s"><path d="M0 12C-57 3,-76 -50,-68 -119C-49 -123,-5 -89,12 -53C22 -22,17 4,0 12Z" fill="url(#${color}-left)"/><path d="M-66 -118C-70 -57,-44 -12,-3 9" stroke="${c[0]}" stroke-width="1.2" stroke-opacity=".55"/><path d="M-57 -109Q-41 -57,-10 -8" stroke="${c[0]}" stroke-opacity=".12" stroke-width="2"/></g>
        <g class="petal-unfurl petal-unfurl-right" style="--delay:${delay + 2.15}s"><path d="M0 12C58 4,77 -55,64 -123C42 -114,12 -94,-6 -48C-18 -22,-14 4,0 12Z" fill="url(#${color}-right)"/><path d="M63 -120C72 -55,46 -9,2 10" stroke="${c[0]}" stroke-width="1" stroke-opacity=".55"/></g>
        <path class="front-petal" d="M0 14C-41 5,-48 -47,-34 -93C-23 -111,-8 -132,3 -128C25 -111,43 -87,43 -59C43 -14,24 10,0 14Z" fill="url(#${color}-front)"/>
        <path d="M0 14C-41 5,-48 -47,-34 -93C-23 -111,-8 -132,3 -128C25 -111,43 -87,43 -59C43 -14,24 10,0 14Z" fill="url(#${color}-sheen)"/>
        <path d="M-31 -93C-41 -58,-29 -10,-2 10" stroke="${c[0]}" stroke-opacity=".18" stroke-width="1.1"/>
        <path d="M9 -116C19 -94,23 -44,13 -9M-6 -116C-18 -80,-16 -38,-8 -5M19 -100C33 -70,30 -42,22 -18" stroke="${c[0]}" stroke-opacity=".09" stroke-width=".65"/>
        <path d="M3 -126C-8 -90,-7 -32,0 12" stroke="${c[0]}" stroke-opacity=".24" stroke-width="1.3"/>
        <path d="M5 -124Q28 -99,37 -74" stroke="${c[0]}" stroke-opacity=".48" stroke-width="1"/>
        <path d="M-22 -102Q-27 -56,-14 -12" stroke="${c[0]}" stroke-opacity=".12" stroke-width="1.5"/>
      </g></g>
    </g></g>`;
  }
  const plants = [
    {
      x: 433,
      y: 940,
      height: 380,
      angle: -32,
      size: 0.66,
      color: "cream",
      delay: 1.6,
    },
    {
      x: 565,
      y: 948,
      height: 407,
      angle: 34,
      size: 0.63,
      color: "rose",
      delay: 1.85,
    },
    {
      x: 468,
      y: 945,
      height: 482,
      angle: -19,
      size: 0.9,
      color: "peach",
      delay: 0.9,
    },
    {
      x: 534,
      y: 947,
      height: 515,
      angle: 21,
      size: 0.95,
      color: "lilac",
      delay: 1.2,
    },
    {
      x: 501,
      y: 944,
      height: 587,
      angle: -1,
      size: 1.04,
      color: "rose",
      delay: 0.5,
    },
  ];
  const grass = Array.from({ length: 29 }, (_, i) => {
    const x = 200 + ((i * 67) % 590),
      y = 980 + (i % 4) * 8,
      h = 125 + ((i * 71) % 320),
      dx = (i % 2 ? 1 : -1) * (25 + ((i * 33) % 150));
    return `<g class="reed-grow" style="--delay:${0.7 + i * 0.04}s;transform-origin:${x}px ${y}px"><path d="M${x} ${y}Q${x + dx * 0.3} ${y - h * 0.78} ${x + dx} ${y - h}Q${x + dx * 0.14} ${y - h * 0.6} ${x + 5} ${y}Z" fill="url(#reed)" opacity="${0.26 + (i % 4) * 0.12}"/></g>`;
  });
  const leaves = Array.from({ length: 12 }, (_, i) => {
    const x = 445 + Math.sin(i * 3) * 80,
      y = 950 + (i % 3) * 10,
      h = 160 + ((i * 43) % 175),
      side = i % 2 ? 1 : -1,
      dx = side * (30 + ((i * 23) % 95));
    return `<g class="ground-leaf" style="--delay:${1 + i * 0.07}s;transform-origin:${x}px ${y}px"><g class="leaf-breathe" style="--phase:-${i * 0.8}s;transform-origin:${x}px ${y}px"><path d="M${x} ${y}C${x + dx * 0.7} ${y - h * 0.2},${x + dx * 1.3} ${y - h * 0.65},${x + dx} ${y - h}C${x + dx * 0.12} ${y - h * 0.8},${x - dx * 0.35} ${y - h * 0.23},${x} ${y}Z" fill="url(#${i % 2 ? "leaf-dark" : "leaf-light"})"/><path d="M${x} ${y}Q${x + dx * 0.25} ${y - h * 0.53} ${x + dx} ${y - h}" stroke="#b6cead" stroke-opacity=".16" stroke-width="1"/></g></g>`;
  }).join("");
  const markup = `<svg class="garden" viewBox="0 0 1000 1030" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>${gradients}
    <linearGradient id="stem" x1="0" y1="0" x2="-10" y2="-550" gradientUnits="userSpaceOnUse"><stop stop-color="#143c35"/><stop offset=".45" stop-color="#709f78"/><stop offset="1" stop-color="#a3b383"/></linearGradient>
    <linearGradient id="leaf-light" x1="0" y1=".5" x2="1" y2=".7"><stop stop-color="#0e3738"/><stop offset=".4" stop-color="#547f69"/><stop offset=".55" stop-color="#79a28a"/><stop offset=".62" stop-color="#436d5c"/><stop offset="1" stop-color="#0e3537"/></linearGradient>
    <linearGradient id="leaf-dark" x1="1" y1="0" x2="0" y2=".7"><stop stop-color="#89ac8d"/><stop offset=".35" stop-color="#426f60"/><stop offset=".65" stop-color="#224f47"/><stop offset="1" stop-color="#082b30"/></linearGradient>
    <linearGradient id="reed" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#84b695"/><stop offset=".4" stop-color="#477b68"/><stop offset="1" stop-color="#0a242a"/></linearGradient>
    <radialGradient id="ground"><stop stop-color="#60956b" stop-opacity=".22"/><stop offset="1" stop-color="#60956b" stop-opacity="0"/></radialGradient>
  </defs><ellipse cx="500" cy="960" rx="370" ry="100" fill="url(#ground)"/>
  <g class="back-reeds">${grass.slice(0, 25).join("")}</g>${plants.map(tulip).join("")}
  <g class="ground-leaves">${leaves}</g><g class="front-reeds">${grass.slice(25).join("")}</g></svg>`;
  return idPrefix
    ? markup
        .replace(/id="/g, `id="${idPrefix}`)
        .replace(/url\(#/g, `url(#${idPrefix}`)
    : markup;
}
