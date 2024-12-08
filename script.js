/** script.js **/
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("game-container");

    // JSON configuration for games
    const games = [
        { folder: "colorir-001-casa", name: "Casa" },
        { folder: "colorir-002-unicornio", name: "Unicornio" },
        { folder: "colorir-003-cachorro", name: "cachorro" }
    ];

    // Function to dynamically create game cards
    function loadGames() {
        games.forEach(game => {
            const card = document.createElement("div");
            card.classList.add("game-card");

            const image = document.createElement("div");
            image.classList.add("game-image");
            image.style.backgroundImage = `url(${game.folder}/catalog-icon/cover.svg)`;

            const info = document.createElement("div");
            info.classList.add("game-info");

            const title = document.createElement("h3");
            title.textContent = game.name;

            const link = document.createElement("a");
            link.href = `${game.folder}/index.html`;
            link.textContent = "Jogar";

            info.appendChild(title);
            info.appendChild(link);
            card.appendChild(image);
            card.appendChild(info);
            container.appendChild(card);
        });
    }

    loadGames();
});
