export default class Input {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            action: false
        };

        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    handleKey(e, isPressed) {
        switch (e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.keys.left = isPressed;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.keys.right = isPressed;
                break;
            case 'ArrowUp':
            case 'KeyW':
            case 'Space':
                this.keys.jump = isPressed;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.keys.down = isPressed;
                break;
            case 'ControlLeft':
            case 'ControlRight':
                this.keys.action = isPressed;
                break;
        }
    }
}
