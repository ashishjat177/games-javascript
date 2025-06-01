//BOARD (n*n)
// snake : Object {start: end}
// ladder: Object {start: end}
// players: Array [1,2, ... n]
// currentPlayer : int (index of players)

const SIZE = 10;
const WIN_POSITION = SIZE*SIZE;
const TOTAL_PLAYER = 2;
const SNAKE = {
    32: 2,
    99: 15,
    49: 11,
    95: 25,
    86: 66,
}

const LADDER = {
    4: 14,
    21: 33,
    63: 82,
    1: 18,
    42: 55,
}

const NO_OF_DICE = 1;

const positions = {}

const predefinedColors = ['blue', 'yellow', 'purple', 'orange']; // Cycle through predefined colors

function getRandomColor(index) {
    return predefinedColors[index % predefinedColors.length];
}

const players = Array.from({length: TOTAL_PLAYER}, (_, index) => ({name: index, color: getRandomColor(index)}));
let winner = null;
let currentPlayer = 0;


function setStyle(element, styles) {
    for(let key in styles) {
        element.style[key] = styles[key];
    }
}

function createBoard(n) {
    const totalSize = n*n;
    const mainContainer = document.getElementById('board');

    setStyle(mainContainer, {
        gridTemplateColumns: `repeat(${n}, 50px)`,
        gridTemplateRows: `repeat(${n}, 50px)`,
        width: `${50*n}px`,
        height: `${50*n}px`,
    })

    for(let i = totalSize; i > 0; i--) {
        const box = document.createElement('div');
        box.className = 'box'
        box.id = `box-${i}`
        box.innerText = i;

        // update the position of snake
        if(i in SNAKE) {
            box.style.background = 'red';
            box.innerText += ' 🐍';
        } 
        if(i in LADDER) {
            box.style.background = 'lightblue';
            box.innerText += ' 🪜';
        }

        if(i === totalSize) {
            box.style.background = 'green';
        }

        mainContainer.append(box);
    }
}


function setCurrentPlayerBackground(oldId, id, color) {
    const oldBox = document.getElementById(`box-${oldId}`);
    const currentBox = document.getElementById(`box-${id}`);

    if(oldBox) {
        oldBox.style.background = '';
    }
    currentBox.style.background = color;
}



function showDiceAnimation(diceNumber) {
    const diceElem = document.createElement('div');
    diceElem.className = 'dice-animation';
    diceElem.innerText = `🎲 ${diceNumber}`;
    document.body.appendChild(diceElem);

    setTimeout(() => {
        diceElem.remove();
    }, 1000);
}

function roleADice() {
    const diceNumber = Math.floor(Math.random() * (6 * NO_OF_DICE) + 1);
    showDiceAnimation(diceNumber);
    return diceNumber;
}

function movePlayer(diceNumber) {
    let newPosition = positions[currentPlayer] + diceNumber;

    if (newPosition > WIN_POSITION) {
        console.log('Dice roll exceeds winning position. Player stays at current position.');
        return;
    }

    setCurrentPlayerBackground(positions[currentPlayer], newPosition, players[currentPlayer].color);
    positions[currentPlayer] = newPosition;


    if(positions[currentPlayer] in SNAKE) {
        console.log('found snake from', positions[currentPlayer], SNAKE[positions[currentPlayer]]);
        newPosition = SNAKE[positions[currentPlayer]];
    } 
    else if(positions[currentPlayer] in LADDER) {
        console.log('found ladder from', positions[currentPlayer], LADDER[positions[currentPlayer]]);
        newPosition = LADDER[positions[currentPlayer]];   
    } 
    else if(positions[currentPlayer] === WIN_POSITION) {
        const winnerElem = document.getElementById('winner');
        winnerElem.innerText = currentPlayer;
       const startBtn = document.querySelector('.start-btn');

       setStyle(startBtn, {
            pointerEvents: 'none',
            background: 'gray',
            cursor: 'default'
        });
    }

    setCurrentPlayerBackground(positions[currentPlayer], newPosition, players[currentPlayer].color);

    positions[currentPlayer] = newPosition;

    console.log(players[currentPlayer].name, positions[currentPlayer]);
}

function logPlayerPositions() {
    console.table(players.map(player => ({
        name: player.name,
        position: positions[player.name]
    })));
}

let nextPlayerInterval = null;


function reset() {
    players.forEach((item) => {
        positions[item.name] = 0;
    });

    clearInterval(nextPlayerInterval);

    const startBtn = document.querySelector('.start-btn');
    setStyle(startBtn, {
        pointerEvents: 'visible',
        background: 'green',
        cursor: 'pointer'
    });

    winner = null;
    currentPlayer = players[0].name;
    document.getElementById('currentPlayer').innerText = currentPlayer;
}

// Update play function to include logging
function play() {
    if (winner !== null) {
        clearInterval(nextPlayerInterval);
        return;
    }

    const diceNumber = roleADice();
    movePlayer(diceNumber);
    logPlayerPositions();

    currentPlayer = (currentPlayer + 1) % players.length;
    const cp = document.getElementById('currentPlayer');
    cp.innerText = `${players[currentPlayer].name} at ${positions[currentPlayer]}`;
}

function startAutoGame() {
    nextPlayerInterval = setInterval(() => {
        play();
    }, 500);
}


// Add game instructions
function showInstructions() {
    const instructions = `
        Welcome to Snake and Ladder!
        - Roll the dice to move your player.
        - Avoid snakes and climb ladders.
        - First player to reach position ${WIN_POSITION} wins!
    `;
    alert(instructions);
}

// Call showInstructions during initialization
function init() {
    showInstructions();
    createBoard(SIZE);
    reset();
}

init();