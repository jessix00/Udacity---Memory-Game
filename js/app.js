/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

//------------------custom code------------------------------------ 

let toggledCards = [];
let moves = 0;
const cards = document.querySelectorAll('.card');

//This funtion will track our moves/clicks
function addMove() {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
}

//this funtions will add stars next to moves
function checkScore() {
    if (moves === 10 || moves === 20) {
        hideStar();
    }
}

function hideStar() {
    const starList = document.querySelectorAll('.stars li');
    for (star of starList) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}



// //this funtion shuffles the deck -- Under construction---
// function shuffleDeck() {
//     const cardsToShuffle = Array.from(document.querySelectorAll('.card'));
//     const shuffledCards = shuffle(cardsToShuffle);
//     //    for (card of shuffledCards) {
//     //        cards.appendChild(card);
//     //    }
// }
// shuffleDeck();

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
        //sets timeout allows time to pass before fliping card over when there's no match
    } else {
        setTimeout(() => {
            toggleCard(toggledCards[0]);
            toggleCard(toggledCards[1]);
            toggledCards = [];
        }, 600);
    }
}

//This loop opens or closes clicked cards. 
for (card of cards) {
    card.addEventListener('click', event => {
        const clickTarget = event.target;
        if (clickTarget.classList.contains('card') &&
            !clickTarget.classList.contains('match') &&
            toggledCards.length < 2 &&
            !toggledCards.includes(clickTarget)) {
            toggleCard(clickTarget);
            addToggleCard(clickTarget);
            if (toggledCards.length === 2) {
                checkMatch(clickTarget);
                addMove();
                checkScore();
            }
        }
    })
};





/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */