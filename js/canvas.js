// ==========================================================================
// CANVAS & VIEWPORT MANAGEMENT
// ==========================================================================

function initCanvas() {
    canvas = document.getElementById("plannerCanvas");
    ctx = canvas.getContext("2d");

    // Internal canvas resolution (fixed 1920x1080)
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    fitCanvasToWorkspace();
    window.addEventListener("resize", fitCanvasToWorkspace);
    window.addEventListener("load", fitCanvasToWorkspace);
}

function updateZoomIndicator() {
    const zoomText = document.getElementById("zoomPercentage");
    if (!zoomText) return;
    if (isAlignMode && bgImage) {
        const percentage = Math.round((bgScale / initialBgScale) * 100);
        zoomText.innerText = `${percentage}%`;
    } else {
        zoomText.innerText = `${Math.round(canvasUserZoom * 100)}%`;
    }
}

function updateCanvasTransform() {
    const canvasContainer = document.querySelector(".canvas-container");
    if (!canvasContainer) return;
    const finalScale = canvasBaseScale * canvasUserZoom;
    canvasContainer.style.transform = `translate(calc(-50% + ${canvasPanX}px), calc(-50% + ${canvasPanY}px)) scale(${finalScale})`;

    updateZoomIndicator();
}

// Adjust HTML Canvas responsive scale to fit the viewport workspace
function fitCanvasToWorkspace() {
    const container = document.querySelector(".workspace");
    const canvasContainer = document.querySelector(".canvas-container");

    if (!container || !canvasContainer) return;

    const isMobile = window.innerWidth <= 980 || window.innerHeight <= 600;
    const padding = isMobile ? 16 : 32;
    const containerW = Math.max(100, container.clientWidth - padding);
    const containerH = Math.max(100, container.clientHeight - padding);

    canvasBaseScale = Math.min(containerW / CANVAS_WIDTH, containerH / CANVAS_HEIGHT);
    updateCanvasTransform();
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

// --------------------------------------------------------------------------
// Image Loading & Alignment Handlers
// --------------------------------------------------------------------------

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

            // Hide welcome overlay if it exists
            const welcomeOverlay = document.getElementById("welcomeOverlay");
            if (welcomeOverlay) welcomeOverlay.style.display = "none";

            // Auto scale/center base image to fit canvas while preserving aspect ratio (contain-fit)
            const scaleW = CANVAS_WIDTH / img.width;
            const scaleH = CANVAS_HEIGHT / img.height;
            bgScale = Math.min(scaleW, scaleH);
            initialBgScale = bgScale;
            bgX = (CANVAS_WIDTH - img.width * bgScale) / 2;
            bgY = (CANVAS_HEIGHT - img.height * bgScale) / 2;

            // Automatically open Grid Alignment mode when image is uploaded
            isAlignMode = true;
            showMarkerOverlay = true;
            updateBoundaryBtnUI();

            const alignBtn = document.getElementById("alignBtn");
            if (alignBtn) {
                alignBtn.innerHTML = '<i class="ri-lock-2-line"></i> <span class="btn-text">Lock Grid</span>';
                alignBtn.classList.remove("btn-secondary");
                alignBtn.classList.add("btn-primary");
            }

            const floatingControls = document.getElementById("floatingControls");
            const alignIndicator = document.getElementById("alignIndicator");
            if (floatingControls) floatingControls.classList.add("align-mode");
            if (alignIndicator) alignIndicator.style.display = "flex";

            updateZoomIndicator();
            if (typeof draw === "function") draw();

            // Check fullscreen recommendation toast for mobile
            if (typeof window.checkFullscreenToast === "function") {
                window.checkFullscreenToast();
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function toggleAlignMode() {
    if (!bgImage) return;

    isAlignMode = !isAlignMode;
    const alignBtn = document.getElementById("alignBtn");
    const floatingControls = document.getElementById("floatingControls");
    const alignIndicator = document.getElementById("alignIndicator");

    if (isAlignMode) {
        if (alignBtn) {
            alignBtn.innerHTML = '<i class="ri-lock-2-line"></i> <span class="btn-text">Lock Grid</span>';
            alignBtn.classList.remove("btn-secondary");
            alignBtn.classList.add("btn-primary");
        }
        if (floatingControls) floatingControls.classList.add("align-mode");
        if (alignIndicator) alignIndicator.style.display = "flex";
        showMarkerOverlay = true;
        updateBoundaryBtnUI();
        setTool(Tools.SELECT); // Force select tool for aligning
        
        // Reset control target to default: image and update UI pills
        alignControlTarget = "image";
        const targetImageBtn = document.getElementById("alignTargetImage");
        const targetCanvasBtn = document.getElementById("alignTargetCanvas");
        if (targetImageBtn) targetImageBtn.classList.add("active");
        if (targetCanvasBtn) targetCanvasBtn.classList.remove("active");
    } else {
        if (alignBtn) {
            alignBtn.innerHTML = '<i class="ri-lock-unlock-line"></i> <span class="btn-text">Align Grid</span>';
            alignBtn.classList.remove("btn-primary");
            alignBtn.classList.add("btn-secondary");
        }
        if (floatingControls) floatingControls.classList.remove("align-mode");
        if (alignIndicator) alignIndicator.style.display = "none";
        showMarkerOverlay = false;
        updateBoundaryBtnUI();
        
        // Reset control target
        alignControlTarget = "image";
    }
    updateZoomIndicator();
    if (typeof draw === "function") draw();
}

function updateBoundaryBtnUI() {
    const btn = document.getElementById("toggleBoundaryBtn");
    if (!btn) return;
    btn.innerHTML = '<i class="ri-grid-line"></i>';
    if (showMarkerOverlay) {
        btn.title = "Hide Red Boundary";
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
    } else {
        btn.title = "Show Red Boundary";
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
    }
}
