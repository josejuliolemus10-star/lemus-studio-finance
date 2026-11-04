const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(distPath, 'utf8');

// Replace module script with plain script for flawless file:// execution
html = html.replace('<script type="module" crossorigin>', '<script>');

// Extract script and verify syntax
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
if (scriptMatch) {
  try {
    new Function(scriptMatch[1]);
    console.log('✅ Syntax verification PASSED: 100% valid JavaScript!');
  } catch (err) {
    console.error('❌ Syntax error in bundle:', err.message);
    process.exit(1);
  }
} else {
  console.warn('⚠️ No <script> tag found to verify.');
}

// Write to Desktop index.html and Conta index_offline.html
const desktopPath = 'C:/Users/josej/OneDrive/Desktop/index.html';
const contaOfflinePath = path.join(__dirname, 'index_offline.html');

fs.writeFileSync(desktopPath, html, 'utf8');
fs.writeFileSync(contaOfflinePath, html, 'utf8');

console.log('✅ Successfully created:');
console.log('   - ' + desktopPath);
console.log('   - ' + contaOfflinePath);
