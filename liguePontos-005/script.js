const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const backgroundImage = "pontos.jpg"; // Substitua pelo nome da sua imagem
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Carregar a imagem de fundo
const img = new Image();
img.src = backgroundImage;
img.onload = () => {
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};

// Iniciar desenho
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  ctx.strokeStyle = "red"; // Cor do pincel
  ctx.lineWidth = 3; // Espessura do pincel
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Parar de desenhar
canvas.addEventListener("mouseup", () => (isDrawing = false));
canvas.addEventListener("mouseout", () => (isDrawing = false));

// Suporte ao toque (dispositivos móveis)
canvas.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  isDrawing = true;
  [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});

canvas.addEventListener("touchmove", (e) => {
  if (!isDrawing) return;
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  ctx.strokeStyle = "red"; // Cor do pincel
  ctx.lineWidth = 3; // Espessura do pincel
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
  [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
});

canvas.addEventListener("touchend", () => (isDrawing = false));
