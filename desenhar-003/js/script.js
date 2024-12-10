document.addEventListener("DOMContentLoaded", () => {
  // Referências aos elementos
  const startButton = document.getElementById("startButton");
  const coverScreen = document.getElementById("coverScreen");
  const gameScreen = document.getElementById("gameScreen");

  const backgroundCanvas = document.getElementById("backgroundCanvas");
  const backgroundCtx = backgroundCanvas.getContext("2d");
  const drawingCanvas = document.getElementById("drawingCanvas");
  const drawingCtx = drawingCanvas.getContext("2d");

  const backgroundImage = new Image();
  backgroundImage.src = "img/desenhar.svg"; // Caminho para a imagem de fundo

  // Variáveis para controle de desenho
  let currentColor = "#000000";
  let currentSize = 3;
  let isDrawing = false;
  let isErasing = false;
  let lastX = 0;
  let lastY = 0;
  let drawingData = []; // Para armazenar o desenho

  let savedDrawingData = null; // Variável para armazenar os dados do desenho

  // Resolução inicial do canvas (700x700)
  const initialCanvasSize = 700;

  const scaleFactor = 0.9; // Reduz para 80% do tamanho atual

  // Função de redimensionamento do container e canvas
  function resizeCanvas() {
    const container = document.querySelector('.container');
    const toolbarWidth = document.querySelector('.controls').offsetWidth; // Largura da barra de ferramentas
    const windowWidth = window.innerWidth; // Largura da janela
    const windowHeight = window.innerHeight; // Altura da janela

    const aspectRatio = 16 / 9; // Proporção 16:9

    // Calcular a razão entre largura e altura
    const widthHeightRatio = windowWidth / windowHeight;

    let newWidth, newHeight;

    // Se a razão entre largura e altura for menor que 16:9, a largura é o limitador
    if (widthHeightRatio < aspectRatio) {
      newWidth = windowWidth;
      newHeight = newWidth / aspectRatio; // Ajusta a altura proporcionalmente
    } else {
      newHeight = windowHeight;
      newWidth = newHeight * aspectRatio; // Ajusta a largura proporcionalmente
    }

    // Ajustar as dimensões do container
    container.style.width = `${newWidth + toolbarWidth}px`; // Tamanho total do container
    container.style.height = `${newHeight}px`;

    const reducedWidth = newWidth * scaleFactor;
    const reducedHeight = newHeight * scaleFactor;

    // Ajustar o tamanho visível dos canvases para ocupar o espaço do container
    backgroundCanvas.style.width = `${reducedHeight}px`;
    backgroundCanvas.style.height = `${reducedHeight}px`;
    drawingCanvas.style.width = `${reducedHeight}px`;
    drawingCanvas.style.height = `${reducedHeight}px`;

    // Manter a resolução interna do canvas para 700x700 (ou outro valor fixo)
    backgroundCanvas.width = initialCanvasSize;
    backgroundCanvas.height = initialCanvasSize;
    drawingCanvas.width = initialCanvasSize;
    drawingCanvas.height = initialCanvasSize;

    console.log("Dimensões do container e canvas ajustadas:", newWidth, newHeight);

    // Limpar o canvas e desenhar a imagem de fundo com 5% de transparência
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.globalAlpha = 0.05;  // Transparência de 5% na imagem de fundo
    backgroundCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.globalAlpha = 1;  // Resetar a opacidade para 100%

    // Se o desenho foi armazenado, restaurar os dados
    if (savedDrawingData) {
      drawingCtx.putImageData(savedDrawingData, 0, 0); // Restaurar o desenho do usuário
      console.log("Desenho restaurado no drawingCanvas.");
    }
    
  }

  // Carregar a imagem de fundo e inicializar o redimensionamento
  backgroundImage.onload = resizeCanvas;

  // Listener para redimensionar o canvas dinamicamente
  window.addEventListener("resize", resizeCanvas);

  // Função para iniciar o jogo com narração
  function startGameWithNarration() {
    coverScreen.classList.add("hidden"); // Esconde a tela de capa
    gameScreen.classList.remove("hidden"); // Exibe o jogo

    // Narração: "Contorne o desenho e depois pinte com as suas cores favoritas!"
    const utterance = new SpeechSynthesisUtterance("Contorne o desenho e depois pinte com as suas cores favoritas!");
    utterance.lang = "pt-BR"; // Definir o idioma da narração para português
    speechSynthesis.speak(utterance); // Executar a narração
  }

  startButton.addEventListener("click", startGameWithNarration);

  // Funções de desenho
  function getCoordinates(e) {
    const rect = drawingCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (drawingCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (drawingCanvas.height / rect.height);
    return { x, y };
  }

  // Mouse Events
  drawingCanvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    const { x, y } = getCoordinates(e);
    lastX = x;
    lastY = y;
  });

  drawingCanvas.addEventListener("mouseup", () => isDrawing = false);
  drawingCanvas.addEventListener("mouseout", () => isDrawing = false);

  drawingCanvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    const { x, y } = getCoordinates(e);

    if (isErasing) {
      drawingCtx.save();
      drawingCtx.globalCompositeOperation = "destination-out"; // Apagar o desenho
      drawingCtx.lineWidth = currentSize;
      drawingCtx.strokeStyle = "rgba(0,0,0,1)";
      drawingCtx.lineJoin = "round";
      drawingCtx.lineCap = "round";
      drawingCtx.beginPath();
      drawingCtx.moveTo(lastX, lastY);
      drawingCtx.lineTo(x, y);
      drawingCtx.stroke();
      drawingCtx.restore();
    } else {
      drawingCtx.globalCompositeOperation = "source-over"; // Desenho normal
      drawingCtx.strokeStyle = currentColor;
      drawingCtx.lineWidth = currentSize;
      drawingCtx.lineJoin = "round";
      drawingCtx.lineCap = "round";
      drawingCtx.beginPath();
      drawingCtx.moveTo(lastX, lastY);
      drawingCtx.lineTo(x, y);
      drawingCtx.stroke();

      // Armazenar o desenho
      drawingData.push({
        operation: "source-over",
        color: currentColor,
        size: currentSize,
        startX: lastX,
        startY: lastY,
        endX: x,
        endY: y
      });
    }

    [lastX, lastY] = [x, y];
  });

  // Touch Events
  drawingCanvas.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Previne o comportamento padrão
    isDrawing = true;
    const { x, y } = getCoordinates(e.touches[0]); // Considerar o primeiro toque
    lastX = x;
    lastY = y;
  });

  drawingCanvas.addEventListener("touchend", () => isDrawing = false);
  drawingCanvas.addEventListener("touchcancel", () => isDrawing = false);

  drawingCanvas.addEventListener("touchmove", (e) => {
    if (!isDrawing) return;

    const { x, y } = getCoordinates(e.touches[0]); // Considerar o primeiro toque

    if (isErasing) {
      drawingCtx.save();
      drawingCtx.globalCompositeOperation = "destination-out"; // Apagar o desenho
      drawingCtx.lineWidth = currentSize;
      drawingCtx.strokeStyle = "rgba(0,0,0,1)";
      drawingCtx.lineJoin = "round";
      drawingCtx.lineCap = "round";
      drawingCtx.beginPath();
      drawingCtx.moveTo(lastX, lastY);
      drawingCtx.lineTo(x, y);
      drawingCtx.stroke();
      drawingCtx.restore();
    } else {
      drawingCtx.globalCompositeOperation = "source-over"; // Desenho normal
      drawingCtx.strokeStyle = currentColor;
      drawingCtx.lineWidth = currentSize;
      drawingCtx.lineJoin = "round";
      drawingCtx.lineCap = "round";
      drawingCtx.beginPath();
      drawingCtx.moveTo(lastX, lastY);
      drawingCtx.lineTo(x, y);
      drawingCtx.stroke();

      // Armazenar o desenho
      drawingData.push({
        operation: "source-over",
        color: currentColor,
        size: currentSize,
        startX: lastX,
        startY: lastY,
        endX: x,
        endY: y
      });
    }

    [lastX, lastY] = [x, y];
  });

  // Função de selecionar cor
  document.querySelectorAll(".color").forEach((colorElement) => {
    colorElement.addEventListener("click", () => {
      isErasing = false;
      currentColor = colorElement.getAttribute("data-color");
    });
  });

  // Função de selecionar tamanho do pincel
  document.querySelectorAll(".tool.brush").forEach((brushElement) => {
    brushElement.addEventListener("click", () => {
      isErasing = false;
      currentSize = parseInt(brushElement.getAttribute("data-size"), 10);
    });
  });

  // Referência para o botão de tela cheia
const fullscreenButton = document.getElementById("fullscreenButton");

// Função para entrar em tela cheia
function enterFullScreen() {
  const element = document.documentElement; // O elemento que será colocado em tela cheia

  // Solicita que o navegador entre em modo de tela cheia
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) { // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) { // Chrome, Safari e Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { // IE/Edge
    element.msRequestFullscreen();
  }
}

// Função para sair do modo de tela cheia
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { // Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { // Chrome, Safari e Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { // IE/Edge
    document.msExitFullscreen();
  }
}

// Alternar entre entrar e sair de tela cheia
fullscreenButton.addEventListener("click", () => {
  if (!document.fullscreenElement &&    // Verifica se não está em tela cheia
    !document.mozFullScreenElement &&   // Firefox
    !document.webkitFullscreenElement && // Safari/Chrome
    !document.msFullscreenElement) {    // IE/Edge
    enterFullScreen();
  } else {
    exitFullScreen();
  }
});

  // Função de ativar a borracha
  document.querySelector(".tool.eraser").addEventListener("click", () => {
    isErasing = true;
  });

  // Limpar o canvas de desenho
  document.getElementById("clearCanvas").addEventListener("click", () => {
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingData = []; // Limpa o histórico de desenhos
    savedDrawingData = null; // Limpa os dados salvos
  });

  // Salvar os dados do desenho quando necessário
  drawingCanvas.addEventListener("mouseup", () => {
    savedDrawingData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
    console.log("Desenho salvo em savedDrawingData.");
  });
});
