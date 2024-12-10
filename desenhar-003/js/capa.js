document.getElementById("startButton").addEventListener("click", () => {
  // Esconde a tela de capa e exibe a tela do jogo
  document.getElementById("coverScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
});
