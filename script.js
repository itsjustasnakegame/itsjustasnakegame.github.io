const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
canvas.width = 20 * box;
canvas.height = 20 * box;

let snake = [{x: 9 * box, y: 10 * box}];
let direction;
const letters = "CENTROCOMERCIALELRECREO".split('');
let score = letters.length;

let collectedLetters = [];

// Inicialmente, la primera letra a recolectar es la primera en la secuencia
let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box,
    letter: letters.shift() // Toma la primera letra de la secuencia
};

const winImage = document.createElement("img");
winImage.id = "winImage";
winImage.src = "https://upload.wikimedia.org/wikipedia/commons/c/cc/El_Recreo_Shopping_Mall_in_Sabana_Grande.jpg"; // Reemplaza con la ruta de tu imagen
document.body.appendChild(winImage);

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "green" : "lightgreen";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(food.letter, food.x + 5, food.y + 20);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        collectedLetters.push(food.letter);
        updateCollectedLettersDisplay();

        if (letters.length > 0) {
            food = {
                x: Math.floor(Math.random() * 19) * box,
                y: Math.floor(Math.random() * 19) * box,
                letter: letters.shift() // Toma la siguiente letra en la secuencia
            };
            score--;
        } else {
            clearInterval(game);
            // Mostrar la imagen al ganar
            winImage.style.display = "block";
        }
    } else {
        snake.pop();
    }

    let newHead = {x: snakeX, y: snakeY};

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert("Fin del juego");
    }

    snake.unshift(newHead);
    document.getElementById("score").textContent = `Letras restantes: ${score}`;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function updateCollectedLettersDisplay() {
    const collectedLettersContainer = document.getElementById("collectedLetters");
    collectedLettersContainer.innerHTML = "";
    collectedLetters.forEach(letter => {
        const letterDiv = document.createElement("div");
        letterDiv.textContent = letter;
        collectedLettersContainer.appendChild(letterDiv);
    });
}

document.addEventListener("keydown", directionEvent);

function directionEvent(event) {
    let key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    if (key === 38 && direction !== "DOWN") direction = "UP";
    if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    if (key === 40 && direction !== "UP") direction = "DOWN";
}

document.getElementById("leftBtn").addEventListener("click", () => {
    if (direction !== "RIGHT") direction = "LEFT";
});

document.getElementById("upBtn").addEventListener("click", () => {
    if (direction !== "DOWN") direction = "UP";
});

document.getElementById("downBtn").addEventListener("click", () => {
    if (direction !== "UP") direction = "DOWN";
});

document.getElementById("rightBtn").addEventListener("click", () => {
    if (direction !== "LEFT") direction = "RIGHT";
});

let game = setInterval(drawGame, 200); // Velocidad reducida a 200ms