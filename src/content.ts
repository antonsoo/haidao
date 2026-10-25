export interface Reading {
  title: string;
  voice: string;
  chinese: string;
  english: string;
  note: string;
  words: readonly (readonly [string, string, string])[];
  page: number;
  location: string;
}
export const readings: readonly Reading[] = [
  {
    title: "Place two equal poles",
    voice: "Problem attributed to Liu Hui",
    chinese: "今有望海島，立兩表齊高三丈，前後相去千步，令後表與前表參相直。",
    english:
      "Suppose an island is to be sighted. Set up two poles of equal height, three zhang, a thousand bu apart, front and rear. Align the rear pole with the front pole.",
    note: "The alignment is along the survey direction on the ground. It does not put both pole tips and the island peak on one sight line.",
    words: [
      ["表", "biǎo", "a sighting pole"],
      ["齊高", "qí gāo", "equal in height"],
      ["相去", "xiāng qù", "to be separated by a distance"],
    ],
    page: 10,
    location: "Left leaf, main text, beginning at the right",
  },
  {
    title: "Make the first sighting",
    voice: "Problem attributed to Liu Hui",
    chinese: "從前表卻行一百二十三步，人目著地，取望島峯，與表末參合。",
    english:
      "Retreat 123 bu from the front pole. With the eye at ground level, sight the island peak so that it lines up with the tip of the pole.",
    note: "The eye is at ground level in this idealized exercise. Adding an ordinary standing eye height would change the geometry.",
    words: [
      ["卻行", "què xíng", "to move back"],
      ["著地", "zhuó dì", "touching the ground"],
      ["表末", "biǎo mò", "the tip of the pole"],
    ],
    page: 10,
    location: "Left leaf, middle main-text columns",
  },
  {
    title: "Make the second sighting",
    voice: "Problem attributed to Liu Hui",
    chinese: "從後表卻行一百二十七步，人目著地，取望島峯，亦與表末參合。",
    english:
      "Retreat 127 bu from the rear pole. With the eye at ground level, sight the island peak; it too lines up with the tip of that pole.",
    note: "This is a second eye position and a second pole. The two observations constrain the same peak.",
    words: [
      ["後表", "hòu biǎo", "the rear pole"],
      ["亦", "yì", "also"],
      ["參合", "cān hé", "to line up together"],
    ],
    page: 10,
    location: "Left leaf, middle and left main-text columns",
  },
  {
    title: "Read the stated answers",
    voice: "Problem attributed to Liu Hui",
    chinese: "問島高及去表各幾何？答曰：島高四里五十五步，去表一百二里一百五十步。",
    english:
      "What are the island's height and its distance from the pole? Answer: the island is four li and 55 bu high; its distance from the pole is 102 li and 150 bu.",
    note: "The distance procedure specifies the front pole. At 300 bu per li, these answers are 1,255 bu and 30,750 bu.",
    words: [
      ["幾何", "jǐ hé", "how much?"],
      ["島高", "dǎo gāo", "the height of the island"],
      ["去表", "qù biǎo", "distance from the pole"],
    ],
    page: 10,
    location: "Left leaf, last columns; the answer continues onto opening 11",
  },
  {
    title: "Operate on the numbers",
    voice: "Procedure attributed to Liu Hui",
    chinese: "術曰：以表高乘表間為實，相多為法，除之。所得加表高，即得島高。",
    english:
      "Procedure: multiply the pole height by the distance between the poles to form the dividend. Use the excess as divisor and divide. Add the pole height to the result; this gives the island's height.",
    note: "實 and 法 are calculation roles here: dividend and divisor. The crucial question is what 相多, the excess, refers to.",
    words: [
      ["實", "shí", "dividend in this operation"],
      ["法", "fǎ", "divisor in this operation"],
      ["相多", "xiāng duō", "the amount by which one exceeds the other"],
    ],
    page: 11,
    location: "Right leaf, first main-text columns",
  },
  {
    title: "Try the received wording",
    voice: "Commentary attributed to Li Chunfeng and colleagues",
    chinese: "二表相去為相多，以為法。",
    english: "Use the distance between the two poles as the excess, making it the divisor.",
    note: "This is the wording in the received commentary in this printed witness. Try the pole-gap divisor in the calculation. A wrong result can still pass one sighting. This does not establish when or how the wording arose.",
    words: [
      ["二表", "èr biǎo", "the two poles"],
      ["以為", "yǐ wéi", "use as"],
      ["淳風等按", "Chúnfēng děng àn", "Chunfeng and colleagues comment"],
    ],
    page: 11,
    location:
      "Right leaf, commentary ends at the left; 二表 begins near the bottom of its last column",
  },
  {
    title: "Read the editorial correction",
    voice: "Qing editorial note, marked 案",
    chinese: "前後去表相減，餘四步為相多，非二表相去也。",
    english:
      "Subtract the front and rear distances from the poles: the remaining four bu is the excess. It is not the distance between the two poles.",
    note: "The small note distinguishes the setback difference, 127 − 123, from the pole gap, 1,000. The note's text crosses from the right leaf onto the top right of the left leaf.",
    words: [
      ["相減", "xiāng jiǎn", "subtract one from the other"],
      ["餘", "yú", "what remains"],
      ["非…也", "fēi … yě", "it is not …"],
    ],
    page: 11,
    location: "Small editorial text in the final right-leaf column and first left-leaf column",
  },
  {
    title: "Calculate the distance",
    voice: "Procedure attributed to Liu Hui",
    chinese: "求前表去島遠近者：以前表卻行乘表間為實，相多為法，除之，得島去表數。",
    english:
      "To find the distance from the front pole to the island: multiply the front-pole retreat by the pole gap as dividend. Use the excess as divisor and divide; this gives the distance from island to pole.",
    note: "The same divisor must work in both procedures. Height needs the extra pole height; distance does not.",
    words: [
      ["前表卻行", "qián biǎo què xíng", "the retreat from the front pole"],
      ["乘", "chéng", "multiply"],
      ["除之", "chú zhī", "divide it"],
    ],
    page: 11,
    location: "Left leaf, middle main-text columns",
  },
  {
    title: "Check the worked arithmetic",
    voice: "Commentary attributed to Li Chunfeng and colleagues",
    chinese: "前去表乘表間，得一十二萬三千步，以相多四步為法，除之，得三萬七百五十步。",
    english:
      "Multiplying the front retreat by the pole gap gives 123,000 bu. Divide using the excess of four bu as divisor: the result is 30,750 bu.",
    note: "The numerical commentary itself uses four here. The written calculation keeps the historical unit labels; our modern dimensional analysis treats the product as bu squared, divided by bu.",
    words: [
      ["一十二萬三千", "yī shí èr wàn sān qiān", "123,000"],
      ["四步", "sì bù", "four bu"],
      ["三萬七百五十", "sān wàn qī bǎi wǔ shí", "30,750"],
    ],
    page: 11,
    location: "Left leaf, last commentary columns; continues on the next opening",
  },
  {
    title: "Acknowledge the later witness",
    voice: "Qing bibliographic preface",
    chinese: "書世無傳本，惟散見永樂大典中，今裒而輯之。",
    english:
      "No transmitted copy of the book survives in circulation; it is found only in scattered places in the Yongle Encyclopedia. Now these have been gathered and compiled.",
    note: "This preface explains the Qing compilation. The retained Waseda book is catalogued as 1777; its preface is dated 1775. These are later witnesses to an ancient work, not a third-century manuscript.",
    words: [
      ["傳本", "chuán běn", "a transmitted copy"],
      ["永樂大典", "Yǒnglè dàdiǎn", "the Yongle Encyclopedia"],
      ["輯", "jí", "to collect and compile"],
    ],
    page: 9,
    location: "Left leaf, first columns on the right",
  },
];
export const stages = [
  "Record the observations",
  "Form the dividend",
  "Choose the divisor",
  "Divide",
  "Add the pole height",
  "Find the distance",
  "Check both sightings",
] as const;
export const h = (value: unknown): string =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
export function readingMarkup(index: number): string {
  const r = readings[index];
  if (!r) throw new RangeError("Unknown reading.");
  return `<p class="eyebrow">${h(r.voice)}</p><h3>${h(r.title)}</h3><p class="chinese" lang="zh-Hant">${h(r.chinese)}</p><p class="translation">${h(r.english)}</p><p>${h(r.note)}</p><dl class="words">${r.words.map(([word, pinyin, meaning]) => `<div><dt lang="zh-Hant">${h(word)}</dt><dd><span>${h(pinyin)}</span> ${h(meaning)}</dd></div>`).join("")}</dl><p class="source-location">Opening ${r.page} · ${h(r.location)}</p>`;
}
