// ==========================================================================
// USER INTERACTIONS, TOOL CONTROLLERS & EVENT LISTENERS
// ==========================================================================

// Dismiss all active tool popovers
function closeAllPopovers() {
    document.querySelectorAll(".tool-popover.active").forEach(p => p.classList.remove("active"));
}

// Set active drawing tool
function setTool(tool) {
    currentTool = tool;

    // If user picks a drawing/action tool, exit align mode so drawing works immediately
    if (tool !== Tools.SELECT && isAlignMode) {
        isAlignMode = false;
        showMarkerOverlay = false;
        const alignBtn = document.getElementById("alignBtn");
        const floatingControls = document.getElementById("floatingControls");
        const alignIndicator = document.getElementById("alignIndicator");
        if (alignBtn) {
            alignBtn.innerHTML = '<i class="ri-lock-unlock-line"></i> <span class="btn-text">Align Grid</span>';
            alignBtn.classList.remove("btn-primary");
            alignBtn.classList.add("btn-secondary");
        }
        if (floatingControls) floatingControls.classList.remove("align-mode");
        if (alignIndicator) alignIndicator.style.display = "none";
        updateBoundaryBtnUI();
        updateZoomIndicator();

        // Reset control target to default: image
        alignControlTarget = "image";
    }

    document.querySelectorAll(".left-sidebar .tool-btn").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.tool === tool) {
            btn.classList.add("active");
        }
    });

    // Synchronize stroke thickness with remembered tool width
    if (tool === Tools.BRUSH) {
        currentWidth = brushWidth || 2;
        updateThicknessUI(currentWidth);
    } else if (tool === Tools.ARROW) {
        currentWidth = arrowWidth || 4;
        updateThicknessUI(currentWidth);
    }

    if (tool !== Tools.ICON) {
        document.querySelectorAll(".unit-item").forEach(u => u.classList.remove("active"));
        window.selectedUnit = null;
    }

    if (tool !== Tools.SELECT) {
        if (typeof hideHeroGearDock === "function") hideHeroGearDock();
    }

    selectedElement = null;
    if (typeof draw === "function") draw();
}

function updateThicknessUI(width) {
    if (!width) return;
    const activePopover = (currentTool === Tools.ARROW)
        ? document.getElementById("arrowPopover")
        : document.getElementById("brushPopover");

    const thicknessBtns = activePopover
        ? activePopover.querySelectorAll(".thickness-btn")
        : document.querySelectorAll(".thickness-btn");

    thicknessBtns.forEach(b => {
        const btnW = parseFloat(b.dataset.width);
        b.classList.toggle("active", Math.abs(btnW - width) < 0.5);
    });
}

// --------------------------------------------------------------------------
// Mouse & Touch Interaction Handlers for Canvas
// --------------------------------------------------------------------------

function handleMouseDown(e) {
    closeAllPopovers();
    const coords = getCanvasCoords(e);
    
    // Safely extract client coordinates for both mouse and touch events
    const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;

    if (isAlignMode) {
        if (alignControlTarget === "view" || e.button === 1 || e.button === 2 || isSpacePressed) {
            e.preventDefault(); // Prevent browser default drag/selection
            isPanningCanvas = true;
            panStartMouseX = clientX;
            panStartMouseY = clientY;
            panStartCanvasX = canvasPanX;
            panStartCanvasY = canvasPanY;
            document.body.style.cursor = "grabbing";
            return;
        }

        isDraggingBg = true;
        dragStartX = coords.x - bgX;
        dragStartY = coords.y - bgY;
        return;
    }

    // Normal tactic drawing mode
    if (currentTool === Tools.SELECT) {
        // Direct Pan Navigation: If Right Click, Middle Click, or Spacebar pressed
        if (e.button === 1 || e.button === 2 || isSpacePressed) {
            e.preventDefault(); // Prevent browser default scrolling or context menus
            isPanningCanvas = true;
            panStartMouseX = clientX;
            panStartMouseY = clientY;
            panStartCanvasX = canvasPanX;
            panStartCanvasY = canvasPanY;
            document.body.style.cursor = "grabbing";
            return;
        }

        let clickedElement = null;
        arrowDragEnd = null;
        isResizingTarget = false;

        // 1. If an arrow or giant arrow is already selected, prioritize clicking on its start/end handle points
        if (selectedElement && (selectedElement.type === Tools.ARROW || selectedElement.type === "giant_arrow")) {
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

        // 2. If Target Plus is already selected, check corner resize handles (left, right, top, bottom)
        if (selectedElement && selectedElement.type === Tools.XMARK) {
            const s = selectedElement.size || 88;
            const halfX = s / 2;
            const halfY = halfX * ISO_Y_RATIO;
            const handles = [
                { x: selectedElement.x + halfX, y: selectedElement.y },
                { x: selectedElement.x - halfX, y: selectedElement.y },
                { x: selectedElement.x, y: selectedElement.y + halfY },
                { x: selectedElement.x, y: selectedElement.y - halfY }
            ];
            const clickedHandle = handles.find(h => Math.hypot(coords.x - h.x, coords.y - h.y) < 22);
            if (clickedHandle) {
                isResizingTarget = true;
                clickedElement = selectedElement;
            }
        }

        // 3. If Circle is already selected, check perimeter resize handles (left, right, top, bottom)
        if (selectedElement && selectedElement.type === Tools.CIRCLE) {
            const rx = selectedElement.radius || (4 * TILE_SCALE_X);
            const ry = rx * ISO_Y_RATIO;
            const handles = [
                { x: selectedElement.x + rx, y: selectedElement.y },
                { x: selectedElement.x - rx, y: selectedElement.y },
                { x: selectedElement.x, y: selectedElement.y + ry },
                { x: selectedElement.x, y: selectedElement.y - ry }
            ];
            const clickedHandle = handles.find(h => Math.hypot(coords.x - h.x, coords.y - h.y) < 22);
            if (clickedHandle) {
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
            if (typeof getHeroKey === "function" && getHeroKey(selectedElement)) {
                showHeroGearDock(selectedElement);
            } else if (typeof hideHeroGearDock === "function") {
                hideHeroGearDock();
            }

            if (selectedElement.width) {
                updateThicknessUI(selectedElement.width);
            }
            isDraggingElement = true;
            if (!arrowDragEnd && !isResizingTarget) {
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
            if (typeof hideHeroGearDock === "function") hideHeroGearDock();
            isDraggingElement = false;
            // If canvas is not centered/default, allow left-click panning on empty area
            if (canvasUserZoom !== 1.0 || canvasPanX !== 0 || canvasPanY !== 0) {
                e.preventDefault(); // Prevent browser default selection/image dragging
                isPanningCanvas = true;
                panStartMouseX = clientX;
                panStartMouseY = clientY;
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
    } else if (currentTool === Tools.CIRCLE) {
        isDrawing = true;
        circlePreview = {
            x: coords.x,
            y: coords.y,
            radius: 10
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
        const unitName = (window.selectedUnit.name || "").toLowerCase().trim();
        const isGiantArrow = unitName.includes("giant arrow") || unitName.includes("giant_arrow");

        if (isGiantArrow) {
            isDrawing = true;
            const defaultDx = (951.5 - coords.x);
            const defaultDy = (537 - coords.y);
            const angle = (defaultDx === 0 && defaultDy === 0) ? 0 : Math.atan2(defaultDy, defaultDx);
            giantArrowPreview = {
                id: Date.now() + Math.random(),
                type: "giant_arrow",
                x1: coords.x,
                y1: coords.y,
                x2: coords.x + Math.cos(angle) * 350,
                y2: coords.y + Math.sin(angle) * 350,
                src: window.selectedUnit.src,
                name: window.selectedUnit.name,
                folder: window.selectedUnit.folder,
                orderNum: deploymentOrder
            };
            draw();
            return;
        }

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

        setTool(Tools.SELECT);
        selectedElement = newElement;
        isDraggingElement = false;

        if (typeof getHeroKey === "function" && getHeroKey(newElement)) {
            showHeroGearDock(newElement);
        } else if (typeof hideHeroGearDock === "function") {
            hideHeroGearDock();
        }

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

    if (isDrawing && giantArrowPreview) {
        giantArrowPreview.x2 = coords.x;
        giantArrowPreview.y2 = coords.y;
        draw();
        return;
    } else if (isDrawing && currentTool === Tools.BRUSH && brushPreview) {
        const lastPoint = brushPreview[brushPreview.length - 1];
        const dist = Math.hypot(coords.x - lastPoint.x, coords.y - lastPoint.y);
        if (dist >= 2.5) {
            brushPreview.push({ x: coords.x, y: coords.y });
            draw();
        }
    } else if (isDrawing && currentTool === Tools.ARROW && arrowPreview) {
        arrowPreview.x2 = coords.x;
        arrowPreview.y2 = coords.y;
        draw();
    } else if (isDrawing && currentTool === Tools.CIRCLE && circlePreview) {
        circlePreview.radius = Math.max(10, Math.hypot(coords.x - circlePreview.x, coords.y - circlePreview.y));
        draw();
    } else if (isDraggingElement && selectedElement && currentTool === Tools.SELECT) {
        if (isResizingTarget && selectedElement.type === Tools.XMARK) {
            const dx = Math.abs(coords.x - selectedElement.x);
            selectedElement.size = Math.max(35, Math.min(240, dx * 2));
            draw();
            return;
        }

        if (isResizingTarget && selectedElement.type === Tools.CIRCLE) {
            const dx = coords.x - selectedElement.x;
            const dy = (coords.y - selectedElement.y) / ISO_Y_RATIO;
            const dist = Math.hypot(dx, dy);
            selectedElement.radius = Math.max(15, Math.min(700, dist));
            draw();
            return;
        }

        if (selectedElement.type === Tools.ARROW || selectedElement.type === "giant_arrow") {
            if (arrowDragEnd === "x1") {
                selectedElement.x1 = coords.x;
                selectedElement.y1 = coords.y;
            } else if (arrowDragEnd === "x2") {
                selectedElement.x2 = coords.x;
                selectedElement.y2 = coords.y;
            } else {
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

    if (isDrawing && giantArrowPreview) {
        const dist = Math.hypot(giantArrowPreview.x2 - giantArrowPreview.x1, giantArrowPreview.y2 - giantArrowPreview.y1);
        if (dist < 15) {
            const defaultDx = (951.5 - giantArrowPreview.x1);
            const defaultDy = (537 - giantArrowPreview.y1);
            const angle = (defaultDx === 0 && defaultDy === 0) ? 0 : Math.atan2(defaultDy, defaultDx);
            giantArrowPreview.x2 = giantArrowPreview.x1 + Math.cos(angle) * 350;
            giantArrowPreview.y2 = giantArrowPreview.y1 + Math.sin(angle) * 350;
        }
        elements.push(giantArrowPreview);
        deploymentOrder++;
        saveState();

        setTool(Tools.SELECT);
        selectedElement = giantArrowPreview;
        isDraggingElement = false;
        giantArrowPreview = null;
        isDrawing = false;
        draw();
    }

    if (isDrawing && currentTool === Tools.BRUSH && brushPreview) {
        if (brushPreview.length > 1) {
            const newBrush = {
                id: Date.now() + Math.random(),
                type: Tools.BRUSH,
                points: brushPreview,
                color: currentColor,
                width: currentWidth || 5
            };
            elements.push(newBrush);
            saveState();
        }
        brushPreview = null;
        isDrawing = false;
        draw();
    }

    if (isDrawing && currentTool === Tools.ARROW && arrowPreview) {
        const dx = arrowPreview.x2 - arrowPreview.x1;
        const dy = arrowPreview.y2 - arrowPreview.y1;
        const length = Math.hypot(dx, dy);

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
        }
        arrowPreview = null;
        isDrawing = false;
        draw();
    }

    if (isDrawing && currentTool === Tools.CIRCLE && circlePreview) {
        const r = circlePreview.radius < 18 ? Math.round(4 * TILE_SCALE_X) : Math.round(circlePreview.radius);
        const newCircle = {
            id: Date.now() + Math.random(),
            type: Tools.CIRCLE,
            x: circlePreview.x,
            y: circlePreview.y,
            radius: r,
            color: currentColor
        };
        elements.push(newCircle);
        saveState();

        setTool(Tools.SELECT);
        selectedElement = newCircle;
        isDraggingElement = false;
        circlePreview = null;
        isDrawing = false;
        draw();
    }

    if (selectedElement && currentTool === Tools.SELECT) {
        saveState();
        arrowDragEnd = null;
    }
}

// ==========================================================================
// HERO EQUIPMENT CONTEXTUAL SHORTCUT DOCK
// ==========================================================================

let currentActiveHeroForGear = null;

function getHeroKey(el) {
    if (!el || (el.type !== Tools.ICON && el.type !== "icon")) return null;
    const name = (el.name || "").toLowerCase().replace(/_/g, " ").trim();
    if (typeof HERO_EQUIPMENT_MAP === "undefined") return null;
    for (const key in HERO_EQUIPMENT_MAP) {
        if (name.includes(key)) return key;
    }
    return null;
}

function showHeroGearDock(heroEl) {
    const heroKey = getHeroKey(heroEl);
    if (!heroKey || !HERO_EQUIPMENT_MAP[heroKey]) {
        hideHeroGearDock();
        return;
    }

    currentActiveHeroForGear = heroEl;
    const heroConfig = HERO_EQUIPMENT_MAP[heroKey];
    const dock = document.getElementById("heroGearDock");
    const title = document.getElementById("heroGearName");
    const itemsContainer = document.getElementById("heroGearItems");

    if (!dock || !title || !itemsContainer) return;

    title.innerHTML = `<i class="ri-vip-crown-2-line"></i> ${heroConfig.heroName}`;
    itemsContainer.innerHTML = "";

    heroConfig.items.forEach(gear => {
        const btn = document.createElement("button");
        btn.className = "gear-item-btn";
        btn.title = gear.name;
        btn.innerHTML = `<img src="assets/Hereos Equipment/${gear.file}" alt="${gear.name}" loading="lazy" />`;
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            equipGearToHero(currentActiveHeroForGear, gear);
        });
        itemsContainer.appendChild(btn);
    });

    dock.classList.add("active");
}

function hideHeroGearDock() {
    currentActiveHeroForGear = null;
    const dock = document.getElementById("heroGearDock");
    if (dock) dock.classList.remove("active");
}

function equipGearToHero(heroEl, gear) {
    if (!heroEl) return;

    // Count existing equipment attached to or near this hero
    const existingGears = elements.filter(el => {
        if (!el || (el.type !== Tools.ICON && el.type !== "giant_arrow")) return false;
        const f = (el.folder || el.src || "").toLowerCase();
        const isEq = f.includes("equipment");
        const dist = Math.hypot((el.x !== undefined ? el.x : el.x1) - heroEl.x, (el.y !== undefined ? el.y : el.y1) - heroEl.y);
        return isEq && dist < 120;
    });

    const gearIndex = existingGears.length;
    // Sequential offset positions around hero:
    // 1st: Right-side (+40, -8)
    // 2nd: Left-side  (-40, -8)
    // 3rd: Top-side   (0, -46)
    // 4th: Bottom-side(0, +38)
    const gearOffsets = [
        { dx: 40, dy: -8 },
        { dx: -40, dy: -8 },
        { dx: 0, dy: -46 },
        { dx: 0, dy: 38 }
    ];
    const offset = gearOffsets[gearIndex % gearOffsets.length];
    const targetX = Math.round(heroEl.x + offset.dx);
    const targetY = Math.round(heroEl.y + offset.dy);

    const isGiantArrow = (gear.name || "").toLowerCase().includes("giant arrow");
    let newElement;

    if (isGiantArrow) {
        const defaultDx = (951.5 - heroEl.x);
        const defaultDy = (537 - heroEl.y);
        const angle = (defaultDx === 0 && defaultDy === 0) ? 0 : Math.atan2(defaultDy, defaultDx);
        newElement = {
            id: Date.now() + Math.random(),
            type: "giant_arrow",
            x1: heroEl.x,
            y1: heroEl.y,
            x2: Math.round(heroEl.x + Math.cos(angle) * 350),
            y2: Math.round(heroEl.y + Math.sin(angle) * 350),
            src: `assets/Hereos Equipment/${gear.file}`,
            name: gear.name,
            folder: "Hereos Equipment",
            orderNum: deploymentOrder++
        };
    } else {
        newElement = {
            id: Date.now() + Math.random(),
            type: Tools.ICON,
            x: targetX,
            y: targetY,
            src: `assets/Hereos Equipment/${gear.file}`,
            name: gear.name,
            folder: "Hereos Equipment",
            orderNum: deploymentOrder++
        };
    }

    elements.push(newElement);
    saveState();
    draw();

    if (typeof showActionToast === "function") {
        showActionToast(`${gear.name} equipped!`);
    }
}

// --------------------------------------------------------------------------
// Full Event Listeners Initialization
// --------------------------------------------------------------------------

function setupEventListeners() {
    // Toolbar buttons with clean popover toggle
    document.querySelectorAll(".left-sidebar .tool-btn").forEach(btn => {
        const tool = btn.dataset.tool;
        if (tool) {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                if (tool === Tools.BRUSH || tool === Tools.ARROW) {
                    const popoverId = (tool === Tools.BRUSH) ? "brushPopover" : "arrowPopover";
                    const popover = document.getElementById(popoverId);
                    const isPopoverOpen = popover ? popover.classList.contains("active") : false;

                    if (currentTool === tool) {
                        // Toggle popover if clicking the already active tool
                        closeAllPopovers();
                        if (!isPopoverOpen && popover) {
                            popover.classList.add("active");
                        }
                    } else {
                        // Switch tool and open popover for quick size picking
                        closeAllPopovers();
                        setTool(tool);
                        if (popover) {
                            popover.classList.add("active");
                        }
                    }
                } else {
                    closeAllPopovers();
                    setTool(tool);
                }
            });
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

    // Stroke Thickness Selector (Auto-dismiss on selection)
    const thicknessBtns = document.querySelectorAll(".thickness-btn");
    thicknessBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentWidth = parseFloat(btn.dataset.width) || 4;
            if (currentTool === Tools.BRUSH) {
                brushWidth = currentWidth;
            } else if (currentTool === Tools.ARROW) {
                arrowWidth = currentWidth;
            }
            updateThicknessUI(currentWidth);

            if (selectedElement && (selectedElement.type === Tools.BRUSH || selectedElement.type === Tools.ARROW)) {
                selectedElement.width = currentWidth;
                saveState();
                draw();
            }

            // AUTO-DISMISS: Close popover immediately when a size is picked!
            closeAllPopovers();
        });
    });

    // Auto-dismiss tool popovers on click outside
    document.addEventListener("pointerdown", (e) => {
        if (!e.target.closest(".tool-wrapper")) {
            closeAllPopovers();
        }
    });

    // Hero Equipment Shortcut Dock Close & Click Isolation
    const heroGearDock = document.getElementById("heroGearDock");
    const heroGearCloseBtn = document.getElementById("heroGearCloseBtn");
    if (heroGearDock) {
        heroGearDock.addEventListener("mousedown", (e) => e.stopPropagation());
        heroGearDock.addEventListener("touchstart", (e) => e.stopPropagation(), { passive: true });
    }
    if (heroGearCloseBtn) {
        heroGearCloseBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            hideHeroGearDock();
        });
    }

    // Background upload trigger
    const fileInput = document.getElementById("fileInput");
    const uploadBtn = document.getElementById("uploadBtn");
    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", handleFileSelect);
    }

    // Welcome card choose image button
    const welcomeChooseBtn = document.getElementById("welcomeChooseBtn");
    if (welcomeChooseBtn && fileInput) {
        welcomeChooseBtn.addEventListener("click", () => fileInput.click());
    }

    // Drag and drop base image
    const dragOverlay = document.getElementById("dragOverlay");
    let dragCounter = 0;

    window.addEventListener("dragenter", (e) => {
        if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
            e.preventDefault();
            dragCounter++;
            if (dragOverlay) dragOverlay.style.display = "flex";
        }
    });

    window.addEventListener("dragover", (e) => {
        if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes("Files")) {
            e.preventDefault();
        }
    });

    window.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter <= 0 && dragOverlay) {
            dragCounter = 0;
            dragOverlay.style.display = "none";
        }
    });

    window.addEventListener("drop", (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            e.preventDefault();
            dragCounter = 0;
            if (dragOverlay) dragOverlay.style.display = "none";
            loadBaseImageFile(e.dataTransfer.files[0]);
        }
    });

    // Paste Image from Clipboard Button
    async function pasteImageFromClipboard() {
        try {
            if (navigator.clipboard && navigator.clipboard.read) {
                const clipboardItems = await navigator.clipboard.read();
                let imageFound = false;

                for (const item of clipboardItems) {
                    for (const type of item.types) {
                        if (type.startsWith("image/")) {
                            const blob = await item.getType(type);
                            loadBaseImageFile(blob);
                            imageFound = true;
                            break;
                        }
                    }
                    if (imageFound) break;
                }

                if (!imageFound) {
                    alert("No screenshot image found in your clipboard! Please copy an image first.");
                }
            } else {
                alert("Clipboard paste button is not supported by your browser version. Please use 'Choose Image' to upload.");
            }
        } catch (err) {
            console.warn("Clipboard access:", err);
            alert("Clipboard access denied or no image copied yet. Please copy a base screenshot image first, or tap 'Choose Image'.");
        }
    }

    const welcomePasteBtn = document.getElementById("welcomePasteBtn");
    if (welcomePasteBtn) welcomePasteBtn.addEventListener("click", pasteImageFromClipboard);

    // Paste Image from Keyboard (Ctrl + V)
    window.addEventListener("paste", (e) => {
        if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

        const items = e.clipboardData && e.clipboardData.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    loadBaseImageFile(file);
                    e.preventDefault();
                    break;
                }
            }
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

    // Toggle align control target (Base Image vs Workspace viewport)
    const targetImageBtn = document.getElementById("alignTargetImage");
    const targetCanvasBtn = document.getElementById("alignTargetCanvas");
    if (targetImageBtn && targetCanvasBtn) {
        targetImageBtn.addEventListener("click", () => {
            alignControlTarget = "image";
            targetImageBtn.classList.add("active");
            targetCanvasBtn.classList.remove("active");
        });
        targetCanvasBtn.addEventListener("click", () => {
            alignControlTarget = "view";
            targetCanvasBtn.classList.add("active");
            targetImageBtn.classList.remove("active");
        });
    }

    // Undo / Redo / Clear
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    const clearBtn = document.getElementById("clearBtn");

    if (undoBtn) undoBtn.addEventListener("click", undo);
    if (redoBtn) redoBtn.addEventListener("click", redo);
    if (clearBtn) clearBtn.addEventListener("click", clearCanvas);

    // Export Dropdown Controls (Copy to Clipboard or Download PNG)
    const exportBtn = document.getElementById("exportBtn");
    const exportDropdownMenu = document.getElementById("exportDropdownMenu");
    const copyPlanBtn = document.getElementById("copyPlanBtn");
    const downloadPlanBtn = document.getElementById("downloadPlanBtn");
    const downloadBtn = document.getElementById("downloadBtn"); // fallback

    if (exportBtn && exportDropdownMenu) {
        exportBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            exportDropdownMenu.classList.toggle("show");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!e.target.closest("#exportDropdownWrapper")) {
                exportDropdownMenu.classList.remove("show");
            }
        });
    }

    if (copyPlanBtn) {
        copyPlanBtn.addEventListener("click", () => {
            if (exportDropdownMenu) exportDropdownMenu.classList.remove("show");
            copyPlanToClipboard();
        });
    }

    if (downloadPlanBtn) {
        downloadPlanBtn.addEventListener("click", () => {
            if (exportDropdownMenu) exportDropdownMenu.classList.remove("show");
            downloadPlan();
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener("click", downloadPlan);
    }

    // Text Popover Handling
    const popover = document.getElementById("textPopover");
    const popoverInput = document.getElementById("popoverInput");
    const popoverSave = document.getElementById("popoverSave");
    const popoverCancel = document.getElementById("popoverCancel");

    function submitPopoverText() {
        const textVal = popoverInput.value.trim();
        if (textVal) {
            const newText = {
                id: Date.now() + Math.random(),
                type: Tools.TEXT,
                x: textPlacementCoords.x,
                y: textPlacementCoords.y,
                text: textVal,
                color: currentColor,
                fontSize: currentTextSize
            };
            elements.push(newText);
            saveState();

            setTool(Tools.SELECT);
            selectedElement = newText;
            isDraggingElement = false;

            draw();
        } else {
            setTool(Tools.SELECT);
        }
        popover.style.display = "none";
        popoverInput.value = "";
    }

    if (popoverSave) popoverSave.addEventListener("click", submitPopoverText);

    if (popoverInput) {
        popoverInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                submitPopoverText();
            } else if (e.key === "Escape") {
                e.preventDefault();
                popover.style.display = "none";
                popoverInput.value = "";
                setTool(Tools.SELECT);
            }
        });
    }

    if (popoverCancel) {
        popoverCancel.addEventListener("click", () => {
            popover.style.display = "none";
            popoverInput.value = "";
            setTool(Tools.SELECT);
        });
    }

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
        if (document.activeElement.tagName === "INPUT") return;

        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
            if (window.getSelection && window.getSelection().toString().length > 0) return;
            e.preventDefault();
            copyPlanToClipboard();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
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
            closeAllPopovers();
            if (typeof hideHeroGearDock === "function") hideHeroGearDock();
            selectedElement = null;
            arrowPreview = null;
            brushPreview = null;
            circlePreview = null;
            if (popover) popover.style.display = "none";
            draw();
        }
    });

    // Canvas Mouse & Touch Interactivity
    if (canvas) {
        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mouseleave", () => {
            if (isDrawing || isDraggingBg) {
                handleMouseUp();
            }
        });
    }

    // Workspace & Canvas Wheel zoom
    const workspaceEl = document.querySelector(".workspace");
    if (workspaceEl) {
        workspaceEl.addEventListener("wheel", (e) => {
            e.preventDefault();

            if (isAlignMode && bgImage && alignControlTarget === "image") {
                const coords = getCanvasCoords(e);
                const mouseX = coords.x;
                const mouseY = coords.y;
                const bgMouseX = (mouseX - bgX) / bgScale;
                const bgMouseY = (mouseY - bgY) / bgScale;

                // Calculate current zoom percentage rounded to integer
                const currentPercent = Math.round((bgScale / initialBgScale) * 100);

                // Step by exactly 1% per scroll tick
                let nextPercent = e.deltaY < 0 ? currentPercent + 1 : currentPercent - 1;
                nextPercent = Math.max(10, Math.min(600, nextPercent));

                const nextScale = initialBgScale * (nextPercent / 100);
                bgX = mouseX - bgMouseX * nextScale;
                bgY = mouseY - bgMouseY * nextScale;
                bgScale = nextScale;
                updateZoomIndicator();
                draw();
            } else {
                const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
                canvasUserZoom = Math.max(0.5, Math.min(8.0, canvasUserZoom * zoomFactor));
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

    // Panning navigation when zoomed
    if (workspaceEl) {
        workspaceEl.addEventListener("mousedown", (e) => {
            if (e.button === 1 || e.button === 2 || isSpacePressed ||
                ((canvasUserZoom !== 1.0 || canvasPanX !== 0 || canvasPanY !== 0) && e.target === workspaceEl)) {
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
            if (isPanningCanvas || canvasUserZoom !== 1.0 || canvasPanX !== 0 || canvasPanY !== 0) {
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
    let touchCooldown = false;

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

    const touchSurface = workspaceEl || canvas;
    if (touchSurface) {
        touchSurface.addEventListener("touchstart", (e) => {
            if (e.touches.length >= 2) {
                e.preventDefault();

                if (isDrawing || isDraggingElement || isDraggingBg || isResizingTarget || isPanningCanvas) {
                    isDrawing = false;
                    isDraggingElement = false;
                    isDraggingBg = false;
                    isResizingTarget = false;
                    isPanningCanvas = false;
                    arrowPreview = null;
                    brushPreview = null;
                    circlePreview = null;
                    document.body.style.cursor = "default";
                }

                isPinching = true;
                touchCooldown = true;

                const touchInfo = getTouchInfo(e.touches[0], e.touches[1]);
                initialPinchDistance = touchInfo.dist;
                initialPinchCenter = touchInfo.center;

                if (isAlignMode && bgImage) {
                    initialBgState = { x: bgX, y: bgY, scale: bgScale };
                    const initCoords = getCanvasCoords({
                        clientX: touchInfo.center.clientX,
                        clientY: touchInfo.center.clientY
                    });
                    initialBgState.pinchBgX = (initCoords.x - bgX) / bgScale;
                    initialBgState.pinchBgY = (initCoords.y - bgY) / bgScale;
                } else {
                    initialPinchScale = canvasUserZoom;
                    initialCanvasPan = { x: canvasPanX, y: canvasPanY };
                }
            } else if (e.touches.length === 1) {
                if (touchCooldown || isPinching) return;
                // Only intercept touches started directly on the canvas or empty workspace area
                if (e.target === canvas || e.target === workspaceEl) {
                    e.preventDefault(); // Stop default browser page scroll/bouncing
                    handleMouseDown(e);
                }
            }
        }, { passive: false });

        touchSurface.addEventListener("touchmove", (e) => {
            if (e.touches.length >= 2 && isPinching) {
                e.preventDefault();
                isPanningCanvas = false;
                const touchInfo = getTouchInfo(e.touches[0], e.touches[1]);
                if (initialPinchDistance > 0) {
                    const scaleFactor = touchInfo.dist / initialPinchDistance;
                    const panDeltaX = touchInfo.center.clientX - initialPinchCenter.clientX;
                    const panDeltaY = touchInfo.center.clientY - initialPinchCenter.clientY;

                    if (isAlignMode && bgImage && alignControlTarget === "image") {
                        const currentCoords = getCanvasCoords({
                            clientX: touchInfo.center.clientX,
                            clientY: touchInfo.center.clientY
                        });
                        bgScale = Math.max(0.1, Math.min(6, initialBgState.scale * scaleFactor));
                        bgX = currentCoords.x - initialBgState.pinchBgX * bgScale;
                        bgY = currentCoords.y - initialBgState.pinchBgY * bgScale;
                        updateZoomIndicator();
                        draw();
                    } else {
                        canvasUserZoom = Math.max(0.5, Math.min(8.0, initialPinchScale * scaleFactor));
                        canvasPanX = initialCanvasPan.x + panDeltaX;
                        canvasPanY = initialCanvasPan.y + panDeltaY;
                        updateCanvasTransform();
                    }
                }
            } else if (e.touches.length === 1 && !isPinching && !touchCooldown) {
                // Only intercept touch moves on the canvas or empty workspace area
                if (e.target === canvas || e.target === workspaceEl) {
                    e.preventDefault(); // Stop default browser page scroll/bouncing
                    handleMouseMove(e);
                }
            }
        }, { passive: false });

        touchSurface.addEventListener("touchend", (e) => {
            if (e.touches.length === 0) {
                if (isPinching || touchCooldown) {
                    isPinching = false;
                    initialPinchDistance = 0;
                    setTimeout(() => { touchCooldown = false; }, 120);
                } else {
                    handleMouseUp();
                }
            } else if (e.touches.length === 1 && isPinching) {
                e.preventDefault();
                isPanningCanvas = false;
                isDraggingBg = false;
            }
        }, { passive: false });
    }

    // Right Sidebar Touch & Wheel Scroll
    const rightSidebar = document.getElementById("rightSidebar");
    const accordionContainer = document.getElementById("accordionCategories");

    if (rightSidebar && accordionContainer) {
        rightSidebar.addEventListener("wheel", (e) => {
            e.stopPropagation();
            accordionContainer.scrollTop += e.deltaY;
        }, { passive: true });

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

    function setMobileSidebarState(open) {
        if (!rightSidebar) return;
        if (open) {
            rightSidebar.classList.add("open");
            if (mobileSidebarToggle) mobileSidebarToggle.classList.add("active");
        } else {
            rightSidebar.classList.remove("open");
            if (mobileSidebarToggle) mobileSidebarToggle.classList.remove("active");
        }
        fitCanvasToWorkspace();
    }

    if (mobileSidebarToggle && rightSidebar) {
        mobileSidebarToggle.classList.add("active");
        rightSidebar.classList.add("open");

        mobileSidebarToggle.addEventListener("click", () => {
            const isOpen = rightSidebar.classList.contains("open");
            setMobileSidebarState(!isOpen);
        });
    }

    if (closeRightSidebarBtn && rightSidebar) {
        closeRightSidebarBtn.addEventListener("click", () => {
            setMobileSidebarState(false);
        });
    }

    if (rightSidebar) {
        rightSidebar.addEventListener("transitionend", fitCanvasToWorkspace);
    }

    // Fullscreen Toggle
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => console.log(err));
                fullscreenBtn.innerHTML = '<i class="ri-fullscreen-exit-line"></i>';
            } else {
                document.exitFullscreen().catch(err => console.log(err));
                fullscreenBtn.innerHTML = '<i class="ri-fullscreen-line"></i>';
            }
        });
    }

    // Zoom Buttons & Hold Zooming
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const zoomResetBtn = document.getElementById("zoomResetBtn");
    const zoomPercentageEl = document.getElementById("zoomPercentage");

    function performZoomIn(multiplier = 1) {
        if (isAlignMode && bgImage && alignControlTarget === "image") {
            const cx = 951.5;
            const cy = 537;
            const bgCenterX = (cx - bgX) / bgScale;
            const bgCenterY = (cy - bgY) / bgScale;

            // Calculate current zoom percentage
            const currentPercent = Math.round((bgScale / initialBgScale) * 100);

            // Step up by flat 1% * multiplier
            let nextPercent = currentPercent + 1 * multiplier;
            nextPercent = Math.max(10, Math.min(600, nextPercent));

            const nextScale = initialBgScale * (nextPercent / 100);
            bgX = cx - bgCenterX * nextScale;
            bgY = cy - bgCenterY * nextScale;
            bgScale = nextScale;
            updateZoomIndicator();
            draw();
        } else {
            canvasUserZoom = Math.min(8.0, canvasUserZoom * (1 + 0.03 * multiplier));
            updateCanvasTransform();
        }
    }

    function performZoomOut(multiplier = 1) {
        if (isAlignMode && bgImage && alignControlTarget === "image") {
            const cx = 951.5;
            const cy = 537;
            const bgCenterX = (cx - bgX) / bgScale;
            const bgCenterY = (cy - bgY) / bgScale;

            // Calculate current zoom percentage
            const currentPercent = Math.round((bgScale / initialBgScale) * 100);

            // Step down by flat 1% * multiplier
            let nextPercent = currentPercent - 1 * multiplier;
            nextPercent = Math.max(10, Math.min(600, nextPercent));

            const nextScale = initialBgScale * (nextPercent / 100);
            bgX = cx - bgCenterX * nextScale;
            bgY = cy - bgCenterY * nextScale;
            bgScale = nextScale;
            updateZoomIndicator();
            draw();
        } else {
            canvasUserZoom = Math.max(0.5, canvasUserZoom / (1 + 0.03 * multiplier));
            updateCanvasTransform();
        }
    }

    function enableHoldZoom(btn, zoomFn) {
        if (!btn) return;
        let timer = null;
        let interval = null;

        const startZoom = (e) => {
            if (e.type === "touchstart") e.preventDefault();
            const isFast = e.shiftKey;
            zoomFn(isFast ? 3 : 1);

            timer = setTimeout(() => {
                interval = setInterval(() => {
                    zoomFn(1.2);
                }, 35);
            }, 220);
        };

        const stopZoom = () => {
            if (timer) clearTimeout(timer);
            if (interval) clearInterval(interval);
            timer = null;
            interval = null;
        };

        btn.addEventListener("mousedown", startZoom);
        btn.addEventListener("mouseup", stopZoom);
        btn.addEventListener("mouseleave", stopZoom);
        btn.addEventListener("touchstart", startZoom, { passive: false });
        btn.addEventListener("touchend", stopZoom);
        btn.addEventListener("touchcancel", stopZoom);
    }

    enableHoldZoom(zoomInBtn, performZoomIn);
    enableHoldZoom(zoomOutBtn, performZoomOut);

    if (zoomResetBtn) {
        zoomResetBtn.addEventListener("click", () => {
            if (isAlignMode && bgImage) {
                const scaleW = CANVAS_WIDTH / bgImage.width;
                const scaleH = CANVAS_HEIGHT / bgImage.height;
                bgScale = Math.min(scaleW, scaleH);
                bgX = (CANVAS_WIDTH - bgImage.width * bgScale) / 2;
                bgY = (CANVAS_HEIGHT - bgImage.height * bgScale) / 2;
                updateZoomIndicator();
                draw();
            } else {
                canvasUserZoom = 1.0;
                canvasPanX = 0;
                canvasPanY = 0;
                updateCanvasTransform();
            }
        });
    }

    if (zoomPercentageEl) {
        zoomPercentageEl.addEventListener("click", () => {
            if (zoomResetBtn) zoomResetBtn.click();
        });
    }
}

// --------------------------------------------------------------------------
// Strategy Image Export (Copy to Clipboard & PNG Download)
// --------------------------------------------------------------------------

let toastTimer = null;
function showActionToast(message, isSuccess = true) {
    const toast = document.getElementById("actionToast");
    const toastText = document.getElementById("actionToastText");
    if (!toast) return;

    if (toastText) toastText.innerText = message;
    const icon = toast.querySelector(".action-toast-icon");
    if (icon) {
        icon.className = isSuccess
            ? "ri-checkbox-circle-fill action-toast-icon"
            : "ri-error-warning-fill action-toast-icon";
        icon.style.color = isSuccess ? "#10b981" : "#ef4444";
        toast.style.borderColor = isSuccess ? "#10b981" : "#ef4444";
    }

    toast.classList.add("show");

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2400);
}

async function copyPlanToClipboard() {
    if (!bgImage && elements.length === 0) {
        alert("Please upload a CoC base screenshot or place tactical markers first before copying.");
        return;
    }

    const copyBtn = document.getElementById("copyPlanBtn");

    // Deselect active element to render clean plan
    selectedElement = null;
    draw();

    try {
        if (navigator.clipboard && window.ClipboardItem) {
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    showActionToast("Failed to copy image to clipboard.", false);
                    return;
                }
                try {
                    const item = new ClipboardItem({ "image/png": blob });
                    await navigator.clipboard.write([item]);

                    // Visual button feedback
                    if (copyBtn) {
                        const originalHTML = copyBtn.innerHTML;
                        copyBtn.classList.add("copied");
                        copyBtn.innerHTML = '<i class="ri-check-line"></i> <span class="btn-text">Copied!</span>';
                        setTimeout(() => {
                            copyBtn.classList.remove("copied");
                            copyBtn.innerHTML = originalHTML;
                        }, 2000);
                    }

                    showActionToast("Attack plan copied! Ready to paste into Discord/WA.");
                } catch (writeErr) {
                    console.warn("Async clipboard write failed:", writeErr);
                    showActionToast("Clipboard write permission denied.", false);
                }
            }, "image/png", 0.95);
        } else {
            showActionToast("Clipboard copying is not supported on this browser.", false);
        }
    } catch (err) {
        console.error("Copy plan error:", err);
        showActionToast("Failed to copy image.", false);
    }
}

function downloadPlan() {
    if (!bgImage && elements.length === 0) {
        alert("Please upload a CoC base screenshot or draw markers first before downloading.");
        return;
    }

    // Draw all layers again without selections highlight
    selectedElement = null;
    draw();

    canvas.toBlob(blob => {
        if (!blob) {
            alert("Failed to generate image. Please try again.");
            return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `coc-attack-plan-${Date.now()}.png`;
        link.href = url;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
        showActionToast("Download started!");
    }, "image/png", 0.95);
}

// --------------------------------------------------------------------------
// Mobile Rotation Overlay & Fullscreen Recommendation Helper
// --------------------------------------------------------------------------

function setupRotationAndFullscreen() {
    const rotateFullscreenBtn = document.getElementById("rotateFullscreenBtn");
    const toastFullscreenBtn = document.getElementById("toastFullscreenBtn");
    const toastCloseBtn = document.getElementById("toastCloseBtn");
    const fullscreenToast = document.getElementById("fullscreenToast");

    function requestAppFullscreen() {
        const docEl = document.documentElement;
        const requestFS = docEl.requestFullscreen ||
            docEl.webkitRequestFullscreen ||
            docEl.mozRequestFullScreen ||
            docEl.msRequestFullscreen;

        if (requestFS) {
            requestFS.call(docEl)
                .then(() => {
                    const btn = document.getElementById("fullscreenBtn");
                    if (btn) btn.innerHTML = '<i class="ri-fullscreen-exit-line"></i>';
                    if (fullscreenToast) fullscreenToast.classList.remove("show");
                })
                .catch(err => {
                    console.warn("Fullscreen request rejected or failed:", err);
                });
        } else {
            alert("Fullscreen Mode is not fully supported on this device/browser. Please try adding this page to your Home Screen.");
        }
    }

    if (rotateFullscreenBtn) {
        rotateFullscreenBtn.addEventListener("click", requestAppFullscreen);
    }
    if (toastFullscreenBtn) {
        toastFullscreenBtn.addEventListener("click", requestAppFullscreen);
    }
    if (toastCloseBtn) {
        toastCloseBtn.addEventListener("click", () => {
            if (fullscreenToast) {
                fullscreenToast.classList.remove("show");
                sessionStorage.setItem("fullscreen_toast_dismissed", "true");
            }
        });
    }

    function checkFullscreenToast() {
        if (!fullscreenToast) return;

        const isMobile = window.matchMedia("(max-width: 980px)").matches;
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        const isFullscreen = !!(document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement);
        const isDismissed = sessionStorage.getItem("fullscreen_toast_dismissed") === "true";
        const isImageLoaded = bgImage !== null;

        if (isMobile && isLandscape && isImageLoaded && !isFullscreen && !isDismissed) {
            setTimeout(() => {
                const currentFS = !!(document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement);
                const currentImageLoaded = bgImage !== null;
                if (!currentFS && currentImageLoaded && sessionStorage.getItem("fullscreen_toast_dismissed") !== "true") {
                    fullscreenToast.classList.add("show");
                }
            }, 600);
        } else {
            fullscreenToast.classList.remove("show");
        }
    }

    window.checkFullscreenToast = checkFullscreenToast;

    window.addEventListener("resize", checkFullscreenToast);
    window.addEventListener("orientationchange", checkFullscreenToast);

    const fsEvents = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];
    fsEvents.forEach(evt => {
        document.addEventListener(evt, () => {
            const isFullscreen = !!(document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement);
            const btn = document.getElementById("fullscreenBtn");
            if (btn) {
                if (isFullscreen) {
                    btn.innerHTML = '<i class="ri-fullscreen-exit-line"></i>';
                    if (fullscreenToast) fullscreenToast.classList.remove("show");
                } else {
                    btn.innerHTML = '<i class="ri-fullscreen-line"></i>';
                    checkFullscreenToast();
                }
            }
        });
    });

    checkFullscreenToast();
}
