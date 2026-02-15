import type { CutterEntry } from "./data";
import { t } from "./i18n";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/**
 * Group table entries by their first letter.
 */
function groupByLetter(table: CutterEntry[]): Map<string, CutterEntry[]> {
  const groups = new Map<string, CutterEntry[]>();
  for (const entry of table) {
    const letter = entry.key[0].toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(entry);
  }
  return groups;
}

export function initTableBrowser(
  table: CutterEntry[],
  container: HTMLElement
): void {
  const groups = groupByLetter(table);

  function render(activeLetter: string | null): void {
    // Back link with arrow icon
    const backLink = `
      <a href="#" id="table-back" class="inline-flex items-center gap-1.5 text-sage text-[13px] font-medium hover:underline">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
        ${t("tableBack")}
      </a>`;

    // Title + subtitle
    const header = `
      <div class="space-y-2">
        <h2 class="font-heading text-[32px] font-normal tracking-tight text-dark">${t("tableTitle")}</h2>
        <p class="text-sm text-muted">${t("tableSubtitle")}</p>
      </div>`;

    // Letter bar
    const letterBar = LETTERS.map((l) => {
      const hasEntries = groups.has(l);
      const isActive = l === activeLetter;
      if (!hasEntries) {
        return `<span class="w-[26px] h-7 inline-flex items-center justify-center rounded-md text-xs text-soft/40 cursor-default">${l}</span>`;
      }
      return `<button data-letter="${l}" class="w-[26px] h-7 inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
        isActive
          ? "bg-sage text-white"
          : "text-subtle hover:bg-cream"
      }">${l}</button>`;
    }).join("");

    // Entry table for active letter
    let entriesHtml = "";
    if (activeLetter && groups.has(activeLetter)) {
      const entries = groups.get(activeLetter)!;
      const rows = entries
        .map(
          (e) =>
            `<div class="flex px-5 py-2.5 border-b border-border/60">
              <span class="w-20 text-[13px] text-dark font-mono">${e.code}</span>
              <span class="text-[13px] text-dark">${e.key}</span>
            </div>`
        )
        .join("");
      entriesHtml = `
        <div class="bg-white rounded-2xl border border-border overflow-hidden">
          <div class="flex px-5 py-3 bg-cream border-b border-border">
            <span class="w-20 text-xs font-semibold text-muted">${t("tableCode")}</span>
            <span class="text-xs font-semibold text-muted">${t("tableKey")}</span>
          </div>
          <div class="max-h-[480px] overflow-y-auto">
            ${rows}
          </div>
        </div>`;
    }

    container.innerHTML = `
      <div class="space-y-6">
        ${backLink}
        ${header}
        <div class="flex flex-wrap justify-center gap-0.5">${letterBar}</div>
        ${entriesHtml}
      </div>`;

    // Bind letter buttons
    container.querySelectorAll<HTMLButtonElement>("[data-letter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        render(btn.dataset.letter!);
      });
    });

    // Bind back link
    container.querySelector("#table-back")?.addEventListener("click", (e) => {
      e.preventDefault();
      hideTableBrowser();
    });
  }

  function setNavState(tablasActive: boolean): void {
    const navHome = document.getElementById("nav-home");
    const browseLink = document.getElementById("browse-link");
    if (navHome && browseLink) {
      if (tablasActive) {
        navHome.classList.remove("font-medium", "text-dark");
        navHome.classList.add("text-muted");
        browseLink.classList.remove("text-muted");
        browseLink.classList.add("font-medium", "text-dark");
      } else {
        navHome.classList.add("font-medium", "text-dark");
        navHome.classList.remove("text-muted");
        browseLink.classList.add("text-muted");
        browseLink.classList.remove("font-medium", "text-dark");
      }
    }
  }

  function showTableBrowser(): void {
    const main = document.getElementById("main-view")!;
    main.classList.add("hidden");
    container.classList.remove("hidden");
    setNavState(true);
    render(null);
  }

  function hideTableBrowser(): void {
    const main = document.getElementById("main-view")!;
    main.classList.remove("hidden");
    container.classList.add("hidden");
    setNavState(false);
  }

  // Expose globally for the browse link
  (window as unknown as Record<string, () => void>).__showTableBrowser =
    showTableBrowser;
  (window as unknown as Record<string, () => void>).__hideTableBrowser =
    hideTableBrowser;
}
