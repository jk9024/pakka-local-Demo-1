const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Crisp, premium SVG for Mana Ruchulu
const createSvg = (size, isMaskable = false) => {
  const padding = isMaskable ? Math.round(size * 0.12) : 0;
  const innerSize = size - padding * 2;
  
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ea580c"/>
        <stop offset="50%" stop-color="#f97316"/>
        <stop offset="100%" stop-color="#c2410c"/>
      </linearGradient>
      <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#ffedd5"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="${Math.max(2, Math.round(size * 0.015))}" stdDeviation="${Math.max(3, Math.round(size * 0.02))}" flood-color="#7c2d12" flood-opacity="0.35"/>
      </filter>
    </defs>

    <!-- Outer Rounded Background -->
    <rect width="${size}" height="${size}" rx="${isMaskable ? 0 : Math.round(size * 0.22)}" fill="url(#bgGrad)"/>
    
    <!-- Decorative Ambient Circle -->
    <circle cx="${size * 0.8}" cy="${size * 0.2}" r="${size * 0.4}" fill="#ffffff" opacity="0.08"/>
    
    <!-- Central Food Pot / Handi Motif -->
    <g transform="translate(${padding}, ${padding}) scale(${innerSize / 512})" filter="url(#shadow)">
      <!-- Steam lines -->
      <path d="M210 120 Q 220 90, 205 60 Q 190 30, 205 10" stroke="#ffffff" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.85"/>
      <path d="M256 110 Q 266 75, 250 45 Q 235 15, 250 -5" stroke="#ffffff" stroke-width="16" stroke-linecap="round" fill="none" opacity="0.95"/>
      <path d="M302 120 Q 312 90, 297 60 Q 282 30, 297 10" stroke="#ffffff" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.85"/>

      <!-- Handi Rim & Handles -->
      <ellipse cx="256" cy="180" rx="140" ry="24" fill="url(#potGrad)"/>
      <path d="M96 210 Q 70 230, 90 260 Q 105 250, 115 230 Z" fill="#ffedd5"/>
      <path d="M416 210 Q 442 230, 422 260 Q 407 250, 397 230 Z" fill="#ffedd5"/>

      <!-- Handi Clay Body -->
      <path d="M120 185 C 110 270, 130 360, 256 360 C 382 360, 402 270, 392 185 Z" fill="url(#potGrad)"/>

      <!-- Front Flame / Spice Emblem -->
      <path d="M256 215 C 275 255, 305 285, 275 325 C 240 345, 225 315, 235 285 C 220 300, 210 320, 230 335 C 210 330, 195 295, 220 265 C 235 245, 245 225, 256 215 Z" fill="#ea580c"/>

      <!-- Text / Brand "MR" Tag -->
      <text x="256" y="445" font-family="system-ui, -apple-system, sans-serif" font-size="54" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">MANA RUCHULU</text>
      <text x="256" y="490" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="700" fill="#fed7aa" text-anchor="middle">మన రుచులు</text>
    </g>
  </svg>
  `;
};

async function generateAll() {
  const configs = [
    { name: 'icon-192.png', size: 192, maskable: false },
    { name: 'icon-512.png', size: 512, maskable: false },
    { name: 'icon-maskable-512.png', size: 512, maskable: true },
    { name: 'apple-touch-icon.png', size: 180, maskable: false },
    { name: 'favicon-32x32.png', size: 32, maskable: false },
    { name: 'favicon-16x16.png', size: 16, maskable: false },
  ];

  for (const cfg of configs) {
    const svg = createSvg(cfg.size, cfg.maskable);
    const dest = path.join(iconsDir, cfg.name);
    await sharp(Buffer.from(svg))
      .resize(cfg.size, cfg.size)
      .png()
      .toFile(dest);
    console.log(`✓ Generated ${cfg.name} (${cfg.size}x${cfg.size})`);
  }
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
