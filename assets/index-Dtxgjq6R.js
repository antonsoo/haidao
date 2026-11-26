(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`6691e535fdf0ccc5a8df`,t={witness:`Waseda University Library ni02 00649; catalogue date 1777; preface dated 1775`,description:`Five complete photographed openings, PDF pages 9-13. Rendered by Poppler 24.02.0, longest edge 3600 pixels, JPEG quality 88; no crop or retouch.`,pdf:`https://upload.wikimedia.org/wikipedia/commons/1/10/WUL-ni02_00649_%E6%B5%B7%E5%B3%B6%E7%AE%97%E7%B6%93.pdf`,pdfSha256:`f187bc664284f3b60742641fb2e0afd69ce9f3342819d4aab358b771372edd0c`,commons:`https://commons.wikimedia.org/w/index.php?curid=99007136`,license:`Public domain; Commons PD-old / public domain mark. Original app, diagrams, transcription and English: PolyForm Noncommercial. Fonts: separate complete OFL notices.`,assets:[{path:`sources/waseda-09.jpg`,bytes:944202,sha256:`bded88b54aad386512ddc06b8e28c5a37f6ae490558646013d597aaca9f27f43`},{path:`sources/waseda-10.jpg`,bytes:796216,sha256:`2e2169694a4bc17830dc8415f5af3681fd2649fdd040c6bd51a36be47edbc3be`},{path:`sources/waseda-11.jpg`,bytes:1018547,sha256:`620dd0b10c6f195385d9c2484cf42bac798d5006e7533fc282febd3f253d2db0`},{path:`sources/waseda-12.jpg`,bytes:982697,sha256:`40b8b9dc5ef1f2e9bb3e8a4218117a15a49d47abe21568f29f47e125fbbada4e`},{path:`sources/waseda-13.jpg`,bytes:1010533,sha256:`f460c01cc2aaba138cc779698996bba9a8b44aec76f20f7f5d17dad382c918c4`},{path:`sources/waseda-metadata.json`,bytes:2294,sha256:`c34ac06a8920c62ea271561180e5ff089bdb06ba5972b5d1b874e91edd9b2341`},{path:`fonts/Atkinson-OFL.txt`,bytes:4431,sha256:`aca6a428580965d2297d1b718042dd427c2a9443ece3b0d02d758e161e0c4030`},{path:`fonts/AtkinsonHyperlegibleNext.ttf`,bytes:114552,sha256:`5a455d1cfa099b601ab70751bb9673e8fe1854dc4500c80e1a220d0d75e31745`},{path:`fonts/HaidaoCJK.woff2`,bytes:44284,sha256:`27a27fb302131881c0f1a600f6b62989a44622748490b36c57f11a7df456edaf`},{path:`fonts/Noto-NOTICE.txt`,bytes:118,sha256:`f0aeeb7b1cf3c018211e235091ad316e184e8d3bdac3922b03dca9598451d1ec`},{path:`fonts/Noto-OFL.txt`,bytes:4301,sha256:`6a73f9541c2de74158c0e7cf6b0a58ef774f5a780bf191f2d7ec9cc53efe2bf2`},{path:`fonts/characters.txt`,bytes:399,sha256:`4ad5a7fbd124841f41e752ab50b23f1563b3ca1dd37c15d45b4bdfdd1960ed4c`},{path:`fonts/provenance.json`,bytes:344,sha256:`ad16696e82aa2e31a8b11d76316245a2c64e4e8a5832042b9289b54a29446664`}]};async function n(e,t,n={}){let r=new AbortController,i=n.signal?AbortSignal.any([n.signal,r.signal]):r.signal,a,o=()=>{clearTimeout(a),a=setTimeout(()=>r.abort(new DOMException(`No data arrived for 15 seconds. Check the connection and retry.`,`TimeoutError`)),15e3)};o();let s;try{let r=await fetch(e,{cache:n.cache??`no-cache`,signal:i});if(!r.ok)throw Error(`Could not load the retained file (${r.status}).`);if(o(),s=r.body?.getReader(),!s)throw Error(`The retained file has no readable body.`);let c=new Uint8Array(t.bytes),l=0;for(n.onProgress?.(0,t.bytes);;){let{done:e,value:r}=await s.read();if(i.throwIfAborted(),e)break;if(o(),l+r.length>t.bytes)throw Error(`The identity check failed: the retained file is larger than expected.`);c.set(r,l),l+=r.length,n.onProgress?.(l,t.bytes)}clearTimeout(a),i.throwIfAborted();let u=Array.from(new Uint8Array(await crypto.subtle.digest(`SHA-256`,c)),e=>e.toString(16).padStart(2,`0`)).join(``);if(l!==t.bytes||u!==t.sha256)throw Error(`The identity check failed for the retained file. Reload or retry with the complete edition.`);i.throwIfAborted();let d=new Headers(r.headers);return d.delete(`content-encoding`),d.set(`content-length`,String(l)),new Response(c,{status:r.status,statusText:r.statusText,headers:d})}catch(e){throw r.abort(e),s&&await s.cancel().catch(()=>{}),i.reason??e}finally{clearTimeout(a),s?.releaseLock()}}function r(e){return new URL(`/haidao/`+e,location.origin).href}async function i(e,i,a){let o=t.assets.find(t=>t.path===e);if(!o)throw Error(`Unknown source asset.`);let s=await n(r(e),o,{signal:i,onProgress:a});return new Uint8Array(await s.arrayBuffer())}function a(e){let t=``;for(let n=0;n<e.length;n+=16384)t+=String.fromCharCode(...e.subarray(n,n+16384));return btoa(t)}var o=[{title:`Place two equal poles`,voice:`Problem attributed to Liu Hui`,chinese:`今有望海島，立兩表齊高三丈，前後相去千步，令後表與前表參相直。`,english:`Suppose an island is to be sighted. Set up two poles of equal height, three zhang, a thousand bu apart, front and rear. Align the rear pole with the front pole.`,note:`The alignment is along the survey direction on the ground. It does not put both pole tips and the island peak on one sight line.`,words:[[`表`,`biǎo`,`a sighting pole`],[`齊高`,`qí gāo`,`equal in height`],[`相去`,`xiāng qù`,`to be separated by a distance`]],page:10,location:`Left leaf, main text, beginning at the right`},{title:`Make the first sighting`,voice:`Problem attributed to Liu Hui`,chinese:`從前表卻行一百二十三步，人目著地，取望島峯，與表末參合。`,english:`Retreat 123 bu from the front pole. With the eye at ground level, sight the island peak so that it lines up with the tip of the pole.`,note:`The eye is at ground level in this idealized exercise. Adding an ordinary standing eye height would change the geometry.`,words:[[`卻行`,`què xíng`,`to move back`],[`著地`,`zhuó dì`,`touching the ground`],[`表末`,`biǎo mò`,`the tip of the pole`]],page:10,location:`Left leaf, middle main-text columns`},{title:`Make the second sighting`,voice:`Problem attributed to Liu Hui`,chinese:`從後表卻行一百二十七步，人目著地，取望島峯，亦與表末參合。`,english:`Retreat 127 bu from the rear pole. With the eye at ground level, sight the island peak; it too lines up with the tip of that pole.`,note:`This is a second eye position and a second pole. The two observations constrain the same peak.`,words:[[`後表`,`hòu biǎo`,`the rear pole`],[`亦`,`yì`,`also`],[`參合`,`cān hé`,`to line up together`]],page:10,location:`Left leaf, middle and left main-text columns`},{title:`Read the stated answers`,voice:`Problem attributed to Liu Hui`,chinese:`問島高及去表各幾何？答曰：島高四里五十五步，去表一百二里一百五十步。`,english:`What are the island's height and its distance from the pole? Answer: the island is four li and 55 bu high; its distance from the pole is 102 li and 150 bu.`,note:`The distance procedure specifies the front pole. At 300 bu per li, these answers are 1,255 bu and 30,750 bu.`,words:[[`幾何`,`jǐ hé`,`how much?`],[`島高`,`dǎo gāo`,`the height of the island`],[`去表`,`qù biǎo`,`distance from the pole`]],page:10,location:`Left leaf, last columns; the answer continues onto opening 11`},{title:`Operate on the numbers`,voice:`Procedure attributed to Liu Hui`,chinese:`術曰：以表高乘表間為實，相多為法，除之。所得加表高，即得島高。`,english:`Procedure: multiply the pole height by the distance between the poles to form the dividend. Use the excess as divisor and divide. Add the pole height to the result; this gives the island's height.`,note:`實 and 法 are calculation roles here: dividend and divisor. The crucial question is what 相多, the excess, refers to.`,words:[[`實`,`shí`,`dividend in this operation`],[`法`,`fǎ`,`divisor in this operation`],[`相多`,`xiāng duō`,`the amount by which one exceeds the other`]],page:11,location:`Right leaf, first main-text columns`},{title:`Try the received wording`,voice:`Commentary attributed to Li Chunfeng and colleagues`,chinese:`二表相去為相多，以為法。`,english:`Use the distance between the two poles as the excess, making it the divisor.`,note:`This is the wording in the received commentary in this printed witness. Try the pole-gap divisor in the calculation. A wrong result can still pass one sighting. This does not establish when or how the wording arose.`,words:[[`二表`,`èr biǎo`,`the two poles`],[`以為`,`yǐ wéi`,`use as`],[`淳風等按`,`Chúnfēng děng àn`,`Chunfeng and colleagues comment`]],page:11,location:`Right leaf, commentary ends at the left; 二表 begins near the bottom of its last column`},{title:`Read the editorial correction`,voice:`Qing editorial note, marked 案`,chinese:`前後去表相減，餘四步為相多，非二表相去也。`,english:`Subtract the front and rear distances from the poles: the remaining four bu is the excess. It is not the distance between the two poles.`,note:`The small note distinguishes the setback difference, 127 − 123, from the pole gap, 1,000. The note's text crosses from the right leaf onto the top right of the left leaf.`,words:[[`相減`,`xiāng jiǎn`,`subtract one from the other`],[`餘`,`yú`,`what remains`],[`非…也`,`fēi … yě`,`it is not …`]],page:11,location:`Small editorial text in the final right-leaf column and first left-leaf column`},{title:`Calculate the distance`,voice:`Procedure attributed to Liu Hui`,chinese:`求前表去島遠近者：以前表卻行乘表間為實，相多為法，除之，得島去表數。`,english:`To find the distance from the front pole to the island: multiply the front-pole retreat by the pole gap as dividend. Use the excess as divisor and divide; this gives the distance from island to pole.`,note:`The same divisor must work in both procedures. Height needs the extra pole height; distance does not.`,words:[[`前表卻行`,`qián biǎo què xíng`,`the retreat from the front pole`],[`乘`,`chéng`,`multiply`],[`除之`,`chú zhī`,`divide it`]],page:11,location:`Left leaf, middle main-text columns`},{title:`Check the worked arithmetic`,voice:`Commentary attributed to Li Chunfeng and colleagues`,chinese:`前去表乘表間，得一十二萬三千步，以相多四步為法，除之，得三萬七百五十步。`,english:`Multiplying the front retreat by the pole gap gives 123,000 bu. Divide using the excess of four bu as divisor: the result is 30,750 bu.`,note:`The numerical commentary itself uses four here. The written calculation keeps the historical unit labels; our modern dimensional analysis treats the product as bu squared, divided by bu.`,words:[[`一十二萬三千`,`yī shí èr wàn sān qiān`,`123,000`],[`四步`,`sì bù`,`four bu`],[`三萬七百五十`,`sān wàn qī bǎi wǔ shí`,`30,750`]],page:11,location:`Left leaf, last commentary columns; continues on the next opening`},{title:`Acknowledge the later witness`,voice:`Qing bibliographic preface`,chinese:`書世無傳本，惟散見永樂大典中，今裒而輯之。`,english:`No transmitted copy of the book survives in circulation; it is found only in scattered places in the Yongle Encyclopedia. Now these have been gathered and compiled.`,note:`This preface explains the Qing compilation. The retained Waseda book is catalogued as 1777; its preface is dated 1775. These are later witnesses to an ancient work, not a third-century manuscript.`,words:[[`傳本`,`chuán běn`,`a transmitted copy`],[`永樂大典`,`Yǒnglè dàdiǎn`,`the Yongle Encyclopedia`],[`輯`,`jí`,`to collect and compile`]],page:9,location:`Left leaf, first columns on the right`}],s=[`Record the observations`,`Form the dividend`,`Choose the divisor`,`Divide`,`Add the pole height`,`Find the distance`,`Check both sightings`],c=e=>String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]??e);function l(e){let t=o[e];if(!t)throw RangeError(`Unknown reading.`);return`<p class="eyebrow">${c(t.voice)}</p><h3>${c(t.title)}</h3><p class="chinese" lang="zh-Hant">${c(t.chinese)}</p><p class="translation">${c(t.english)}</p><p>${c(t.note)}</p><dl class="words">${t.words.map(([e,t,n])=>`<div><dt lang="zh-Hant">${c(e)}</dt><dd><span>${c(t)}</span> ${c(n)}</dd></div>`).join(``)}</dl><p class="source-location">Opening ${t.page} · ${c(t.location)}</p>`}function u(e,t=1){let n=BigInt(e),r=BigInt(t);if(!r)throw RangeError(`A divisor cannot be zero.`);r<0n&&(n=-n,r=-r);let i=n<0n?-n:n,a=r;for(;a;)[i,a]=[a,i%a];return{n:n/i,d:r/i}}var d=(e,t)=>u(e.n*t.d+t.n*e.d,e.d*t.d),f=(e,t)=>u(e.n*t.d-t.n*e.d,e.d*t.d),p=(e,t)=>u(e.n*t.n,e.d*t.d),m=(e,t)=>u(e.n*t.d,e.d*t.n),h=e=>Number(e.n)/Number(e.d),g=e=>e.d===1n?String(e.n):`${e.n}/${e.d}`;u(0);function _(e,t){if(t.n===0n)return null;let n=d(e.h,m(p(e.h,e.s),t)),r=m(p(e.a,e.s),t),i=m(p(e.h,d(e.a,r)),e.a),a=m(p(e.h,d(d(e.s,e.b),r)),e.b);return{divisor:t,height:n,distance:r,front:i,rear:a,frontResidual:f(n,i),rearResidual:f(n,a)}}function v(e){let t=f(e.b,e.a);return{delta:t,kind:t.n>0n?`forward`:t.n===0n?`parallel`:`behind`,difference:_(e,t),gap:_(e,e.s)}}function y(e,t,n=`independent`){if(t.n<0n)return{kind:`invalid`,explanation:`The half-width must be nonnegative.`};let r=f(e.a,t),i=d(e.a,t),a=f(e.b,t),o=d(e.b,t);if(r.n<=0n||a.n<=0n)return{kind:`invalid`,explanation:`An allowed setback reaches zero or less. Positive setbacks are required; no interval has been clipped.`};if(n===`shared`){let t=f(e.b,e.a);if(t.n<=0n)return{kind:`none`,explanation:`An equal additive offset preserves b − a. These observations remain parallel or behind the poles; no allowed offset gives a forward island.`};let n=_({...e,a:r,b:a},t),s=_({...e,a:i,b:o},t);if(!n||!s)throw Error(`Positive unchanged difference required.`);return{kind:`bounded`,lowH:n.height,highH:s.height,lowD:n.distance,highD:s.distance,deltaLow:t,deltaHigh:t}}let s=f(a,i),c=f(o,r);if(c.n<=0n)return{kind:`none`,explanation:`No allowed pair has a larger rear setback. None gives an island in front of the poles under these assumptions.`};let l=_({...e,a:r,b:o},c);if(!l)throw Error(`Positive maximum difference required.`);if(s.n<=0n)return{kind:`unbounded`,lowH:l.height,lowD:l.distance,deltaLow:s,deltaHigh:c};let u=_({...e,a:i,b:a},s);if(!u)throw Error(`Positive minimum difference required.`);return{kind:`bounded`,lowH:l.height,lowD:l.distance,highH:u.height,highD:u.distance,deltaLow:s,deltaHigh:c}}var b={pole:20,gap:4e3,front:492,rear:508,error:0,errorMode:`independent`,probe:0,rearProbe:0,choice:`difference`,step:0,read:0,page:10},x={...b,pole:12,gap:48,front:40,rear:56},S=e=>({h:u(e.pole,4),s:u(e.gap,4),a:u(e.front,4),b:u(e.rear,4)}),C={pole:[1,400],gap:[1,4e4],front:[1,8e3],rear:[1,8e3],error:[0,64]};function w(e,t,n){if(!/^(?:0|[1-9]\d{0,5})(?:\.(?:0|00|25|5|50|75))?$/.test(e))return null;let r=Number(e)*4;return Number.isInteger(r)&&r>=t&&r<=n?r:null}function T(e){return new URLSearchParams(Object.entries(e).map(([e,t])=>[e,String(e in C?Number(t)/4:t)])).toString()}function E(e){let t=new URLSearchParams(e),n={...b};try{let e=new Set;for(let[r,i]of t){if(e.has(r)||!Object.hasOwn(n,r))throw Error();if(e.add(r),Object.hasOwn(C,r)){let e=r,[t,a]=C[e],o=w(i,t,a);if(o===null)throw Error();n[e]=o}else if(r===`errorMode`){if(i!==`independent`&&i!==`shared`)throw Error();n.errorMode=i}else if(r===`probe`||r===`rearProbe`){if(!/^-?(?:0|[1-9]\d{0,2})$/.test(i)||Math.abs(Number(i))>100)throw Error();n[r]=Number(i)||0}else if(r===`choice`){if(i!==`difference`&&i!==`gap`)throw Error();n.choice=i}else{if(!/^\d{1,2}$/.test(i))throw Error();let e=Number(i);if(r===`step`&&e<=6||r===`read`&&e<=9||r===`page`&&e>=9&&e<=13)n[r]=e;else throw Error()}}return e.has(`rearProbe`)||(n.rearProbe=-n.probe||0),{state:n,warning:``}}catch{return{state:{...b},warning:`This address contains an invalid or repeated field. The complete source record has been restored; no partial record was used.`}}}function D(e){let t=S(e),n=u(e.error*e.probe,400),r=e.errorMode===`shared`?n:u(e.error*e.rearProbe,400),i={...t,a:d(t.a,n),b:d(t.b,r)};return{frontError:n,rearError:r,adjusted:i,solution:i.a.n>0n&&i.b.n>0n?v(i):null}}var O=`<style>text{font-family:Atkinson,Arial,sans-serif;font-size:16px;fill:#203b43}.ground{stroke:#899a9c;stroke-width:1}.front{stroke:#007d85;fill:none;stroke-width:2.5}.rear{stroke:#ad4d2c;fill:none;stroke-width:2.5;stroke-dasharray:9 5}.pole{stroke:#203b43;stroke-width:3}.point{fill:#203b43}.ghost{fill:none;stroke:#687f86;stroke-width:1.5;stroke-dasharray:3 4}.dim{stroke:#637c80;fill:none;stroke-width:1}.small{font-size:13px}.label{font-size:15px}.candidate{stroke:#203b43;fill:none;stroke-width:2}.value{font-weight:700}</style>`;function k(e,t,n,r){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${n}" role="img" aria-label="${c(e)}"><title>${c(e)}</title><desc>${c(t)}</desc>${O}<rect width="1000" height="${n}" fill="#f3f6f3"/>${r}</svg>`}function A(e){let t=S(e),n=v(t),r=n[e.choice],i=h(t.h),a=h(t.s),o=h(t.a),s=h(t.b),l=n.kind===`forward`?n.difference:null,u=[l,r].filter(e=>!!e&&h(e.distance)>0&&h(e.height)>0),d=Math.max(o,a,...u.map(e=>h(e.distance))),f=Math.max(i,...u.map(e=>h(e.height))),p=-d*1.03,m=a+s+(d+a+s)*.03,_=Math.min(890/(m-p),310/f),y=60+f*_,b=Math.max(190,y+95),x=e=>55+(e-p)*_,C=e=>y-e*_,w=e=>i*(o-e)/o,T=e=>i*(a+s-e)/s,E=l?-h(l.distance):-Math.min(d,2*(a+s)),D=`<text x="28" y="27" class="small">WHOLE SURVEY · SAME SCALE IN BOTH DIRECTIONS · ALL LENGTHS IN BU</text><line class="ground" x1="28" y1="${y}" x2="972" y2="${y}"/>`,O=Math.max(E,o-(f+i*.1)*o/i),A=Math.max(E,a+s-(f+i*.1)*s/i);D+=`<line class="front" x1="${x(O)}" y1="${C(w(O))}" x2="${x(o)}" y2="${y}"/><line class="rear" x1="${x(A)}" y1="${C(T(A))}" x2="${x(a+s)}" y2="${y}"/>`;for(let e of[0,a])D+=`<line class="pole" x1="${x(e)}" y1="${y}" x2="${x(e)}" y2="${C(i)}"/><circle class="point" cx="${x(e)}" cy="${C(i)}" r="3"/>`;if(D+=`<text x="${Math.min(x(0),760)}" y="${y+31}" class="small">Front pole → rear pole →</text><text x="${Math.min(x(0),760)}" y="${y+49}" class="small">Poles h=${c(g(t.h))}; gap s=${c(g(t.s))}</text>`,l&&(D+=`<path class="ghost" d="M${x(-h(l.distance))},${y}V${C(h(l.height))}"/><circle class="ghost" cx="${x(-h(l.distance))}" cy="${C(h(l.height))}" r="6"/>`),r&&h(r.height)>0&&h(r.distance)>0){let e=x(-h(r.distance)),t=C(h(r.height));D+=`<path class="candidate" d="M${e},${y}V${t}" data-height="${c(g(r.height))}" data-distance="${c(g(r.distance))}"/><path class="candidate" d="M${e-7},${t-7}l14,14m-14,0l14,-14"/><text x="${Math.min(Math.max(e+12,45),760)}" y="${Math.max(t-14,51)}" class="label">Candidate peak ×</text>`}return D+=`<text x="28" y="${b-15}" class="small">Circles locate pole tips even when a pole is smaller than a pixel. The target is a point; no island width is assumed.</text>`,k(`Two independent observations and a candidate island peak`,`The solid teal ray passes through the front pole and its ground eye. The dashed rust ray passes through the rear pole and its ground eye. Both use the same horizontal and vertical scale. A cross marks the calculated candidate; a dotted line marks the forward intersection when it exists.`,b,D)}function j(e){let t=S(e),n=h(t.a),r=h(t.b),i=740/Math.max(n,r),a=e=>140+e*i,o=`<text x="28" y="27" class="small">SETBACK RULERS · EACH STARTS AT ITS OWN POLE · ONE COMMON SCALE</text><text x="28" y="76">Front</text><line class="front" x1="140" y1="70" x2="${a(n)}" y2="70"/><circle cx="${a(n)}" cy="70" r="5" fill="#007d85"/><text x="${a(n)+12}" y="76">${c(g(t.a))}</text><text x="28" y="123">Rear</text><line class="rear" x1="140" y1="117" x2="${a(r)}" y2="117"/><circle cx="${a(r)}" cy="117" r="5" fill="#ad4d2c"/><text x="${a(r)+12}" y="123">${c(g(t.b))}</text><path class="dim" d="M${a(n)},140v20m0,-10H${a(r)}m0,-10v20"/><text x="140" y="188">Rear − front = ${c(g(v(t).delta))} bu. This is not the pole gap.</text>`;return k(`Compare the two retreats on aligned rulers`,`Front retreat ${g(t.a)} bu and rear retreat ${g(t.b)} bu are shown at one common scale, each measured from its own pole. Their difference is ${g(v(t).delta)} bu.`,212,o)}var M=`Required Notice: Copyright (c) 2026 Anthony Mercer (https://github.com/antonsoo/haidao)

# PolyForm Noncommercial License 1.0.0

<https://polyformproject.org/licenses/noncommercial/1.0.0>

## Acceptance

In order to get any license under these terms, you must agree to them as both strict obligations and conditions to all your licenses.

## Copyright License

The licensor grants you a copyright license for the software to do everything you might do with the software that would otherwise infringe the licensor's copyright in it for any permitted purpose.  However, you may only distribute the software according to [Distribution License](#distribution-license) and make changes or new works based on the software according to [Changes and New Works License](#changes-and-new-works-license).

## Distribution License

The licensor grants you an additional copyright license to distribute copies of the software.  Your license to distribute covers distributing the software with changes and new works permitted by [Changes and New Works License](#changes-and-new-works-license).

## Notices

You must ensure that anyone who gets a copy of any part of the software from you also gets a copy of these terms or the URL for them above, as well as copies of any plain-text lines beginning with \`Required Notice:\` that the licensor provided with the software.  For example:

> Required Notice: Copyright Yoyodyne, Inc. (http://example.com)

## Changes and New Works License

The licensor grants you an additional copyright license to make changes and new works based on the software for any permitted purpose.

## Patent License

The licensor grants you a patent license for the software that covers patent claims the licensor can license, or becomes able to license, that you would infringe by using the software.

## Noncommercial Purposes

Any noncommercial purpose is a permitted purpose.

## Personal Uses

Personal use for research, experiment, and testing for the benefit of public knowledge, personal study, private entertainment, hobby projects, amateur pursuits, or religious observance, without any anticipated commercial application, is use for a permitted purpose.

## Noncommercial Organizations

Use by any charitable organization, educational institution, public research organization, public safety or health organization, environmental protection organization, or government institution is use for a permitted purpose regardless of the source of funding or obligations resulting from the funding.

## Fair Use

You may have "fair use" rights for the software under the law. These terms do not limit them.

## No Other Rights

These terms do not allow you to sublicense or transfer any of your licenses to anyone else, or prevent the licensor from granting licenses to anyone else.  These terms do not imply any other licenses.

## Patent Defense

If you make any written claim that the software infringes or contributes to infringement of any patent, your patent license for the software granted under these terms ends immediately. If your company makes such a claim, your patent license ends immediately for work on behalf of your company.

## Violations

The first time you are notified in writing that you have violated any of these terms, or done anything with the software not covered by your licenses, your licenses can nonetheless continue if you come into full compliance with these terms, and take practical steps to correct past violations, within 32 days of receiving notice.  Otherwise, all your licenses end immediately.

## No Liability

***As far as the law allows, the software comes as is, without any warranty or condition, and the licensor will not be liable to you for any damages arising out of these terms or the use or nature of the software, under any kind of legal claim.***

## Definitions

The **licensor** is the individual or entity offering these terms, and the **software** is the software the licensor makes available under these terms.

**You** refers to the individual or entity agreeing to these terms.

**Your company** is any legal entity, sole proprietorship, or other kind of organization that you work for, plus all organizations that have control over, are under the control of, or are under common control with that organization.  **Control** means ownership of substantially all the assets of an entity, or the power to direct its management and policies by vote, contract, or otherwise.  Control can be direct or indirect.

**Your licenses** are all the licenses granted to you for the software under these terms.

**Use** means anything you do with the software requiring one of your licenses.
`;function N(e){return`${c(g(e))} bu`}function P(e){let t=S(e),n=v(t),r=n[e.choice],i=e.choice===`difference`?n.delta:t.s,a=[`<p>Keep h = ${N(t.h)}, s = ${N(t.s)}, a = ${N(t.a)} and b = ${N(t.b)}. Each retreat belongs to its own pole.</p>`,`<p class="formula">${c(g(t.h))} × ${c(g(t.s))} = ${c(g(p(t.h,t.s)))}</p><p>Pole height × pole gap. This product is in bu²: it is the dividend, <span lang="zh-Hant">實</span>.</p>`,`<p class="formula">${e.choice===`difference`?`${c(g(t.b))} − ${c(g(t.a))}`:`Pole gap`} = ${c(g(i))} bu</p><p>${e.choice===`difference`?`The editorial note uses the difference between the two retreats.`:`The received commentary's wording uses the distance between poles. Carry it through and check it.`} This is the proposed divisor, <span lang="zh-Hant">法</span>.</p>`,r?`<p class="formula">${c(g(p(t.h,t.s)))} ÷ ${c(g(i))} = ${c(g(f(r.height,t.h)))}</p><p>The quotient measures the candidate height above the pole tip.</p>`:`<p>Division is undefined: the proposed divisor is zero. No quotient has been invented.</p>`,r?`<p class="formula">H = ${c(g(r.height))} bu</p><p>Add the pole height to the quotient. ${F(e)&&e.choice===`difference`?`This is 4 li and 55 bu, the source's answer.`:`This is a candidate. It still needs the observations.`}</p>`:`<p>No candidate height: division by zero is undefined.</p>`,r?`<p class="formula">D = ${c(g(t.a))} × ${c(g(t.s))} ÷ ${c(g(i))}<br />= ${c(g(r.distance))} bu</p><p>Distance is measured from the front pole. ${F(e)&&e.choice===`difference`?`This is 102 li and 150 bu.`:`The source's distance procedure uses the same divisor.`}</p>`:`<p>No candidate distance: division by zero is undefined.</p>`,`<p>Put the candidate peak at x = −D. Ask each observation separately what height its line has there. A consistent peak must match both.</p>`];return`<h3>${c(s[e.step])}</h3>${a[e.step]}`}function ee(e){let t=v(S(e)),n=t[e.choice];if(e.step<6)return`<p class="check-data">The two sighting checks appear after the distance operation.</p>`;let r=``;if(t.kind===`parallel`&&(r=`<p class="check bad"><strong>The observations are parallel.</strong>Equal positive retreats give equal slopes but different line heights. There is no finite common peak. The zero difference remains visible.</p>`),t.kind===`behind`&&(r=`<p class="check bad"><strong>Outside the forward-island setup.</strong>The rear retreat is shorter. The line intersection is behind the front pole and below pole height; it is not a forward island.</p>`),!n)return`${r}<p>No candidate exists for the selected zero divisor.</p>`;let i=n.frontResidual.n===0n&&n.rearResidual.n===0n;return`${r}<p class="check ${i?`good`:`bad`}"><strong>${i?`Both sightings agree.`:`The second sighting rejects this candidate.`}</strong> ${i&&t.kind!==`forward`?`The algebraic intersection is outside the source's forward geometry.`:i?`The peak fits the two independent observations.`:`The first sighting alone would have accepted it.`}</p><table class="data-table"><caption class="check-data">At the candidate distance D = ${N(n.distance)}</caption><thead><tr><th scope="col">Height</th><th scope="col">Exact bu</th></tr></thead><tbody><tr><th scope="row">Candidate</th><td>${c(g(n.height))}</td></tr><tr><th scope="row">Front line</th><td>${c(g(n.front))}</td></tr><tr><th scope="row">Rear line</th><td>${c(g(n.rear))}</td></tr><tr><th scope="row">Candidate − rear</th><td>${c(g(n.rearResidual))}</td></tr></tbody></table>${t.delta.n*S(e).s.d===S(e).s.n*t.delta.d?`<p class="check-data">For this record the two proposed divisors happen to be equal. Both choices therefore give the same result.</p>`:``}`}function te(e){let t=y(S(e),u(e.error,4),e.errorMode);if(t.kind===`invalid`||t.kind===`none`)return`<h3>${t.kind===`invalid`?`Outside the interval model`:`No forward island in this interval`}</h3><p>${c(t.explanation)}</p>`;let n=t.kind===`bounded`?N(t.highH):`No finite upper bound`,r=t.kind===`bounded`?N(t.highD):`No finite upper bound`;return`<p class="eyebrow">Allowed retreat difference</p><p class="formula">${g(t.deltaLow)===g(t.deltaHigh)?`${c(g(t.deltaLow))} bu · fixed`:`${c(g(t.deltaLow))} to ${c(g(t.deltaHigh))} bu`}</p><h3>${t.kind===`bounded`?`A bounded family of islands`:`No finite upper bound`}</h3><table class="data-table"><thead><tr><th scope="col">Quantity</th><th scope="col">Smallest</th><th scope="col">Largest</th></tr></thead><tbody><tr><th scope="row">Height H</th><td>${N(t.lowH)}</td><td>${n}</td></tr><tr><th scope="row">Distance D</th><td>${N(t.lowD)}</td><td>${r}</td></tr></tbody></table><p>${t.kind===`bounded`?e.errorMode===`shared`?`Height stays fixed. The shortest equal offset gives the smallest distance; the longest gives the largest. Both endpoints are attained.`:`Both extrema are attained: smallest at the shortest front / longest rear retreat; largest at the longest front / shortest rear retreat.`:`Allowed forward cases approach a zero positive retreat difference. Height and distance grow without limit. Other allowed pairs may be parallel or outside the forward setup; none has been silently removed from the record.`}</p><p class="source-location">These are exact interval bounds under the modern model, not a confidence interval. ${e.errorMode===`shared`?`Both retreats receive the same additive offset.`:`The front and rear retreats are allowed to vary independently.`}</p>`}function F(e){return e.pole===20&&e.gap===4e3&&e.front===492&&e.rear===508}var ne=`p {
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
.comparison-scroll {
  overflow-x: auto;
}
#error-diagram {
  max-width: 450px;
}
.witness-result {
  border-left: 3px solid #006c74;
  padding-left: 1rem;
}

.scroll-note {
  display: none;
}

@media print {
  #error-diagram {
    max-width: 350px;
  }
}
`,I={independent:`Independent errors`,shared:`Shared additive offset`};function L(e){let t=e.error/4,n=e.probe/100,r=e.errorMode===`shared`,i=(r?e.probe:e.rearProbe)/100,a=h(f(S(e).b,S(e).a)),o=t?a/t:0,s=Math.max(-1,o-1),c=Math.min(1,o+1),l=e=>215+e*100,u=e=>155-e*100,d=t>0&&s<=c?`${s===c?`<circle cx="${l(s)}" cy="${u(s-o)}" r="11" fill="none" stroke="#973e25" stroke-width="3"/>`:`<path d="M${l(s)} ${u(s-o)}L${l(c)} ${u(c-o)}" stroke="#973e25" stroke-width="3" stroke-dasharray="5 4"/>`}<text x="320" y="300" text-anchor="end" style="fill:#973e25">${s===c?`Red ring: parallel pair`:`Dashed red: parallel sightings`}</text>`:``;return`<svg class="error-plane" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 350" role="img" aria-label="Allowed error pairs. ${t===0?`Zero allowance: only the origin is allowed.`:r?`Only the rising diagonal is allowed: both errors are equal.`:`The entire square is allowed; front and rear errors are selected separately.`}">
<style>.error-plane text{font:15px Atkinson,sans-serif;fill:#203b43}.error-plane .tiny{font-size:13px}</style>
<rect width="420" height="350" fill="#f3f6f3"/>
<path d="M115 55H315V255H115Z" fill="${!r&&t?`#dce9e1`:`none`}" stroke="#8aaba8"/>
<path d="M95 155H335M215 275V35" stroke="#8aaba8"/>
${t&&r?`<path d="M115 255L315 55" stroke="#006c74" stroke-width="5"/>`:``}${t?d:``}
<circle cx="${t?l(n):215}" cy="${t?u(i):155}" r="7" fill="#203b43" stroke="#f3f6f3" stroke-width="2" data-probe="${e.probe}" data-rear-probe="${r?e.probe:e.rearProbe}"/>
<text x="115" y="278" text-anchor="middle">−e</text><text x="215" y="278" text-anchor="middle">0</text><text x="315" y="278" text-anchor="middle">+e</text>
<text x="101" y="60" text-anchor="end">+e</text><text x="101" y="160" text-anchor="end">0</text><text x="101" y="260" text-anchor="end">−e</text>
<text x="215" y="325" text-anchor="middle">Front error u · e = ${t} bu</text>
<text transform="translate(35 155) rotate(-90)" text-anchor="middle">Rear error v</text>
<text class="tiny" x="215" y="20" text-anchor="middle">${t===0?`Exact readings: one allowed pair`:r?`Equal errors: v = u`:`Any pair in the shaded square`}</text>
</svg>`}function R(e){return`<h3>Same allowance. Different allowed pairs.</h3><div class="comparison-scroll" tabindex="0" role="region" aria-label="Exact bounds for both error assumptions; scroll horizontally on small screens"><table class="data-table"><caption>Exact bu; h and s fixed. No probabilities assigned.</caption><thead><tr><th scope="col">Assumption</th><th scope="col">b − a</th><th scope="col">Height H</th><th scope="col">Distance D</th></tr></thead><tbody>${[`independent`,`shared`].map(t=>{let n=y(S(e),u(e.error,4),t),r=(e,t)=>e===t?e:`${e} to ${t}`,i=n.kind===`invalid`||n.kind===`none`?`<td colspan="3">${c(n.explanation)}</td>`:`<td>${r(g(n.deltaLow),g(n.deltaHigh))}</td><td>${r(g(n.lowH),n.kind===`bounded`?g(n.highH):`unbounded`)}</td><td>${r(g(n.lowD),n.kind===`bounded`?g(n.highD):`unbounded`)}</td>`;return`<tr data-error-model="${t}"><th scope="row">${I[t]}</th>${i}</tr>`}).join(``)}</tbody></table></div><p class="scroll-note">Scroll the table sideways to compare all four columns.</p><p>A shared offset changes both retreats by the same additive amount: (b + u) − (a + u) = b − a. When b − a is positive, height is unchanged and distance changes by su/(b − a). Equal retreats stay parallel under a shared offset. A common scale error would behave differently and is not modeled here.</p>`}function z(e){let t=D(e),n=t.solution,r=n?.difference,i;if(!n)i=`An adjusted retreat reaches zero or less. Outside the positive-setback model.`;else if(n.kind===`parallel`)i=`Parallel sightings. No finite common peak; no finite value replaces division by zero.`;else if(n.kind===`behind`)i=`The intersection is behind the front pole and below pole height. This pair gives no forward island.`;else if(r)i=`H = ${g(r.height)} bu; D = ${g(r.distance)} bu. Both point-defined sight lines meet here.`;else throw Error(`Missing forward intersection`);return`<p class="eyebrow">One allowed pair, not the whole bound</p><p>u = ${c(g(t.frontError))} bu; v = ${c(g(t.rearError))} bu.<br/>Adjusted a = ${c(g(t.adjusted.a))} bu; b = ${c(g(t.adjusted.b))} bu.<br/>b − a = ${c(g(f(t.adjusted.b,t.adjusted.a)))} bu.</p><p class="witness-result" data-kind="${n?.kind??`invalid`}">${c(i)}</p><p class="source-location">${e.errorMode===`shared`?`The slider samples shared offsets in 1% steps. Exact bounds include values between samples.`:`Both sliders sample the independent square in 1% steps. Exact bounds cover the entire square, including values between samples.`} Your applied observations and recipe remain unchanged.</p>${e.errorMode===`independent`&&e.error>0&&g(t.frontError)===g(t.rearError)?`<p class="equal-pair-note">This selected pair has equal errors. The independent assumption still permits unequal errors, so its complete bounds have not narrowed.</p>`:``}`}function B(e){let n=S(e),r=v(n),i=y(n,u(e.error,4),e.errorMode),a=[[`field`,`exact_value`,`unit`,`meaning`],[`model`,`Haidao first problem`,``,`Modern exact coordinate model; no physical survey claimed`],[`license`,`PolyForm Noncommercial 1.0.0`,``,`https://polyformproject.org/licenses/noncommercial/1.0.0/`],[`required_notice`,`Copyright (c) 2026 Anthony Mercer (https://github.com/antonsoo/haidao)`,``,`Original model and teaching material; sources and fonts retain their own notices`],[`operator_stage`,e.step,`0-6`,s[e.step]??``],[`chosen_divisor`,e.choice,``,`Complete computed comparisons below are separate from operator progress`],[`pole_height`,g(n.h),`bu`,`h`],[`pole_gap`,g(n.s),`bu`,`s`],[`front_retreat`,g(n.a),`bu`,`a`],[`rear_retreat`,g(n.b),`bu`,`b`],[`retreat_difference`,g(r.delta),`bu`,`b-a`],[`intersection_kind`,r.kind,``,`forward / parallel / behind`],[`setback_half_width`,g(u(e.error,4)),`bu`,`${I[e.errorMode]}; h and s exact`],[`interval_kind`,i.kind,``,`bounded / unbounded / invalid / none`]];a.push([`error_model`,e.errorMode,``,`independent square or equal additive offsets`],[`probe_percent`,e.probe,`%`,`front error; selected pair, not the complete bound`],[`rear_probe_percent`,e.errorMode===`shared`?e.probe:e.rearProbe,`%`,`rear error used in the selected pair`],[`independent_rear_probe_percent`,e.rearProbe,`%`,`remembered rear setting for independent mode`]);let o=D(e);for(let[e,t]of[[`front_error`,o.frontError],[`rear_error`,o.rearError],[`adjusted_front`,o.adjusted.a],[`adjusted_rear`,o.adjusted.b]])a.push([e,g(t),`bu`,`selected error pair; applied observations unchanged`]);a.push([`probe_kind`,o.solution?.kind??`invalid`,``,`selected error pair`]);for(let e of[`height`,`distance`])a.push([`probe_${e}`,o.solution?.difference?g(o.solution.difference[e]):`undefined`,`bu`,`intersection; may be outside forward geometry`]);for(let t of[`independent`,`shared`]){let r=y(n,u(e.error,4),t);if(a.push([`${t}_kind`,r.kind,``,`complete allowed set`]),r.kind===`bounded`||r.kind===`unbounded`){for(let e of[`lowH`,`lowD`,`deltaLow`,`deltaHigh`])a.push([`${t}_${e}`,g(r[e]),`bu`,`complete allowed set`]);a.push([`${t}_highH`,r.kind===`bounded`?g(r.highH):`unbounded`,`bu`,`complete allowed set`],[`${t}_highD`,r.kind===`bounded`?g(r.highD):`unbounded`,`bu`,`complete allowed set`])}else a.push([`${t}_explanation`,r.explanation,``,`complete allowed set`])}for(let e of[`difference`,`gap`]){let t=r[e];for(let n of[`divisor`,`height`,`distance`,`front`,`rear`,`frontResidual`,`rearResidual`])a.push([`${e}_${n}`,t?g(t[n]):`undefined`,`bu`,n===`front`||n===`rear`?`height independently predicted at candidate x=-D`:`complete computed comparison`])}i.kind===`bounded`||i.kind===`unbounded`?a.push([`height_lower`,g(i.lowH),`bu`,`attained`],[`distance_lower`,g(i.lowD),`bu`,`attained`],[`height_upper`,i.kind===`bounded`?g(i.highH):`unbounded`,`bu`,`not a clipped finite estimate`],[`distance_upper`,i.kind===`bounded`?g(i.highD):`unbounded`,`bu`,`not a clipped finite estimate`]):a.push([`interval_explanation`,i.explanation,``,``]),a.push([`address`,`https://antonsoo.github.io/haidao/?${T(e)}`,``,`applied state`],[`source_pdf`,t.pdf,``,`public-domain later witness`],[`source_pdf_sha256`,t.pdfSha256,``,`source identity`]);for(let e of t.assets)a.push([`asset`,e.path,`SHA-256`,e.sha256]);return`${a.map(e=>e.map(e=>`"${String(e).replaceAll(`"`,`""`)}"`).join(`,`)).join(`\r
`)}\r\n`}async function re(e){let[t,n]=await Promise.all([i(`fonts/AtkinsonHyperlegibleNext.ttf`),i(`fonts/Atkinson-OFL.txt`)]),r=a(t);return A(e).replace(`<style>`,`<metadata>${c(JSON.stringify({state:e,units:`bu`,description:`Modern equal-scale model of Haidao problem 1`,license:M,fontLicense:new TextDecoder().decode(n)}))}</metadata><style>@font-face{font-family:Atkinson;src:url(data:font/ttf;base64,${r}) format('truetype');font-weight:200 800}`)}async function ie(e,n={}){let r=new AbortController,u=n.signal?AbortSignal.any([n.signal,r.signal]):r.signal,d=new Map,f=t.assets.reduce((e,t)=>e+t.bytes,0),p=await Promise.all(t.assets.map(async e=>[e.path,await i(e.path,u,t=>{d.set(e.path,t),n.onProgress?.([...d.values()].reduce((e,t)=>e+t,0),f)})])).catch(e=>{throw r.abort(e),e});u.throwIfAborted();let m=new Map(p),h=e=>{let t=m.get(e);if(!t)throw Error(`Missing ${e}`);return t},g=e=>new TextDecoder().decode(h(e)),_=a(h(`fonts/AtkinsonHyperlegibleNext.ttf`)),v=a(h(`fonts/HaidaoCJK.woff2`)),y=[9,10,11,12,13].map(e=>`<section class="source"><h2>Whole opening ${e}</h2><img alt="Complete Waseda photographed opening ${e}, without crop" src="data:image/jpeg;base64,${a(h(`sources/waseda-${String(e).padStart(2,`0`)}.jpg`))}"/><p>PDF page ${e} · ${c(t.witness)}</p></section>`).join(``);return`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Haidao — a survey and reading record</title>
<style>@font-face{font-family:Atkinson;src:url(data:font/ttf;base64,${_}) format('truetype');font-weight:200 800}@font-face{font-family:Haidao;src:url(data:font/woff2;base64,${v}) format('woff2')}${ne}</style>
</head>
<body>
<p class="eyebrow">Haidao · Sea Island Mathematical Manual · Problem 1</p>
<h1>Check the second sighting.</h1>
<p>Applied record saved at operation ${e.step} of 6: <strong>${c(s[e.step])}</strong>. The complete calculated comparisons below are provided for inspection; they do not assert the operator finished the recipe.</p>
<p>
<a href="https://antonsoo.github.io/haidao/?${c(T(e))}">Reopen this applied state</a> · All lengths in bu; 6 chi = 1 bu, 10 chi = 1 zhang, 300 bu = 1 li. No conversion to metres.</p>
<section>
<h2>Observations and current operation</h2>
<p>h = ${e.pole/4}; s = ${e.gap/4}; a = ${e.front/4}; b = ${e.rear/4} bu. Proposed divisor: ${c(e.choice)}.</p>${A(e)}${j(e)}${P(e)}${ee({...e,step:6})}<h3>Modern setback intervals</h3>
<p>${I[e.errorMode]}; allowance ±${e.error/4} bu; h and s exact.</p>${te(e)}
${R(e)}<h3>The selected error pair</h3><p>Front error: ${e.probe}%; rear error: ${e.errorMode===`shared`?e.probe:e.rearProbe}% of the allowance.</p><div id="error-diagram">${L(e)}</div><p class="source-location">The dark point is selected. Red locates parallel sightings. Only the shaded square or thick teal line is allowed by the chosen assumption.</p>${z(e)}</section>
<section>
<h2>Why one observation is insufficient</h2>
<p>Front pole (0,h), rear pole (s,h), front ground eye (a,0), rear ground eye (s+b,0), island peak (−D,H). Front line: y=h(a−x)/a. Rear line: y=h(s+b−x)/b. Equating them gives D(b−a)=as and H=h+hs/(b−a).</p>
<p>A recipe with any nonzero divisor f produces D=as/f and H=h+hs/f, which always fit the front observation. The rear observation fits only if f=b−a. Equal retreats give parallel lines. A shorter rear retreat puts the intersection outside the forward-island setup. This is modern coordinate analysis, not a transcription of Liu Hui's proof.</p>
<p>This model assumes a level common baseline, equal vertical poles, point-like tips and target, and ground eyes. The chosen interval varies only setbacks; it does not include terrain, pole or eye-height errors, refraction, or any probability distribution.</p>
</section>${o.map((e,t)=>`<section class="reading" id="reading-${t}">
<p class="eyebrow">Reading ${t+1} of 10 · selected clause</p>${l(t)}</section>`).join(``)}<section>
<h2>About the witness and renderings</h2>
<p>${c(t.witness)}. The Qing preface describes compilation from scattered material in the Yongle Encyclopedia. This is a later witness to an ancient work, not a third-century manuscript. The received commentary and the small editorial correction have separate voices.</p>
<p>Chinese clauses were transcribed for this edition from the retained photographs. Modern punctuation is supplied; English renderings and the coordinate model are new. Modern Mandarin pinyin is a reading aid, not reconstructed ancient pronunciation. The text is excerpted; this is not a complete critical edition. The source exercise is not an identified physical expedition.</p>
<p>
<a href="${c(t.commons)}">Scan and catalogue</a> · <a href="${c(t.pdf)}">Complete source PDF</a> · <a href="https://doi.org/10.1016/0315-0860(86)90024-8">Ang Tian Se and Frank J. Swetz (1986), historical study</a>. That study's translation and figures are not reproduced.</p>
<p>${c(t.description)}</p>
</section>${y}<section class="worksheet">
<h2>Work the survey again</h2>
<p>Record h, s, a and b:</p>
<p>Compute the height dividend hs:</p>
<p>What is 相多? Give a proposed divisor f:</p>
<p>Compute H = h + hs/f and D = as/f:</p>
<p>Front line at x = −D; candidate minus front:</p>
<p>Rear line at x = −D; candidate minus rear:</p>
<p>Choose the allowed error pairs. Can b − a approach zero? What changes if both errors are equal?</p>
</section>
<section>
<h2>Exact machine-readable record</h2>
<pre id="exact-record">${c(B(e))}</pre>
<h2>Source identities</h2>
<pre id="source-manifest">${c(JSON.stringify(t,null,2))}</pre>
<h2>Licenses</h2>
<p>Whole photographs: public domain. Original app, diagrams, selected transcription and new English:</p>
<pre>${c(M)}</pre>
<h3>Atkinson Hyperlegible Next</h3>
<pre>${c(g(`fonts/Atkinson-OFL.txt`))}</pre>
<h3>Haidao CJK, subset of Noto Sans CJK</h3>
<pre>${c(g(`fonts/Noto-NOTICE.txt`))}</pre>
<pre>${c(g(`fonts/Noto-OFL.txt`))}</pre>
<pre>${c(g(`fonts/provenance.json`))}</pre>
<p>This complete HTML has no script and needs no network to read or print.</p>
</section>
</body>
</html>`}function ae(e,t,n){let r=URL.createObjectURL(new Blob([e],{type:t})),i=document.createElement(`a`);i.href=r,i.download=n,i.click(),setTimeout(()=>URL.revokeObjectURL(r),1e4)}function oe(t,n){if(!(`serviceWorker`in navigator)){t.textContent=`Offline installation is available in the built edition.`;return}let i=0,a=!1,o=!1,s=!1,c=!1,l=new WeakSet,u=(e,r)=>{t.textContent=`Offline edition is incomplete${e===void 0?``:` (${e} missing or changed files)`}. ${r?`${r} `:``}Keep an online connection and use Rebuild complete offline edition.`,a=!0,n.textContent=`Rebuild complete offline edition`};function d(r,i){return new Promise((o,s)=>{let l=new MessageChannel,u,d=()=>{clearTimeout(u),l.port1.close()},f=()=>{clearTimeout(u),u=setTimeout(()=>{d(),s(Error(i===`repair`?`No rebuild progress arrived. Check the connection and retry; no readiness claim has been made.`:`Offline inventory timed out. Check the connection and try again.`))},i===`repair`?45e3:15e3)};f(),l.port1.onmessage=e=>{let i=e.data;i.edition!==`6691e535fdf0ccc5a8df`||r!==navigator.serviceWorker.controller?(d(),c=!0,a=!1,n.textContent=`Reload current edition`,s(Error(`This page and its offline controller are different editions. Reload the current page before rebuilding.`))):i.type===`progress`?(f(),t.textContent=`Fetching and checking the offline edition: ${Math.round((i.received??0)/1024)} of ${Math.round((i.total??0)/1024)} KiB received or already verified. Your experiment stays on screen.`):(d(),o(i))},r.postMessage({type:i,edition:e},[l.port2])})}async function f(){if(o)return;let r=++i,l=navigator.serviceWorker.controller;if(!l)t.textContent=s?`Installing and verifying the complete offline edition. You can keep reading while files arrive.`:`The complete offline edition is not controlling this page yet. Keep an online connection and retry installation.`,n.textContent=`Retry offline installation`;else{t.textContent=`Checking the identity of every file in the offline edition…`;try{let o=await d(l,`inventory`);if(r!==i)return;o.ready?(c=!1,a=!1,t.textContent=`Complete offline edition ${e}: all ${o.files} files checked, including all five source openings. Ready for an offline reload.`,n.textContent=`Check complete offline edition`):u(o.missing?.length)}catch(e){if(r!==i)return;t.textContent=e instanceof Error?e.message:`The offline edition could not be checked.`}}}function p(e){if(!e||l.has(e))return;l.add(e);let r=()=>{s=e.state!==`activated`&&e.state!==`redundant`,e.state===`redundant`?navigator.serviceWorker.controller||(++i,t.textContent=`The complete offline edition could not be installed. The online lesson remains available. Retry offline installation after reconnecting.`,n.textContent=`Retry offline installation`):e.state===`activated`&&f()};e.addEventListener(`statechange`,r),r()}async function m(){if(s)await f();else{s=!0,++i,t.textContent=`Installing and verifying the complete offline edition. You can keep reading while files arrive.`;try{let e=await navigator.serviceWorker.register(r(`sw.js`),{scope:`/haidao/`});if(!e)throw Error(`Offline installation is unavailable in this browser session.`);e.addEventListener(`updatefound`,()=>p(e.installing)),p(e.installing),e.installing||(s=!1),await f()}catch{if(s=!1,navigator.serviceWorker.controller){await f();return}t.textContent=`The complete offline edition could not be installed. The online lesson remains available. Check the connection and allow website storage before retrying, or save a reading copy.`,n.textContent=`Retry offline installation`}}}async function h(){let e=navigator.serviceWorker.controller;if(!e)await m();else{o=!0,++i,n.disabled=!0,t.textContent=`Fetching and checking missing edition files. Already verified files remain available…`;try{let t=await d(e,`repair`);if(!t.repaired)throw Error(t.error??`The offline copy could not be rebuilt. Retry after reconnecting.`);o=!1,await f()}catch(e){t.textContent=e instanceof Error?e.message:`The offline copy could not be rebuilt.`,a=!0,n.textContent=`Rebuild complete offline edition`}finally{o=!1,n.disabled=!1}}}n.addEventListener(`click`,()=>{o||(c?location.reload():navigator.serviceWorker.controller?a?h():f():m())}),navigator.serviceWorker.addEventListener(`controllerchange`,()=>{++i,o=!1,n.disabled=!1,f()}),navigator.serviceWorker.addEventListener(`message`,e=>{let r=e.data;e.source===navigator.serviceWorker.controller&&(r.edition===`6691e535fdf0ccc5a8df`?r.type===`haidao-incomplete`?(++i,o||u(typeof r.missing==`number`?r.missing:void 0,r.reason)):r.type===`haidao-repairing`?(++i,o||(a=!0,t.textContent=`Another request is checking and repairing this offline edition. Readiness will be checked again when it finishes.`)):r.type===`haidao-repaired`&&!o&&f():(++i,c=!0,n.textContent=`Reload current edition`,t.textContent=`This page and its offline controller are different editions. Reload the current page before rebuilding.`))}),window.addEventListener(`focus`,()=>void f()),document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`visible`?f():o||(++i,t.textContent=`Offline availability will be checked when you return to this page.`)}),m()}function V(e){let t=document.getElementById(e);if(!t)throw Error(`Missing ${e}`);return t}var H=E(location.search),U=H.state,W,G=0,K=``,q=0;V(`address-warning`).textContent=H.warning;var J=V(`observations`);function Y(){for(let e of[`pole`,`gap`,`front`,`rear`])J.elements.namedItem(e).value=String(U[e]/4);V(`record-status`).textContent=F(U)?`Applied: the source exercise. The diagram uses these four observations.`:`Applied: a modern comparison record. The source text retains its original numbers.`}function se(e=!0){V(`address-warning`).textContent=``;let t=`${location.pathname}?${T(U)}${location.hash}`;e?history.pushState(null,``,t):history.replaceState(null,``,t)}function X(e,t=!0){U={...U,...e},se(t),Z()}function ce(){let e=V(`source-frame`),t=e.querySelector(`img`);if(e.classList.contains(`enlarged`)&&t){let n=t.getBoundingClientRect();e.scrollTo(Math.max(0,n.width*.42-e.clientWidth/2),Math.max(0,n.height*.33-e.clientHeight/2))}else e.scrollTo(0,0)}async function le(e){W?.abort(),W=new AbortController;let t=++G,n=V(`source-frame`);n.replaceChildren(),K&&URL.revokeObjectURL(K),K=``,V(`source-retry`).hidden=!0,V(`source-status`).textContent=`Loading and checking whole opening ${e}…`;try{let r=await i(`sources/waseda-${String(e).padStart(2,`0`)}.jpg`,W.signal,(n,r)=>{t===G&&(V(`source-status`).textContent=`Loading whole opening ${e}: ${Math.round(n/1024)} of ${Math.round(r/1024)} KiB received; verifying its identity before display…`)});if(t!==G)return;let a=URL.createObjectURL(new Blob([r],{type:`image/jpeg`}));K=a;let o=new Image;if(o.alt=`Complete Waseda source opening ${e}: two photographed leaves and margins`,o.src=a,await o.decode(),t!==G){URL.revokeObjectURL(a);return}n.replaceChildren(o),ce(),V(`source-status`).textContent=`Opening ${e} · complete photograph · SHA-256 identity checked.`}catch(e){if(t!==G)return;V(`source-status`).textContent=`Opening unavailable. ${e instanceof Error?e.message:`Retry the source.`} Use Retry this opening after reconnecting.`,V(`source-retry`).hidden=!1}}function Z(){V(`overview`).innerHTML=A(U),V(`retreats`).innerHTML=j(U);let e=v(S(U));for(let t of[`difference`,`gap`]){let n=V(`choose-${t}`);n.setAttribute(`aria-pressed`,String(U.choice===t)),n.innerHTML=`${t===`difference`?`Retreat difference`:`Pole gap`}<strong>${c(g(t===`difference`?e.delta:S(U).s))} bu</strong><span lang="zh-Hant">${t===`difference`?`相多`:`表間`}</span> · ${t===`difference`?`editorial note`:`received wording`}`}V(`stage-name`).textContent=`Operation ${U.step} of 6`,V(`calculation`).innerHTML=P(U),V(`checks`).innerHTML=ee(U),V(`previous-step`).disabled=U.step===0,V(`next-step`).disabled=U.step===6,V(`next-step`).textContent=U.step===5?`Check both sightings`:`Next operation`,V(`reading-choice`).value=String(U.read),V(`passage`).innerHTML=l(U.read),V(`previous-reading`).disabled=U.read===0,V(`next-reading`).disabled=U.read===9,V(`source-page`).value=String(U.page),U.page!==q&&(q=U.page,le(U.page)),V(`error-width`).value=String(U.error),V(`error-value`).value=String(U.error/4),V(`bounds`).innerHTML=te(U),V(`error-mode`).value=U.errorMode,V(`error-probe`).value=String(U.probe),V(`probe-value`).value=`${U.probe}%`,V(`rear-error-probe`).value=String(U.errorMode===`shared`?U.probe:U.rearProbe),V(`rear-error-probe`).disabled=U.errorMode===`shared`,V(`rear-probe-value`).value=`${U.errorMode===`shared`?U.probe:U.rearProbe}%`,V(`rear-probe-note`).textContent=U.errorMode===`shared`?`Shared offset: the rear error follows the front. Returning to independent errors restores your rear setting.`:`Independent errors: move either slider. Changing one selected pair does not narrow the complete allowed set.`,V(`equal-errors`).disabled=U.errorMode===`shared`,V(`opposed-errors`).disabled=U.errorMode===`shared`,V(`error-diagram`).innerHTML=L(U),V(`error-comparison`).innerHTML=R(U),V(`error-witness`).innerHTML=z(U);for(let e of document.querySelectorAll(`[data-error]`))e.setAttribute(`aria-pressed`,String(Number(e.dataset.error)===U.error));for(let[e,t]of[[`source-preset`,b],[`near-preset`,x],[`parallel-preset`,{...b,rear:b.front}]])V(e).setAttribute(`aria-pressed`,String([`pole`,`gap`,`front`,`rear`].every(e=>U[e]===t[e])))}V(`divisors`).innerHTML=`<button type="button" id="choose-difference"></button><button type="button" id="choose-gap"></button>`;for(let e of[`difference`,`gap`])V(`choose-${e}`).addEventListener(`click`,()=>X({choice:e}));for(let[e,t]of[[`source-preset`,b],[`near-preset`,x],[`parallel-preset`,{...b,rear:b.front}]])V(e).addEventListener(`click`,()=>{X({...t,read:U.read,page:U.page}),Y()});J.addEventListener(`input`,()=>{V(`record-status`).textContent=`Unapplied edits. The diagrams and downloads still use the last applied record.`}),J.addEventListener(`submit`,e=>{e.preventDefault();let t={};for(let e of[`pole`,`gap`,`front`,`rear`]){let n=J.elements.namedItem(e),r=w(n.value,C[e][0],C[e][1]);if(r===null){V(`record-status`).textContent=`${e}: use positive quarter-bu increments within the displayed bounds. No observations were changed.`,n.focus();return}t[e]=r}X({...t,step:0}),Y()}),V(`previous-step`).addEventListener(`click`,()=>X({step:Math.max(0,U.step-1)})),V(`next-step`).addEventListener(`click`,()=>X({step:Math.min(6,U.step+1)})),V(`reset-steps`).addEventListener(`click`,()=>X({step:0})),V(`reading-choice`).innerHTML=o.map((e,t)=>`<option value="${t}">${t+1}. ${c(e.title)}</option>`).join(``),V(`reading-choice`).addEventListener(`change`,()=>X({read:Number(V(`reading-choice`).value)})),V(`previous-reading`).addEventListener(`click`,()=>X({read:Math.max(0,U.read-1)})),V(`next-reading`).addEventListener(`click`,()=>X({read:Math.min(9,U.read+1)})),V(`read-opening`).addEventListener(`click`,()=>X({page:o[U.read]?.page??10})),V(`source-page`).addEventListener(`change`,()=>X({page:Number(V(`source-page`).value)})),V(`source-retry`).addEventListener(`click`,()=>void le(U.page)),V(`source-zoom`).addEventListener(`click`,()=>{let e=V(`source-frame`).classList.toggle(`enlarged`);V(`source-zoom`).setAttribute(`aria-pressed`,String(e)),V(`source-zoom`).textContent=e?`Fit whole opening`:`Read at full resolution`,ce()}),V(`source-provenance`).textContent=`${t.description} Complete PDF SHA-256: ${t.pdfSha256}.`,V(`error-width`).addEventListener(`input`,()=>X({error:Number(V(`error-width`).value)},!1));for(let e of document.querySelectorAll(`[data-error]`))e.addEventListener(`click`,()=>X({error:Number(e.dataset.error)}));V(`error-mode`).addEventListener(`change`,()=>X({errorMode:V(`error-mode`).value})),V(`error-probe`).addEventListener(`input`,()=>X({probe:Number(V(`error-probe`).value)},!1)),V(`rear-error-probe`).addEventListener(`input`,()=>X({rearProbe:Number(V(`rear-error-probe`).value)},!1)),V(`equal-errors`).addEventListener(`click`,()=>X({rearProbe:U.probe})),V(`opposed-errors`).addEventListener(`click`,()=>X({rearProbe:-U.probe||0})),V(`try-errors`).addEventListener(`click`,()=>{X({...b,error:8,probe:99,rearProbe:-99,read:U.read,page:U.page}),Y()});var Q;V(`save-cancel`).addEventListener(`click`,()=>Q?.abort());async function $(e,t,n,r){let i={...U},a=V(e),o=new AbortController;e===`save-html`&&(Q=o,V(`save-cancel`).hidden=!1),a.disabled=!0,V(`save-status`).textContent=`Preparing the applied record; source assets must pass their identity checks…`;try{let e=await r(i,{signal:o.signal,onProgress(e,t){o.signal.aborted||(V(`save-status`).textContent=`Preparing the saved reading: ${Math.round(e/1024)} of ${Math.round(t/1024)} KiB received and being checked. The saved record keeps your starting selection.`)}});o.signal.throwIfAborted(),ae(e,t,n),V(`save-status`).textContent=`Saved ${n} for the record at operation ${i.step}: ${s[i.step]}.`}catch(e){V(`save-status`).textContent=o.signal.aborted?`Saving cancelled. Nothing was downloaded; your current experiment is kept.`:`Nothing was downloaded. ${e instanceof Error?e.message:`Unable to prepare the complete file.`}`}finally{Q===o&&(Q=void 0,V(`save-cancel`).hidden=!0),a.disabled=!1}}V(`save-html`).addEventListener(`click`,()=>void $(`save-html`,`text/html;charset=utf-8`,`haidao-reading.html`,ie)),V(`save-csv`).addEventListener(`click`,()=>void $(`save-csv`,`text/csv;charset=utf-8`,`haidao-record.csv`,B)),V(`save-svg`).addEventListener(`click`,()=>void $(`save-svg`,`image/svg+xml;charset=utf-8`,`haidao-survey.svg`,re)),V(`share`).addEventListener(`click`,async()=>{let e=new URL(`?${T(U)}${location.hash}`,location.href).href;try{await navigator.clipboard.writeText(e),V(`save-status`).textContent=`Copied the applied observations, divisor, operation, reading, source opening and interval to this address.`}catch{V(`save-status`).textContent=`Copy this address: ${e}`}}),V(`print`).addEventListener(`click`,()=>window.print()),window.addEventListener(`popstate`,()=>{let e=E(location.search);U=e.state,V(`address-warning`).textContent=e.warning,Y(),Z()}),oe(V(`offline-status`),V(`offline-check`)),Y(),Z();for(let e of document.querySelectorAll(`[data-diagram]`)){let t=e.textContent;e.addEventListener(`click`,()=>{let n=V(e.dataset.diagram??`overview-frame`).classList.toggle(`enlarged`);e.setAttribute(`aria-pressed`,String(n)),e.textContent=n?`Fit diagram`:t})}