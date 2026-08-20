const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const ICON_SIZE = 36;
// Hasil ukur presisi diamond marker.webp (1297x976 px pada grid 44x44)
const TILE_SCALE_X = 20.84; // 1 Tile Radius Horizontal = (1297 / 44) / sqrt(2) = 20.84 px
const TILE_SCALE_Y = 15.68; // 1 Tile Radius Vertikal   = (976 / 44) / sqrt(2)  = 15.68 px
const ISO_Y_RATIO = 0.7524; // Rasio belah ketupat CoC (15.68 / 20.84 = 976 / 1297)
const ASSETS_BASE_URL = "https://clashfox.com";

// Spell & Equipment AoE Radius Settings (in tiles)
const SPELL_RADII = {
    // Equipment
    "fireball": { radiusTiles: 6, color: "rgba(249, 115, 22, 0.22)", stroke: "rgba(249, 115, 22, 0.9)" }, // Diameter 12
    
    // Spells (Exact Diameter -> Radius in Tiles)
    "invisibility spell": { radiusTiles: 4, color: "rgba(59, 130, 246, 0.2)", stroke: "rgba(59, 130, 246, 0.9)" }, // Diameter 8
    "invisibility": { radiusTiles: 4, color: "rgba(59, 130, 246, 0.2)", stroke: "rgba(59, 130, 246, 0.9)" },
    "freeze spell": { radiusTiles: 3.5, color: "rgba(6, 182, 212, 0.22)", stroke: "rgba(6, 182, 212, 0.9)" }, // Diameter 7
    "freeze": { radiusTiles: 3.5, color: "rgba(6, 182, 212, 0.22)", stroke: "rgba(6, 182, 212, 0.9)" },
    "jump spell": { radiusTiles: 3.5, color: "rgba(34, 197, 94, 0.22)", stroke: "rgba(34, 197, 94, 0.9)" }, // Diameter 7
    "jump": { radiusTiles: 3.5, color: "rgba(34, 197, 94, 0.22)", stroke: "rgba(34, 197, 94, 0.9)" },
    "earthquake spell": { radiusTiles: 4.7, color: "rgba(217, 119, 6, 0.24)", stroke: "rgba(217, 119, 6, 0.9)" }, // Diameter 9.4
    "earthquake": { radiusTiles: 4.7, color: "rgba(217, 119, 6, 0.24)", stroke: "rgba(217, 119, 6, 0.9)" },
    "overgrowth spell": { radiusTiles: 6, color: "rgba(16, 185, 129, 0.22)", stroke: "rgba(16, 185, 129, 0.9)" }, // Diameter 12
    "overgrowth": { radiusTiles: 6, color: "rgba(16, 185, 129, 0.22)", stroke: "rgba(16, 185, 129, 0.9)" },
    
    // Additional standard spells
    "rage spell": { radiusTiles: 5, color: "rgba(236, 72, 153, 0.2)", stroke: "rgba(236, 72, 153, 0.9)" }, // Diameter 10
    "rage": { radiusTiles: 5, color: "rgba(236, 72, 153, 0.2)", stroke: "rgba(236, 72, 153, 0.9)" },
    "healing spell": { radiusTiles: 5, color: "rgba(234, 179, 8, 0.2)", stroke: "rgba(234, 179, 8, 0.9)" }, // Diameter 10
    "healing": { radiusTiles: 5, color: "rgba(234, 179, 8, 0.2)", stroke: "rgba(234, 179, 8, 0.9)" },
    "lightning spell": { radiusTiles: 2, color: "rgba(56, 189, 248, 0.2)", stroke: "rgba(56, 189, 248, 0.9)" },
    "poison spell": { radiusTiles: 4, color: "rgba(239, 68, 68, 0.2)", stroke: "rgba(239, 68, 68, 0.9)" }, // Diameter 8
    "haste spell": { radiusTiles: 4, color: "rgba(245, 158, 11, 0.2)", stroke: "rgba(245, 158, 11, 0.9)" }, // Diameter 8
    "bat spell": { radiusTiles: 3, color: "rgba(168, 85, 247, 0.2)", stroke: "rgba(168, 85, 247, 0.9)" },
    "skeleton spell": { radiusTiles: 3, color: "rgba(148, 163, 184, 0.2)", stroke: "rgba(148, 163, 184, 0.9)" },
    "clone spell": { radiusTiles: 3.5, color: "rgba(99, 102, 241, 0.2)", stroke: "rgba(99, 102, 241, 0.9)" }
};

// Tool Modes
const Tools = {
    SELECT: "select",
    BRUSH: "brush",
    ARROW: "arrow",
    XMARK: "xmark",
    TEXT: "text",
    ERASER: "eraser",
    ICON: "icon"
};

// Unit Categories data directly mapped to clashfox.com subfolders
const unitCategories = [
    {
        name: "Troops",
        folder: "Troops(Home Village)",
        files: ["Archer.png", "Baby_Dragon.png", "Balloon.png", "Barbarian.png", "Dragon.png", "Dragon_Rider.png", "Electro_Dragon.png", "Electro_Titan.png", "Giant.png", "Goblin.png", "Healer.png", "Miner.png", "P.E.K.K.A.png", "Root_Rider.png", "Throwers.webp", "Wall_Breaker.png", "Wizard.png", "Yeti.png", "meteor_golem.png"]
    },
    {
        name: "Dark Troops",
        folder: "Dark Troops",
        files: ["Apprentice_Warden.png", "Bowler.png", "Druid.png", "Furnace.png", "Golem.png", "Headhunter.png", "Hog_Rider.png", "Ice_Golem.png", "Lava_Hound.png", "Minion.png", "Ruined_Witch.png", "Valkyrie.png", "Witch.png"]
    },
    {
        name: "Heroes",
        folder: "Hereos",
        files: ["Barbarian_King.png", "Archer_Queen.png", "Grand_Warden.png", "Royal_Champion.png", "minion_prince.png", "dragon_duke.png", "Battle_Machine.png", "Battle_Copter.png", "L.A.S.S.I.png", "Electro_Owl.png", "Mighty_Yak.png", "Unicorn.png", "Frosty.png", "Diggy.png", "Poison_Lizard.png", "Phoenix.png", "Spirit_Fox.png", "Angry_Jelly.png", "mighty_raven.png", "sneezy.png"]
    },
    {
        name: "Equipment",
        folder: "Hereos Equipment",
        files: ["Barbarian_Puppet.png", "Archer_Puppet.png", "Healer_Puppet.png", "Hog_Rider_Puppet.png", "Giant_Arrow.png", "Giant_Gauntlet.png", "Earthquake_Boots.png", "Vampstache.png", "Rage_Vial.png", "Invisibility_Vial.png", "Haste_Vial.png", "Fireball.png", "Eternal_Tome.png", "Healing_Tome.png", "Life_Gem.png", "Rage_Gem.png", "Royal_Gem.png", "Seeking_Shield.png", "frozen_arrow.png", "magic_mirror.png", "Monolith_Arrow.webp", "rocket_spear.png", "rocket_backpacks.webp", "action_figure.png", "dark_crown.png", "dark_orb.png", "electro_boots.png", "electro_fangs.webp", "revenge_deck.webp", "fire_heart.png", "flame_blower.png", "frost_flake.png", "henchmen_puppet.png", "heroic_torch.png", "lavaloon_puppet.png", "metal_pants.png", "meteor_staff.png", "noble_iron.png", "snake_bracelet.png", "spiky_ball.png", "stick_horse.png", "stun_blaster.png"]
    },
    {
        name: "Siege Machines",
        folder: "Siege Machines",
        files: ["Wall_Wrecker.png", "Battle_Blimp.png", "Stone_Slammer.png", "Siege_Barracks.png", "Log_Launcher.png", "Flame_Flinger.png", "Battle_Drill.png", "troops_launcher.png", "siege machine sky wagon.webp"]
    },
    {
        name: "Spells",
        folder: "Spells(home village)",
        files: ["Lightning_Spell.png", "Healing_Spell.png", "Rage_Spell.png", "Jump_Spell.png", "Freeze_Spell.png", "Clone_Spell.png", "Invisibility_Spell.png", "Recall_Spell.png", "revive_spell.png", "ice_block_spell.png", "totem_spell.png"]
    },
    {
        name: "Dark Spells",
        folder: "Dark Spells",
        files: ["Poison_Spell.png", "Earthquake_Spell.png", "Haste_Spell.png", "Skeleton_Spell.png", "Bat_Spell.png", "Overgrowth_Spell.png", "Angry_Spell.jpg"]
    },
    {
        name: "Super Troops",
        folder: "Super Troops",
        files: ["Super_Barbarian.png", "Super_Archer.png", "Sneaky_Goblin.png", "Super_Giant.png", "Super_Wall_Breaker.png", "Rocket_Balloon.png", "Super_Wizard.png", "Super_Dragon.png", "Inferno_Dragon.png", "Super_Minion.png", "Super_Valkyrie.png", "Super_Witch.png", "Ice_Hound.png", "Super_Bowler.png", "Super_Miner.png", "Super_Hog_Rider.png", "super_yeti.jpg"]
    }
];

// App State
let canvas, ctx;
let bgImage = null;
let bgX = 0;
let bgY = 0;
let bgScale = 1;
let isAlignMode = false;
let isLocked = false;
let showMarkerOverlay = false;

// Drawing state
let currentTool = Tools.SELECT;
let currentColor = "#ef4444"; // default red
let currentWidth = 8;
let currentTextSize = 32;

let elements = [];
let undoStack = [];
let redoStack = [];

let isDrawing = false;
let isDraggingBg = false;
let dragStartX = 0;
let dragStartY = 0;

// Arrow & Brush temporary coordinates
let arrowPreview = null;
let brushPreview = null;

// Viewport zoom & pan state for planning mode
let canvasBaseScale = 1.0;
let canvasUserZoom = 1.0;
let canvasPanX = 0;
let canvasPanY = 0;
let isPanningCanvas = false;
let panStartMouseX = 0;
let panStartMouseY = 0;
let panStartCanvasX = 0;
let panStartCanvasY = 0;
let isSpacePressed = false;
let isResizingTarget = false;

// Text placement temporary coordinates
let textPlacementCoords = { x: 0, y: 0 };

// Selected element for SELECT tool
let selectedElement = null;
let isDraggingElement = false;
let dragOffset = { x: 0, y: 0 };
let arrowDragEnd = null; // 'x1' or 'x2' if dragging arrow endpoints

// Cache for loaded images
const imageCache = new Map();

// Boundary & splash images from clashfox.com & local folder
const markerImage = new Image();
markerImage.src = "marker.webp"; // Loaded locally since it exists in the same folder

const splashImage = new Image();
splashImage.src = ASSETS_BASE_URL + "/attack_planner.webp";

// Placement Counter for Deployment Order
let deploymentOrder = 1;

// Document Ready
window.addEventListener("DOMContentLoaded", () => {
    initCanvas();
    initUI();
    setupEventListeners();
    saveState(); // save initial empty state
});

function initCanvas() {
    canvas = document.getElementById("plannerCanvas");
    ctx = canvas.getContext("2d");
    
    // Set internal canvas resolution (always 1920x1080)
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    fitCanvasToWorkspace();
    window.addEventListener("resize", fitCanvasToWorkspace);
}

function updateCanvasTransform() {
    const canvasContainer = document.querySelector(".canvas-container");
    if (!canvasContainer) return;
    const finalScale = canvasBaseScale * canvasUserZoom;
    canvasContainer.style.transform = `translate(${canvasPanX}px, ${canvasPanY}px) scale(${finalScale})`;
    
    const zoomText = document.getElementById("zoomPercentage");
    if (zoomText) {
        zoomText.innerText = `${Math.round(canvasUserZoom * 100)}%`;
    }
}

// Adjust HTML Canvas responsive scale to fit the viewport workspace
function fitCanvasToWorkspace() {
    const container = document.querySelector(".workspace");
    const canvasContainer = document.querySelector(".canvas-container");
    
    if (!container || !canvasContainer) return;
    
    const containerW = container.clientWidth - 32;
    const containerH = container.clientHeight - 32;
    
    canvasBaseScale = Math.min(containerW / CANVAS_WIDTH, containerH / CANVAS_HEIGHT);
    updateCanvasTransform();
}

// Category icon mappings
const categoryIcons = {
    "Troops": "fa-shield-halved",
    "Dark Troops": "fa-skull",
    "Heroes": "fa-crown",
    "Equipment": "fa-wand-magic-sparkles",
    "Siege Machines": "fa-truck-monster",
    "Spells": "fa-flask-vial",
    "Dark Spells": "fa-biohazard",
    "Super Troops": "fa-bolt"
};

// Load and render units unified collapsible accordion sidebar
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

    // Direct wheel scroll handler on the sidebar to ensure 100% reliable scrolling
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
        const iconClass = categoryIcons[cat.name] || "fa-shield-halved";
        
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
            <i class="fa-solid ${iconClass} accordion-icon"></i>
            <span class="accordion-name">${cat.name}</span>
            <span class="accordion-badge">${cat.files.length}</span>
        `;
        
        const chevron = document.createElement("i");
        chevron.className = "fa-solid fa-chevron-down accordion-chevron";
        
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
            img.onload = () => draw();
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
                section.classList.add("active"); // auto expand matching category
            } else {
                section.style.display = "none";
            }
        } else {
            section.style.display = "block";
            section.classList.remove("active"); // collapse when search cleared
        }
    });
}

function setupEventListeners() {
    // Toolbar buttons
    document.querySelectorAll(".left-sidebar .tool-btn").forEach(btn => {
        const tool = btn.dataset.tool;
        if (tool) {
            btn.addEventListener("click", () => setTool(tool));
        }
    });
    
    // Color Swatches
    document.querySelectorAll(".color-swatch").forEach(swatch => {
        swatch.addEventListener("click", () => {
            document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
            swatch.classList.add("active");
            currentColor = swatch.dataset.color;
        });
    });
    
    // Background upload trigger
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", handleFileSelect);
    }
    
    // Drag and drop base image
    const workspace = document.querySelector(".workspace");
    const dragOverlay = document.getElementById("dragOverlay");
    
    workspace.addEventListener("dragenter", (e) => {
        e.preventDefault();
        dragOverlay.style.display = "flex";
    });
    
    dragOverlay.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    
    dragOverlay.addEventListener("dragleave", () => {
        dragOverlay.style.display = "none";
    });
    
    dragOverlay.addEventListener("drop", (e) => {
        e.preventDefault();
        dragOverlay.style.display = "none";
        if (e.dataTransfer.files.length > 0) {
            loadBaseImageFile(e.dataTransfer.files[0]);
        }
    });
    
    // Alignment Controls
    const alignBtn = document.getElementById("alignBtn");
    if (alignBtn) {
        alignBtn.addEventListener("click", toggleAlignMode);
    }
    
    const toggleBoundaryBtn = document.getElementById("toggleBoundaryBtn");
    if (toggleBoundaryBtn) {
        updateBoundaryBtnUI();
        toggleBoundaryBtn.addEventListener("click", () => {
            showMarkerOverlay = !showMarkerOverlay;
            updateBoundaryBtnUI();
            draw();
        });
    }
    
    // Undo / Redo / Clear / Download
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    const clearBtn = document.getElementById("clearBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    
    if (undoBtn) undoBtn.addEventListener("click", undo);
    if (redoBtn) redoBtn.addEventListener("click", redo);
    if (clearBtn) clearBtn.addEventListener("click", clearCanvas);
    if (downloadBtn) downloadBtn.addEventListener("click", downloadPlan);
    // Alignment Banner Extra Buttons (+, -, Reset)
    const alignZoomIn = document.getElementById("alignZoomIn");
    const alignZoomOut = document.getElementById("alignZoomOut");
    const alignReset = document.getElementById("alignReset");
    
    if (alignZoomIn) {
        alignZoomIn.addEventListener("click", () => {
            if (!bgImage) return;
            bgScale = Math.min(6, bgScale * 1.02);
            draw();
        });
    }
    if (alignZoomOut) {
        alignZoomOut.addEventListener("click", () => {
            if (!bgImage) return;
            bgScale = Math.max(0.1, bgScale / 1.02);
            draw();
        });
    }
    if (alignReset) {
        alignReset.addEventListener("click", () => {
            if (!bgImage) return;
            const scaleW = CANVAS_WIDTH / bgImage.width;
            const scaleH = CANVAS_HEIGHT / bgImage.height;
            bgScale = Math.min(scaleW, scaleH);
            bgX = (CANVAS_WIDTH - bgImage.width * bgScale) / 2;
            bgY = (CANVAS_HEIGHT - bgImage.height * bgScale) / 2;
            draw();
        });
    }
    
    // Text popover handling
    const popover = document.getElementById("textPopover");
    const popoverInput = document.getElementById("popoverInput");
    const popoverSave = document.getElementById("popoverSave");
    const popoverCancel = document.getElementById("popoverCancel");
    
    function submitPopoverText() {
        const textVal = popoverInput.value.trim();
        if (textVal) {
            elements.push({
                id: Date.now() + Math.random(),
                type: Tools.TEXT,
                x: textPlacementCoords.x,
                y: textPlacementCoords.y,
                text: textVal,
                color: currentColor,
                fontSize: currentTextSize
            });
            saveState();
            draw();
        }
        popover.style.display = "none";
        popoverInput.value = "";
    }
    
    popoverSave.addEventListener("click", submitPopoverText);
    
    popoverInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            submitPopoverText();
        } else if (e.key === "Escape") {
            e.preventDefault();
            popover.style.display = "none";
            popoverInput.value = "";
        }
    });
    
    popoverCancel.addEventListener("click", () => {
        popover.style.display = "none";
        popoverInput.value = "";
    });
    
    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
        // Prevent shortcuts if typing in text input
        if (document.activeElement.tagName === "INPUT") return;
        
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
            e.preventDefault();
            undo();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
            e.preventDefault();
            redo();
        } else if (e.key === "Delete" || e.key === "Backspace") {
            if (selectedElement) {
                e.preventDefault();
                elements = elements.filter(el => el.id !== selectedElement.id);
                selectedElement = null;
                saveState();
                draw();
            }
        } else if (e.key === "Escape") {
            selectedElement = null;
            arrowPreview = null;
            popover.style.display = "none";
            draw();
        }
    });
    
    // Canvas Mouse & Touch Interactivity
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", () => {
        if (isDrawing || isDraggingBg) {
            handleMouseUp();
        }
    });
    
    // Workspace & Canvas Wheel zoom (both for align mode and normal planning zoom)
    const workspaceEl = document.querySelector(".workspace");
    if (workspaceEl) {
        workspaceEl.addEventListener("wheel", (e) => {
            e.preventDefault();
            
            if (isAlignMode && bgImage) {
                // In base align mode, zoom the uploaded screenshot background
                const coords = getCanvasCoords(e);
                const mouseX = coords.x;
                const mouseY = coords.y;
                const bgMouseX = (mouseX - bgX) / bgScale;
                const bgMouseY = (mouseY - bgY) / bgScale;
                const zoomFactor = e.deltaY < 0 ? 1.03 : 0.97;
                const nextScale = Math.max(0.1, Math.min(6, bgScale * zoomFactor));
                bgX = mouseX - bgMouseX * nextScale;
                bgY = mouseY - bgMouseY * nextScale;
                bgScale = nextScale;
                draw();
            } else {
                // In normal drawing mode, zoom the canvas view smoothly in and out!
                const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                canvasUserZoom = Math.max(0.5, Math.min(3.5, canvasUserZoom * zoomFactor));
                updateCanvasTransform();
            }
        }, { passive: false });
    }
    
    // Spacebar key listener for canvas panning
    window.addEventListener("keydown", (e) => {
        if (e.code === "Space" && document.activeElement.tagName !== "INPUT") {
            isSpacePressed = true;
            document.body.style.cursor = "grab";
        }
    });
    
    window.addEventListener("keyup", (e) => {
        if (e.code === "Space") {
            isSpacePressed = false;
            document.body.style.cursor = "default";
        }
    });

    // Panning navigation when zoomed (Middle click, Right click, Space+drag, or dragging workspace)
    if (workspaceEl) {
        workspaceEl.addEventListener("mousedown", (e) => {
            if (e.button === 1 || e.button === 2 || isSpacePressed || (canvasUserZoom > 1.05 && e.target === workspaceEl)) {
                e.preventDefault();
                isPanningCanvas = true;
                panStartMouseX = e.clientX;
                panStartMouseY = e.clientY;
                panStartCanvasX = canvasPanX;
                panStartCanvasY = canvasPanY;
                document.body.style.cursor = "grabbing";
            }
        });
        
        window.addEventListener("mousemove", (e) => {
            if (isPanningCanvas) {
                canvasPanX = panStartCanvasX + (e.clientX - panStartMouseX);
                canvasPanY = panStartCanvasY + (e.clientY - panStartMouseY);
                updateCanvasTransform();
            }
        });
        
        window.addEventListener("mouseup", () => {
            if (isPanningCanvas) {
                isPanningCanvas = false;
                document.body.style.cursor = isSpacePressed ? "grab" : "default";
            }
        });
        
        workspaceEl.addEventListener("contextmenu", (e) => {
            if (isPanningCanvas || canvasUserZoom > 1.05) {
                e.preventDefault();
            }
        });
    }

    // Touch Interactivity: 1-finger draw/drag, 2-finger pinch-to-zoom & pan
    let isPinching = false;
    let initialPinchDistance = 0;
    let initialPinchScale = 1.0;
    let initialPinchCenter = { x: 0, y: 0 };
    let initialBgState = { x: 0, y: 0, scale: 1.0 };
    let initialCanvasPan = { x: 0, y: 0 };
    let touchCooldown = false; // Prevents 1-finger action right after pinch

    function getTouchInfo(t1, t2) {
        const dx = t1.clientX - t2.clientX;
        const dy = t1.clientY - t2.clientY;
        return {
            dist: Math.hypot(dx, dy),
            center: {
                clientX: (t1.clientX + t2.clientX) / 2,
                clientY: (t1.clientY + t2.clientY) / 2
            }
        };
    }

    // Listen to touch events on workspace & canvas for responsive mobile interaction
    const touchSurface = workspaceEl || canvas;
    
    touchSurface.addEventListener("touchstart", (e) => {
        if (e.touches.length >= 2) {
            e.preventDefault();
            
            // Cancel any ongoing 1-finger action cleanly (including canvas panning)
            if (isDrawing || isDraggingElement || isDraggingBg || isResizingTarget || isPanningCanvas) {
                isDrawing = false;
                isDraggingElement = false;
                isDraggingBg = false;
                isResizingTarget = false;
                isPanningCanvas = false;
                arrowPreview = null;
                brushPreview = null;
                document.body.style.cursor = "default";
            }
            
            isPinching = true;
            touchCooldown = true;

            const touchInfo = getTouchInfo(e.touches[0], e.touches[1]);
            initialPinchDistance = touchInfo.dist;
            initialPinchCenter = touchInfo.center;

            if (isAlignMode && bgImage) {
                initialBgState = { x: bgX, y: bgY, scale: bgScale };
            } else {
                initialPinchScale = canvasUserZoom;
                initialCanvasPan = { x: canvasPanX, y: canvasPanY };
            }
        } else if (e.touches.length === 1) {
            // Only allow 1-finger draw if not in cooldown after a pinch
            if (touchCooldown || isPinching) {
                return; // Ignore — user is still releasing from a pinch gesture
            }
            if (e.target === canvas) {
                handleMouseDown(e);
            }
        }
    }, { passive: false });

    touchSurface.addEventListener("touchmove", (e) => {
        if (e.touches.length >= 2 && isPinching) {
            e.preventDefault();
            // Ensure panning is killed so it doesn't intercept pinch via handleMouseMove
            isPanningCanvas = false;
            const touchInfo = getTouchInfo(e.touches[0], e.touches[1]);
            if (initialPinchDistance > 0) {
                const scaleFactor = touchInfo.dist / initialPinchDistance;
                const panDeltaX = touchInfo.center.clientX - initialPinchCenter.clientX;
                const panDeltaY = touchInfo.center.clientY - initialPinchCenter.clientY;

                if (isAlignMode && bgImage) {
                    // Zoom only the uploaded base screenshot, the boundary grid remains completely fixed!
                    bgScale = Math.max(0.1, Math.min(6, initialBgState.scale * scaleFactor));
                    bgX = initialBgState.x + panDeltaX;
                    bgY = initialBgState.y + panDeltaY;
                    draw();
                } else {
                    // Normal planning mode: zoom & pan the entire canvas view smoothly
                    canvasUserZoom = Math.max(0.5, Math.min(3.5, initialPinchScale * scaleFactor));
                    canvasPanX = initialCanvasPan.x + panDeltaX;
                    canvasPanY = initialCanvasPan.y + panDeltaY;
                    updateCanvasTransform();
                }
            }
        } else if (e.touches.length === 1 && !isPinching && !touchCooldown && e.target === canvas) {
            handleMouseMove(e);
        }
    }, { passive: false });

    touchSurface.addEventListener("touchend", (e) => {
        if (e.touches.length === 0) {
            // All fingers lifted — fully reset state
            if (isPinching || touchCooldown) {
                isPinching = false;
                initialPinchDistance = 0;
                // Brief cooldown to prevent accidental 1-finger action on lift
                setTimeout(() => { touchCooldown = false; }, 120);
            } else {
                if (e.target === canvas) handleMouseUp();
            }
        } else if (e.touches.length === 1 && isPinching) {
            // Went from 2 fingers to 1: keep pinching state, don't start drawing
            // Also ensure panning is fully killed so next 2-finger pinch works cleanly
            e.preventDefault();
            isPanningCanvas = false;
            isDraggingBg = false;
        }
    }, { passive: false });

    // Smooth Mobile Touch & Wheel Scrolling for Right Sidebar Unit Library
    const rightSidebar = document.getElementById("rightSidebar");
    const accordionContainer = document.getElementById("accordionCategories");
    
    if (rightSidebar && accordionContainer) {
        // Desktop Wheel
        rightSidebar.addEventListener("wheel", (e) => {
            e.stopPropagation();
            accordionContainer.scrollTop += e.deltaY;
        }, { passive: true });
        
        // Mobile Touch Drag
        let touchStartY = 0;
        let startScrollTop = 0;
        
        rightSidebar.addEventListener("touchstart", (e) => {
            if (e.touches.length === 1) {
                touchStartY = e.touches[0].clientY;
                startScrollTop = accordionContainer.scrollTop;
            }
        }, { passive: true });
        
        rightSidebar.addEventListener("touchmove", (e) => {
            if (e.touches.length === 1) {
                const diffY = touchStartY - e.touches[0].clientY;
                accordionContainer.scrollTop = startScrollTop + diffY;
            }
        }, { passive: true });
    }

    // Mobile Landscape Right Sidebar Toggles
    const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
    const closeRightSidebarBtn = document.getElementById("closeRightSidebarBtn");
    
    if (mobileSidebarToggle && rightSidebar) {
        mobileSidebarToggle.addEventListener("click", () => {
            rightSidebar.classList.toggle("open");
        });
    }
    if (closeRightSidebarBtn && rightSidebar) {
        closeRightSidebarBtn.addEventListener("click", () => {
            rightSidebar.classList.remove("open");
        });
    }
    
    // Fullscreen Toggle
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            } else {
                document.exitFullscreen().catch(err => console.log(err));
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
            }
        });
    }

    // Zoom control buttons
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const zoomResetBtn = document.getElementById("zoomResetBtn");
    
    if (zoomInBtn) {
        zoomInBtn.addEventListener("click", () => {
            canvasUserZoom = Math.min(3.5, canvasUserZoom * 1.2);
            updateCanvasTransform();
        });
    }
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener("click", () => {
            canvasUserZoom = Math.max(0.5, canvasUserZoom / 1.2);
            updateCanvasTransform();
        });
    }
    if (zoomResetBtn) {
        zoomResetBtn.addEventListener("click", () => {
            canvasUserZoom = 1.0;
            canvasPanX = 0;
            canvasPanY = 0;
            updateCanvasTransform();
        });
    }
}

// Set active drawing tool
function setTool(tool) {
    currentTool = tool;
    
    // If user picks a drawing/action tool, exit align mode so drawing works immediately
    if (tool !== Tools.SELECT && isAlignMode) {
        isAlignMode = false;
        showMarkerOverlay = false;
        const alignBtn = document.getElementById("alignBtn");
        const banner = document.getElementById("alignBanner");
        if (alignBtn) {
            alignBtn.innerHTML = '<span class="btn-text">Align Grid</span>';
            alignBtn.classList.remove("btn-primary");
            alignBtn.classList.add("btn-secondary");
        }
        if (banner) banner.style.display = "none";
        updateBoundaryBtnUI();
    }
    
    document.querySelectorAll(".left-sidebar .tool-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.tool === tool) {
            btn.classList.add("active");
        }
    });
    
    if (tool !== Tools.ICON) {
        document.querySelectorAll(".unit-item").forEach(u => u.classList.remove("active"));
        window.selectedUnit = null;
    }
    
    selectedElement = null;
    draw();
}

function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        loadBaseImageFile(e.target.files[0]);
    }
}

function loadBaseImageFile(file) {
    if (!file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            bgImage = img;
            
            // Auto scale/center base image to fit canvas while preserving aspect ratio (contain-fit)
            const scaleW = CANVAS_WIDTH / img.width;
            const scaleH = CANVAS_HEIGHT / img.height;
            bgScale = Math.min(scaleW, scaleH);
            bgX = (CANVAS_WIDTH - img.width * bgScale) / 2;
            bgY = (CANVAS_HEIGHT - img.height * bgScale) / 2;
            
            // Automatically open Grid Alignment mode when image is uploaded
            isAlignMode = true;
            showMarkerOverlay = true;
            updateBoundaryBtnUI();
            
            const alignBtn = document.getElementById("alignBtn");
            if (alignBtn) {
                alignBtn.innerHTML = '<i class="fa-solid fa-lock"></i> <span class="btn-text">Lock Grid & Start Drawing</span>';
                alignBtn.classList.remove("btn-secondary");
                alignBtn.classList.add("btn-primary");
            }
            
            const banner = document.getElementById("alignBanner");
            if (banner) banner.style.display = "flex";
            
            draw();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function toggleAlignMode() {
    if (!bgImage) return;
    
    isAlignMode = !isAlignMode;
    const alignBtn = document.getElementById("alignBtn");
    const banner = document.getElementById("alignBanner");
    
    if (isAlignMode) {
        if (alignBtn) {
            alignBtn.innerHTML = '<i class="fa-solid fa-lock"></i> <span class="btn-text">Lock Grid & Start Drawing</span>';
            alignBtn.classList.remove("btn-secondary");
            alignBtn.classList.add("btn-primary");
        }
        if (banner) banner.style.display = "flex";
        showMarkerOverlay = true;
        updateBoundaryBtnUI();
        setTool(Tools.SELECT); // Force select tool for aligning
    } else {
        if (alignBtn) {
            alignBtn.innerHTML = '<span class="btn-text">Align Grid</span>';
            alignBtn.classList.remove("btn-primary");
            alignBtn.classList.add("btn-secondary");
        }
        if (banner) banner.style.display = "none";
        showMarkerOverlay = false;
        updateBoundaryBtnUI();
    }
    draw();
}

function updateBoundaryBtnUI() {
    const btn = document.getElementById("toggleBoundaryBtn");
    if (!btn) return;
    if (showMarkerOverlay) {
        btn.innerHTML = '<i class="fa-solid fa-border-all"></i> Hide Boundary';
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
    } else {
        btn.innerHTML = '<i class="fa-solid fa-border-all"></i> Show Boundary';
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
    }
}

// Convert screen viewport coordinates to internal 1920x1080 canvas coords
function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: (clientX - rect.left) * (CANVAS_WIDTH / rect.width),
        y: (clientY - rect.top) * (CANVAS_HEIGHT / rect.height)
    };
}

// Mouse Interactivity handlers
function handleMouseDown(e) {
    const coords = getCanvasCoords(e);
    
    if (isAlignMode) {
        isDraggingBg = true;
        dragStartX = coords.x - bgX;
        dragStartY = coords.y - bgY;
        return;
    }
    
    // Normal tactic drawing mode
    if (currentTool === Tools.SELECT) {
        // Direct Pan Navigation: If Right Click, Middle Click, or Spacebar pressed
        if (e.button === 1 || e.button === 2 || isSpacePressed) {
            isPanningCanvas = true;
            panStartMouseX = e.clientX;
            panStartMouseY = e.clientY;
            panStartCanvasX = canvasPanX;
            panStartCanvasY = canvasPanY;
            document.body.style.cursor = "grabbing";
            return;
        }

        let clickedElement = null;
        arrowDragEnd = null;
        isResizingTarget = false;
        
        // 1. If an arrow is already selected, prioritize clicking on its start/end handle points
        if (selectedElement && selectedElement.type === Tools.ARROW) {
            const distStart = Math.hypot(coords.x - selectedElement.x1, coords.y - selectedElement.y1);
            const distEnd = Math.hypot(coords.x - selectedElement.x2, coords.y - selectedElement.y2);
            if (distStart < 26) {
                arrowDragEnd = "x1";
                clickedElement = selectedElement;
            } else if (distEnd < 26) {
                arrowDragEnd = "x2";
                clickedElement = selectedElement;
            }
        }
        
        // 2. If Target Plus is already selected, check corner resize handle (right corner)
        if (selectedElement && selectedElement.type === Tools.XMARK) {
            const s = selectedElement.size || 88;
            const halfX = s / 2;
            const handleX = selectedElement.x + halfX;
            const handleY = selectedElement.y;
            if (Math.hypot(coords.x - handleX, coords.y - handleY) < 22) {
                isResizingTarget = true;
                clickedElement = selectedElement;
            }
        }
        
        if (!clickedElement) {
            // Search elements from top to bottom (reverse array)
            for (let i = elements.length - 1; i >= 0; i--) {
                const el = elements[i];
                if (isClickOnElement(coords, el)) {
                    clickedElement = el;
                    
                    if (el.type === Tools.ARROW) {
                        const distStart = Math.hypot(coords.x - el.x1, coords.y - el.y1);
                        const distEnd = Math.hypot(coords.x - el.x2, coords.y - el.y2);
                        if (distStart < 26) {
                            arrowDragEnd = "x1";
                        } else if (distEnd < 26) {
                            arrowDragEnd = "x2";
                        }
                    }
                    break;
                }
            }
        }
        
        selectedElement = clickedElement;
        if (selectedElement) {
            isDraggingElement = true;
            if (!arrowDragEnd && !isResizingTarget) {
                // Brush uses points[0] instead of .x/.x1
                let refX, refY;
                if (selectedElement.type === Tools.BRUSH && selectedElement.points && selectedElement.points.length > 0) {
                    refX = selectedElement.points[0].x;
                    refY = selectedElement.points[0].y;
                } else {
                    refX = selectedElement.x !== undefined ? selectedElement.x : selectedElement.x1;
                    refY = selectedElement.y !== undefined ? selectedElement.y : selectedElement.y1;
                }
                dragOffset.x = coords.x - refX;
                dragOffset.y = coords.y - refY;
            }
        } else {
            isDraggingElement = false;
            // If zoomed in and clicked on empty canvas, pan canvas smoothly!
            if (canvasUserZoom > 1.05) {
                isPanningCanvas = true;
                // Touch events use e.touches[0].clientX, mouse events use e.clientX
                panStartMouseX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
                panStartMouseY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
                panStartCanvasX = canvasPanX;
                panStartCanvasY = canvasPanY;
                document.body.style.cursor = "grabbing";
            }
        }
        draw();
    } else if (currentTool === Tools.BRUSH) {
        isDrawing = true;
        brushPreview = [{ x: coords.x, y: coords.y }];
    } else if (currentTool === Tools.ARROW) {
        isDrawing = true;
        arrowPreview = {
            x1: coords.x,
            y1: coords.y,
            x2: coords.x,
            y2: coords.y
        };
    } else if (currentTool === Tools.XMARK) {
        const newXMark = {
            id: Date.now() + Math.random(),
            type: Tools.XMARK,
            x: coords.x,
            y: coords.y,
            color: currentColor,
            size: 88 // Standard 3x3 building footprint (~88px)
        };
        elements.push(newXMark);
        saveState();
        
        // Auto switch back to SELECT tool so user can immediately move or resize via corner handle
        setTool(Tools.SELECT);
        selectedElement = newXMark;
        isDraggingElement = false;
        
        draw();
    } else if (currentTool === Tools.TEXT) {
        const popover = document.getElementById("textPopover");
        const popoverInput = document.getElementById("popoverInput");
        
        popover.style.left = `${e.clientX}px`;
        popover.style.top = `${e.clientY}px`;
        popover.style.display = "flex";
        
        textPlacementCoords = { x: coords.x, y: coords.y };
        setTimeout(() => {
            popoverInput.value = "";
            popoverInput.focus();
        }, 50);
    } else if (currentTool === Tools.ICON && window.selectedUnit) {
        const newElement = {
            id: Date.now() + Math.random(),
            type: Tools.ICON,
            x: coords.x,
            y: coords.y,
            src: window.selectedUnit.src,
            name: window.selectedUnit.name,
            folder: window.selectedUnit.folder,
            orderNum: deploymentOrder++
        };
        elements.push(newElement);
        saveState();
        
        // Auto switch back to SELECT tool with nothing actively dragged
        setTool(Tools.SELECT);
        selectedElement = null;
        isDraggingElement = false;
        
        draw();
    } else if (currentTool === Tools.ERASER) {
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            if (isClickOnElement(coords, el)) {
                elements = elements.filter(item => item.id !== el.id);
                saveState();
                draw();
                break;
            }
        }
    }
}

function handleMouseMove(e) {
    if (isPanningCanvas) {
        // Touch events use e.touches[0].clientX, mouse events use e.clientX
        const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
        const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
        canvasPanX = panStartCanvasX + (clientX - panStartMouseX);
        canvasPanY = panStartCanvasY + (clientY - panStartMouseY);
        updateCanvasTransform();
        return;
    }

    const coords = getCanvasCoords(e);
    
    if (isAlignMode && isDraggingBg) {
        bgX = coords.x - dragStartX;
        bgY = coords.y - dragStartY;
        draw();
        return;
    }
    
    if (isDrawing && currentTool === Tools.BRUSH && brushPreview) {
        brushPreview.push({ x: coords.x, y: coords.y });
        draw();
    } else if (isDrawing && currentTool === Tools.ARROW && arrowPreview) {
        arrowPreview.x2 = coords.x;
        arrowPreview.y2 = coords.y;
        draw();
    } else if (isDraggingElement && selectedElement && currentTool === Tools.SELECT) {
        if (isResizingTarget && selectedElement.type === Tools.XMARK) {
            const dx = Math.abs(coords.x - selectedElement.x);
            // Allow smooth resizing from 35px (2x2) up to 240px (5x5)
            selectedElement.size = Math.max(35, Math.min(240, dx * 2));
            draw();
            return;
        }

        if (selectedElement.type === Tools.ARROW) {
            if (arrowDragEnd === "x1") {
                selectedElement.x1 = coords.x;
                selectedElement.y1 = coords.y;
            } else if (arrowDragEnd === "x2") {
                selectedElement.x2 = coords.x;
                selectedElement.y2 = coords.y;
            } else {
                // Move entire arrow
                const dx = selectedElement.x2 - selectedElement.x1;
                const dy = selectedElement.y2 - selectedElement.y1;
                selectedElement.x1 = coords.x - dragOffset.x;
                selectedElement.y1 = coords.y - dragOffset.y;
                selectedElement.x2 = selectedElement.x1 + dx;
                selectedElement.y2 = selectedElement.y1 + dy;
            }
        } else if (selectedElement.type === Tools.BRUSH && selectedElement.points && selectedElement.points.length > 0) {
            const targetX = coords.x - dragOffset.x;
            const targetY = coords.y - dragOffset.y;
            const dx = targetX - selectedElement.points[0].x;
            const dy = targetY - selectedElement.points[0].y;
            selectedElement.points.forEach(p => {
                p.x += dx;
                p.y += dy;
            });
        } else {
            // Move icons/xmarks/text
            selectedElement.x = coords.x - dragOffset.x;
            selectedElement.y = coords.y - dragOffset.y;
        }
        draw();
    }
}

function handleMouseUp() {
    isDraggingBg = false;
    isDraggingElement = false;
    isResizingTarget = false;
    if (isPanningCanvas) {
        isPanningCanvas = false;
        document.body.style.cursor = isSpacePressed ? "grab" : "default";
    }
    
    if (isDrawing && currentTool === Tools.BRUSH && brushPreview) {
        if (brushPreview.length > 1) {
            const newBrush = {
                id: Date.now() + Math.random(),
                type: Tools.BRUSH,
                points: brushPreview,
                color: currentColor,
                width: currentWidth || 8
            };
            elements.push(newBrush);
            saveState();
            
            setTool(Tools.SELECT);
            selectedElement = null;
            isDraggingElement = false;
        }
        brushPreview = null;
        isDrawing = false;
        draw();
    }
    
    if (isDrawing && currentTool === Tools.ARROW && arrowPreview) {
        const dx = arrowPreview.x2 - arrowPreview.x1;
        const dy = arrowPreview.y2 - arrowPreview.y1;
        const length = Math.hypot(dx, dy);
        
        // Only save arrow if it is long enough (prevents tiny line noise)
        if (length > 15) {
            const newArrow = {
                id: Date.now() + Math.random(),
                type: Tools.ARROW,
                x1: arrowPreview.x1,
                y1: arrowPreview.y1,
                x2: arrowPreview.x2,
                y2: arrowPreview.y2,
                color: currentColor,
                width: currentWidth
            };
            elements.push(newArrow);
            saveState();
            
            // Auto switch back to SELECT tool so subsequent clicks drag/move without duplicate drawing
            setTool(Tools.SELECT);
            selectedElement = null;
            isDraggingElement = false;
        }
        arrowPreview = null;
        isDrawing = false;
        draw();
    }
    
    if (selectedElement && currentTool === Tools.SELECT) {
        saveState();
        arrowDragEnd = null;
    }
}

// Click detection algorithm for placed elements
function isClickOnElement(coords, el) {
    const threshold = 15;
    
    if (el.type === Tools.ICON) {
        const folder = (el.folder || "").toLowerCase();
        const isSmall = folder.includes("spell") || folder.includes("equipment");
        const radius = isSmall ? ICON_SIZE / 2 : ICON_SIZE;
        return Math.hypot(coords.x - el.x, coords.y - el.y) < (radius + 6);
    }
    
    if (el.type === Tools.XMARK) {
        return Math.hypot(coords.x - el.x, coords.y - el.y) < (el.size / 2 + 10);
    }
    
    if (el.type === Tools.BRUSH && el.points && el.points.length > 1) {
        for (let i = 0; i < el.points.length - 1; i++) {
            const p1 = el.points[i];
            const p2 = el.points[i + 1];
            const l2 = Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
            let t = l2 === 0 ? 0 : ((coords.x - p1.x) * (p2.x - p1.x) + (coords.y - p1.y) * (p2.y - p1.y)) / l2;
            t = Math.max(0, Math.min(1, t));
            const projX = p1.x + t * (p2.x - p1.x);
            const projY = p1.y + t * (p2.y - p1.y);
            if (Math.hypot(coords.x - projX, coords.y - projY) < 18) return true;
        }
        return false;
    }
    
    if (el.type === Tools.TEXT) {
        ctx.font = `bold ${el.fontSize}px sans-serif`;
        const textWidth = ctx.measureText(el.text).width;
        const h = el.fontSize + 12;
        return coords.x >= el.x - 12 && coords.x <= el.x + textWidth + 12 &&
               coords.y >= el.y - 12 && coords.y <= el.y + h + 12;
    }
    
    if (el.type === Tools.ARROW) {
        // Check endpoints grab handles first
        if (Math.hypot(coords.x - el.x1, coords.y - el.y1) < 26) return true;
        if (Math.hypot(coords.x - el.x2, coords.y - el.y2) < 26) return true;
        
        // Distance from point to line segment
        const x1 = el.x1;
        const y1 = el.y1;
        const x2 = el.x2;
        const y2 = el.y2;
        
        const l2 = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
        if (l2 === 0) return Math.hypot(coords.x - x1, coords.y - y1) < 20;
        
        let t = ((coords.x - x1) * (x2 - x1) + (coords.y - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));
        
        const projectionX = x1 + t * (x2 - x1);
        const projectionY = y1 + t * (y2 - y1);
        
        return Math.hypot(coords.x - projectionX, coords.y - projectionY) < 22;
    }
    
    return false;
}

// Rendering pipeline
function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 1. Draw solid dark background
    ctx.fillStyle = "#0c101c";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 2. Draw base screenshot (if loaded) or splash image
    if (bgImage) {
        ctx.save();
        if (isAlignMode) {
            // Desaturate to 100% grayscale in alignment mode (matching attackmapper.js)
            ctx.filter = "grayscale(100%)";
        }
        ctx.drawImage(bgImage, bgX, bgY, bgImage.width * bgScale, bgImage.height * bgScale);
        ctx.filter = "none";
        ctx.restore();
    } else if (splashImage && splashImage.complete) {
        ctx.drawImage(splashImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        // Draw splash instruction text on empty screen
        ctx.save();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px 'Outfit', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Seret & Lepas screenshot base CoC di sini", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
        ctx.fillStyle = "#6b7280";
        ctx.font = "20px 'Inter', sans-serif";
        ctx.fillText("Atau gunakan tombol 'Upload Base Screenshot' di kanan atas", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
        ctx.restore();
    }
    
    // 3. Draw marker.webp boundary overlay (if alignment mode active OR boundary toggled ON)
    if (isAlignMode || showMarkerOverlay) {
        if (markerImage && markerImage.complete) {
            ctx.save();
            ctx.globalAlpha = 0.45;
            ctx.drawImage(markerImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.restore();
        }
        
        if (isAlignMode) {
            // Alignment Mode Banner Header Inside Canvas
            ctx.save();
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(CANVAS_WIDTH / 2 - 380, 40, 760, 60);
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 2;
            ctx.strokeRect(CANVAS_WIDTH / 2 - 380, 40, 760, 60);
            
            ctx.fillStyle = "#f59e0b";
            ctx.font = "bold 20px 'Outfit', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("Grid Alignment Mode: Geser & Zoom gambar base agar sejajar dengan batas merah", CANVAS_WIDTH / 2, 70);
            ctx.restore();
        }
    }
    
    // 4. Draw placed items/drawing elements
    elements.forEach(el => {
        const isSelected = selectedElement && (el.id === selectedElement.id);
        
        switch (el.type) {
            case Tools.BRUSH:
                drawBrush(el.points, el.color, el.width, isSelected);
                break;
            case Tools.ARROW:
                drawArrow(el.x1, el.y1, el.x2, el.y2, el.color, el.width, isSelected);
                break;
            case Tools.XMARK:
                drawXMark(el.x, el.y, el.color, el.size, isSelected);
                break;
            case Tools.TEXT:
                drawText(el.text, el.x, el.y, el.color, el.fontSize, isSelected);
                break;
            case Tools.ICON:
                drawUnitIcon(el, isSelected);
                break;
        }
    });
    
    // 5. Draw active brush or arrow preview
    if (brushPreview && brushPreview.length > 1) {
        drawBrush(brushPreview, currentColor, currentWidth, false);
    }
    if (arrowPreview) {
        drawArrow(arrowPreview.x1, arrowPreview.y1, arrowPreview.x2, arrowPreview.y2, currentColor, currentWidth, false);
    }
}

// Helper to convert hex colors to rgba with custom opacity
function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(239, 68, 68, ${alpha})`;
    if (hex.startsWith("rgba")) return hex;
    if (hex.startsWith("rgb(")) return hex.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(x => x + x).join("");
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawArrow(x1, y1, x2, y2, color, width, isSelected) {
    ctx.save();
    
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const dist = Math.hypot(x2 - x1, y2 - y1);
    
    // 2 grid tiles total shaft width (1 tile = 20.84px on each side -> halfWidth = 20.84px, total width = 41.68px)
    const halfWidth = TILE_SCALE_X; // 1 tile each side = 2 tiles total width (~41.7px)
    
    // Arrowhead dimensions (wider than shaft for distinct tactical head)
    const headWidth = halfWidth * 2.5; // ~52px wide
    const headLength = Math.min(halfWidth * 2.2, Math.max(30, dist * 0.45));
    const shaftLength = Math.max(0, dist - headLength * 0.65);
    
    ctx.translate(x1, y1);
    ctx.rotate(angle);
    
    // 1. Shaded Corridor (2-Grid wide transparent fill matching chosen color)
    const rgba0 = hexToRgba(color, 0.05);
    const rgbaSoft = hexToRgba(color, 0.22);
    const rgbaCore = hexToRgba(color, 0.45);
    const rgbaSolid = hexToRgba(color, 0.95);
    
    const grad = ctx.createLinearGradient(0, -halfWidth, 0, halfWidth);
    grad.addColorStop(0, rgba0);
    grad.addColorStop(0.2, rgbaSoft);
    grad.addColorStop(0.5, rgbaCore);
    grad.addColorStop(0.8, rgbaSoft);
    grad.addColorStop(1, rgba0);
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, -halfWidth, shaftLength, halfWidth * 2);
    
    // 2. Dashed Outer Border Lines of the 2-Grid Corridor
    ctx.strokeStyle = rgbaSolid;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(0, -halfWidth);
    ctx.lineTo(shaftLength, -halfWidth);
    ctx.moveTo(0, halfWidth);
    ctx.lineTo(shaftLength, halfWidth);
    ctx.stroke();
    
    // 3. Centerline Trajectory (dashed white line along center)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(shaftLength, 0);
    ctx.stroke();
    
    // 4. Direction flow indicator chevrons along the corridor
    ctx.setLineDash([]);
    ctx.fillStyle = hexToRgba(color, 0.65);
    for (let d = 40; d < shaftLength - 25; d += 65) {
        ctx.beginPath();
        ctx.moveTo(d + 10, 0);
        ctx.lineTo(d - 6, -halfWidth * 0.55);
        ctx.lineTo(d - 1, 0);
        ctx.lineTo(d - 6, halfWidth * 0.55);
        ctx.closePath();
        ctx.fill();
    }
    
    // 5. Arrowhead at the tip (dist, 0)
    const tipX = dist;
    const baseCutX = dist - headLength;
    const baseCenterX = dist - headLength * 0.65;
    
    ctx.beginPath();
    ctx.moveTo(tipX, 0);
    ctx.lineTo(baseCutX, -headWidth / 2);
    ctx.lineTo(baseCenterX, 0);
    ctx.lineTo(baseCutX, headWidth / 2);
    ctx.closePath();
    ctx.fillStyle = rgbaSolid;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    
    ctx.restore();
    
    // 6. Highlight selection with interactive handles to edit endpoints
    if (isSelected) {
        ctx.save();
        ctx.strokeStyle = "rgba(0, 255, 255, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.strokeRect(Math.min(x1, x2) - 16, Math.min(y1, y2) - 16, Math.abs(x2 - x1) + 32, Math.abs(y2 - y1) + 32);
        
        ctx.setLineDash([]);
        
        // Handle Point 1: Start Point (x1, y1)
        ctx.beginPath();
        ctx.arc(x1, y1, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Handle Point 2: End Tip (x2, y2)
        ctx.beginPath();
        ctx.arc(x2, y2, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0055";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.restore();
    }
}

function drawBrush(points, color, width, isSelected) {
    if (!points || points.length < 2) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    const strokeW = width || 8;
    
    // 1. White outer border outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = strokeW + 4;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // 2. Colored inner stroke
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // 3. Selection outline
    if (isSelected) {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        points.forEach(p => {
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
        });
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.strokeRect(minX - 10, minY - 10, maxX - minX + 20, maxY - minY + 20);
    }
    
    ctx.restore();
}

function drawXMark(x, y, color, size, isSelected) {
    ctx.save();
    
    // Default size is 3x3 building (~88px), but can be resized to 2x2 (~59px), 4x4 (~118px), etc.
    const s = size || 88;
    const halfX = s / 2;
    const halfY = halfX * ISO_Y_RATIO;
    const armW = 2.5; // Ultra-thin, crisp, and sharp lines
    
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // 1. Isometric Diamond Base Alignment Guide (terhubung pas ke 4 sudut diagonal bangunan CoC)
    ctx.beginPath();
    ctx.moveTo(x, y - halfY);
    ctx.lineTo(x + halfX, y);
    ctx.lineTo(x, y + halfY);
    ctx.lineTo(x - halfX, y);
    ctx.closePath();
    ctx.strokeStyle = hexToRgba(color, 0.85);
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    
    // 2. White border outline for Plus (+) Crosshair
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = armW + 2.5;
    ctx.setLineDash([]);
    
    // Horizontal cross arm
    ctx.beginPath();
    ctx.moveTo(x - halfX * 0.9, y);
    ctx.lineTo(x + halfX * 0.9, y);
    // Vertical cross arm
    ctx.moveTo(x, y - halfY * 0.9);
    ctx.lineTo(x, y + halfY * 0.9);
    ctx.stroke();
    
    // 3. Colored solid inner core
    ctx.strokeStyle = color;
    ctx.lineWidth = armW;
    ctx.beginPath();
    ctx.moveTo(x - halfX * 0.9, y);
    ctx.lineTo(x + halfX * 0.9, y);
    ctx.moveTo(x, y - halfY * 0.9);
    ctx.lineTo(x, y + halfY * 0.9);
    ctx.stroke();
    
    // Center Bullseye Dot
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 4. Selection Box & Corner Resize Handle
    if (isSelected) {
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x - halfX - 8, y - halfY - 8, s + 16, halfY * 2 + 16);
        
        ctx.setLineDash([]);
        // Resize handle on right corner of diamond (drag to resize 2x2, 3x3, 4x4)
        const handleX = x + halfX;
        const handleY = y;
        ctx.beginPath();
        ctx.arc(handleX, handleY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawText(text, x, y, color, fontSize, isSelected) {
    ctx.save();
    
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    
    const textWidth = ctx.measureText(text).width;
    const h = fontSize + 8;
    
    // Render semi-transparent dark background for extreme readability
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    ctx.fillRect(x - 6, y - 4, textWidth + 12, h);
    
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    
    if (isSelected) {
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x - 8, y - 6, textWidth + 16, h + 4);
    }
    
    ctx.restore();
}

function drawRocketBackpackBeam(startX, startY) {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    
    // Angle pointing from drop point towards center of base
    const angle = Math.atan2(centerY - startY, centerX - startX);
    const distToCenter = Math.hypot(centerX - startX, centerY - startY);
    const beamLength = Math.max(2600, distToCenter * 2.5);
    
    // 4 tiles total width (2 tiles left + 2 tiles right from center line)
    // 2 tiles in canvas px = 2 * TILE_SCALE_X = 2 * 20.84 = 41.68px (total width ~83.36px)
    const halfWidth = 2 * TILE_SCALE_X;
    
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    
    // 1. Transparent Tactical Red Laser Beam Corridor
    const grad = ctx.createLinearGradient(0, -halfWidth, 0, halfWidth);
    grad.addColorStop(0, "rgba(239, 68, 68, 0.0)");
    grad.addColorStop(0.2, "rgba(239, 68, 68, 0.12)");
    grad.addColorStop(0.5, "rgba(239, 68, 68, 0.26)");
    grad.addColorStop(0.8, "rgba(239, 68, 68, 0.12)");
    grad.addColorStop(1, "rgba(239, 68, 68, 0.0)");
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, -halfWidth, beamLength, halfWidth * 2);
    
    // 2. Outer Beam Corridor Edges (dashed red border lines)
    ctx.strokeStyle = "rgba(239, 68, 68, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(0, -halfWidth);
    ctx.lineTo(beamLength, -halfWidth);
    ctx.moveTo(0, halfWidth);
    ctx.lineTo(beamLength, halfWidth);
    ctx.stroke();
    
    // 3. Center Trajectory Line (dashed white line along center)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(beamLength, 0);
    ctx.stroke();
    
    // 4. Flight direction arrows along the trajectory
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
    for (let d = 250; d < beamLength; d += 350) {
        ctx.beginPath();
        ctx.moveTo(d, 0);
        ctx.lineTo(d - 18, -10);
        ctx.lineTo(d - 12, 0);
        ctx.lineTo(d - 18, 10);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.restore();
}

function drawUnitIcon(el, isSelected) {
    let img = imageCache.get(el.src);
    
    if (!img) {
        img = new Image();
        img.onload = () => {
            draw();
        };
        img.src = el.src;
        imageCache.set(el.src, img);
    } else if (!img.complete) {
        img.onload = () => {
            draw();
        };
    }
    
    // Spells and Equipment are small circular icons (ICON_SIZE / 2)
    const folder = (el.folder || "").toLowerCase();
    const isSpell = folder.includes("spell");
    const isEquipment = folder.includes("equipment");
    const isSmallIcon = isEquipment || isSpell;
    const currentRadius = isSmallIcon ? ICON_SIZE / 2 : ICON_SIZE;
    
    const unitKey = (el.name || "").toLowerCase().trim();
    const spellConfig = SPELL_RADII[unitKey];
    
    // Draw Rocket Backpacks linear trajectory projection (passes through center from edge to edge, 4 grid width)
    if (unitKey.includes("rocket backpack") || unitKey.includes("rocket_backpack")) {
        drawRocketBackpackBeam(el.x, el.y);
    } else if (spellConfig) {
        const radiusX = spellConfig.radiusTiles * TILE_SCALE_X;
        const radiusY = spellConfig.radiusTiles * TILE_SCALE_Y;
        
        ctx.save();
        ctx.beginPath();
        // Exact Dimetric ground plane ellipse projection
        ctx.ellipse(el.x, el.y, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = spellConfig.color;
        ctx.fill();
        ctx.strokeStyle = spellConfig.stroke;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
    }
    
    // Clip circle for icon image
    ctx.save();
    ctx.beginPath();
    ctx.arc(el.x, el.y, currentRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    if (!el._exportMode && img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, el.x - currentRadius, el.y - currentRadius, currentRadius * 2, currentRadius * 2);
    } else {
        // Fallback: colored circle with unit name initial (used in export mode to avoid CORS taint)
        ctx.fillStyle = "#222d42";
        ctx.fillRect(el.x - currentRadius, el.y - currentRadius, currentRadius * 2, currentRadius * 2);
        // Draw unit name abbreviation inside the circle
        ctx.fillStyle = "#ffffff";
        const abbrev = (el.name || "?").substring(0, 3).toUpperCase();
        ctx.font = `bold ${currentRadius * 0.7}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(abbrev, el.x, el.y);
    }
    
    ctx.restore();
    
    // Render icon white stroke border outline
    ctx.save();
    ctx.beginPath();
    ctx.arc(el.x, el.y, currentRadius, 0, Math.PI * 2);
    ctx.strokeStyle = isSelected ? "#00ffff" : "#ffffff";
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();
    
    // Render Deployment Order badge on bottom-right corner
    const badgeR = isSmallIcon ? 8 : 12;
    const badgeX = el.x + currentRadius - (isSmallIcon ? 2 : 4);
    const badgeY = el.y + currentRadius - (isSmallIcon ? 2 : 4);
    
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = "#f97316"; // Orange badge (matching attackmapper)
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${el.orderNum > 9 ? badgeR * 0.85 : badgeR * 1.15}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(el.orderNum), badgeX, badgeY);
    
    ctx.restore();
}

// Undo/Redo/State Management
function saveState() {
    // Keep max 25 history states
    if (undoStack.length >= 25) {
        undoStack.shift();
    }
    
    // Clone elements deeply
    const state = JSON.stringify(elements);
    undoStack.push(state);
    
    // Empty redo stack on new action
    redoStack = [];
}

function undo() {
    if (undoStack.length <= 1) return; // keep initial state
    
    const currentState = undoStack.pop();
    redoStack.push(currentState);
    
    const previousState = undoStack[undoStack.length - 1];
    elements = JSON.parse(previousState);
    
    // Reset order number based on highest present deploymentOrder
    recalculateDeploymentOrder();
    
    selectedElement = null;
    draw();
}

function redo() {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack.pop();
    undoStack.push(nextState);
    elements = JSON.parse(nextState);
    
    recalculateDeploymentOrder();
    
    selectedElement = null;
    draw();
}

function recalculateDeploymentOrder() {
    let maxOrder = 0;
    elements.forEach(el => {
        if (el.type === Tools.ICON && el.orderNum > maxOrder) {
            maxOrder = el.orderNum;
        }
    });
    deploymentOrder = maxOrder + 1;
}

function clearCanvas() {
    if (elements.length === 0) return;
    
    if (confirm("Hapus semua coretan taktis dan penempatan unit di canvas?")) {
        elements = [];
        deploymentOrder = 1;
        selectedElement = null;
        saveState();
        draw();
    }
}

// Export canvas image
function downloadPlan() {
    if (!bgImage && elements.length === 0) {
        alert("Harap unggah screenshot base CoC atau buat coretan terlebih dahulu sebelum mengunduh.");
        return;
    }
    
    // Draw all layers again without selections highlight
    selectedElement = null;
    draw();
    
    // Export PNG — try direct export first, fallback to icon-placeholder re-render if canvas is tainted
    try {
        canvas.toBlob(blob => {
            if (!blob) {
                // Blob is null if canvas is tainted by cross-origin images
                downloadWithFallback();
                return;
            }
            triggerBlobDownload(blob);
        }, "image/png", 0.95);
    } catch (err) {
        // SecurityError: canvas tainted by cross-origin icon images
        downloadWithFallback();
    }
}

function downloadWithFallback() {
    // Re-render to offscreen canvas with icon placeholders instead of cross-origin images
    const offscreen = document.createElement("canvas");
    offscreen.width = CANVAS_WIDTH;
    offscreen.height = CANVAS_HEIGHT;
    const offCtx = offscreen.getContext("2d");
    
    // Temporarily swap ctx so all draw functions render to offscreen canvas
    const origCtx = ctx;
    ctx = offCtx;
    
    // Flag icon elements to use placeholder mode (skip drawImage)
    elements.forEach(el => { if (el.type === Tools.ICON) el._exportMode = true; });
    
    draw();
    
    // Restore
    elements.forEach(el => { delete el._exportMode; });
    ctx = origCtx;
    draw(); // Restore main canvas display
    
    try {
        offscreen.toBlob(blob => {
            if (!blob) {
                alert("Gagal membuat gambar. Coba lagi.");
                return;
            }
            triggerBlobDownload(blob);
        }, "image/png", 0.95);
    } catch (err) {
        alert("Download gagal. Coba lagi.");
    }
}

function triggerBlobDownload(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `coc-attack-plan-${Date.now()}.png`;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
}
