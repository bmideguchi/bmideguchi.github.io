document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const gameCover = document.getElementById('game-cover');
    const game = document.getElementById('game');
    const svgContainer = document.getElementById('svg-container');

    // Lógica para iniciar o jogo
    startButton.addEventListener('click', () => {
        gameCover.style.display = 'none';
        game.style.display = 'flex'; // Garante que #game use Flexbox
    });

    let selectedColor = 'red';

    // Função para converter cores para RGB
    function colorToRgb(color) {
        const tempElement = document.createElement('div');
        tempElement.style.color = color;
        document.body.appendChild(tempElement);
        const computedColor = getComputedStyle(tempElement).color;
        document.body.removeChild(tempElement);
        return computedColor;
    }

    // Função para calcular a luminosidade da cor
    function getLuminosity(color) {
        const rgb = color.match(/\d+/g).map(Number); // Extrai valores RGB
        const [r, g, b] = rgb;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b; // Calcula a luminosidade perceptual
    }

    // Handle color selection
    document.querySelectorAll('.color').forEach(colorDiv => {
        colorDiv.addEventListener('click', () => {
            selectedColor = colorDiv.getAttribute('data-color');
        });
    });

    // Passo 1: Marcar elementos não editáveis com base na luminosidade
    const svgElements = svgContainer.querySelectorAll('path, rect, circle, polygon, polyline, ellipse');
    svgElements.forEach(element => {
        const computedFill = window.getComputedStyle(element).fill;

        // Ignorar elementos sem preenchimento explícito
        if (!computedFill || computedFill === 'none') {
            return; // Elementos sem preenchimento são sempre editáveis
        }

        const rgbColor = colorToRgb(computedFill);

        // Garantir que branco nunca seja considerado não editável
        if (rgbColor === 'rgb(255, 255, 255)') {
            return; // Branco é sempre editável
        }

        const luminosity = getLuminosity(rgbColor);

        // Se a cor for muito escura (luminosidade < 50), marque como não editável
        if (luminosity < 50) {
            element.classList.add('non-editable');
        }
    });

    // Passo 2: Marcar elementos como "editable" se não forem "non-editable"
    svgElements.forEach(element => {
        if (!element.classList.contains('non-editable')) {
            element.classList.add('editable');
        }
    });

    // Tornar elementos editáveis interativos
    svgElements.forEach(element => {
        element.addEventListener('click', () => {
            // Só permitir edição para elementos com a classe "editable"
            if (!element.classList.contains('editable')) {
                return;
            }

            // Aplicar a nova cor
            element.style.fill = selectedColor;
            element.setAttribute('fill', selectedColor); // Compatibilidade
        });
    });
});
