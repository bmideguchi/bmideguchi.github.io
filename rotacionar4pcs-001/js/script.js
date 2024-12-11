document.addEventListener("DOMContentLoaded", () => {
    const screens = {
      cover: document.getElementById("coverScreen"),
      instruction: document.getElementById("instructionScreen"),
      game: document.getElementById("gameScreen"),
      win: document.getElementById("winScreen"),
    };
    const buttons = {
      start: document.getElementById("startButton"),
      play: document.getElementById("playButton"),
      retry: document.getElementById("retryButton"),
    };
    const puzzlePieces = document.getElementById("puzzlePieces");
    const puzzleArea = document.getElementById("puzzleArea");
    const instructionText = document.getElementById("instructionText");
    const puzzleImagePath = "img/puzzle-image.jpg";
    const puzzleImage = new Image();
    puzzleImage.src = puzzleImagePath;
  
    puzzleImage.onload = () => {
      console.log("Puzzle image loaded.");
    };
    const slotSize = 250;
    const rotations = [0, 90, 180, 270];
  
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };
  
    const showScreen = (screen) => {
      Object.values(screens).forEach((s) => s.classList.add("hidden"));
      screen.classList.remove("hidden");
    };
  
    const narrate = (text) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      speechSynthesis.speak(utterance);
    };
  
    const createCanvasPiece = (id, rotation, img, scaleX, scaleY) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = slotSize;
      canvas.height = slotSize;
  
      canvas.dataset.id = id;
      canvas.dataset.rotation = rotation; // Registrar a rotação inicial
  
      const srcX = (id % 2) * slotSize * scaleX;
      const srcY = Math.floor(id / 2) * slotSize * scaleY;
  
      ctx.translate(slotSize / 2, slotSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-slotSize / 2, -slotSize / 2);
      ctx.drawImage(img, srcX, srcY, slotSize * scaleX, slotSize * scaleY, 0, 0, slotSize, slotSize);
  
      canvas.draggable = true;
      canvas.classList.add("puzzle-piece");
      return canvas;
    };
  
    const generatePuzzlePieces = () => {
      puzzlePieces.innerHTML = "";
      const pieceOrder = [0, 1, 2, 3];
      shuffleArray(pieceOrder);
  
      const img = new Image();
      img.src = puzzleImagePath;
  
      img.onload = () => {
        const scaleX = img.width / (slotSize * 2);
        const scaleY = img.height / (slotSize * 2);
        pieceOrder.forEach((id) => {
          const rotation = rotations[Math.floor(Math.random() * rotations.length)];
          const canvas = createCanvasPiece(id, rotation, img, scaleX, scaleY);
          puzzlePieces.appendChild(canvas);
        });
      };
    };
  
    const setupPuzzleArea = () => {
      puzzleArea.innerHTML = "";
      puzzleArea.style.width = `${slotSize * 2}px`;
      puzzleArea.style.height = `${slotSize * 2}px`;
  
      for (let i = 0; i < 4; i++) {
        const slot = document.createElement("div");
        slot.classList.add("puzzle-slot");
        slot.dataset.id = i;
        slot.style.width = `${slotSize}px`;
        slot.style.height = `${slotSize}px`;
        slot.style.left = `${(i % 2) * slotSize}px`;
        slot.style.top = `${Math.floor(i / 2) * slotSize}px`;
        slot.style.position = "absolute";
        slot.style.backgroundImage = `url(${puzzleImagePath})`;
        slot.style.backgroundSize = "200% 200%";
        slot.style.backgroundPosition = `${(i % 2) * 100}% ${Math.floor(i / 2) * 100}%`;
        slot.style.opacity = "0.15";
        slot.style.border = "2px dashed #000";
  
        slot.addEventListener("dragover", (e) => e.preventDefault());
        slot.addEventListener("drop", (e) => {
          e.preventDefault();
          const pieceId = e.dataTransfer.getData("id");
          const piece = document.querySelector(`canvas[data-id='${pieceId}']`);
  
          if (!piece) {
            console.error("No piece found for the given ID:", pieceId);
            return;
          }
  
          const isCorrectSlot = slot.dataset.id === piece.dataset.id;
          const isCorrectRotation = parseInt(piece.dataset.rotation) % 360 === 0;
  
          if (isCorrectSlot && isCorrectRotation) {
            slot.appendChild(piece);
            piece.draggable = false;
            slot.style.opacity = "1";
  
            const allPlaced = document.querySelectorAll(".puzzle-slot canvas").length === 4;
            if (allPlaced) {
              showScreen(screens.win);
              document.getElementById("completedImage").style.backgroundImage = `url(${puzzleImagePath})`;
            }
          } else {
            console.warn("Piece dropped in the wrong slot or incorrect orientation:", {
              pieceId,
              slotId: slot.dataset.id,
              rotation: piece.dataset.rotation,
            });
          }
        });
  
        puzzleArea.appendChild(slot);
      }
    };
  
    puzzlePieces.addEventListener("click", (e) => {
        if (e.target.tagName === "CANVAS" && e.target.classList.contains("puzzle-piece")) {
          const piece = e.target;
          const ctx = piece.getContext("2d");
          const id = parseInt(piece.dataset.id);
      
          const originalRotation = parseInt(piece.dataset.rotation);
          const newRotation = (originalRotation + 90) % 360;
          piece.dataset.rotation = newRotation; // Atualizar a rotação
      
          console.log("Piece clicked:", {
            id: piece.dataset.id,
            originalRotation: originalRotation,
            newRotation: newRotation,
          });
      
          const scaleX = puzzleImage.width / (slotSize * 2);
          const scaleY = puzzleImage.height / (slotSize * 2);
          const srcX = (id % 2) * slotSize * scaleX;
          const srcY = Math.floor(id / 2) * slotSize * scaleY;
      
          // Garantir que o contexto seja reiniciado antes de redesenhar
          ctx.clearRect(0, 0, slotSize, slotSize);
          ctx.setTransform(1, 0, 0, 1, 0, 0); // Resetar transformações
          ctx.translate(slotSize / 2, slotSize / 2);
          ctx.rotate((newRotation * Math.PI) / 180);
          ctx.translate(-slotSize / 2, -slotSize / 2);
          ctx.drawImage(puzzleImage, srcX, srcY, slotSize * scaleX, slotSize * scaleY, 0, 0, slotSize, slotSize);
        }
      });
      
  
    puzzlePieces.addEventListener("dragstart", (e) => {
      if (e.target.tagName === "CANVAS" && e.target.classList.contains("puzzle-piece")) {
        const piece = e.target;
        e.dataTransfer.setData("id", piece.dataset.id);
      }
    });
  
    buttons.start.addEventListener("click", () => {
      showScreen(screens.instruction);
      narrate(instructionText.textContent);
    });
    buttons.play.addEventListener("click", () => {
      showScreen(screens.game);
      generatePuzzlePieces();
      setupPuzzleArea();
    });
    buttons.retry.addEventListener("click", () => {
      showScreen(screens.game);
      generatePuzzlePieces();
      setupPuzzleArea();
    });
  
    showScreen(screens.cover);
  });
  