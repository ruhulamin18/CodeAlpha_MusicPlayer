import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

function copyStaticDirectories() {
  return {
    name: 'copy-static-directories',
    generateBundle() {
      for (const directory of ['css', 'js']) {
        const directoryPath = path.resolve(__dirname, directory);
        for (const fileName of fs.readdirSync(directoryPath)) {
          const filePath = path.join(directoryPath, fileName);
          if (fs.statSync(filePath).isFile()) {
            this.emitFile({
              type: 'asset',
              fileName: `${directory}/${fileName}`,
              source: fs.readFileSync(filePath)
            });
          }
        }
      }
    }
  };
}

export default defineConfig(() => {
  return {
    publicDir: 'assets',
    plugins: [react(), tailwindcss(), copyStaticDirectories()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
