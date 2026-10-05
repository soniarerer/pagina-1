const fs = require('fs');
try {
  const code = fs.readFileSync('script.js', 'utf8');
  new Function(code);
  console.log('JS OK');
} catch (error) {
  console.error(error.stack);
  process.exit(1);
}
