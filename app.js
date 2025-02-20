// Game State
let gameState = {
    credits: 0,
    wallet: null,
    cpuLoad: 0,
    memoryUsage: 0,
    networkSpeed: 0,
    activeNodes: [],
    upgrades: {
        aiCore: 1,
        neuralAmplifier: 1,
        quantumAccelerator: 1
    }
};

// DOM Elements
const walletBtn = document.getElementById('walletBtn');
const creditsDisplay = document.getElementById('userCredits');
const cpuLoadDisplay = document.getElementById('cpuLoad');
const memoryDisplay = document.getElementById('memoryUsage');
const networkDisplay = document.getElementById('networkSpeed');

// Canvas Setup for each node
document.querySelectorAll('.node-canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initializeNodeVisuals(ctx, canvas.parentElement.dataset.type);
});

// Node Visualization
function initializeNodeVisuals(ctx, type) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    switch (type) {
        case 'data':
            drawDataNode(ctx, width, height);
            break;
        case 'quantum':
            drawQuantumNode(ctx, width, height);
            break;
        case 'neural':
            drawNeuralNode(ctx, width, height);
            break;
    }
}

function drawDataNode(ctx, width, height) {
    let particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 2 + 1
        });
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(p.x, p.y, p.size, p.size);
            p.y += p.speed;
            if (p.y > height) {
                p.y = 0;
                p.x = Math.random() * width;
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function drawQuantumNode(ctx, width, height) {
    let time = 0;

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < 8; i++) {
            const angle = (time + i * Math.PI / 4) % (Math.PI * 2);
            const x = centerX + Math.cos(angle) * 50;
            const y = centerY + Math.sin(angle) * 50;

            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${time * 50}, 100%, 50%)`;
            ctx.fill();
        }

        time += 0.02;
        requestAnimationFrame(animate);
    }
    animate();
}

function drawNeuralNode(ctx, width, height) {
    let nodes = [];
    for (let i = 0; i < 10; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            connections: []
        });
    }

    // Create connections
    nodes.forEach(node => {
        const connections = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < connections; i++) {
            const target = nodes[Math.floor(Math.random() * nodes.length)];
            if (target !== node) {
                node.connections.push(target);
            }
        }
    });

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);

        // Draw connections
        nodes.forEach(node => {
            node.connections.forEach(target => {
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = 'rgba(0, 255, 0, 0.2)';
                ctx.stroke();
            });
        });

        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#00ff00';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

// Wallet Connection
async function connectWallet() {
    try {
        if (!window.solana || !window.solana.isPhantom) {
            alert('Phantom wallet is not installed!');
            return;
        }

        const response = await window.solana.connect();
        gameState.wallet = response.publicKey.toString();
        walletBtn.textContent = gameState.wallet.slice(0, 4) + '...' + gameState.wallet.slice(-4);
        walletBtn.classList.add('connected');

        // Give initial credits
        updateCredits(1000);
    } catch (err) {
        console.error('Error connecting wallet:', err);
    }
}

// Mining Functions
function startMining(node) {
    if (!gameState.wallet) {
        alert('Please connect your wallet first!');
        return;
    }

    const miningTime = Math.random() * 3000 + 2000; // 2-5 seconds
    const reward = calculateReward(node);

    // Show hacking interface
    document.querySelector('.hacking-interface').classList.remove('hidden');

    // Simulate hacking progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        updateHackingProgress(progress);

        if (progress >= 100) {
            clearInterval(interval);
            completeMining(reward);
        }
    }, miningTime / 100);
}

function calculateReward(node) {
    const baseReward = {
        'data': 100,
        'quantum': 200,
        'neural': 300
    };

    const nodeType = node.dataset.type;
    const efficiency = parseInt(node.querySelector('.stat:first-child').textContent.match(/\d+/)[0]) / 100;

    return Math.floor(baseReward[nodeType] * efficiency * gameState.upgrades.aiCore);
}

function completeMining(reward) {
    updateCredits(reward);
    updateSystemStats();

    // Add terminal output
    const output = document.querySelector('.terminal-output');
    output.innerHTML += `<div>Hack successful! Earned ${reward} CC</div>`;
    output.scrollTop = output.scrollHeight;
}

// Update Functions
function updateCredits(amount) {
    gameState.credits += amount;
    creditsDisplay.textContent = gameState.credits;

    // Add floating number animation
    const floatingNumber = document.createElement('div');
    floatingNumber.className = 'floating-number';
    floatingNumber.textContent = `+${amount}`;
    creditsDisplay.parentElement.appendChild(floatingNumber);

    setTimeout(() => floatingNumber.remove(), 1000);
}

function updateSystemStats() {
    gameState.cpuLoad = Math.floor(Math.random() * 30) + 70;
    gameState.memoryUsage = Math.floor(Math.random() * 128) + 384;
    gameState.networkSpeed = Math.floor(Math.random() * 50) + 50;

    cpuLoadDisplay.textContent = `${gameState.cpuLoad}%`;
    memoryDisplay.textContent = `${gameState.memoryUsage}/512 TB`;
    networkDisplay.textContent = `${gameState.networkSpeed} Pb/s`;
}

// Event Listeners
walletBtn.addEventListener('click', connectWallet);

document.querySelectorAll('.hack-button').forEach(button => {
    button.addEventListener('click', () => {
        startMining(button.parentElement);
    });
});

// Initialize game
setInterval(updateSystemStats, 5000); // Update stats every 5 seconds