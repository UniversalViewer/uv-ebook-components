export const cssUnits: string[] = [
  "%",
  "ch",
  "cm",
  "em",
  "ex",
  "in",
  "mm",
  "pc",
  "pt",
  "px",
  "rem",
  "vh",
  "vmax",
  "vmin",
  "vw"
];

export const addCssUnits: (d: string) => string = (d: string) => {
  if (
    !cssUnits.some(u => {
      return d.includes(u);
    })
  ) {
    d += "px"; // default to px
  }
  return d;
};
