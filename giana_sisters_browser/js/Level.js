export default class Level {
    constructor(gameWidth, gameHeight) {
        this.tileSize = 32;
        this.rows = Math.ceil(gameHeight / this.tileSize);
        this.cols = 100; // Long level
        this.tiles = [];

        this.generateLevel();
    }

    generateLevel() {
        for (let r = 0; r < this.rows; r++) {
            this.tiles[r] = [];
            for (let c = 0; c < this.cols; c++) {
                if (r >= this.rows - 2) {
                    // Ground, but leave some gaps for jumping
                    if (c > 20 && c < 23) {
                        this.tiles[r][c] = 0;
                    } else {
                        this.tiles[r][c] = 1;
                    }
                } else if (r === this.rows - 6 && c > 5 && c < 12) {
                    // Platform 1
                    this.tiles[r][c] = 2;
                    // Diamond on top
                    if (c % 2 === 0) this.tiles[r - 1][c] = 3;
                } else if (r === this.rows - 9 && c > 15 && c < 20) {
                    // Platform 2 (Higher)
                    this.tiles[r][c] = 2;
                } else if (r === this.rows - 5 && c > 25 && c < 30) {
                    // Platform 3
                    this.tiles[r][c] = 2;
                    // Enemy on top
                    if (c === 27) this.tiles[r - 1][c] = 4;
                } else if (r === this.rows - 3 && c > 40 && c < 50) {
                    // Enemy patrol area
                    if (c === 45) this.tiles[r][c] = 4;
                } else {
                    // Random diamonds in air
                    if (r === this.rows - 5 && c > 30 && c < 35) {
                        this.tiles[r][c] = 3;
                    } else {
                        this.tiles[r][c] = 0;
                    }
                }
            }
        }
    }

    isSolid(col, row) {
        // Out of bounds checks
        if (col < 0 || col >= this.cols) return false; // Left/Right bounds -> pretend air?
        if (row < 0) return false; // Above top -> air
        if (row >= this.rows) return false; // Below bottom -> fall

        return this.tiles[row][col] !== 0;
    }

    draw(ctx, camera) {
        // Optimize drawing: only draw visible tiles
        const startCol = Math.floor(camera.x / this.tileSize);
        const endCol = startCol + Math.ceil(ctx.canvas.width / this.tileSize) + 1;

        for (let r = 0; r < this.rows; r++) {
            for (let c = startCol; c <= endCol && c < this.cols; c++) {
                const tile = this.tiles[r][c];
                if (tile !== 0) {
                    ctx.fillStyle = tile === 1 ? '#8B4513' : '#CD853F'; // Placeholder colors
                    // Use images if available? For now keeping placeholders for tiles
                    ctx.fillRect(c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize);

                    // Grid border for visual clarity
                    ctx.strokeStyle = 'black';
                    ctx.strokeRect(c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
    }
}
