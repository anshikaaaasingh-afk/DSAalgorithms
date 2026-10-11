
const barsContainer = document.getElementById("bars");
const sizeInput = document.getElementById("size");
const speedInput = document.getElementById("speed");

const sizeValue = document.getElementById("sizeValue");
const comparisonsDisplay = document.getElementById("comparisons");
const swapsDisplay = document.getElementById("swaps");
const statusDisplay = document.getElementById("arrayStatus");
const explanation = document.getElementById("explanation");
const progressBar = document.getElementById("progressBar");

const generateBtn = document.getElementById("generateBtn");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

let array = [];
let running = false;
let paused = false;
let runId = 0;

let comparisons = 0;
let swaps = 0;

function generateArray() {
    // Cancel any existing animation.
    runId++;
    running = false;
    paused = false;

    const size = Number(sizeInput.value);

    array = Array.from(
        { length: size },
        () => Math.floor(Math.random() * 90) + 10
    );

    comparisons = 0;
    swaps = 0;

    comparisonsDisplay.textContent = "0";
    swapsDisplay.textContent = "0";
    statusDisplay.textContent = "Ready";
    explanation.textContent =
        "Press Start Sort to begin. Larger values move toward the right after each pass.";

    progressBar.style.width = "0%";

    sizeValue.textContent = size;
    renderBars();

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Ⅱ Pause";
    sizeInput.disabled = false;
    speedInput.disabled = false;
    generateBtn.disabled = false;
    resetBtn.disabled = false;
}

function renderBars(current = -1, next = -1, sortedFrom = array.length) {
    barsContainer.innerHTML = "";

    array.forEach((value, index) => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${(value / 100) * 100}%`;
        bar.title = `Value: ${value}`;

        if (index >= sortedFrom) {
            bar.classList.add("sorted");
        }

        if (index === current || index === next) {
            bar.classList.remove("sorted");
            bar.classList.add("comparing");
        }

        barsContainer.appendChild(bar);
    });
}

function delay() {
    // Higher speed value means a shorter delay.
    return new Promise(resolve =>
        setTimeout(resolve, 1100 - Number(speedInput.value) * 100)
    );
}

async function waitWhilePaused(id) {
    while (paused && id === runId) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return id === runId;
}

async function bubbleSort(id) {
    const n = array.length;
    let totalComparisons = 0;
    let totalSwaps = 0;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            if (!(await waitWhilePaused(id))) return;

            comparisons++;
            totalComparisons++;

            comparisonsDisplay.textContent = comparisons;

            renderBars(j, j + 1, n - i);

            explanation.textContent =
                `Comparing ${array[j]} and ${array[j + 1]}. ` +
                "The larger value should move to the right.";

            await delay();
            if (id !== runId) return;

            if (!(await waitWhilePaused(id))) return;

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];

                swaps++;
                totalSwaps++;
                swapped = true;

                swapsDisplay.textContent = swaps;

                renderBars(j, j + 1, n - i);

                explanation.textContent =
                    "The elements were in the wrong order, so we swapped them.";

                await delay();
                if (id !== runId) return;
            }

            progressBar.style.width =
                `${((totalComparisons / (n * (n - 1) / 2)) * 100)}%`;
        }

        // The largest remaining value is now in its final position.
        renderBars(-1, -1, n - i - 1);

        if (!swapped) break;
    }

    if (id !== runId) return;

    renderBars(-1, -1, 0);
    progressBar.style.width = "100%";
    statusDisplay.textContent = "Completed";
    explanation.textContent =
        `Sorting complete! ${totalComparisons} comparisons and ` +
        `${totalSwaps} swaps were performed.`;

    running = false;
    paused = false;

    startBtn.disabled = false;
    startBtn.textContent = "▶ Start Sort";
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Ⅱ Pause";

    sizeInput.disabled = false;
    generateBtn.disabled = false;
    resetBtn.disabled = false;
}

// Start or resume sorting.
startBtn.addEventListener("click", async () => {
    if (running && paused) {
        paused = false;
        pauseBtn.textContent = "Ⅱ Pause";
        statusDisplay.textContent = "Sorting";
        startBtn.disabled = true;
        return;
    }

    if (running) return;

    running = true;
    paused = false;

    const id = ++runId;

    startBtn.disabled = true;
    startBtn.textContent = "▶ Sorting...";
    pauseBtn.disabled = false;
    statusDisplay.textContent = "Sorting";

    sizeInput.disabled = true;
    generateBtn.disabled = true;
    resetBtn.disabled = true;

    await bubbleSort(id);
});

// Pause and resume.
pauseBtn.addEventListener("click", () => {
    if (!running) return;

    paused = !paused;

    if (paused) {
        pauseBtn.textContent = "▶ Resume";
        statusDisplay.textContent = "Paused";
        startBtn.disabled = false;
        startBtn.textContent = "▶ Resume";
    } else {
        pauseBtn.textContent = "Ⅱ Pause";
        statusDisplay.textContent = "Sorting";
        startBtn.disabled = true;
        startBtn.textContent = "▶ Sorting...";
    }
});

// Reset the array and all counters.
resetBtn.addEventListener("click", () => {
    generateArray();
});

// Create another random array.
generateBtn.addEventListener("click", () => {
    generateArray();
});

// Update the displayed size immediately.
sizeInput.addEventListener("input", () => {
    sizeValue.textContent = sizeInput.value;
    generateArray();
});

// Initial render.
generateArray();
