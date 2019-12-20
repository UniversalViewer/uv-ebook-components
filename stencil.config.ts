import { Config } from "@stencil/core";
import nodePolyfills from "rollup-plugin-node-polyfills";

export const config: Config = {
  namespace: "uv-ebook-components",
  plugins: [
    nodePolyfills(),
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
  ],
  // testing: {
  //   browserHeadless: false,
  //   browserDevtools: true,
  //   browserSlowMo: 1000
  // }
  // copy: [
  //   {
  //     src: "test.html"
  //   }
  // ],
  globalStyle: "src/global/theme.css"
};
