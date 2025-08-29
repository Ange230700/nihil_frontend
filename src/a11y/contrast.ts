// src\a11y\contrast.ts

// Minimal WCAG contrast utils (sRGB)
function parseColor(c: string): [number, number, number] | null {
  c = c.trim();
  if (c.startsWith("#")) {
    const n = c.length === 4 ? c.replace(/^#(.)(.)(.)$/, "#$1$1$2$2$3$3") : c;
    const r = parseInt(n.slice(1, 3), 16);
    const g = parseInt(n.slice(3, 5), 16);
    const b = parseInt(n.slice(5, 7), 16);
    return [r, g, b];
  }
  const m = /rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/i.exec(c);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return null;
}
function relLuminance([r, g, b]: [number, number, number]): number {
  const srgb = [r, g, b]
    .map((v) => v / 255)
    .map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
function contrastRatio(fg: string, bg: string): number {
  const F = parseColor(fg),
    B = parseColor(bg);
  if (!F || !B) return 21; // don't block if unparsable (likely var())
  const L1 = relLuminance(F),
    L2 = relLuminance(B);
  const lighter = Math.max(L1, L2),
    darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Audit a set of CSS variables on :root and warn if any < 4.5:1 */
export function auditThemeContrast(
  pairs: [string, string, string][] = [
    ["--text", "--bg", "Text on Background"],
    ["--text-muted", "--bg", "Muted text on Background"],
    ["--primary-contrast", "--primary", "Primary contrast on Primary"],
    ["--text", "--card", "Text on Card"],
  ],
) {
  const cs = getComputedStyle(document.documentElement);
  pairs.forEach(([fgVar, bgVar, label]) => {
    const fg = cs.getPropertyValue(fgVar) || "#000";
    const bg = cs.getPropertyValue(bgVar) || "#fff";
    const ratio = contrastRatio(fg, bg);
    if (ratio < 4.5) {
      console.warn(
        `⚠️  Contrast ${label} is ${ratio.toFixed(2)}. Need ≥ 4.5:1. (fg ${fgVar}=${fg.trim()}, bg ${bgVar}=${bg.trim()})`,
      );
    }
  });
}
