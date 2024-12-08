document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameCover = document.getElementById('game-cover');
    const game = document.getElementById('game');
    const svgContainer = document.getElementById('svg-container');

    // Lógica para iniciar o jogo
    startButton.addEventListener('click', () => {
        gameCover.style.display = 'none';
        game.style.display = 'block';

        adjustSvgSize(); // Ajustar o tamanho do SVG na inicialização
    });

    let selectedColor = 'red';

    // Handle color selection
    document.querySelectorAll('.color').forEach(colorDiv => {
        colorDiv.addEventListener('click', () => {
            selectedColor = colorDiv.getAttribute('data-color');
        });
    });

    // Get SVG elements and make them interactive
    const svgElements = svgContainer.querySelectorAll('path, rect, circle, polygon, polyline, ellipse');
    svgElements.forEach(element => {
        element.addEventListener('click', () => {
            element.style.fill = selectedColor;
            element.setAttribute('fill', selectedColor); // Compatibilidade
        });
    });

    // Ajustar tamanho do SVG ao redimensionar a janela
    window.addEventListener('resize', adjustSvgSize);

    function adjustSvgSize() {
        const svgElement = svgContainer.querySelector('svg');
        if (svgElement) {
            // Obter dimensões da janela
            const maxWidth = window.innerWidth * 0.9; // 90% da largura da janela
            const maxHeight = window.innerHeight * 0.9; // 90% da altura da janela

            // Garantir que o SVG não ultrapasse os limites
            svgElement.style.maxWidth = `${maxWidth}px`;
            svgElement.style.maxHeight = `${maxHeight}px`;
        }
    }
});
