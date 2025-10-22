const fs = require('fs');
const path = require('path');

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy public folder
if (fs.existsSync('public')) {
  console.log('Copying public folder...');
  copyDir('public', '.next/standalone/public');
}

// Copy .next/static folder
if (fs.existsSync('.next/static')) {
  console.log('Copying .next/static folder...');
  copyDir('.next/static', '.next/standalone/.next/static');
}

console.log('Standalone build prepared successfully!');
