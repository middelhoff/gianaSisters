export default class Assets {
    constructor() {
        this.images = {};
        this.isLoaded = false;
    }

    async loadAll() {
        this.images['giana'] = await this.loadImage('giana', 'assets/giana.png');
        this.isLoaded = true;
    }

    loadImage(name, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[name] = img;
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }
}
