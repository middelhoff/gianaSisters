import Game from './Game.js';

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const loadingScreen = document.getElementById('loading');

    // Simple loading simulation
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        const game = new Game(canvas);
        game.start();
    }, 1000);
});
