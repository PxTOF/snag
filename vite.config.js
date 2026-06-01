import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.join(root, "node_modules/react"),
      "react-dom": path.join(root, "node_modules/react-dom"),
      "framer-motion": path.join(root, "node_modules/framer-motion"),
      "lucide-react": path.join(root, "node_modules/lucide-react")
    }
  },
  server: {
    fs: {
      allow: ["/Users/drishventure/Downloads", "."]
    }
  }
});
