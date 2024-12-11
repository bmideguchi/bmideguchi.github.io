document.addEventListener("DOMContentLoaded", () => {
  const screens = {
    cover: document.getElementById("coverScreen"),
    instruction: document.getElementById("instructionScreen"),
    game: document.getElementById("gameScreen"),
    win: document.getElementById("winScreen"),
    error: document.getElementById("errorScreen"),
  };
  const buttons = {
    start: document.getElementById("startButton"),
    play: document.getElementById("playButton"),
    retry: document.getElementById("retryButton"),
    check: document.getElementById("checkButton"),
  };
  const puzzleArea = document.getElementById("puzzleArea");
  const referenceArea = document.getElementById("referenceArea");
  const puzzleImagePath = "img/puzzle-image.jpg";
  const puzzleImage = new Image();
  puzzleImage.src = puzzleImagePath;

  puzzleImage.onload = () => {
    console.log("Puzzle image loaded.");
    setupGame();
  };

  const slotSize = 500; // A peça é o tamanho completo

  const showScreen = (screen) => {
    Object.values(screens).forEach((s) => s.classList.add("hidden"));
    screen.classList.remove("hidden");
  };

  const narrate = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    speechSynthesis.speak(utterance);
  };

  const rotations = [0, 90, 180, 270];

  const setupGame = () => {
    puzzleArea.innerHTML = "";
    referenceArea.innerHTML = "";

    // Criar a peça rotacionável
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = slotSize;
    canvas.height = slotSize;
    canvas.dataset.rotation = rotations[Math.floor(Math.random() * 4)]; // Rotação inicial aleatória

    ctx.translate(slotSize / 2, slotSize / 2);
    ctx.rotate((parseInt(canvas.dataset.rotation) * Math.PI) / 180);
    ctx.translate(-slotSize / 2, -slotSize / 2);
    ctx.drawImage(puzzleImage, 0, 0, slotSize, slotSize);

    canvas.classList.add("puzzle-piece");
    puzzleArea.appendChild(canvas);

    canvas.addEventListener("click", () => {
      const originalRotation = parseInt(canvas.dataset.rotation);
      const newRotation = (originalRotation + 90) % 360;
      canvas.dataset.rotation = newRotation;

      console.log("Piece clicked:", {
        originalRotation,
        newRotation,
      });

      ctx.clearRect(0, 0, slotSize, slotSize);
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Resetar transformações
      ctx.translate(slotSize / 2, slotSize / 2);
      ctx.rotate((newRotation * Math.PI) / 180);
      ctx.translate(-slotSize / 2, -slotSize / 2);
      ctx.drawImage(puzzleImage, 0, 0, slotSize, slotSize);
    });

    // Criar a referência fixa
    const referenceCanvas = document.createElement("canvas");
    const referenceCtx = referenceCanvas.getContext("2d");
    referenceCanvas.width = slotSize;
    referenceCanvas.height = slotSize;

    referenceCtx.drawImage(puzzleImage, 0, 0, slotSize, slotSize);
    referenceCanvas.classList.add("reference-piece");
    referenceArea.appendChild(referenceCanvas);
  };

  buttons.check.addEventListener("click", () => {
    const canvas = document.querySelector(".puzzle-piece");
    const currentRotation = parseInt(canvas.dataset.rotation);

    if (currentRotation === 0) {
      showScreen(screens.win);
    } else {
      showScreen(screens.error);
      setTimeout(() => showScreen(screens.game), 1000); // Volta ao jogo após 1 segundo
    }
  });

  buttons.start.addEventListener("click", () => {
    showScreen(screens.instruction);
    narrate("Clique na peça para rotacioná-la até que fique igual à referência. Depois, clique em verificar.");
  });

  buttons.play.addEventListener("click", () => {
    showScreen(screens.game);
    setupGame();
  });

  buttons.retry.addEventListener("click", () => {
    showScreen(screens.game);
    setupGame();
  });

  showScreen(screens.cover);
});
