export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "aurelia-theme";

/**
 * Runs before first paint to apply the stored (or system) theme and avoid a
 * light flash when the visitor prefers dark mode.
 */
export const themeInitScript = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
