document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameCover = document.getElementById('game-cover');
    const game = document.getElementById('game');
    const svgContainer = document.getElementById('svg-container');

    // Lógica para iniciar o jogo
    startButton.addEventListener('click', () => {
        gameCover.style.display = 'none';
        game.style.display = 'block';
    });

    let selectedColor = 'red';

    // Função para calcular a luminosidade da cor
    function getLuminosity(color) {
        if (!color) return 255; // Branco por padrão para cores indefinidas
        let r, g, b;

        // Caso a cor seja em formato HEX
        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            r = parseInt(hex.slice(0, 2), 16);
            g = parseInt(hex.slice(2, 4), 16);
            b = parseInt(hex.slice(4, 6), 16);
        } else if (color.startsWith('rgb')) {
            // Caso a cor seja em formato RGB
            const rgb = color.match(/\d+/g);
            [r, g, b] = rgb.map(Number);
        } else {
            return 255; // Branco por padrão para outros casos
        }

        // Calcula a luminosidade com a fórmula perceptual
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    // Handle color selection
    document.querySelectorAll('.color').forEach(colorDiv => {
        colorDiv.addEventListener('click', () => {
            selectedColor = colorDiv.getAttribute('data-color');
        });
    });

    // Marcar elementos não editáveis com base na luminosidade
    const svgElements = svgContainer.querySelectorAll('path, rect, circle, polygon, polyline, ellipse');
    svgElements.forEach(element => {
        const originalFill = element.getAttribute('fill') || element.style.fill;
        const luminosity = getLuminosity(originalFill);

        // Se a cor for muito escura (luminosidade < 50), marque como não editável
        if (luminosity < 50) {
            element.classList.add('non-editable');
        }

        // Tornar elementos interativos
        element.addEventListener('click', () => {
            // Impedir alteração em elementos não editáveis
            if (element.classList.contains('non-editable')) {
                return;
            }

            // Aplicar a nova cor
            element.style.fill = selectedColor;
            element.setAttribute('fill', selectedColor); // Compatibilidade

            // Se a nova cor for preta ou escura, remova a classe "non-editable"
            const newLuminosity = getLuminosity(selectedColor);
            if (newLuminosity < 50) {
                element.classList.remove('non-editable');
            }
        });
    });
});
