const fs = require("fs");
const path = require("path");

// config
const PAGES_DIR = "docs";
const OUTPUT_DIR = "dist";
const LAYOUT_FILE = "layout/base.html"; 

// Recursively get all HTML files in the pages directory
function getAllHtmlFiles(dir, base = "") {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(base, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath, path.join(base, file)));
    } else if (
      file.endsWith(".html") ||
      file.endsWith(".js") ||
      file.endsWith(".css") ||
      file.endsWith(".scss") ||
      file.endsWith(".png") ||
      file.endsWith(".jpg") ||
      file.endsWith(".ico") ||
      file.endsWith(".jpeg") ||
      file.endsWith(".ttf") ||
      file.endsWith(".woff") ||
      file.endsWith(".woff2") ||
      file.endsWith(".otf") ||
      file.endsWith(".gif") ||
      file.endsWith(".svg")
    ) {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

// Build process
function buildSite() {
  const layout = fs.readFileSync(LAYOUT_FILE, "utf-8");
  const pages = getAllHtmlFiles(PAGES_DIR);

  // Clean dist folder
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const { fullPath, relPath } of pages) {
    if (
      fullPath.endsWith(".png") ||
      fullPath.endsWith(".jpg") ||
      fullPath.endsWith(".jpeg") ||
      fullPath.endsWith(".ico") ||
      fullPath.endsWith(".gif") ||
      fullPath.endsWith(".svg") ||
      fullPath.endsWith(".ttf") ||
      fullPath.endsWith(".otf") ||
      fullPath.endsWith(".woff") ||
      fullPath.endsWith(".woff2")
    ) {
      // Copy image files as binary
      const outPath = path.join(OUTPUT_DIR, relPath);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.copyFileSync(fullPath, outPath);
    } else {
      const content = fs.readFileSync(fullPath, "utf-8");
      let finalHtml = null;
      if (fullPath.endsWith(".html")) {
        finalHtml = layout.replace("{{ content }}", content);
      } else {
        finalHtml = content;
      }
      const outPath = path.join(OUTPUT_DIR, relPath);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, finalHtml, "utf-8");
    }
  }

  console.log("Site built!");
}

buildSite();