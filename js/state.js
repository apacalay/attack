// ==========================================================================
// APPLICATION STATE & HISTORY MANAGEMENT
// ==========================================================================

// Canvas & Rendering Context
let canvas = null;
let ctx = null;

// Base Image & Alignment State
let bgImage = null;
let bgX = 0;
let bgY = 0;
let bgScale = 1;
let initialBgScale = 1.0;
let isAlignMode = false;
let isLocked = false;
let showMarkerOverlay = false;
let alignControlTarget = "image"; // "image" or "view" to toggle gesture target during alignment

// Drawing & Tool State
let currentTool = Tools.SELECT;
let currentColor = "#3b82f6"; // default royal blue
let currentWidth = 2; // default thin/medium stroke (4px)
let currentTextSize = 32;

// Elements & History Stacks
let elements = [];
let undoStack = [];
let redoStack = [];

// Drag & Drawing Active Flags
let isDrawing = false;
let isDraggingBg = false;
let dragStartX = 0;
let dragStartY = 0;

// Arrow, Brush & Circle temporary previews
let arrowPreview = null;
let brushPreview = null;
let circlePreview = null;
let giantArrowPreview = null;

// Viewport zoom & pan state
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

// Placement Counter for Attack Order Numbering
let deploymentOrder = 1;

// Image Cache & Preloaded Images
const imageCache = new Map();

const markerImage = new Image();
markerImage.src = "marker.webp";

const splashImage = new Image();
splashImage.onload = () => {
    if (canvas && ctx && typeof draw === "function") draw();
};
splashImage.src = ASSETS_BASE_URL + "/attack_planner.webp";

// --------------------------------------------------------------------------
// History (Undo / Redo / Clear) Functions
// --------------------------------------------------------------------------

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
    if (undoStack.length <= 1) return; // Keep initial state

    const currentState = undoStack.pop();
    redoStack.push(currentState);

    const previousState = undoStack[undoStack.length - 1];
    elements = JSON.parse(previousState);

    recalculateDeploymentOrder();
    selectedElement = null;
    if (typeof draw === "function") draw();
}

function redo() {
    if (redoStack.length === 0) return;

    const nextState = redoStack.pop();
    undoStack.push(nextState);
    elements = JSON.parse(nextState);

    recalculateDeploymentOrder();
    selectedElement = null;
    if (typeof draw === "function") draw();
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

    if (confirm("Clear all tactical drawings and unit placements on the canvas?")) {
        elements = [];
        deploymentOrder = 1;
        selectedElement = null;
        saveState();
        if (typeof draw === "function") draw();
    }
}
