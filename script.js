const games = [
    { folder: "colorir-001-casa", name: "Casa", category: "colorir" },
    { folder: "colorir-002-unicornio", name: "Unicornio", category: "colorir" },
    { folder: "colorir-003-cachorro", name: "cachorro", category: "colorir" },
    { folder: "relacionar-001-formas", name: "Relacionar formas", category: "relacionar"},
    { folder: "liguePontos-001", name: "Gato", category: "liguePontos"},
    { folder: "liguePontos-002", name: "Avião", category: "liguePontos"},
    { folder: "liguePontos-003", name: "Peixe", category: "liguePontos"},
    { folder: "liguePontos-004", name: "Porco", category: "liguePontos"},
    { folder: "liguePontos-005", name: "Pássaro", category: "liguePontos"},
    { folder: "empilhar-001", name: "empilhar números", category: "empilhar"}

];
const categoryColors = {
    colorir: "#ff5722",
    relacionar: "#2196f3",
    liguePontos: "#4caf50",
    empilhar: "#ffbd22"
};

function toggleDropdown() {
    const dropdown = document.querySelector('.dropdown');
    dropdown.classList.toggle('active');
}

function loadGames() {
    const container = document.getElementById('game-container');
    const activeCategories = Array.from(
        document.querySelectorAll("#sidebar input[type=checkbox]:checked")
    ).map(input => input.id.replace("filter-", ""));

    container.innerHTML = ""; // Clear current cards

    const filteredGames = games.filter(game =>
        activeCategories.includes(game.category)
    );

    filteredGames.forEach(game => {
        const card = document.createElement("div");
        card.classList.add("game-card");

        const ribbon = document.createElement("div");
        ribbon.classList.add("ribbon");
        ribbon.textContent = game.category;
        ribbon.style.setProperty("--ribbon-color", categoryColors[game.category]);

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
        card.appendChild(ribbon);
        card.appendChild(image);
        card.appendChild(info);
        container.appendChild(card);
    });
}

function populateFilters() {
    const sidebar = document.getElementById("sidebar").querySelector("div");
    sidebar.innerHTML = ""; // Clear existing filters

    const categories = [...new Set(games.map(game => game.category))];

    categories.forEach(category => {
        const wrapper = document.createElement("div");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `filter-${category}`;
        checkbox.checked = true;

        const label = document.createElement("label");
        label.htmlFor = `filter-${category}`;
        label.textContent = category;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        sidebar.appendChild(wrapper);

        checkbox.addEventListener("change", loadGames);
    });

    const dropdownContent = document.getElementById("dropdown-content").querySelector("div");
    dropdownContent.innerHTML = sidebar.innerHTML; // Copy filters to dropdown
}

document.addEventListener("DOMContentLoaded", () => {
    populateFilters();
    loadGames();
});
