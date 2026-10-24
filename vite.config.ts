import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

// Mesmo cálculo de react-router.config.ts (os dois precisam concordar).
const base = `/${(process.env.BASE_PATH ?? "/").replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");

export default defineConfig({
  base,
  plugins: [reactRouter()],
});
