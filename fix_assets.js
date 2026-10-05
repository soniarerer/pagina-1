const fs = require('fs');

const htmlPath = 'c:/Users/user/Desktop/para G/index.html';
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/src="img\/foto\.svg"/g, 'src="img/foto.jpg" onerror="this.onerror=null; this.src=\'img/foto.svg\';"');
fs.writeFileSync(htmlPath, html);

const sampleRate = 22050;
const seconds = 2;
const totalSamples = sampleRate * seconds;
const buffer = Buffer.alloc(44 + totalSamples * 2);

const writeString = (b, str, offset) => b.write(str, offset, 'ascii');
writeString(buffer, 'RIFF', 0);
buffer.writeUInt32LE(36 + totalSamples * 2, 4);
writeString(buffer, 'WAVE', 8);
writeString(buffer, 'fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(1, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
writeString(buffer, 'data', 36);
buffer.writeUInt32LE(totalSamples * 2, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  const time = i / sampleRate;
  const amplitude = Math.sin(2 * Math.PI * 220 * time) * 0.25 + Math.sin(2 * Math.PI * 330 * time) * 0.15;
  const sample = Math.round(Math.max(-1, Math.min(1, amplitude)) * 32767);
  buffer.writeInt16LE(sample, offset);
  offset += 2;
}

fs.writeFileSync('c:/Users/user/Desktop/para G/musica.wav', buffer);
console.log('Recursos actualizados');
