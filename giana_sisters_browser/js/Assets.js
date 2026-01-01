export default class Assets {
    constructor() {
        this.images = {};
        this.isLoaded = false;
    }

    async loadAll() {
        const rawGiana = await this.loadImage('giana_raw', 'assets/giana.jpg');
        this.images['giana'] = this.processSpriteSheet(rawGiana);
        this.isLoaded = true;
    }

    loadImage(name, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    processSpriteSheet(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Iterate through pixels (R, G, B, A)
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Calculate saturation: max(r,g,b) - min(r,g,b)
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max - min;
            const brightness = (r + g + b) / 3;

            // Background Removal Logic
            // The background is a checkerboard of various gray shades.
            // We want to remove low-saturation pixels (gray/white/black).
            // HOWEVER, the character has a BLACK jacket (low saturation, low brightness).
            // So we only remove pixels that are low saturation AND not too dark.
            // Background grays observed: ~90 to ~192.
            // Black jacket: < 50.

            if (saturation < 30 && brightness > 50) {
                data[i + 3] = 0; // Set Alpha to 0
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas; // Can be used as image source
    }
}
