import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/main.ts"),
            name: "tinymaps",
            fileName: (format) => `tinymaps.${format}.js`,
        },
    },
    plugins: [dts()],
});
