const fs = require('fs');
const html = fs.readFileSync('d:/NXRA/Ed-Tech/ed-tech-main/index.html', 'utf8');
const match = html.match(/<style>([\s\S]*?)<\/style>/);
if (match) {
  const css = '@import "tailwindcss";\n@config "../tailwind.config.js";\n' + match[1];
  fs.writeFileSync('d:/NXRA/Ed-Tech/edtech-platform/src/index.css', css);
  console.log('CSS updated');
}
