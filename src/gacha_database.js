// Support Gacha Target Calculator - Database Version

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('target-form');
    const cardSelect = document.getElementById('card-select');
    const resultDiv = document.getElementById('target-result');
    let gachaRates = [];

    // Reroll counter/history elements
    const rerollBtn = document.getElementById('reroll-increment');
    const rerollCountSpan = document.getElementById('reroll-count');
    const totalSsrCountSpan = document.getElementById('total-ssr-count');
    const rerollCardsContainer = document.getElementById('reroll-cards-container');
    const ssrButtonsGrid = document.getElementById('ssr-buttons-grid');
    const resetAllBtn = document.getElementById('reset-all-btn');

    // API base URL - Express.js server runs on port 3000
    const API_BASE_URL = 'http://localhost:3000/api';

    // Load reroll history from localStorage
    let rerollHistory = [];
    try {
        rerollHistory = JSON.parse(localStorage.getItem('rerollHistory') || '[]');
        if (!Array.isArray(rerollHistory)) rerollHistory = [];
    } catch {
        rerollHistory = [];
    }

    function saveHistory() {
        localStorage.setItem('rerollHistory', JSON.stringify(rerollHistory));
    }

    // ... existing code for saveRerollHistoryToLog, createLogFile, etc. ...
    // (keeping the same functions from original gacha.js)

    function resetAllCounters() {
        if (rerollHistory.length > 0) {
            const currentReroll = rerollHistory[rerollHistory.length - 1];
            currentReroll.ssrCounts = {};
            saveHistory();
            updateRerollDisplay();
            updateResultDisplay();
        }
    }

    function updateRerollDisplay() {
        const rerollCount = rerollHistory.length;
        const totalSsrCount = rerollHistory.reduce((total, entry) => {
            return total + Object.values(entry.ssrCounts || {}).reduce((sum, count) => sum + count, 0);
        }, 0);

        rerollCountSpan.textContent = rerollCount;
        totalSsrCountSpan.textContent = totalSsrCount;
        renderHistoryCards();
        updateSsrButtons();
    }

    function updateSsrButtons() {
        // Get current reroll's counts (most recent entry)
        const currentReroll = rerollHistory.length > 0 ? rerollHistory[rerollHistory.length - 1] : null;
        const currentCounts = currentReroll ? currentReroll.ssrCounts || {} : {};

        // Update button counts to show current reroll only
        document.querySelectorAll('.ssr-card-button').forEach(button => {
            const cardName = button.getAttribute('data-card-name');
            const countSpan = button.querySelector('.card-count');
            const count = currentCounts[cardName] || 0;
            countSpan.textContent = count;
        });
    }

    function renderHistoryCards() {
        rerollCardsContainer.innerHTML = '';
        if (rerollHistory.length === 0) {
            return;
        }

        // Only show the latest 10 rerolls
        const latestRerolls = rerollHistory.slice(-5);

        latestRerolls.forEach((entry, idx) => {
            const card = document.createElement('div');
            card.className = 'reroll-card';

            // Calculate total SSR count for this reroll
            const rerollSsrCount = Object.values(entry.ssrCounts || {}).reduce((sum, count) => sum + count, 0);

            // Create SSR breakdown text
            const ssrBreakdown = Object.entries(entry.ssrCounts || {})
                .filter(([_, count]) => count > 0)
                .map(([name, count]) => `${name}: ${count}`)
                .join(', ');

            // Calculate the actual index in the full rerollHistory array
            const actualIndex = rerollHistory.length - latestRerolls.length + idx;

            // Only show save button for the latest reroll
            const isLatestReroll = idx === latestRerolls.length - 1;
            const saveButton = isLatestReroll ? `
                <button class="save-card-btn" data-reroll-index="${actualIndex}" style="background: #78CA0B; color: white; border: none; border-radius: 4px; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-left: 12px;">
                    <img src="buttons/download.svg" alt="Download" style="width: 16px; height: 16px; filter: brightness(0) invert(1);">
                </button>
            ` : '';

            card.innerHTML = `
                <div class="reroll-card-header">
                    <span class="reroll-card-number">#${actualIndex + 1}</span>
                    <span class="reroll-card-timestamp">${entry.timestamp || 'timestamp here'}</span>
                </div>
                <div class="reroll-card-value">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <div class="ssr-total">SSR: ${rerollSsrCount}</div>
                            <div class="ssr-breakdown">${ssrBreakdown || 'None'}</div>
                        </div>
                        ${saveButton}
                    </div>
                </div>
            `;

            // Add click handler for the save button only if it's the latest reroll
            if (isLatestReroll) {
                const saveBtn = card.querySelector('.save-card-btn');
                saveBtn.addEventListener('click', () => saveSingleCardAsImage(actualIndex, rerollHistory[actualIndex]));
            }

            rerollCardsContainer.appendChild(card);
        });
    }

    // ... existing saveSingleCardAsImage and saveCardWithID functions ...
    // (keeping the same functions from original gacha.js)

    function createSsrButtons() {
        ssrButtonsGrid.innerHTML = '';

        // Group SSR cards by type
        const ssrCards = gachaRates.filter(card => card.rarity === 'SSR');
        const groupedCards = {};

        ssrCards.forEach(card => {
            if (!groupedCards[card.type]) {
                groupedCards[card.type] = [];
            }
            groupedCards[card.type].push(card);
        });

        // Define the order of sections, with Friend last
        const sectionOrder = ['Speed', 'Stamina', 'Power', 'Guts', 'Wits', 'Friend'];

        // Map section names to their SVG icons
        const sectionIcons = {
            'Speed': 'stats/border/Speed.svg',
            'Stamina': 'stats/border/Stamina.svg',
            'Power': 'stats/border/Power.svg',
            'Guts': 'stats/border/Guts.svg',
            'Wits': 'stats/border/Wits.svg',
            'Friend': 'stats/border/Friend.svg'
        };

        sectionOrder.forEach(sectionName => {
            if (groupedCards[sectionName]) {
                const cards = groupedCards[sectionName];
                const sectionHeader = document.createElement('div');
                sectionHeader.className = 'ssr-section-header';
                sectionHeader.innerHTML = `
                    <img src="${sectionIcons[sectionName]}" alt="${sectionName}" style="width: 20px; height: 20px; margin-right: 8px; vertical-align: middle;">
                    <span>${sectionName}</span>
                `;
                ssrButtonsGrid.appendChild(sectionHeader);

                const sectionGrid = document.createElement('div');
                sectionGrid.className = 'ssr-section-grid';

                cards.forEach(card => {
                    const button = document.createElement('button');
                    button.className = 'ssr-card-button';
                    button.setAttribute('data-card-name', card.name);
                    button.innerHTML = `
                    <div class="card-name">${card.name}</div>
                    <img src="${card.image}" alt="${card.name}" />
                    <div class="card-count">0</div>
                    <button class="reset-button" title="Reset counter for this reroll">×</button>
                `;

                    // Main card click to increment
                    button.addEventListener('click', (e) => {
                        // Don't trigger if clicking the reset button
                        if (e.target.classList.contains('reset-button')) {
                            return;
                        }

                        if (rerollHistory.length > 0) {
                            const currentReroll = rerollHistory[rerollHistory.length - 1];
                            if (!currentReroll.ssrCounts) currentReroll.ssrCounts = {};
                            currentReroll.ssrCounts[card.name] = (currentReroll.ssrCounts[card.name] || 0) + 1;
                            saveHistory();
                            updateRerollDisplay();
                            updateResultDisplay();
                        } else {
                            // No active reroll - show feedback
                            alert('Please click "+1 Reroll" to start tracking SSR cards');
                        }
                    });

                    // Reset button click
                    const resetButton = button.querySelector('.reset-button');
                    resetButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent triggering the main button click

                        if (rerollHistory.length > 0) {
                            const currentReroll = rerollHistory[rerollHistory.length - 1];
                            if (currentReroll.ssrCounts && currentReroll.ssrCounts[card.name] > 0) {
                                currentReroll.ssrCounts[card.name] = 0;
                                saveHistory();
                                updateRerollDisplay();
                                updateResultDisplay();
                            }
                        }
                    });

                    sectionGrid.appendChild(button);
                });

                ssrButtonsGrid.appendChild(sectionGrid);
            }
        });
    }

    if (rerollBtn) {
        rerollBtn.addEventListener('click', () => {
            // Check if we're about to exceed the 5 reroll limit
            if (rerollHistory.length >= 5) {
                // Save the last 5 rerolls to log before clearing
                saveRerollHistoryToLog();

                // Clear all history and start fresh with the new reroll
                rerollHistory = [{
                    ssrCounts: {},
                    timestamp: new Date().toLocaleTimeString()
                }];
            } else {
                // Add new reroll to existing history
                rerollHistory.push({
                    ssrCounts: {},
                    timestamp: new Date().toLocaleTimeString()
                });
            }
            saveHistory();
            updateRerollDisplay();
            updateResultDisplay();
        });
    }

    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', resetAllCounters);
    }

    function getRerollCount() {
        return rerollHistory.length;
    }
    
    function getCardCount(cardName) {
        // Get count for the current reroll only (latest entry)
        if (rerollHistory.length > 0) {
            const currentReroll = rerollHistory[rerollHistory.length - 1];
            return currentReroll.ssrCounts?.[cardName] || 0;
        }
        return 0;
    }

    function updateResultDisplay() {
        // Use current form values
        const cardName = cardSelect.value;
        const copies = parseInt(document.getElementById('copies').value, 10);
        const probability = parseFloat(document.getElementById('probability').value) / 100;
        const card = gachaRates.find(c => c.name === cardName);
        if (!card) {
            resultDiv.textContent = 'Card not found.';
            return;
        }
        const rate = card.rate / 100; // Convert percent to probability
        if (rate <= 0) {
            resultDiv.textContent = 'Invalid card rate.';
            return;
        }

        // Get count for the currently selected card
        const selectedCardCount = getCardCount(cardName);

        // Each reroll gives 11 ten-pulls (110 total pulls)
        const pullsPerReroll = 110;

        // Probability of getting exactly k copies in one reroll (110 pulls)
        const probabilityInOneReroll = probabilityOfExactK(copies, pullsPerReroll, rate);
        const probabilityAtLeastK = probabilityOfAtLeastK(copies, pullsPerReroll, rate);

        // Expected copies per reroll
        const expectedCopiesPerReroll = rate * pullsPerReroll;

        // Probability-based calculation for independent rerolls
        const rerollsForProb = minRerollsForProbability(copies, rate, probability, pullsPerReroll);
        const pullsForProb = rerollsForProb * pullsPerReroll;

        resultDiv.innerHTML = `
            <b>${card.name}</b> (${card.rarity}, <b>${card.rate.toFixed(4)}%</b>)<br>
            Rate per pull: <b>${rate.toFixed(6)}</b> (independent per pull)<br>
            <hr>
            <b>Current Status:</b><br>
            <span style="color:#E91E63;">${card.name} obtained: <b>${selectedCardCount}</b></span><br>
            <hr>
            <b>Single Reroll Probability:</b><br>
            Probability of getting exactly <b>${copies}</b> copy/copies in one reroll (110 pulls): <b>${(probabilityInOneReroll * 100).toFixed(4)}%</b><br>
            Probability of getting at least <b>${copies}</b> copy/copies in one reroll: <b>${(probabilityAtLeastK * 100).toFixed(4)}%</b><br>
            Expected copies per reroll: <b>${expectedCopiesPerReroll.toFixed(3)}</b><br>
            <hr>
            <b>Probability Calculation:</b><br>
            To have at least <b>${(probability * 100).toFixed(3)}%</b> chance of getting <b>${copies}</b> copy/copies:<br>
            <span style="color:#388e3c;">You need <b>${rerollsForProb}</b> rerolls (${pullsForProb} total pulls)</span>
        `;
    }

    // Also update result when form values change
    form.addEventListener('input', updateResultDisplay);
    cardSelect.addEventListener('change', updateResultDisplay);

    // Initial display
    updateRerollDisplay();

    // Load the data from API and populate dropdown
    async function loadCardsFromAPI() {
        try {
            const response = await fetch(`${API_BASE_URL}/cards`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            gachaRates = await response.json();
            populateDropdown();
            createSsrButtons();
            updateRerollDisplay();
            updateResultDisplay();
        } catch (error) {
            console.error('Error loading cards from API:', error);
            // Fallback to JSON file if API is not available
            fetch('support_gacha_rates.json')
                .then(response => response.json())
                .then(data => {
                    gachaRates = data;
                    populateDropdown();
                    createSsrButtons();
                    updateRerollDisplay();
                    updateResultDisplay();
                });
        }
    }

    function updateCardDisplay() {
        const selectedCard = cardSelect.value;
        const card = gachaRates.find(c => c.name === selectedCard);
        const cardImage = document.querySelector('.card-image');

        if (card && cardImage) {
            cardImage.src = card.image;
            cardImage.alt = `${card.name} SSR`;
        }
    }

    function populateDropdown() {
        gachaRates.forEach(card => {
            const option = document.createElement('option');
            option.value = card.name;
            option.textContent = `${card.name} (${card.rarity}, ${card.rate}%)`;
            cardSelect.appendChild(option);
        });

        // Load saved card selection
        const savedCard = localStorage.getItem('selectedCard');
        if (savedCard) {
            cardSelect.value = savedCard;
        }

        // Update the card display
        updateCardDisplay();
    }

    // Save card selection when changed
    cardSelect.addEventListener('change', function () {
        localStorage.setItem('selectedCard', this.value);
        updateResultDisplay();
        updateCardDisplay();
    });

    // Poisson CDF: sum_{i=0}^{k-1} (e^{-lambda} * lambda^i / i!)
    function poissonCdf(k, lambda) {
        let sum = 0;
        let factorial = 1;
        for (let i = 0; i < k; i++) {
            if (i > 0) factorial *= i;
            sum += Math.exp(-lambda) * Math.pow(lambda, i) / factorial;
        }
        return sum;
    }

    // Find minimum rerolls such that P(X >= copies) >= prob, using Poisson approximation for independent rerolls
    function minRerollsForProbability(copies, rate, prob, pullsPerReroll) {
        let rerolls = Math.ceil(copies / (rate * pullsPerReroll)); // start with expected value
        while (true) {
            const totalPulls = rerolls * pullsPerReroll;
            const lambda = totalPulls * rate;
            const p = 1 - poissonCdf(copies, lambda);
            if (p >= prob) return rerolls;
            rerolls++;
            // To avoid infinite loop, break at some huge n
            if (rerolls > 1e6) break;
        }
        return NaN;
    }

    // Calculate probability of getting exactly k copies in n pulls (Poisson PMF)
    function probabilityOfExactK(k, n, rate) {
        const lambda = n * rate;
        const factorial = k === 0 ? 1 : Array.from({ length: k }, (_, i) => i + 1).reduce((a, b) => a * b, 1);
        return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial;
    }

    // Calculate probability of getting at least k copies in n pulls
    function probabilityOfAtLeastK(k, n, rate) {
        const lambda = n * rate;
        return 1 - poissonCdf(k, lambda);
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        updateResultDisplay();
    });

    // Load data from API
    loadCardsFromAPI();
}); 