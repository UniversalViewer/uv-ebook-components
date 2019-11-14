import { Config } from "@stencil/core";
import nodePolyfills from "rollup-plugin-node-polyfills";

export const config: Config = {
  namespace: "uv-ebook-extension",
  plugins: [
    nodePolyfills()
  ],
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null // disable service workers
    }
  ]
};
