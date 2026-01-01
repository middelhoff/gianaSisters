export default class Diamond {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.collected = false;

        // Floating animation
        this.baseY = y;
        this.floatOffset = 0;
    }

    update(dt) {
        this.floatOffset += dt * 5;
        this.y = this.baseY + Math.sin(this.floatOffset) * 5;
    }

    draw(ctx) {
        if (this.collected) return;

        ctx.fillStyle = '#00FFFF'; // Cyan

        // diamond shape
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height / 2);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height);
        ctx.lineTo(this.x, this.y + this.height / 2);
        ctx.closePath();
        ctx.fill();
    }
}
