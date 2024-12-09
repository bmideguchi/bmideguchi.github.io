const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const backgroundImage = "img/pontos.svg"; // Nome da imagem de fundo
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Variáveis para manter a proporção da imagem e escala
let canvasWidth = 800; // Resolução original da imagem
let canvasHeight = 800;

// Canvas temporário para preservar estado em redimensionamento
const tempCanvas = document.createElement("canvas");
const tempCtx = tempCanvas.getContext("2d");

// Carregar a imagem de fundo
const img = new Image();
img.src = backgroundImage;
img.onload = () => {
  canvasWidth = img.width;
  canvasHeight = img.height;
  resizeCanvas(); // Configura o canvas inicial
};

// Função para redimensionar o canvas sem perder o desenho
function resizeCanvas() {
  // Salvar o desenho atual no canvas temporário
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.drawImage(canvas, 0, 0);

  // Ajustar o tamanho do canvas para corresponder à imagem original
  const aspectRatio = canvasWidth / canvasHeight;
  const availableWidth = window.innerWidth * 0.9; // 90% da largura da janela
  const availableHeight = window.innerHeight * 0.9; // 90% da altura da janela

  let newWidth, newHeight;
  if (availableWidth / availableHeight < aspectRatio) {
    newWidth = availableWidth;
    newHeight = availableWidth / aspectRatio;
  } else {
    newWidth = availableHeight * aspectRatio;
    newHeight = availableHeight;
  }

  // Ajustar o tamanho visível do canvas
  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;

  // O tamanho interno do canvas permanece na resolução original da imagem
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Redesenhar a imagem de fundo e o conteúdo salvo no canvas temporário
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Desenhar a imagem de fundo
  ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height); // Restaurar o desenho
}

// Listener para redimensionar o canvas dinamicamente
window.addEventListener("resize", resizeCanvas);

// Ajustar as coordenadas do mouse/touch para a escala
function getScaledCoordinates(event) {
  const rect = canvas.getBoundingClientRect(); // Tamanho visível do canvas
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);
  return { x, y };
}

// Iniciar desenho
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const { x, y } = getScaledCoordinates(e);
  [lastX, lastY] = [x, y];
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  const { x, y } = getScaledCoordinates(e);
  ctx.strokeStyle = "red"; // Cor do pincel
  ctx.lineWidth = 3; // Espessura do pincel
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
});

// Parar de desenhar
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

// Suporte ao toque (dispositivos móveis)
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  const { x, y } = getScaledCoordinates(touch);
  isDrawing = true;
  [lastX, lastY] = [x, y];
});

canvas.addEventListener("touchmove", (e) => {
  if (!isDrawing) return;
  const touch = e.touches[0];
  const { x, y } = getScaledCoordinates(touch);

  ctx.strokeStyle = "red"; // Cor do pincel
  ctx.lineWidth = 3; // Espessura do pincel
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  [lastX, lastY] = [x, y];
});

canvas.addEventListener("touchend", () => (isDrawing = false));
