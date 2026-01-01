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
        this.facingRight = true;

        // Animation State
        this.animTimer = 0;
        this.animSpeed = 0.15; // Seconds per frame
        this.currentFrameIndex = 0;
        this.currentAnim = 'idle';

        // Sprite Sheet Config
        // Based on analysis:
        // Grid stride ~90px. First sprite starts ~X=44.
        // Height ~90px. Feet at ~468. Top ~378.
        this.spriteConfig = {
            startX: 44,
            startY: 378,
            strideX: 90,
            width: 90,
            height: 90
        };

        this.animations = {
            idle: [0, 1, 2],
            run: [3, 4, 5],
            jump: [6]
        };
    }

    update(dt, tiles) {
        // Input
        if (this.game.input.keys.left) {
            this.velocityX = -this.speed;
            this.facingRight = false;
        } else if (this.game.input.keys.right) {
            this.velocityX = this.speed;
            this.facingRight = true;
        } else {
            this.velocityX = 0;
        }

        if (this.game.input.keys.jump && this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
        }

        // Apply Gravity
        this.velocityY += this.gravity * dt;

        // Move X
        this.x += this.velocityX * dt;
        this.checkHorizontalCollisions();

        // Move Y
        this.y += this.velocityY * dt;
        this.checkVerticalCollisions();

        // Bounds
        if (this.x < 0) this.x = 0;
        if (this.y > this.game.height + 64) {
            this.reset();
        }

        // Update Animation
        this.updateAnimation(dt);
    }

    updateAnimation(dt) {
        let newAnim = 'idle';

        if (!this.isGrounded) {
            newAnim = 'jump';
        } else if (Math.abs(this.velocityX) > 10) {
            newAnim = 'run';
        } else {
            newAnim = 'idle';
        }

        if (this.currentAnim !== newAnim) {
            this.currentAnim = newAnim;
            this.currentFrameIndex = 0;
            this.animTimer = 0;
        } else {
            this.animTimer += dt;
            if (this.animTimer >= this.animSpeed) {
                this.animTimer = 0;
                this.currentFrameIndex++;
                const frames = this.animations[this.currentAnim];
                if (this.currentFrameIndex >= frames.length) {
                    this.currentFrameIndex = 0;
                }
            }
        }
    }

    reset() {
        this.x = 50;
        this.y = 100;
        this.velocityX = 0;
        this.velocityY = 0;
        this.game.camera.x = 0;
    }

    checkHorizontalCollisions() {
        const tileSize = this.game.level.tileSize;
        const left = Math.floor(this.x / tileSize);
        const right = Math.floor((this.x + this.width - 0.1) / tileSize);
        const top = Math.floor(this.y / tileSize);
        const bottom = Math.floor((this.y + this.height - 0.1) / tileSize);

        if (this.velocityX > 0) {
            if (this.game.level.isSolid(right, top) || this.game.level.isSolid(right, bottom)) {
                this.x = right * tileSize - this.width;
                this.velocityX = 0;
            }
        } else if (this.velocityX < 0) {
            if (this.game.level.isSolid(left, top) || this.game.level.isSolid(left, bottom)) {
                this.x = (left + 1) * tileSize;
                this.velocityX = 0;
            }
        }
    }

    checkVerticalCollisions() {
        const tileSize = this.game.level.tileSize;
        const left = Math.floor(this.x / tileSize);
        const right = Math.floor((this.x + this.width - 0.1) / tileSize);
        const top = Math.floor(this.y / tileSize);
        const bottom = Math.floor((this.y + this.height - 0.1) / tileSize);

        if (this.velocityY > 0) {
            if (this.game.level.isSolid(left, bottom) || this.game.level.isSolid(right, bottom)) {
                this.y = bottom * tileSize - this.height;
                this.velocityY = 0;
                this.isGrounded = true;
            } else {
                this.isGrounded = false;
            }
        } else if (this.velocityY < 0) {
            if (this.game.level.isSolid(left, top) || this.game.level.isSolid(right, top)) {
                this.y = (top + 1) * tileSize;
                this.velocityY = 0;
            }
        }
    }

    draw(ctx) {
        if (!this.game.assets.isLoaded) return;

        const sprite = this.game.assets.images['giana'];

        // Calculate Source Coordinates
        const frames = this.animations[this.currentAnim];
        const frameId = frames[this.currentFrameIndex]; // e.g. 0, 1, ... 6

        const sx = this.spriteConfig.startX + (frameId * this.spriteConfig.strideX);
        const sy = this.spriteConfig.startY;
        const sw = this.spriteConfig.width;
        const sh = this.spriteConfig.height;

        ctx.save();

        // Horizontal Flip
        if (!this.facingRight) {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, sx, sy, sw, sh, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(sprite, sx, sy, sw, sh, this.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }
}
