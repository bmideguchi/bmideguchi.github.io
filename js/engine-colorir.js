document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameCover = document.getElementById('game-cover');
    const game = document.getElementById('game');

    // Lógica para iniciar o jogo
    startButton.addEventListener('click', () => {
        gameCover.style.display = 'none';
        game.style.display = 'block';
    });

    let selectedColor = 'red';

    // Handle color selection
    document.querySelectorAll('.color').forEach(colorDiv => {
        colorDiv.addEventListener('click', () => {
            selectedColor = colorDiv.getAttribute('data-color');
        });
    });

    // Get SVG elements and make them interactive
    const svgContainer = document.getElementById('svg-container');
    const svgElements = svgContainer.querySelectorAll('path, rect, circle, polygon, polyline, ellipse');

    svgElements.forEach(element => {
        element.addEventListener('click', () => {
            element.style.fill = selectedColor;
            element.setAttribute('fill', selectedColor); // Compatibilidade
        });
    });
});
