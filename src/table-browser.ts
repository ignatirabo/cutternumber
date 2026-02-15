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
    const backLink = `<a href="#" id="table-back" class="text-brown hover:underline text-sm">${t("tableBack")}</a>`;
    const title = `<h2 class="text-2xl font-bold text-dark mb-4" data-i18n="tableTitle">${t("tableTitle")}</h2>`;

    // Letter bar
    const letterBar = LETTERS.map((l) => {
      const hasEntries = groups.has(l);
      const isActive = l === activeLetter;
      if (!hasEntries) {
        return `<span class="px-2 py-1 text-gray/40 cursor-default">${l}</span>`;
      }
      return `<button data-letter="${l}" class="px-2 py-1 rounded font-medium transition-colors ${
        isActive
          ? "bg-orange text-white"
          : "text-brown hover:bg-beige"
      }">${l}</button>`;
    }).join("");

    // Entry table for active letter
    let entriesHtml = "";
    if (activeLetter && groups.has(activeLetter)) {
      const entries = groups.get(activeLetter)!;
      const rows = entries
        .map(
          (e) =>
            `<tr class="border-b border-beige/60"><td class="py-1 px-3 font-mono text-sm">${e.code}</td><td class="py-1 px-3">${e.key}</td></tr>`
        )
        .join("");
      entriesHtml = `
        <div class="mt-4 max-h-96 overflow-y-auto border border-beige rounded">
          <table class="w-full">
            <thead class="sticky top-0 bg-beige-light">
              <tr>
                <th class="py-2 px-3 text-left text-sm font-semibold text-gray w-24">Code</th>
                <th class="py-2 px-3 text-left text-sm font-semibold text-gray">Key</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
    }

    container.innerHTML = `
      <div class="space-y-4">
        ${backLink}
        ${title}
        <div class="flex flex-wrap gap-1">${letterBar}</div>
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

  function showTableBrowser(): void {
    const main = document.getElementById("main-view")!;
    main.classList.add("hidden");
    container.classList.remove("hidden");
    render(null);
  }

  function hideTableBrowser(): void {
    const main = document.getElementById("main-view")!;
    main.classList.remove("hidden");
    container.classList.add("hidden");
  }

  // Expose globally for the browse link
  (window as unknown as Record<string, () => void>).__showTableBrowser =
    showTableBrowser;
}
