const piecesZone = document.getElementById("pieces-zone");
const dropArea = document.getElementById("drop-area");
const celebration = document.getElementById("celebration");

let currentLevel = 1;

function generatePieces() {
  // Limpa a área de peças e slots
  piecesZone.innerHTML = "";
  dropArea.innerHTML = "";
  celebration.classList.add("hidden");
  celebration.classList.remove("show");

  // Define os números das peças com base no nível atual
  const start = currentLevel === 1 ? 1 : 6;

  // Gera as peças na área inicial
  const numbers = Array.from({ length: 5 }, (_, i) => start + i);
  numbers.sort(() => Math.random() - 0.5); // Embaralha as peças

  numbers.forEach((num, index) => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.dataset.number = num;
    piece.style.backgroundImage = `url('img/${num}.png')`;
    piece.style.position = "absolute";
    piece.style.left = `${index * 110}px`; // Posicionamento horizontal espaçado
    piece.style.top = `${Math.random() * 150}px`; // Posicionamento aleatório vertical

    // Permite arrastar
    piece.draggable = true;
    piece.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", num);
      piece.classList.add("dragging");
    });
    piece.addEventListener("dragend", () => {
      piece.classList.remove("dragging");
    });

    piecesZone.appendChild(piece);
  });

  // Cria os slots na área de drop (de baixo para cima no layout e no DOM)
  for (let i = 1; i <= 5; i++) {
    const slot = document.createElement("div");
    slot.classList.add("drop-slot");
    slot.dataset.slot = i; // Slot numerado de 1 (base) a 5 (topo)

    // Evento para permitir soltar peças no slot
    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    // Evento para soltar a peça no slot
    slot.addEventListener("drop", (e) => {
      e.preventDefault();
      const number = parseInt(e.dataTransfer.getData("text/plain"));
      const draggedPiece = document.querySelector(`.piece[data-number='${number}']`);
      const slotNumber = parseInt(slot.dataset.slot);

      // Valida se a peça pode ser colocada no slot atual
      if (
        slotNumber === 1 || // Base sempre pode receber a peça número 1 ou 6
        (slotNumber > 1 &&
          dropArea.querySelector(`.drop-slot[data-slot='${slotNumber - 1}']`).hasChildNodes() &&
          number === slotNumber + (currentLevel === 1 ? 0 : 5))
      ) {
        // Coloca a peça no slot
        draggedPiece.style.position = "relative";
        draggedPiece.style.left = "0";
        draggedPiece.style.top = "0";
        slot.appendChild(draggedPiece);

        console.log(
          `Peça ${number} posicionada corretamente no slot ${slotNumber}`
        );

        // Checa se todos os slots foram preenchidos corretamente
        if (checkCompletion()) {
          console.log("Fase concluída!");
          celebration.classList.remove("hidden");
          const nextLevelBtn = document.getElementById("next-level-btn");
          const restartBtn = document.getElementById("restart-btn");

          if (currentLevel === 2) {
            nextLevelBtn.classList.add("hidden");
            restartBtn.classList.remove("hidden");
          } else {
            nextLevelBtn.classList.remove("hidden");
          }
        }
      } else {
        console.log(
          `Peça ${number} posicionada INCORRETAMENTE no slot ${slotNumber}`
        );
        alert("Você precisa empilhar as peças na ordem correta!");
      }
    });

    dropArea.appendChild(slot); // Adiciona os slots na ordem correta no DOM
  }
}

// Verifica se todos os slots foram preenchidos corretamente
function checkCompletion() {
    const start = currentLevel === 1 ? 1 : 6;
    const slots = Array.from(dropArea.querySelectorAll(".drop-slot"));
  
    const isComplete = slots.every((slot) => {
      const slotNumber = parseInt(slot.dataset.slot);
      const piece = slot.firstChild;
  
      if (!piece) {
        console.log(`Slot ${slotNumber} está vazio.`);
        return false;
      }
  
      const pieceNumber = parseInt(piece.dataset.number);
      const expectedNumber = start + slotNumber - 1;
  
      if (pieceNumber !== expectedNumber) {
        console.log(
          `Peça ${pieceNumber} está no slot ${slotNumber}, mas o esperado era ${expectedNumber}.`
        );
        return false;
      }
  
      return true;
    });
  
    if (isComplete) {
      console.log("Todos os slots preenchidos corretamente!");
      celebration.classList.add("show"); // Adiciona a classe para exibir a celebração
      celebration.classList.remove("hidden");
    } else {
      console.log("Ainda faltam peças ou estão no slot errado.");
    }
  
    return isComplete;
  }
  

// Inicializa os eventos e configurações do jogo
document.addEventListener("DOMContentLoaded", () => {
  generatePieces();

  const nextLevelBtn = document.getElementById("next-level-btn");
  const restartBtn = document.getElementById("restart-btn");

  nextLevelBtn.addEventListener("click", () => {
    currentLevel++;
    generatePieces();
  });

  restartBtn.addEventListener("click", () => {
    currentLevel = 1;
    generatePieces();
  });
});
