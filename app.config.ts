import {
  defineConfig,
  TanStackStartInputConfig,
} from "@tanstack/react-start/config";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "unenv";
import tsConfigPaths from "vite-tsconfig-paths";

let server: TanStackStartInputConfig["server"];
if (process.env.CF_PAGES === "1") {
  server = {
    preset: "cloudflare-pages",
    unenv: cloudflare,
  };
}
if (process.env.VERCEL === "1") {
  server = {
    preset: "vercel",
  };
}

export default defineConfig({
  // https://github.com/TanStack/router/discussions/2863?sort=new#discussioncomment-12458714
  tsr: {
    appDirectory: "./src",
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },
  server,
});
