// Copy the standalone website into dist for hosting.
import { copyFile, cp, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js', 'favicon.svg']) {
  await copyFile(file, `dist/${file}`);
}
await cp('images', 'dist/images', { recursive: true });
console.log('Website ready in dist/');
