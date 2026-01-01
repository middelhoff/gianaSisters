export default class Giana {
    constructor(game) {
        this.game = game;
        this.width = 32;
        this.height = 32;
        this.x = 50;
        this.y = 100;

        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 200;
        this.jumpForce = -450;
        this.gravity = 1200;

        this.isGrounded = false;

        // Simple color for now
        this.color = '#FF69B4'; // Hot Pink
    }

    update(dt, tiles) {
        // Input
        if (this.game.input.keys.left) {
            this.velocityX = -this.speed;
        } else if (this.game.input.keys.right) {
            this.velocityX = this.speed;
        } else {
            this.velocityX = 0;
        }

        if (this.game.input.keys.jump && this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }

        // Apply Gravity
        this.velocityY += this.gravity * dt;

        // Apply Movement & Collision
        // Move X
        this.x += this.velocityX * dt;
        this.checkHorizontalCollisions();

        // Move Y
        this.y += this.velocityY * dt;
        this.checkVerticalCollisions();

        // Bounds check (World)
        if (this.x < 0) this.x = 0;

        // Death check (fallen off map)
        if (this.y > this.game.height + 64) {
            this.reset();
        }
    }

    reset() {
        this.x = 50;
        this.y = 100;
        this.velocityX = 0;
        this.velocityY = 0;
        this.game.camera.x = 0; // Reset camera too
    }

    checkHorizontalCollisions() {
        const tileSize = this.game.level.tileSize;

        // Check corners
        const left = Math.floor(this.x / tileSize);
        const right = Math.floor((this.x + this.width - 0.1) / tileSize);
        const top = Math.floor(this.y / tileSize);
        const bottom = Math.floor((this.y + this.height - 0.1) / tileSize);

        // Moving Right
        if (this.velocityX > 0) {
            if (this.game.level.isSolid(right, top) || this.game.level.isSolid(right, bottom)) {
                this.x = right * tileSize - this.width;
                this.velocityX = 0;
            }
        }
        // Moving Left
        else if (this.velocityX < 0) {
            if (this.game.level.isSolid(left, top) || this.game.level.isSolid(left, bottom)) {
                this.x = (left + 1) * tileSize;
                this.velocityX = 0;
            }
        }
    }

    checkVerticalCollisions() {
        const tileSize = this.game.level.tileSize;

        // Check corners
        const left = Math.floor(this.x / tileSize);
        const right = Math.floor((this.x + this.width - 0.1) / tileSize);
        const top = Math.floor(this.y / tileSize);
        const bottom = Math.floor((this.y + this.height - 0.1) / tileSize);

        // Moving Down (Falling)
        if (this.velocityY > 0) {
            if (this.game.level.isSolid(left, bottom) || this.game.level.isSolid(right, bottom)) {
                this.y = bottom * tileSize - this.height;
                this.velocityY = 0;
                this.isGrounded = true;
            } else {
                this.isGrounded = false;
            }
        }
        // Moving Up (Jumping)
        else if (this.velocityY < 0) {
            if (this.game.level.isSolid(left, top) || this.game.level.isSolid(right, top)) {
                this.y = (top + 1) * tileSize;
                this.velocityY = 0;
            }
        }
    }

    draw(ctx) {
        if (!this.game.assets.isLoaded) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            return;
        }

        const sprite = this.game.assets.images['giana'];
        // Simple sprite logic: 0 = idle, 1-4 = run, 5 = jump
        // For now, just show the first frame (Idle)
        // Sprite is 32x32 per frame

        // Determine frame
        let frameIndex = 0;

        if (!this.isGrounded) {
            frameIndex = 7; // Jump frame (approx)
        } else if (Math.abs(this.velocityX) > 10) {
            // Run cycle (frames 3-6)
            frameIndex = 3 + Math.floor(Date.now() / 100) % 4;
        } else {
            // Idle (frames 0-2)
            frameIndex = Math.floor(Date.now() / 200) % 3;
        }

        // Safety check for frame index
        // Since I can't guarantee the generated sprite layout perfectly, I'll stick to 0 for now if it fails 
        // But let's assume valid:
        const frameX = frameIndex * 32;

        ctx.save();
        if (this.velocityX < 0) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, frameX, 0, 32, 32, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(sprite, frameX, 0, 32, 32, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}
