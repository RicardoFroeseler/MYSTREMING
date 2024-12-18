
let seriesData = []; // Dados das séries carregados do JSON
let currentPage = 1;
const pageSize = 28;

const genreContainer = document.getElementById("genre-container");
const cardContainer = document.getElementById("card-container");
const pagination = document.getElementById("pagination");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const seriesCount = document.getElementById("series-count");

// Carregar JSON externo
fetch('animesdetalhes.json')
    .then(response => response.json())
    .then(data => {
        seriesData = data;
        updateSeriesCount();
        initializeGenres();
        renderSeries();
    })
    .catch(error => console.error('Erro ao carregar o JSON:', error));

// Atualizar contador de séries
function updateSeriesCount() {
    seriesCount.textContent = `Total de Animes: ${seriesData.length}`;
}

// Inicializar categorias
function initializeGenres() {
    const genresSet = new Set();
    seriesData.forEach(serie => serie.genres.forEach(genre => genresSet.add(genre)));
    const genres = Array.from(genresSet);

    genres.forEach(genre => {
        const button = document.createElement("button");
        button.textContent = genre;
        button.onclick = () => filterByGenre(genre);
        genreContainer.appendChild(button);
    });
}

// Renderizar séries
function renderSeries(page = 1, filter = "", search = "") {
    currentPage = page; // Atualiza a página atual
    const filtered = seriesData.filter(serie => {
        const matchesSearch = search === "" || serie.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "" || serie.genres.includes(filter);
        return matchesSearch && matchesFilter;
    });

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    cardContainer.innerHTML = "";
    paginated.forEach(serie => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
                    <img src="${serie.poster_path}" alt="${serie.name}">
                    <h3>${serie.name}</h3>
                `;
        card.addEventListener("click", () => {
            // Redirecionar para a página de detalhes com o ID da série
            window.location.href = `Animes.html?id=${serie.id}`;
        });
        cardContainer.appendChild(card);
    });

    renderPagination(page, Math.ceil(filtered.length / pageSize));
}

// Paginação Dinâmica com Máximo de 5 Páginas
function renderPagination(current, total) {
    pagination.innerHTML = "";

    const maxVisiblePages = 5; // Número máximo de páginas visíveis
    const startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(total, startPage + maxVisiblePages - 1);

    if (current > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Anterior";
        prevButton.onclick = () => renderSeries(current - 1);
        pagination.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.className = i === current ? "active" : "";
        pageButton.onclick = () => renderSeries(i);
        pagination.appendChild(pageButton);
    }

    if (current < total) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Próxima";
        nextButton.onclick = () => renderSeries(current + 1);
        pagination.appendChild(nextButton);
    }
}

// Filtro por gênero
function filterByGenre(genre) {
    renderSeries(1, genre);
}

// Busca
searchForm.onsubmit = (e) => {
    e.preventDefault();
    renderSeries(1, "", searchInput.value);
};

// Redirecionamento para páginas específicas ao clicar nos botões
document.getElementById("btn-filmes").addEventListener("click", () => {
    window.location.href = "../FILMES/Catalago_filmes.html"; // Página de filmes
});

document.getElementById("btn-series").addEventListener("click", () => {
    window.location.href = "../SERIES/Catalago_series.html"; // Página de séries
});

document.getElementById("btn-animes").addEventListener("click", () => {
    window.location.href = "../ANIMES/Catalago_animes.html"; // Página de animes
});
