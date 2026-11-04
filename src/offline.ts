import { assetUrl, edition } from "./assets.ts";

interface Reply {
  edition: string;
  type?: string;
  files?: number;
  missing?: string[];
  ready?: boolean;
  repaired?: boolean;
  error?: string;
  received?: number;
  total?: number;
}
/** Readiness belongs to this page and controller edition, not a remembered success. */
export function mountOffline(status: HTMLElement, button: HTMLButtonElement): void {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) {
    status.textContent = "Offline installation is available in the built edition.";
    return;
  }
  let ticket = 0;
  let needsRepair = false;
  let busy = false;
  let installing = false;
  let requiresReload = false;
  const watched = new WeakSet<ServiceWorker>();
  const incomplete = (missing?: number, reason?: string) => {
    status.textContent = `Offline edition is incomplete${missing === undefined ? "" : ` (${missing} missing or changed files)`}. ${reason ? `${reason} ` : ""}Keep an online connection and use Rebuild complete offline edition.`;
    needsRepair = true;
    button.textContent = "Rebuild complete offline edition";
  };
  function exchange(controller: ServiceWorker, type: "inventory" | "repair"): Promise<Reply> {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      let timeout: ReturnType<typeof setTimeout>;
      const close = () => {
        clearTimeout(timeout);
        channel.port1.close();
      };
      const arm = () => {
        clearTimeout(timeout);
        timeout = setTimeout(
          () => {
            close();
            reject(
              new Error(
                type === "repair"
                  ? "No rebuild progress arrived. Check the connection and retry; no readiness claim has been made."
                  : "Offline inventory timed out. Check the connection and try again.",
              ),
            );
          },
          type === "repair" ? 45000 : 15000,
        );
      };
      arm();
      channel.port1.onmessage = (event: MessageEvent<Reply>) => {
        const data = event.data;
        if (data.edition !== edition || controller !== navigator.serviceWorker.controller) {
          close();
          requiresReload = true;
          needsRepair = false;
          button.textContent = "Reload current edition";
          reject(
            new Error(
              "This page and its offline controller are different editions. Reload the current page before rebuilding.",
            ),
          );
          return;
        }
        if (data.type === "progress") {
          arm();
          status.textContent = `Fetching and checking the offline edition: ${Math.round((data.received ?? 0) / 1024)} of ${Math.round((data.total ?? 0) / 1024)} KiB received or already verified. Your experiment stays on screen.`;
          return;
        }
        close();
        resolve(data);
      };
      controller.postMessage({ type, edition }, [channel.port2]);
    });
  }
  async function inspect() {
    if (busy) return;
    const mine = ++ticket;
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
      status.textContent = installing
        ? "Installing and verifying the complete offline edition. You can keep reading while files arrive."
        : "The complete offline edition is not controlling this page yet. Keep an online connection and retry installation.";
      button.textContent = "Retry offline installation";
      return;
    }
    status.textContent = "Checking the identity of every file in the offline edition…";
    try {
      const reply = await exchange(controller, "inventory");
      // Another tab may have detected damage while this inventory was running.
      if (mine !== ticket) return;
      if (!reply.ready) incomplete(reply.missing?.length);
      else {
        requiresReload = false;
        needsRepair = false;
        status.textContent = `Complete offline edition ${edition}: all ${reply.files} files checked, including all five source openings. Ready for an offline reload.`;
        button.textContent = "Check complete offline edition";
      }
    } catch (error) {
      if (mine !== ticket) return;
      status.textContent =
        error instanceof Error ? error.message : "The offline edition could not be checked.";
    }
  }
  function watch(worker: ServiceWorker | null) {
    if (!worker || watched.has(worker)) return;
    watched.add(worker);
    const change = () => {
      installing = worker.state !== "activated" && worker.state !== "redundant";
      if (worker.state === "redundant") {
        if (!navigator.serviceWorker.controller) {
          ++ticket;
          status.textContent =
            "The complete offline edition could not be installed. The online lesson remains available. Retry offline installation after reconnecting.";
          button.textContent = "Retry offline installation";
        }
      } else if (worker.state === "activated") void inspect();
    };
    worker.addEventListener("statechange", change);
    change();
  }
  async function install() {
    if (installing) {
      await inspect();
      return;
    }
    installing = true;
    ++ticket;
    status.textContent =
      "Installing and verifying the complete offline edition. You can keep reading while files arrive.";
    try {
      const registration = await navigator.serviceWorker.register(assetUrl("sw.js"), {
        scope: import.meta.env.BASE_URL,
      });
      if (!registration)
        throw new Error("Offline installation is unavailable in this browser session.");
      registration.addEventListener("updatefound", () => watch(registration.installing));
      watch(registration.installing);
      if (!registration.installing) installing = false;
      await inspect();
    } catch {
      installing = false;
      if (navigator.serviceWorker.controller) {
        await inspect();
        return;
      }
      status.textContent =
        "The complete offline edition could not be installed. The online lesson remains available. Check the connection and allow website storage before retrying, or save a reading copy.";
      button.textContent = "Retry offline installation";
    }
  }
  async function repair() {
    const controller = navigator.serviceWorker.controller;
    if (!controller) {
      await install();
      return;
    }
    busy = true;
    ++ticket;
    button.disabled = true;
    status.textContent =
      "Fetching and checking missing edition files. Already verified files remain available…";
    try {
      const reply = await exchange(controller, "repair");
      if (!reply.repaired)
        throw new Error(
          reply.error ?? "The offline copy could not be rebuilt. Retry after reconnecting.",
        );
      busy = false;
      await inspect();
    } catch (error) {
      status.textContent =
        error instanceof Error ? error.message : "The offline copy could not be rebuilt.";
      needsRepair = true;
      button.textContent = "Rebuild complete offline edition";
    } finally {
      busy = false;
      button.disabled = false;
    }
  }
  button.addEventListener("click", () => {
    if (busy) return;
    if (requiresReload) {
      location.reload();
      return;
    }
    if (!navigator.serviceWorker.controller) void install();
    else void (needsRepair ? repair() : inspect());
  });
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    ++ticket;
    busy = false;
    button.disabled = false;
    void inspect();
  });
  navigator.serviceWorker.addEventListener(
    "message",
    (event: MessageEvent<{ edition: string; type: string; missing?: number; reason?: string }>) => {
      const data = event.data;
      if (event.source !== navigator.serviceWorker.controller) return;
      if (data.edition !== edition) {
        ++ticket;
        requiresReload = true;
        button.textContent = "Reload current edition";
        status.textContent =
          "This page and its offline controller are different editions. Reload the current page before rebuilding.";
        return;
      }
      if (data.type === "haidao-incomplete") {
        ++ticket;
        if (!busy)
          incomplete(typeof data.missing === "number" ? data.missing : undefined, data.reason);
      } else if (data.type === "haidao-repairing") {
        ++ticket;
        if (!busy) {
          needsRepair = true;
          status.textContent =
            "Another request is checking and repairing this offline edition. Readiness will be checked again when it finishes.";
        }
      } else if (data.type === "haidao-repaired" && !busy) void inspect();
    },
  );
  // Returning to a tab must not reuse an old ready claim after browser eviction.
  window.addEventListener("focus", () => void inspect());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void inspect();
    else if (!busy) {
      ++ticket;
      status.textContent = "Offline availability will be checked when you return to this page.";
    }
  });
  void install();
}
