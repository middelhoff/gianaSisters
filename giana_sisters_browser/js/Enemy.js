export default class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 50;
        this.direction = -1; // -1 left, 1 right
        this.dead = false;
    }

    update(dt, level) {
        if (this.dead) return;

        this.x += this.speed * this.direction * dt;

        // Simple turn around logic
        // If hits wall or about to fall off ledge
        const tileSize = level.tileSize;
        const centerX = this.x + this.width / 2;
        const bottom = Math.floor((this.y + this.height + 1) / tileSize);

        // Check wall ahead
        const nextTileX = this.direction > 0 ? Math.floor((this.x + this.width + 1) / tileSize) : Math.floor((this.x - 1) / tileSize);
        const currentRow = Math.floor(this.y / tileSize);

        if (level.isSolid(nextTileX, currentRow)) {
            this.direction *= -1;
        }

        // Check ledge ahead (optional, maybe they just fall)
        const nextFloorX = this.direction > 0 ? Math.floor((this.x + this.width) / tileSize) : Math.floor(this.x / tileSize);
        if (!level.isSolid(nextFloorX, bottom)) {
            this.direction *= -1;
        }
    }

    draw(ctx) {
        if (this.dead) return;

        ctx.fillStyle = '#FF0000'; // Red
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Eyes
        ctx.fillStyle = 'white';
        if (this.direction < 0) {
            ctx.fillRect(this.x + 4, this.y + 8, 8, 8);
            ctx.fillRect(this.x + 16, this.y + 8, 8, 8);
        } else {
            ctx.fillRect(this.x + 8, this.y + 8, 8, 8);
            ctx.fillRect(this.x + 20, this.y + 8, 8, 8);
        }
    }
}
