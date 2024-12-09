document.addEventListener('DOMContentLoaded', () => {
    // Função para narrar uma mensagem
    function narrate(message) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'pt-BR'; // Configura a linguagem para Português do Brasil
        synth.speak(utterance);
    }

    // Iniciar a narração após interação com o botão
    const startButton = document.getElementById('start-button');

    startButton.addEventListener('click', () => {
        narrate('Vamos colorir com a Naia! Escolha a cor e pinte o desenho.');
    });
});
