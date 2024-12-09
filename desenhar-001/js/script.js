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

  // Criar canvas temporário para armazenar o desenho
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  // Variáveis para controle de desenho
  let currentColor = "#000000";
  let currentSize = 3;
  let isDrawing = false; // Variável de controle de desenho
  let isErasing = false;
  let lastX = 0;
  let lastY = 0;
  let drawingData = []; // Para armazenar o desenho

  // Função de redimensionamento dos canvases e container
  function resizeCanvas() {
    const container = document.querySelector('.container');
    const containerWidth = container.offsetWidth;

    // Ajustar os canvases para corresponder ao tamanho da div container
    const width = 720; // O canvas ocupa 720px de largura
    const height = 720; // O canvas ocupa 720px de altura

    // Ajustar o canvas
    backgroundCanvas.style.width = `${width}px`;
    backgroundCanvas.style.height = `${height}px`;
    drawingCanvas.style.width = `${width}px`;
    drawingCanvas.style.height = `${height}px`;

    // O tamanho interno do canvas permanece na resolução original da imagem
    backgroundCanvas.width = backgroundImage.width;
    backgroundCanvas.height = backgroundImage.height;
    drawingCanvas.width = backgroundImage.width;
    drawingCanvas.height = backgroundImage.height;

    // Limpar o canvas e desenhar a imagem de fundo com 5% de transparência
    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.globalAlpha = 0.05;  // Transparência de 5% na imagem de fundo
    backgroundCtx.drawImage(backgroundImage, 0, 0, backgroundCanvas.width, backgroundCanvas.height);
    backgroundCtx.globalAlpha = 1;  // Resetar a opacidade para 100%
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
  drawingCanvas.addEventListener("mousedown", (e) => {
    isDrawing = true; // Inicia o desenho
    const rect = drawingCanvas.getBoundingClientRect();
    lastX = (e.clientX - rect.left) * (drawingCanvas.width / rect.width);
    lastY = (e.clientY - rect.top) * (drawingCanvas.height / rect.height);
  });

  drawingCanvas.addEventListener("mouseup", () => isDrawing = false); // Interrompe o desenho
  drawingCanvas.addEventListener("mouseout", () => isDrawing = false); // Interrompe o desenho

  drawingCanvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return; // Não desenha se não estiver pressionando o mouse

    const rect = drawingCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (drawingCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (drawingCanvas.height / rect.height);

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

  // Função de ativar a borracha
  document.querySelector(".tool.eraser").addEventListener("click", () => {
    isErasing = true;
  });

  // Limpar o canvas de desenho
  document.getElementById("clearCanvas").addEventListener("click", () => {
    drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingData = []; // Limpa o histórico de desenhos
  });
});
