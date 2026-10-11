const complexities = {
    bubble: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
    },
    selection: {
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
    },
    insertion: {
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)"
    },
    merge: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)"
    },

    quick: {
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)"
    }

};
const algorithmTabs = document.querySelectorAll(".algorithm-tab");

let selectedAlgorithm = "bubble";
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
                `Comparing ${array[j]} and ${array[j + 1]}.`;

            await delay();
            if (id !== runId) return;

            if (!(await waitWhilePaused(id))) return;

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] =
                    [array[j + 1], array[j]];

                swaps++;
                totalSwaps++;
                swapped = true;
                swapsDisplay.textContent = swaps;

                renderBars(j, j + 1, n - i);
                explanation.textContent =
                    "The elements were in the wrong order. Swapping them.";

                await delay();
                if (id !== runId) return;
            }

            progressBar.style.width =
                `${(totalComparisons / (n * (n - 1) / 2)) * 100}%`;
        }

        renderBars(-1, -1, n - i - 1);

        if (!swapped) break;
    }

    if (id !== runId) return;

    finishSort(totalComparisons, totalSwaps);
}

async function selectionSort(id) {
    const n = array.length;
    let totalComparisons = 0;
    let totalSwaps = 0;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < n; j++) {
            if (!(await waitWhilePaused(id))) return;

            comparisons++;
            totalComparisons++;
            comparisonsDisplay.textContent = comparisons;

            renderBars(minIndex, j, i);
            explanation.textContent =
                `Looking for the smallest value. Current minimum: ${array[minIndex]}.`;

            await delay();
            if (id !== runId) return;

            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            if (!(await waitWhilePaused(id))) return;

            [array[i], array[minIndex]] =
                [array[minIndex], array[i]];

            swaps++;
            totalSwaps++;
            swapsDisplay.textContent = swaps;

            renderBars(i, minIndex, i);
            explanation.textContent =
                `Placed ${array[i]} into position ${i + 1}.`;

            await delay();
            if (id !== runId) return;
        }

        renderBars(-1, -1, i + 1);
    }

    if (id !== runId) return;

    finishSort(totalComparisons, totalSwaps);
}

async function insertionSort(id) {
    const n = array.length;
    let totalComparisons = 0;
    let totalSwaps = 0;

    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;

        while (j >= 0) {
            if (!(await waitWhilePaused(id))) return;

            comparisons++;
            totalComparisons++;
            comparisonsDisplay.textContent = comparisons;

            renderBars(j, j + 1, i);
            explanation.textContent =
                `Comparing ${array[j]} with ${key}.`;

            await delay();
            if (id !== runId) return;

            if (array[j] <= key) break;

            array[j + 1] = array[j];
            swaps++;
            totalSwaps++;
            swapsDisplay.textContent = swaps;

            renderBars(j, j + 1, i);
            explanation.textContent =
                `Moving ${array[j]} one position to the right.`;

            await delay();
            if (id !== runId) return;

            j--;
        }

        array[j + 1] = key;
        renderBars(-1, -1, i + 1);
    }

    if (id !== runId) return;

    finishSort(totalComparisons, totalSwaps);
}

async function mergeSort(id, left = 0, right = array.length - 1) {
    if (id !== runId) return false;
    if (left >= right) return true;

    const middle = Math.floor((left + right) / 2);

    const leftDone = await mergeSort(id, left, middle);
    if (!leftDone || id !== runId) return false;

    const rightDone = await mergeSort(id, middle + 1, right);
    if (!rightDone || id !== runId) return false;

    return await merge(id, left, middle, right);
}

async function merge(id, left, middle, right) {
    const leftPart = array.slice(left, middle + 1);
    const rightPart = array.slice(middle + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
        if (!(await waitWhilePaused(id))) return false;
        if (id !== runId) return false;

        comparisons++;
        comparisonsDisplay.textContent = comparisons;

        renderBars(k, k, 0);
        explanation.textContent =
            `Comparing ${leftPart[i]} and ${rightPart[j]} before merging.`;

        await delay();
        if (id !== runId) return false;

        if (!(await waitWhilePaused(id))) return false;
        if (id !== runId) return false;

        if (leftPart[i] <= rightPart[j]) {
            array[k] = leftPart[i];
            i++;
        } else {
            array[k] = rightPart[j];
            j++;
        }

        swaps++;
        swapsDisplay.textContent = swaps;
        renderBars(k, k, 0);

        explanation.textContent =
            `Placed ${array[k]} into position ${k + 1}.`;

        k++;

        await delay();
        if (id !== runId) return false;
    }

    while (i < leftPart.length) {
        if (!(await waitWhilePaused(id))) return false;
        if (id !== runId) return false;

        array[k] = leftPart[i];
        i++;
        swaps++;
        swapsDisplay.textContent = swaps;

        renderBars(k, k, 0);
        k++;

        await delay();
        if (id !== runId) return false;
    }

    while (j < rightPart.length) {
        if (!(await waitWhilePaused(id))) return false;
        if (id !== runId) return false;

        array[k] = rightPart[j];
        j++;
        swaps++;
        swapsDisplay.textContent = swaps;

        renderBars(k, k, 0);
        k++;

        await delay();
        if (id !== runId) return false;
    }

    explanation.textContent =
        `Merged the elements from position ${left + 1} to ${right + 1}.`;

    return true;
}

async function quickSort(id, low = 0, high = array.length - 1) {
    if (id !== runId) return false;

    if (low < high) {
        const pivotIndex = await partition(id, low, high);

        if (pivotIndex === false || id !== runId) return false;

        const leftDone = await quickSort(id, low, pivotIndex - 1);
        if (!leftDone || id !== runId) return false;

        const rightDone = await quickSort(id, pivotIndex + 1, high);
        if (!rightDone || id !== runId) return false;
    }

    return id === runId;
}

async function partition(id, low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (!(await waitWhilePaused(id))) return false;
        if (id !== runId) return false;

        comparisons++;
        comparisonsDisplay.textContent = comparisons;

        renderBars(j, high, 0);
        explanation.textContent =
            `Comparing ${array[j]} with pivot ${pivot}.`;

        await delay();
        if (id !== runId) return false;

        if (!(await waitWhilePaused(id))) return false;
        if (id !== runId) return false;

        if (array[j] < pivot) {
            i++;

            if (i !== j) {
                [array[i], array[j]] = [array[j], array[i]];
                swaps++;
                swapsDisplay.textContent = swaps;
            }

            renderBars(i, j, 0);
            await delay();
            if (id !== runId) return false;
        }
    }

    if (!(await waitWhilePaused(id))) return false;
    if (id !== runId) return false;

    if (i + 1 !== high) {
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        swaps++;
        swapsDisplay.textContent = swaps;
    }

    renderBars(i + 1, i + 1, 0);
    explanation.textContent = `Placed pivot ${pivot} in its correct position.`;

    await delay();
    if (id !== runId) return false;

    return i + 1;
}



function finishSort(totalComparisons, totalSwaps) {
    renderBars(-1, -1, 0);
    progressBar.style.width = "100%";
    statusDisplay.textContent = "Completed";
    explanation.textContent =
        `Sorting complete! ${totalComparisons} comparisons and ` +
        `${totalSwaps} moves/swaps were performed.`;

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


    if (selectedAlgorithm === "bubble") {
        await bubbleSort(id);
    } else if (selectedAlgorithm === "selection") {
        await selectionSort(id);
    } else if (selectedAlgorithm === "insertion") {
        await insertionSort(id);
    } else if (selectedAlgorithm === "merge") {
        const completed = await mergeSort(id);

        if (completed && id === runId) {
            finishSort(comparisons, swaps);
        }
    }

    else if (selectedAlgorithm === "quick") {
        const completed = await quickSort(id);

        if (completed && id === runId) {
            finishSort(comparisons, swaps);
        }
    }


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


algorithmTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        if (running) return;

        selectedAlgorithm = tab.dataset.algorithm;

        algorithmTabs.forEach(item => {
            item.classList.toggle("active", item === tab);
        });

        const names = {
            bubble: "Bubble Sort",
            selection: "Selection Sort",
            insertion: "Insertion Sort",
            merge: "Merge Sort"
        };

        document.querySelector(".panel-heading h3").textContent =
            names[selectedAlgorithm];

        // Update complexity information
        const complexity = complexities[selectedAlgorithm];

        document.getElementById("bestTime").textContent =
            complexity.best;

        document.getElementById("averageTime").textContent =
            complexity.average;

        document.getElementById("worstTime").textContent =
            complexity.worst;

        document.getElementById("spaceComplexity").textContent =
            complexity.space;

        generateArray();
    });
});

// Initial render.
generateArray();


const compareBtn = document.getElementById("compareBtn");
const comparisonPanel = document.getElementById("comparisonPanel");
const comparisonResults = document.getElementById("comparisonResults");

console.log("Comparison button:", compareBtn);
console.log("Comparison panel:", comparisonPanel);
console.log("Comparison results:", comparisonResults);


compareBtn.addEventListener("click", () => {
    if (running) {
        explanation.textContent =
            "Finish or reset the current animation before comparing algorithms.";
        return;
    }

    // Every algorithm receives the same starting values.
    const originalArray = [...array];
    const expected = [...originalArray].sort((a, b) => a - b);

    const algorithms = [
        {
            name: "Bubble Sort",
            sort: bubbleCompare
        },
        {
            name: "Selection Sort",
            sort: selectionCompare
        },
        {
            name: "Insertion Sort",
            sort: insertionCompare
        },
        {
            name: "Merge Sort",
            sort: mergeCompare
        },
        {
            name: "Quick Sort",
            sort: quickCompare
        }
    ];

    const results = algorithms.map(algorithm => {
        const data = [...originalArray];

        const startTime = performance.now();
        const metrics = algorithm.sort(data);
        const endTime = performance.now();

        return {
            name: algorithm.name,
            time: endTime - startTime,
            comparisons: metrics.comparisons,
            moves: metrics.moves,
            correct: data.every(
                (value, index) => value === expected[index]
            )
        };
    });

    comparisonResults.replaceChildren();

    results.forEach(result => {
        const row = document.createElement("tr");

        const values = [
            result.name,
            result.time.toFixed(4),
            result.comparisons,
            result.moves,
            result.correct ? "Yes" : "No"
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        comparisonResults.appendChild(row);
    });
    updatePerformanceCharts(results);
    comparisonPanel.hidden = false;
    comparisonPanel.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

function bubbleCompare(a) {
    let comparisons = 0;
    let moves = 0;

    for (let i = 0; i < a.length - 1; i++) {
        let changed = false;

        for (let j = 0; j < a.length - i - 1; j++) {
            comparisons++;

            if (a[j] > a[j + 1]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
                moves++;
                changed = true;
            }
        }

        if (!changed) break;
    }

    return { comparisons, moves };
}

function selectionCompare(a) {
    let comparisons = 0;
    let moves = 0;

    for (let i = 0; i < a.length - 1; i++) {
        let min = i;

        for (let j = i + 1; j < a.length; j++) {
            comparisons++;

            if (a[j] < a[min]) min = j;
        }

        if (min !== i) {
            [a[i], a[min]] = [a[min], a[i]];
            moves++;
        }
    }

    return { comparisons, moves };
}

function insertionCompare(a) {
    let comparisons = 0;
    let moves = 0;

    for (let i = 1; i < a.length; i++) {
        const key = a[i];
        let j = i - 1;

        while (j >= 0) {
            comparisons++;

            if (a[j] <= key) break;

            a[j + 1] = a[j];
            moves++;
            j--;
        }

        a[j + 1] = key;
        moves++;
    }

    return { comparisons, moves };
}

function mergeCompare(a) {
    let comparisons = 0;
    let moves = 0;

    function divide(left, right) {
        if (left >= right) return;

        const middle = Math.floor((left + right) / 2);

        divide(left, middle);
        divide(middle + 1, right);

        const first = a.slice(left, middle + 1);
        const second = a.slice(middle + 1, right + 1);

        let i = 0;
        let j = 0;
        let k = left;

        while (i < first.length && j < second.length) {
            comparisons++;

            if (first[i] <= second[j]) {
                a[k++] = first[i++];
            } else {
                a[k++] = second[j++];
            }

            moves++;
        }

        while (i < first.length) {
            a[k++] = first[i++];
            moves++;
        }

        while (j < second.length) {
            a[k++] = second[j++];
            moves++;
        }
    }

    divide(0, a.length - 1);
    return { comparisons, moves };
}

function quickCompare(a) {
    let comparisons = 0;
    let moves = 0;

    function partition(low, high) {
        const pivot = a[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            comparisons++;

            if (a[j] < pivot) {
                i++;

                if (i !== j) {
                    [a[i], a[j]] = [a[j], a[i]];
                    moves++;
                }
            }
        }

        if (i + 1 !== high) {
            [a[i + 1], a[high]] = [a[high], a[i + 1]];
            moves++;
        }

        return i + 1;
    }

    function divide(low, high) {
        if (low >= high) return;

        const pivotIndex = partition(low, high);
        divide(low, pivotIndex - 1);
        divide(pivotIndex + 1, high);
    }

    divide(0, a.length - 1);
    return { comparisons, moves };
    const comparisonResults =
        document.getElementById("comparisonResults");
}

let comparisonsChart;
let movesChart;

function updatePerformanceCharts(results) {
    const labels = results.map(result => result.name);
    const comparisons = results.map(result => result.comparisons);
    const moves = results.map(result => result.moves);

    if (comparisonsChart) comparisonsChart.destroy();
    if (movesChart) movesChart.destroy();

    comparisonsChart = new Chart(
        document.getElementById("comparisonsChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Element Comparisons",
                    data: comparisons
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        }
    );

    movesChart = new Chart(
        document.getElementById("movesChart"),
        {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Moves / Swaps",
                    data: moves
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        }
    );
}
