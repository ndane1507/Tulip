// Botanical illustration: each stem, leaf and petal remains independently animated.
export function gardenMarkup() {
  const leaves = [];
  for (let i = 0; i < 23; i++) {
    const side = i % 2 ? 1 : -1;
    const x = 450 + Math.sin(i * 2.4) * 86;
    const y = 850 - (i % 7) * 24;
    const h = 80 + (i * 37) % 125;
    const spread = side * (40 + (i * 29) % 105);
    leaves.push(`<g class="foliage-grow" style="--delay:${1.25 + i * .055}s;transform-origin:${x}px ${y}px"><path d="M${x} ${y} C${x + spread * .15} ${y-h*.52},${x+spread*.38} ${y-h*.91},${x+spread} ${y-h} C${x+spread*1.26} ${y-h*.5},${x+spread*.55} ${y-h*.14},${x} ${y}Z" fill="url(#leaf${i%3})"/><path d="M${x} ${y} Q${x+spread*.42} ${y-h*.56} ${x+spread} ${y-h}" fill="none" stroke="#78b699" stroke-opacity=".13"/></g>`);
  }
  const grasses = Array.from({length: 26}, (_,i) => {
    const x = 205 + (i * 47) % 505, y = 886 + (i % 3) * 7;
    const direction = i % 2 ? 1 : -1;
    const h = 120 + (i * 71) % 340, w = direction * (25 + (i*31)%100);
    return `<g class="grass-grow" style="--delay:${.8+i*.05}s;transform-origin:${x}px ${y}px"><path d="M${x} ${y} Q${x+w*.42} ${y-h*.78} ${x+w} ${y-h} Q${x+w*.16} ${y-h*.62} ${x+9} ${y}Z" fill="url(#grass)" opacity="${.35+(i%5)*.12}"/></g>`;
  });
  const flower = (x,y,scale,angle,delay) => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><g class="flower-sway" style="--sway-delay:-${delay*2}s"><g class="stem-grow" style="--delay:${delay}s">
    <path d="M0 0 C-13 -120,7 -280,0 -450" fill="none" stroke="url(#stem)" stroke-width="8" stroke-linecap="round"/>
    <path class="stem-highlight" d="M-2 -20Q-6 -225 -2 -446" fill="none" stroke="#e6cb87" stroke-width="1" opacity=".4"/>
    <g class="stem-leaf leaf-a"><path d="M-1 -144C-80 -145 -102 -208 -85 -214C-39 -213 -9 -188 -1 -144Z" fill="url(#leaf1)"/><path d="M-2 -145L-81 -208" stroke="#74b796" stroke-opacity=".2"/></g>
    <g class="stem-leaf leaf-b"><path d="M0 -213C62 -215 91 -266 80 -280C36 -273 10 -246 0 -213Z" fill="url(#leaf0)"/><path d="M1 -215L76 -274" stroke="#74b796" stroke-opacity=".2"/></g>
    <g class="stem-leaf leaf-c"><path d="M-1 -295C-59 -299 -74 -337 -65 -349C-24 -341 -9 -324 -1 -295Z" fill="url(#leaf2)"/></g>
    <g class="stem-leaf leaf-d"><path d="M0 -350C39 -351 61 -388 53 -394C20 -387 5 -368 0 -350Z" fill="url(#leaf0)"/></g>
  </g>
  <g transform="translate(0 -450)"><g class="bloom" style="--delay:${delay+1.7}s">
    <ellipse class="flower-halo" cy="-20" rx="81" ry="48" fill="url(#halo)"/>
    <path class="petal petal-back" d="M0 1C-21 -13 -39 -65 -17 -74C12 -84 23 -34 0 1Z" fill="url(#petalBack)"/>
    <path class="petal petal-back" d="M1 3C7 -39 34 -73 51 -57C64 -40 34 -8 1 3Z" fill="url(#petalBack)"/>
    <path class="petal petal-left" d="M0 10C-27 9 -91 -23 -79 -45C-65 -69 -20 -34 0 10Z" fill="url(#petalLeft)"/>
    <path d="M-77 -45Q-55 -60 -7 2" fill="none" stroke="#ffdaec" stroke-opacity=".5" stroke-width="1.1"/>
    <path class="petal petal-right" d="M-1 10C32 7 87 -28 72 -46C52 -63 16 -28 -1 10Z" fill="url(#petalRight)"/>
    <path d="M72 -45Q54 -58 7 3" fill="none" stroke="#ffe0ed" stroke-opacity=".45" stroke-width="1.1"/>
    <ellipse cy="7" rx="31" ry="10" fill="#efcf85"/>
    <ellipse cy="5" rx="25" ry="6" fill="#fff4c7"/>
    <path class="petal petal-front" d="M-37 4Q-1 15 36 3C21 35 -21 36 -37 4Z" fill="url(#petalFront)"/>
    <path d="M-35 5Q0 18 34 4" fill="none" stroke="#ffdaeb" stroke-width="1.5"/>
    <ellipse cy="9" rx="15" ry="3" fill="#fff8d6" opacity=".7"/>
  </g></g></g></g>`;
  return `<svg class="garden" viewBox="0 0 900 920" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="stem" x1="0" y1="0" x2="-20" y2="-450" gradientUnits="userSpaceOnUse"><stop stop-color="#0b342e"/><stop offset=".48" stop-color="#569b62"/><stop offset="1" stop-color="#a8aa6b"/></linearGradient>
    <linearGradient id="leaf0" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#55af80"/><stop offset=".42" stop-color="#167455"/><stop offset="1" stop-color="#022c29"/></linearGradient>
    <linearGradient id="leaf1" x1="1" y1="0" x2="0" y2="1"><stop stop-color="#5eae7e"/><stop offset=".45" stop-color="#13724d"/><stop offset="1" stop-color="#032c27"/></linearGradient>
    <linearGradient id="leaf2" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#48977b"/><stop offset=".5" stop-color="#135f50"/><stop offset="1" stop-color="#041d21"/></linearGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#6ac77e"/><stop offset=".5" stop-color="#228956"/><stop offset="1" stop-color="#051b20"/></linearGradient>
    <linearGradient id="petalBack" x2=".4" y2="1"><stop stop-color="#f3b4d3"/><stop offset=".55" stop-color="#d96ba6"/><stop offset="1" stop-color="#9e427b"/></linearGradient>
    <linearGradient id="petalLeft" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f6b3d3"/><stop offset=".45" stop-color="#df8abb"/><stop offset="1" stop-color="#b55191"/></linearGradient>
    <linearGradient id="petalRight" x1="1" y1="0" x2="0" y2="1"><stop stop-color="#ffd0e6"/><stop offset=".5" stop-color="#e596c3"/><stop offset="1" stop-color="#bc5a98"/></linearGradient>
    <linearGradient id="petalFront" x2="0" y2="1"><stop stop-color="#f2b9d6"/><stop offset="1" stop-color="#ae4d87"/></linearGradient>
    <radialGradient id="halo"><stop stop-color="#e996c3" stop-opacity=".13"/><stop offset="1" stop-color="#e996c3" stop-opacity="0"/></radialGradient>
    <radialGradient id="ground"><stop stop-color="#237b65" stop-opacity=".19"/><stop offset="1" stop-color="#062020" stop-opacity="0"/></radialGradient>
  </defs>
  <ellipse cx="450" cy="864" rx="330" ry="92" fill="url(#ground)"/>
  <g class="back-grass">${grasses.slice(0,13).join('')}</g>
  ${flower(447,830,1.05,1,.9)}
  ${flower(418,843,.8,-18,1.25)}
  ${flower(485,849,.87,19,1.5)}
  <g class="foliage">${leaves.join('')}</g>
  <g class="front-grass">${grasses.slice(13).join('')}</g>
  </svg>`;
}
