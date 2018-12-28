//Global Scope
const allCards = document.querySelector('.deck');
//This variable stores our fontAwesome icon classes that will later be passed to the HTML document
const cardClasses = ['fa-leaf', 'fa-leaf',
    'fa-bicycle', 'fa-bicycle',
    'fa-anchor', 'fa-anchor',
    'fa-bomb', 'fa-bomb',
    'fa-paper-plane-o', 'fa-paper-plane-o',
    'fa-cube', 'fa-cube',
    'fa-bolt', 'fa-bolt',
    'fa-diamond', 'fa-diamond',
];
const totalPossiblePairs = 8;
let toggledArray = [];
let totalMoves = 0;
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

//template used to generate cards on the document
function generateCard(clickedCard) {
    return `<li class="card"><i class="fa ${clickedCard}"></i></li>`;
}

//When init is called, the cards are shuffled and created programatically on to the HTML doc using
//the template provided in the generateCard function
function init() {
    const cardHTML = shuffle(cardClasses).map(function(clickedCard) {
        return generateCard(clickedCard);
    });

    allCards.innerHTML = cardHTML.join('');
}

init();

//This funtion toggles the class of open or show to clicked cards
function toggleCard(target) {
    target.classList.toggle('open');
    target.classList.toggle('show');
}

//this funtion pushes the clicked target into the toggled array
function addToggleCard(target) {
    toggledArray.push(target);
}

//this funtion checks whether or not a card is a match
function match() {
    if (
        toggledArray[0].firstElementChild.className ===
        toggledArray[1].firstElementChild.className
    ) {
        toggledArray[0].classList.toggle('match');
        toggledArray[1].classList.toggle('match');
        toggledArray = [];
        matched++;
        //sets timeout allows time to pass before fliping card over when there's no match
    } else {
        setTimeout(() => {
            toggleCard(toggledArray[0]);
            toggleCard(toggledArray[1]);
            toggledArray = [];
        }, 600);
    }
}

// //This function will start counting seconds and push its results to the displayTime function 
function startClock() {
    clockId = setInterval(() => {
        time++;
        displayTime();
    }, 1000);
};

//This function stops the clock
function stopClock() {
    clearInterval(clockId);
}

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

//This funtion will track moves/clicks
function addMove() {
    totalMoves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = totalMoves;
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

//tracks the amount of stars remaining for our modal stats. Will always leave one on document
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

//hides one star after 10 moves
function checkScore() {
    if (totalMoves === 10 || totalMoves === 20) {
        hideStar();
    }
}

//click event handler 
//flips cards depending on the following conditions
allCards.addEventListener('click', function(clickedCard) {
    const target = event.target;
    if (target.classList.contains('card') &&
        !target.classList.contains('match') &&
        toggledArray.length < 2 &&
        !toggledArray.includes(target)) {
        toggleCard(target);
        addToggleCard(target);
        //starts the clock as soon as the first click to a card is made
        if (clockOff) {
            startClock();
            clockOff = false;
        }
        //if the length of the clicked cards is equal to 2 then it executes the match function, addMove function and checkScore        
        if (toggledArray.length === 2) {
            match(target);
            addMove();
            checkScore();
        }
    }
    //when the matched is equal to total possible pairs the gameOver function is called which activates the modal    
    if (matched === totalPossiblePairs) {
        gameOver();
    }
});

//MODAL
//This funtion opens or hides our modal by toggling the css class of hide 
function toggleModal() {
    const modal = document.querySelector('.modal-background');
    modal.classList.toggle('hide');
}
toggleModal() // Open Modal
toggleModal() // Close Modal

//Takes the value of variables and writes them to the HTML document that contains selected class
function writeModalStats() {
    const timeStat = document.querySelector('.modalTimeCount');
    const clockTime = document.getElementById('clock').innerHTML;
    const movesStat = document.querySelector('.modalMovesCount');
    const starsStat = document.querySelector('.modalStarCount');
    const stars = getStars();
    movesStat.innerHTML = `${totalMoves} Moves`;
    starsStat.innerHTML = `${stars}`;
    timeStat.innerHTML = `${clockTime}`;
}

//reset & restart game functions
function resetGame() {
    resetClockAndTime();
    resetMoves();
    resetStars();
    resetCards();
    resetMatched();
    init();
    toggledArray = [];
}

//RESET / REPLAY
//Resets clock time
function resetClockAndTime() {
    stopClock();
    clockOff = true;
    time = 0;
    displayTime();
}

//Sets matched count to zero
function resetMatched() {
    matched = 0;
}

//Reset game moves
function resetMoves() {
    totalMoves = 0;
    document.querySelector('.moves').innerHTML = totalMoves;
}

//Reset star counter
function resetStars() {
    stars = 0;
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        star.style.display = 'inline';
    }
}

//Reset cards
function resetCards() {
    const cards = document.querySelectorAll('.deck li');
    for (card of cards) {
        card.className = 'card';
    }
}

shuffle(cardClasses)

//calls the resetGame function and opens the modal
function replayGame() {
    resetGame();
    toggleModal();
}

//Stops the clock, reshuffles all cards, writes our stats to modal, opens modal and resets the matched count
function gameOver() {
    stopClock();
    resetCards();
    writeModalStats();
    toggleModal();
    resetMatched();
}

//This resets the game if replay icon is clicked on game screen
document.querySelector('.modal-replay-btn').addEventListener('click', replayGame);
//This restarts the game if the play again button is clicked on the modal screen
document.querySelector('.restart').addEventListener('click', resetGame);