const fs = require("fs");
const path = require("path");

// config
const PAGES_DIR = "site";
const OUTPUT_DIR = "dist";
const BASE_LAYOUT_FILE = "layout/base.html";
const LISTING_LAYOUT_FILE = "layout/listing.html";
const THANKYOU_LAYOUT_FILE = "layout/thankyou.html";

// Recursively get all HTML and asset files
function getAllFiles(dir, base = "") {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(base, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, path.join(base, file)));
    } else {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

// Build process
function buildSite() {
  const baseLayout = fs.readFileSync(BASE_LAYOUT_FILE, "utf-8");
  const listingLayout = fs.readFileSync(LISTING_LAYOUT_FILE, "utf-8");
  const thankyouLayout = fs.readFileSync(THANKYOU_LAYOUT_FILE, "utf-8");
  const pages = getAllFiles(PAGES_DIR);

  // Clean dist folder
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const { fullPath, relPath } of pages) {
    const outPath = path.join(OUTPUT_DIR, relPath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });

    // Binary/static file extensions
    const binaryExts = [
      ".png", ".jpg", ".jpeg", ".ico", ".gif", ".svg",
      ".ttf", ".otf", ".woff", ".woff2"
    ];

    // If binary file...copy directly
    if (binaryExts.some(ext => fullPath.endsWith(ext))) {
      fs.copyFileSync(fullPath, outPath);
      continue;
    }

    // If HTML file...wrap in correct layout
    if (fullPath.endsWith(".html")) {
      const content = fs.readFileSync(fullPath, "utf-8");

      const normalizedPath = relPath.replace(/\\/g, '/').replace(/^\.\//, '');

      let layoutToUse = baseLayout;
      if (normalizedPath.startsWith("creations/sold/")) {
        layoutToUse = thankyouLayout;
      } else if (normalizedPath.startsWith("creations/")) {
        layoutToUse = listingLayout;
      }

      const finalHtml = layoutToUse.replace("{{ content }}", content);
      fs.writeFileSync(outPath, finalHtml, "utf-8");
    } else {
      // CSS, JS, etc...copy directly
      fs.copyFileSync(fullPath, outPath);
    }
  }

  console.log("Site built!");
}

buildSite();
