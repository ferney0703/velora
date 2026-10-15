/* ==========================================
   ANELLIA — JAVASCRIPT PRINCIPAL
   Adaptado al HTML actual de Anellia
========================================== */

/* ==========================================
   CONFIGURACIÓN DE EMAILJS
   Reemplaza estos 3 valores por los tuyos.
========================================== */

const EMAIL_PUBLIC_KEY = "ZG95D2xbqDlg63iZJ";
const EMAIL_SERVICE = "service_ljas3l8";
const EMAIL_TEMPLATE = "template_8pkazks";

/* ==========================================
   ELEMENTOS PRINCIPALES
========================================== */

const productCards = [...document.querySelectorAll(".product-card")];

const productModal = document.getElementById("productModal");
const registerModal = document.getElementById("registerModal");
const favoritesModal = document.getElementById("favoritesModal");
const cartModal = document.getElementById("cartModal");
const contactModal = document.getElementById("contactModal");

const modalProductImage = document.getElementById("modalProductImage");
const modalProductName = document.getElementById("modalProductName");
const modalProductPrice = document.getElementById("modalProductPrice");

const personalizationInput =
    document.getElementById("personalizationInput");

const sizeWarning = document.getElementById("sizeWarning");
const orderBtn = document.getElementById("orderBtn");

const registerForm = document.getElementById("registerForm");
const registerContent = document.getElementById("registerContent");
const successMessage = document.getElementById("successMessage");
const registeredPhone = document.getElementById("registeredPhone");
const finishBtn = document.getElementById("finishBtn");

const favoritesList = document.getElementById("favoritesList");
const cartList = document.getElementById("cartList");

const favoritesCount = document.getElementById("favoritesCount");
const cartCount = document.getElementById("cartCount");

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const closeMenuBtn = document.getElementById("closeMenu");
const overlay = document.getElementById("overlay");

/* ==========================================
   ESTADO Y DATOS GUARDADOS
========================================== */

function loadData(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (error) {
        console.warn("No se pudieron recuperar los datos:", error);
        return fallback;
    }
}

let favorites = loadData("anellia_favorites", []);
let orders = loadData("anellia_orders", []);

let selectedProduct = null;
let selectedSize = null;
let selectedPersonalization = "";
let sendingOrder = false;

function saveData() {
    try {
        localStorage.setItem("anellia_favorites", JSON.stringify(favorites));
        localStorage.setItem("anellia_orders", JSON.stringify(orders));
    } catch (error) {
        console.error("No se pudieron guardar los datos:", error);
    }
}

/* ==========================================
   FUNCIONES GENERALES
========================================== */

function formatPrice(price) {
    return Number(price).toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}

function getProductFromCard(card) {
    return {
        name: card.dataset.name || "Anillo Anellia",
        price: Number(card.dataset.price) || 0,
        image: card.dataset.image || "",
        id: card.dataset.name || ""
    };
}

function openModal(modal) {
    if (!modal) return;

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("active", "open", "show");
    modal.setAttribute("aria-hidden", "true");
}

function closeAllModals() {
    [
        productModal,
        registerModal,
        favoritesModal,
        cartModal,
        contactModal
    ].forEach(closeModal);
}

/* ==========================================
   ABRIR Y CERRAR PRODUCTOS
========================================== */

function openProduct(card) {
    if (!card) return;

    selectedProduct = getProductFromCard(card);
    selectedSize = null;
    selectedPersonalization = "";

    if (modalProductImage) {
        modalProductImage.src = selectedProduct.image;
        modalProductImage.alt = selectedProduct.name;
    }

    if (modalProductName) {
        modalProductName.textContent = selectedProduct.name;
    }

    if (modalProductPrice) {
        modalProductPrice.textContent = formatPrice(selectedProduct.price);
    }

    if (personalizationInput) {
        personalizationInput.value = "";
    }

    document.querySelectorAll(".size-btn").forEach(button => {
        button.classList.remove("active", "selected");
        button.setAttribute("aria-pressed", "false");
    });

    if (sizeWarning) {
        sizeWarning.textContent = "Selecciona una talla.";
    }

    openModal(productModal);
}

/* Tocar una tarjeta abre su producto. */
productCards.forEach(card => {
    card.addEventListener("click", event => {
        if (
            event.target.closest(".favorite-btn") ||
            event.target.closest("button")
        ) {
            return;
        }

        openProduct(card);
    });

    /* También funciona con teclado. */
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");

    card.addEventListener("keydown", event => {
        if (
            event.target !== card ||
            (event.key !== "Enter" && event.key !== " ")
        ) {
            return;
        }

        event.preventDefault();
        openProduct(card);
    });
});

/* Cerrar ventanas usando los botones ×. */
document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.getElementById(button.dataset.close);
        closeModal(modal);
    });
});

/* Cerrar al tocar el fondo oscuro. */
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});

/* Cerrar con Escape. */
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeAllModals();
        closeSideMenu();
        searchBox?.classList.remove("active");
    }
});

/* ==========================================
   SELECCIÓN DE TALLAS
========================================== */

document.querySelectorAll(".size-btn").forEach(button => {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
        document.querySelectorAll(".size-btn").forEach(otherButton => {
            otherButton.classList.remove("active", "selected");
            otherButton.setAttribute("aria-pressed", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");

        /* Se utiliza el número visible en el botón. */
        selectedSize = button.textContent.trim();

        if (sizeWarning) {
            sizeWarning.textContent = `Talla seleccionada: ${selectedSize}`;
        }
    });
});

/* ==========================================
   PERSONALIZACIÓN Y BOTÓN PEDIR
========================================== */

if (personalizationInput) {
    personalizationInput.addEventListener("input", () => {
        /* Máximo de 25 caracteres. */
        personalizationInput.value =
            personalizationInput.value.slice(0, 25);
    });
}

if (orderBtn) {
    orderBtn.addEventListener("click", () => {
        if (!selectedProduct) {
            alert("Primero selecciona un anillo.");
            closeModal(productModal);
            return;
        }

        if (!selectedSize) {
            if (sizeWarning) {
                sizeWarning.textContent =
                    "Debes seleccionar una talla para continuar.";
            }

            alert("Selecciona una talla antes de continuar.");
            return;
        }

        selectedPersonalization =
            personalizationInput?.value.trim() || "";

        closeModal(productModal);

        /* Mostrar nuevamente el formulario de datos. */
        registerContent?.removeAttribute("hidden");
        successMessage?.setAttribute("hidden", "");

        if (registerForm) {
            registerForm.reset();
        }

        openModal(registerModal);
    });
}

/* ==========================================
   FAVORITOS
========================================== */

function updateFavoriteButtons() {
    productCards.forEach(card => {
        const product = getProductFromCard(card);
        const button = card.querySelector(".favorite-btn");

        if (!button) return;

        const isFavorite = favorites.some(item => item.id === product.id);

        button.classList.toggle("active", isFavorite);
        button.classList.toggle("selected", isFavorite);
        button.textContent = isFavorite ? "♥" : "♡";
        button.setAttribute("aria-pressed", String(isFavorite));
        button.setAttribute(
            "aria-label",
            isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
        );
    });
}

function updateCounts() {
    if (favoritesCount) {
        favoritesCount.textContent = favorites.length;
    }

    if (cartCount) {
        cartCount.textContent = orders.length;
    }

    updateFavoriteButtons();
}

productCards.forEach(card => {
    const button = card.querySelector(".favorite-btn");

    if (!button) return;

    button.addEventListener("click", event => {
        event.stopPropagation();

        const product = getProductFromCard(card);
        const index = favorites.findIndex(item => item.id === product.id);

        if (index >= 0) {
            favorites.splice(index, 1);
        } else {
            favorites.push(product);
        }

        saveData();
        updateCounts();
        renderFavorites();
    });
});

function createProductRow(product, actionText, action) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "12px";
    row.style.padding = "12px";
    row.style.borderBottom = "1px solid #ead9df";

    const image = document.createElement("img");
    image.src = product.image || "";
    image.alt = product.name || "Anillo";
    image.loading = "lazy";

    const details = document.createElement("div");
    details.style.flex = "1";

    const name = document.createElement("strong");
    name.textContent = product.name || "Anillo Anellia";

    const price = document.createElement("p");
    price.textContent = formatPrice(product.price || 0);

    details.append(name, price);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = actionText;
    button.addEventListener("click", action);

    row.append(image, details, button);

    return row;
}

function renderFavorites() {
    if (!favoritesList) return;

    favoritesList.replaceChildren();

    if (favorites.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Todavía no tienes anillos favoritos.";
        favoritesList.appendChild(message);
        return;
    }

    favorites.forEach(product => {
        const row = createProductRow(product, "Ver anillo", () => {
            const card = productCards.find(
                item => item.dataset.name === product.id
            );

            if (card) {
                closeModal(favoritesModal);
                openProduct(card);
            }
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Quitar";

        removeButton.addEventListener("click", () => {
            favorites = favorites.filter(item => item.id !== product.id);
            saveData();
            updateCounts();
            renderFavorites();
        });

        row.appendChild(removeButton);
        favoritesList.appendChild(row);
    });
}

document.getElementById("favoritesBtn")?.addEventListener("click", () => {
    renderFavorites();
    openModal(favoritesModal);
});

/* ==========================================
   PEDIDOS GUARDADOS
========================================== */

function renderOrders() {
    if (!cartList) return;

    cartList.replaceChildren();

    if (orders.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Todavía no tienes pedidos confirmados.";
        cartList.appendChild(message);
        return;
    }

    [...orders].reverse().forEach(order => {
        const row = document.createElement("div");
        row.style.padding = "15px";
        row.style.marginBottom = "12px";
        row.style.borderBottom = "1px solid #ead9df";

        const name = document.createElement("h3");
        name.textContent = order.productName || "Anillo Anellia";

        const details = document.createElement("p");
        details.textContent =
            `Precio: ${formatPrice(order.productPrice || 0)} · ` +
            `Talla: ${order.productSize || "No indicada"}`;

        const personalization = document.createElement("p");
        personalization.textContent = order.personalization
            ? `Personalización: ${order.personalization}`
            : "Sin personalización";

        const date = document.createElement("small");
        date.textContent = `Pedido: ${order.date || "Fecha no disponible"}`;

        row.append(name, details, personalization, date);
        cartList.appendChild(row);
    });
}

document.getElementById("cartBtn")?.addEventListener("click", () => {
    renderOrders();
    openModal(cartModal);
});

/* ==========================================
   BUSCADOR
========================================== */

searchBtn?.addEventListener("click", () => {
    searchBox?.classList.toggle("active");

    if (searchBox?.classList.contains("active")) {
        searchInput?.focus();
    }
});

searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLocaleLowerCase("es");

    productCards.forEach(card => {
        const name = (card.dataset.name || "").toLocaleLowerCase("es");
        card.hidden = !name.includes(query);
    });
});

/* ==========================================
   FILTROS Y ENLACES DE LA PÁGINA
========================================== */

document.querySelectorAll("[data-filter]").forEach(link => {
    link.addEventListener("click", event => {
        event.preventDefault();

        const filter = link.dataset.filter;

        if (filter === "todos") {
            productCards.forEach(card => {
                card.hidden = false;
            });

            if (searchInput) {
                searchInput.value = "";
            }
        }

        document.getElementById("products")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        closeSideMenu();
    });
});

document.getElementById("footerHome")?.addEventListener("click", event => {
    event.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.getElementById("footerContact")?.addEventListener("click", event => {
    event.preventDefault();
    openModal(contactModal);
});

/* ==========================================
   MENÚ LATERAL
========================================== */

function openSideMenu() {
    sideMenu?.classList.add("active");
    overlay?.classList.add("active");
}

function closeSideMenu() {
    sideMenu?.classList.remove("active");
    overlay?.classList.remove("active");
}

menuBtn?.addEventListener("click", openSideMenu);
closeMenuBtn?.addEventListener("click", closeSideMenu);
overlay?.addEventListener("click", closeSideMenu);

/* ==========================================
   REGISTRO Y ENVÍO DEL PEDIDO POR CORREO
========================================== */

if (typeof emailjs !== "undefined") {
    const emailConfigured =
        EMAIL_PUBLIC_KEY !== "TU_CLAVE_PUBLICA" &&
        EMAIL_SERVICE !== "TU_SERVICE_ID" &&
        EMAIL_TEMPLATE !== "TU_TEMPLATE_ID";

    if (emailConfigured) {
        emailjs.init({
            publicKey: EMAIL_PUBLIC_KEY
        });
    }
}

if (registerForm) {
    registerForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (sendingOrder) return;

        if (!selectedProduct || !selectedSize) {
            alert("Selecciona un anillo y una talla antes de continuar.");
            closeModal(registerModal);
            openModal(productModal);
            return;
        }

        const customerName =
            document.getElementById("customerName")?.value.trim() || "";

        const customerPhone =
            document.getElementById("customerPhone")?.value.trim() || "";

        const customerEmail =
            document.getElementById("customerEmail")?.value.trim() || "";

        const customerAddress =
            document.getElementById("customerAddress")?.value.trim() || "";

        if (
            !customerName ||
            !customerPhone ||
            !customerEmail ||
            !customerAddress
        ) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        if (
            typeof emailjs === "undefined" ||
            EMAIL_PUBLIC_KEY === "TU_CLAVE_PUBLICA" ||
            EMAIL_SERVICE === "TU_SERVICE_ID" ||
            EMAIL_TEMPLATE === "TU_TEMPLATE_ID"
        ) {
            alert(
                "Falta configurar EmailJS. Debes colocar tu clave pública, " +
                "Service ID y Template ID en script.js."
            );
            return;
        }

        sendingOrder = true;

        const submitButton = registerForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Enviando pedido...";
        }

        const orderDate = new Date().toLocaleString("es-CO");

        const order = {
            productName: selectedProduct.name,
            productPrice: selectedProduct.price,
            productImage: selectedProduct.image,
            productSize: selectedSize,
            personalization: selectedPersonalization,
            customerName,
            customerPhone,
            customerEmail,
            customerAddress,
            date: orderDate
        };

        try {
            await emailjs.send(EMAIL_SERVICE, EMAIL_TEMPLATE, {
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail,
                customer_address: customerAddress,
                product_name: selectedProduct.name,
                product_price: formatPrice(selectedProduct.price),
                product_size: selectedSize,
                personalization: selectedPersonalization || "Sin personalización",
                order_date: orderDate
            });

            orders.push(order);
            saveData();
            updateCounts();
            renderOrders();

            if (registeredPhone) {
                registeredPhone.textContent = customerPhone;
            }

            registerContent?.setAttribute("hidden", "");
            successMessage?.removeAttribute("hidden");

        } catch (error) {
            console.error("Error al enviar el pedido:", error);

            alert(
                "No se pudo enviar el pedido por correo. " +
                "Revisa la conexión y la configuración de EmailJS."
            );
        } finally {
            sendingOrder = false;

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Completar pedido";
            }
        }
    });
}

/* ==========================================
   FINALIZAR PEDIDO
========================================== */

finishBtn?.addEventListener("click", () => {
    closeModal(registerModal);

    registerContent?.removeAttribute("hidden");
    successMessage?.setAttribute("hidden", "");

    registerForm?.reset();

    selectedProduct = null;
    selectedSize = null;
    selectedPersonalization = "";
});

/* ==========================================
   INICIO DE LA PÁGINA
========================================== */

updateCounts();
renderFavorites();
renderOrders();

[
    productModal,
    registerModal,
    favoritesModal,
    cartModal,
    contactModal
].forEach(modal => {
    modal?.setAttribute("aria-hidden", "true");
});

console.log("Anellia: JavaScript cargado correctamente.");
