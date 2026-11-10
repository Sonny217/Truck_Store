
"use strict";

// INVENTARIO DE CAMIONES
const trucks = [
  {
    id: 1,
    brand: "Freightliner",
    model: "Cascadia 2022",
    category: "tractocamion",
    categoryName: "TRACTOCAMIÓN",
    year: 2022,
    price: 89500,
    km: "85,000 km",
    transmission: "Automática",
    image: "https://images.unsplash.com/photo-1586191582151-f73872dfd183?w=800",
    description: "Potencia y eficiencia para largas distancias.",
    tag: "DESTACADO"
  },
  {
    id: 2,
    brand: "Volvo",
    model: "FH 500 2021",
    category: "tractocamion",
    categoryName: "TRACTOCAMIÓN",
    year: 2021,
    price: 78000,
    km: "110,000 km",
    transmission: "Automática",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    description: "Tecnología avanzada y máximo rendimiento.",
    tag: "OPORTUNIDAD"
  },
  {
    id: 3,
    brand: "Kenworth",
    model: "T800 2020",
    category: "volteo",
    categoryName: "VOLTEO",
    year: 2020,
    price: 69000,
    km: "125,000 km",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
    description: "Robustez y capacidad para trabajos exigentes.",
    tag: "DISPONIBLE"
  },
  {
    id: 4,
    brand: "Mack",
    model: "Granite 2023",
    category: "carga",
    categoryName: "CARGA PESADA",
    year: 2023,
    price: 105000,
    km: "45,000 km",
    transmission: "Automática",
    image: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=800",
    description: "Diseñado para transportar grandes cargas.",
    tag: "NUEVO INGRESO"
  },
  {
    id: 5,
    brand: "International",
    model: "LT 2022",
    category: "tractocamion",
    categoryName: "TRACTOCAMIÓN",
    year: 2022,
    price: 82000,
    km: "75,000 km",
    transmission: "Automática",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
    description: "Excelente equilibrio entre potencia y consumo.",
    tag: "DESTACADO"
  },
  {
    id: 6,
    brand: "Hino",
    model: "500 Series 2021",
    category: "carga",
    categoryName: "CARGA PESADA",
    year: 2021,
    price: 55000,
    km: "95,000 km",
    transmission: "Manual",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
    description: "Versatilidad para el transporte comercial.",
    tag: "DISPONIBLE"
  }
];

// ELEMENTOS DEL DOM
const truckGrid = document.getElementById("truckGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const inventoryCount = document.getElementById("inventoryCount");
const emptyState = document.getElementById("emptyState");
const cartCount = document.getElementById("cartCount");

// ESTADO
const favorites = new Set();

// FORMATEAR PRECIO
const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);

// CREAR TARJETA
function createTruckCard(truck) {
  const isFavorite = favorites.has(truck.id);

  return `
    <article class="truck-card">

      <div class="truck-image">
        <img
          src="${truck.image}"
          alt="${truck.brand} ${truck.model}"
          loading="lazy"
        >

        <span class="truck-tag">${truck.tag}</span>

        <button
          class="favorite ${isFavorite ? "active" : ""}"
          data-action="favorite"
          data-id="${truck.id}"
          aria-label="${isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}"
          aria-pressed="${isFavorite}"
        >
          ${isFavorite ? "♥" : "♡"}
        </button>
      </div>

      <div class="truck-info">

        <span class="truck-category">
          ${truck.categoryName}
        </span>

        <h3>${truck.brand} ${truck.model}</h3>

        <p class="truck-description">
          ${truck.description}
        </p>

        <div class="truck-specs">
          <span>📅 ${truck.year}</span>
          <span>⚙ ${truck.transmission}</span>
          <span>🚛 ${truck.km}</span>
        </div>

        <div class="truck-bottom">
          <span class="truck-price">
            ${formatPrice(truck.price)}
          </span>

          <button
            data-action="contact"
            data-id="${truck.id}"
          >
            Consultar →
          </button>
        </div>

      </div>
    </article>
  `;
}

// FILTRAR Y ORDENAR
function getFilteredTrucks() {
  const search = searchInput.value.toLowerCase().trim();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  let result = trucks.filter(truck => {

    const matchesSearch =
      `${truck.brand} ${truck.model} ${truck.year}`
        .toLowerCase()
        .includes(search);

    const matchesCategory =
      category === "all" || truck.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "low") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    result.sort((a, b) => b.price - a.price);
  }

  if (sort === "new") {
    result.sort((a, b) => b.year - a.year);
  }

  return result;
}

// RENDERIZAR CATÁLOGO
function renderTrucks() {
  const filteredTrucks = getFilteredTrucks();

  truckGrid.innerHTML = filteredTrucks
    .map(createTruckCard)
    .join("");

  emptyState.hidden = filteredTrucks.length !== 0;

  inventoryCount.textContent =
    `${filteredTrucks.length} vehículos`;

  cartCount.textContent = favorites.size;
}

// EVENTOS DE FILTROS
searchInput.addEventListener("input", renderTrucks);
categoryFilter.addEventListener("change", renderTrucks);
sortFilter.addEventListener("change", renderTrucks);

// EVENTOS DEL CATÁLOGO
truckGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const truck = trucks.find(item => item.id === id);

  if (!truck) return;

  if (button.dataset.action === "favorite") {
    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }

    renderTrucks();
  }

  if (button.dataset.action === "contact") {
    const message = encodeURIComponent(
      `Hola, estoy interesado en el ${truck.brand} ${truck.model}. ¿Podrían darme más información?`
    );

    // Reemplaza este número por el WhatsApp comercial real.
    const phone = "18090000000";

    window.open(
      `https://wa.me/${phone}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
});

// FAVORITOS
document.getElementById("cartButton").addEventListener("click", () => {
  const selected = trucks.filter(truck => favorites.has(truck.id));

  if (selected.length === 0) {
    alert("Todavía no tienes camiones favoritos.");
    return;
  }

  const message = selected
    .map(truck => `${truck.brand} ${truck.model} - ${formatPrice(truck.price)}`)
    .join("\n");

  alert("Tus camiones favoritos:\n\n" + message);
});

// MENÚ MÓVIL
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen);
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// INICIALIZAR
renderTrucks();
