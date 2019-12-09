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

export function addCssUnits(d: string): string {
  if (
    !cssUnits.some(u => {
      return d.includes(u);
    })
  ) {
    d += "px"; // default to px
  }
  return d;
}

export function waitFor(test: () => boolean,
  successCallback: () => void,
  failureCallback?: () => void,
  interval?: number,
  maxTries?: number,
  numTries?: number): void {

  if (!interval) { interval = 200; }
  if (!maxTries) { maxTries = 100; } // try 100 times over 20 seconds
  if (!numTries) { numTries = 0; }

  numTries += 1;

  if (numTries > maxTries) {
    if (failureCallback) { failureCallback(); }
  } else if (test()) {
    successCallback();
  } else {
    setTimeout(() => {
      waitFor(test, successCallback, failureCallback, interval, maxTries, numTries);
    }, interval);
  }
}
