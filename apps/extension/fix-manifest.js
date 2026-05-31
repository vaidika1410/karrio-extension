const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
// Target both prod and dev builds if they exist
const targets = ['chrome-mv3-prod', 'chrome-mv3-dev'];

targets.forEach(target => {
    const buildDir = path.join(rootDir, 'build', target);
    if (!fs.existsSync(buildDir)) {
        console.log(`Build directory ${target} not found, skipping.`);
        return;
    }

    console.log(`Fixing build for ${target}...`);

    const rootManifestPath = path.join(rootDir, 'manifest.json');
    if (!fs.existsSync(rootManifestPath)) {
        console.error('Root manifest.json not found!');
        process.exit(1);
    }
    
    const rootManifest = JSON.parse(fs.readFileSync(rootManifestPath, 'utf8'));

    // 1. Copy all original source files to the build folder root.
    // This ensures that the root manifest's relative paths remain valid.
    const filesToCopy = [
      'popup.html',
      'popup.js',
      'background.js',
      'content.js',
      'content-karrio.js'
    ];

    filesToCopy.forEach(file => {
      const src = path.join(rootDir, file);
      const dest = path.join(buildDir, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`  Copied ${file}`);
      } else {
        console.warn(`  Warning: Source file ${file} not found.`);
      }
    });

    // 2. Prepare the final manifest.
    // Start with the root manifest as the absolute source of truth.
    let finalManifest = { ...rootManifest };

    // 3. Merge essential processed assets from Plasmo's generated manifest.
    // We primarily want Plasmo's generated icons because they are resized and processed.
    const buildManifestPath = path.join(buildDir, 'manifest.json');
    if (fs.existsSync(buildManifestPath)) {
        const plasmoManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
        
        // Use Plasmo's icons if they exist
        if (plasmoManifest.icons) {
            finalManifest.icons = plasmoManifest.icons;
        }
        
        // Ensure action icons are also preserved
        if (plasmoManifest.action && plasmoManifest.action.default_icon) {
            if (!finalManifest.action) finalManifest.action = {};
            finalManifest.action.default_icon = plasmoManifest.action.default_icon;
        }
        
        // If the root manifest didn't have a name or version, use Plasmo's (fallback)
        if (!finalManifest.name) finalManifest.name = plasmoManifest.name;
        if (!finalManifest.version) finalManifest.version = plasmoManifest.version;
    }

    // 4. Overwrite the build manifest with our fixed version.
    fs.writeFileSync(buildManifestPath, JSON.stringify(finalManifest, null, 2));
    console.log(`  Manifest fixed successfully for ${target}!`);
});
