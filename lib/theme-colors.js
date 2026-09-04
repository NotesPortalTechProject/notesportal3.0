export const THEME_PARTICLE_COLORS = {
  purple: ["#a855f7", "#8b5cf6", "#c084fc", "#f5d0fe"],
};

function hexToHsl(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
  const hh = ((h % 360) + 360) % 360 / 360;
  const ss = s / 100;
  const ll = l / 100;
  if (ss === 0) {
    const v = Math.round(ll * 255);
    return [v, v, v];
  }
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const hue2rgb = (t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  return [
    Math.round(hue2rgb(hh + 1 / 3) * 255),
    Math.round(hue2rgb(hh) * 255),
    Math.round(hue2rgb(hh - 1 / 3) * 255),
  ];
}

function hslToHex(h, s, l) {
  return "#" + hslToRgb(h, s, l).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// Deltas below are calibrated from the app's original purple-500 scale
// (Tailwind purple 200-950) so a custom color reproduces the same
// lightness/saturation "shape" instead of a generic tint/shade ramp.
const STOP_DELTAS = {
  200: [9, 27],
  300: [6, 20],
  400: [4, 10],
  600: [-10, -9],
  700: [-19, -18],
  800: [-24, -26],
  900: [-25, -33],
  950: [-4, -44],
};

const PANEL_PROFILES = {
  a: [40, 17],
  b: [38, 11],
  c: [42, 14],
  d: [50, 25],
  e: [72, 14],
  f: [75, 22],
  g: [46, 8],
  h: [47, 11],
  i: [51, 14],
};

const TOAST_PROFILE = [64, 11];
const HUE_DELTAS = { indigo: -32, violet500: -13, violet600: -9, fuchsia600: 22 };

export const THEME_VAR_NAMES = [
  "--color-purple-200", "--color-purple-300", "--color-purple-400", "--color-purple-500",
  "--color-purple-600", "--color-purple-700", "--color-purple-800", "--color-purple-900", "--color-purple-950",
  "--color-indigo-500", "--color-violet-500", "--color-violet-600", "--color-fuchsia-600",
  "--theme-glow-500", "--theme-glow-600", "--theme-glow-violet-500",
  "--theme-panel-a", "--theme-panel-b", "--theme-panel-c", "--theme-panel-d", "--theme-panel-e",
  "--theme-panel-f", "--theme-panel-g", "--theme-panel-h", "--theme-panel-i", "--theme-toast-bg",
];

export function generateCustomThemeVars(hex) {
  const { h, s, l } = hexToHsl(hex);
  const vars = { "--color-purple-500": hex };

  for (const [stop, [ds, dl]] of Object.entries(STOP_DELTAS)) {
    vars[`--color-purple-${stop}`] = hslToHex(h, clamp(s + ds, 0, 100), clamp(l + dl, 4, 97));
  }

  for (const [key, [ps, pl]] of Object.entries(PANEL_PROFILES)) {
    vars[`--theme-panel-${key}`] = hslToHex(h, ps, pl);
  }
  vars["--theme-toast-bg"] = hslToHex(h, TOAST_PROFILE[0], TOAST_PROFILE[1]);

  const violetHue = h + HUE_DELTAS.violet500;
  vars["--color-indigo-500"] = hslToHex(h + HUE_DELTAS.indigo, 84, 67);
  vars["--color-violet-500"] = hslToHex(violetHue, 90, 66);
  vars["--color-violet-600"] = hslToHex(h + HUE_DELTAS.violet600, 83, 58);
  vars["--color-fuchsia-600"] = hslToHex(h + HUE_DELTAS.fuchsia600, 69, 49);

  vars["--theme-glow-500"] = hslToRgb(h, s, l).join(" ");
  const [ds600, dl600] = STOP_DELTAS[600];
  vars["--theme-glow-600"] = hslToRgb(h, clamp(s + ds600, 0, 100), clamp(l + dl600, 4, 97)).join(" ");
  vars["--theme-glow-violet-500"] = hslToRgb(violetHue, 90, 66).join(" ");

  return vars;
}

export function getParticleColors(theme, customColor) {
  if (theme === "custom" && customColor) {
    const { h, s, l } = hexToHsl(customColor);
    return [
      customColor,
      hslToHex(h + HUE_DELTAS.violet500, 90, 66),
      hslToHex(h, clamp(s + STOP_DELTAS[400][0], 0, 100), clamp(l + STOP_DELTAS[400][1], 4, 97)),
      hslToHex(h, clamp(s + STOP_DELTAS[200][0], 0, 100), clamp(l + STOP_DELTAS[200][1], 4, 97)),
    ];
  }
  return THEME_PARTICLE_COLORS[theme] || THEME_PARTICLE_COLORS.purple;
}
