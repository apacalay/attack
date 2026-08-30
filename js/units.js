// ==========================================================================
// COC UNITS & SIDEBAR ACCORDION LIBRARY
// ==========================================================================

function initUI() {
    renderAccordionCategories();

    // Realtime search filter across all accordion categories
    const searchInput = document.getElementById("unitSearch");
    const clearSearchBtn = document.getElementById("clearSearchBtn");

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (clearSearchBtn) {
                clearSearchBtn.style.display = query ? "block" : "none";
            }
            filterAllCategories(query);
        });
    }

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener("click", () => {
            searchInput.value = "";
            clearSearchBtn.style.display = "none";
            filterAllCategories("");
            searchInput.focus();
        });
    }

    // Direct wheel scroll handler on the sidebar for reliable scrolling
    const rightSidebarEl = document.getElementById("rightSidebar");
    const accordionEl = document.getElementById("accordionCategories");
    if (rightSidebarEl && accordionEl) {
        rightSidebarEl.addEventListener("wheel", (e) => {
            accordionEl.scrollTop += e.deltaY;
        }, { passive: true });
    }
}

function renderAccordionCategories() {
    const container = document.getElementById("accordionCategories");
    if (!container) return;

    container.innerHTML = "";

    unitCategories.forEach((cat) => {
        const iconClass = categoryIcons[cat.name] || "ri-shield-line";

        const section = document.createElement("div");
        // All categories collapsed by default for clean presentation
        section.className = "accordion-section";
        section.dataset.category = cat.name.toLowerCase();

        // Header Button
        const header = document.createElement("button");
        header.type = "button";
        header.className = "accordion-header";

        const titleWrap = document.createElement("div");
        titleWrap.className = "accordion-title-wrap";
        titleWrap.innerHTML = `
            <i class="${iconClass} accordion-icon"></i>
            <span class="accordion-name">${cat.name}</span>
            <span class="accordion-badge">${cat.files.length}</span>
        `;

        const chevron = document.createElement("i");
        chevron.className = "ri-arrow-down-s-line accordion-chevron";

        header.appendChild(titleWrap);
        header.appendChild(chevron);

        // Single-expand exclusive accordion: opens clicked, closes others
        header.addEventListener("click", () => {
            const wasActive = section.classList.contains("active");
            document.querySelectorAll(".accordion-section").forEach(s => s.classList.remove("active"));
            if (!wasActive) {
                section.classList.add("active");
            }
        });

        // Body Grid
        const body = document.createElement("div");
        body.className = "accordion-body";

        const grid = document.createElement("div");
        grid.className = "accordion-grid";

        cat.files.forEach(file => {
            const name = file.replace(/\.(png|webp|jpg|jpeg)$/i, "").replace(/_/g, " ");
            const folderEncoded = encodeURIComponent(cat.folder);
            const fileEncoded = encodeURIComponent(file);
            const imageUrl = `${ASSETS_BASE_URL}/${folderEncoded}/${fileEncoded}`;

            const item = document.createElement("div");
            item.className = "unit-item";
            item.dataset.name = name.toLowerCase();
            item.title = name;

            const wrapper = document.createElement("div");
            wrapper.className = "unit-icon-wrapper";

            const img = document.createElement("img");
            img.className = "unit-icon";
            img.src = imageUrl;
            img.loading = "lazy";
            img.alt = name;
            img.onload = () => {
                if (typeof draw === "function") draw();
            };
            imageCache.set(imageUrl, img);

            wrapper.appendChild(img);
            item.appendChild(wrapper);

            const nameDiv = document.createElement("div");
            nameDiv.className = "unit-name";
            nameDiv.innerText = name;
            nameDiv.title = name;
            item.appendChild(nameDiv);

            item.addEventListener("click", () => {
                document.querySelectorAll(".unit-item").forEach(u => u.classList.remove("active"));
                item.classList.add("active");

                window.selectedUnit = {
                    name: name,
                    src: imageUrl,
                    folder: cat.folder
                };
                setTool(Tools.ICON);

                // On mobile landscape, auto close drawer after selecting unit so canvas is immediately visible
                const rightSidebar = document.getElementById("rightSidebar");
                if (rightSidebar && window.innerWidth <= 980) {
                    rightSidebar.classList.remove("open");
                }
            });

            grid.appendChild(item);
        });

        body.appendChild(grid);
        section.appendChild(header);
        section.appendChild(body);
        container.appendChild(section);
    });
}

function filterAllCategories(query) {
    document.querySelectorAll(".accordion-section").forEach(section => {
        let hasMatch = false;
        const items = section.querySelectorAll(".unit-item");

        items.forEach(item => {
            const name = item.dataset.name || "";
            if (!query || name.includes(query)) {
                item.style.display = "flex";
                hasMatch = true;
            } else {
                item.style.display = "none";
            }
        });

        if (query) {
            if (hasMatch) {
                section.style.display = "block";
                section.classList.add("active"); // Auto expand matching category
            } else {
                section.style.display = "none";
            }
        } else {
            section.style.display = "block";
            section.classList.remove("active"); // Collapse when search cleared
        }
    });
}
