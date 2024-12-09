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

  // Função de redimensionamento dos canvases e container
  function resizeCanvas() {
    const container = document.querySelector('.container');
    const containerWidth = container.offsetWidth;

    // Calcular o tamanho do canvas para manter a proporção 1:1 (quadrado)
    const size = Math.min(containerWidth * 0.7, 720); // Limitar o tamanho a 70% do container ou 720px
    const reducedSize = size * 0.95; // Reduzir o tamanho do canvas em 5%

    console.log("Novo tamanho calculado para o canvas (5% menor):", reducedSize);

    // Ajusta os canvases para o novo tamanho
    backgroundCanvas.style.width = `${reducedSize}px`;
    backgroundCanvas.style.height = `${reducedSize}px`;
    drawingCanvas.style.width = `${reducedSize}px`;
    drawingCanvas.style.height = `${reducedSize}px`;

    // O tamanho interno do canvas permanece na resolução original da imagem
    backgroundCanvas.width = backgroundImage.width;
    backgroundCanvas.height = backgroundImage.height;
    drawingCanvas.width = backgroundImage.width;
    drawingCanvas.height = backgroundImage.height;

    console.log("Dimensões internas do canvas após redimensionamento:", drawingCanvas.width, drawingCanvas.height);

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
