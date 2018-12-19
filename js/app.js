//Global Scope Variables & Conditions
const deck = document.querySelector('.deck');
const total_pairs = 8;
let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//This funtion shuffles our deck 
function shuffleDeck() {
    const cardsToShuffle = Array.from(document.querySelectorAll('.card'));
    const shuffledCards = shuffle(cardsToShuffle);
    for (card of shuffledCards) {
        deck.appendChild(card);
    }
}
shuffleDeck();

//This funtion toggles the class of open or show to clicked cards
function toggleCard(clickTarget) {
    clickTarget.classList.toggle('open');
    clickTarget.classList.toggle('show');
}

//this funtion pushes the clicked target into the toggledCards array
function addToggleCard(clickTarget) {
    toggledCards.push(clickTarget);
}

//this funtion checks whether or not a card is a match
function checkMatch() {
    if (
        toggledCards[0].firstElementChild.className ===
        toggledCards[1].firstElementChild.className
    ) {
        toggledCards[0].classList.toggle('match');
        toggledCards[1].classList.toggle('match');
        toggledCards = [];
        matched++;
        //sets timeout allows time to pass before fliping card over when there's no match
    } else {
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 600);
    }
}

// //This function will start counting seconds and push its results to the displayTime function 
function startClock() {
    let clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
};

//This funtions takes the seconds from the startClock funtion and displays is as minutes and seconds in the HTML document
function displayTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const clock = document.getElementById("clock");
    clock.innerHTML = time;
    if (seconds < 10) {
        clock.innerHTML = `${minutes}:0${seconds}`;
    } else {
        clock.innerHTML = `${minutes}:${seconds}`;
    }
}

//This function stops the clock
function stopClock() {
    clearInterval(clockId);
}

//This funtion will track moves/clicks
function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

//hides stars
function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

//hides one star after 10 moves
function checkScore() {
    if (moves === 10 || moves === 20) {
        hideStar();
    }
}

//tracks the amount of stars remaining for our modal stats
function getStars() {
    stars = document.querySelectorAll('.stars li');
    starCount = 0;
    for (star of stars) {
        if (star.style.display !== 'none') {
            starCount++;
        }
    }
    return starCount;
}

//MODAL////
//This funtion open or hides our modal by adding or removing the css class of hide 
function toggleModal() {
    const modal = document.querySelector('.modal-background');
    modal.classList.toggle('hide');
}
toggleModal() // Open Modal
toggleModal() // Close Modal

//Takes the value of variables and writes them to the HTML document that contains selected class
function writeModalStats() {
    const movesStat = document.querySelector('.modal-moves-count');
    const starsStat = document.querySelector('.modal-star-count');
    const stars = getStars();
    movesStat.innerHTML = `${moves} Moves`;
    starsStat.innerHTML = `${stars}`;
}

//click event handler 
deck.addEventListener('click', function() {
    const clickTarget = event.target;
    if (clickTarget.classList.contains('card') &&
        !clickTarget.classList.contains('match') &&
        toggledCards.length < 2 &&
        !toggledCards.includes(clickTarget)) {
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        if (clockOff) {
            startClock();
            clockOff = false;

        }
        if (toggledCards.length === 2) {
            checkMatch(clickTarget);
            addMove();
            checkScore();
        }
    }
});


document.querySelector('.modal-replay-btn').addEventListener('click', replayGame);
document.querySelector('.restart').addEventListener('click', resetGame);

//reset/restart game functions
function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    shuffleDeck();
    resetCards();
}

//Resets clock time
function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
} //TODO: fix clock reset. it keeps counting after reset buttons are clicked.

//Reset game moves
function resetMoves() {
    moves = 0;
    document.querySelector('.moves').innerHTML = moves;
}

//Reset star counter
function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

//Reset reset card
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (let card of cards) {
        card.className = 'card';
    }
}

if (matched === total_pairs) {
    gameOver();
}

function gameOver() {
    stopClock();
    toggleModal();
    writeModalStats();
}

function replayGame() {
    resetGame();
    toggleModal();
}