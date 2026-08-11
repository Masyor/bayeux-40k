const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'content/images');

// Helper to clean up folder names ("space_marines" -> "Space Marines")
function formatTitle(str) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Automatically scan subdirectories into Tabs
function getTabsFromFolders() {
  if (!fs.existsSync(imagesDir)) return [];
  const folders = fs.readdirSync(imagesDir, { withFileTypes: true });
  
  return folders
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'backgrounds')
    .map(dirent => {
      const folderName = dirent.name;
      const folderPath = path.join(imagesDir, folderName);
      
      const files = fs.readdirSync(folderPath);
      const imagePaths = files
        .filter(file => /\.(png|jpe?g|webp|svg)$/i.test(file))
        .map(file => `content/images/${folderName}/${file}`);

      return {
        title: formatTitle(folderName),
        images: imagePaths
      };
    });
}

// Automatically scan background images
function getBackgrounds() {
  const bgPath = path.join(imagesDir, 'backgrounds');
  if (!fs.existsSync(bgPath)) return [];
  return fs.readdirSync(bgPath)
    .filter(file => /\.(png|jpe?g|webp)$/i.test(file))
    .map(file => `content/images/backgrounds/${file}`);
}

const autoConfig = {
  config: {
    appTitle: "Imperial Tactica Construction Kit",
    appSub: "40k Tapestry",
    repository: "https://github.com/your-username/your-repo-name"
  },
  colors: ["#303030", "#871b1b", "#141464", "#b98c1a", "#336600", "#7b2b7a", "#F4F5F6"],
  tabs: getTabsFromFolders(),
  backgrounds: getBackgrounds(),
  fonts: [
    { font: "Cinzel", size: 28, uppercase: true },
    { font: "Augusta", size: 35, uppercase: false }
  ],
  brushes: []
};

// Write output directly to config.js
const fileContent = `var constants = ${JSON.stringify(autoConfig, null, 2)};`;
fs.writeFileSync(path.join(__dirname, 'config.js'), fileContent);

console.log('✅ Success: config.js generated automatically from content/images!');
