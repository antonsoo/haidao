(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={witness:`Waseda University Library ni02 00649; catalogue date 1777; preface dated 1775`,description:`Five complete photographed openings, PDF pages 9-13. Rendered by Poppler 24.02.0, longest edge 3600 pixels, JPEG quality 88; no crop or retouch.`,pdf:`https://upload.wikimedia.org/wikipedia/commons/1/10/WUL-ni02_00649_%E6%B5%B7%E5%B3%B6%E7%AE%97%E7%B6%93.pdf`,pdfSha256:`f187bc664284f3b60742641fb2e0afd69ce9f3342819d4aab358b771372edd0c`,commons:`https://commons.wikimedia.org/w/index.php?curid=99007136`,license:`Public domain; Commons PD-old / public domain mark. Original app, diagrams, transcription and English: MIT. Fonts: separate complete OFL notices.`,assets:[{path:`sources/waseda-09.jpg`,bytes:944202,sha256:`bded88b54aad386512ddc06b8e28c5a37f6ae490558646013d597aaca9f27f43`},{path:`sources/waseda-10.jpg`,bytes:796216,sha256:`2e2169694a4bc17830dc8415f5af3681fd2649fdd040c6bd51a36be47edbc3be`},{path:`sources/waseda-11.jpg`,bytes:1018547,sha256:`620dd0b10c6f195385d9c2484cf42bac798d5006e7533fc282febd3f253d2db0`},{path:`sources/waseda-12.jpg`,bytes:982697,sha256:`40b8b9dc5ef1f2e9bb3e8a4218117a15a49d47abe21568f29f47e125fbbada4e`},{path:`sources/waseda-13.jpg`,bytes:1010533,sha256:`f460c01cc2aaba138cc779698996bba9a8b44aec76f20f7f5d17dad382c918c4`},{path:`sources/waseda-metadata.json`,bytes:2294,sha256:`c34ac06a8920c62ea271561180e5ff089bdb06ba5972b5d1b874e91edd9b2341`},{path:`fonts/Atkinson-OFL.txt`,bytes:4431,sha256:`aca6a428580965d2297d1b718042dd427c2a9443ece3b0d02d758e161e0c4030`},{path:`fonts/AtkinsonHyperlegibleNext.ttf`,bytes:114552,sha256:`5a455d1cfa099b601ab70751bb9673e8fe1854dc4500c80e1a220d0d75e31745`},{path:`fonts/HaidaoCJK.woff2`,bytes:44284,sha256:`27a27fb302131881c0f1a600f6b62989a44622748490b36c57f11a7df456edaf`},{path:`fonts/Noto-NOTICE.txt`,bytes:118,sha256:`f0aeeb7b1cf3c018211e235091ad316e184e8d3bdac3922b03dca9598451d1ec`},{path:`fonts/Noto-OFL.txt`,bytes:4301,sha256:`6a73f9541c2de74158c0e7cf6b0a58ef774f5a780bf191f2d7ec9cc53efe2bf2`},{path:`fonts/characters.txt`,bytes:399,sha256:`4ad5a7fbd124841f41e752ab50b23f1563b3ca1dd37c15d45b4bdfdd1960ed4c`},{path:`fonts/provenance.json`,bytes:344,sha256:`ad16696e82aa2e31a8b11d76316245a2c64e4e8a5832042b9289b54a29446664`}]};function t(e){return new URL(`/haidao/`+e,location.origin).href}async function n(n,r){let i=e.assets.find(e=>e.path===n);if(!i)throw Error(`Unknown source asset.`);let a=await fetch(t(n),{cache:`no-cache`,signal:r?AbortSignal.any([r,AbortSignal.timeout(15e3)]):AbortSignal.timeout(15e3)});if(!a.ok)throw Error(`Could not load ${n} (${a.status}).`);let o=new Uint8Array(await a.arrayBuffer()),s=Array.from(new Uint8Array(await crypto.subtle.digest(`SHA-256`,o)),e=>e.toString(16).padStart(2,`0`)).join(``);if(o.length!==i.bytes||s!==i.sha256)throw Error(`The identity check failed for ${n}. Reload or retry with the complete edition.`);return o}function r(e){let t=``;for(let n=0;n<e.length;n+=16384)t+=String.fromCharCode(...e.subarray(n,n+16384));return btoa(t)}var i=[{title:`Place two equal poles`,voice:`Problem attributed to Liu Hui`,chinese:`今有望海島，立兩表齊高三丈，前後相去千步，令後表與前表參相直。`,english:`Suppose an island is to be sighted. Set up two poles of equal height, three zhang, a thousand bu apart, front and rear. Align the rear pole with the front pole.`,note:`The alignment is along the survey direction on the ground. It does not put both pole tips and the island peak on one sight line.`,words:[[`表`,`biǎo`,`a sighting pole`],[`齊高`,`qí gāo`,`equal in height`],[`相去`,`xiāng qù`,`to be separated by a distance`]],page:10,location:`Left leaf, main text, beginning at the right`},{title:`Make the first sighting`,voice:`Problem attributed to Liu Hui`,chinese:`從前表卻行一百二十三步，人目著地，取望島峯，與表末參合。`,english:`Retreat 123 bu from the front pole. With the eye at ground level, sight the island peak so that it lines up with the tip of the pole.`,note:`The eye is at ground level in this idealized exercise. Adding an ordinary standing eye height would change the geometry.`,words:[[`卻行`,`què xíng`,`to move back`],[`著地`,`zhuó dì`,`touching the ground`],[`表末`,`biǎo mò`,`the tip of the pole`]],page:10,location:`Left leaf, middle main-text columns`},{title:`Make the second sighting`,voice:`Problem attributed to Liu Hui`,chinese:`從後表卻行一百二十七步，人目著地，取望島峯，亦與表末參合。`,english:`Retreat 127 bu from the rear pole. With the eye at ground level, sight the island peak; it too lines up with the tip of that pole.`,note:`This is a second eye position and a second pole. The two observations constrain the same peak.`,words:[[`後表`,`hòu biǎo`,`the rear pole`],[`亦`,`yì`,`also`],[`參合`,`cān hé`,`to line up together`]],page:10,location:`Left leaf, middle and left main-text columns`},{title:`Read the stated answers`,voice:`Problem attributed to Liu Hui`,chinese:`問島高及去表各幾何？答曰：島高四里五十五步，去表一百二里一百五十步。`,english:`What are the island's height and its distance from the pole? Answer: the island is four li and 55 bu high; its distance from the pole is 102 li and 150 bu.`,note:`The distance procedure specifies the front pole. At 300 bu per li, these answers are 1,255 bu and 30,750 bu.`,words:[[`幾何`,`jǐ hé`,`how much?`],[`島高`,`dǎo gāo`,`the height of the island`],[`去表`,`qù biǎo`,`distance from the pole`]],page:10,location:`Left leaf, last columns; the answer continues onto opening 11`},{title:`Operate on the numbers`,voice:`Procedure attributed to Liu Hui`,chinese:`術曰：以表高乘表間為實，相多為法，除之。所得加表高，即得島高。`,english:`Procedure: multiply the pole height by the distance between the poles to form the dividend. Use the excess as divisor and divide. Add the pole height to the result; this gives the island's height.`,note:`實 and 法 are calculation roles here: dividend and divisor. The crucial question is what 相多, the excess, refers to.`,words:[[`實`,`shí`,`dividend in this operation`],[`法`,`fǎ`,`divisor in this operation`],[`相多`,`xiāng duō`,`the amount by which one exceeds the other`]],page:11,location:`Right leaf, first main-text columns`},{title:`Try the received wording`,voice:`Commentary attributed to Li Chunfeng and colleagues`,chinese:`二表相去為相多，以為法。`,english:`Use the distance between the two poles as the excess, making it the divisor.`,note:`This is the wording in the received commentary in this printed witness. Try the pole-gap divisor in the calculation. A wrong result can still pass one sighting. This does not establish when or how the wording arose.`,words:[[`二表`,`èr biǎo`,`the two poles`],[`以為`,`yǐ wéi`,`use as`],[`淳風等按`,`Chúnfēng děng àn`,`Chunfeng and colleagues comment`]],page:11,location:`Right leaf, commentary ends at the left; 二表 begins near the bottom of its last column`},{title:`Read the editorial correction`,voice:`Qing editorial note, marked 案`,chinese:`前後去表相減，餘四步為相多，非二表相去也。`,english:`Subtract the front and rear distances from the poles: the remaining four bu is the excess. It is not the distance between the two poles.`,note:`The small note distinguishes the setback difference, 127 − 123, from the pole gap, 1,000. The note's text crosses from the right leaf onto the top right of the left leaf.`,words:[[`相減`,`xiāng jiǎn`,`subtract one from the other`],[`餘`,`yú`,`what remains`],[`非…也`,`fēi … yě`,`it is not …`]],page:11,location:`Small editorial text in the final right-leaf column and first left-leaf column`},{title:`Calculate the distance`,voice:`Procedure attributed to Liu Hui`,chinese:`求前表去島遠近者：以前表卻行乘表間為實，相多為法，除之，得島去表數。`,english:`To find the distance from the front pole to the island: multiply the front-pole retreat by the pole gap as dividend. Use the excess as divisor and divide; this gives the distance from island to pole.`,note:`The same divisor must work in both procedures. Height needs the extra pole height; distance does not.`,words:[[`前表卻行`,`qián biǎo què xíng`,`the retreat from the front pole`],[`乘`,`chéng`,`multiply`],[`除之`,`chú zhī`,`divide it`]],page:11,location:`Left leaf, middle main-text columns`},{title:`Check the worked arithmetic`,voice:`Commentary attributed to Li Chunfeng and colleagues`,chinese:`前去表乘表間，得一十二萬三千步，以相多四步為法，除之，得三萬七百五十步。`,english:`Multiplying the front retreat by the pole gap gives 123,000 bu. Divide using the excess of four bu as divisor: the result is 30,750 bu.`,note:`The numerical commentary itself uses four here. The written calculation keeps the historical unit labels; our modern dimensional analysis treats the product as bu squared, divided by bu.`,words:[[`一十二萬三千`,`yī shí èr wàn sān qiān`,`123,000`],[`四步`,`sì bù`,`four bu`],[`三萬七百五十`,`sān wàn qī bǎi wǔ shí`,`30,750`]],page:11,location:`Left leaf, last commentary columns; continues on the next opening`},{title:`Acknowledge the later witness`,voice:`Qing bibliographic preface`,chinese:`書世無傳本，惟散見永樂大典中，今裒而輯之。`,english:`No transmitted copy of the book survives in circulation; it is found only in scattered places in the Yongle Encyclopedia. Now these have been gathered and compiled.`,note:`This preface explains the Qing compilation. The retained Waseda book is catalogued as 1777; its preface is dated 1775. These are later witnesses to an ancient work, not a third-century manuscript.`,words:[[`傳本`,`chuán běn`,`a transmitted copy`],[`永樂大典`,`Yǒnglè dàdiǎn`,`the Yongle Encyclopedia`],[`輯`,`jí`,`to collect and compile`]],page:9,location:`Left leaf, first columns on the right`}],a=[`Record the observations`,`Form the dividend`,`Choose the divisor`,`Divide`,`Add the pole height`,`Find the distance`,`Check both sightings`],o=e=>String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]??e);function s(e){let t=i[e];if(!t)throw RangeError(`Unknown reading.`);return`<p class="eyebrow">${o(t.voice)}</p><h3>${o(t.title)}</h3><p class="chinese" lang="zh-Hant">${o(t.chinese)}</p><p class="translation">${o(t.english)}</p><p>${o(t.note)}</p><dl class="words">${t.words.map(([e,t,n])=>`<div><dt lang="zh-Hant">${o(e)}</dt><dd><span>${o(t)}</span> ${o(n)}</dd></div>`).join(``)}</dl><p class="source-location">Opening ${t.page} · ${o(t.location)}</p>`}function c(e,t=1){let n=BigInt(e),r=BigInt(t);if(!r)throw RangeError(`A divisor cannot be zero.`);r<0n&&(n=-n,r=-r);let i=n<0n?-n:n,a=r;for(;a;)[i,a]=[a,i%a];return{n:n/i,d:r/i}}var l=(e,t)=>c(e.n*t.d+t.n*e.d,e.d*t.d),u=(e,t)=>c(e.n*t.d-t.n*e.d,e.d*t.d),d=(e,t)=>c(e.n*t.n,e.d*t.d),f=(e,t)=>c(e.n*t.d,e.d*t.n),p=e=>Number(e.n)/Number(e.d),m=e=>e.d===1n?String(e.n):`${e.n}/${e.d}`;c(0);function h(e,t){if(t.n===0n)return null;let n=l(e.h,f(d(e.h,e.s),t)),r=f(d(e.a,e.s),t),i=f(d(e.h,l(e.a,r)),e.a),a=f(d(e.h,l(l(e.s,e.b),r)),e.b);return{divisor:t,height:n,distance:r,front:i,rear:a,frontResidual:u(n,i),rearResidual:u(n,a)}}function g(e){let t=u(e.b,e.a);return{delta:t,kind:t.n>0n?`forward`:t.n===0n?`parallel`:`behind`,difference:h(e,t),gap:h(e,e.s)}}function _(e,t){if(t.n<0n)return{kind:`invalid`,explanation:`The half-width must be nonnegative.`};let n=u(e.a,t),r=l(e.a,t),i=u(e.b,t),a=l(e.b,t);if(n.n<=0n||i.n<=0n)return{kind:`invalid`,explanation:`An allowed setback reaches zero or less. Positive setbacks are required; no interval has been clipped.`};let o=u(i,r),s=u(a,n);if(s.n<=0n)return{kind:`none`,explanation:`No allowed pair has a larger rear setback. None gives an island in front of the poles under these assumptions.`};let c=h({...e,a:n,b:a},s);if(!c)throw Error(`Positive maximum difference required.`);if(o.n<=0n)return{kind:`unbounded`,lowH:c.height,lowD:c.distance,deltaLow:o,deltaHigh:s};let d=h({...e,a:r,b:i},o);if(!d)throw Error(`Positive minimum difference required.`);return{kind:`bounded`,lowH:c.height,lowD:c.distance,highH:d.height,highD:d.distance,deltaLow:o,deltaHigh:s}}var v={pole:20,gap:4e3,front:492,rear:508,error:0,choice:`difference`,step:0,read:0,page:10},y={...v,pole:12,gap:48,front:40,rear:56},b=e=>({h:c(e.pole,4),s:c(e.gap,4),a:c(e.front,4),b:c(e.rear,4)}),x={pole:[1,400],gap:[1,4e4],front:[1,8e3],rear:[1,8e3],error:[0,64]};function S(e,t,n){if(!/^(?:0|[1-9]\d{0,5})(?:\.(?:0|00|25|5|50|75))?$/.test(e))return null;let r=Number(e)*4;return Number.isInteger(r)&&r>=t&&r<=n?r:null}function C(e){return new URLSearchParams(Object.entries(e).map(([e,t])=>[e,String(e in x?Number(t)/4:t)])).toString()}function w(e){let t=new URLSearchParams(e),n={...v};try{let e=new Set;for(let[r,i]of t){if(e.has(r)||!Object.hasOwn(n,r))throw Error();if(e.add(r),Object.hasOwn(x,r)){let e=r,[t,a]=x[e],o=S(i,t,a);if(o===null)throw Error();n[e]=o}else if(r===`choice`){if(i!==`difference`&&i!==`gap`)throw Error();n.choice=i}else{if(!/^\d{1,2}$/.test(i))throw Error();let e=Number(i);if(r===`step`&&e<=6||r===`read`&&e<=9||r===`page`&&e>=9&&e<=13)n[r]=e;else throw Error()}}return{state:n,warning:``}}catch{return{state:{...v},warning:`This address contains an invalid or repeated field. The complete source record has been restored; no partial record was used.`}}}var T=`<style>text{font-family:Atkinson,Arial,sans-serif;font-size:16px;fill:#203b43}.ground{stroke:#899a9c;stroke-width:1}.front{stroke:#007d85;fill:none;stroke-width:2.5}.rear{stroke:#ad4d2c;fill:none;stroke-width:2.5;stroke-dasharray:9 5}.pole{stroke:#203b43;stroke-width:3}.point{fill:#203b43}.ghost{fill:none;stroke:#687f86;stroke-width:1.5;stroke-dasharray:3 4}.dim{stroke:#637c80;fill:none;stroke-width:1}.small{font-size:13px}.label{font-size:15px}.candidate{stroke:#203b43;fill:none;stroke-width:2}.value{font-weight:700}</style>`;function E(e,t,n,r){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${n}" role="img" aria-label="${o(e)}"><title>${o(e)}</title><desc>${o(t)}</desc>${T}<rect width="1000" height="${n}" fill="#f3f6f3"/>${r}</svg>`}function D(e){let t=b(e),n=g(t),r=n[e.choice],i=p(t.h),a=p(t.s),s=p(t.a),c=p(t.b),l=n.kind===`forward`?n.difference:null,u=[l,r].filter(e=>!!e&&p(e.distance)>0&&p(e.height)>0),d=Math.max(s,a,...u.map(e=>p(e.distance))),f=Math.max(i,...u.map(e=>p(e.height))),h=-d*1.03,_=a+c+(d+a+c)*.03,v=Math.min(890/(_-h),310/f),y=60+f*v,x=Math.max(190,y+95),S=e=>55+(e-h)*v,C=e=>y-e*v,w=e=>i*(s-e)/s,T=e=>i*(a+c-e)/c,D=l?-p(l.distance):-Math.min(d,2*(a+c)),O=`<text x="28" y="27" class="small">WHOLE SURVEY · SAME SCALE IN BOTH DIRECTIONS · ALL LENGTHS IN BU</text><line class="ground" x1="28" y1="${y}" x2="972" y2="${y}"/>`,k=Math.max(D,s-(f+i*.1)*s/i),A=Math.max(D,a+c-(f+i*.1)*c/i);O+=`<line class="front" x1="${S(k)}" y1="${C(w(k))}" x2="${S(s)}" y2="${y}"/><line class="rear" x1="${S(A)}" y1="${C(T(A))}" x2="${S(a+c)}" y2="${y}"/>`;for(let e of[0,a])O+=`<line class="pole" x1="${S(e)}" y1="${y}" x2="${S(e)}" y2="${C(i)}"/><circle class="point" cx="${S(e)}" cy="${C(i)}" r="3"/>`;if(O+=`<text x="${Math.min(S(0),760)}" y="${y+31}" class="small">Front pole → rear pole →</text><text x="${Math.min(S(0),760)}" y="${y+49}" class="small">Poles h=${o(m(t.h))}; gap s=${o(m(t.s))}</text>`,l&&(O+=`<path class="ghost" d="M${S(-p(l.distance))},${y}V${C(p(l.height))}"/><circle class="ghost" cx="${S(-p(l.distance))}" cy="${C(p(l.height))}" r="6"/>`),r&&p(r.height)>0&&p(r.distance)>0){let e=S(-p(r.distance)),t=C(p(r.height));O+=`<path class="candidate" d="M${e},${y}V${t}" data-height="${o(m(r.height))}" data-distance="${o(m(r.distance))}"/><path class="candidate" d="M${e-7},${t-7}l14,14m-14,0l14,-14"/><text x="${Math.min(Math.max(e+12,45),760)}" y="${Math.max(t-14,51)}" class="label">Candidate peak ×</text>`}return O+=`<text x="28" y="${x-15}" class="small">Circles locate pole tips even when a pole is smaller than a pixel. The target is a point; no island width is assumed.</text>`,E(`Two independent observations and a candidate island peak`,`The solid teal ray passes through the front pole and its ground eye. The dashed rust ray passes through the rear pole and its ground eye. Both use the same horizontal and vertical scale. A cross marks the calculated candidate; a dotted line marks the forward intersection when it exists.`,x,O)}function O(e){let t=b(e),n=p(t.a),r=p(t.b),i=740/Math.max(n,r),a=e=>140+e*i,s=`<text x="28" y="27" class="small">SETBACK RULERS · EACH STARTS AT ITS OWN POLE · ONE COMMON SCALE</text><text x="28" y="76">Front</text><line class="front" x1="140" y1="70" x2="${a(n)}" y2="70"/><circle cx="${a(n)}" cy="70" r="5" fill="#007d85"/><text x="${a(n)+12}" y="76">${o(m(t.a))}</text><text x="28" y="123">Rear</text><line class="rear" x1="140" y1="117" x2="${a(r)}" y2="117"/><circle cx="${a(r)}" cy="117" r="5" fill="#ad4d2c"/><text x="${a(r)+12}" y="123">${o(m(t.b))}</text><path class="dim" d="M${a(n)},140v20m0,-10H${a(r)}m0,-10v20"/><text x="140" y="188">Rear − front = ${o(m(g(t).delta))} bu. This is not the pole gap.</text>`;return E(`Compare the two retreats on aligned rulers`,`Front retreat ${m(t.a)} bu and rear retreat ${m(t.b)} bu are shown at one common scale, each measured from its own pole. Their difference is ${m(g(t).delta)} bu.`,212,s)}var k=`MIT License

Copyright (c) 2026 Anton Soloviev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;function A(e){return`${o(m(e))} bu`}function j(e){let t=b(e),n=g(t),r=n[e.choice],i=e.choice===`difference`?n.delta:t.s,s=[`<p>Keep h = ${A(t.h)}, s = ${A(t.s)}, a = ${A(t.a)} and b = ${A(t.b)}. Each retreat belongs to its own pole.</p>`,`<p class="formula">${o(m(t.h))} × ${o(m(t.s))} = ${o(m(d(t.h,t.s)))}</p><p>Pole height × pole gap. This product is in bu²: it is the dividend, <span lang="zh-Hant">實</span>.</p>`,`<p class="formula">${e.choice===`difference`?`${o(m(t.b))} − ${o(m(t.a))}`:`Pole gap`} = ${o(m(i))} bu</p><p>${e.choice===`difference`?`The editorial note uses the difference between the two retreats.`:`The received commentary's wording uses the distance between poles. Carry it through and check it.`} This is the proposed divisor, <span lang="zh-Hant">法</span>.</p>`,r?`<p class="formula">${o(m(d(t.h,t.s)))} ÷ ${o(m(i))} = ${o(m(u(r.height,t.h)))}</p><p>The quotient measures the candidate height above the pole tip.</p>`:`<p>Division is undefined: the proposed divisor is zero. No quotient has been invented.</p>`,r?`<p class="formula">H = ${o(m(r.height))} bu</p><p>Add the pole height to the quotient. ${P(e)&&e.choice===`difference`?`This is 4 li and 55 bu, the source's answer.`:`This is a candidate. It still needs the observations.`}</p>`:`<p>No candidate height: division by zero is undefined.</p>`,r?`<p class="formula">D = ${o(m(t.a))} × ${o(m(t.s))} ÷ ${o(m(i))}<br />= ${o(m(r.distance))} bu</p><p>Distance is measured from the front pole. ${P(e)&&e.choice===`difference`?`This is 102 li and 150 bu.`:`The source's distance procedure uses the same divisor.`}</p>`:`<p>No candidate distance: division by zero is undefined.</p>`,`<p>Put the candidate peak at x = −D. Ask each observation separately what height its line has there. A consistent peak must match both.</p>`];return`<h3>${o(a[e.step])}</h3>${s[e.step]}`}function M(e){let t=g(b(e)),n=t[e.choice];if(e.step<6)return`<p class="check-data">The two sighting checks appear after the distance operation.</p>`;let r=``;if(t.kind===`parallel`&&(r=`<p class="check bad"><strong>The observations are parallel.</strong>Equal positive retreats give equal slopes but different line heights. There is no finite common peak. The zero difference remains visible.</p>`),t.kind===`behind`&&(r=`<p class="check bad"><strong>Outside the forward-island setup.</strong>The rear retreat is shorter. The line intersection is behind the front pole and below pole height; it is not a forward island.</p>`),!n)return`${r}<p>No candidate exists for the selected zero divisor.</p>`;let i=n.frontResidual.n===0n&&n.rearResidual.n===0n;return`${r}<p class="check ${i?`good`:`bad`}"><strong>${i?`Both sightings agree.`:`The second sighting rejects this candidate.`}</strong> ${i&&t.kind!==`forward`?`The algebraic intersection is outside the source's forward geometry.`:i?`The peak fits the two independent observations.`:`The first sighting alone would have accepted it.`}</p><table class="data-table"><caption class="check-data">At the candidate distance D = ${A(n.distance)}</caption><thead><tr><th scope="col">Height</th><th scope="col">Exact bu</th></tr></thead><tbody><tr><th scope="row">Candidate</th><td>${o(m(n.height))}</td></tr><tr><th scope="row">Front line</th><td>${o(m(n.front))}</td></tr><tr><th scope="row">Rear line</th><td>${o(m(n.rear))}</td></tr><tr><th scope="row">Candidate − rear</th><td>${o(m(n.rearResidual))}</td></tr></tbody></table>${t.delta.n*b(e).s.d===b(e).s.n*t.delta.d?`<p class="check-data">For this record the two proposed divisors happen to be equal. Both choices therefore give the same result.</p>`:``}`}function N(e){let t=_(b(e),c(e.error,4));if(t.kind===`invalid`||t.kind===`none`)return`<h3>${t.kind===`invalid`?`Outside the interval model`:`No forward island in this interval`}</h3><p>${o(t.explanation)}</p>`;let n=t.kind===`bounded`?A(t.highH):`No finite upper bound`,r=t.kind===`bounded`?A(t.highD):`No finite upper bound`;return`<p class="eyebrow">Allowed retreat difference</p><p class="formula">${o(m(t.deltaLow))} to ${o(m(t.deltaHigh))} bu</p><h3>${t.kind===`bounded`?`A bounded family of islands`:`No finite upper bound`}</h3><table class="data-table"><thead><tr><th scope="col">Quantity</th><th scope="col">Smallest</th><th scope="col">Largest</th></tr></thead><tbody><tr><th scope="row">Height H</th><td>${A(t.lowH)}</td><td>${n}</td></tr><tr><th scope="row">Distance D</th><td>${A(t.lowD)}</td><td>${r}</td></tr></tbody></table><p>${t.kind===`bounded`?`Both extrema are attained: smallest at the shortest front / longest rear retreat; largest at the longest front / shortest rear retreat.`:`Allowed forward cases approach a zero positive retreat difference. Height and distance grow without limit. Other allowed pairs may be parallel or outside the forward setup; none has been silently removed from the record.`}</p><p class="source-location">These are exact interval bounds under the modern model, not a confidence interval. The front and rear retreats are allowed to vary independently.</p>`}function P(e){return e.pole===20&&e.gap===4e3&&e.front===492&&e.rear===508}var ee=`p {
  overflow-wrap: anywhere;
}
* {
  box-sizing: border-box;
}
body {
  font:
    18px / 1.6 Atkinson,
    Haidao,
    sans-serif;
  color: #203b43;
  background: #f3f6f3;
  max-width: 1000px;
  padding: 2rem;
  margin: auto;
}
h1 {
  font-size: 2.7rem;
  line-height: 1.1;
}
h2 {
  font-size: 1.8rem;
  line-height: 1.2;
}
h3 {
  font-size: 1.3rem;
}
.eyebrow {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}
.chinese {
  font:
    1.5rem / 1.9 Haidao,
    sans-serif;
}
.translation {
  font-size: 1.15rem;
}
a {
  color: #006c74;
}
section {
  border-top: 1px solid #a5bab1;
  padding-block: 1.5rem;
  margin-top: 1rem;
}
svg,
img {
  max-width: 100%;
  height: auto;
}
svg {
  display: block;
  width: 100%;
}
.source img {
  display: block;
  width: 100%;
}
.source-location {
  font-size: 0.8rem;
}
.words > div {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 1rem;
  border-top: 1px solid #bdcdcb;
  padding: 0.6rem 0;
}
.words dt {
  font-family: Haidao, sans-serif;
}
.words dd {
  margin: 0;
}
.words dd span {
  display: block;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table td,
.data-table th {
  border-bottom: 1px solid #bdcdcb;
  padding: 0.6rem;
  text-align: left;
}
.formula {
  font-size: 1.4rem;
  overflow-wrap: anywhere;
}
.worksheet p {
  min-height: 3rem;
  border-bottom: 1px solid #bdcdcb;
}
pre {
  font-family: Atkinson, Haidao, sans-serif;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 0.7rem;
  line-height: 1.5;
}
.good {
  color: #005b62;
}
.bad {
  color: #853414;
}
@media (max-width: 500px) {
  body {
    padding: 1rem;
    font-size: 16px;
  }
  .words > div {
    grid-template-columns: 5rem 1fr;
    gap: 0.5rem;
  }
}
@media print {
  @page {
    size: A4;
    margin: 16mm;
  }
  body {
    font-size: 10.5pt;
    padding: 0;
    max-width: none;
  }
  h1 {
    font-size: 25pt;
  }
  h2 {
    font-size: 18pt;
  }
  .chinese {
    font-size: 14pt;
  }
  section.reading,
  .source,
  .worksheet {
    break-before: page;
  }
  section.reading {
    break-inside: avoid;
  }
  .source img {
    max-height: 225mm;
    object-fit: contain;
  }
  .source {
    break-inside: avoid;
  }
  .formula {
    font-size: 14pt;
  }
  pre {
    font-size: 7pt;
  }
  svg {
    break-inside: avoid;
  }
}
`;function F(t){let n=b(t),r=g(n),i=_(n,c(t.error,4)),o=[[`field`,`exact_value`,`unit`,`meaning`],[`model`,`Haidao first problem`,``,`Modern exact coordinate model; no physical survey claimed`],[`operator_stage`,t.step,`0-6`,a[t.step]??``],[`chosen_divisor`,t.choice,``,`Complete computed comparisons below are separate from operator progress`],[`pole_height`,m(n.h),`bu`,`h`],[`pole_gap`,m(n.s),`bu`,`s`],[`front_retreat`,m(n.a),`bu`,`a`],[`rear_retreat`,m(n.b),`bu`,`b`],[`retreat_difference`,m(r.delta),`bu`,`b-a`],[`intersection_kind`,r.kind,``,`forward / parallel / behind`],[`setback_half_width`,m(c(t.error,4)),`bu`,`independent allowed intervals; h and s exact`],[`interval_kind`,i.kind,``,`bounded / unbounded / invalid / none`]];for(let e of[`difference`,`gap`]){let t=r[e];for(let n of[`divisor`,`height`,`distance`,`front`,`rear`,`frontResidual`,`rearResidual`])o.push([`${e}_${n}`,t?m(t[n]):`undefined`,`bu`,n===`front`||n===`rear`?`height independently predicted at candidate x=-D`:`complete computed comparison`])}i.kind===`bounded`||i.kind===`unbounded`?o.push([`height_lower`,m(i.lowH),`bu`,`attained`],[`distance_lower`,m(i.lowD),`bu`,`attained`],[`height_upper`,i.kind===`bounded`?m(i.highH):`unbounded`,`bu`,`not a clipped finite estimate`],[`distance_upper`,i.kind===`bounded`?m(i.highD):`unbounded`,`bu`,`not a clipped finite estimate`]):o.push([`interval_explanation`,i.explanation,``,``]),o.push([`address`,`https://antonsoo.github.io/haidao/?${C(t)}`,``,`applied state`],[`source_pdf`,e.pdf,``,`public-domain later witness`],[`source_pdf_sha256`,e.pdfSha256,``,`source identity`]);for(let t of e.assets)o.push([`asset`,t.path,`SHA-256`,t.sha256]);return`${o.map(e=>e.map(e=>`"${String(e).replaceAll(`"`,`""`)}"`).join(`,`)).join(`\r
`)}\r\n`}async function I(e){let[t,i]=await Promise.all([n(`fonts/AtkinsonHyperlegibleNext.ttf`),n(`fonts/Atkinson-OFL.txt`)]),a=r(t);return D(e).replace(`<style>`,`<metadata>${o(JSON.stringify({state:e,units:`bu`,description:`Modern equal-scale model of Haidao problem 1`,license:k,fontLicense:new TextDecoder().decode(i)}))}</metadata><style>@font-face{font-family:Atkinson;src:url(data:font/ttf;base64,${a}) format('truetype');font-weight:200 800}`)}async function L(t){let c=await Promise.all(e.assets.map(async e=>[e.path,await n(e.path)])),l=new Map(c),u=e=>{let t=l.get(e);if(!t)throw Error(`Missing ${e}`);return t},d=e=>new TextDecoder().decode(u(e)),f=r(u(`fonts/AtkinsonHyperlegibleNext.ttf`)),p=r(u(`fonts/HaidaoCJK.woff2`)),m=[9,10,11,12,13].map(t=>`<section class="source"><h2>Whole opening ${t}</h2><img alt="Complete Waseda photographed opening ${t}, without crop" src="data:image/jpeg;base64,${r(u(`sources/waseda-${String(t).padStart(2,`0`)}.jpg`))}"/><p>PDF page ${t} · ${o(e.witness)}</p></section>`).join(``);return`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Haidao — a survey and reading record</title>
<style>@font-face{font-family:Atkinson;src:url(data:font/ttf;base64,${f}) format('truetype');font-weight:200 800}@font-face{font-family:Haidao;src:url(data:font/woff2;base64,${p}) format('woff2')}${ee}</style>
</head>
<body>
<p class="eyebrow">Haidao · Sea Island Mathematical Manual · Problem 1</p>
<h1>Check the second sighting.</h1>
<p>Applied record saved at operation ${t.step} of 6: <strong>${o(a[t.step])}</strong>. The complete calculated comparisons below are provided for inspection; they do not assert the operator finished the recipe.</p>
<p>
<a href="https://antonsoo.github.io/haidao/?${o(C(t))}">Reopen this applied state</a> · All lengths in bu; 6 chi = 1 bu, 10 chi = 1 zhang, 300 bu = 1 li. No conversion to metres.</p>
<section>
<h2>Observations and current operation</h2>
<p>h = ${t.pole/4}; s = ${t.gap/4}; a = ${t.front/4}; b = ${t.rear/4} bu. Proposed divisor: ${o(t.choice)}.</p>${D(t)}${O(t)}${j(t)}${M({...t,step:6})}<h3>Modern setback intervals</h3>
<p>Each retreat independently ±${t.error/4} bu; h and s exact.</p>${N(t)}</section>
<section>
<h2>Why one observation is insufficient</h2>
<p>Front pole (0,h), rear pole (s,h), front ground eye (a,0), rear ground eye (s+b,0), island peak (−D,H). Front line: y=h(a−x)/a. Rear line: y=h(s+b−x)/b. Equating them gives D(b−a)=as and H=h+hs/(b−a).</p>
<p>A recipe with any nonzero divisor f produces D=as/f and H=h+hs/f, which always fit the front observation. The rear observation fits only if f=b−a. Equal retreats give parallel lines. A shorter rear retreat puts the intersection outside the forward-island setup. This is modern coordinate analysis, not a transcription of Liu Hui's proof.</p>
<p>This model assumes a level common baseline, equal vertical poles, point-like tips and target, and ground eyes. The chosen interval varies only setbacks; it does not include terrain, pole or eye-height errors, refraction, or any probability distribution.</p>
</section>${i.map((e,t)=>`<section class="reading" id="reading-${t}">
<p class="eyebrow">Reading ${t+1} of 10 · selected clause</p>${s(t)}</section>`).join(``)}<section>
<h2>About the witness and renderings</h2>
<p>${o(e.witness)}. The Qing preface describes compilation from scattered material in the Yongle Encyclopedia. This is a later witness to an ancient work, not a third-century manuscript. The received commentary and the small editorial correction have separate voices.</p>
<p>Chinese clauses were transcribed for this edition from the retained photographs. Modern punctuation is supplied; English renderings and the coordinate model are new. Modern Mandarin pinyin is a reading aid, not reconstructed ancient pronunciation. The text is excerpted; this is not a complete critical edition. The source exercise is not an identified physical expedition.</p>
<p>
<a href="${o(e.commons)}">Scan and catalogue</a> · <a href="${o(e.pdf)}">Complete source PDF</a> · <a href="https://doi.org/10.1016/0315-0860(86)90024-8">Ang Tian Se and Frank J. Swetz (1986), historical study</a>. That study's translation and figures are not reproduced.</p>
<p>${o(e.description)}</p>
</section>${m}<section class="worksheet">
<h2>Work the survey again</h2>
<p>Record h, s, a and b:</p>
<p>Compute the height dividend hs:</p>
<p>What is 相多? Give a proposed divisor f:</p>
<p>Compute H = h + hs/f and D = as/f:</p>
<p>Front line at x = −D; candidate minus front:</p>
<p>Rear line at x = −D; candidate minus rear:</p>
<p>Choose allowed retreat intervals. Can b − a approach zero?</p>
</section>
<section>
<h2>Exact machine-readable record</h2>
<pre id="exact-record">${o(F(t))}</pre>
<h2>Source identities</h2>
<pre id="source-manifest">${o(JSON.stringify(e,null,2))}</pre>
<h2>Licenses</h2>
<p>Whole photographs: public domain. Original app, diagrams, selected transcription and new English:</p>
<pre>${o(k)}</pre>
<h3>Atkinson Hyperlegible Next</h3>
<pre>${o(d(`fonts/Atkinson-OFL.txt`))}</pre>
<h3>Haidao CJK, subset of Noto Sans CJK</h3>
<pre>${o(d(`fonts/Noto-NOTICE.txt`))}</pre>
<pre>${o(d(`fonts/Noto-OFL.txt`))}</pre>
<pre>${o(d(`fonts/provenance.json`))}</pre>
<p>This complete HTML has no script and needs no network to read or print.</p>
</section>
</body>
</html>`}function R(e,t,n){let r=URL.createObjectURL(new Blob([e],{type:t})),i=document.createElement(`a`);i.href=r,i.download=n,i.click(),setTimeout(()=>URL.revokeObjectURL(r),1e4)}function z(e){let t=document.getElementById(e);if(!t)throw Error(`Missing ${e}`);return t}var B=w(location.search),V=B.state,H,U=0,W=``,G=0;z(`address-warning`).textContent=B.warning;var K=z(`observations`);function q(){for(let e of[`pole`,`gap`,`front`,`rear`])K.elements.namedItem(e).value=String(V[e]/4);z(`record-status`).textContent=P(V)?`Applied: the source exercise. The diagram uses these four observations.`:`Applied: a modern comparison record. The source text retains its original numbers.`}function te(e=!0){let t=`${location.pathname}?${C(V)}${location.hash}`;e?history.pushState(null,``,t):history.replaceState(null,``,t)}function J(e,t=!0){V={...V,...e},te(t),Y()}async function ne(e){H?.abort(),H=new AbortController;let t=++U,r=z(`source-frame`);r.replaceChildren(),W&&URL.revokeObjectURL(W),W=``,z(`source-status`).textContent=`Loading and checking whole opening ${e}…`;try{let i=await n(`sources/waseda-${String(e).padStart(2,`0`)}.jpg`,H.signal);if(t!==U)return;let a=URL.createObjectURL(new Blob([i],{type:`image/jpeg`}));W=a;let o=new Image;if(o.alt=`Complete Waseda source opening ${e}: two photographed leaves and margins`,o.src=a,await o.decode(),t!==U){URL.revokeObjectURL(a);return}r.replaceChildren(o),r.scrollTo(0,0),z(`source-status`).textContent=`Opening ${e} · complete photograph · SHA-256 identity checked.`}catch(e){if(t!==U)return;z(`source-status`).textContent=`Opening unavailable. ${e instanceof Error?e.message:`Retry the source.`} Select another opening and return to retry.`}}function Y(){z(`overview`).innerHTML=D(V),z(`retreats`).innerHTML=O(V);let e=g(b(V));for(let t of[`difference`,`gap`]){let n=z(`choose-${t}`);n.setAttribute(`aria-pressed`,String(V.choice===t)),n.innerHTML=`${t===`difference`?`Retreat difference`:`Pole gap`}<strong>${o(m(t===`difference`?e.delta:b(V).s))} bu</strong><span lang="zh-Hant">${t===`difference`?`相多`:`表間`}</span> · ${t===`difference`?`editorial note`:`received wording`}`}z(`stage-name`).textContent=`Operation ${V.step} of 6`,z(`calculation`).innerHTML=j(V),z(`checks`).innerHTML=M(V),z(`previous-step`).disabled=V.step===0,z(`next-step`).disabled=V.step===6,z(`next-step`).textContent=V.step===5?`Check both sightings`:`Next operation`,z(`reading-choice`).value=String(V.read),z(`passage`).innerHTML=s(V.read),z(`previous-reading`).disabled=V.read===0,z(`next-reading`).disabled=V.read===9,z(`source-page`).value=String(V.page),V.page!==G&&(G=V.page,ne(V.page)),z(`error-width`).value=String(V.error),z(`error-value`).value=String(V.error/4),z(`bounds`).innerHTML=N(V);for(let e of document.querySelectorAll(`[data-error]`))e.setAttribute(`aria-pressed`,String(Number(e.dataset.error)===V.error));for(let[e,t]of[[`source-preset`,v],[`near-preset`,y],[`parallel-preset`,{...v,rear:v.front}]])z(e).setAttribute(`aria-pressed`,String([`pole`,`gap`,`front`,`rear`].every(e=>V[e]===t[e])))}z(`divisors`).innerHTML=`<button type="button" id="choose-difference"></button><button type="button" id="choose-gap"></button>`;for(let e of[`difference`,`gap`])z(`choose-${e}`).addEventListener(`click`,()=>J({choice:e}));for(let[e,t]of[[`source-preset`,v],[`near-preset`,y],[`parallel-preset`,{...v,rear:v.front}]])z(e).addEventListener(`click`,()=>{J({...t,read:V.read,page:V.page}),q()});K.addEventListener(`input`,()=>{z(`record-status`).textContent=`Unapplied edits. The diagrams and downloads still use the last applied record.`}),K.addEventListener(`submit`,e=>{e.preventDefault();let t={};for(let e of[`pole`,`gap`,`front`,`rear`]){let n=K.elements.namedItem(e),r=S(n.value,x[e][0],x[e][1]);if(r===null){z(`record-status`).textContent=`${e}: use positive quarter-bu increments within the displayed bounds. No observations were changed.`,n.focus();return}t[e]=r}J({...t,step:0}),q()}),z(`previous-step`).addEventListener(`click`,()=>J({step:Math.max(0,V.step-1)})),z(`next-step`).addEventListener(`click`,()=>J({step:Math.min(6,V.step+1)})),z(`reset-steps`).addEventListener(`click`,()=>J({step:0})),z(`reading-choice`).innerHTML=i.map((e,t)=>`<option value="${t}">${t+1}. ${o(e.title)}</option>`).join(``),z(`reading-choice`).addEventListener(`change`,()=>J({read:Number(z(`reading-choice`).value)})),z(`previous-reading`).addEventListener(`click`,()=>J({read:Math.max(0,V.read-1)})),z(`next-reading`).addEventListener(`click`,()=>J({read:Math.min(9,V.read+1)})),z(`read-opening`).addEventListener(`click`,()=>J({page:i[V.read]?.page??10})),z(`source-page`).addEventListener(`change`,()=>J({page:Number(z(`source-page`).value)})),z(`source-zoom`).addEventListener(`click`,()=>{let e=z(`source-frame`).classList.toggle(`enlarged`);z(`source-zoom`).setAttribute(`aria-pressed`,String(e)),z(`source-zoom`).textContent=e?`Fit whole opening`:`Enlarge source`}),z(`source-provenance`).textContent=`${e.description} Complete PDF SHA-256: ${e.pdfSha256}.`,z(`error-width`).addEventListener(`input`,()=>J({error:Number(z(`error-width`).value)},!1));for(let e of document.querySelectorAll(`[data-error]`))e.addEventListener(`click`,()=>J({error:Number(e.dataset.error)}));async function X(e,t,n,r){let i={...V},o=z(e);o.disabled=!0,z(`save-status`).textContent=`Preparing the applied record; source assets must pass their identity checks…`;try{R(await r(i),t,n),z(`save-status`).textContent=`Saved ${n} for the record at operation ${i.step}: ${a[i.step]}.`}catch(e){z(`save-status`).textContent=`Nothing was downloaded. ${e instanceof Error?e.message:`Unable to prepare the complete file.`}`}finally{o.disabled=!1}}z(`save-html`).addEventListener(`click`,()=>void X(`save-html`,`text/html;charset=utf-8`,`haidao-reading.html`,L)),z(`save-csv`).addEventListener(`click`,()=>void X(`save-csv`,`text/csv;charset=utf-8`,`haidao-record.csv`,F)),z(`save-svg`).addEventListener(`click`,()=>void X(`save-svg`,`image/svg+xml;charset=utf-8`,`haidao-survey.svg`,I)),z(`share`).addEventListener(`click`,async()=>{let e=new URL(`?${C(V)}${location.hash}`,location.href).href;try{await navigator.clipboard.writeText(e),z(`save-status`).textContent=`Copied the applied observations, divisor, operation, reading, source opening and interval to this address.`}catch{z(`save-status`).textContent=`Copy this address: ${e}`}}),z(`print`).addEventListener(`click`,()=>window.print()),window.addEventListener(`popstate`,()=>{let e=w(location.search);V=e.state,z(`address-warning`).textContent=e.warning,q(),Y()});var Z=0,Q=!1;async function $(){let e=++Z,t=z(`offline-status`),n=navigator.serviceWorker?.controller;if(!n)t.textContent=`The complete offline edition is not controlling this page yet. Keep this page open online, then check again.`;else{t.textContent=`Checking the identity of every file in the offline edition…`;try{let r=await new Promise((e,t)=>{let r=new MessageChannel,i=setTimeout(()=>{r.port1.close(),t(Error(`Offline inventory timed out.`))},15e3);r.port1.onmessage=t=>{clearTimeout(i),r.port1.close(),e(t.data)},n.postMessage({type:`inventory`},[r.port2])});if(e!==Z)return;if(n!==navigator.serviceWorker.controller||r.edition!==`41c3c2a20e16c095c8f4`){t.textContent=`This page and its offline controller are different editions. Wait for the complete update, then reload and check again.`;return}Q=!r.ready,z(`offline-check`).textContent=Q?`Rebuild complete offline edition`:`Check complete offline edition`,t.textContent=r.ready?`Complete offline edition ${r.edition}: all ${r.files} files checked, including all five source openings. Ready for an offline reload.`:`Offline edition ${r.edition} is incomplete (${r.missing.length} missing or changed files). Keep an online connection and use Rebuild complete offline edition.`}catch(e){t.textContent=e instanceof Error?e.message:`Offline edition could not be checked.`}}}async function re(){let e=navigator.serviceWorker.controller;if(!e){await $();return}let t=z(`offline-check`);t.disabled=!0,z(`offline-status`).textContent=`Fetching and checking every edition file before rebuilding the offline copy…`;try{await new Promise((t,n)=>{let r=new MessageChannel,i=setTimeout(()=>{r.port1.close(),n(Error(`Rebuilding timed out; no readiness claim has been made. Check again after reconnecting.`))},45e3);r.port1.onmessage=a=>{clearTimeout(i),r.port1.close(),a.data.repaired&&a.data.edition===`41c3c2a20e16c095c8f4`&&e===navigator.serviceWorker.controller?t():n(Error(a.data.error??`The page and offline controller differ. Reload the current page before rebuilding.`))},e.postMessage({type:`repair`},[r.port2])}),await $()}catch(e){z(`offline-status`).textContent=e instanceof Error?e.message:`The offline copy could not be rebuilt.`}finally{t.disabled=!1}}z(`offline-check`).addEventListener(`click`,()=>void(Q?re():$())),`serviceWorker`in navigator?(navigator.serviceWorker.addEventListener(`controllerchange`,()=>void $()),navigator.serviceWorker.register(t(`sw.js`),{scope:`/haidao/`}).then(()=>$()).catch(()=>{z(`offline-status`).textContent=`The complete offline edition could not be installed. The online lesson remains available; retry with a complete connection.`})):z(`offline-status`).textContent=`Offline installation is available in the built edition.`,q(),Y();for(let e of document.querySelectorAll(`[data-diagram]`)){let t=e.textContent;e.addEventListener(`click`,()=>{let n=z(e.dataset.diagram??`overview-frame`).classList.toggle(`enlarged`);e.setAttribute(`aria-pressed`,String(n)),e.textContent=n?`Fit diagram`:t})}