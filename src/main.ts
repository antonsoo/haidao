import "./style.css";
import { assetUrl, edition, manifest, verified } from "./assets.ts";
import { h, readingMarkup, readings, stages } from "./content.ts";
import {
  exact,
  INITIAL,
  limits,
  NEAR,
  parse,
  quarter,
  record,
  type State,
  serialize,
  solve,
} from "./core/survey.ts";
import { overview, retreats } from "./drawing.ts";
import { csv, download, readingFile, svgFile } from "./files.ts";
import { boundsMarkup, calculation, checks, isSource } from "./presentation.ts";

function el<T extends HTMLElement = HTMLElement>(id: string): T {
  const value = document.getElementById(id);
  if (!value) throw new Error(`Missing ${id}`);
  return value as T;
}
const parsed = parse(location.search);
let state = parsed.state;
let sourceRequest: AbortController | undefined;
let sourceTicket = 0;
let sourceBlob = "";
let sourcePage = 0;
el("address-warning").textContent = parsed.warning;
const form = el<HTMLFormElement>("observations");
function syncForm() {
  for (const key of ["pole", "gap", "front", "rear"] as const)
    (form.elements.namedItem(key) as HTMLInputElement).value = String(state[key] / 4);
  el("record-status").textContent = isSource(state)
    ? "Applied: the source exercise. The diagram uses these four observations."
    : "Applied: a modern comparison record. The source text retains its original numbers.";
}
function address(push = true) {
  const url = `${location.pathname}?${serialize(state)}${location.hash}`;
  if (push) history.pushState(null, "", url);
  else history.replaceState(null, "", url);
}
function update(patch: Partial<State>, push = true) {
  state = { ...state, ...patch };
  address(push);
  render();
}
async function showSource(page: number) {
  sourceRequest?.abort();
  sourceRequest = new AbortController();
  const ticket = ++sourceTicket;
  const frame = el("source-frame");
  frame.replaceChildren();
  if (sourceBlob) URL.revokeObjectURL(sourceBlob);
  sourceBlob = "";
  el("source-status").textContent = `Loading and checking whole opening ${page}…`;
  try {
    const bytes = await verified(
      `sources/waseda-${String(page).padStart(2, "0")}.jpg`,
      sourceRequest.signal,
    );
    if (ticket !== sourceTicket) return;
    const blob = URL.createObjectURL(new Blob([bytes], { type: "image/jpeg" }));
    sourceBlob = blob;
    const img = new Image();
    img.alt = `Complete Waseda source opening ${page}: two photographed leaves and margins`;
    img.src = blob;
    await img.decode();
    if (ticket !== sourceTicket) {
      URL.revokeObjectURL(blob);
      return;
    }
    frame.replaceChildren(img);
    frame.scrollTo(0, 0);
    el("source-status").textContent =
      `Opening ${page} · complete photograph · SHA-256 identity checked.`;
  } catch (error) {
    if (ticket !== sourceTicket) return;
    el("source-status").textContent =
      `Opening unavailable. ${error instanceof Error ? error.message : "Retry the source."} Select another opening and return to retry.`;
  }
}
function render() {
  el("overview").innerHTML = overview(state);
  el("retreats").innerHTML = retreats(state);
  const m = solve(record(state));
  for (const key of ["difference", "gap"] as const) {
    const button = el<HTMLButtonElement>(`choose-${key}`);
    button.setAttribute("aria-pressed", String(state.choice === key));
    button.innerHTML = `${key === "difference" ? "Retreat difference" : "Pole gap"}<strong>${h(exact(key === "difference" ? m.delta : record(state).s))} bu</strong><span lang="zh-Hant">${key === "difference" ? "相多" : "表間"}</span> · ${key === "difference" ? "editorial note" : "received wording"}`;
  }
  el("stage-name").textContent = `Operation ${state.step} of 6`;
  el("calculation").innerHTML = calculation(state);
  el("checks").innerHTML = checks(state);
  el<HTMLButtonElement>("previous-step").disabled = state.step === 0;
  el<HTMLButtonElement>("next-step").disabled = state.step === 6;
  el<HTMLButtonElement>("next-step").textContent =
    state.step === 5 ? "Check both sightings" : "Next operation";
  el<HTMLSelectElement>("reading-choice").value = String(state.read);
  el("passage").innerHTML = readingMarkup(state.read);
  el<HTMLButtonElement>("previous-reading").disabled = state.read === 0;
  el<HTMLButtonElement>("next-reading").disabled = state.read === 9;
  el<HTMLSelectElement>("source-page").value = String(state.page);
  if (state.page !== sourcePage) {
    sourcePage = state.page;
    void showSource(state.page);
  }
  el<HTMLInputElement>("error-width").value = String(state.error);
  el<HTMLOutputElement>("error-value").value = String(state.error / 4);
  el("bounds").innerHTML = boundsMarkup(state);
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-error]"))
    button.setAttribute("aria-pressed", String(Number(button.dataset.error) === state.error));
  for (const [id, s] of [
    ["source-preset", INITIAL],
    ["near-preset", NEAR],
    ["parallel-preset", { ...INITIAL, rear: INITIAL.front }],
  ] as const)
    el(id).setAttribute(
      "aria-pressed",
      String(
        ["pole", "gap", "front", "rear"].every(
          (k) => state[k as keyof State] === s[k as keyof State],
        ),
      ),
    );
}
el("divisors").innerHTML =
  `<button type="button" id="choose-difference"></button><button type="button" id="choose-gap"></button>`;
for (const choice of ["difference", "gap"] as const)
  el(`choose-${choice}`).addEventListener("click", () => update({ choice }));
for (const [id, s] of [
  ["source-preset", INITIAL],
  ["near-preset", NEAR],
  ["parallel-preset", { ...INITIAL, rear: INITIAL.front }],
] as const)
  el(id).addEventListener("click", () => {
    update({ ...s, read: state.read, page: state.page });
    syncForm();
  });
form.addEventListener("input", () => {
  el("record-status").textContent =
    "Unapplied edits. The diagrams and downloads still use the last applied record.";
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values: Partial<State> = {};
  for (const key of ["pole", "gap", "front", "rear"] as const) {
    const input = form.elements.namedItem(key) as HTMLInputElement;
    const n = quarter(input.value, limits[key][0], limits[key][1]);
    if (n === null) {
      el("record-status").textContent =
        `${key}: use positive quarter-bu increments within the displayed bounds. No observations were changed.`;
      input.focus();
      return;
    }
    values[key] = n;
  }
  update({ ...values, step: 0 });
  syncForm();
});
el("previous-step").addEventListener("click", () => update({ step: Math.max(0, state.step - 1) }));
el("next-step").addEventListener("click", () => update({ step: Math.min(6, state.step + 1) }));
el("reset-steps").addEventListener("click", () => update({ step: 0 }));
el<HTMLSelectElement>("reading-choice").innerHTML = readings
  .map((r, i) => `<option value="${i}">${i + 1}. ${h(r.title)}</option>`)
  .join("");
el("reading-choice").addEventListener("change", () =>
  update({ read: Number(el<HTMLSelectElement>("reading-choice").value) }),
);
el("previous-reading").addEventListener("click", () =>
  update({ read: Math.max(0, state.read - 1) }),
);
el("next-reading").addEventListener("click", () => update({ read: Math.min(9, state.read + 1) }));
el("read-opening").addEventListener("click", () =>
  update({ page: readings[state.read]?.page ?? 10 }),
);
el("source-page").addEventListener("change", () =>
  update({ page: Number(el<HTMLSelectElement>("source-page").value) }),
);
el("source-zoom").addEventListener("click", () => {
  const zoom = el("source-frame").classList.toggle("enlarged");
  el("source-zoom").setAttribute("aria-pressed", String(zoom));
  el("source-zoom").textContent = zoom ? "Fit whole opening" : "Enlarge source";
});
el("source-provenance").textContent =
  `${manifest.description} Complete PDF SHA-256: ${manifest.pdfSha256}.`;
el("error-width").addEventListener("input", () =>
  update({ error: Number(el<HTMLInputElement>("error-width").value) }, false),
);
for (const button of document.querySelectorAll<HTMLButtonElement>("[data-error]"))
  button.addEventListener("click", () => update({ error: Number(button.dataset.error) }));
async function save(
  id: string,
  mime: string,
  name: string,
  make: (s: State) => string | Promise<string>,
) {
  const snapshot = { ...state },
    button = el<HTMLButtonElement>(id);
  button.disabled = true;
  el("save-status").textContent =
    "Preparing the applied record; source assets must pass their identity checks…";
  try {
    download(await make(snapshot), mime, name);
    el("save-status").textContent =
      `Saved ${name} for the record at operation ${snapshot.step}: ${stages[snapshot.step]}.`;
  } catch (error) {
    el("save-status").textContent =
      `Nothing was downloaded. ${error instanceof Error ? error.message : "Unable to prepare the complete file."}`;
  } finally {
    button.disabled = false;
  }
}
el("save-html").addEventListener(
  "click",
  () => void save("save-html", "text/html;charset=utf-8", "haidao-reading.html", readingFile),
);
el("save-csv").addEventListener(
  "click",
  () => void save("save-csv", "text/csv;charset=utf-8", "haidao-record.csv", csv),
);
el("save-svg").addEventListener(
  "click",
  () => void save("save-svg", "image/svg+xml;charset=utf-8", "haidao-survey.svg", svgFile),
);
el("share").addEventListener("click", async () => {
  const url = new URL(`?${serialize(state)}${location.hash}`, location.href).href;
  try {
    await navigator.clipboard.writeText(url);
    el("save-status").textContent =
      "Copied the applied observations, divisor, operation, reading, source opening and interval to this address.";
  } catch {
    el("save-status").textContent = `Copy this address: ${url}`;
  }
});
el("print").addEventListener("click", () => window.print());
window.addEventListener("popstate", () => {
  const next = parse(location.search);
  state = next.state;
  el("address-warning").textContent = next.warning;
  syncForm();
  render();
});
let offlineTicket = 0;
let needsRepair = false;
async function offline() {
  const ticket = ++offlineTicket;
  const status = el("offline-status"),
    controller = navigator.serviceWorker?.controller;
  if (!controller) {
    status.textContent =
      "The complete offline edition is not controlling this page yet. Keep this page open online, then check again.";
    return;
  }
  status.textContent = "Checking the identity of every file in the offline edition…";
  try {
    const inventory = await new Promise<{
      edition: string;
      files: number;
      missing: string[];
      ready: boolean;
    }>((resolve, reject) => {
      const channel = new MessageChannel();
      const timeout = setTimeout(() => {
        channel.port1.close();
        reject(new Error("Offline inventory timed out."));
      }, 15000);
      channel.port1.onmessage = (event) => {
        clearTimeout(timeout);
        channel.port1.close();
        resolve(event.data);
      };
      controller.postMessage({ type: "inventory" }, [channel.port2]);
    });
    if (ticket !== offlineTicket) return;
    if (controller !== navigator.serviceWorker.controller || inventory.edition !== edition) {
      status.textContent =
        "This page and its offline controller are different editions. Wait for the complete update, then reload and check again.";
      return;
    }
    needsRepair = !inventory.ready;
    el("offline-check").textContent = needsRepair
      ? "Rebuild complete offline edition"
      : "Check complete offline edition";
    status.textContent = inventory.ready
      ? `Complete offline edition ${inventory.edition}: all ${inventory.files} files checked, including all five source openings. Ready for an offline reload.`
      : `Offline edition ${inventory.edition} is incomplete (${inventory.missing.length} missing or changed files). Keep an online connection and use Rebuild complete offline edition.`;
  } catch (error) {
    status.textContent =
      error instanceof Error ? error.message : "Offline edition could not be checked.";
  }
}
async function repair() {
  const controller = navigator.serviceWorker.controller;
  if (!controller) {
    await offline();
    return;
  }
  const button = el<HTMLButtonElement>("offline-check");
  button.disabled = true;
  el("offline-status").textContent =
    "Fetching and checking every edition file before rebuilding the offline copy…";
  try {
    await new Promise<void>((resolve, reject) => {
      const channel = new MessageChannel();
      const timeout = setTimeout(() => {
        channel.port1.close();
        reject(
          new Error(
            "Rebuilding timed out; no readiness claim has been made. Check again after reconnecting.",
          ),
        );
      }, 45000);
      channel.port1.onmessage = (event) => {
        clearTimeout(timeout);
        channel.port1.close();
        if (
          event.data.repaired &&
          event.data.edition === edition &&
          controller === navigator.serviceWorker.controller
        )
          resolve();
        else
          reject(
            new Error(
              event.data.error ??
                "The page and offline controller differ. Reload the current page before rebuilding.",
            ),
          );
      };
      controller.postMessage({ type: "repair" }, [channel.port2]);
    });
    await offline();
  } catch (error) {
    el("offline-status").textContent =
      error instanceof Error ? error.message : "The offline copy could not be rebuilt.";
  } finally {
    button.disabled = false;
  }
}
el("offline-check").addEventListener("click", () => void (needsRepair ? repair() : offline()));
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.addEventListener("controllerchange", () => void offline());
  void navigator.serviceWorker
    .register(assetUrl("sw.js"), { scope: import.meta.env.BASE_URL })
    .then(() => offline())
    .catch(() => {
      el("offline-status").textContent =
        "The complete offline edition could not be installed. The online lesson remains available; retry with a complete connection.";
    });
} else el("offline-status").textContent = "Offline installation is available in the built edition.";
syncForm();
render();

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-diagram]")) {
  const original = button.textContent;
  button.addEventListener("click", () => {
    const frame = el(button.dataset.diagram ?? "overview-frame");
    const enlarged = frame.classList.toggle("enlarged");
    button.setAttribute("aria-pressed", String(enlarged));
    button.textContent = enlarged ? "Fit diagram" : original;
  });
}
