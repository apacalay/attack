// ==========================================================================
// MAIN ENTRYPOINT & LIFECYCLE
// ==========================================================================

window.addEventListener("DOMContentLoaded", () => {
    initCanvas();
    initUI();
    setupEventListeners();
    saveState(); // Save initial empty state for undo stack
    draw();      // Render initial background / splash
    setupRotationAndFullscreen();
});
