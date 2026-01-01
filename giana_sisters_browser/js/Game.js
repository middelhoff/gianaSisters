import Input from './Input.js';
import Level from './Level.js';
import Giana from './Giana.js';
import Assets from './Assets.js';
import Diamond from './Diamond.js';
import Enemy from './Enemy.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.lastTime = 0;
        this.accumulatedTime = 0;
        this.timeStep = 1000 / 60; // 60 FPS

        this.input = new Input();
        this.assets = new Assets();
        this.level = new Level(this.width, this.height);
        this.camera = { x: 0, y: 0 };
        this.player = new Giana(this);

        this.entities = [];
        this.score = 0;

        this.parseLevelEntities();
    }

    parseLevelEntities() {
        const tileSize = this.level.tileSize;
        for (let r = 0; r < this.level.rows; r++) {
            for (let c = 0; c < this.level.cols; c++) {
                const tile = this.level.tiles[r][c];
                if (tile === 3) {
                    this.entities.push(new Diamond(c * tileSize + 8, r * tileSize + 8));
                    this.level.tiles[r][c] = 0; // Remove from map
                } else if (tile === 4) {
                    this.entities.push(new Enemy(c * tileSize, r * tileSize));
                    this.level.tiles[r][c] = 0; // Remove from map
                }
            }
        }
    }

    start() {
        this.assets.loadAll().then(() => {
            requestAnimationFrame(this.gameLoop.bind(this));
        });
    }

    gameLoop(timestamp) {
        let deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // Prevent spiral of death
        if (deltaTime > 100) deltaTime = 100;

        this.accumulatedTime += deltaTime;

        while (this.accumulatedTime >= this.timeStep) {
            this.update(this.timeStep / 1000); // Pass seconds
            this.accumulatedTime -= this.timeStep;
        }

        this.draw();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.level.tiles);

        // Update Entities
        this.entities.forEach(entity => entity.update(deltaTime, this.level));

        // Check Entity Collisions
        this.entities.forEach(entity => {
            if (entity.dead || entity.collected) return;

            if (this.checkCollision(this.player, entity)) {
                if (entity instanceof Diamond) {
                    entity.collected = true;
                    this.score += 100;
                } else if (entity instanceof Enemy) {
                    // Simple goomba stomp logic
                    if (this.player.velocityY > 0 && this.player.y + this.player.height - this.player.velocityY * deltaTime < entity.y) {
                        entity.dead = true;
                        this.player.velocityY = -250; // Bounce
                        this.score += 200;
                    } else {
                        // Player hit enemy
                        this.player.reset();
                    }
                }
            }
        });

        // Update Camera to follow player
        this.camera.x = this.player.x - this.width / 2 + this.player.width / 2;

        // Clamp camera
        if (this.camera.x < 0) this.camera.x = 0;
        if (this.camera.x > (this.level.cols * this.level.tileSize) - this.width) {
            this.camera.x = (this.level.cols * this.level.tileSize) - this.width;
        }
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.ctx.save();
        this.ctx.translate(-this.camera.x, 0);

        // Draw Level
        this.level.draw(this.ctx, this.camera);

        // Draw Entities
        this.entities.forEach(entity => entity.draw(this.ctx));

        // Draw Player
        this.player.draw(this.ctx);

        this.ctx.restore();

        // Draw UI (Score)
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.fillText(`SCORE: ${this.score}`, 20, 30);
    }
}
