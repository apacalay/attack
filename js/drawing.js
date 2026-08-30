// ==========================================================================
// CANVAS RENDERING & DRAWING PIPELINE
// ==========================================================================

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

// --------------------------------------------------------------------------
// Core Drawing Loop
// --------------------------------------------------------------------------

function draw() {
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. Draw solid dark background
    ctx.fillStyle = "#0c101c";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Draw base screenshot (if loaded) or splash image
    if (bgImage) {
        ctx.save();
        if (isAlignMode) {
            // Desaturate to 100% grayscale in alignment mode
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
            ctx.fillText("Alignment Mode: Adjust the base image to fit the orange border.", CANVAS_WIDTH / 2, 70);
            ctx.restore();
        }
    }

    // 4. Draw placed items / drawing elements
    elements.forEach(el => {
        const isSelected = selectedElement && (el.id === selectedElement.id);

        switch (el.type) {
            case Tools.BRUSH:
                drawBrush(el.points, el.color, el.width, isSelected);
                break;
            case Tools.ARROW:
                drawArrow(el.x1, el.y1, el.x2, el.y2, el.color, el.width, isSelected);
                break;
            case "giant_arrow":
                drawGiantArrow(el, isSelected);
                break;
            case Tools.CIRCLE:
                drawCircle(el.x, el.y, el.color, el.radius, isSelected);
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

    // 5. Draw active brush, arrow, or circle preview
    if (brushPreview && brushPreview.length > 1) {
        drawBrush(brushPreview, currentColor, currentWidth, false);
    }
    if (arrowPreview) {
        drawArrow(arrowPreview.x1, arrowPreview.y1, arrowPreview.x2, arrowPreview.y2, currentColor, currentWidth, false);
    }
    if (giantArrowPreview) {
        drawGiantArrow(giantArrowPreview, false);
    }
    if (circlePreview) {
        drawCircle(circlePreview.x, circlePreview.y, currentColor, circlePreview.radius, false);
    }
}

// --------------------------------------------------------------------------
// Drawing Tool Primitives
// --------------------------------------------------------------------------

function drawArrow(x1, y1, x2, y2, color, width, isSelected) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const angle = Math.atan2(y2 - y1, x2 - x1);
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const strokeW = width || 4;
    const headLength = Math.max(20, Math.min(44, strokeW * 3.8));
    const headWidth = headLength * 0.72;
    const shaftEndDist = Math.max(0, dist - headLength * 0.65);

    ctx.translate(x1, y1);
    ctx.rotate(angle);

    // 1. High-contrast outer stroke (+2px white outline)
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = strokeW + 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(shaftEndDist, 0);
    ctx.stroke();

    // 2. Colored inner shaft line
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeW;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(shaftEndDist, 0);
    ctx.stroke();

    // 3. Arrowhead at tip (dist, 0)
    const tipX = dist;
    const baseLeftX = dist - headLength;
    const baseCenterX = dist - headLength * 0.65;

    ctx.beginPath();
    ctx.moveTo(tipX, 0);
    ctx.lineTo(baseLeftX, -headWidth);
    ctx.lineTo(baseCenterX, 0);
    ctx.lineTo(baseLeftX, headWidth);
    ctx.closePath();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();

    // 4. Highlight selection handles
    if (isSelected) {
        ctx.save();
        ctx.strokeStyle = "rgba(0, 255, 255, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.strokeRect(Math.min(x1, x2) - 16, Math.min(y1, y2) - 16, Math.abs(x2 - x1) + 32, Math.abs(y2 - y1) + 32);

        ctx.setLineDash([]);

        // Handle Point 1: Start Point (x1, y1)
        ctx.beginPath();
        ctx.arc(x1, y1, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Handle Point 2: End Tip (x2, y2)
        ctx.beginPath();
        ctx.arc(x2, y2, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0055";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.restore();
    }
}

function drawBrush(points, color, width, isSelected) {
    if (!points || points.length < 2) return;
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const strokeW = width || 4;

    // 1. White outer border outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = strokeW + 2;
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

function drawCircle(x, y, color, radius, isSelected) {
    ctx.save();

    const rx = radius || (4 * TILE_SCALE_X);
    const ry = rx * ISO_Y_RATIO;

    // 1. Isometric Semi-transparent AoE Area Fill
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(color, 0.2);
    ctx.fill();

    // 2. Tactical dashed AoE border line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.8;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 3. Center Bullseye & Isometric Crosshair Dot
    ctx.setLineDash([]);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 9, y);
    ctx.lineTo(x + 9, y);
    ctx.moveTo(x, y - 9 * ISO_Y_RATIO);
    ctx.lineTo(x, y + 9 * ISO_Y_RATIO);
    ctx.stroke();

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.moveTo(x, y - 8 * ISO_Y_RATIO);
    ctx.lineTo(x, y + 8 * ISO_Y_RATIO);
    ctx.stroke();

    // Center point dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 4. Selection Ring & Resize Handles (Left, Right, Top, Bottom)
    if (isSelected) {
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(x, y, rx + 6, ry + 6 * ISO_Y_RATIO, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.setLineDash([]);
        const handles = [
            { hx: x + rx, hy: y },
            { hx: x - rx, hy: y },
            { hx: x, hy: y + ry },
            { hx: x, hy: y - ry }
        ];
        handles.forEach(h => {
            ctx.beginPath();
            ctx.arc(h.hx, h.hy, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#00ffff";
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    ctx.restore();
}

function drawXMark(x, y, color, size, isSelected) {
    ctx.save();

    const s = size || 88;
    const halfX = s / 2;
    const halfY = halfX * ISO_Y_RATIO;
    const armW = 2.5;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 1. Isometric Diamond Base Alignment Guide
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

    ctx.beginPath();
    ctx.moveTo(x - halfX * 0.9, y);
    ctx.lineTo(x + halfX * 0.9, y);
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

    // 4. Selection Box & Corner Resize Handles (Left, Right, Top, Bottom)
    if (isSelected) {
        ctx.strokeStyle = "#00ffff";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(x - halfX - 8, y - halfY - 8, s + 16, halfY * 2 + 16);

        ctx.setLineDash([]);
        const handles = [
            { hx: x + halfX, hy: y },
            { hx: x - halfX, hy: y },
            { hx: x, hy: y + halfY },
            { hx: x, hy: y - halfY }
        ];
        handles.forEach(h => {
            ctx.beginPath();
            ctx.arc(h.hx, h.hy, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#00ffff";
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
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

    // Semi-transparent dark background for readability
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

// --------------------------------------------------------------------------
// Special Equipment & Spells Renderers
// --------------------------------------------------------------------------

function drawRocketBackpackBeam(startX, startY) {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    const dx = centerX - startX;
    const dy = centerY - startY;
    const uDir = dx / TILE_SCALE_X;
    const vDir = dy / TILE_SCALE_Y;
    const groundAngle = Math.atan2(vDir, uDir);

    const rangeTiles = 120;
    const halfWidthTiles = 2.0;

    const getGroundScreenPos = (forwardTiles, perpTiles) => {
        const gx = forwardTiles * Math.cos(groundAngle) - perpTiles * Math.sin(groundAngle);
        const gy = forwardTiles * Math.sin(groundAngle) + perpTiles * Math.cos(groundAngle);
        return {
            x: startX + gx * TILE_SCALE_X,
            y: startY + gy * TILE_SCALE_Y
        };
    };

    const p0Left = getGroundScreenPos(0, -halfWidthTiles);
    const p0Right = getGroundScreenPos(0, halfWidthTiles);
    const pEndLeft = getGroundScreenPos(rangeTiles, -halfWidthTiles);
    const pEndRight = getGroundScreenPos(rangeTiles, halfWidthTiles);
    const pEndCenter = getGroundScreenPos(rangeTiles, 0);

    ctx.save();

    // 1. Transparent Tactical Red Laser Beam Corridor
    const pMidLeft = getGroundScreenPos(rangeTiles * 0.4, -halfWidthTiles);
    const pMidRight = getGroundScreenPos(rangeTiles * 0.4, halfWidthTiles);
    const grad = ctx.createLinearGradient(pMidLeft.x, pMidLeft.y, pMidRight.x, pMidRight.y);
    grad.addColorStop(0, "rgba(239, 68, 68, 0.12)");
    grad.addColorStop(0.25, "rgba(239, 68, 68, 0.22)");
    grad.addColorStop(0.5, "rgba(239, 68, 68, 0.35)");
    grad.addColorStop(0.75, "rgba(239, 68, 68, 0.22)");
    grad.addColorStop(1, "rgba(239, 68, 68, 0.12)");

    ctx.beginPath();
    ctx.moveTo(p0Left.x, p0Left.y);
    ctx.lineTo(pEndLeft.x, pEndLeft.y);
    ctx.lineTo(pEndRight.x, pEndRight.y);
    ctx.lineTo(p0Right.x, p0Right.y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 2. Outer Beam Corridor Edges
    ctx.strokeStyle = "rgba(239, 68, 68, 0.9)";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(p0Left.x, p0Left.y);
    ctx.lineTo(pEndLeft.x, pEndLeft.y);
    ctx.moveTo(p0Right.x, p0Right.y);
    ctx.lineTo(pEndRight.x, pEndRight.y);
    ctx.stroke();

    // 3. Center Trajectory Line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 6]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(pEndCenter.x, pEndCenter.y);
    ctx.stroke();

    // 4. Flight direction arrows
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
    for (let d = 10; d < rangeTiles - 5; d += 15) {
        const tip = getGroundScreenPos(d + 1.2, 0);
        const leftWing = getGroundScreenPos(d - 0.8, -0.75);
        const notch = getGroundScreenPos(d - 0.3, 0);
        const rightWing = getGroundScreenPos(d - 0.8, 0.75);

        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(leftWing.x, leftWing.y);
        ctx.lineTo(notch.x, notch.y);
        ctx.lineTo(rightWing.x, rightWing.y);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

function drawFlameBlowerCone(startX, startY) {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    const dx = centerX - startX;
    const dy = centerY - startY;
    const uDir = dx / TILE_SCALE_X;
    const vDir = dy / TILE_SCALE_Y;
    const groundAngle = Math.atan2(vDir, uDir);

    const rangeTiles = 14;
    const halfBaseTiles = 5.5;

    const getGroundScreenPos = (forwardTiles, perpTiles) => {
        const gx = forwardTiles * Math.cos(groundAngle) - perpTiles * Math.sin(groundAngle);
        const gy = forwardTiles * Math.sin(groundAngle) + perpTiles * Math.cos(groundAngle);
        return {
            x: startX + gx * TILE_SCALE_X,
            y: startY + gy * TILE_SCALE_Y
        };
    };

    const baseCenter = getGroundScreenPos(rangeTiles, 0);
    const baseLeft = getGroundScreenPos(rangeTiles, -halfBaseTiles);
    const baseRight = getGroundScreenPos(rangeTiles, halfBaseTiles);

    ctx.save();

    // 1. Fiery gradient fill from apex
    const grad = ctx.createLinearGradient(startX, startY, baseCenter.x, baseCenter.y);
    grad.addColorStop(0, "rgba(249, 115, 22, 0.45)");
    grad.addColorStop(0.4, "rgba(239, 68, 68, 0.28)");
    grad.addColorStop(0.85, "rgba(220, 38, 38, 0.12)");
    grad.addColorStop(1, "rgba(220, 38, 38, 0.02)");

    // 2. Isometric triangle path
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(baseLeft.x, baseLeft.y);
    ctx.lineTo(baseRight.x, baseRight.y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 3. Dashed outer border lines
    ctx.strokeStyle = "rgba(249, 115, 22, 0.9)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 5]);
    ctx.stroke();

    // 4. Centerline Trajectory
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(baseCenter.x, baseCenter.y);
    ctx.stroke();

    // 5. Tactical range / flame wave lines
    ctx.strokeStyle = "rgba(249, 115, 22, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    for (let step = 1; step <= 2; step++) {
        const stepDist = (rangeTiles * step) / 3;
        const stepHalfW = (halfBaseTiles * step) / 3;
        const pLeft = getGroundScreenPos(stepDist, -stepHalfW);
        const pRight = getGroundScreenPos(stepDist, stepHalfW);

        ctx.beginPath();
        ctx.moveTo(pLeft.x, pLeft.y);
        ctx.lineTo(pRight.x, pRight.y);
        ctx.stroke();
    }

    // 6. Direction flow indicator chevrons
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(249, 115, 22, 0.85)";
    for (let d = 3.5; d < rangeTiles - 1; d += 3.2) {
        const spanW = (d / rangeTiles) * halfBaseTiles * 0.45;

        const tip = getGroundScreenPos(d + 0.55, 0);
        const leftWing = getGroundScreenPos(d - 0.35, -spanW);
        const centerNotch = getGroundScreenPos(d - 0.08, 0);
        const rightWing = getGroundScreenPos(d - 0.35, spanW);

        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(leftWing.x, leftWing.y);
        ctx.lineTo(centerNotch.x, centerNotch.y);
        ctx.lineTo(rightWing.x, rightWing.y);
        ctx.closePath();
        ctx.fill();
    }

    ctx.restore();
}

function drawGiantArrow(el, isSelected) {
    const x1 = el.x1;
    const y1 = el.y1;
    const x2 = el.x2;
    const y2 = el.y2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const uDir = dx / TILE_SCALE_X;
    const vDir = dy / TILE_SCALE_Y;
    const groundAngle = Math.atan2(vDir, uDir);
    const distTiles = Math.hypot(uDir, vDir);

    if (distTiles < 0.1) return;

    const halfWidthTiles = 1.0;
    const headLengthTiles = Math.min(3.0, Math.max(1.5, distTiles * 0.35));
    const shaftLengthTiles = Math.max(0, distTiles - headLengthTiles * 0.65);

    const getGroundScreenPos = (forwardTiles, perpTiles) => {
        const gx = forwardTiles * Math.cos(groundAngle) - perpTiles * Math.sin(groundAngle);
        const gy = forwardTiles * Math.sin(groundAngle) + perpTiles * Math.cos(groundAngle);
        return {
            x: x1 + gx * TILE_SCALE_X,
            y: y1 + gy * TILE_SCALE_Y
        };
    };

    const p0Left = getGroundScreenPos(0, -halfWidthTiles);
    const p0Right = getGroundScreenPos(0, halfWidthTiles);
    const pShaftLeft = getGroundScreenPos(shaftLengthTiles, -halfWidthTiles);
    const pShaftRight = getGroundScreenPos(shaftLengthTiles, halfWidthTiles);
    const pShaftCenter = getGroundScreenPos(shaftLengthTiles, 0);

    ctx.save();

    // 1. Shaded Corridor (2-Grid wide cyan energy fill)
    const pMidLeft = getGroundScreenPos(shaftLengthTiles / 2, -halfWidthTiles);
    const pMidRight = getGroundScreenPos(shaftLengthTiles / 2, halfWidthTiles);
    const grad = ctx.createLinearGradient(pMidLeft.x, pMidLeft.y, pMidRight.x, pMidRight.y);
    grad.addColorStop(0, "rgba(6, 182, 212, 0.12)");
    grad.addColorStop(0.25, "rgba(6, 182, 212, 0.25)");
    grad.addColorStop(0.5, "rgba(56, 189, 248, 0.42)");
    grad.addColorStop(0.75, "rgba(6, 182, 212, 0.25)");
    grad.addColorStop(1, "rgba(6, 182, 212, 0.12)");

    ctx.beginPath();
    ctx.moveTo(p0Left.x, p0Left.y);
    ctx.lineTo(pShaftLeft.x, pShaftLeft.y);
    ctx.lineTo(pShaftRight.x, pShaftRight.y);
    ctx.lineTo(p0Right.x, p0Right.y);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // 2. Dashed Outer Border Lines
    ctx.strokeStyle = "rgba(56, 189, 248, 0.95)";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(p0Left.x, p0Left.y);
    ctx.lineTo(pShaftLeft.x, pShaftLeft.y);
    ctx.moveTo(p0Right.x, p0Right.y);
    ctx.lineTo(pShaftRight.x, pShaftRight.y);
    ctx.stroke();

    // 3. Centerline Trajectory
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(pShaftCenter.x, pShaftCenter.y);
    ctx.stroke();

    // 4. Direction flow indicator chevrons
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(6, 182, 212, 0.9)";
    for (let d = 2.0; d < shaftLengthTiles - 0.5; d += 3.0) {
        const tip = getGroundScreenPos(d + 0.6, 0);
        const leftWing = getGroundScreenPos(d - 0.3, -halfWidthTiles * 0.55);
        const notch = getGroundScreenPos(d - 0.05, 0);
        const rightWing = getGroundScreenPos(d - 0.3, halfWidthTiles * 0.55);

        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(leftWing.x, leftWing.y);
        ctx.lineTo(notch.x, notch.y);
        ctx.lineTo(rightWing.x, rightWing.y);
        ctx.closePath();
        ctx.fill();
    }

    // 5. Arrowhead at tip (x2, y2)
    const pTip = { x: x2, y: y2 };
    const headWidthTiles = halfWidthTiles * 2.5;
    const pHeadBaseLeft = getGroundScreenPos(distTiles - headLengthTiles, -headWidthTiles / 2);
    const pHeadBaseRight = getGroundScreenPos(distTiles - headLengthTiles, headWidthTiles / 2);
    const pHeadNotch = getGroundScreenPos(distTiles - headLengthTiles * 0.65, 0);

    const headGrad = ctx.createLinearGradient(pHeadNotch.x, pHeadNotch.y, pTip.x, pTip.y);
    headGrad.addColorStop(0, "rgba(56, 189, 248, 0.5)");
    headGrad.addColorStop(1, "rgba(6, 182, 212, 0.9)");

    ctx.beginPath();
    ctx.moveTo(pTip.x, pTip.y);
    ctx.lineTo(pHeadBaseLeft.x, pHeadBaseLeft.y);
    ctx.lineTo(pHeadNotch.x, pHeadNotch.y);
    ctx.lineTo(pHeadBaseRight.x, pHeadBaseRight.y);
    ctx.closePath();
    ctx.fillStyle = headGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // 6. Backward Offset for Queen / Giant Arrow Icon (placed behind drop point x1, y1)
    const angle = Math.atan2(dy, dx);
    const offsetDist = 50;
    const iconX = x1 - Math.cos(angle) * offsetDist;
    const iconY = y1 - Math.sin(angle) * offsetDist;

    // Leader dashed connector line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(iconX, iconY);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();

    // 7. Drop Pin Indicator at (x1, y1)
    ctx.save();
    ctx.beginPath();
    ctx.arc(x1, y1, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x1, y1, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.restore();

    // 8. Render Archer Queen / Giant Arrow Icon
    let img = imageCache.get(el.src);
    if (!img) {
        img = new Image();
        img.onload = () => draw();
        img.src = el.src;
        imageCache.set(el.src, img);
    }

    const currentRadius = EQUIPMENT_ICON_SIZE;
    ctx.save();
    ctx.beginPath();
    ctx.arc(iconX, iconY, currentRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, iconX - currentRadius, iconY - currentRadius, currentRadius * 2, currentRadius * 2);
    } else {
        ctx.fillStyle = "#222d42";
        ctx.fillRect(iconX - currentRadius, iconY - currentRadius, currentRadius * 2, currentRadius * 2);
    }
    ctx.restore();

    // Icon border
    ctx.save();
    ctx.beginPath();
    ctx.arc(iconX, iconY, currentRadius, 0, Math.PI * 2);
    ctx.strokeStyle = isSelected ? "#00ffff" : "#ffffff";
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();

    // Deployment Order badge
    const badgeR = 11;
    const badgeX = iconX + currentRadius - 4;
    const badgeY = iconY + currentRadius - 4;

    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = "#f97316";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${el.orderNum > 9 ? badgeR * 0.85 : badgeR * 1.15}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(el.orderNum), badgeX, badgeY);

    // 9. Selection handles
    if (isSelected) {
        ctx.beginPath();
        ctx.arc(x1, y1, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x2, y2, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0055";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }
    ctx.restore();
}

function drawUnitIcon(el, isSelected) {
    let img = imageCache.get(el.src);

    if (!img) {
        img = new Image();
        img.onload = () => draw();
        img.src = el.src;
        imageCache.set(el.src, img);
    } else if (!img.complete) {
        img.onload = () => draw();
    }

    const folder = (el.folder || el.src || "").toLowerCase();
    const isSpell = folder.includes("spell");
    const isEquipment = folder.includes("equipment");
    let currentRadius = ICON_SIZE;
    if (isSpell) {
        currentRadius = SPELL_ICON_SIZE;
    } else if (isEquipment) {
        currentRadius = EQUIPMENT_ICON_SIZE;
    }

    const unitKey = (el.name || "").toLowerCase().trim();
    const spellConfig = SPELL_RADII[unitKey];

    const isDirectionalEquipment = unitKey.includes("rocket backpack") || unitKey.includes("rocket_backpack") ||
        unitKey.includes("flame blower") || unitKey.includes("flame_blower");

    let renderX = el.x;
    let renderY = el.y;

    if (isDirectionalEquipment) {
        const angle = Math.atan2(CANVAS_HEIGHT / 2 - el.y, CANVAS_WIDTH / 2 - el.x);
        const offsetDist = 50;
        renderX = el.x - Math.cos(angle) * offsetDist;
        renderY = el.y - Math.sin(angle) * offsetDist;

        if (unitKey.includes("rocket backpack") || unitKey.includes("rocket_backpack")) {
            drawRocketBackpackBeam(el.x, el.y);
        } else if (unitKey.includes("flame blower") || unitKey.includes("flame_blower")) {
            drawFlameBlowerCone(el.x, el.y);
        }

        // Leader dashed line
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(renderX, renderY);
        ctx.lineTo(el.x, el.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        // Drop pin at drop point
        ctx.beginPath();
        ctx.arc(el.x, el.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#f97316";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(el.x, el.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
    } else if (unitKey.includes("fireball") || unitKey.includes("fire_ball")) {
        renderX = el.x + 50;
        renderY = el.y - 50;

        const radiusX = (spellConfig ? spellConfig.radiusTiles : 6) * TILE_SCALE_X;
        const radiusY = (spellConfig ? spellConfig.radiusTiles : 6) * TILE_SCALE_Y;

        ctx.save();
        // 1. AoE Ground Ellipse
        ctx.beginPath();
        ctx.ellipse(el.x, el.y, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = spellConfig ? spellConfig.color : "rgba(249, 115, 22, 0.22)";
        ctx.fill();
        ctx.strokeStyle = spellConfig ? spellConfig.stroke : "rgba(249, 115, 22, 0.9)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Leader dashed connector
        ctx.beginPath();
        ctx.moveTo(renderX, renderY);
        ctx.lineTo(el.x, el.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 4]);
        ctx.stroke();

        // 3. Center Target Crosshair
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 1.8;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(el.x - 12, el.y);
        ctx.lineTo(el.x + 12, el.y);
        ctx.moveTo(el.x, el.y - 12);
        ctx.lineTo(el.x, el.y + 12);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(el.x, el.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#f97316";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(el.x, el.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
    } else if (spellConfig) {
        const radiusX = spellConfig.radiusTiles * TILE_SCALE_X;
        const radiusY = spellConfig.radiusTiles * TILE_SCALE_Y;

        ctx.save();
        ctx.beginPath();
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
    ctx.arc(renderX, renderY, currentRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, renderX - currentRadius, renderY - currentRadius, currentRadius * 2, currentRadius * 2);
    } else {
        ctx.fillStyle = "#222d42";
        ctx.fillRect(renderX - currentRadius, renderY - currentRadius, currentRadius * 2, currentRadius * 2);
    }
    ctx.restore();

    // Render icon border
    ctx.save();
    ctx.beginPath();
    ctx.arc(renderX, renderY, currentRadius, 0, Math.PI * 2);
    ctx.strokeStyle = isSelected ? "#00ffff" : "#ffffff";
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();

    // Deployment Order badge
    const badgeR = isSpell ? 8 : (isEquipment ? 11 : 12);
    const badgeX = renderX + currentRadius - (isSpell ? 2 : 4);
    const badgeY = renderY + currentRadius - (isSpell ? 2 : 4);

    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = "#f97316";
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

// --------------------------------------------------------------------------
// Hit-Testing / Element Selection Detection
// --------------------------------------------------------------------------

function isClickOnElement(coords, el) {
    if (el.type === Tools.ICON) {
        const folder = (el.folder || el.src || "").toLowerCase();
        const unitKey = (el.name || "").toLowerCase().trim();
        const isSpell = folder.includes("spell");
        const isEquipment = folder.includes("equipment");
        let radius = ICON_SIZE;
        if (isSpell) {
            radius = SPELL_ICON_SIZE;
        } else if (isEquipment) {
            radius = EQUIPMENT_ICON_SIZE;
        }

        // Backward-offset directional equipment
        if (unitKey.includes("rocket backpack") || unitKey.includes("rocket_backpack") ||
            unitKey.includes("flame blower") || unitKey.includes("flame_blower")) {
            const angle = Math.atan2(CANVAS_HEIGHT / 2 - el.y, CANVAS_WIDTH / 2 - el.x);
            const iconX = el.x - Math.cos(angle) * 50;
            const iconY = el.y - Math.sin(angle) * 50;
            if (Math.hypot(coords.x - iconX, coords.y - iconY) < (radius + 6)) return true;
            if (Math.hypot(coords.x - el.x, coords.y - el.y) < 22) return true;
            return false;
        }

        // Fireball offset
        if (unitKey.includes("fireball") || unitKey.includes("fire_ball")) {
            const iconX = el.x + 50;
            const iconY = el.y - 50;
            if (Math.hypot(coords.x - iconX, coords.y - iconY) < (radius + 6)) return true;
            if (Math.hypot(coords.x - el.x, coords.y - el.y) < 22) return true;
            return false;
        }

        return Math.hypot(coords.x - el.x, coords.y - el.y) < (radius + 6);
    }

    if (el.type === Tools.CIRCLE) {
        const rx = el.radius || (4 * TILE_SCALE_X);
        const ry = rx * ISO_Y_RATIO;
        const dx = coords.x - el.x;
        const dy = coords.y - el.y;
        return (Math.pow(dx / (rx + 10), 2) + Math.pow(dy / (ry + 10), 2)) <= 1;
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

    if (el.type === "giant_arrow") {
        const angle = Math.atan2(el.y2 - el.y1, el.x2 - el.x1);
        const iconX = el.x1 - Math.cos(angle) * 50;
        const iconY = el.y1 - Math.sin(angle) * 50;
        if (Math.hypot(coords.x - iconX, coords.y - iconY) < 36) return true;
        if (Math.hypot(coords.x - el.x1, coords.y - el.y1) < 26) return true;
        if (Math.hypot(coords.x - el.x2, coords.y - el.y2) < 26) return true;

        const dist = Math.hypot(el.x2 - el.x1, el.y2 - el.y1);
        const dx = coords.x - el.x1;
        const dy = coords.y - el.y1;
        const localX = dx * Math.cos(-angle) - dy * Math.sin(-angle);
        const localY = dx * Math.sin(-angle) + dy * Math.cos(-angle);
        const halfWidth = TILE_SCALE_X + 10;
        return localX >= 0 && localX <= dist && Math.abs(localY) <= halfWidth;
    }

    if (el.type === Tools.ARROW) {
        if (Math.hypot(coords.x - el.x1, coords.y - el.y1) < 26) return true;
        if (Math.hypot(coords.x - el.x2, coords.y - el.y2) < 26) return true;

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
